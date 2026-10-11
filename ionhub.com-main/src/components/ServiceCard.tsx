import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Service } from '@/types/database';
import { formatPrice } from '@/lib/utils';
import { Check, ArrowRight, Clock, Sparkles } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const isComingSoon = !service.is_active;

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white ${
        isComingSoon
          ? 'opacity-85 border-slate-200'
          : 'border-[#E0EBDD] hover:border-[#3E8E4A] hover:shadow-card-hover group'
      }`}
    >
      <div>
        {/* Service Image / Creative preview */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-100">
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            className={`object-cover ${!isComingSoon ? 'group-hover:scale-105 transition-transform duration-500' : 'grayscale-50'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badge */}
          <div className="absolute top-4 left-4">
            {isComingSoon ? (
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-sm">
                Coming Soon
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0B4F47] text-xs font-bold shadow-sm">
                Doorstep Service
              </span>
            )}
          </div>

          {/* Price / Quote display */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xl font-black">
              {service.slug === 'ironing' ? '₹25 / pair' : formatPrice(service.price)}
            </span>
            {service.duration_minutes && (
              <span className="text-xs font-medium flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-[#3E8E4A]" /> ~{service.duration_minutes} mins
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-black text-[#12312C] group-hover:text-[#0B4F47] transition-colors">
            {service.name}
          </h3>

          <p className="text-xs text-[#5A7065] mt-2 line-clamp-2 leading-relaxed">
            {service.short_description || service.description}
          </p>

          {/* Features / Items list */}
          {service.items && service.items.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#E0EBDD]/60 space-y-2">
              <span className="text-[11px] font-bold text-[#0B4F47] uppercase tracking-wider block">
                What&apos;s Included:
              </span>
              <ul className="space-y-1.5">
                {service.items.slice(0, 5).map((item) => (
                  <li key={item.id} className="text-xs text-[#12312C] flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#EAF5E8] flex items-center justify-center text-[#3E8E4A] flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <div className="p-6 pt-0">
        {isComingSoon ? (
          <button
            disabled
            className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed text-center"
          >
            Coming Soon to Kompally
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/services/${service.slug}`}
              className="py-3 px-3 rounded-2xl border border-[#E0EBDD] hover:bg-[#FAF9F2] text-[#0B4F47] font-bold text-xs text-center transition"
            >
              Details
            </Link>
            <Link
              href={`/book?service=${service.slug}`}
              className="py-3 px-3 rounded-2xl bg-[#0B4F47] hover:bg-[#176B5D] text-white font-extrabold text-xs text-center shadow-md transition flex items-center justify-center gap-1 group-hover:bg-[#176B5D]"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#3E8E4A]" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
