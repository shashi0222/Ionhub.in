import React from 'react';
import { db } from '@/lib/db';
import { AdminTimeSlotsClient } from './AdminTimeSlotsClient';

export const metadata = {
  title: 'Time Slot Management — ION HUB Admin',
};

export default async function AdminTimeSlotsPage() {
  const slots = await db.getTimeSlots();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0EBDD]/70 pb-4">
        <h2 className="text-2xl font-black text-[#12312C]">Time Slots & Evening Capacity Management</h2>
        <p className="text-xs text-[#5A7065] mt-1">
          Adjust doorstep arrival windows and vehicle/garment dispatch limits in Kompally.
        </p>
      </div>

      <AdminTimeSlotsClient initialSlots={slots} />
    </div>
  );
}
