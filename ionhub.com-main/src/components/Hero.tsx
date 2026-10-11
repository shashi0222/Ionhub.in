'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ShieldCheck, MapPin, Sparkles, Car, Shirt } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F2] via-[#F7F5E9] to-[#FAF9F2] pt-8 pb-20 lg:pt-16 lg:pb-28">
      {/* Decorative leaf SVGs floating in background */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-12 left-8 text-[#3E8E4A]/20 pointer-events-none select-none text-6xl hidden md:block"
      >
        🌿
      </motion.div>
      <motion.div
        animate={{ y: [0, 14, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-16 left-1/3 text-[#3E8E4A]/15 pointer-events-none select-none text-5xl hidden md:block"
      >
        🍃
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-24 right-12 text-[#3E8E4A]/20 pointer-events-none select-none text-7xl hidden lg:block"
      >
        🌱
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5E8] border border-[#3E8E4A]/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#3E8E4A] animate-ping" />
              <span className="text-xs font-bold text-[#0B4F47] uppercase tracking-wider">
                Now Live in Kompally • 6 PM – 11 PM
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#12312C] tracking-tight leading-[1.12]">
              Your Everyday Care.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B4F47] via-[#176B5D] to-[#3E8E4A] block sm:inline">
                Delivered to Your Doorstep.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#5A7065] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              From sparkling-clean cars to perfectly pressed clothes, ION HUB makes everyday care simple, convenient and reliable.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/book"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#0B4F47] hover:bg-[#176B5D] text-white font-extrabold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-4 h-4 text-[#3E8E4A]" />
                <span>BOOK A SERVICE</span>
              </Link>
              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-[#FAF9F2] text-[#0B4F47] font-bold text-sm border border-[#E0EBDD] hover:border-[#0B4F47]/40 shadow-sm transition-all"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowRight className="w-4 h-4 text-[#3E8E4A]" />
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-6 border-t border-[#E0EBDD]/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <span className="block text-xl font-extrabold text-[#0B4F47]">100%</span>
                <span className="text-xs text-[#5A7065] font-medium">Doorstep Care</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-[#0B4F47]">6 - 11 PM</span>
                <span className="text-xs text-[#5A7065] font-medium">Evening Slots</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-[#0B4F47]">Kompally</span>
                <span className="text-xs text-[#5A7065] font-medium">Local Dedicated</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Representing Car Wash + Ironing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Visual Composition */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Card 1: Car Wash Showcase */}
              <div className="relative z-20 rounded-3xl overflow-hidden shadow-card-hover border-4 border-white bg-white group hover:scale-[1.02] transition-transform duration-300">
                <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-100">
                  <Image
                    src="/brand/creative_carwash.jpeg"
                    alt="Doorstep Car Wash Service"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#0B4F47] flex items-center gap-1.5 shadow-sm">
                    <Car className="w-3.5 h-3.5 text-[#3E8E4A]" /> Doorstep Car Wash
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-semibold text-emerald-300 tracking-wider uppercase">Sparkling Clean</span>
                    <h3 className="text-lg font-extrabold leading-tight">Exterior Foam Wash & Interior Detailing</h3>
                  </div>
                </div>
              </div>

              {/* Card 2: Professional Ironing Overlay */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-8 -left-6 sm:-left-8 z-30 w-64 sm:w-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white group hover:scale-105 transition-transform"
              >
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <Image
                    src="/brand/creative_ironing.jpeg"
                    alt="Professional Ironing Service"
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-2 left-2 bg-[#0B4F47] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <Shirt className="w-3 h-3 text-[#3E8E4A]" /> Pro Ironing
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <p className="text-xs font-extrabold">Crisp, Wrinkle-Free Clothes</p>
                    <span className="text-[10px] text-emerald-200">Doorstep Pickup & Return</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Eco Pill */}
              <div className="absolute -top-4 -right-4 z-30 bg-[#FAF9F2] border border-[#3E8E4A]/40 rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EAF5E8] flex items-center justify-center text-[#3E8E4A] font-bold text-xs">
                  🌿
                </span>
                <span className="text-xs font-extrabold text-[#0B4F47]">100% Eco-Conscious</span>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
