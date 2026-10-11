import { cookies } from 'next/headers';
import { db } from './db';
import { createServerSupabaseClient } from './supabase/server';
import { UserProfile } from '@/types/database';

const SESSION_COOKIE = 'ionhub_session';

export async function getCurrentUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies();

  // 1. Try Supabase Auth if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const profile = await db.getProfileById(user.id);
        if (profile) return profile;
      }
    }
  }

  // 2. Fallback to session cookie
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionToken) return null;

  try {
    const sessionData = JSON.parse(sessionToken);
    if (sessionData && sessionData.userId) {
      const profile = await db.getProfileById(sessionData.userId);
      return profile || null;
    }
  } catch {
    return null;
  }

  return null;
}

export async function setAuthSession(user: UserProfile) {
  const cookieStore = await cookies();
  const sessionPayload = JSON.stringify({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  cookieStore.set(SESSION_COOKIE, sessionPayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  }
}
