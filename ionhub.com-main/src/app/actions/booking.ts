'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { generateBookingReference } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { PricingType, PaymentStatus, SubscriptionPlanSlug } from '@/types/database';

export interface BookingSubmissionPayload {
  serviceId: string;
  selectedItems: string[];
  addressId?: string;
  newAddress?: {
    label: string;
    addressLine: string;
    area: string;
    landmark?: string;
    pincode: string;
  };
  bookingDate: string;
  timeSlot: string;
  customerNotes?: string;
  guestDetails?: {
    fullName: string;
    phone: string;
    email: string;
  };

  // Ironing Pricing & Subscription Options
  pricingType?: PricingType;
  pairsCount?: number;
  garmentsCount?: number;
  applyRewardId?: string | null;
  subscriptionPlanSlug?: SubscriptionPlanSlug | null; // If activating a new plan
}

export async function submitBookingAction(payload: BookingSubmissionPayload) {
  try {
    let user = await getCurrentUser();

    // If guest provided details and not logged in, find or create profile
    if (!user && payload.guestDetails) {
      const email = payload.guestDetails.email.toLowerCase().trim();
      let profile = await db.getProfileByEmail(email);
      if (!profile) {
        profile = await db.createProfile({
          id: `p-${Date.now()}`,
          auth_user_id: `guest-${Date.now()}`,
          full_name: payload.guestDetails.fullName.trim(),
          phone: payload.guestDetails.phone.trim(),
          email,
          role: 'customer',
          avatar_url: null,
        });
      }
      user = profile;
    }

    if (!user) {
      return { error: 'Please log in or provide your details to book a service.' };
    }

    // 1. Validate service
    const service = await db.getServiceById(payload.serviceId);
    if (!service || !service.is_active) {
      return { error: 'The selected service is currently unavailable.' };
    }

    const isIroning =
      service.id === 's2222222-2222-2222-2222-222222222222' || service.slug === 'ironing';

    // 2. Validate date (cannot be past date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(payload.bookingDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      return { error: 'Please select a valid upcoming date.' };
    }

    // 3. Validate time slot
    const slots = await db.getTimeSlots();
    const slotExists = slots.find((s) => s.slot_time === payload.timeSlot && s.is_active);
    if (!slotExists) {
      return { error: 'The chosen time slot is unavailable.' };
    }

    // 4. Resolve address
    let addressId = payload.addressId;
    if (!addressId && payload.newAddress) {
      const allowedAreas = await db.getServiceAreas();
      const match = allowedAreas.some(
        (a) => a.is_active && a.area_name.toLowerCase() === payload.newAddress!.area.toLowerCase()
      );

      if (!match) {
        return {
          error: `Currently, ION HUB doorstep service is available in Kompally. We are expanding soon!`,
        };
      }

      const createdAddr = await db.createAddress({
        user_id: user.id,
        label: payload.newAddress.label || 'Home',
        address_line: payload.newAddress.addressLine,
        area: payload.newAddress.area,
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: payload.newAddress.pincode || '500100',
        landmark: payload.newAddress.landmark || null,
        latitude: null,
        longitude: null,
      });
      addressId = createdAddr.id;
    }

    if (!addressId) {
      return { error: 'Please choose or add a doorstep address.' };
    }

    // 5. Pricing and Promotion Calculations on Backend
    const config = await db.getIroningConfig();
    let pricingType: PricingType = payload.pricingType || (isIroning ? 'PAY_PER_ORDER' : 'PAY_PER_ORDER');
    let pairsCount: number | null = null;
    let garmentsCount: number | null = null;
    let unitPrice: number | null = null;
    let subtotal: number | null = null;
    let discountAmount = 0;
    let rewardIdApplied: string | null = null;
    let subscriptionIdApplied: string | null = null;
    let overageGarments: number | null = null;
    let overageCharge: number | null = null;
    let finalPayableAmount: number | null = null;

    if (isIroning) {
      if (pricingType === 'SUBSCRIPTION') {
        // --- Option 2: Monthly Subscription ---
        let activeSub = await db.getUserActiveSubscription(user.id);

        // If user wants to subscribe right now
        if (!activeSub && payload.subscriptionPlanSlug) {
          const plans = await db.getSubscriptionPlans();
          const targetPlan = plans.find((p) => p.slug === payload.subscriptionPlanSlug && p.is_active);
          if (!targetPlan) {
            return { error: 'Selected subscription plan is not available.' };
          }

          activeSub = await db.createSubscription({
            user_id: user.id,
            plan_id: targetPlan.id,
            plan_slug: targetPlan.slug,
            plan_name: targetPlan.name,
            monthly_price: targetPlan.monthly_price,
            included_garments: targetPlan.garment_allowance ?? 0,
            garments_used: 0,
            garments_remaining: targetPlan.garment_allowance ?? 0,
            status: 'ACTIVE',
            start_date: new Date().toISOString(),
            renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            payment_status: 'PAID',
            auto_renew: false,
          });
        }

        if (!activeSub) {
          return {
            error: 'You do not have an active monthly ironing subscription. Please select a plan or use Pay Per Order.',
          };
        }

        subscriptionIdApplied = activeSub.id;
        const requestedGarments = Math.max(1, payload.garmentsCount || (payload.pairsCount ? payload.pairsCount * 2 : 10));
        garmentsCount = requestedGarments;
        pairsCount = Math.ceil(requestedGarments / 2);

        // Check allowance
        if (activeSub.garments_remaining >= requestedGarments) {
          // Completely covered by subscription
          subtotal = 0;
          overageGarments = 0;
          overageCharge = 0;
          finalPayableAmount = 0;
        } else {
          // Overage calculation
          const excess = requestedGarments - activeSub.garments_remaining;
          overageGarments = excess;
          overageCharge = excess * (config.overage_price_per_garment || 15);
          subtotal = overageCharge;
          finalPayableAmount = overageCharge;
        }

        // Validate promotional reward combining rule
        if (payload.applyRewardId && !config.allow_combine_subscription_and_reward) {
          return {
            error: 'Promotional free-order rewards cannot be combined with monthly subscription coverage as per policy.',
          };
        }
      } else {
        // --- Option 1: Pay Per Order ---
        pricingType = 'PAY_PER_ORDER';
        const pairs = Math.max(1, payload.pairsCount || 1);
        pairsCount = pairs;
        garmentsCount = pairs * 2;
        unitPrice = config.price_per_pair || 25;
        subtotal = pairs * unitPrice;

        // Promotional Offer — Every 5th Order FREE
        if (payload.applyRewardId) {
          const loyalty = await db.getUserLoyaltyProgress(user.id);
          const reward = loyalty.userRewards.find((r) => r.id === payload.applyRewardId);

          if (!reward || reward.status !== 'AVAILABLE') {
            return { error: 'The selected free order reward is invalid or has already been redeemed.' };
          }

          if (new Date(reward.expires_at) <= new Date()) {
            return { error: 'This free order reward has expired.' };
          }

          // Apply 100% discount on the eligible ironing charge
          discountAmount = subtotal;
          rewardIdApplied = reward.id;
          finalPayableAmount = 0;
        } else {
          discountAmount = 0;
          finalPayableAmount = subtotal;
        }
      }
    } else {
      // Car wash or other services
      if (payload.subscriptionPlanSlug) {
        const plans = await db.getSubscriptionPlans();
        const plan = plans.find((p) => p.slug === payload.subscriptionPlanSlug && p.is_active);
        if (plan) {
          pricingType = 'SUBSCRIPTION';
          subtotal = plan.monthly_price;
          finalPayableAmount = plan.monthly_price;
        } else {
          subtotal = service.price || null;
          finalPayableAmount = subtotal;
        }
      } else {
        subtotal = service.price || null;
        finalPayableAmount = subtotal;
      }
    }

    // 6. Generate reference & items
    const bookingRef = generateBookingReference();
    const items = (payload.selectedItems && payload.selectedItems.length > 0)
      ? payload.selectedItems.map((name) => ({ name, quantity: 1 }))
      : [
          {
            name: isIroning
              ? `${pairsCount} Pairs of Garments (${pricingType === 'SUBSCRIPTION' ? 'Monthly Plan' : 'Pay Per Order'})`
              : service.name,
            quantity: pairsCount || 1,
          },
        ];

    // 7. Create booking in database
    const booking = await db.createBooking(
      {
        booking_reference: bookingRef,
        user_id: user.id,
        service_id: service.id,
        address_id: addressId,
        booking_date: payload.bookingDate,
        time_slot: payload.timeSlot,
        status: 'PENDING',
        customer_notes: payload.customerNotes || null,
        total_amount: subtotal,
        pricing_type: pricingType,
        pairs_count: pairsCount,
        garments_count: garmentsCount,
        unit_price: unitPrice,
        subtotal,
        discount_amount: discountAmount,
        reward_id_applied: rewardIdApplied,
        subscription_id_applied: subscriptionIdApplied,
        overage_garments: overageGarments,
        overage_charge: overageCharge,
        final_payable_amount: finalPayableAmount,
        payment_status: 'PAID',
      },
      items
    );

    if (!booking) {
      return { error: 'Failed to record booking. Please try again.' };
    }

    // 8. If reward was applied, atomically mark it as redeemed in database
    if (rewardIdApplied) {
      const redeemed = await db.redeemFreeOrderReward(
        rewardIdApplied,
        booking.id,
        booking.booking_reference,
        discountAmount
      );
      if (!redeemed) {
        console.warn('Reward redemption atomic check failed or already redeemed.');
      }
    }

    // 9. If subscription was applied, atomically record usage deduction
    if (subscriptionIdApplied && garmentsCount) {
      await db.recordSubscriptionUsage(
        subscriptionIdApplied,
        booking.id,
        booking.booking_reference,
        garmentsCount,
        `Deducted for booking ${booking.booking_reference}`
      );
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/bookings');
    revalidatePath('/admin');
    revalidatePath('/admin/bookings');
    revalidatePath('/worker');

    return {
      success: true,
      bookingReference: bookingRef,
      bookingId: booking.id,
      finalPayableAmount,
      discountAmount,
      isFreeOrder: discountAmount > 0 && finalPayableAmount === 0,
    };
  } catch (err: unknown) {
    console.error('Error submitting booking:', err);
    return { error: 'Unable to process your booking. Please try again.' };
  }
}

