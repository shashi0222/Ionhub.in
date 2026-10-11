'use client';

import React, { useState } from 'react';
import { Booking, BookingStatus } from '@/types/database';
import { adminUpdateBookingStatus } from '@/app/actions/admin';
import { formatPrice, formatDate } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  CalendarCheck, 
  Bike, 
  Sparkles, 
  Truck, 
  CheckCheck, 
  XCircle,
  Filter,
  Search,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';

interface AdminBookingsClientProps {
  initialBookings: Booking[];
  selectedIdFromUrl?: string;
}

const ALL_STATUSES: BookingStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PICKUP_SCHEDULED',
  'PICKED_UP',
  'IN_SERVICE',
  'READY',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
  'CANCELLED',
];

export function AdminBookingsClient({
  initialBookings,
  selectedIdFromUrl,
}: AdminBookingsClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  
  const [activeBooking, setActiveBooking] = useState<Booking | null>(
    selectedIdFromUrl
      ? initialBookings.find((b) => b.id === selectedIdFromUrl || b.booking_reference === selectedIdFromUrl) || initialBookings[0] || null
      : initialBookings[0] || null
  );

  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    // Search
    const matchesSearch =
      b.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.user?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.address?.address_line || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Status
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

    // Service
    const matchesService = serviceFilter === 'ALL' || b.service?.slug === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const handleUpdateStatus = async (newStatus: BookingStatus) => {
    if (!activeBooking) return;
    setUpdating(true);
    setStatusMessage(null);

    const res = await adminUpdateBookingStatus(activeBooking.id, newStatus);
    setUpdating(false);

    if (res?.error) {
      setStatusMessage(`Error: ${res.error}`);
    } else {
      setStatusMessage(`Status updated to ${newStatus}`);
      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === activeBooking.id ? { ...b, status: newStatus } : b))
      );
      setActiveBooking({ ...activeBooking, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E0EBDD] shadow-soft grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, customer, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E0EBDD] text-xs bg-[#FAF9F2]"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[#E0EBDD] text-xs bg-[#FAF9F2] font-semibold"
          >
            <option value="ALL">All Statuses ({bookings.length})</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Service Filter */}
        <div>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[#E0EBDD] text-xs bg-[#FAF9F2] font-semibold"
          >
            <option value="ALL">All Services</option>
            <option value="car-wash">Doorstep Car Wash</option>
            <option value="ironing">Professional Ironing</option>
          </select>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-[#EAF5E8] border border-[#3E8E4A]/30 text-xs text-[#0B4F47] flex items-center justify-between">
          <span className="font-bold">{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-xs font-semibold">✕</button>
        </div>
      )}

      {/* Main Split: Left Bookings Table, Right Action Workflow Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Bookings Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E0EBDD] overflow-hidden shadow-soft">
          <div className="p-4 border-b border-[#E0EBDD] bg-[#FAF9F2] flex items-center justify-between">
            <span className="text-xs font-bold text-[#12312C] uppercase">
              Bookings Registry ({filteredBookings.length})
            </span>
          </div>

          {filteredBookings.length === 0 ? (
            <p className="text-xs text-[#5A7065] p-8 text-center">No bookings match the filters.</p>
          ) : (
            <div className="divide-y divide-[#E0EBDD]/60 max-h-[700px] overflow-y-auto">
              {filteredBookings.map((b) => {
                const isSelected = activeBooking?.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setActiveBooking(b)}
                    className={`p-4 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected ? 'bg-[#EAF5E8]/40 border-l-4 border-[#0B4F47]' : 'hover:bg-[#FAF9F2]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#0B4F47]">
                          #{b.booking_reference}
                        </span>
                        <span className="text-xs font-black text-[#12312C]">{b.service?.name}</span>
                      </div>
                      <p className="text-[11px] text-[#5A7065] mt-0.5">
                        {b.user?.full_name || 'Customer'} • {formatDate(b.booking_date)} ({b.time_slot})
                      </p>
                      <p className="text-[10px] text-[#5A7065] truncate max-w-xs">{b.address?.address_line}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-block ${
                          b.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-[#EAF5E8] text-[#0B4F47]'
                        }`}
                      >
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Operational Status Workflow Control Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-6">
          {activeBooking ? (
            <>
              <div className="border-b border-[#E0EBDD]/60 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#5A7065] uppercase">Operational Control</span>
                  <span className="text-xs font-mono font-black text-[#0B4F47]">
                    #{activeBooking.booking_reference}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#12312C] mt-1">
                  {activeBooking.service?.name}
                </h3>
                <p className="text-xs text-[#5A7065]">
                  Status: <strong className="text-[#0B4F47] uppercase">{activeBooking.status.replace(/_/g, ' ')}</strong>
                </p>
              </div>

              {/* Status Action Workflow Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#12312C] uppercase tracking-wider block">
                  Advance Status in Database:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    disabled={updating || activeBooking.status === 'CONFIRMED'}
                    onClick={() => handleUpdateStatus('CONFIRMED')}
                    className="p-2.5 rounded-xl border border-[#E0EBDD] hover:bg-[#EAF5E8] text-xs font-bold text-[#0B4F47] flex items-center gap-1.5 transition disabled:opacity-40"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-[#3E8E4A]" />
                    <span>Confirm Booking</span>
                  </button>

                  <button
                    disabled={updating || activeBooking.status === 'PICKUP_SCHEDULED'}
                    onClick={() => handleUpdateStatus('PICKUP_SCHEDULED')}
                    className="p-2.5 rounded-xl border border-[#E0EBDD] hover:bg-[#EAF5E8] text-xs font-bold text-[#0B4F47] flex items-center gap-1.5 transition disabled:opacity-40"
                  >
                    <Bike className="w-3.5 h-3.5 text-[#3E8E4A]" />
                    <span>Schedule Pickup</span>
                  </button>

                  <button
                    disabled={updating || activeBooking.status === 'PICKED_UP'}
                    onClick={() => handleUpdateStatus('PICKED_UP')}
                    className="p-2.5 rounded-xl border border-[#E0EBDD] hover:bg-[#EAF5E8] text-xs font-bold text-[#0B4F47] flex items-center gap-1.5 transition disabled:opacity-40"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3E8E4A]" />
                    <span>Mark Picked Up</span>
                  </button>

                  <button
                    disabled={updating || activeBooking.status === 'IN_SERVICE'}
                    onClick={() => handleUpdateStatus('IN_SERVICE')}
                    className="p-2.5 rounded-xl border border-[#E0EBDD] hover:bg-[#EAF5E8] text-xs font-bold text-[#0B4F47] flex items-center gap-1.5 transition disabled:opacity-40"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#3E8E4A]" />
                    <span>Mark In Service</span>
                  </button>

                  <button
                    disabled={updating || activeBooking.status === 'READY'}
                    onClick={() => handleUpdateStatus('READY')}
                    className="p-2.5 rounded-xl border border-[#E0EBDD] hover:bg-[#EAF5E8] text-xs font-bold text-[#0B4F47] flex items-center gap-1.5 transition disabled:opacity-40"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-[#3E8E4A]" />
                    <span>Mark Ready</span>
                  </button>

                  <button
                    disabled={updating || activeBooking.status === 'OUT_FOR_DELIVERY'}
                    onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
                    className="p-2.5 rounded-xl border border-[#E0EBDD] hover:bg-[#EAF5E8] text-xs font-bold text-[#0B4F47] flex items-center gap-1.5 transition disabled:opacity-40"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#3E8E4A]" />
                    <span>Out For Delivery</span>
                  </button>

                  <button
                    disabled={updating || activeBooking.status === 'COMPLETED'}
                    onClick={() => handleUpdateStatus('COMPLETED')}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition disabled:opacity-40 col-span-1 sm:col-span-2 shadow-sm"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark Completed & Delivered</span>
                  </button>

                  <button
                    disabled={updating || activeBooking.status === 'CANCELLED'}
                    onClick={() => handleUpdateStatus('CANCELLED')}
                    className="p-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-40 col-span-1 sm:col-span-2"
                  >
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              </div>

              {/* Pricing, Promotion & Worker Payout Breakdown */}
              <div className="pt-4 border-t border-[#E0EBDD]/60 space-y-2 text-xs">
                <span className="font-black text-[#12312C] block uppercase tracking-wider text-[11px]">
                  Financial & Service Breakdown
                </span>
                <div className="p-3.5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#5A7065]">Pricing Model:</span>
                    <span className="font-bold text-[#0B4F47]">
                      {activeBooking.pricing_type === 'SUBSCRIPTION' ? 'Monthly Subscription' : 'Pay Per Order'}
                    </span>
                  </div>
                  {activeBooking.pairs_count && (
                    <div className="flex justify-between">
                      <span className="text-[#5A7065]">Garment Volume:</span>
                      <span className="font-bold text-[#12312C]">
                        {activeBooking.pairs_count} Pairs ({activeBooking.garments_count || activeBooking.pairs_count * 2} Garments)
                      </span>
                    </div>
                  )}
                  {activeBooking.discount_amount && activeBooking.discount_amount > 0 ? (
                    <div className="flex justify-between text-[#3E8E4A] font-bold">
                      <span>Promotion Applied:</span>
                      <span>5th Order FREE (-₹{activeBooking.discount_amount})</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between border-t border-[#E0EBDD] pt-1">
                    <span className="font-bold text-[#12312C]">Customer Amount:</span>
                    <span className="font-black text-[#0B4F47]">
                      ₹{activeBooking.final_payable_amount ?? activeBooking.total_amount ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#E0EBDD] pt-1 text-[#0B4F47]">
                    <span className="font-bold">Specialist Worker Payout:</span>
                    <span className="font-black text-sm">
                      ₹{activeBooking.worker_payout || 35}
                    </span>
                  </div>
                  {activeBooking.worker_name && (
                    <div className="flex justify-between text-[11px] text-[#5A7065]">
                      <span>Assigned Specialist:</span>
                      <span className="font-semibold text-[#12312C]">{activeBooking.worker_name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer & Doorstep details */}
              <div className="pt-2 space-y-3 text-xs">
                <div>
                  <span className="font-bold text-[#12312C] block">Customer Contact</span>
                  <p className="text-[#5A7065]">{activeBooking.user?.full_name} • {activeBooking.user?.phone}</p>
                  <p className="text-[#5A7065]">{activeBooking.user?.email}</p>
                </div>

                <div>
                  <span className="font-bold text-[#12312C] block">Doorstep Address</span>
                  <p className="text-[#5A7065]">{activeBooking.address?.address_line}</p>
                  <p className="text-[#5A7065]">
                    {activeBooking.address?.area}, {activeBooking.address?.city} - {activeBooking.address?.pincode}
                  </p>
                </div>

                {activeBooking.customer_notes && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                    <strong>Special Instructions:</strong> {activeBooking.customer_notes}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-xs text-[#5A7065] text-center py-10">Select a booking to manage status.</p>
          )}
        </div>

      </div>

    </div>
  );
}
