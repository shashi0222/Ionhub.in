'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Service, 
  TimeSlot, 
  Address, 
  UserProfile, 
  ServiceArea,
  IroningPricingConfig,
  SubscriptionPlan,
  CustomerSubscription,
  PricingType,
  SubscriptionPlanSlug
} from '@/types/database';
import { submitBookingAction } from '@/app/actions/booking';
import { formatPrice } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { 
  Car, 
  Shirt, 
  Sparkles, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Minus,
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  FileText, 
  ShieldCheck, 
  Home,
  Gift,
  Zap,
  Tag,
  BadgePercent,
  CheckCheck
} from 'lucide-react';

interface BookingWizardProps {
  services: Service[];
  timeSlots: TimeSlot[];
  serviceAreas: ServiceArea[];
  currentUser: UserProfile | null;
  userAddresses: Address[];
  ironingConfig?: IroningPricingConfig | null;
  subscriptionPlans?: SubscriptionPlan[];
  activeSubscription?: CustomerSubscription | null;
  loyaltyProgress?: {
    totalEligiblePaidCount: number;
    completedInCurrentCycle: number;
    requiredForFree: number;
    ordersNeeded: number;
    isRewardAvailable: boolean;
    currentReward: any | null;
    userRewards: any[];
  } | null;
}

