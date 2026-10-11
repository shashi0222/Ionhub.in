import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { 
  Bike, 
  LogOut, 
  Shirt, 
  Car, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export default async function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'worker' && user.role !== 'admin')) {
    return (
      <div className="py-24 bg-[#FAF9F2] min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-emerald-200 text-center shadow-soft space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#0B4F47] flex items-center justify-center mx-auto">
            <Bike className="w-8 h-8 text-[#3E8E4A]" />
          </div>
          <h2 className="text-xl font-black text-[#12312C]">Specialist Portal Access</h2>
          <p className="text-xs text-[#5A7065] leading-relaxed">
            Please log in with an authorized ION HUB specialist worker account to access assigned pickup and delivery orders.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="py-2.5 px-4 rounded-xl bg-[#0B4F47] text-white text-xs font-bold hover:bg-[#176B5D] transition"
            >
              Log in to Specialist Account
            </Link>
            <Link
              href="/"
              className="py-2.5 px-4 rounded-xl border border-[#E0EBDD] text-xs font-bold text-[#5A7065]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#FAF9F2] min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Worker Header Banner */}
        <div className="bg-[#0B4F47] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Bike className="w-8 h-8 text-[#3E8E4A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">Specialist Service Console</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#3E8E4A] text-slate-950 font-black text-[10px] uppercase">
                  Doorstep Ops
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Kompally Ward • {user.full_name} ({user.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#3E8E4A]" />
                <span>Admin Console</span>
              </Link>
            )}
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>

        {/* Child Pages */}
        {children}

      </div>
    </div>
  );
}
