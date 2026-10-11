import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { 
  Shirt, 
  Sparkles, 
  Calendar, 
  Check, 
  Clock, 
  MapPin, 
  Leaf, 
  ShieldCheck, 
  ArrowRight,
  PackageCheck,
  Bike,
  Gift,
  Zap,
  Tag,
  BadgePercent
} from 'lucide-react';

export const metadata = {
  title: 'Professional Doorstep Ironing in Kompally — ₹25 Per Pair & Monthly Plans | ION HUB',
  description: 'Crisp, wrinkle-free clothes at ₹25 per pair. 5th order free promotional offer and monthly subscription plans starting at ₹199/month with doorstep pickup in Kompally.',
};

export default async function IroningPage() {
  const config = await db.getIroningConfig();
  const plans = await db.getSubscriptionPlans();

  const garments = [
    { title: 'Shirts', desc: 'Crisp collars, sleeves, and wrinkle-free body pressing.' },
    { title: 'Trousers & Chinos', desc: 'Sharp center crease or modern flat pressing as preferred.' },
    { title: 'Formal Wear & Blazers', desc: 'Delicate temperature-controlled steaming for delicate fabrics.' },
    { title: 'Other Suitable Garments', desc: 'Kurtas, ethnic dresses, bed linens, sarees, and everyday wear.' },
  ];

  const steps = [
    { num: '1', title: 'BOOK', desc: 'Choose pay-per-order (₹25/pair) or your monthly subscription plan.' },
    { num: '2', title: 'PICKUP', desc: 'We collect your clothes directly from your doorstep in Kompally.' },
    { num: '3', title: 'IRON', desc: 'Professional pressing with steam & temperature control.' },
    { num: '4', title: 'DELIVER', desc: 'Neatly packed and returned ready to hang in your wardrobe.' },
  ];

  const pricingExamples = [
    { pairs: 1, total: 25 },
    { pairs: 2, total: 50 },
    { pairs: 3, total: 75 },
    { pairs: 4, total: 100 },
  ];

  return (
    <div className="py-12 lg:py-16 bg-[#FAF9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold uppercase tracking-wider">
              <Shirt className="w-3.5 h-3.5 text-[#3E8E4A]" /> Professional Ironing • Doorstep Service
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#12312C] tracking-tight leading-tight">
              Your Clothes.{' '}
              <span className="text-[#0B4F47] block sm:inline">Our Care.</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-block px-3.5 py-1.5 rounded-lg bg-[#EAF5E8] text-[#0B4F47] font-extrabold text-sm border border-[#3E8E4A]/30">
                ₹{config.price_per_pair} per pair of garments
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200">
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Every 5th Order FREE!</span>
              </div>
            </div>

            <p className="text-base sm:text-lg text-[#5A7065] leading-relaxed max-w-xl">
              Zero ironing hassle. Book pay-per-order at just ₹{config.price_per_pair} per pair, or save more with our monthly garment care subscriptions with free doorstep pickup & delivery in Kompally.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E0EBDD] text-xs font-semibold text-[#0B4F47]">
                <Bike className="w-3.5 h-3.5 text-[#3E8E4A]" /> Doorstep Pickup & Delivery
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E0EBDD] text-xs font-semibold text-[#0B4F47]">
                <Clock className="w-3.5 h-3.5 text-[#3E8E4A]" /> Daily 6 PM – 11 PM
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E0EBDD] text-xs font-semibold text-[#0B4F47]">
                <Leaf className="w-3.5 h-3.5 text-[#3E8E4A]" /> Eco-Friendly Packing
              </span>
            </div>

            {/* Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/book?service=ironing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#0B4F47] hover:bg-[#176B5D] text-white font-black text-sm tracking-wide shadow-lg transition-transform transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4 text-[#3E8E4A]" />
                <span>BOOK IRONING (₹25/PAIR)</span>
              </Link>
              <Link
                href="#subscription-plans"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white border border-[#0B4F47] text-[#0B4F47] hover:bg-[#EAF5E8] font-bold text-sm transition"
              >
                <Zap className="w-4 h-4 text-[#3E8E4A]" />
                <span>VIEW MONTHLY PLANS</span>
              </Link>
            </div>
            <div className="text-xs text-[#5A7065] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#3E8E4A]" /> Kompally Doorstep Service Area
            </div>
          </div>

          {/* Creative Image Preview */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
              <div className="relative h-96 sm:h-[480px] w-full">
                <Image
                  src="/brand/creative_ironing.jpeg"
                  alt="ION HUB Ironing Creative"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* 1. PER-ORDER PRICING SHOWCASE */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E0EBDD] shadow-soft space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#3E8E4A] uppercase tracking-wider">
              Transparent & Simple Pricing
            </span>
            <h2 className="text-3xl font-black text-[#12312C] mt-1">
              ₹25 Per Pair of Garments
            </h2>
            <p className="text-sm text-[#5A7065] mt-2">
              Formula: <strong>Total Ironing Price = Number of pairs × ₹25</strong>. 
              No hidden fees, no surge charges. Select the exact number of pairs during booking.
            </p>
            <p className="text-xs text-[#5A7065]/90 mt-1 italic">
              * Note: One pair represents the business-defined standard pair of garments ({config.pair_definition}).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {pricingExamples.map((ex) => (
              <div
                key={ex.pairs}
                className="p-5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] text-center hover:border-[#3E8E4A] transition"
              >
                <span className="text-xs font-bold text-[#5A7065] block uppercase">
                  {ex.pairs} {ex.pairs === 1 ? 'Pair' : 'Pairs'}
                </span>
                <span className="text-2xl font-black text-[#0B4F47] mt-1 block">
                  ₹{ex.total}
                </span>
                <span className="text-[11px] text-[#5A7065] mt-1 block">
                  {ex.pairs} × ₹25
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#EAF5E8]/60 border border-[#3E8E4A]/30">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-[#0B4F47] flex-shrink-0" />
              <p className="text-xs sm:text-sm text-[#12312C]">
                Ready to book? Enter any quantity of pairs in the booking wizard to see the instant live subtotal and schedule your pickup.
              </p>
            </div>
            <Link
              href="/book?service=ironing"
              className="px-6 py-2.5 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white font-bold text-xs whitespace-nowrap shadow"
            >
              Book Now →
            </Link>
          </div>
        </div>

        {/* 2. PROMOTIONAL LOYALTY BANNER — EVERY 5TH ORDER FREE */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B4F47] via-[#12312C] to-[#0B4F47] p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E8E4A] text-slate-950 font-black text-xs uppercase tracking-wider">
              <BadgePercent className="w-4 h-4" /> Customer Loyalty Reward
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Your 5th Ironing Order Is FREE!
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Place <strong>4 eligible paid ironing orders</strong>, and your <strong>5th eligible ironing order is 100% FREE</strong>! 
              We track your completed paid orders automatically in your customer dashboard.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#3E8E4A]" /> Automatic progress tracking (e.g. 3 of 4 completed)
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#3E8E4A]" /> Instant 100% discount reward applied at checkout
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#3E8E4A]" /> Full worker payouts protected
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/book?service=ironing"
                className="px-7 py-3 rounded-full bg-[#3E8E4A] hover:bg-[#34783f] text-white font-black text-xs uppercase tracking-wider shadow-lg transition"
              >
                Start Earning Free Orders
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
              >
                Track My Rewards Progress →
              </Link>
            </div>
          </div>
        </div>

        {/* 3. MONTHLY IRONING SUBSCRIPTION PLANS */}
        <div id="subscription-plans" className="space-y-8 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#3E8E4A] uppercase tracking-wider">
              Consistent Care • Maximum Savings
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#12312C]">
              Monthly Ironing Subscription Plans
            </h2>
            <p className="text-sm text-[#5A7065]">
              Choose the perfect plan tailored to your wardrobe routine. Enjoy guaranteed pickup slots, dedicated garment pressing, and simple monthly billing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p) => {
              const isPopular = p.slug === 'standard';
              return (
                <div
                  key={p.id}
                  className={`relative rounded-3xl p-8 bg-white border flex flex-col justify-between transition-all hover:shadow-xl ${
                    isPopular
                      ? 'border-[#0B4F47] shadow-lg ring-2 ring-[#0B4F47]/20 scale-105 z-10'
                      : 'border-[#E0EBDD] shadow-soft'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0B4F47] text-white text-[11px] font-black uppercase tracking-wider shadow">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-[#3E8E4A] uppercase tracking-wider">
                        Plan {p.slug.toUpperCase()}
                      </span>
                      <h3 className="text-2xl font-black text-[#12312C] mt-0.5">{p.name}</h3>
                      <p className="text-xs text-[#5A7065] mt-1 min-h-[36px]">{p.description}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-[#0B4F47]">₹{p.monthly_price}</span>
                        <span className="text-xs text-[#5A7065] font-semibold">/ month</span>
                      </div>
                      <span className="text-xs font-bold text-[#12312C] block mt-1">
                        {p.garment_allowance} {p.slug === 'premium' ? 'or more garments' : 'garments'} / month
                      </span>
                    </div>

                    {/* Inclusions */}
                    <ul className="space-y-2.5 text-xs text-[#12312C]">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0" />
                        <span>Included Allowance: <strong>{p.garment_allowance} Garments</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0" />
                        <span>Doorstep pickup & delivery included</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0" />
                        <span>1-Month validity with live balance meter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0" />
                        <span>Notifications at 75%, 90% & 100% usage</span>
                      </li>
                      {p.slug === 'premium' && (
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0" />
                          <span>{p.allowance_type === 'unlimited' ? 'Unlimited Garment Allowance' : 'Configurable fixed high allowance (40+)'}</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E0EBDD]/70">
                    <Link
                      href={`/book?service=ironing&plan=${p.slug}`}
                      className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                        isPopular
                          ? 'bg-[#0B4F47] hover:bg-[#176B5D] text-white shadow-md'
                          : 'bg-[#FAF9F2] hover:bg-[#EAF5E8] border border-[#E0EBDD] text-[#0B4F47]'
                      }`}
                    >
                      <span>Choose {p.name} Plan</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E0EBDD] text-center max-w-xl mx-auto text-xs text-[#5A7065]">
            Need extra garments beyond your plan allowance? Additional garments are easily handled at the configured overage rate of ₹15 per garment.
          </div>
        </div>

        {/* What Can You Iron? Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E0EBDD] shadow-soft">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#3E8E4A] uppercase tracking-wider">
              Garment Care Standards
            </span>
            <h2 className="text-3xl font-black text-[#12312C] mt-1">
              What Can You Iron?
            </h2>
            <p className="text-xs text-[#5A7065] mt-2">
              From everyday office shirts to high-maintenance ethnic and formal wear.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {garments.map((g, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] flex flex-col justify-between hover:border-[#3E8E4A] transition"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center mb-3">
                    <Shirt className="w-5 h-5 text-[#3E8E4A]" />
                  </div>
                  <h4 className="text-base font-bold text-[#12312C]">{g.title}</h4>
                  <p className="text-xs text-[#5A7065] mt-1.5 leading-relaxed">{g.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E0EBDD]/60 flex items-center gap-1.5 text-[11px] text-[#3E8E4A] font-bold">
                  <Check className="w-3.5 h-3.5" /> Handled with Care
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Step Process Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-[#12312C] mb-8">
            How Doorstep Ironing Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => (
              <div
                key={st.num}
                className="p-6 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] text-left relative"
              >
                <span className="text-xs font-black text-[#3E8E4A] bg-[#EAF5E8] px-2.5 py-0.5 rounded-full inline-block mb-3">
                  STAGE {st.num}
                </span>
                <h3 className="text-lg font-black text-[#0B4F47]">{st.title}</h3>
                <p className="text-xs text-[#5A7065] mt-1.5 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-[#0B4F47] rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-black">Neat, Crisp & Wrinkle-Free Clothes</h3>
            <p className="text-xs text-[#EAF5E8]/80">Doorstep collection between 6:00 PM and 11:00 PM in Kompally. ₹25 per pair.</p>
          </div>
          <Link
            href="/book?service=ironing"
            className="flex-shrink-0 px-8 py-3.5 rounded-full bg-[#3E8E4A] hover:bg-[#34783f] text-white font-extrabold text-sm shadow-md transition"
          >
            BOOK IRONING NOW
          </Link>
        </div>

      </div>
    </div>
  );
}
