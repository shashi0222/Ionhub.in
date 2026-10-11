import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/EmptyState';
import { 
  CalendarClock, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Car, 
  Shirt, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Users
} from 'lucide-react';

export const metadata = {
  title: 'Admin Overview — ION HUB Console',
};

export default async function AdminOverviewPage() {
  const [bookings, services, profiles, messages] = await Promise.all([
    db.getBookings(),
    db.getServices(),
    db.getProfiles(),
    db.getContactMessages(),
  ]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter((b) => b.booking_date === todayStr);
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const activeServices = services.filter((s) => s.is_active);
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');

  const stats = [
    {
      title: "Today's Bookings",
      value: todayBookings.length,
      desc: 'Scheduled for doorstep delivery today',
      icon: CalendarClock,
      color: 'text-[#0B4F47]',
      bg: 'bg-[#EAF5E8]',
    },
    {
      title: 'Pending Confirmation',
      value: pendingBookings.length,
      desc: 'Awaiting scheduling / dispatch',
      icon: Clock,
      color: 'text-amber-700',
      bg: 'bg-amber-100',
    },
    {
      title: 'Active Doorstep Services',
      value: activeServices.length,
      desc: 'Car Wash, Ironing in Kompally',
      icon: Sparkles,
      color: 'text-[#3E8E4A]',
      bg: 'bg-[#EAF5E8]',
    },
    {
      title: 'Completed Bookings',
      value: completedBookings.length,
      desc: 'Delivered successfully',
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bg: 'bg-emerald-100',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-[#E0EBDD] shadow-soft space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5A7065] uppercase">{s.title}</span>
                <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-[#12312C]">{s.value}</span>
                <p className="text-[11px] text-[#5A7065] mt-1">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Urgent Attention Section (Pending Bookings & Unread Inquiries) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Operations */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-[#E0EBDD]/60 pb-4">
            <div>
              <h2 className="text-lg font-black text-[#12312C]">Recent Doorstep Bookings</h2>
              <p className="text-xs text-[#5A7065]">Real database records with live status workflow</p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-[#0B4F47] hover:underline flex items-center gap-1"
            >
              <span>Manage All ({bookings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <EmptyState
              title="No bookings in the system yet."
              description="When a customer places a doorstep car wash or ironing booking, it will appear here for assignment and status updates."
            />
          ) : (
            <div className="divide-y divide-[#E0EBDD]/60">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center">
                      {b.service?.slug === 'car-wash' ? (
                        <Car className="w-5 h-5 text-[#3E8E4A]" />
                      ) : (
                        <Shirt className="w-5 h-5 text-[#3E8E4A]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#0B4F47]">
                          #{b.booking_reference}
                        </span>
                        <span className="text-xs font-black text-[#12312C]">
                          {b.service?.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5A7065] flex items-center gap-2 mt-0.5">
                        <span>{b.user?.full_name || 'Guest Customer'}</span>
                        <span>•</span>
                        <span>{formatDate(b.booking_date)}</span>
                        <span>•</span>
                        <span>{b.time_slot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        b.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-[#EAF5E8] text-[#0B4F47]'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                    <Link
                      href={`/admin/bookings?id=${b.id}`}
                      className="px-3 py-1.5 rounded-xl border border-[#0B4F47] text-[#0B4F47] hover:bg-[#EAF5E8] text-xs font-bold transition"
                    >
                      Update Status
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contact Inquiries */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E0EBDD] shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-[#E0EBDD]/60 pb-3">
            <h3 className="text-sm font-black text-[#12312C]">Contact Inquiries</h3>
            <span className="text-xs font-bold text-[#3E8E4A]">{messages.length} messages</span>
          </div>

          {messages.length === 0 ? (
            <p className="text-xs text-[#5A7065] py-4 text-center">No contact inquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 4).map((m) => (
                <div key={m.id} className="p-3 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#12312C]">{m.name}</span>
                    <span className="text-[10px] text-[#5A7065]">{m.phone}</span>
                  </div>
                  <p className="text-xs text-[#5A7065] line-clamp-2">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
