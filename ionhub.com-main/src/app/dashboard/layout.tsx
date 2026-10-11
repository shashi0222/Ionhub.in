import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import { 
  LayoutDashboard, 
  CalendarClock, 
  MapPin, 
  User, 
  LogOut, 
  CalendarPlus, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  return (
    <div className="py-10 bg-[#FAF9F2] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top greeting bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0B4F47] text-[#EAF5E8] flex items-center justify-center font-black text-xl">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#12312C]">
                  Welcome, {user.full_name}!
                </h1>
                {user.role === 'admin' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5A7065] mt-0.5">{user.email} • {user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}
            <Link
              href="/book"
              className="px-5 py-2.5 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-extrabold transition shadow-sm flex items-center gap-1.5"
            >
              <CalendarPlus className="w-4 h-4 text-[#3E8E4A]" />
              <span>Book New Service</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Nav */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-3xl p-4 border border-[#E0EBDD] shadow-soft space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-[#12312C] hover:bg-[#FAF9F2] hover:text-[#0B4F47] transition"
              >
                <LayoutDashboard className="w-4 h-4 text-[#3E8E4A]" />
                <span>Overview</span>
              </Link>

              <Link
                href="/dashboard/bookings"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-[#12312C] hover:bg-[#FAF9F2] hover:text-[#0B4F47] transition"
              >
                <CalendarClock className="w-4 h-4 text-[#3E8E4A]" />
                <span>Booking History & Tracking</span>
              </Link>

              <Link
                href="/dashboard/addresses"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-[#12312C] hover:bg-[#FAF9F2] hover:text-[#0B4F47] transition"
              >
                <MapPin className="w-4 h-4 text-[#3E8E4A]" />
                <span>Saved Addresses</span>
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-[#12312C] hover:bg-[#FAF9F2] hover:text-[#0B4F47] transition"
              >
                <User className="w-4 h-4 text-[#3E8E4A]" />
                <span>Account Profile</span>
              </Link>

              <div className="pt-2 border-t border-[#E0EBDD]/60 mt-2">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Service Area Card */}
            <div className="bg-[#FAF9F2] rounded-3xl p-5 border border-[#E0EBDD] space-y-2">
              <span className="text-[10px] font-bold text-[#3E8E4A] uppercase tracking-wider block">
                Doorstep Zone
              </span>
              <h4 className="text-sm font-bold text-[#12312C]">Kompally, Hyderabad</h4>
              <p className="text-xs text-[#5A7065] leading-relaxed">
                Operating daily 6:00 PM – 11:00 PM. Weekends available for scheduled car washes & ironing pickups.
              </p>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="lg:col-span-9">{children}</main>

        </div>

      </div>
    </div>
  );
}
