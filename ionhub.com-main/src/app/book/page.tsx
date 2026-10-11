import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { BookingWizard } from './BookingWizard';
import { CardSkeleton } from '@/components/LoadingState';

export const metadata = {
  title: 'Book a Doorstep Service — Car Wash & Ironing | ION HUB Kompally',
  description: 'Book doorstep car wash or professional ironing in Kompally. ₹25 per pair, every 5th order free, or monthly subscription plans with evening slots between 6 PM and 11 PM.',
};

export default async function BookPage() {
  const currentUser = await getCurrentUser();

  // Workers are operational specialists and manage assigned orders in /worker
  if (currentUser?.role === 'worker') {
    redirect('/worker');
  }

  const [services, timeSlots, serviceAreas, ironingConfig, subscriptionPlans] = await Promise.all([
    db.getServices(),
    db.getTimeSlots(),
    db.getServiceAreas(),
    db.getIroningConfig(),
    db.getSubscriptionPlans(),
  ]);

  const userAddresses = currentUser ? await db.getUserAddresses(currentUser.id) : [];
  const activeSubscription = currentUser ? await db.getUserActiveSubscription(currentUser.id) : null;
  const loyaltyProgress = currentUser ? await db.getUserLoyaltyProgress(currentUser.id) : null;

  return (
    <div className="py-12 bg-[#FAF9F2] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold uppercase tracking-wider mb-2">
            Doorstep Care Booking
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#12312C] tracking-tight">
            Book Doorstep Service
          </h1>
          <p className="text-xs text-[#5A7065] mt-1.5">
            Serving Kompally daily between 6:00 PM and 11:00 PM • Transparent pricing & loyalty rewards.
          </p>
        </div>

        <Suspense fallback={<CardSkeleton />}>
          <BookingWizard
            services={services}
            timeSlots={timeSlots}
            serviceAreas={serviceAreas}
            currentUser={currentUser}
            userAddresses={userAddresses}
            ironingConfig={ironingConfig}
            subscriptionPlans={subscriptionPlans}
            activeSubscription={activeSubscription}
            loyaltyProgress={loyaltyProgress}
          />
        </Suspense>
      </div>
    </div>
  );
}
