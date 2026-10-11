'use client';

import React, { useState } from 'react';
import { Address } from '@/types/database';
import { createAddressAction, deleteAddressAction } from '@/app/actions/booking';
import { EmptyState } from '@/components/EmptyState';
import { MapPin, Plus, Trash2, Home, Building2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface AddressesClientProps {
  initialAddresses: Address[];
}

export function AddressesClient({ initialAddresses }: AddressesClientProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleAddAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const res = await createAddressAction(formData);

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess('Address added successfully!');
      setShowAddForm(false);
      (e.target as HTMLFormElement).reset();
      window.location.reload();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to remove this address?')) return;
    const res = await deleteAddressAction(id);
    if (res?.success) {
      setAddresses(addresses.filter((a) => a.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#5A7065] uppercase">
          Saved Doorstep Addresses ({addresses.length})
        </span>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#3E8E4A]" />
          <span>{showAddForm ? 'Close Form' : 'Add New Address'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-[#EAF5E8] border border-[#3E8E4A]/30 text-xs text-[#0B4F47] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3E8E4A]" />
          <span>{success}</span>
        </div>
      )}

      {/* Add Address Form Modal / Box */}
      {showAddForm && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#0B4F47] shadow-lg animate-in fade-in duration-200">
          <h3 className="text-lg font-black text-[#12312C] mb-4">Add Doorstep Address in Kompally</h3>
          
          <form onSubmit={handleAddAddress} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#12312C] mb-1">Label</label>
                <select
                  name="label"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-xs font-semibold"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Villa">Villa / Apartment</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#12312C] mb-1">Neighborhood Area *</label>
                <input
                  name="area"
                  type="text"
                  required
                  defaultValue="Kompally"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12312C] mb-1">
                House / Flat / Villa No., Building & Street *
              </label>
              <input
                name="addressLine"
                type="text"
                required
                placeholder="e.g. Villa 14, Aparna Kanopy, Kompally"
                className="w-full px-3 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#12312C] mb-1">Landmark (Optional)</label>
                <input
                  name="landmark"
                  type="text"
                  placeholder="e.g. Near Big Bazaar / Cineplanet"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#12312C] mb-1">Pincode *</label>
                <input
                  name="pincode"
                  type="text"
                  required
                  defaultValue="500100"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl border border-[#E0EBDD] text-xs font-bold text-[#5A7065] hover:bg-[#FAF9F2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-extrabold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Address</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address Cards List */}
      {addresses.length === 0 ? (
        <EmptyState
          title="No addresses saved yet."
          description="Add your Kompally residence or office address for fast, 1-click doorstep booking."
          actionText="Add Kompally Address"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white rounded-3xl p-6 border border-[#E0EBDD] shadow-soft flex flex-col justify-between hover:border-[#3E8E4A]/60 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-bold uppercase">
                    {addr.label === 'Office' ? <Building2 className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
                    {addr.label}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-black text-[#12312C]">{addr.address_line}</p>
                <p className="text-xs text-[#5A7065] mt-1">
                  {addr.area}, {addr.city} - {addr.pincode}
                </p>
                {addr.landmark && (
                  <p className="text-[11px] text-[#5A7065] italic mt-1">
                    Landmark: {addr.landmark}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E0EBDD]/60 flex items-center justify-between text-[11px] text-[#3E8E4A] font-semibold">
                <span>Active Service Area</span>
                <span className="text-[#0B4F47]">Kompally Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
