import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { 
  Car, 
  Sparkles, 
  Calendar, 
  Check, 
  Clock, 
  MapPin, 
  Leaf, 
  ShieldCheck, 
  ArrowRight,
  Droplets,
  Wind
} from 'lucide-react';

export const metadata = {
  title: 'Doorstep Car Wash in Kompally — Clean Cars. Happier Drives | ION HUB',
  description: 'Book premium doorstep car wash in Kompally, Hyderabad. Exterior foam wash, interior vacuuming, dashboard care, and tire gloss. 6 PM – 11 PM daily.',
};

export default async function CarWashPage() {
  const service = await db.getServiceBySlug('car-wash');

  const inclusions = [
    { title: 'Exterior Wash & Dry', desc: 'Gentle high-pressure foam rinse with streak-free microfiber drying.' },
    { title: 'Interior Vacuuming', desc: 'Complete vacuuming of floor mats, seat crevices, and carpet boot space.' },
    { title: 'Dashboard & Trim Cleaning', desc: 'Anti-static dust removal and UV protective non-greasy conditioning.' },
    { title: 'Tire & Rim Cleaning', desc: 'Brake dust removal, rim detailing and deep protective tire gloss.' },
    { title: 'Spotless Finish', desc: 'Crystal clear glass cleaning inside-out and spotless body buff.' },
  ];

  const steps = [
    { num: '1', title: 'BOOK', desc: 'Choose your car wash service and preferred evening time slot.' },
    { num: '2', title: 'PICKUP', desc: 'We collect your vehicle right at your apartment or doorstep.' },
    { num: '3', title: 'WASH', desc: 'Professional cleaning, interior vacuuming and spotless care.' },
    { num: '4', title: 'DELIVER', desc: 'Your car returned sparkling clean, fresh, and ready to drive!' },
  ];

  return (
    <div className="py-12 lg:py-16 bg-[#FAF9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold uppercase tracking-wider">
              <Car className="w-3.5 h-3.5 text-[#3E8E4A]" /> Doorstep Car Wash • Kompally
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#12312C] tracking-tight leading-tight">
              Clean Cars.{' '}
              <span className="text-[#0B4F47] block sm:inline">Happier Drives.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5A7065] leading-relaxed max-w-xl">
              Book your car wash service, and let ION HUB handle the rest — from doorstep collection to delivering a spotless, gleaming vehicle right back to you.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E0EBDD] text-xs font-semibold text-[#0B4F47]">
                <Leaf className="w-3.5 h-3.5 text-[#3E8E4A]" /> Eco-Friendly Products
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E0EBDD] text-xs font-semibold text-[#0B4F47]">
                <Clock className="w-3.5 h-3.5 text-[#3E8E4A]" /> 6 PM – 11 PM Daily
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E0EBDD] text-xs font-semibold text-[#0B4F47]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3E8E4A]" /> Safe & Gentle Cleaning
              </span>
            </div>

            {/* Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/book?service=car-wash"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#0B4F47] hover:bg-[#176B5D] text-white font-black text-sm tracking-wide shadow-lg transition-transform transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4 text-[#3E8E4A]" />
                <span>BOOK CAR WASH</span>
              </Link>
              <a
                href="#monthly-passes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-[#EAF5E8] border border-[#E0EBDD] text-[#0B4F47] font-bold text-sm tracking-wide shadow-sm transition"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>VIEW MONTHLY PASSES</span>
              </a>
            </div>
            <div className="text-xs text-[#5A7065] flex items-center gap-1.5 pt-1">
              <MapPin className="w-4 h-4 text-[#3E8E4A]" /> Dedicated Service Zone: Kompally
            </div>
          </div>

          {/* Hero Creative Preview */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
              <div className="relative h-96 sm:h-[480px] w-full">
                <Image
                  src="/brand/creative_carwash.jpeg"
                  alt="ION HUB Car Wash Creative"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* What's Included Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E0EBDD] shadow-soft">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#3E8E4A] uppercase tracking-wider">
              Comprehensive Care
            </span>
            <h2 className="text-3xl font-black text-[#12312C] mt-1">
              What&apos;s Included?
            </h2>
            <p className="text-xs text-[#5A7065] mt-2">
              Every car wash follows our rigorous multi-point detailing checklist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inclusions.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] flex items-start gap-4 hover:border-[#3E8E4A] transition"
              >
                <div className="w-9 h-9 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                  <Check className="w-5 h-5 text-[#3E8E4A] stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#12312C]">{item.title}</h4>
                  <p className="text-xs text-[#5A7065] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0B4F47] to-[#176B5D] text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-300">Clean Cars • Green Planet</span>
                <h4 className="text-lg font-black mt-1">Eco-Conscious Technique</h4>
                <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                  We use biodegradable formulas and water-efficient washing systems to protect the environment.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-white/20">
                <Link
                  href="/book?service=car-wash"
                  className="text-xs font-bold text-white hover:text-emerald-200 flex items-center gap-1"
                >
                  <span>Book Doorstep Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Car Wash Passes Section */}
        <div id="monthly-passes" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#3E8E4A] uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Save Big Every Month
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#12312C]">
              Monthly Car Wash Passes
            </h2>
            <p className="text-sm text-[#5A7065]">
              Save up to ₹1,100 every month with guaranteed doorstep collection, dedicated specialists, and flexible evening slots across Kompally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* 1. Starter Foam Pass */}
            <div className="rounded-3xl p-8 bg-white border border-[#E0EBDD] shadow-soft flex flex-col justify-between hover:shadow-xl transition relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3E8E4A] uppercase tracking-wider">
                    Light Routine
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-[10px] font-black uppercase tracking-wider">
                    POPULAR
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#12312C]">Starter Foam Pass</h3>
                  <p className="text-xs text-[#5A7065] mt-1">Clean every 10 days • Perfect for daily city commuters</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#0B4F47]">₹599</span>
                    <span className="text-xs text-[#5A7065] font-semibold">/ month</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E0EBDD]/60 text-xs">
                    <span className="font-extrabold text-[#12312C]">3 Washes / Month</span>
                    <span className="text-[#3E8E4A] font-bold bg-[#EAF5E8] px-2 py-0.5 rounded-full">Save ₹450</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[#12312C] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span><strong>3 Exterior Foam Washes</strong> per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span>High-pressure underbody rinse</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span>Streak-free glass & mirror polish</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span>Doorstep collection & evening delivery</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E0EBDD]/70">
                <Link
                  href="/book?service=car-wash&plan=starter-foam-pass"
                  className="w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-[#FAF9F2] hover:bg-[#EAF5E8] border border-[#E0EBDD] text-[#0B4F47] transition shadow-sm"
                >
                  <span>Choose Starter Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 2. Pro Sparkle Pass (Highlighted) */}
            <div className="rounded-3xl p-8 bg-white border-2 border-[#0B4F47] shadow-xl ring-2 ring-[#0B4F47]/20 flex flex-col justify-between hover:shadow-2xl transition relative scale-105 z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0B4F47] text-white text-[10px] font-black uppercase tracking-wider shadow whitespace-nowrap">
                BEST VALUE IN KOMPALLY
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-[#3E8E4A] uppercase tracking-wider">
                    Weekly Care
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                    RECOMMENDED
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#12312C]">Pro Sparkle Pass</h3>
                  <p className="text-xs text-[#5A7065] mt-1">Weekly wash + 1 interior wipe • Keep showroom shine</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#EAF5E8] border border-[#3E8E4A]/30">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#0B4F47]">₹999</span>
                    <span className="text-xs text-[#5A7065] font-semibold">/ month</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#3E8E4A]/20 text-xs">
                    <span className="font-extrabold text-[#12312C]">5 Washes / Month</span>
                    <span className="text-[#0B4F47] font-bold bg-white px-2 py-0.5 rounded-full shadow-xs">Save ₹750</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[#12312C] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span><strong>5 Full Exterior Foam Washes</strong> per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span><strong>1 Complimentary Interior Vacuum</strong> session</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span>Tire dressing & rim gloss buff</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span>Priority evening slot reservation (6 PM – 11 PM)</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E0EBDD]/70">
                <Link
                  href="/book?service=car-wash&plan=pro-sparkle-pass"
                  className="w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-[#0B4F47] hover:bg-[#176B5D] text-white transition shadow-md"
                >
                  <span>Choose Pro Sparkle Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 3. Complete Detailing Pass */}
            <div className="rounded-3xl p-8 bg-white border border-[#E0EBDD] shadow-soft flex flex-col justify-between hover:shadow-xl transition relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3E8E4A] uppercase tracking-wider">
                    Full Detailing
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF9F2] border border-[#E0EBDD] text-[#12312C] text-[10px] font-black uppercase tracking-wider">
                    PREMIUM CARE
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#12312C]">Complete Detailing Pass</h3>
                  <p className="text-xs text-[#5A7065] mt-1">5 Washes + 2 Interior Vacuums • Complete luxury care</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#0B4F47]">₹1,399</span>
                    <span className="text-xs text-[#5A7065] font-semibold">/ month</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E0EBDD]/60 text-xs">
                    <span className="font-extrabold text-[#12312C]">5 Washes + 2 Vacuums</span>
                    <span className="text-[#3E8E4A] font-bold bg-[#EAF5E8] px-2 py-0.5 rounded-full">Save ₹1,100</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[#12312C] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span><strong>5 Ultra Foam Exterior Washes</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span><strong>2 Deep Interior Vacuuming Sessions</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span>Dashboard UV dressing & anti-static trim care</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 stroke-[2.5]" />
                    <span>Full wheel arch & protective tire gloss</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E0EBDD]/70">
                <Link
                  href="/book?service=car-wash&plan=complete-detailing-pass"
                  className="w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-[#FAF9F2] hover:bg-[#EAF5E8] border border-[#E0EBDD] text-[#0B4F47] transition shadow-sm"
                >
                  <span>Choose Detailing Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Process Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-[#12312C] mb-8">
            How Doorstep Car Wash Works
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

        {/* Final CTA Banner */}
        <div className="bg-[#0B4F47] rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-black">Give Your Car The ION HUB Shine</h3>
            <p className="text-xs text-[#EAF5E8]/80">Available daily in Kompally between 6:00 PM and 11:00 PM.</p>
          </div>
          <Link
            href="/book?service=car-wash"
            className="flex-shrink-0 px-8 py-3.5 rounded-full bg-[#3E8E4A] hover:bg-[#34783f] text-white font-extrabold text-sm shadow-md transition"
          >
            BOOK CAR WASH NOW
          </Link>
        </div>

      </div>
    </div>
  );
}
