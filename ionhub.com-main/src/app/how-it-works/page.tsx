import React from 'react';
import Link from 'next/link';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { TrustBadges } from '@/components/TrustBadges';
import { WhatsAppCommunityCard } from '@/components/WhatsAppCommunityCard';
import { Calendar, CheckCircle2, ShieldCheck, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'How It Works — Doorstep Pickup to Delivery | ION HUB',
  description: 'Understand the seamless 4-step ION HUB doorstep workflow: Book, Pickup, Professional Care, and Fresh Delivery in Kompally.',
};

export default function HowItWorksPage() {
  return (
    <div className="py-12 bg-[#FAF9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Intro Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold uppercase tracking-wider mb-3">
            Zero Effort Experience
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#12312C] tracking-tight">
            How ION HUB Delivers Doorstep Care
          </h1>
          <p className="mt-4 text-base text-[#5A7065] leading-relaxed">
            We reimagined everyday vehicle and laundry care around modern convenience. No driving, no waiting, no compromise on quality.
          </p>
        </div>

        {/* Process Timeline Component */}
        <div className="rounded-3xl overflow-hidden shadow-soft border border-[#E0EBDD]">
          <ProcessTimeline />
        </div>

        {/* Deep Dive into Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-[#E0EBDD] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center font-black">
              1
            </div>
            <h3 className="text-lg font-bold text-[#12312C]">Real-Time Status Tracking</h3>
            <p className="text-xs text-[#5A7065] leading-relaxed">
              From the moment your booking is submitted, you can track every phase (Booked, Confirmed, Picked Up, In Service, Out for Delivery, Completed) directly inside your customer dashboard.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E0EBDD] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center font-black">
              2
            </div>
            <h3 className="text-lg font-bold text-[#12312C]">Dedicated Evening Slots</h3>
            <p className="text-xs text-[#5A7065] leading-relaxed">
              We operate exclusively during the evening hours (6:00 PM – 11:00 PM) when you are home, ensuring smooth handovers without disrupting your workday.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E0EBDD] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center font-black">
              3
            </div>
            <h3 className="text-lg font-bold text-[#12312C]">Strict Quality Assurance</h3>
            <p className="text-xs text-[#5A7065] leading-relaxed">
              Every car receives a 5-point detailing inspection, and every garment is pressed with precision heat control and packed in protective eco coverings.
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <TrustBadges />

        {/* Community */}
        <WhatsAppCommunityCard />

      </div>
    </div>
  );
}
