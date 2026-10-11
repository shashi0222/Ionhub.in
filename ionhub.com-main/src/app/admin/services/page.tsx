import React from 'react';
import { db } from '@/lib/db';
import { AdminServicesClient } from './AdminServicesClient';

export const metadata = {
  title: 'Service Management — ION HUB Admin',
};

export default async function AdminServicesPage() {
  const services = await db.getServices();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0EBDD]/70 pb-4">
        <h2 className="text-2xl font-black text-[#12312C]">Doorstep Service Catalog Management</h2>
        <p className="text-xs text-[#5A7065] mt-1">
          Activate, deactivate, change quotes, pricing, and descriptions for car wash, ironing, and upcoming home services.
        </p>
      </div>

      <AdminServicesClient initialServices={services} />
    </div>
  );
}
