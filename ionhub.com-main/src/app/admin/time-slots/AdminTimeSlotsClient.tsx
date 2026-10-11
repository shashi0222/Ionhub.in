'use client';

import React, { useState } from 'react';
import { TimeSlot } from '@/types/database';
import { adminUpdateTimeSlot, adminCreateTimeSlot } from '@/app/actions/admin';
import { Clock, Plus, Power, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminTimeSlotsClientProps {
  initialSlots: TimeSlot[];
}

export function AdminTimeSlotsClient({ initialSlots }: AdminTimeSlotsClientProps) {
  const [slots, setSlots] = useState<TimeSlot[]>(initialSlots);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newCapacity, setNewCapacity] = useState('5');
  const [message, setMessage] = useState<string | null>(null);

  const handleToggle = async (slot: TimeSlot) => {
    setMessage(null);
    const res = await adminUpdateTimeSlot(slot.id, {
      is_active: !slot.is_active,
    });
    if (res?.success && res.slot) {
      setSlots((prev) => prev.map((s) => (s.id === slot.id ? res.slot! : s)));
      setMessage(`Time slot ${slot.slot_time} is now ${!slot.is_active ? 'ACTIVE' : 'DISABLED'}.`);
    }
  };

  const handleCapacityChange = async (slot: TimeSlot, capStr: string) => {
    const cap = parseInt(capStr);
    if (isNaN(cap) || cap < 0) return;
    const res = await adminUpdateTimeSlot(slot.id, { capacity: cap });
    if (res?.success && res.slot) {
      setSlots((prev) => prev.map((s) => (s.id === slot.id ? res.slot! : s)));
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTime.trim()) return;

    const res = await adminCreateTimeSlot({
      slot_time: newSlotTime.trim(),
      capacity: parseInt(newCapacity) || 5,
      is_active: true,
      display_order: slots.length + 1,
    });

    if (res?.success && res.slot) {
      setSlots([...slots, res.slot]);
      setNewSlotTime('');
      setMessage(`Added slot ${res.slot.slot_time}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {message && (
        <div className="p-4 rounded-2xl bg-[#EAF5E8] border border-[#3E8E4A]/30 text-xs text-[#0B4F47] flex items-center justify-between">
          <span className="font-bold">{message}</span>
          <button onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* Add Time Slot form */}
      <div className="bg-white rounded-3xl p-6 border border-[#E0EBDD] shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-[#12312C] uppercase flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[#3E8E4A]" /> Create New Doorstep Time Slot
        </h3>

        <form onSubmit={handleCreateSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              placeholder="e.g. 05:00 PM - 06:00 PM"
              value={newSlotTime}
              onChange={(e) => setNewSlotTime(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E0EBDD] bg-[#FAF9F2]"
            />
          </div>
          <div>
            <input
              type="number"
              min="1"
              max="50"
              required
              placeholder="Capacity (e.g. 5)"
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E0EBDD] bg-[#FAF9F2]"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-bold transition"
          >
            Add Slot
          </button>
        </form>
      </div>

      {/* Time slots list */}
      <div className="bg-white rounded-3xl border border-[#E0EBDD] overflow-hidden shadow-soft">
        <div className="p-4 bg-[#FAF9F2] border-b border-[#E0EBDD] flex items-center justify-between">
          <span className="text-xs font-bold text-[#12312C] uppercase">
            Active Evening Slots ({slots.length})
          </span>
          <span className="text-xs text-[#5A7065]">Doorstep window: 6 PM – 11 PM</span>
        </div>

        <div className="divide-y divide-[#E0EBDD]/60">
          {slots.map((s) => (
            <div
              key={s.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF9F2] transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    s.is_active ? 'bg-[#EAF5E8] text-[#0B4F47]' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#12312C]">{s.slot_time}</h4>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                      s.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {s.is_active ? 'Available For Customers' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5A7065] font-semibold">Max Capacity:</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    defaultValue={s.capacity}
                    onBlur={(e) => handleCapacityChange(s, e.target.value)}
                    className="w-16 px-2 py-1 text-xs rounded-lg border border-[#E0EBDD] text-center font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(s)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                    s.is_active
                      ? 'border-red-200 text-red-600 hover:bg-red-50'
                      : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{s.is_active ? 'Disable' : 'Enable'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
