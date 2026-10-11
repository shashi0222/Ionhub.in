'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/app/actions/auth';
import { LogIn, AlertCircle, Loader2, ShieldCheck, User, Wrench } from 'lucide-react';

type RoleType = 'customer' | 'worker' | 'admin';

const ROLE_CONFIGS: Record<
  RoleType,
  {
    title: string;
    description: string;
    emailPlaceholder: string;
    buttonText: string;
    targetRoute: string;
  }
> = {
  customer: {
    title: 'Customer Login',
    description: 'Track active bookings, garment balance & scheduled pickups.',
    emailPlaceholder: 'you@example.com',
    buttonText: 'Log In to Customer Dashboard',
    targetRoute: '/dashboard',
  },
  worker: {
    title: 'Specialist Worker Login',
    description: 'Access assigned pickup, service, and delivery order queue.',
    emailPlaceholder: 'worker@ionhub.in',
    buttonText: 'Log In to Specialist Portal',
    targetRoute: '/worker',
  },
  admin: {
    title: 'Admin Console Login',
    description: 'Manage pricing rules, service configurations, and audit records.',
    emailPlaceholder: 'admin@ionhub.in',
    buttonText: 'Log In to Admin Console',
    targetRoute: '/admin/pricing',
  },
};

export function LoginForm() {
  const [selectedRole, setSelectedRole] = useState<RoleType>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setError(null);
    setEmail('');
    setPassword('');
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const res = await loginAction(null, formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.redirectUrl) {
      window.location.href = res.redirectUrl;
    } else {
      setLoading(false);
    }
  }

  const currentConfig = ROLE_CONFIGS[selectedRole];

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E0EBDD] shadow-soft max-w-md w-full mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-[#12312C]">{currentConfig.title}</h2>
        <p className="text-xs text-[#5A7065] mt-1.5 leading-relaxed">
          {currentConfig.description}
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="mb-6 p-1.5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD]">
        <label className="block text-[10px] font-extrabold uppercase text-[#5A7065] tracking-wider text-center mb-1.5">
          Select Account Type
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleRoleChange('customer')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              selectedRole === 'customer'
                ? 'bg-[#0B4F47] text-white shadow-sm'
                : 'text-[#12312C]/80 hover:bg-white hover:text-[#0B4F47]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('worker')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              selectedRole === 'worker'
                ? 'bg-[#3E8E4A] text-white shadow-sm'
                : 'text-[#12312C]/80 hover:bg-white hover:text-[#0B4F47]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Worker</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-[#12312C]/80 hover:bg-white hover:text-[#0B4F47]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#12312C] uppercase mb-1.5">
            Email Address / Login ID
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={currentConfig.emailPlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2] text-[#12312C]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[#12312C] uppercase">
              Password
            </label>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2] text-[#12312C]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50 mt-2 ${
            selectedRole === 'customer'
              ? 'bg-[#0B4F47] hover:bg-[#176B5D]'
              : selectedRole === 'worker'
              ? 'bg-[#3E8E4A] hover:bg-[#34783f]'
              : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>{currentConfig.buttonText.toUpperCase()}</span>
            </>
          )}
        </button>
      </form>

      {/* Role specific footer message */}
      <div className="mt-6 text-center text-xs text-[#5A7065] border-t border-[#E0EBDD]/60 pt-4">
        {selectedRole === 'customer' && (
          <p>
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="font-bold text-[#0B4F47] hover:underline">
              Sign up here
            </Link>
          </p>
        )}
        {selectedRole === 'worker' && (
          <p className="text-[11px] text-[#5A7065] leading-relaxed">
            Specialist workers are registered and assigned directly by administrators. Contact office for login credentials.
          </p>
        )}
        {selectedRole === 'admin' && (
          <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
            Administrator console access is restricted to authorized operations personnel.
          </p>
        )}
      </div>
    </div>
  );
}