export async function subscribePlanAction(planSlug: SubscriptionPlanSlug) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Please log in to subscribe to a plan.' };
    }

    const plans = await db.getSubscriptionPlans();
    const plan = plans.find((p) => p.slug === planSlug && p.is_active);
    if (!plan) {
      return { error: 'Subscription plan not found.' };
    }

    const sub = await db.createSubscription({
      user_id: user.id,
      plan_id: plan.id,
      plan_slug: plan.slug,
      plan_name: plan.name,
      monthly_price: plan.monthly_price,
      included_garments: plan.garment_allowance ?? 0,
      garments_used: 0,
      garments_remaining: plan.garment_allowance ?? 0,
      status: 'ACTIVE',
      start_date: new Date().toISOString(),
      renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      payment_status: 'PAID',
      auto_renew: false,
    });

    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return { success: true, subscription: sub };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to subscribe' };
  }
}

export async function cancelSubscriptionAction(subscriptionId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const success = await db.cancelSubscription(subscriptionId, user.id);
    if (!success) {
      return { error: 'Subscription not found or already cancelled.' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to cancel subscription' };
  }
}

export async function createAddressAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Unauthorized.' };
  }

  const label = formData.get('label')?.toString() || 'Home';
  const addressLine = formData.get('addressLine')?.toString().trim();
  const area = formData.get('area')?.toString().trim() || 'Kompally';
  const pincode = formData.get('pincode')?.toString().trim() || '500100';
  const landmark = formData.get('landmark')?.toString().trim() || '';

  if (!addressLine) {
    return { error: 'Address line is required.' };
  }

  const allowedAreas = await db.getServiceAreas();
  const isAllowed = allowedAreas.some(
    (a) => a.is_active && a.area_name.toLowerCase() === area.toLowerCase()
  );

  if (!isAllowed) {
    return {
      error: 'We currently deliver doorstep services in Kompally. Please verify your area.',
    };
  }

  await db.createAddress({
    user_id: user.id,
    label,
    address_line: addressLine,
    area,
    city: 'Hyderabad',
    state: 'Telangana',
    pincode,
    landmark: landmark || null,
    latitude: null,
    longitude: null,
  });

  revalidatePath('/dashboard/addresses');
  revalidatePath('/book');
  return { success: true };
}

export async function deleteAddressAction(addressId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  await db.deleteAddress(addressId, user.id);
  revalidatePath('/dashboard/addresses');
  return { success: true };
}

export async function cancelBookingAction(bookingId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const booking = await db.getBookingById(bookingId);
  if (!booking) return { error: 'Booking not found.' };

  if (booking.user_id !== user.id && user.role !== 'admin') {
    return { error: 'You are not authorized to cancel this booking.' };
  }

  if (['COMPLETED', 'OUT_FOR_DELIVERY', 'IN_SERVICE'].includes(booking.status)) {
    return { error: `Cannot cancel a booking that is currently ${booking.status.toLowerCase()}.` };
  }

  await db.updateBookingStatus(booking.id, 'CANCELLED');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/bookings');
  revalidatePath('/admin/bookings');

  return { success: true };
}

export async function submitContactMessageAction(formData: FormData) {
  const name = formData.get('name')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const message = formData.get('message')?.toString().trim();

  if (!name || !phone || !email || !message) {
    return { error: 'All fields are required.' };
  }

  if (phone.length < 10) {
    return { error: 'Please enter a valid phone number.' };
  }

  await db.createContactMessage({
    name,
    phone,
    email,
    message,
  });

  return { success: true };
}
