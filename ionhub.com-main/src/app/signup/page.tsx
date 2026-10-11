import React from 'react';
import { SignupForm } from './SignupForm';
import Image from 'next/image';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Sign Up — ION HUB Doorstep Care',
  description: 'Create an ION HUB account for reliable doorstep car washing and professional ironing in Kompally.',
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

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

        <SignupForm />
      </div>
    </div>
  );
}
