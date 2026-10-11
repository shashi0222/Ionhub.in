import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { BookingStatusTracker } from '@/components/BookingStatusTracker';
import { EmptyState } from '@/components/EmptyState';
import { IroningPlansAndRewards } from '@/components/IroningPlansAndRewards';
import { formatPrice, formatDate } from '@/lib/utils';
import { 
  CalendarPlus, 
  MapPin, 
  Clock, 
  CalendarClock, 
  User, 
  ArrowRight, 
  Car, 
  Shirt, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const metadata = {
  title: 'Customer Dashboard — ION HUB',
};

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [bookings, addresses, activeSubscription, subscriptionPlans, loyaltyProgress] = await Promise.all([
    db.getUserBookings(user.id),
    db.getUserAddresses(user.id),
    db.getUserActiveSubscription(user.id),
    db.getSubscriptionPlans(),
    db.getUserLoyaltyProgress(user.id),
  ]);

  // Active or most recent upcoming booking
  const activeBooking = bookings.find(
    (b) => !['COMPLETED', 'CANCELLED'].includes(b.status)
  );

  return (
    <div className="space-y-10">
      
      {/* 1. Quick Actions Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/book"
          className="p-4 rounded-2xl bg-white border border-[#E0EBDD] hover:border-[#0B4F47] hover:shadow-sm transition flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <CalendarPlus className="w-5 h-5 text-[#3E8E4A]" />
          </div>
          <span className="text-xs font-bold text-[#12312C]">Book Service</span>
          <span className="text-[10px] text-[#5A7065]">Kompally doorstep</span>
        </Link>

        <Link
          href="/dashboard/bookings"
          className="p-4 rounded-2xl bg-white border border-[#E0EBDD] hover:border-[#0B4F47] hover:shadow-sm transition flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <CalendarClock className="w-5 h-5 text-[#3E8E4A]" />
          </div>
          <span className="text-xs font-bold text-[#12312C]">View Bookings</span>
          <span className="text-[10px] text-[#5A7065]">{bookings.length} recorded</span>
        </Link>

        <Link
          href="/dashboard/addresses"
          className="p-4 rounded-2xl bg-white border border-[#E0EBDD] hover:border-[#0B4F47] hover:shadow-sm transition flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5 text-[#3E8E4A]" />
          </div>
          <span className="text-xs font-bold text-[#12312C]">Manage Address</span>
          <span className="text-[10px] text-[#5A7065]">{addresses.length} saved</span>
        </Link>

        <Link
          href="/dashboard/profile"
          className="p-4 rounded-2xl bg-white border border-[#E0EBDD] hover:border-[#0B4F47] hover:shadow-sm transition flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <User className="w-5 h-5 text-[#3E8E4A]" />
          </div>
          <span className="text-xs font-bold text-[#12312C]">My Profile</span>
          <span className="text-[10px] text-[#5A7065]">Account & security</span>
        </Link>
      </div>

      {/* 2. Active / Upcoming Booking Live Tracker */}
      {activeBooking ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#12312C] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3E8E4A] animate-pulse" />
              Upcoming Doorstep Service
            </h2>
            <Link
              href={`/dashboard/bookings?ref=${activeBooking.booking_reference}`}
              className="text-xs font-bold text-[#0B4F47] hover:underline"
            >
              View Full Details →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0EBDD]/70 pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#0B4F47] bg-[#EAF5E8] px-2.5 py-0.5 rounded-full">
                  REF: {activeBooking.booking_reference}
                </span>
                <h3 className="text-xl font-black text-[#12312C] mt-1">
                  {activeBooking.service?.name}
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-[#5A7065] block">
                  {formatDate(activeBooking.booking_date)}
                </span>
                <span className="text-sm font-extrabold text-[#0B4F47]">
                  {activeBooking.time_slot}
                </span>
              </div>
            </div>

            {/* Live Progress Tracker */}
            <div>
              <span className="text-xs font-bold text-[#12312C] mb-4 block uppercase tracking-wider">
                Live Status Tracker
              </span>
              <BookingStatusTracker status={activeBooking.status} />
            </div>

            {/* Address Details */}
            <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] flex items-center gap-3 text-xs">
              <MapPin className="w-4 h-4 text-[#3E8E4A] flex-shrink-0" />
              <div>
                <strong className="text-[#12312C] block">{activeBooking.address?.address_line}</strong>
                <span className="text-[#5A7065]">
                  {activeBooking.address?.area}, {activeBooking.address?.city} - {activeBooking.address?.pincode}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 3. IRONING PLANS & REWARDS SECTION */}
      <IroningPlansAndRewards
        subscription={activeSubscription}
        subscriptionPlans={subscriptionPlans}
        loyaltyProgress={loyaltyProgress}
      />

      {/* 4. Recent Bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#12312C]">Recent Bookings</h2>
          <Link
            href="/dashboard/bookings"
            className="text-xs font-bold text-[#0B4F47] hover:underline"
          >
            All Bookings ({bookings.length}) →
          </Link>
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            title="No bookings yet."
            description="You haven't scheduled any doorstep car washes or professional ironing appointments yet."
            actionText="Book Your First Service"
            actionHref="/book"
          />
        ) : (
          <div className="bg-white rounded-3xl border border-[#E0EBDD] overflow-hidden shadow-soft divide-y divide-[#E0EBDD]/60">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF9F2] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center">
                    {booking.service?.slug === 'car-wash' ? (
                      <Car className="w-5 h-5 text-[#3E8E4A]" />
                    ) : (
                      <Shirt className="w-5 h-5 text-[#3E8E4A]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#12312C]">{booking.service?.name}</h4>
                    <p className="text-xs text-[#5A7065]">
                      {formatDate(booking.booking_date)} • {booking.time_slot}
                      {booking.pricing_type === 'SUBSCRIPTION'
                        ? (booking.service?.slug === 'car-wash' || booking.subscription_id_applied?.includes('pass')
                            ? ' • 🚗 Car Wash Monthly Pass'
                            : ' • 👕 Ironing Monthly Subscription')
                        : (booking.pairs_count ? ` • ${booking.pairs_count} pairs` : '')}
                      {booking.discount_amount && booking.discount_amount > 0 ? ' • 🎁 100% Free Order' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#0B4F47] block">
                      {booking.booking_reference}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                        booking.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-[#EAF5E8] text-[#0B4F47]'
                      }`}
                    >
                      {booking.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/bookings?ref=${booking.booking_reference}`}
                    className="p-2 rounded-xl border border-[#E0EBDD] hover:bg-white text-[#0B4F47]"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
