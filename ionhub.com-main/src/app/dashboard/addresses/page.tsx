import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { AddressesClient } from './AddressesClient';

export const metadata = {
  title: 'My Addresses — ION HUB Customer Portal',
  description: 'Manage your saved doorstep pickup and delivery addresses in Kompally.',
};

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const addresses = await db.getUserAddresses(user.id);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0EBDD]/70 pb-4">
        <h2 className="text-2xl font-black text-[#12312C]">Saved Addresses</h2>
        <p className="text-xs text-[#5A7065] mt-1">
          Store your residences and office locations for effortless 1-click doorstep appointment bookings.
        </p>
      </div>

      <AddressesClient initialAddresses={addresses} />
    </div>
  );
}
