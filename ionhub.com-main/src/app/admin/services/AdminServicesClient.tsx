'use client';

import React, { useState } from 'react';
import { Service } from '@/types/database';
import { adminUpdateService, adminCreateService } from '@/app/actions/admin';
import { formatPrice } from '@/lib/utils';
import { Sparkles, Edit, Power, Check, X, Plus, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface AdminServicesClientProps {
  initialServices: Service[];
}

export function AdminServicesClient({ initialServices }: AdminServicesClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Edit fields
  const [editPrice, setEditPrice] = useState<string>('');
  const [editDuration, setEditDuration] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');

  const [message, setMessage] = useState<string | null>(null);

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setEditPrice(s.price ? s.price.toString() : '');
    setEditDuration(s.duration_minutes ? s.duration_minutes.toString() : '60');
    setEditDescription(s.description);
  };

  const handleSaveEdit = async (s: Service) => {
    setMessage(null);
    const priceVal = editPrice.trim() === '' ? null : parseFloat(editPrice);
    const durationVal = editDuration.trim() === '' ? 60 : parseInt(editDuration);

    const res = await adminUpdateService(s.id, {
      price: priceVal,
      duration_minutes: durationVal,
      description: editDescription,
    });

    if (res?.success && res.service) {
      setServices((prev) => prev.map((item) => (item.id === s.id ? res.service! : item)));
      setEditingId(null);
      setMessage(`Updated ${s.name} successfully.`);
    }
  };

  const handleToggleActive = async (s: Service) => {
    setMessage(null);
    const res = await adminUpdateService(s.id, {
      is_active: !s.is_active,
    });
    if (res?.success && res.service) {
      setServices((prev) => prev.map((item) => (item.id === s.id ? res.service! : item)));
      setMessage(`${s.name} is now ${!s.is_active ? 'ACTIVE' : 'INACTIVE'}.`);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#5A7065] uppercase">
          Database Service Catalog ({services.length})
        </span>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#3E8E4A]" />
          <span>Add New Doorstep Service</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-[#EAF5E8] border border-[#3E8E4A]/30 text-xs text-[#0B4F47] flex items-center justify-between">
          <span className="font-bold">{message}</span>
          <button onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const isEditing = editingId === service.id;

          return (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-6 border border-[#E0EBDD] shadow-soft flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      service.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {service.is_active ? 'Active' : 'Disabled / Coming Soon'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(service)}
                    className="p-1.5 rounded-lg border border-[#E0EBDD] hover:bg-[#FAF9F2] text-xs font-semibold flex items-center gap-1 text-[#0B4F47]"
                    title="Toggle active status"
                  >
                    <Power className={`w-3.5 h-3.5 ${service.is_active ? 'text-[#3E8E4A]' : 'text-slate-400'}`} />
                    <span>{service.is_active ? 'Deactivate' : 'Activate'}</span>
                  </button>
                </div>

                <h3 className="text-lg font-black text-[#12312C]">{service.name}</h3>
                <span className="text-[11px] font-mono text-[#5A7065] block mb-2">slug: {service.slug}</span>

                {isEditing ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#12312C] mb-1">
                        Price (leave blank for &ldquo;Get Quote&rdquo;)
                      </label>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        placeholder="null -> Get Quote"
                        className="w-full px-3 py-1.5 rounded-xl border border-[#E0EBDD] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#12312C] mb-1">Duration (mins)</label>
                      <input
                        type="number"
                        value={editDuration}
                        onChange={(e) => setEditDuration(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-[#E0EBDD] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#12312C] mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-[#E0EBDD] text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 rounded-lg border border-slate-200 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(service)}
                        className="px-3 py-1 rounded-lg bg-[#0B4F47] text-white text-xs font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-[#5A7065] leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#0B4F47]">
                        {formatPrice(service.price)}
                      </span>
                      {service.duration_minutes && (
                        <span className="text-[#5A7065] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#3E8E4A]" /> {service.duration_minutes}m
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="pt-3 border-t border-[#E0EBDD]/60 flex justify-end">
                  <button
                    type="button"
                    onClick={() => startEdit(service)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F47] hover:underline"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Pricing & Details</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
