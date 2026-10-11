import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  CalendarClock, 
  Sparkles, 
  Users, 
  Clock, 
  Settings, 
  LogOut, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    return (
      <div className="py-24 bg-[#FAF9F2] min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-red-200 text-center shadow-soft space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#12312C]">Access Restricted</h2>
          <p className="text-xs text-[#5A7065] leading-relaxed">
            You don&apos;t have administrative permissions to view the ION HUB operational control center.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="py-2.5 px-4 rounded-xl bg-[#0B4F47] text-white text-xs font-bold hover:bg-[#176B5D] transition"
            >
              Log in with Admin Account
            </Link>
            <Link
              href="/"
              className="py-2.5 px-4 rounded-xl border border-[#E0EBDD] text-xs font-bold text-[#5A7065]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminNav = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Ironing Pricing & Promotions', href: '/admin/pricing', icon: Sparkles },
    { name: 'Bookings Management', href: '/admin/bookings', icon: CalendarClock },
    { name: 'Services Catalog', href: '/admin/services', icon: Sparkles },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Time Slots', href: '/admin/time-slots', icon: Clock },
    { name: 'Settings & Areas', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="py-8 bg-[#FAF9F2] min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header Banner */}
        <div className="bg-[#12312C] rounded-3xl p-6 sm:p-8 text-white border border-[#176B5D]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0B4F47] border border-[#3E8E4A]/40 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#3E8E4A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">ION HUB Operations Admin</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#3E8E4A] text-slate-950 font-black text-[10px] uppercase">
                  Live
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Doorstep Car Wash & Ironing Management • {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#3E8E4A]" />
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="bg-white rounded-2xl p-2 border border-[#E0EBDD] flex items-center gap-2 overflow-x-auto shadow-xs">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#12312C] hover:bg-[#FAF9F2] hover:text-[#0B4F47] transition flex items-center gap-2 whitespace-nowrap flex-shrink-0"
              >
                <Icon className="w-4 h-4 text-[#3E8E4A]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Admin Main Body */}
        <div>{children}</div>

      </div>
    </div>
  );
}
