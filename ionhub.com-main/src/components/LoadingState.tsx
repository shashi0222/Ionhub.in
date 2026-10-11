import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E0EBDD] animate-pulse space-y-4">
      <div className="w-full h-48 bg-slate-200 rounded-2xl" />
      <div className="h-6 bg-slate-200 rounded-md w-3/4" />
      <div className="h-4 bg-slate-200 rounded-md w-1/2" />
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-200 rounded-md w-full" />
        <div className="h-3 bg-slate-200 rounded-md w-5/6" />
      </div>
      <div className="h-10 bg-slate-200 rounded-full w-full pt-2" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0EBDD] overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="h-4 bg-slate-200 rounded w-28" />
          <div className="h-4 bg-slate-200 rounded w-36" />
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-6 bg-slate-200 rounded-full w-20" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-28 bg-[#FAF9F2] rounded-3xl border border-[#E0EBDD]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white rounded-2xl border border-[#E0EBDD]" />
        ))}
      </div>
      <div className="h-64 bg-white rounded-3xl border border-[#E0EBDD]" />
    </div>
  );
}
