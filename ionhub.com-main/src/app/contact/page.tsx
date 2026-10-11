import React from 'react';
import { ContactForm } from './ContactForm';
import { WhatsAppCommunityCard } from '@/components/WhatsAppCommunityCard';
import { MapPin, Clock, Phone, Mail, MessageCircle, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Contact ION HUB — Doorstep Service Support | Kompally',
  description: 'Get in touch with ION HUB for doorstep car wash and ironing in Kompally. Operating 6 PM – 11 PM daily.',
};

export default function ContactPage() {
  const phone1 = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '7013204229';
  const phone2 = process.env.NEXT_PUBLIC_BUSINESS_PHONE2 || '8523056022';
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'care@ionhub.in';
  const whatsappUrl = 'https://chat.whatsapp.com/HvABib08cizBFFWgbA9JWa';

  return (
    <div className="py-16 bg-[#FAF9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold uppercase tracking-wider mb-3">
            Direct Neighborhood Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#12312C] tracking-tight">
            We Are Here To Assist You
          </h1>
          <p className="mt-3 text-base text-[#5A7065]">
            Have a special vehicle request, need laundry pickup timing details, or have feedback? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Info & Local Service Zone */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-[#E0EBDD] space-y-6 shadow-soft">
              <h3 className="text-xl font-black text-[#12312C] border-b border-[#E0EBDD]/60 pb-4">
                Service Desk & Location
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#3E8E4A]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#12312C] text-xs uppercase tracking-wider">Service Area</h4>
                    <p className="font-extrabold text-[#0B4F47] text-base mt-0.5">KOMPALLY</p>
                    <span className="text-xs text-[#5A7065]">Hyderabad, Telangana – 500100</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#3E8E4A]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#12312C] text-xs uppercase tracking-wider">Doorstep Timings</h4>
                    <p className="font-extrabold text-[#0B4F47] text-base mt-0.5">6:00 PM – 11:00 PM</p>
                    <span className="text-xs text-[#5A7065]">Daily • Weekends Available</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#3E8E4A]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#12312C] text-xs uppercase tracking-wider">Phone Support</h4>
                    <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="font-extrabold text-[#0B4F47] text-base mt-0.5 hover:underline block">
                      {phone1}
                    </a>
                    <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="font-extrabold text-[#0B4F47] text-base hover:underline block">
                      {phone2}
                    </a>
                    <span className="text-xs text-[#5A7065]">Available during service hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#3E8E4A]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#12312C] text-xs uppercase tracking-wider">Email Inquiry</h4>
                    <a href={`mailto:${email}`} className="font-extrabold text-[#0B4F47] text-sm mt-0.5 hover:underline block">
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E0EBDD]/60">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#25D366] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>Connect with us on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0B4F47] text-white space-y-2">
              <span className="text-xs font-bold text-emerald-300">Neighborhood Guarantee</span>
              <h4 className="text-base font-bold">Local, Trustworthy & On Time</h4>
              <p className="text-xs text-[#EAF5E8]/80 leading-relaxed">
                We respect your personal schedule. Our agents confirm their arrival 15 minutes before reaching your doorstep.
              </p>
            </div>
          </div>

          {/* Right: Working Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}
