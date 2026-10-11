import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { ProfileForm } from './ProfileForm';

export const metadata = {
  title: 'My Profile — ION HUB Account',
  description: 'Manage your personal details and contact numbers for doorstep service notifications.',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0EBDD]/70 pb-4">
        <h2 className="text-2xl font-black text-[#12312C]">Account Profile</h2>
        <p className="text-xs text-[#5A7065] mt-1">
          Keep your phone number up to date for timely doorstep arrival alerts in Kompally.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
