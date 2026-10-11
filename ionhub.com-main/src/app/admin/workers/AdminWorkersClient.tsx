'use client';

import React, { useState } from 'react';
import { UserProfile, Booking } from '@/types/database';
import { adminCreateWorker } from '@/app/actions/admin';
import { 
  Wrench, 
  UserPlus, 
  Phone, 
  Mail, 
  Key, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X,
  ShieldCheck
} from 'lucide-react';

interface AdminWorkersClientProps {
  initialWorkers: UserProfile[];
  bookings: Booking[];
}

export function AdminWorkersClient({ initialWorkers, bookings }: AdminWorkersClientProps) {
  const [workers, setWorkers] = useState<UserProfile[]>(initialWorkers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const res = await adminCreateWorker({
      fullName,
      phone,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.worker) {
      setWorkers((prev) => [res.worker as UserProfile, ...prev]);
      setSuccessMsg(`Specialist worker ${res.worker.full_name} created successfully! They can now log in using ${res.worker.email}.`);
      setFullName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E0EBDD] shadow-soft">
        <div>
          <h3 className="text-lg font-black text-[#12312C] flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#3E8E4A]" />
            <span>Active Field Specialists ({workers.length})</span>
          </h3>
          <p className="text-xs text-[#5A7065] mt-1">
            Specialist workers assigned to doorstep vehicle washing and garment handling.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-black flex items-center justify-center gap-2 transition shadow-md"
        >
          <UserPlus className="w-4 h-4 text-[#3E8E4A]" />
          <span>ADD SPECIALIST WORKER</span>
        </button>
      </div>

      {/* Workers List */}
      <div className="bg-white rounded-3xl border border-[#E0EBDD] overflow-hidden shadow-soft">
        {workers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center mx-auto">
              <Wrench className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#12312C]">No specialist workers found</p>
            <p className="text-xs text-[#5A7065]">Click &apos;Add Specialist Worker&apos; above to register field specialists.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E0EBDD]/60">
            {workers.map((w) => {
              const assignedOrders = bookings.filter((b) => b.worker_id === w.id);
              const completedOrders = assignedOrders.filter((b) => b.status === 'COMPLETED');

              return (
                <div key={w.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF9F2] transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] text-[#0B4F47] border border-[#3E8E4A]/30 flex items-center justify-center font-black text-lg">
                      {w.full_name?.charAt(0) || 'W'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-[#12312C]">{w.full_name}</h4>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#3E8E4A]/20 text-[#0B4F47]">
                          Specialist Worker
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A7065] mt-1.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-[#3E8E4A]" />
                          <span className="font-semibold text-[#12312C]">{w.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#3E8E4A]" />
                          <span>{w.phone || 'No phone'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#12312C] block">
                        {assignedOrders.length} Orders Assigned
                      </span>
                      <span className="text-[11px] text-[#5A7065]">
                        {completedOrders.length} Delivered
                      </span>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-[#FAF9F2] border border-[#E0EBDD] text-center">
                      <span className="text-[10px] font-bold text-[#5A7065] uppercase block">Login Status</span>
                      <span className="text-xs font-bold text-emerald-700">Active</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Worker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E0EBDD] shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-[#E0EBDD]/60 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#12312C]">Add Specialist Worker</h3>
                  <p className="text-[11px] text-[#5A7065]">Configure credentials for worker login</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#5A7065] hover:bg-[#FAF9F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddWorker} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                  Mobile / Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                  Login Email / User ID *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ramesh@ionhub.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                  Login Password *
                </label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. ramesh123"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0EBDD] focus:outline-none focus:ring-2 focus:ring-[#0B4F47] text-sm bg-[#FAF9F2]"
                />
                <span className="text-[10px] text-[#5A7065] mt-1 block">
                  Worker will log in at /login using this email and password.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E0EBDD] text-xs font-bold text-[#5A7065] hover:bg-[#FAF9F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-bold flex items-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#3E8E4A]" />
                      <span>Saving Worker...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save & Authorize Worker</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
