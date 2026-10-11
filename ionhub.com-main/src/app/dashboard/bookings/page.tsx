import React, { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { BookingHistoryClient } from './BookingHistoryClient';
import { CardSkeleton } from '@/components/LoadingState';

export const metadata = {
  title: 'Booking History & Status Tracking — ION HUB',
  description: 'View your past and active doorstep bookings, track progress, and inspect service details.',
};

export default async function BookingHistoryPage(props: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const searchParams = await props.searchParams;
  const user = await getCurrentUser();
  if (!user) return null;

  const bookings = await db.getUserBookings(user.id);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0EBDD]/70 pb-4">
        <h2 className="text-2xl font-black text-[#12312C]">Booking History & Tracking</h2>
        <p className="text-xs text-[#5A7065] mt-1">
          Review all your doorstep service requests, filter by status, and inspect real-time progress.
        </p>
      </div>

      <Suspense fallback={<CardSkeleton />}>
        <BookingHistoryClient
          initialBookings={bookings}
          initialSelectedRef={searchParams.ref}
        />
      </Suspense>
    </div>
  );
}
