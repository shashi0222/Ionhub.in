import React from 'react';
import { BookingStatus } from '@/types/database';
import { 
  CheckCircle2, 
  Clock, 
  CalendarCheck, 
  Bike, 
  Sparkles, 
  Truck, 
  CheckCheck,
  AlertCircle 
} from 'lucide-react';

interface BookingStatusTrackerProps {
  status: BookingStatus;
  bookingReference?: string;
}

export function BookingStatusTracker({ status, bookingReference }: BookingStatusTrackerProps) {
  const steps = [
    { key: 'BOOKED', label: 'Booked', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed', icon: CalendarCheck },
    { key: 'PICKUP', label: 'Pickup', icon: Bike },
    { key: 'SERVICE', label: 'Service', icon: Sparkles },
    { key: 'DELIVERY', label: 'Delivery', icon: Truck },
    { key: 'COMPLETED', label: 'Completed', icon: CheckCheck },
  ];

  if (status === 'CANCELLED') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3 text-red-800">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold">Booking Cancelled</h4>
          <p className="text-xs text-red-600 mt-0.5">
            This booking was cancelled. Need to reschedule? You can book a new slot anytime.
          </p>
        </div>
      </div>
    );
  }

  // Map granular backend statuses to visual steps index
  const getActiveIndex = (st: BookingStatus): number => {
    switch (st) {
      case 'PENDING':
        return 0; // Booked
      case 'CONFIRMED':
        return 1; // Confirmed
      case 'PICKUP_SCHEDULED':
      case 'PICKED_UP':
        return 2; // Pickup
      case 'IN_SERVICE':
      case 'READY':
        return 3; // Service
      case 'OUT_FOR_DELIVERY':
        return 4; // Delivery
      case 'COMPLETED':
        return 5; // Completed
      default:
        return 0;
    }
  };

  const activeIndex = getActiveIndex(status);

  return (
    <div className="w-full bg-[#FAF9F2] rounded-3xl p-6 sm:p-8 border border-[#E0EBDD]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#E0EBDD]/70 gap-2">
        <div>
          <span className="text-[11px] font-bold text-[#5A7065] uppercase tracking-wider">
            Live Doorstep Tracking
          </span>
          <h3 className="text-base sm:text-lg font-bold text-[#12312C] flex items-center gap-2">
            Status: <span className="text-[#0B4F47] uppercase">{status.replace(/_/g, ' ')}</span>
          </h3>
        </div>
        {bookingReference && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E0EBDD] text-xs font-mono font-bold text-[#0B4F47]">
            <span>Ref: {bookingReference}</span>
          </div>
        )}
      </div>

      {/* Progress pipeline bar */}
      <div className="relative">
        {/* Connecting line */}
        <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 z-0">
          <div
            className="h-full bg-[#3E8E4A] transition-all duration-700 ease-out"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 sm:gap-2 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#3E8E4A] text-white shadow-sm'
                      : isCurrent
                      ? 'bg-[#0B4F47] text-white ring-4 ring-[#EAF5E8] scale-110 shadow-md animate-pulse'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2.5 font-bold ${
                    isCurrent
                      ? 'text-[#0B4F47]'
                      : isCompleted
                      ? 'text-[#3E8E4A]'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                {isCurrent && (
                  <span className="text-[10px] text-[#3E8E4A] font-semibold mt-0.5 animate-pulse">
                    In Progress
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
