'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Booking } from '@/types/database';
import { BookingStatusTracker } from '@/components/BookingStatusTracker';
import { EmptyState } from '@/components/EmptyState';
import { cancelBookingAction } from '@/app/actions/booking';
import { formatPrice, formatDate } from '@/lib/utils';
import { 
  Car, 
  Shirt, 
  Clock, 
  MapPin, 
  Check, 
  X, 
  AlertCircle, 
  Calendar, 
  FileText,
  ChevronRight,
  Filter,
  Loader2
} from 'lucide-react';

interface BookingHistoryClientProps {
  initialBookings: Booking[];
  initialSelectedRef?: string;
}

export function BookingHistoryClient({
  initialBookings,
  initialSelectedRef,
}: BookingHistoryClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  
  // Selected booking for detailed drawer / modal
  const initialBooking = initialSelectedRef
    ? initialBookings.find((b) => b.booking_reference === initialSelectedRef)
    : null;
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(initialBooking || null);
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    if (filter === 'UPCOMING') return !['COMPLETED', 'CANCELLED'].includes(b.status);
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    if (filter === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    setActionError(null);

    const res = await cancelBookingAction(bookingId);
    setCancelling(false);

    if (res?.error) {
      setActionError(res.error);
    } else {
      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: 'CANCELLED' });
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E0EBDD] flex flex-wrap items-center justify-between gap-3 shadow-soft">
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-4 h-4 text-[#0B4F47]" />
          <span className="font-bold text-[#12312C]">Filter Status:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                filter === tab
                  ? 'bg-[#0B4F47] text-white'
                  : 'bg-[#FAF9F2] text-[#5A7065] hover:bg-[#EAF5E8] hover:text-[#0B4F47]'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {actionError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title={`No ${filter !== 'ALL' ? filter.toLowerCase() : ''} bookings found`}
          description="Your scheduled appointments and completed service records will appear here."
          actionText="Book a Doorstep Service"
          actionHref="/book"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((b) => {
            const isCar = b.service?.slug === 'car-wash';
            const isSelected = selectedBooking?.id === b.id;

            return (
              <div
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer shadow-soft hover:shadow-card-hover ${
                  isSelected ? 'border-[#0B4F47] ring-2 ring-[#EAF5E8]' : 'border-[#E0EBDD]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center flex-shrink-0">
                      {isCar ? <Car className="w-6 h-6 text-[#3E8E4A]" /> : <Shirt className="w-6 h-6 text-[#3E8E4A]" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-[#12312C]">{b.service?.name}</h3>
                        <span className="text-xs font-mono font-bold text-[#0B4F47]">
                          #{b.booking_reference}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A7065] mt-1">
                        <span className="flex items-center gap-1 font-semibold text-[#12312C]">
                          <Calendar className="w-3.5 h-3.5 text-[#3E8E4A]" /> {formatDate(b.booking_date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#3E8E4A]" /> {b.time_slot}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#3E8E4A]" /> {b.address?.area}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E0EBDD]/60">
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-[#12312C] block">
                        {b.discount_amount && b.discount_amount > 0 && (b.final_payable_amount === 0 || b.final_payable_amount === null) ? (
                          <span className="text-emerald-700 font-black">₹0 (5th Order Free)</span>
                        ) : b.pricing_type === 'SUBSCRIPTION' && (b.final_payable_amount === 0 || b.final_payable_amount === null) ? (
                          <span className="text-purple-700 font-bold">
                            {isCar ? '🚗 Car Wash Monthly Pass' : '👕 Ironing Monthly Plan'}
                          </span>
                        ) : (
                          formatPrice(b.final_payable_amount ?? b.total_amount)
                        )}
                      </span>
                      {b.pairs_count ? (
                        <span className="text-[10px] text-[#5A7065] block font-semibold">{b.pairs_count} pairs (Ironing)</span>
                      ) : isCar ? (
                        <span className="text-[10px] text-blue-700 block font-semibold">Car Wash Service</span>
                      ) : null}
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-block mt-1 ${
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

                    <div className="text-[#0B4F47]">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Expanded Details Panel if selected */}
                {isSelected && (
                  <div className="mt-6 pt-6 border-t border-[#E0EBDD] space-y-6 animate-in fade-in duration-200">
                    <BookingStatusTracker status={b.status} bookingReference={b.booking_reference} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-1">
                        <span className="font-bold text-[#5A7065] uppercase">Pickup & Delivery Address</span>
                        <p className="font-semibold text-[#12312C]">{b.address?.address_line}</p>
                        <p className="text-[#5A7065]">{b.address?.area}, {b.address?.city} - {b.address?.pincode}</p>
                        {b.address?.landmark && (
                          <p className="text-[11px] text-[#5A7065] italic">Near: {b.address.landmark}</p>
                        )}
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-1">
                        <span className="font-bold text-[#5A7065] uppercase">Selected Service Items</span>
                        {b.items && b.items.length > 0 ? (
                          <ul className="space-y-1 pt-1">
                            {b.items.map((item) => (
                              <li key={item.id} className="flex items-center gap-1.5 text-[#12312C]">
                                <Check className="w-3.5 h-3.5 text-[#3E8E4A]" /> {item.item_name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[#5A7065]">Full standard service package</p>
                        )}
                      </div>
                    </div>

                    {b.customer_notes && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                        <strong>Special Instructions:</strong> {b.customer_notes}
                      </div>
                    )}

                    {/* Cancellation Button if eligible */}
                    {!['COMPLETED', 'CANCELLED', 'OUT_FOR_DELIVERY', 'IN_SERVICE'].includes(b.status) && (
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          disabled={cancelling}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(b.id);
                          }}
                          className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          {cancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                          <span>Cancel This Booking</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
