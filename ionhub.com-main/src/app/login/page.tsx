import React from 'react';
import { LoginForm } from './LoginForm';
import Image from 'next/image';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Login — ION HUB Doorstep Portal',
  description: 'Log in to your ION HUB account to track bookings, view schedule, and manage your addresses in Kompally.',
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  return (
    <div className="py-16 bg-[#FAF9F2] min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#3E8E4A]/30 bg-[#0B4F47]">
              <Image
                src="/brand/logo_source.png"
                alt="ION HUB Logo"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          </Link>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
