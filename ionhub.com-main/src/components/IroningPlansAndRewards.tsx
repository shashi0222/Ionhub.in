'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CustomerSubscription, 
  SubscriptionPlan, 
  SubscriptionUsageRecord,
  RewardRedemption,
  FreeOrderReward,
  SubscriptionPlanSlug
} from '@/types/database';
import { subscribePlanAction, cancelSubscriptionAction } from '@/app/actions/booking';
import { 
  Gift, 
  Shirt, 
  Zap, 
  Check, 
  Calendar, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  History,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface IroningPlansAndRewardsProps {
  subscription: CustomerSubscription | null;
  subscriptionPlans: SubscriptionPlan[];
  loyaltyProgress: {
    totalEligiblePaidCount: number;
    completedInCurrentCycle: number;
    requiredForFree: number;
    ordersNeeded: number;
    isRewardAvailable: boolean;
    currentReward: FreeOrderReward | null;
    userRewards: FreeOrderReward[];
    redemptions: RewardRedemption[];
  };
}

export function IroningPlansAndRewards({
  subscription,
  subscriptionPlans,
  loyaltyProgress,
}: IroningPlansAndRewardsProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubscribe = async (slug: SubscriptionPlanSlug) => {
    setLoadingPlan(slug);
    setActionMessage(null);
    const res = await subscribePlanAction(slug);
    setLoadingPlan(null);
    if (res?.error) {
      setActionMessage({ type: 'error', text: res.error });
    } else {
      setActionMessage({ type: 'success', text: 'Plan activated successfully!' });
    }
  };

  const handleCancelSub = async (subId: string) => {
    if (!confirm('Are you sure you want to cancel your monthly ironing subscription?')) return;
    setCancelling(true);
    setActionMessage(null);
    const res = await cancelSubscriptionAction(subId);
    setCancelling(false);
    if (res?.error) {
      setActionMessage({ type: 'error', text: res.error });
    } else {
      setActionMessage({ type: 'success', text: 'Subscription has been cancelled.' });
    }
  };

  const percentUsed = subscription
    ? Math.round((subscription.garments_used / subscription.included_garments) * 100)
    : 0;

  return (
    <div className="space-y-8">
      
      {/* Action Flash Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-xs opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* 1. YOUR IRONING REWARDS (EVERY 5TH ORDER FREE) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0EBDD]/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center">
              <Gift className="w-6 h-6 text-[#3E8E4A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-[#12312C]">Your Ironing Rewards</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase">
                  5th Order Free Promo
                </span>
              </div>
              <p className="text-xs text-[#5A7065] mt-0.5">
                Place 4 eligible paid ironing orders, and your 5th eligible ironing order is FREE!
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-[#5A7065] block uppercase">Eligible Orders Completed</span>
            <span className="text-2xl font-black text-[#0B4F47]">
              {loyaltyProgress.completedInCurrentCycle}/{loyaltyProgress.requiredForFree}
            </span>
          </div>
        </div>

        {/* Progress status or Congratulations unlock */}
        {loyaltyProgress.isRewardAvailable ? (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#EAF5E8] via-[#FAF9F2] to-[#EAF5E8] border border-[#3E8E4A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#3E8E4A] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" /> Reward Unlocked
              </span>
              <h4 className="text-lg font-black text-[#0B4F47]">
                Congratulations! Your free ironing order is available.
              </h4>
              <p className="text-xs text-[#5A7065]">
                Reward Code: <strong>{loyaltyProgress.currentReward?.reward_code}</strong> • Valid until{' '}
                {new Date(loyaltyProgress.currentReward?.expires_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <Link
              href="/book?service=ironing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3E8E4A] hover:bg-[#34783f] text-white font-extrabold text-xs shadow-md transition whitespace-nowrap"
            >
              <span>Book Ironing & Redeem Reward</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#12312C]">
                Progress: {loyaltyProgress.completedInCurrentCycle} of {loyaltyProgress.requiredForFree} eligible orders completed
              </span>
              <span className="text-[#0B4F47]">
                {Math.round((loyaltyProgress.completedInCurrentCycle / loyaltyProgress.requiredForFree) * 100)}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="h-3 bg-[#E0EBDD] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0B4F47] transition-all duration-500 rounded-full"
                style={{
                  width: `${(loyaltyProgress.completedInCurrentCycle / loyaltyProgress.requiredForFree) * 100}%`,
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <p className="text-[#5A7065]">
                Progress message: Complete <strong className="text-[#0B4F47]">{loyaltyProgress.ordersNeeded} more</strong> eligible paid ironing order to unlock your next free ironing order.
              </p>
              <Link
                href="/book?service=ironing"
                className="font-bold text-[#0B4F47] hover:underline flex items-center gap-1"
              >
                <span>Book Now (₹25/pair)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Reward Redemption History */}
        {loyaltyProgress.redemptions && loyaltyProgress.redemptions.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#12312C] uppercase tracking-wider">
              <History className="w-4 h-4 text-[#3E8E4A]" />
              <span>Reward Redemption History</span>
            </div>
            <div className="rounded-2xl border border-[#E0EBDD] overflow-hidden divide-y divide-[#E0EBDD]/60 text-xs">
              {loyaltyProgress.redemptions.map((red) => (
                <div key={red.id} className="p-3 bg-[#FAF9F2] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#12312C] block">
                      Booking: {red.booking_reference}
                    </span>
                    <span className="text-[11px] text-[#5A7065]">
                      Redeemed on {new Date(red.redeemed_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[#3E8E4A] block">
                      -₹{red.discount_amount} (100% Free)
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      Claimed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. CURRENT MONTHLY SUBSCRIPTION STATUS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0EBDD]/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#3E8E4A]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#12312C]">
                {subscription?.plan_slug?.includes('pass') || subscription?.plan_slug?.includes('car')
                  ? 'Current Monthly Car Wash Pass'
                  : 'Current Monthly Ironing Subscription'}
              </h3>
              <p className="text-xs text-[#5A7065] mt-0.5">
                {subscription?.plan_slug?.includes('pass') || subscription?.plan_slug?.includes('car')
                  ? 'Track included vehicle washes, detailing sessions, and renewal dates.'
                  : 'Track included garments, usage balance, and renewal dates in your billing cycle.'}
              </p>
            </div>
          </div>

          {subscription && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                subscription.status === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {subscription.status}
            </span>
          )}
        </div>

        {subscription ? (
          <div className="space-y-6">
            
            {/* Subscription Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD]">
                <span className="text-[10px] font-black text-[#3E8E4A] uppercase tracking-wider block">
                  {subscription.plan_slug?.includes('pass') || subscription.plan_slug?.includes('car')
                    ? '🚗 Car Wash Pass'
                    : '👕 Ironing Service'}
                </span>
                <span className="text-lg font-black text-[#0B4F47] block mt-0.5">
                  {subscription.plan_name}
                </span>
                <span className="text-xs font-semibold text-[#5A7065]">
                  ₹{subscription.monthly_price}/month
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD]">
                <span className="text-[11px] font-bold text-[#5A7065] uppercase block">
                  {subscription.plan_slug?.includes('pass') || subscription.plan_slug?.includes('car')
                    ? 'Included Washes'
                    : 'Included Garments'}
                </span>
                <span className="text-2xl font-black text-[#12312C] block mt-0.5">
                  {subscription.included_garments}
                </span>
                <span className="text-[11px] text-[#5A7065]">Per monthly cycle</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD]">
                <span className="text-[11px] font-bold text-[#5A7065] uppercase block">Garments Used</span>
                <span className="text-2xl font-black text-amber-700 block mt-0.5">
                  {subscription.garments_used}
                </span>
                <span className="text-[11px] text-[#5A7065]">{percentUsed}% utilized</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#EAF5E8] border border-[#3E8E4A]/30">
                <span className="text-[11px] font-bold text-[#0B4F47] uppercase block">Remaining Allowance</span>
                <span className="text-2xl font-black text-[#0B4F47] block mt-0.5">
                  {subscription.garments_remaining}
                </span>
                <span className="text-[11px] text-[#3E8E4A] font-bold">Available to book</span>
              </div>
            </div>

            {/* Allowance Meter & Alerts */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#12312C]">
                <span>Garment Allowance Consumption</span>
                <span>{subscription.garments_used} of {subscription.included_garments} garments</span>
              </div>
              <div className="h-3.5 bg-[#E0EBDD] rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentUsed >= 90
                      ? 'bg-red-500'
                      : percentUsed >= 75
                      ? 'bg-amber-500'
                      : 'bg-[#3E8E4A]'
                  }`}
                  style={{ width: `${Math.min(100, percentUsed)}%` }}
                />
              </div>

              {/* Usage Threshold Notifications */}
              {percentUsed >= 100 && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>You have used 100% of your plan allowance. Further bookings will be billed at ₹15/garment overage rate.</span>
                </div>
              )}
              {percentUsed >= 90 && percentUsed < 100 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>You have used 90% of your garment allowance. Only {subscription.garments_remaining} garments remaining.</span>
                </div>
              )}
              {percentUsed >= 75 && percentUsed < 90 && (
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>You have reached 75% of your garment allowance for this billing cycle.</span>
                </div>
              )}
            </div>

            {/* Dates & Billing Info */}
            <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#5A7065] block">
                  Subscription Start: <strong>{new Date(subscription.start_date).toLocaleDateString()}</strong>
                </span>
                <span className="text-[#5A7065] block">
                  Renewal/Expiry Date: <strong>{new Date(subscription.renewal_date).toLocaleDateString()}</strong>
                </span>
                <span className="text-[#5A7065] block">
                  Payment Status: <strong className="text-emerald-700">{subscription.payment_status}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/book?service=ironing"
                  className="px-4 py-2.5 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white font-bold text-xs shadow-sm transition"
                >
                  Book with Allowance
                </Link>
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={() => handleCancelSub(subscription.id)}
                  className="px-3.5 py-2.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-700 font-bold text-xs transition disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] text-center space-y-3">
            <Shirt className="w-10 h-10 text-[#3E8E4A] mx-auto opacity-70" />
            <h4 className="text-base font-black text-[#12312C]">No Active Monthly Subscription</h4>
            <p className="text-xs text-[#5A7065] max-w-md mx-auto">
              Subscribe to one of our monthly garment care plans below to lock in low per-garment prices and regular doorstep pickup.
            </p>
          </div>
        )}
      </div>

      {/* 3. COMPARE AND SUBSCRIBE TO MONTHLY PLANS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[#12312C]">Compare Monthly Ironing Plans</h3>
            <p className="text-xs text-[#5A7065]">
              Switch or subscribe to a plan that fits your household's laundry schedule.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => {
            const isCurrent = subscription?.plan_slug === plan.slug && subscription.status === 'ACTIVE';
            return (
              <div
                key={plan.id}
                className={`p-6 rounded-3xl bg-white border flex flex-col justify-between transition-all hover:shadow-md ${
                  isCurrent
                    ? 'border-[#0B4F47] ring-2 ring-[#0B4F47]/20 shadow-md'
                    : 'border-[#E0EBDD]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black text-[#3E8E4A] uppercase tracking-wider block">
                        {plan.category === 'car-wash' || plan.slug.includes('pass') ? '🚗 Car Wash Pass' : '👕 Ironing Subscription'}
                      </span>
                      <h4 className="text-xl font-black text-[#12312C] mt-0.5">{plan.name}</h4>
                    </div>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5E8] text-[#0B4F47] font-black text-[10px] uppercase">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#5A7065]">{plan.description}</p>

                  <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#0B4F47]">₹{plan.monthly_price}</span>
                      <span className="text-xs text-[#5A7065]">/ month</span>
                    </div>
                    <span className="text-xs font-bold text-[#12312C] block mt-1">
                      {plan.garment_allowance} garments included
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-[#12312C]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#3E8E4A]" />
                      <span>{plan.garment_allowance} garments / month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#3E8E4A]" />
                      <span>Doorstep pickup & delivery</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#3E8E4A]" />
                      <span>Overage rate: ₹15 / garment</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E0EBDD]/60">
                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-xl bg-slate-100 text-[#5A7065] font-bold text-xs uppercase cursor-default"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={loadingPlan === plan.slug}
                      onClick={() => handleSubscribe(plan.slug)}
                      className="w-full py-3 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white font-extrabold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loadingPlan === plan.slug ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Activating...</span>
                        </>
                      ) : (
                        <span>{subscription ? `Switch to ${plan.name}` : `Subscribe to ${plan.name}`}</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
