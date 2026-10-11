'use client';

import React, { useState } from 'react';
import { ServiceArea, BusinessHour, ContactMessage } from '@/types/database';
import { 
  adminCreateServiceArea, 
  adminUpdateServiceArea, 
  adminUpdateBusinessHours,
  adminUpdateContactStatus 
} from '@/app/actions/admin';
import { formatDate } from '@/lib/utils';
import { MapPin, Clock, Plus, Power, MessageSquare, Check, Mail, Phone } from 'lucide-react';

interface AdminSettingsClientProps {
  initialAreas: ServiceArea[];
  initialHours: BusinessHour[];
  initialMessages: ContactMessage[];
}

export function AdminSettingsClient({
  initialAreas,
  initialHours,
  initialMessages,
}: AdminSettingsClientProps) {
  const [areas, setAreas] = useState<ServiceArea[]>(initialAreas);
  const [hours, setHours] = useState<BusinessHour[]>(initialHours);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);

  // New Area Form
  const [newAreaName, setNewAreaName] = useState('');
  const [newPincode, setNewPincode] = useState('500100');

  const [notification, setNotification] = useState<string | null>(null);

  const handleToggleArea = async (area: ServiceArea) => {
    setNotification(null);
    const res = await adminUpdateServiceArea(area.id, { is_active: !area.is_active });
    if (res?.success && res.area) {
      setAreas(areas.map((a) => (a.id === area.id ? res.area! : a)));
      setNotification(`Area ${area.area_name} is now ${!area.is_active ? 'ACTIVE' : 'DISABLED'}.`);
    }
  };

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;

    const res = await adminCreateServiceArea({
      area_name: newAreaName.trim(),
      city: 'Hyderabad',
      pincode: newPincode.trim(),
      is_active: true,
    });

    if (res?.success && res.area) {
      setAreas([...areas, res.area]);
      setNewAreaName('');
      setNotification(`Added service area: ${res.area.area_name}`);
    }
  };

  const handleMarkMessage = async (msgId: string, status: 'read' | 'replied') => {
    const res = await adminUpdateContactStatus(msgId, status);
    if (res?.success && res.message) {
      setMessages(messages.map((m) => (m.id === msgId ? res.message! : m)));
    }
  };

  return (
    <div className="space-y-8">
      
      {notification && (
        <div className="p-4 rounded-2xl bg-[#EAF5E8] border border-[#3E8E4A]/30 text-xs text-[#0B4F47] flex items-center justify-between">
          <span className="font-bold">{notification}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* 1. Service Areas Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0EBDD]/60 pb-4">
          <div>
            <h3 className="text-lg font-black text-[#12312C] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#3E8E4A]" /> Service Areas & Neighborhoods
            </h3>
            <p className="text-xs text-[#5A7065]">
              Currently restricted to Kompally. Expanding areas can be activated here.
            </p>
          </div>
        </div>

        {/* Add Area Form */}
        <form onSubmit={handleAddArea} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD]">
          <div>
            <label className="block text-[11px] font-bold text-[#12312C] mb-1">Area Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Gundlapochampally / Dhulapally"
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E0EBDD] bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#12312C] mb-1">Pincode *</label>
            <input
              type="text"
              required
              value={newPincode}
              onChange={(e) => setNewPincode(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E0EBDD] bg-white"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-bold transition flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4 text-[#3E8E4A]" /> Add Service Area
            </button>
          </div>
        </form>

        {/* Areas List */}
        <div className="divide-y divide-[#E0EBDD]/60">
          {areas.map((area) => (
            <div key={area.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#12312C]">{area.area_name}</span>
                <span className="text-xs text-[#5A7065] ml-2">
                  {area.city} - {area.pincode}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase ml-3 px-2 py-0.5 rounded-full ${
                    area.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {area.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleToggleArea(area)}
                className="px-3 py-1.5 rounded-xl border border-[#E0EBDD] text-xs font-bold text-[#0B4F47] hover:bg-[#FAF9F2]"
              >
                {area.is_active ? 'Disable' : 'Enable'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Business Hours Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-4">
        <h3 className="text-lg font-black text-[#12312C] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#3E8E4A]" /> Operating Hours Settings
        </h3>
        <p className="text-xs text-[#5A7065]">
          Current doorstep operating schedule is 6:00 PM – 11:00 PM Daily.
        </p>

        <div className="space-y-3 pt-2">
          {hours.map((bh) => (
            <div key={bh.id} className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-black text-[#0B4F47]">{bh.day_of_week}</h4>
                <p className="text-xs text-[#5A7065]">{bh.note}</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-[#12312C]">
                <span>{bh.opening_time} — {bh.closing_time}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                  Open
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Customer Contact Inquiries Inbox */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-[#E0EBDD]/60 pb-3">
          <h3 className="text-lg font-black text-[#12312C] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#3E8E4A]" /> Contact Form Messages ({messages.length})
          </h3>
        </div>

        {messages.length === 0 ? (
          <p className="text-xs text-[#5A7065] py-4 text-center">No contact inquiries received yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#12312C]">{m.name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        m.status === 'replied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'read'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5A7065]">{formatDate(m.created_at)}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#5A7065]">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#3E8E4A]" /> {m.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#3E8E4A]" /> {m.email}
                  </span>
                </div>

                <p className="text-xs text-[#12312C] bg-white p-3 rounded-xl border border-[#E0EBDD]">
                  {m.message}
                </p>

                <div className="flex justify-end gap-2 pt-1">
                  {m.status === 'unread' && (
                    <button
                      type="button"
                      onClick={() => handleMarkMessage(m.id, 'read')}
                      className="text-[11px] font-bold text-[#0B4F47] hover:underline"
                    >
                      Mark as Read
                    </button>
                  )}
                  {m.status !== 'replied' && (
                    <button
                      type="button"
                      onClick={() => handleMarkMessage(m.id, 'replied')}
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      Mark as Replied
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
