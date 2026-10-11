import React from 'react';
import { Truck, Sparkles, Clock, ShieldCheck, Leaf } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: 'Doorstep Service',
      desc: 'Pickup & delivery right at your door in Kompally',
    },
    {
      icon: Sparkles,
      title: 'Professional Care',
      desc: 'High-grade tools & trained care specialists',
    },
    {
      icon: Clock,
      title: 'Saves Your Time',
      desc: 'Zero waiting at shops, evening convenient slots',
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Gentle',
      desc: 'Fabric-safe steaming & scratch-free car wash',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      desc: 'Conscious cleaning products & water-saving techniques',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-[#E0EBDD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD]/70 hover:border-[#3E8E4A]/50 transition-all hover:shadow-sm group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] flex items-center justify-center text-[#0B4F47] group-hover:bg-[#0B4F47] group-hover:text-white transition-colors mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#12312C]">{badge.title}</h4>
                <p className="text-xs text-[#5A7065] mt-1 leading-snug">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
