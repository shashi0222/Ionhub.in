import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Leaf, 
  Clock, 
  Sparkles, 
  HeartHandshake, 
  MapPin, 
  ArrowRight 
} from 'lucide-react';

export const metadata = {
  title: 'About ION HUB — Everyday Care Delivered to Your Doorstep | Kompally',
  description: 'Learn about ION HUB mission: Bringing reliable, eco-friendly doorstep car wash and professional ironing services to modern homes in Kompally.',
};

export default function AboutPage() {
  const principles = [
    {
      icon: Clock,
      title: 'Convenience',
      desc: 'Seamless booking, doorstep pickup and prompt return tailored around your evening routine.',
    },
    {
      icon: Sparkles,
      title: 'Professional Care',
      desc: 'High-grade cleaning materials, gentle microfiber wash techniques, and precise heat-regulated ironing.',
    },
    {
      icon: HeartHandshake,
      title: 'Time Saving',
      desc: 'Reclaim your precious weekends by letting our trained specialists handle vehicle cleaning and garment maintenance.',
    },
    {
      icon: ShieldCheck,
      title: 'Reliability',
      desc: 'Consistent quality, transparent communication, and verified neighborhood delivery personnel.',
    },
    {
      icon: Leaf,
      title: 'Eco-Conscious Service',
      desc: 'Biodegradable cleaning formulations, water-conserving car wash methods, and reusable or recyclable garment packaging.',
    },
  ];

  return (
    <div className="py-16 bg-[#FAF9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold uppercase tracking-wider">
              Our Story & Mission
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-[#12312C] tracking-tight leading-tight">
              Simplifying Everyday Care for Modern Living.
            </h1>

            <p className="text-base text-[#5A7065] leading-relaxed">
              ION HUB was created with a clear objective: to free residents from the repetitive chores of weekend car washes and endless ironing queues by delivering dependable, high-quality care straight to their doorstep.
            </p>

            <p className="text-base text-[#5A7065] leading-relaxed">
              Starting in Kompally, Hyderabad, we combine trained local specialists with eco-friendly cleaning practices, ensuring your vehicle sparkles and your wardrobe looks impeccable without eating into your personal time.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-[#0B4F47] font-bold">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#3E8E4A]" /> Serving Kompally, Hyderabad
              </span>
              <span>•</span>
              <span>Daily 6 PM – 11 PM</span>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-8 border-white shadow-2xl bg-[#0B4F47] flex items-center justify-center p-8">
              <Image
                src="/brand/logo_source.png"
                alt="ION HUB Official Identity"
                width={260}
                height={260}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* 5 Core Principles */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#E0EBDD] shadow-soft">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#3E8E4A] uppercase tracking-wider">
              What Drives Us
            </span>
            <h2 className="text-3xl font-black text-[#12312C] mt-1">
              Our Core Principles
            </h2>
            <p className="text-xs text-[#5A7065] mt-2">
              Every appointment and every service interaction is governed by these foundational values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((pr, idx) => {
              const Icon = pr.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-3 hover:border-[#3E8E4A] transition"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#3E8E4A]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#12312C]">{pr.title}</h3>
                  <p className="text-xs text-[#5A7065] leading-relaxed">{pr.desc}</p>
                </div>
              );
            })}

            <div className="p-6 rounded-2xl bg-[#0B4F47] text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-300">Expanding Tomorrow</span>
                <h3 className="text-lg font-bold mt-1">More Services In Progress</h3>
                <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                  We are developing home sanitization and deep care routines to bring even more convenience to Kompally.
                </p>
              </div>
              <Link
                href="/services"
                className="mt-4 pt-3 border-t border-white/20 text-xs font-bold text-white hover:text-emerald-200 flex items-center gap-1"
              >
                <span>Browse current services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
