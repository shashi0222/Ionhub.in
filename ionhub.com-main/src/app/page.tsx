import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Hero } from '@/components/Hero';
import { TrustBadges } from '@/components/TrustBadges';
import { ServiceCard } from '@/components/ServiceCard';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { WhatsAppCommunityCard } from '@/components/WhatsAppCommunityCard';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Leaf, 
  ShieldCheck, 
  Calendar, 
  ArrowRight,
  PhoneCall
} from 'lucide-react';

export const revalidate = 60; // ISR cache

export default async function HomePage() {
  const services = await db.getServices();
  const businessHours = await db.getBusinessHours();
  const serviceAreas = await db.getServiceAreas();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust Badges */}
      <TrustBadges />

      {/* 3. Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#3E8E4A]" /> Our Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#12312C] tracking-tight">
              Services That Make Life Easier
            </h2>
            <p className="mt-3 text-base text-[#5A7065]">
              Database-driven care packages designed for convenience, meticulous standards, and eco-friendliness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0B4F47] hover:text-[#176B5D] hover:underline"
            >
              <span>Explore all service specifications & details</span>
              <ArrowRight className="w-4 h-4 text-[#3E8E4A]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. How It Works Timeline */}
      <ProcessTimeline />

      {/* 5. Kompally Neighborhood Focus & Hours */}
      <section className="py-16 bg-[#FAF9F2] border-t border-[#E0EBDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Left side details */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#3E8E4A]" /> Local Neighborhood Advantage
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#12312C] tracking-tight leading-tight">
                Designed Exclusively For Your Convenience in Kompally.
              </h2>

              <p className="text-sm text-[#5A7065] leading-relaxed">
                No more navigating weekend traffic to wash your car or waiting days for unorganized dry cleaners. ION HUB brings organized, high-standard doorstep care right outside your apartment or villa.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#E0EBDD] flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#12312C] uppercase tracking-wider">Business Timings</h4>
                    <p className="text-sm font-extrabold text-[#0B4F47] mt-0.5">6:00 PM – 11:00 PM</p>
                    <span className="text-[11px] text-[#5A7065]">Daily • Weekends Available</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E0EBDD] flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#12312C] uppercase tracking-wider">Service Coverage</h4>
                    <p className="text-sm font-extrabold text-[#0B4F47] mt-0.5">Kompally Zone</p>
                    <span className="text-[11px] text-[#5A7065]">Pincode 500100 & surroundings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side WhatsApp Community Banner */}
            <div>
              <WhatsAppCommunityCard />
            </div>

          </div>
        </div>
      </section>

      {/* 6. Eco-Friendly Pledge & Final CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0B4F47] to-[#12312C] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-emerald-300 text-xs font-bold backdrop-blur-md">
            <Leaf className="w-4 h-4 text-[#3E8E4A]" /> Cleaner Vehicles & Clothes • A Greener Tomorrow
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready For Effortless Care Delivered To Your Doorstep?
          </h2>

          <p className="text-base text-[#EAF5E8]/80 max-w-xl mx-auto">
            Book your car wash or ironing in under two minutes. Select your evening time slot today.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#3E8E4A] hover:bg-[#34783f] text-white font-extrabold text-sm tracking-wide shadow-xl transition-transform transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK A SERVICE NOW</span>
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Have Questions? Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
