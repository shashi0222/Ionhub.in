'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { BookingStatus, Service, TimeSlot, ServiceArea, BusinessHour } from '@/types/database';
import { revalidatePath } from 'next/cache';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase/server';

async function verifyAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Access denied: Administrator privileges required.');
  }
  return user;
}

export async function adminUpdateBookingStatus(bookingId: string, status: BookingStatus) {
  try {
    await verifyAdmin();
    const updated = await db.updateBookingStatus(bookingId, status);
    revalidatePath('/admin');
    revalidatePath('/admin/bookings');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/bookings');
    return { success: true, booking: updated };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update status' };
  }
}

export async function adminUpdateService(serviceId: string, updates: Partial<Service>) {
  try {
    await verifyAdmin();
    const updated = await db.updateService(serviceId, updates);
    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/');
    return { success: true, service: updated };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update service' };
  }
}

export async function adminCreateService(data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
  try {
    await verifyAdmin();
    const id = `s-${Date.now()}`;
    const created = await db.createService({ ...data, id });
    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/');
    return { success: true, service: created };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to create service' };
  }
}

export async function adminUpdateTimeSlot(slotId: string, updates: Partial<TimeSlot>) {
  try {
    await verifyAdmin();
    const updated = await db.updateTimeSlot(slotId, updates);
    revalidatePath('/admin/time-slots');
    revalidatePath('/book');
    return { success: true, slot: updated };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update time slot' };
  }
}

export async function adminCreateTimeSlot(data: Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>) {
  try {
    await verifyAdmin();
    const created = await db.createTimeSlot(data);
    revalidatePath('/admin/time-slots');
    revalidatePath('/book');
    return { success: true, slot: created };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to create time slot' };
  }
}

export async function adminUpdateServiceArea(areaId: string, updates: Partial<ServiceArea>) {
  try {
    await verifyAdmin();
    const updated = await db.updateServiceArea(areaId, updates);
    revalidatePath('/admin/settings');
    revalidatePath('/book');
    return { success: true, area: updated };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update service area' };
  }
}

export async function adminCreateServiceArea(data: Omit<ServiceArea, 'id' | 'created_at' | 'updated_at'>) {
  try {
    await verifyAdmin();
    const created = await db.createServiceArea(data);
    revalidatePath('/admin/settings');
    revalidatePath('/book');
    return { success: true, area: created };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to create service area' };
  }
}

export async function adminUpdateBusinessHours(id: string, updates: Partial<BusinessHour>) {
  try {
    await verifyAdmin();
    const updated = await db.updateBusinessHours(id, updates);
    revalidatePath('/admin/settings');
    return { success: true, hours: updated };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update business hours' };
  }
}

export async function adminUpdateContactStatus(id: string, status: 'unread' | 'read' | 'replied') {
  try {
    await verifyAdmin();
    const updated = await db.updateContactMessageStatus(id, status);
    revalidatePath('/admin');
    return { success: true, message: updated };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update contact message' };
  }
}

export async function adminUpdateIroningConfig(updates: Record<string, unknown>) {
  try {
    await verifyAdmin();
    const updated = await db.updateIroningConfig(updates);
    revalidatePath('/admin/pricing');
    revalidatePath('/admin');
    revalidatePath('/services/ironing');
    revalidatePath('/book');
    revalidatePath('/dashboard');
    return { success: true, config: updated };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update ironing pricing configuration' };
  }
}

export async function adminUpdateSubscriptionPlan(planId: string, updates: Record<string, unknown>) {
  try {
    await verifyAdmin();
    const updated = await db.updateSubscriptionPlan(planId, updates);
    revalidatePath('/admin/pricing');
    revalidatePath('/services/ironing');
    revalidatePath('/book');
    revalidatePath('/dashboard');
    return { success: true, plan: updated };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update subscription plan' };
  }
}

export async function adminCreateWorker(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) {
  try {
    await verifyAdmin();

    const fullName = data.fullName?.trim();
    const email = data.email?.toLowerCase().trim();
    const phone = data.phone?.trim();
    const password = data.password?.trim();

    if (!fullName || !email || !phone || !password) {
      return { error: 'All fields are required.' };
    }

    if (password.length < 6) {
      return { error: 'Worker password must be at least 6 characters.' };
    }

    const existing = await db.getProfileByEmail(email);
    if (existing) {
      return { error: 'An account with this email already exists.' };
    }

    const workerId = crypto.randomUUID();
    const newWorker = await db.createProfile({
      id: workerId,
      auth_user_id: null,
      full_name: fullName,
      email,
      phone,
      role: 'worker',
      password,
      avatar_url: `worker:${password}`,
    });

    // Also attempt creating in Supabase Auth if Supabase is configured
    try {
      const adminClient = createAdminSupabaseClient();
      if (adminClient) {
        await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { role: 'worker', full_name: fullName, phone },
        });
      } else {
        const userClient = await createServerSupabaseClient();
        if (userClient) {
          await userClient.auth.signUp({
            email,
            password,
            options: { data: { role: 'worker', full_name: fullName, phone } },
          });
        }
      }
    } catch {
      // Supabase Auth creation is non-blocking since db.createProfile already stored worker credentials
    }

    revalidatePath('/admin');
    revalidatePath('/admin/workers');
    revalidatePath('/admin/bookings');
    revalidatePath('/login');
    return { success: true, worker: newWorker };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to create worker' };
  }
}

export async function adminAssignWorker(bookingId: string, workerId: string) {
  try {
    await verifyAdmin();

    const worker = await db.getProfileById(workerId);
    if (!worker) {
      return { error: 'Selected specialist worker could not be found.' };
    }

    const updated = await db.assignWorkerToBooking(bookingId, workerId, worker.full_name);
    revalidatePath('/admin');
    revalidatePath('/admin/bookings');
    revalidatePath('/worker');
    return { success: true, booking: updated };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to assign worker' };
  }
}

