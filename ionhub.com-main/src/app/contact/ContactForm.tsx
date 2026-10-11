'use client';

import React, { useState } from 'react';
import { submitContactMessageAction } from '@/app/actions/booking';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await submitContactMessageAction(formData);

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E0EBDD] shadow-soft">
      <h3 className="text-2xl font-black text-[#12312C] mb-2">Send Us a Message</h3>
      <p className="text-xs text-[#5A7065] mb-6 leading-relaxed">
        Have questions about doorstep timings, bulk ironing, or specific detailing requests? Let us know.
      </p>

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-[#EAF5E8] border border-[#3E8E4A]/30 flex items-center gap-3 text-[#0B4F47]">
          <CheckCircle2 className="w-5 h-5 text-[#3E8E4A] flex-shrink-0" />
          <div className="text-xs font-semibold">
            Thank you! Your message has been received. Our team will get back to you shortly.
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="text-xs font-semibold">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#12312C] uppercase mb-1.5">
            Full Name *
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#12312C] uppercase mb-1.5">
              Phone Number *
            </label>
            <input
              name="phone"
              type="tel"
              required
              placeholder="10-digit mobile number"
              className="w-full px-4 py-3 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#12312C] uppercase mb-1.5">
              Email Address *
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@domain.com"
              className="w-full px-4 py-3 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#12312C] uppercase mb-1.5">
            Your Message *
          </label>
          <textarea
            name="message"
            rows={4}
            required
            placeholder="Tell us what service you need or questions about Kompally slots..."
            className="w-full px-4 py-3 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#3E8E4A]" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-[#3E8E4A]" />
              <span>SEND MESSAGE</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
