import React from 'react';
import { db } from '@/lib/db';
import { AdminWorkersClient } from './AdminWorkersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Specialist Workers Management — ION HUB Admin',
};

export default async function AdminWorkersPage() {
  const [profiles, bookings] = await Promise.all([
    db.getProfiles(),
    db.getBookings(),
  ]);

  const workers = profiles.filter((p) => p.role === 'worker');

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0EBDD]/70 pb-4">
        <h2 className="text-2xl font-black text-[#12312C]">Specialist Worker Management</h2>
        <p className="text-xs text-[#5A7065] mt-1">
          Authorize and register specialist workers with designated credentials, and track their order queue.
        </p>
      </div>

      <AdminWorkersClient initialWorkers={workers} bookings={bookings} />
    </div>
  );
}
