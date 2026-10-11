'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { BookingStatus } from '@/types/database';
import { revalidatePath } from 'next/cache';

async function verifyWorker() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'worker' && user.role !== 'admin')) {
    throw new Error('Access denied: Specialist / Worker privileges required.');
  }
  return user;
}

export async function workerUpdateOrderStatus(bookingId: string, status: BookingStatus) {
  try {
    const worker = await verifyWorker();
    const booking = await db.getBookingById(bookingId);
    if (!booking) {
      return { error: 'Booking not found.' };
    }

    // Auto-assign worker if not assigned yet
    if (!booking.worker_id) {
      await db.assignWorkerToBooking(booking.id, worker.id, worker.full_name);
    }

    const updated = await db.updateBookingStatus(bookingId, status);

    revalidatePath('/worker');
    revalidatePath('/dashboard');
    revalidatePath('/admin');
    revalidatePath('/admin/bookings');

    return { success: true, booking: updated };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update order status' };
  }
}

export async function workerClaimOrder(bookingId: string) {
  try {
    const worker = await verifyWorker();
    const updated = await db.assignWorkerToBooking(bookingId, worker.id, worker.full_name);

    revalidatePath('/worker');
    revalidatePath('/admin/bookings');

    return { success: true, booking: updated };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to claim order' };
  }
}