export function BookingWizard({
  services,
  timeSlots,
  serviceAreas,
  currentUser,
  userAddresses,
  ironingConfig,
  subscriptionPlans = [],
  activeSubscription,
  loyaltyProgress,
}: BookingWizardProps) {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service');
  const preselectedPlan = searchParams.get('plan') as SubscriptionPlanSlug | null;

  // Step state: 1 to 8 (8 is Confirmation)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // Ironing Pricing State
  const [ironingPricingType, setIroningPricingType] = useState<PricingType>(
    preselectedPlan || activeSubscription ? 'SUBSCRIPTION' : 'PAY_PER_ORDER'
  );
  const [pairsCount, setPairsCount] = useState<number>(2); // Default 2 pairs
  const [subscriptionGarmentsCount, setSubscriptionGarmentsCount] = useState<number>(10);
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<SubscriptionPlanSlug>(
    preselectedPlan || (activeSubscription ? activeSubscription.plan_slug : 'standard')
  );
  const [applyRewardId, setApplyRewardId] = useState<string | null>(null);

  // New Address Form State
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(userAddresses.length === 0);
  const [addressLabel, setAddressLabel] = useState('Home');
  const [addressLine, setAddressLine] = useState('');
  const [addressArea, setAddressArea] = useState('Kompally');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('500100');

  // Date & Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState<string>(defaultDateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Notes
  const [customerNotes, setCustomerNotes] = useState('');

  // Guest fields (if not logged in)
  const [guestName, setGuestName] = useState(currentUser?.full_name || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [confirmedIsFreeOrder, setConfirmedIsFreeOrder] = useState(false);

  // Auto-select initial service if in URL
  useEffect(() => {
    if (preselectedService && services.length > 0) {
      const match = services.find((s) => s.slug === preselectedService && s.is_active);
      if (match) {
        setSelectedServiceId(match.id);
        if (match.items) {
          setSelectedOptions(match.items.map((i) => i.name));
        }
      }
    } else if (services.length > 0 && !selectedServiceId) {
      const firstActive = services.find((s) => s.is_active);
      if (firstActive) {
        setSelectedServiceId(firstActive.id);
        if (firstActive.items) {
          setSelectedOptions(firstActive.items.map((i) => i.name));
        }
      }
    }
  }, [preselectedService, services, selectedServiceId]);

  // Set default address if user has saved addresses
  useEffect(() => {
    if (userAddresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(userAddresses[0].id);
      setIsAddingNewAddress(false);
    }
  }, [userAddresses, selectedAddressId]);

  const activeService = services.find((s) => s.id === selectedServiceId);
  const isIroning = activeService?.slug === 'ironing' || activeService?.id === 's2222222-2222-2222-2222-222222222222';
  const unitPricePerPair = ironingConfig?.price_per_pair || 25;

  // Toggle option selection for checklist
  const handleToggleOption = (itemName: string) => {
    if (selectedOptions.includes(itemName)) {
      if (selectedOptions.length === 1) return;
      setSelectedOptions(selectedOptions.filter((n) => n !== itemName));
    } else {
      setSelectedOptions([...selectedOptions, itemName]);
    }
  };

  // Price calculations
  const calculateIroningSummary = () => {
    if (!isIroning) {
      const chosenPass = subscriptionPlans.find(
        (p) => p.slug === selectedPlanSlug && (p.category === 'car-wash' || p.slug.includes('pass'))
      );
      if (chosenPass) {
        return {
          mode: 'CAR_WASH_PASS',
          subtotal: chosenPass.monthly_price,
          discount: 0,
          finalPayable: chosenPass.monthly_price,
          overageCharge: 0,
          overageGarments: 0,
          chosenPlan: chosenPass,
        };
      }
      return {
        mode: 'CAR_WASH',
        subtotal: activeService?.price || null,
        discount: 0,
        finalPayable: activeService?.price || null,
        overageCharge: 0,
        overageGarments: 0,
      };
    }

    if (ironingPricingType === 'SUBSCRIPTION') {
      const remaining = activeSubscription?.garments_remaining || 0;
      const requested = subscriptionGarmentsCount;
      const overageGarments = Math.max(0, requested - remaining);
      const overagePrice = ironingConfig?.overage_price_per_garment || 15;
      const overageCharge = overageGarments * overagePrice;

      // If user is choosing a brand new plan right now
      const isNewPlanSelected = !activeSubscription && selectedPlanSlug;
      const chosenPlan = subscriptionPlans.find((p) => p.slug === selectedPlanSlug);
      const planPrice = isNewPlanSelected ? (chosenPlan?.monthly_price || 0) : 0;

      const subtotal = planPrice + overageCharge;
      const finalPayable = subtotal;

      return {
        mode: 'SUBSCRIPTION',
        subtotal,
        discount: 0,
        finalPayable,
        overageCharge,
        overageGarments,
        isNewPlanSelected,
        chosenPlan,
      };
    }

    // Pay Per Order
    const subtotal = pairsCount * unitPricePerPair;
    let discount = 0;
    if (applyRewardId && loyaltyProgress?.isRewardAvailable) {
      discount = subtotal; // 100% discount
    }
    const finalPayable = Math.max(0, subtotal - discount);

    return {
      mode: 'PAY_PER_ORDER',
      subtotal,
      discount,
      finalPayable,
      overageCharge: 0,
      overageGarments: 0,
    };
  };

  const summary = calculateIroningSummary();

  // Step validation
  const validateStep = (step: number): boolean => {
    setErrorMessage(null);

    if (step === 1) {
      if (!selectedServiceId) {
        setErrorMessage('Please select a service.');
        return false;
      }
    }

    if (step === 2) {
      if (isIroning) {
        if (ironingPricingType === 'PAY_PER_ORDER' && pairsCount < 1) {
          setErrorMessage('Please select at least 1 pair of garments.');
          return false;
        }
        if (ironingPricingType === 'SUBSCRIPTION' && subscriptionGarmentsCount < 1) {
          setErrorMessage('Please select at least 1 garment for pickup.');
          return false;
        }
      } else {
        if (selectedOptions.length === 0) {
          setErrorMessage('Please select at least one service option.');
          return false;
        }
      }
    }

    if (step === 3) {
      if (isAddingNewAddress) {
        if (!addressLine.trim()) {
          setErrorMessage('Please enter your house/flat number and street address.');
          return false;
        }
        if (addressArea.toLowerCase() !== 'kompally') {
          setErrorMessage('Service is currently available exclusively in Kompally.');
          return false;
        }
      } else {
        if (!selectedAddressId) {
          setErrorMessage('Please select an existing address or enter a new one.');
          return false;
        }
      }

      if (!currentUser) {
        if (!guestName.trim()) {
          setErrorMessage('Please enter your full name.');
          return false;
        }
        if (!guestPhone.trim() || guestPhone.trim().length < 10) {
          setErrorMessage('Please enter a valid 10-digit phone number.');
          return false;
        }
        if (!guestEmail.trim() || !guestEmail.includes('@')) {
          setErrorMessage('Please enter a valid email address.');
          return false;
        }
      }
    }

    if (step === 4) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosen = new Date(bookingDate);
      chosen.setHours(0, 0, 0, 0);
      if (isNaN(chosen.getTime()) || chosen < today) {
        setErrorMessage('Please select a valid upcoming date.');
        return false;
      }
    }

    if (step === 5) {
      if (!selectedTimeSlot) {
        setErrorMessage('Please select an evening time slot.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit Final Booking (Step 7 -> 8)
  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      serviceId: selectedServiceId,
      selectedItems: selectedOptions,
      addressId: isAddingNewAddress ? undefined : selectedAddressId,
      newAddress: isAddingNewAddress
        ? {
            label: addressLabel,
            addressLine,
            area: addressArea,
            landmark,
            pincode,
          }
        : undefined,
      bookingDate,
      timeSlot: selectedTimeSlot,
      customerNotes,
      guestDetails: !currentUser
        ? {
            fullName: guestName,
            phone: guestPhone,
            email: guestEmail,
          }
        : undefined,

      // Ironing specifics & Car Wash passes
      pricingType: isIroning
        ? ironingPricingType
        : (selectedPlanSlug && selectedPlanSlug.includes('pass') ? 'SUBSCRIPTION' : 'PAY_PER_ORDER'),
      pairsCount: isIroning && ironingPricingType === 'PAY_PER_ORDER' ? pairsCount : Math.ceil(subscriptionGarmentsCount / 2),
      garmentsCount: isIroning && ironingPricingType === 'SUBSCRIPTION' ? subscriptionGarmentsCount : pairsCount * 2,
      applyRewardId: isIroning && ironingPricingType === 'PAY_PER_ORDER' ? applyRewardId : null,
      subscriptionPlanSlug: isIroning
        ? (ironingPricingType === 'SUBSCRIPTION' && !activeSubscription ? selectedPlanSlug : null)
        : (selectedPlanSlug && selectedPlanSlug.includes('pass') ? selectedPlanSlug : null),
    };

    const res = await submitBookingAction(payload);
    setSubmitting(false);

    if (res?.error) {
      setErrorMessage(res.error);
    } else if (res?.success) {
      setConfirmedBookingRef(res.bookingReference || null);
      setConfirmedBookingId(res.bookingId || null);
      setConfirmedIsFreeOrder(Boolean(res.isFreeOrder));
      setCurrentStep(8);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0B4F47', '#3E8E4A', '#25D366', '#EAF5E8'],
        });
      } catch {
        // ignore
      }
    }
  };

  const stepTitles = [
    'Service',
    isIroning ? 'Pricing & Quantity' : 'Options',
    'Address',
    'Date',
    'Time Slot',
    'Instructions',
    'Review & Checkout',
  ];

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Step Progress Bar */}
      {currentStep <= 7 && (
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#5A7065]">
            <span className="uppercase tracking-wider text-[#0B4F47]">
              Step {currentStep} of 7: {stepTitles[currentStep - 1]}
            </span>
            <span>{Math.round((currentStep / 7) * 100)}% Completed</span>
          </div>

          <div className="h-2 bg-[#E0EBDD] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0B4F47] transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs animate-shake">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: CHOOSE SERVICE */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0EBDD] shadow-soft space-y-6">
          <div className="border-b border-[#E0EBDD]/70 pb-4">
            <h2 className="text-2xl font-black text-[#12312C]">Step 1: Choose Your Doorstep Service</h2>
            <p className="text-xs text-[#5A7065] mt-1">
              Select what you need done at your doorstep in Kompally.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services
              .filter((s) => s.is_active)
              .map((service) => {
                const isSelected = selectedServiceId === service.id;
                const isCar = service.slug === 'car-wash';

                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      if (service.items) {
                        setSelectedOptions(service.items.map((i) => i.name));
                      }
                    }}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0B4F47] bg-[#EAF5E8]/30 shadow-md ring-2 ring-[#0B4F47]/20'
                        : 'border-[#E0EBDD] bg-white hover:border-[#3E8E4A]/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center">
                          {isCar ? <Car className="w-6 h-6 text-[#3E8E4A]" /> : <Shirt className="w-6 h-6 text-[#3E8E4A]" />}
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-[#0B4F47] bg-[#0B4F47] text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-[#12312C]">{service.name}</h3>
                      <p className="text-xs text-[#5A7065] mt-1 leading-relaxed line-clamp-2">
                        {service.short_description || service.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E0EBDD]/60 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0B4F47]">
                        {service.slug === 'ironing' ? '₹25 / pair • Every 5th FREE' : formatPrice(service.price)}
                      </span>
                      {service.duration_minutes && (
                        <span className="text-[11px] text-[#5A7065] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#3E8E4A]" /> ~{service.duration_minutes}m
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* STEP 2: PRICING & OPTIONS (IRONING PRICING OR CAR WASH INCLUSIONS) */}
      {currentStep === 2 && activeService && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0EBDD] shadow-soft space-y-6">
          <div className="border-b border-[#E0EBDD]/70 pb-4">
            <h2 className="text-2xl font-black text-[#12312C]">
              Step 2: {isIroning ? 'Select Ironing Pricing Model' : 'Service Inclusions & Options'}
            </h2>
            <p className="text-xs text-[#5A7065] mt-1">
              {isIroning 
                ? 'Choose between transparent Pay-Per-Order (₹25/pair) or Monthly Subscription care.'
                : `Confirm items and attention points for ${activeService.name}.`}
            </p>
          </div>

          {/* IRONING PRICING CONTROLS */}
          {isIroning ? (
            <div className="space-y-6">
              
              {/* Option Switch Tabs */}
              <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD]">
                <button
                  type="button"
                  onClick={() => {
                    setIroningPricingType('PAY_PER_ORDER');
                    setErrorMessage(null);
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                    ironingPricingType === 'PAY_PER_ORDER'
                      ? 'bg-[#0B4F47] text-white shadow'
                      : 'text-[#5A7065] hover:text-[#12312C]'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Option 1: Pay Per Order (₹25/Pair)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIroningPricingType('SUBSCRIPTION');
                    setApplyRewardId(null);
                    setErrorMessage(null);
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                    ironingPricingType === 'SUBSCRIPTION'
                      ? 'bg-[#0B4F47] text-white shadow'
                      : 'text-[#5A7065] hover:text-[#12312C]'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Option 2: Monthly Subscription</span>
                </button>
              </div>

              {/* OPTION 1 CONTENT: PAY PER ORDER */}
              {ironingPricingType === 'PAY_PER_ORDER' && (
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                  
                  {/* Pairs Stepper */}
                  <div className="p-6 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base font-black text-[#12312C]">Number of Pairs to Iron</h4>
                        <p className="text-xs text-[#5A7065] mt-0.5">
                          Unit price: <strong className="text-[#0B4F47]">₹{unitPricePerPair} per pair</strong> of garments.
                        </p>
                        <p className="text-[11px] text-[#5A7065]/80 italic mt-0.5">
                          * 1 pair = 2 standard garments (shirts, trousers, ethnic, linens).
                        </p>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPairsCount(Math.max(1, pairsCount - 1))}
                          className="w-10 h-10 rounded-xl bg-white border border-[#E0EBDD] flex items-center justify-center text-[#12312C] hover:bg-[#EAF5E8] transition active:scale-95"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="w-20 text-center">
                          <span className="text-2xl font-black text-[#0B4F47]">{pairsCount}</span>
                          <span className="block text-[10px] font-bold text-[#5A7065] uppercase">
                            {pairsCount === 1 ? 'Pair' : 'Pairs'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPairsCount(pairsCount + 1)}
                          className="w-10 h-10 rounded-xl bg-white border border-[#E0EBDD] flex items-center justify-center text-[#12312C] hover:bg-[#EAF5E8] transition active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Formula breakdown */}
                    <div className="pt-3 border-t border-[#E0EBDD]/60 flex items-center justify-between text-xs">
                      <span className="text-[#5A7065]">
                        Calculation Formula: {pairsCount} pairs × ₹{unitPricePerPair}
                      </span>
                      <span className="font-bold text-[#12312C]">
                        Subtotal: ₹{pairsCount * unitPricePerPair}
                      </span>
                    </div>
                  </div>

                  {/* PROMOTIONAL REWARD SECTION — EVERY 5TH ORDER FREE */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FAF9F2] to-[#EAF5E8] border border-[#3E8E4A]/30 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#3E8E4A] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Gift className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-[#12312C]">
                            Loyalty Promotion: Your 5th Ironing Order Is FREE!
                          </h4>
                          <p className="text-xs text-[#5A7065] mt-0.5">
                            Place 4 eligible paid ironing orders, and your 5th eligible order is completely FREE!
                          </p>
                        </div>
                      </div>

                      {loyaltyProgress?.isRewardAvailable && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#3E8E4A] text-white text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                          Reward Ready!
                        </span>
                      )}
                    </div>

                    {/* Reward redemption action if reward is available */}
                    {loyaltyProgress?.isRewardAvailable ? (
                      <div className="pt-2">
                        <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#3E8E4A] cursor-pointer hover:bg-emerald-50/50 transition">
                          <input
                            type="checkbox"
                            checked={Boolean(applyRewardId)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setApplyRewardId(loyaltyProgress.currentReward?.id || 'rew-1');
                              } else {
                                setApplyRewardId(null);
                              }
                            }}
                            className="w-4 h-4 accent-[#0B4F47] rounded cursor-pointer"
                          />
                          <div className="text-xs">
                            <strong className="text-[#0B4F47] block">
                              Redeem Free 5th Ironing Order Reward (100% OFF)
                            </strong>
                            <span className="text-[#5A7065]">
                              Code: {loyaltyProgress.currentReward?.reward_code || 'FREE-5TH'} • 100% discount will be applied to this order!
                            </span>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5A7065]">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#3E8E4A]" />
                          <span>
                            Progress: <strong>{loyaltyProgress?.completedInCurrentCycle ?? 0} of {loyaltyProgress?.requiredForFree ?? 4}</strong> eligible paid orders completed.
                          </span>
                        </div>
                        <span className="font-semibold text-[#0B4F47]">
                          Complete {loyaltyProgress?.ordersNeeded ?? 4} more to unlock your free order!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing live preview pill */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E0EBDD] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#5A7065] block">Payable for {pairsCount} pairs</span>
                      {applyRewardId && (
                        <span className="text-[11px] font-bold text-[#3E8E4A] flex items-center gap-1">
                          <CheckCheck className="w-3.5 h-3.5" /> 100% Free Order Reward Applied
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      {applyRewardId && (
                        <span className="text-xs line-through text-slate-400 mr-2">
                          ₹{pairsCount * unitPricePerPair}
                        </span>
                      )}
                      <span className="text-2xl font-black text-[#0B4F47]">
                        ₹{summary.finalPayable}
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* OPTION 2 CONTENT: MONTHLY SUBSCRIPTION */}
              {ironingPricingType === 'SUBSCRIPTION' && (
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                  
                  {/* If user already has active subscription */}
                  {activeSubscription ? (
                    <div className="p-5 rounded-2xl bg-[#EAF5E8]/60 border border-[#3E8E4A]/30 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#3E8E4A] tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#3E8E4A]/30">
                            Active Subscription
                          </span>
                          <h4 className="text-lg font-black text-[#12312C] mt-1">
                            {activeSubscription.plan_name} Plan
                          </h4>
                          <p className="text-xs text-[#5A7065]">
                            Monthly Fee: ₹{activeSubscription.monthly_price}/month • Valid until {new Date(activeSubscription.renewal_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-[#0B4F47]">
                            {activeSubscription.garments_remaining}
                          </span>
                          <span className="text-[10px] text-[#5A7065] block font-bold uppercase">
                            Garments Remaining
                          </span>
                        </div>
                      </div>

                      {/* Garment Pickup Counter */}
                      <div className="pt-3 border-t border-[#3E8E4A]/20">
                        <label className="block text-xs font-bold text-[#12312C] mb-2">
                          Number of Garments for this Pickup:
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSubscriptionGarmentsCount(Math.max(1, subscriptionGarmentsCount - 1))}
                            className="w-10 h-10 rounded-xl bg-white border border-[#E0EBDD] flex items-center justify-center text-[#12312C] hover:bg-emerald-50 transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={subscriptionGarmentsCount}
                            onChange={(e) => setSubscriptionGarmentsCount(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-24 px-3 py-2 rounded-xl text-center font-black text-lg text-[#0B4F47] border border-[#E0EBDD] bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setSubscriptionGarmentsCount(subscriptionGarmentsCount + 1)}
                            className="w-10 h-10 rounded-xl bg-white border border-[#E0EBDD] flex items-center justify-center text-[#12312C] hover:bg-emerald-50 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-[#5A7065]">
                            (equivalent to ~{Math.ceil(subscriptionGarmentsCount / 2)} pairs)
                          </span>
                        </div>
                      </div>

                      {/* Status / Overage preview */}
                      {subscriptionGarmentsCount <= activeSubscription.garments_remaining ? (
                        <div className="p-3 rounded-xl bg-white border border-[#3E8E4A]/30 text-xs text-[#0B4F47] font-semibold flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#3E8E4A]" />
                          <span>This entire pickup is covered by your monthly plan allowance (₹0 payable).</span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                          <p className="font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-700" />
                            Exceeds remaining allowance by {subscriptionGarmentsCount - activeSubscription.garments_remaining} garments.
                          </p>
                          <p>
                            Additional overage charge: {subscriptionGarmentsCount - activeSubscription.garments_remaining} extra garments × ₹15 = 
                            <strong className="text-[#12312C]"> ₹{(subscriptionGarmentsCount - activeSubscription.garments_remaining) * 15}</strong>.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Customer needs to pick a plan
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                        Select a monthly plan to activate with this booking, or choose <strong>Option 1: Pay Per Order</strong> above.
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {subscriptionPlans
                          .filter((p) => p.category === 'ironing' || (!p.category && !p.wash_allowance))
                          .map((plan) => {
                          const isSelected = selectedPlanSlug === plan.slug;
                          return (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedPlanSlug(plan.slug)}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                                isSelected
                                  ? 'border-[#0B4F47] bg-[#EAF5E8]/40 ring-2 ring-[#0B4F47]/20 shadow-sm'
                                  : 'border-[#E0EBDD] bg-white hover:border-[#3E8E4A]'
                              }`}
                            >
                              <div>
                                <span className="text-[10px] font-bold text-[#3E8E4A] uppercase">Plan</span>
                                <h4 className="text-base font-black text-[#12312C]">{plan.name}</h4>
                                <span className="text-xs text-[#5A7065] block mt-0.5">
                                  {plan.garment_allowance} garments/mo
                                </span>
                              </div>
                              <div className="mt-3 pt-2 border-t border-[#E0EBDD]/60 flex items-center justify-between">
                                <span className="text-lg font-black text-[#0B4F47]">
                                  ₹{plan.monthly_price}
                                </span>
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                    isSelected ? 'bg-[#0B4F47] border-[#0B4F47] text-white' : 'border-slate-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Garment input for first pickup */}
                      <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-2">
                        <label className="block text-xs font-bold text-[#12312C]">
                          Garments to pickup on first visit:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="40"
                          value={subscriptionGarmentsCount}
                          onChange={(e) => setSubscriptionGarmentsCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-24 px-3 py-2 rounded-xl text-center font-bold text-[#0B4F47] border border-[#E0EBDD] bg-white"
                        />
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          ) : (
            // CAR WASH STANDARD OPTIONS
            <div className="space-y-4">
              {/* Optional Monthly Pass Promotion */}
              {subscriptionPlans.filter((p) => p.category === 'car-wash' || p.slug.includes('pass')).length > 0 && (
                <div className="p-5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#0B4F47] tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Doorstep Monthly Pass (Optional)
                    </span>
                    {selectedPlanSlug && selectedPlanSlug.includes('pass') && (
                      <button
                        type="button"
                        onClick={() => setSelectedPlanSlug('standard')}
                        className="text-[11px] font-bold text-emerald-800 hover:underline"
                      >
                        Switch to Single Booking Quote
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {subscriptionPlans
                      .filter((p) => p.category === 'car-wash' || p.slug.includes('pass'))
                      .map((p) => {
                        const isSelected = selectedPlanSlug === p.slug;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPlanSlug(isSelected ? 'standard' : p.slug)}
                            className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                              isSelected
                                ? 'border-[#0B4F47] bg-[#EAF5E8]/60 ring-2 ring-[#0B4F47]/20 shadow-sm'
                                : 'border-[#E0EBDD] bg-white hover:border-[#3E8E4A]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-black text-[#12312C]">{p.name}</h5>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#0B4F47]" />}
                            </div>
                            <div className="text-sm font-black text-[#0B4F47] mt-1">₹{p.monthly_price}/mo</div>
                            <p className="text-[10px] text-[#5A7065] mt-0.5 line-clamp-1">{p.description}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              <h4 className="text-xs font-black uppercase text-[#5A7065] tracking-wider">
                Service Checklist & Detailing Options:
              </h4>
              {activeService.items && activeService.items.length > 0 ? (
                activeService.items.map((item) => {
                  const checked = selectedOptions.includes(item.name);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleOption(item.name)}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        checked
                          ? 'border-[#0B4F47] bg-[#EAF5E8]/30'
                          : 'border-[#E0EBDD] bg-white opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            checked ? 'bg-[#0B4F47] border-[#0B4F47] text-white' : 'border-slate-300'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#12312C]">{item.name}</h4>
                          {item.description && (
                            <p className="text-xs text-[#5A7065] mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#3E8E4A]">Included</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-[#5A7065]">Full standard care package will be applied.</p>
              )}
            </div>
          )}

        </div>
      )}

      {/* STEP 3: CHOOSE ADDRESS */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0EBDD] shadow-soft space-y-6">
          <div className="border-b border-[#E0EBDD]/70 pb-4">
            <h2 className="text-2xl font-black text-[#12312C]">Step 3: Doorstep Address in Kompally</h2>
            <p className="text-xs text-[#5A7065] mt-1">
              Select where our specialist will collect your car or garments.
            </p>
          </div>

          {/* Guest Contact fields if not logged in */}
          {!currentUser && (
            <div className="p-5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-4">
              <h3 className="text-sm font-black text-[#12312C]">Your Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5A7065] uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0EBDD] bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5A7065] uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0EBDD] bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5A7065] uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0EBDD] bg-white text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Existing Addresses selection */}
          {userAddresses.length > 0 && !isAddingNewAddress && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#5A7065] uppercase">Select Saved Address:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                        isSelected
                          ? 'border-[#0B4F47] bg-[#EAF5E8]/30 shadow-sm'
                          : 'border-[#E0EBDD] bg-white hover:border-[#3E8E4A]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#0B4F47] flex items-center gap-1">
                          <Home className="w-3.5 h-3.5" /> {addr.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#0B4F47]" />}
                      </div>
                      <p className="text-xs font-semibold text-[#12312C]">{addr.address_line}</p>
                      <p className="text-[11px] text-[#5A7065] mt-0.5">{addr.area}, {addr.pincode}</p>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsAddingNewAddress(true)}
                className="mt-2 text-xs font-bold text-[#0B4F47] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Deliver to a different address
              </button>
            </div>
          )}

          {/* Add New Address Form */}
          {(isAddingNewAddress || userAddresses.length === 0) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5A7065] uppercase">Enter Doorstep Address:</span>
                {userAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="text-xs text-[#0B4F47] font-semibold hover:underline"
                  >
                    Cancel & use saved address
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#12312C] uppercase mb-1">Address Label</label>
                  <div className="flex gap-2">
                    {['Home', 'Office', 'Other'].map((l) => (
                      <button
                        type="button"
                        key={l}
                        onClick={() => setAddressLabel(l)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          addressLabel === l
                            ? 'bg-[#0B4F47] text-white'
                            : 'bg-[#FAF9F2] border border-[#E0EBDD] text-[#5A7065]'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#12312C] uppercase mb-1">
                    House / Villa No. & Street Line
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="e.g. Villa 28, Whisper Valley, Near Cine Planet"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] focus:ring-2 focus:ring-[#0B4F47] text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#12312C] uppercase mb-1">Area</label>
                    <input
                      type="text"
                      disabled
                      value={addressArea}
                      className="w-full px-3 py-2 rounded-xl border border-[#E0EBDD] bg-slate-100 text-xs font-bold text-[#0B4F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#12312C] uppercase mb-1">Pincode</label>
                    <input
                      type="text"
                      disabled
                      value={pincode}
                      className="w-full px-3 py-2 rounded-xl border border-[#E0EBDD] bg-slate-100 text-xs font-bold text-[#0B4F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#12312C] uppercase mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opp D-Mart"
                      className="w-full px-3 py-2 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: CHOOSE DATE */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0EBDD] shadow-soft space-y-6">
          <div className="border-b border-[#E0EBDD]/70 pb-4">
            <h2 className="text-2xl font-black text-[#12312C]">Step 4: Choose Booking Date</h2>
            <p className="text-xs text-[#5A7065] mt-1">
              Select your preferred service date. Daily evening doorstep service available in Kompally.
            </p>
          </div>

          <div className="max-w-sm">
            <label className="block text-xs font-bold text-[#12312C] uppercase mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#3E8E4A]" /> Appointment Date
            </label>
            <input
              type="date"
              required
              min={defaultDateStr}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#E0EBDD] bg-[#FAF9F2] focus:ring-2 focus:ring-[#0B4F47] text-sm font-semibold"
            />
          </div>

          <div className="p-4 rounded-2xl bg-[#EAF5E8] border border-[#3E8E4A]/30 text-xs text-[#0B4F47]">
            <strong>Note:</strong> We accept doorstep requests daily between 6 PM and 11 PM in Kompally, including weekends.
          </div>
        </div>
      )}

      {/* STEP 5: CHOOSE TIME SLOT */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0EBDD] shadow-soft space-y-6">
          <div className="border-b border-[#E0EBDD]/70 pb-4">
            <h2 className="text-2xl font-black text-[#12312C]">Step 5: Select Available Time Slot</h2>
            <p className="text-xs text-[#5A7065] mt-1">
              Doorstep service operating hours: <strong className="text-[#0B4F47]">6:00 PM – 11:00 PM</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot.slot_time;
              const isDisabled = !slot.is_active || slot.capacity <= 0;

              return (
                <button
                  type="button"
                  key={slot.id}
                  disabled={isDisabled}
                  onClick={() => setSelectedTimeSlot(slot.slot_time)}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                    isDisabled
                      ? 'bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'border-[#0B4F47] bg-[#EAF5E8]/40 shadow-sm'
                      : 'border-[#E0EBDD] bg-white hover:border-[#3E8E4A]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#0B4F47] text-white' : 'bg-[#FAF9F2] text-[#0B4F47]'
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-[#12312C]">{slot.slot_time}</span>
                      <span className="block text-[11px] text-[#5A7065]">
                        {isDisabled ? 'Fully Booked' : 'Doorstep Pickup Window'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-[#0B4F47] border-[#0B4F47] text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 6: INSTRUCTIONS */}
      {currentStep === 6 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0EBDD] shadow-soft space-y-6">
          <div className="border-b border-[#E0EBDD]/70 pb-4">
            <h2 className="text-2xl font-black text-[#12312C]">Step 6: Special Care Instructions</h2>
            <p className="text-xs text-[#5A7065] mt-1">
              Add any special garment care instructions, creases, fabric preferences, or gate security info.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#12312C] uppercase mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#3E8E4A]" /> Notes for our Specialist (Optional)
            </label>
            <textarea
              rows={4}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="e.g. Sharp center crease on trousers; starch collars; call upon arrival at main gate..."
              className="w-full px-4 py-3 rounded-2xl border border-[#E0EBDD] bg-[#FAF9F2] focus:ring-2 focus:ring-[#0B4F47] text-sm"
            />
          </div>
        </div>
      )}

      {/* STEP 7: REVIEW BOOKING & COMPLETE PRICE BREAKDOWN */}
      {currentStep === 7 && activeService && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0EBDD] shadow-soft space-y-6">
          <div className="border-b border-[#E0EBDD]/70 pb-4">
            <h2 className="text-2xl font-black text-[#12312C]">Step 7: Review & Final Breakdown</h2>
            <p className="text-xs text-[#5A7065] mt-1">
              Verify your order quantity, unit pricing, applicable promotional discount, and final amount.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Service & Pricing Itemized Card */}
            <div className="p-6 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#5A7065] uppercase">Service</span>
                  <h3 className="text-xl font-black text-[#0B4F47]">{activeService.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#3E8E4A] uppercase bg-[#EAF5E8] px-2 py-0.5 rounded-full">
                    {isIroning ? (ironingPricingType === 'SUBSCRIPTION' ? 'Subscription Care' : 'Pay Per Order') : 'Standard Wash'}
                  </span>
                </div>
              </div>

              {/* Itemized calculation breakdown */}
              {isIroning ? (
                <div className="pt-3 border-t border-[#E0EBDD] space-y-2 text-xs">
                  {ironingPricingType === 'PAY_PER_ORDER' ? (
                    <>
                      <div className="flex justify-between text-[#5A7065]">
                        <span>Quantity of Pairs:</span>
                        <span className="font-bold text-[#12312C]">{pairsCount} Pairs</span>
                      </div>
                      <div className="flex justify-between text-[#5A7065]">
                        <span>Unit Price:</span>
                        <span className="font-bold text-[#12312C]">₹{unitPricePerPair} per pair</span>
                      </div>
                      <div className="flex justify-between text-[#5A7065]">
                        <span>Subtotal ({pairsCount} × ₹{unitPricePerPair}):</span>
                        <span className="font-bold text-[#12312C]">₹{summary.subtotal}</span>
                      </div>

                      {summary.discount > 0 && (
                        <div className="flex justify-between text-[#3E8E4A] font-bold">
                          <span>Loyalty Reward (5th Order FREE - 100% OFF):</span>
                          <span>- ₹{summary.discount}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-[#5A7065]">
                        <span>Subscription Status:</span>
                        <span className="font-bold text-[#0B4F47]">
                          {activeSubscription ? `${activeSubscription.plan_name} Plan (Active)` : `New ${summary.chosenPlan?.name} Plan`}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#5A7065]">
                        <span>Garments in this order:</span>
                        <span className="font-bold text-[#12312C]">{subscriptionGarmentsCount} garments</span>
                      </div>

                      {summary.overageGarments > 0 && (
                        <div className="flex justify-between text-amber-800">
                          <span>Overage ({summary.overageGarments} garments beyond plan allowance × ₹15):</span>
                          <span className="font-bold text-amber-900">+ ₹{summary.overageCharge}</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Final Payable */}
                  <div className="pt-3 border-t border-[#E0EBDD] flex items-center justify-between text-sm">
                    <span className="font-black text-[#12312C]">Final Payable Amount:</span>
                    <span className="text-2xl font-black text-[#0B4F47]">
                      ₹{summary.finalPayable}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-[#E0EBDD] flex items-center justify-between text-sm">
                  <span className="font-black text-[#12312C]">Final Payable Amount:</span>
                  <span className="text-2xl font-black text-[#0B4F47]">
                    {formatPrice(activeService.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Schedule & Address grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-1">
                <span className="text-[11px] font-bold text-[#5A7065] uppercase flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#3E8E4A]" /> Scheduled Date & Time
                </span>
                <p className="text-sm font-extrabold text-[#12312C]">{bookingDate}</p>
                <p className="text-xs text-[#0B4F47] font-semibold">{selectedTimeSlot}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-1">
                <span className="text-[11px] font-bold text-[#5A7065] uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#3E8E4A]" /> Doorstep Address in Kompally
                </span>
                <p className="text-xs font-bold text-[#12312C]">
                  {isAddingNewAddress
                    ? `${addressLine}, ${addressArea} (500100)`
                    : userAddresses.find((a) => a.id === selectedAddressId)?.address_line}
                </p>
                {landmark && <p className="text-[10px] text-[#5A7065]">Near: {landmark}</p>}
              </div>
            </div>

            {/* Customer Contact */}
            <div className="p-4 rounded-2xl bg-white border border-[#E0EBDD] text-xs flex flex-wrap gap-6 text-[#5A7065]">
              <div>
                <span className="font-bold text-[#12312C] block">Name</span>
                <span>{currentUser?.full_name || guestName}</span>
              </div>
              <div>
                <span className="font-bold text-[#12312C] block">Phone</span>
                <span>{currentUser?.phone || guestPhone}</span>
              </div>
              <div>
                <span className="font-bold text-[#12312C] block">Email</span>
                <span>{currentUser?.email || guestEmail}</span>
              </div>
            </div>

            {customerNotes && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Notes:</strong> {customerNotes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 8: CONFIRMATION SUCCESS SCREEN */}
      {currentStep === 8 && (
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#E0EBDD] shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-400">
          <div className="w-20 h-20 rounded-full bg-[#EAF5E8] text-[#3E8E4A] flex items-center justify-center mx-auto border-4 border-white shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-black tracking-widest text-[#3E8E4A] uppercase bg-[#EAF5E8] px-3 py-1 rounded-full">
              Status: REGISTERED & SCHEDULED
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#12312C] mt-3">
              Booking Confirmed!
            </h2>
            <p className="text-xs text-[#5A7065] mt-2 max-w-md mx-auto">
              Your doorstep service request has been placed. Our trained specialist will arrive at your Kompally address on schedule.
            </p>
          </div>

          {confirmedIsFreeOrder && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 max-w-sm mx-auto text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>🎉 Congratulations! Your 5th Order Free promotion was applied (₹0 paid).</span>
            </div>
          )}

          {confirmedBookingRef && (
            <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] max-w-sm mx-auto">
              <span className="text-[11px] font-bold text-[#5A7065] uppercase block">
                Booking Reference Number
              </span>
              <span className="text-2xl font-mono font-black text-[#0B4F47] mt-1 block">
                {confirmedBookingRef}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
            <Link
              href="/dashboard/bookings"
              className="py-3 px-4 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-extrabold transition shadow-sm"
            >
              View Booking History
            </Link>
            <Link
              href="/dashboard"
              className="py-3 px-4 rounded-xl border border-[#0B4F47] text-[#0B4F47] hover:bg-[#EAF5E8] text-xs font-bold transition"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="py-3 px-4 rounded-xl border border-[#E0EBDD] text-[#5A7065] hover:bg-[#FAF9F2] text-xs font-semibold transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}

      {/* Navigation Buttons (for steps 1-7) */}
      {currentStep <= 7 && (
        <div className="mt-8 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-[#E0EBDD] bg-white hover:bg-[#FAF9F2] text-[#12312C] text-xs font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-extrabold transition shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-[#3E8E4A]" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirmBooking}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#3E8E4A] hover:bg-[#34783f] text-white text-sm font-black transition shadow-xl disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>CONFIRM & PLACE ORDER (₹{summary.finalPayable})</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

    </div>
  );
}
