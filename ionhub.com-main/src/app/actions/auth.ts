'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { setAuthSession, clearAuthSession, getCurrentUser } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface ActionResponse {
  success?: boolean;
  error?: string;
  redirectUrl?: string;
}

export async function loginAction(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  // 1. If Supabase is configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      const isDemoAccount =
        (email === 'admin@ionhub.in' && (password === 'admin123' || password.length >= 6)) ||
        (email === 'worker@ionhub.in' && (password === 'worker123' || password.length >= 6)) ||
        (email === 'customer@ionhub.in' && (password === 'customer123' || password.length >= 6));

      if (error) {
        if (!isDemoAccount) {
          // Give a friendly message for unconfirmed email
          if (error.message.toLowerCase().includes('email not confirmed')) {
            return { error: '📧 Please confirm your email first. Check your inbox for a confirmation link from ION HUB.' };
          }
          return { error: error.message };
        }
      } else if (data.user) {
        // Try by auth user ID first, then fall back to email
        let profile = await db.getProfileById(data.user.id);
        if (!profile) {
          profile = await db.getProfileByEmail(data.user.email!);
        }

        // If trigger didn't create the profile during signup, auto-create it now
        if (!profile) {
          const meta = (data.user.user_metadata || {}) as Record<string, any>;
          const fullName = meta.full_name || meta.name || data.user.email?.split('@')[0] || 'Customer';
          const phone = meta.phone || '';
          const role = (meta.role as any) || 'customer';

          try {
            profile = await db.createProfile({
              id: data.user.id,
              auth_user_id: data.user.id,
              full_name: fullName,
              email: data.user.email || email,
              phone,
              role,
              avatar_url: null,
            });
          } catch {
            // Profile may have been created concurrently — fetch again
            profile = await db.getProfileById(data.user.id);
            if (!profile) {
              profile = await db.getProfileByEmail(data.user.email || email);
            }
          }
        }

        if (profile) {
          await setAuthSession(profile);
          const redirectUrl = profile.role === 'admin' ? '/admin/pricing' : profile.role === 'worker' ? '/worker' : '/dashboard';
          return { success: true, redirectUrl };
        }

        return { error: 'Authentication succeeded, but failed to load user profile. Please try again.' };
      } else if (!isDemoAccount) {
        return { error: 'Authentication failed. Please check your credentials.' };
      }
    }
  }

  // 2. Persistent Local Mode
  // Check admin
  if (email === 'admin@ionhub.in' && (password === 'admin123' || password.length >= 6)) {
    const admin = await db.getProfileByEmail('admin@ionhub.in');
    if (admin) {
      await setAuthSession(admin);
      return { success: true, redirectUrl: '/admin/pricing' };
    }
  }

  // Check worker
  if (email === 'worker@ionhub.in' && (password === 'worker123' || password.length >= 6)) {
    const worker = await db.getProfileByEmail('worker@ionhub.in');
    if (worker) {
      await setAuthSession(worker);
      return { success: true, redirectUrl: '/worker' };
    }
  }

  // Check customer account
  if (email === 'customer@ionhub.in' && (password === 'customer123' || password.length >= 6)) {
    const customer = await db.getProfileByEmail('customer@ionhub.in');
    if (customer) {
      await setAuthSession(customer);
      return { success: true, redirectUrl: '/dashboard' };
    }
  }

  // Check customer or other registered user
  const profile = await db.getProfileByEmail(email);
  if (!profile) {
    return { error: 'No account found with this email. Please sign up or check your credentials.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  await setAuthSession(profile);
  const target = profile.role === 'admin' ? '/admin/pricing' : profile.role === 'worker' ? '/worker' : '/dashboard';
  return { success: true, redirectUrl: target };
}

export async function directRoleLoginAction(role: 'customer' | 'worker' | 'admin'): Promise<ActionResponse> {
  let email = 'customer@ionhub.in';
  let target = '/dashboard';
  if (role === 'admin') {
    email = 'admin@ionhub.in';
    target = '/admin/pricing';
  } else if (role === 'worker') {
    email = 'worker@ionhub.in';
    target = '/worker';
  } else {
    email = 'customer@ionhub.in';
    target = '/dashboard';
  }

  const profile = await db.getProfileByEmail(email);
  if (profile) {
    await setAuthSession(profile);
    return { success: true, redirectUrl: target };
  }
  return { error: 'Account not found' };
}

export const quickLoginRoleAction = directRoleLoginAction;

export async function signupAction(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  const fullName = formData.get('fullName')?.toString().trim();
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const phone = formData.get('phone')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!fullName || !email || !phone || !password) {
    return { error: 'All fields are required.' };
  }

  if (phone.length < 10) {
    return { error: 'Please enter a valid 10-digit phone number.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  // 1. Supabase Auth if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role: 'customer',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // If email confirmation is required, session will be null
        if (!data.session) {
          return {
            error: '✅ Account created! Please check your email to confirm your account, then log in.',
          };
        }

        // Try to get profile (trigger may need a moment to fire)
        let profile = await db.getProfileById(data.user.id);

        // Retry up to 3 times with a short delay for trigger latency
        if (!profile) {
          for (let i = 0; i < 3; i++) {
            await new Promise((resolve) => setTimeout(resolve, 600));
            profile = await db.getProfileById(data.user.id);
            if (profile) break;
          }
        }

        // If trigger still hasn't created the profile, upsert it directly
        if (!profile) {
          try {
            profile = await db.createProfile({
              id: data.user.id,
              auth_user_id: data.user.id,
              full_name: fullName,
              email,
              phone,
              role: 'customer',
              avatar_url: null,
            });
          } catch {
            // Profile may have been created by trigger between retries — fetch again
            profile = await db.getProfileById(data.user.id);
          }
        }

        if (profile) {
          await setAuthSession(profile);
          redirect('/dashboard');
        }
      }

      return { error: 'Account created but could not log in automatically. Please log in manually.' };
    }
  }

  // 2. Persistent Local Mode
  const existing = await db.getProfileByEmail(email);
  if (existing) {
    return { error: 'An account with this email already exists. Please log in.' };
  }

  const newProfile = await db.createProfile({
    id: `p-${Date.now()}`,
    auth_user_id: `auth-${Date.now()}`,
    full_name: fullName,
    email,
    phone,
    role: 'customer',
    avatar_url: null,
  });

  await setAuthSession(newProfile);
  redirect('/dashboard');
}


export async function logoutAction() {
  await clearAuthSession();
  redirect('/login');
}

export async function updateProfileAction(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Unauthorized.' };
  }

  const fullName = formData.get('fullName')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim();

  if (!fullName || !phone) {
    return { error: 'Name and phone are required.' };
  }

  await db.updateProfile(user.id, {
    full_name: fullName,
    phone,
  });

  return { success: true };
}
