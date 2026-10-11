'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Bike, Sparkles, PackageCheck, ArrowRight } from 'lucide-react';

export function ProcessTimeline() {
  const steps = [
    {
      num: '01',
      title: 'BOOK',
      sub: 'Choose your service',
      desc: 'Select car wash or ironing, pick your preferred date and evening slot in Kompally.',
      icon: Smartphone,
    },
    {
      num: '02',
      title: 'PICKUP',
      sub: 'We collect at your doorstep',
      desc: 'Our agent arrives at your designated doorstep address right on schedule.',
      icon: Bike,
    },
    {
      num: '03',
      title: 'SERVICE',
      sub: 'Professional care',
      desc: 'Eco-friendly car washing or precision temperature-controlled ironing.',
      icon: Sparkles,
    },
    {
      num: '04',
      title: 'DELIVERY',
      sub: 'Returned fresh & spotless',
      desc: 'Your car gleaming or your clothes neatly packed, handed back with a smile.',
      icon: PackageCheck,
    },
  ];

  return (
    <section className="py-20 bg-[#F7F5E9] relative overflow-hidden">
      {/* Decorative leaf watermarks */}
      <div className="absolute top-10 left-5 text-[#3E8E4A]/10 text-8xl select-none pointer-events-none">
        🌿
      </div>
      <div className="absolute bottom-10 right-5 text-[#3E8E4A]/10 text-9xl select-none pointer-events-none">
        🍃
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold uppercase tracking-wider mb-3">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12312C] tracking-tight">
            How ION HUB Works?
          </h2>
          <p className="mt-3 text-base text-[#5A7065]">
            From your tap to your doorstep, hassle-free care in 4 effortless stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="bg-white rounded-3xl p-7 border border-[#E0EBDD] shadow-soft relative flex flex-col items-start group hover:border-[#3E8E4A] hover:shadow-card-hover transition-all"
              >
                {/* Step pill */}
                <div className="flex items-center justify-between w-full mb-6">
                  <span className="text-xs font-black tracking-widest text-[#3E8E4A] bg-[#EAF5E8] px-3 py-1 rounded-full">
                    STAGE {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#0B4F47] text-[#EAF5E8] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-[#0B4F47]">{step.title}</h3>
                <h4 className="text-sm font-semibold text-[#12312C] mt-1">{step.sub}</h4>
                <p className="text-xs text-[#5A7065] mt-2.5 leading-relaxed">{step.desc}</p>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-8 h-8 rounded-full bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center border border-[#3E8E4A]/30">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
