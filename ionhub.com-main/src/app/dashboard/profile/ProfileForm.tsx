'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/database';
import { updateProfileAction } from '@/app/actions/auth';
import { Save, CheckCircle2, AlertCircle, Loader2, ShieldCheck, User } from 'lucide-react';

interface ProfileFormProps {
  user: UserProfile;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfileAction(null, formData);

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#E0EBDD] shadow-soft space-y-6 max-w-xl">
      {success && (
        <div className="p-4 rounded-2xl bg-[#EAF5E8] border border-[#3E8E4A]/30 text-xs text-[#0B4F47] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3E8E4A]" />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#12312C] uppercase mb-1.5">
            Full Name
          </label>
          <input
            name="fullName"
            type="text"
            required
            defaultValue={user.full_name}
            className="w-full px-4 py-3 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] focus:ring-2 focus:ring-[#0B4F47] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#12312C] uppercase mb-1.5">
            Phone Number (for doorstep arrival alerts)
          </label>
          <input
            name="phone"
            type="tel"
            required
            defaultValue={user.phone}
            className="w-full px-4 py-3 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] focus:ring-2 focus:ring-[#0B4F47] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#12312C] uppercase mb-1.5">
            Email Address (Primary Login)
          </label>
          <input
            name="email"
            type="email"
            disabled
            defaultValue={user.email}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
          />
          <span className="text-[10px] text-[#5A7065] mt-1 block">Email cannot be changed directly for account security.</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#3E8E4A]" />
            <div>
              <span className="text-xs font-bold text-[#12312C] block">Account Authority</span>
              <span className="text-[11px] text-[#5A7065]">System Role</span>
            </div>
          </div>
          <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47]">
            {user.role}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#3E8E4A]" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#3E8E4A]" />
              <span>SAVE PROFILE</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
