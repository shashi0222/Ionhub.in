'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signupAction } from '@/app/actions/auth';
import { UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await signupAction(null, formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E0EBDD] shadow-soft max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-[#12312C]">Create Your Account</h2>
        <p className="text-xs text-[#5A7065] mt-1">
          Enjoy hassle-free doorstep car wash & ironing in Kompally.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#12312C] uppercase mb-1.5">
            Full Name *
          </label>
          <input
            name="fullName"
            type="text"
            required
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2]"
          />
        </div>

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

        <div>
          <label className="block text-xs font-bold text-[#12312C] uppercase mb-1.5">
            Password (min 6 characters) *
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#3E8E4A]" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 text-[#3E8E4A]" />
              <span>CREATE ACCOUNT</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-[#5A7065] border-t border-[#E0EBDD]/60 pt-4">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-[#0B4F47] hover:underline">
          Log in here
        </Link>
      </div>
    </div>
  );
}
