import React from 'react';
import Image from 'next/image';
import { MessageCircle, Sparkles } from 'lucide-react';

interface WhatsAppCommunityCardProps {
  compact?: boolean;
}

export const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/HvABib08cizBFFWgbA9JWa';

export function WhatsAppCommunityCard({ compact = false }: WhatsAppCommunityCardProps) {
  const whatsappUrl = WHATSAPP_COMMUNITY_URL;

  if (compact) {
    return (
      <div className="bg-[#0B4F47] text-white p-5 rounded-2xl border border-[#3E8E4A]/40 flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold flex items-center gap-1.5 text-white">
            <MessageCircle className="w-4 h-4 text-[#25D366]" /> Join the ION HUB Community
          </h4>
          <p className="text-xs text-[#EAF5E8]/80 mt-0.5">Get doorstep service updates, exclusive offers & priority slots.</p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-4 py-2 rounded-xl bg-[#25D366] text-slate-950 text-xs font-bold hover:bg-[#20ba5a] transition shadow-md"
        >
          Join Now
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0B4F47] via-[#0E443D] to-[#12312C] rounded-3xl p-8 text-white relative overflow-hidden border border-[#3E8E4A]/30 shadow-soft">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3E8E4A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5E8]/10 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#25D366]" /> Exclusive Neighborhood Circle
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Join the ION HUB Community
          </h3>
          <p className="text-sm text-[#EAF5E8]/85 leading-relaxed">
            Get instant service updates, weather-smart wash alerts, weekend ironing schedules, and direct priority support in Kompally.
          </p>
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-sm shadow-lg transition-transform transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-slate-950" />
              <span>JOIN ON WHATSAPP</span>
            </a>
          </div>
        </div>

        {/* Real QR Code image from user */}
        <div className="bg-slate-900/90 p-5 rounded-3xl text-center text-white shadow-xl border border-white/10 flex-shrink-0 w-60">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden bg-black p-2 border border-white/10 group-hover:scale-105 transition-transform duration-300 shadow-md">
              <Image
                src="/brand/whatsapp_qr.jpg"
                alt="ION HUB WhatsApp Community QR Code"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[11px] font-black tracking-wider text-[#25D366] uppercase mt-2.5 block group-hover:underline">
              SCAN OR TAP TO JOIN
            </span>
          </a>
          <span className="text-[11px] text-slate-300 font-medium block mt-1">
            ION HUB WhatsApp Community
          </span>
        </div>
      </div>
    </div>
  );
}
