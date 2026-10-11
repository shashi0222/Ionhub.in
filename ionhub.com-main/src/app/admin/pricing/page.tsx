import React from 'react';
import { db } from '@/lib/db';
import { AdminPricingManager } from './AdminPricingManager';

export const metadata = {
  title: 'Ironing Pricing & Promotions Management — ION HUB Admin',
  description: 'Manage per-order ironing prices, loyalty promotion rules, monthly plans, overage rates, and view live database stats.',
};

export default async function AdminPricingPage() {
  const [config, plans, stats, auditLogs] = await Promise.all([
    db.getIroningConfig(),
    db.getSubscriptionPlans(),
    db.getAdminPricingStats(),
    db.getAuditLogs(20),
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0EBDD]/70 pb-4">
        <h2 className="text-2xl font-black text-[#12312C]">Ironing Pricing & Promotions Management</h2>
        <p className="text-xs text-[#5A7065] mt-1">
          Configure per-pair ironing prices, customer loyalty promotions, monthly subscription tiers, and live revenue analytics.
        </p>
      </div>

      <AdminPricingManager
        initialConfig={config}
        initialPlans={plans}
        stats={stats}
        auditLogs={auditLogs}
      />
    </div>
  );
}
