import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ServiceCard } from '@/components/ServiceCard';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Services Catalog — ION HUB Doorstep Care | Kompally',
  description: 'Explore ION HUB doorstep services: Doorstep Car Wash, Professional Ironing, and upcoming home services in Kompally.',
};

export default async function ServicesPage() {
  const services = await db.getServices();

  return (
    <div className="py-16 bg-[#FAF9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#3E8E4A]" /> Full Service Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#12312C] tracking-tight">
            Services That Make Life Easier
          </h1>
          <p className="mt-4 text-base text-[#5A7065] leading-relaxed">
            Professional doorstep services delivered with care in Kompally. Every service is database-driven, quality-assured, and handled by verified experts.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Future expansion note */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-[#E0EBDD] flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#12312C]">Need a custom doorstep solution?</h3>
            <p className="text-xs text-[#5A7065]">
              We are expanding into home deep cleaning, appliance sanitization, and specialized garment care in Kompally.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 px-6 py-3 rounded-full bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-bold transition flex items-center gap-2"
          >
            <span>Request New Service</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#3E8E4A]" />
          </Link>
        </div>

      </div>
    </div>
  );
}
