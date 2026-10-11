import React from 'react';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Users, Phone, Mail, Calendar, ShieldCheck, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Customer Management — ION HUB Admin',
};

export default async function AdminCustomersPage() {
  const [profiles, bookings] = await Promise.all([
    db.getProfiles(),
    db.getBookings(),
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0EBDD]/70 pb-4">
        <h2 className="text-2xl font-black text-[#12312C]">Customer Accounts Directory</h2>
        <p className="text-xs text-[#5A7065] mt-1">
          Registered customers, contact numbers, and their doorstep service frequency.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E0EBDD] overflow-hidden shadow-soft">
        <div className="p-4 bg-[#FAF9F2] border-b border-[#E0EBDD] flex items-center justify-between">
          <span className="text-xs font-bold text-[#12312C] uppercase">
            Customer Profiles ({profiles.length})
          </span>
        </div>

        {profiles.length === 0 ? (
          <p className="p-8 text-xs text-[#5A7065] text-center">No customer accounts registered yet.</p>
        ) : (
          <div className="divide-y divide-[#E0EBDD]/60">
            {profiles.map((p) => {
              const customerBookings = bookings.filter((b) => b.user_id === p.id);
              const isCustAdmin = p.role === 'admin';

              return (
                <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF9F2] transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center font-black text-lg">
                      {p.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-[#12312C]">{p.full_name}</h3>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            isCustAdmin ? 'bg-amber-100 text-amber-900' : 'bg-[#EAF5E8] text-[#0B4F47]'
                          }`}
                        >
                          {p.role}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A7065] mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-[#3E8E4A]" /> {p.email}
                        </span>
                        {p.phone && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#3E8E4A]" /> {p.phone}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>Joined {formatDate(p.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="p-2.5 px-4 rounded-xl bg-[#FAF9F2] border border-[#E0EBDD] text-center">
                      <span className="text-[10px] text-[#5A7065] font-bold uppercase block">Bookings</span>
                      <span className="text-base font-black text-[#0B4F47]">{customerBookings.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
