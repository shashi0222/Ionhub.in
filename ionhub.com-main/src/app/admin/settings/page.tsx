import React from 'react';
import { db } from '@/lib/db';
import { AdminSettingsClient } from './AdminSettingsClient';

export const metadata = {
  title: 'Business Settings & Service Areas — ION HUB Admin',
};

export default async function AdminSettingsPage() {
  const [areas, hours, messages] = await Promise.all([
    db.getServiceAreas(),
    db.getBusinessHours(),
    db.getContactMessages(),
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0EBDD]/70 pb-4">
        <h2 className="text-2xl font-black text-[#12312C]">Business Settings & Operational Control</h2>
        <p className="text-xs text-[#5A7065] mt-1">
          Manage service areas (Kompally), operating hours, and customer contact queries.
        </p>
      </div>

      <AdminSettingsClient
        initialAreas={areas}
        initialHours={hours}
        initialMessages={messages}
      />
    </div>
  );
}
