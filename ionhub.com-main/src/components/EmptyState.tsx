import React from 'react';
import Link from 'next/link';
import { LucideIcon, Inbox, CalendarPlus } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#E0EBDD] flex flex-col items-center max-w-lg mx-auto shadow-soft">
      <div className="w-16 h-16 rounded-2xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#0B4F47]" />
      </div>
      <h3 className="text-xl font-bold text-[#12312C]">{title}</h3>
      <p className="text-sm text-[#5A7065] mt-2 max-w-sm leading-relaxed">{description}</p>
      
      {(actionText && (actionHref || onAction)) && (
        <div className="mt-6">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-bold transition shadow-sm"
            >
              <CalendarPlus className="w-4 h-4 text-[#3E8E4A]" />
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-bold transition shadow-sm"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
