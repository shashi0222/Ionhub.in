'use client';

import React, { useState } from 'react';
import { Booking, BookingStatus } from '@/types/database';
import { workerUpdateOrderStatus } from '@/app/actions/worker';
import { formatDate } from '@/lib/utils';
import { 
  Shirt, 
  Car, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  Gift, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  FileText,
  BadgePercent
} from 'lucide-react';

interface WorkerOrderCardProps {
  booking: Booking;
}

export function WorkerOrderCard({ booking }: WorkerOrderCardProps) {
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(booking.status);
  const [message, setMessage] = useState<string | null>(null);

  const isIroning =
    booking.service_id === 's2222222-2222-2222-2222-222222222222' ||
    booking.service?.slug === 'ironing' ||
    booking.pricing_type === 'PAY_PER_ORDER' ||
    booking.pricing_type === 'SUBSCRIPTION';

  const isFreePromo =
    booking.discount_amount !== undefined &&
    booking.discount_amount !== null &&
    booking.discount_amount > 0 &&
    (booking.final_payable_amount === 0 || booking.final_payable_amount === null);

  const handleStatusChange = async (nextStatus: BookingStatus) => {
    setUpdating(true);
    setMessage(null);
    const res = await workerUpdateOrderStatus(booking.id, nextStatus);
    setUpdating(false);

    if (res?.error) {
      setMessage(res.error);
    } else if (res?.booking) {
      setCurrentStatus(res.booking.status);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E0EBDD] shadow-soft space-y-5 hover:border-[#3E8E4A]/60 transition">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0EBDD]/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center">
            {isIroning ? <Shirt className="w-6 h-6 text-[#3E8E4A]" /> : <Car className="w-6 h-6 text-[#3E8E4A]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-[#0B4F47] bg-[#FAF9F2] px-2.5 py-0.5 rounded-full border border-[#E0EBDD]">
                {booking.booking_reference}
              </span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  currentStatus === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentStatus === 'CANCELLED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-[#EAF5E8] text-[#0B4F47]'
                }`}
              >
                {currentStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <h3 className="text-base font-black text-[#12312C] mt-1">
              {booking.service?.name || (isIroning ? 'Professional Ironing' : 'Car Wash')}
            </h3>
          </div>
        </div>

        {/* Pricing Model & Free Order Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {booking.pricing_type === 'SUBSCRIPTION' ? (
            <span
              className={`text-xs font-black px-3 py-1 rounded-xl flex items-center gap-1.5 ${
                isIroning
                  ? 'bg-purple-50 text-purple-900 border border-purple-200'
                  : 'bg-blue-50 text-blue-900 border border-blue-200'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isIroning ? 'text-purple-600' : 'text-blue-600'}`} />
              <span>{isIroning ? '👕 Ironing Monthly Subscription' : '🚗 Car Wash Monthly Pass'}</span>
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-[#FAF9F2] text-[#0B4F47] border border-[#E0EBDD] flex items-center gap-1.5">
              <BadgePercent className="w-3.5 h-3.5 text-[#3E8E4A]" />
              <span>{isIroning ? '👕 Ironing (Pay Per Order)' : '🚗 Car Wash (Single Booking)'}</span>
            </span>
          )}

          {isFreePromo && (
            <span className="text-xs font-black px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>5th Order FREE Promo</span>
            </span>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Quantity Details */}
        <div className="p-3.5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-1">
          <span className="text-[10px] font-bold text-[#5A7065] uppercase block">
            Garment / Volume Work
          </span>
          <span className="text-sm font-black text-[#12312C] block">
            {isIroning
              ? `${booking.pairs_count || Math.ceil((booking.garments_count || 2) / 2)} Pairs (${booking.garments_count || (booking.pairs_count ? booking.pairs_count * 2 : 2)} Garments)`
              : 'Full Vehicle Detailing'}
          </span>
          <span className="text-[11px] text-[#5A7065]">
            {isIroning ? 'Press & neatly hang/fold' : 'Eco foam wash & dry'}
          </span>
        </div>

        {/* Schedule */}
        <div className="p-3.5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-1">
          <span className="text-[10px] font-bold text-[#5A7065] uppercase block flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#3E8E4A]" /> Service Schedule
          </span>
          <span className="text-sm font-black text-[#12312C] block">
            {formatDate(booking.booking_date)}
          </span>
          <span className="text-[11px] font-semibold text-[#0B4F47] flex items-center gap-1">
            <Clock className="w-3 h-3" /> {booking.time_slot}
          </span>
        </div>

        {/* Customer Address */}
        <div className="p-3.5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-1">
          <span className="text-[10px] font-bold text-[#5A7065] uppercase block flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#3E8E4A]" /> Pickup Address
          </span>
          <span className="text-xs font-black text-[#12312C] block truncate">
            {booking.address?.address_line}
          </span>
          <span className="text-[11px] text-[#5A7065] block">
            {booking.address?.area}, Kompally
          </span>
        </div>

        {/* Payout vs Customer Price */}
        <div className="p-3.5 rounded-2xl bg-[#EAF5E8] border border-[#3E8E4A]/30 space-y-1">
          <span className="text-[10px] font-black text-[#0B4F47] uppercase block">
            Your Worker Payout
          </span>
          <span className="text-lg font-black text-[#0B4F47] block">
            ₹{booking.worker_payout}
          </span>
          <span className="text-[10px] text-[#5A7065]">
            Customer: {isFreePromo ? '₹0 (Free Promo)' : `₹${booking.final_payable_amount ?? booking.total_amount ?? 0}`}
          </span>
        </div>

      </div>

      {/* Customer instructions / special notes */}
      {booking.customer_notes && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <FileText className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Customer Instructions:</strong> {booking.customer_notes}
          </div>
        </div>
      )}

      {/* Customer Contact details */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5A7065] pt-1">
        <div className="flex items-center gap-4">
          <span>Customer: <strong className="text-[#12312C]">{booking.user?.full_name || 'Guest'}</strong></span>
          {booking.user?.phone && (
            <a href={`tel:${booking.user.phone}`} className="flex items-center gap-1 text-[#0B4F47] font-bold hover:underline">
              <Phone className="w-3.5 h-3.5 text-[#3E8E4A]" /> {booking.user.phone}
            </a>
          )}
        </div>

        {/* Worker Action Buttons for Status Workflow */}
        <div className="flex flex-wrap items-center gap-2">
          {updating && <Loader2 className="w-4 h-4 animate-spin text-[#0B4F47]" />}

          {currentStatus === 'PENDING' && (
            <button
              type="button"
              disabled={updating}
              onClick={() => handleStatusChange('CONFIRMED')}
              className="px-3 py-1.5 rounded-xl bg-[#0B4F47] text-white font-bold text-xs hover:bg-[#176B5D] transition"
            >
              Confirm Order
            </button>
          )}

          {['PENDING', 'CONFIRMED'].includes(currentStatus) && (
            <button
              type="button"
              disabled={updating}
              onClick={() => handleStatusChange('PICKED_UP')}
              className="px-3 py-1.5 rounded-xl bg-[#0B4F47] text-white font-bold text-xs hover:bg-[#176B5D] transition"
            >
              Mark Picked Up
            </button>
          )}

          {currentStatus === 'PICKED_UP' && (
            <button
              type="button"
              disabled={updating}
              onClick={() => handleStatusChange('IN_SERVICE')}
              className="px-3 py-1.5 rounded-xl bg-[#0B4F47] text-white font-bold text-xs hover:bg-[#176B5D] transition"
            >
              Start Ironing / Wash
            </button>
          )}

          {currentStatus === 'IN_SERVICE' && (
            <button
              type="button"
              disabled={updating}
              onClick={() => handleStatusChange('OUT_FOR_DELIVERY')}
              className="px-3 py-1.5 rounded-xl bg-[#0B4F47] text-white font-bold text-xs hover:bg-[#176B5D] transition"
            >
              Out for Delivery
            </button>
          )}

          {['IN_SERVICE', 'OUT_FOR_DELIVERY'].includes(currentStatus) && (
            <button
              type="button"
              disabled={updating}
              onClick={() => handleStatusChange('COMPLETED')}
              className="px-4 py-1.5 rounded-xl bg-[#3E8E4A] hover:bg-[#34783f] text-white font-black text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Delivered & Completed</span>
            </button>
          )}

          {currentStatus === 'COMPLETED' && (
            <span className="text-emerald-700 font-extrabold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Delivered & Payout Earned
            </span>
          )}
        </div>
      </div>

      {message && (
        <div className="p-2 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
          {message}
        </div>
      )}

    </div>
  );
}
