import React, { Suspense } from 'react';
import { db } from '@/lib/db';
import { AdminBookingsClient } from './AdminBookingsClient';
import { CardSkeleton } from '@/components/LoadingState';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Booking Management — ION HUB Admin',
};

export default async function AdminBookingsPage(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const searchParams = await props.searchParams;
  const [bookings, profiles] = await Promise.all([
    db.getBookings(),
    db.getProfiles(),
  ]);

  const workers = profiles.filter((p) => p.role === 'worker');

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0EBDD]/70 pb-4">
        <h2 className="text-2xl font-black text-[#12312C]">Booking Dispatch & Status Management</h2>
        <p className="text-xs text-[#5A7065] mt-1">
          Review appointments, confirm time slots, update pickup & delivery stages, and coordinate field specialists.
        </p>
      </div>

      <Suspense fallback={<CardSkeleton />}>
        <AdminBookingsClient
          initialBookings={bookings}
          workers={workers}
          selectedIdFromUrl={searchParams.id}
        />
      </Suspense>
    </div>
  );
}
