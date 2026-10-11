import React from 'react';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { WorkerOrderCard } from './WorkerOrderCard';
import { EmptyState } from '@/components/EmptyState';
import { 
  Bike, 
  Shirt, 
  Car, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  Gift,
  Zap
} from 'lucide-react';

export const metadata = {
  title: 'Specialist Worker Portal — Doorstep Distribution | ION HUB',
  description: 'Specialist worker order queue, pickup delivery management, customer instructions, and configured payouts.',
};

export default async function WorkerDashboardPage() {
  const user = await getCurrentUser();
  const bookings = await db.getWorkerBookings();

  const pendingOrActive = bookings.filter((b) => !['COMPLETED', 'CANCELLED'].includes(b.status));
  const completedToday = bookings.filter((b) => b.status === 'COMPLETED');
  
  const totalPayoutEarned = completedToday.reduce((acc, curr) => acc + (curr.worker_payout || 0), 0);
  const totalPayoutPending = pendingOrActive.reduce((acc, curr) => acc + (curr.worker_payout || 0), 0);

  return (
    <div className="space-y-8">
      
      {/* 1. Worker Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#E0EBDD] shadow-soft">
          <span className="text-[11px] font-bold text-[#5A7065] uppercase block">
            Assigned Queue
          </span>
          <span className="text-3xl font-black text-[#0B4F47] block mt-1">
            {pendingOrActive.length}
          </span>
          <span className="text-xs text-[#5A7065]">Orders in progress</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E0EBDD] shadow-soft">
          <span className="text-[11px] font-bold text-[#5A7065] uppercase block">
            Completed Orders
          </span>
          <span className="text-3xl font-black text-[#3E8E4A] block mt-1">
            {completedToday.length}
          </span>
          <span className="text-xs text-[#5A7065]">Delivered successfully</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#EAF5E8] border border-[#3E8E4A]/30 shadow-soft">
          <span className="text-[11px] font-black text-[#0B4F47] uppercase block">
            Earned Payouts
          </span>
          <span className="text-3xl font-black text-[#0B4F47] block mt-1">
            ₹{totalPayoutEarned}
          </span>
          <span className="text-[11px] text-[#3E8E4A] font-bold">From completed orders</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E0EBDD] shadow-soft">
          <span className="text-[11px] font-bold text-[#5A7065] uppercase block">
            Pipeline Payouts
          </span>
          <span className="text-3xl font-black text-amber-700 block mt-1">
            ₹{totalPayoutPending}
          </span>
          <span className="text-xs text-[#5A7065]">Upon delivery</span>
        </div>
      </div>

      {/* 2. Worker Payout Model Transparency Notice */}
      <div className="p-4 rounded-2xl bg-white border border-[#E0EBDD] flex items-center justify-between text-xs text-[#5A7065]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3E8E4A]" />
          <span>
            <strong>Configured Payout Policy:</strong> Ironing base ₹20 + ₹15 per pair. Free customer promo orders protect your full payout amount!
          </span>
        </div>
        <span className="font-bold text-[#0B4F47]">Kompally Operational Zone</span>
      </div>

      {/* 3. Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[#12312C] flex items-center gap-2">
            <span>Specialist Order Queue</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold">
              {bookings.length} Orders
            </span>
          </h2>
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            title="No orders in queue."
            description="There are currently no doorstep service bookings waiting for dispatch."
          />
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <WorkerOrderCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
