import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Clock, 
  MessageCircle, 
  Car, 
  Shirt, 
  Sparkles, 
  Leaf
} from 'lucide-react';

export function Footer() {
  const whatsappUrl = 'https://chat.whatsapp.com/HvABib08cizBFFWgbA9JWa';
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'care@ionhub.in';

  return (
    <footer className="bg-[#12312C] text-[#EAF5E8] border-t border-[#176B5D]/40 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#176B5D]/30">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#3E8E4A]/40 bg-[#0B4F47]">
                <Image
                  src="/brand/logo_source.png"
                  alt="ION HUB Official Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  ION <span className="text-[#3E8E4A]">HUB</span>
                </span>
                <p className="text-xs text-[#EAF5E8]/70 font-medium">Everyday care. Delivered to your doorstep.</p>
              </div>
            </Link>

            <p className="text-sm text-[#EAF5E8]/80 leading-relaxed max-w-sm">
              From sparkling-clean cars to perfectly pressed clothes, ION HUB makes everyday care simple, convenient and reliable across Kompally.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B4F47] border border-[#3E8E4A]/40 text-xs text-[#3E8E4A] font-semibold">
                <Leaf className="w-3.5 h-3.5 text-[#3E8E4A]" /> Eco-Friendly Products & Methods
              </div>
            </div>
          </div>

          {/* Doorstep Services */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3E8E4A]" /> Doorstep Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/car-wash" className="hover:text-[#3E8E4A] transition-colors flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-[#3E8E4A]" /> Doorstep Car Wash
                </Link>
              </li>
              <li>
                <Link href="/services/ironing" className="hover:text-[#3E8E4A] transition-colors flex items-center gap-2">
                  <Shirt className="w-3.5 h-3.5 text-[#3E8E4A]" /> Professional Ironing
                </Link>
              </li>
              <li>
                <span className="text-[#EAF5E8]/50 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300/50" /> Home Services (Coming Soon)
                </span>
              </li>
              <li>
                <Link href="/book" className="text-[#3E8E4A] hover:underline font-semibold text-xs block pt-2">
                  → Book Instant Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/how-it-works" className="hover:text-[#3E8E4A] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#3E8E4A] transition-colors">
                  About ION HUB
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#3E8E4A] transition-colors">
                  Help & Contact
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#3E8E4A] transition-colors">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#3E8E4A] transition-colors text-xs text-[#EAF5E8]/60">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Area & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">
              Service Zone
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-[#EAF5E8]/90">
              <MapPin className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold">KOMPALLY</strong>
                <span>Hyderabad, Telangana - 500100</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-[#EAF5E8]/90">
              <Clock className="w-4 h-4 text-[#3E8E4A] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold">Service Hours</strong>
                <span>Daily: 6:00 PM – 11:00 PM</span>
                <span className="block text-emerald-400 text-[11px]">Weekends Available</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366] text-slate-900 font-bold text-xs hover:bg-[#20ba5a] transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Join WhatsApp Community</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EAF5E8]/60 gap-4">
          <p>© {new Date().getFullYear()} ION HUB. All rights reserved.</p>
          <div className="flex items-center gap-2 text-emerald-400/90 font-medium">
            <Leaf className="w-3.5 h-3.5" />
            <span>CLEANER VEHICLES & CLOTHES • A GREENER TOMORROW</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
