'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { BookingStatus, Service, TimeSlot, ServiceArea, BusinessHour } from '@/types/database';
import { revalidatePath } from 'next/cache';

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
