'use client';

import { ClipboardList, Settings } from 'lucide-react';
import Link from 'next/link';
import { WidgetVariant } from './ServiceTypeBreakdown';

export function QuickActionsWidget({ variant = 'classic' }: { variant?: WidgetVariant }) {
  const getActionStyles = (isPrimary: boolean) => {
    if (variant === 'editorial') {
      return isPrimary 
        ? "flex flex-col items-center justify-center gap-2 p-4 font-sans font-black uppercase tracking-widest text-sm border-4 border-black bg-black text-white hover:bg-white hover:text-black transition-colors"
        : "flex flex-col items-center justify-center gap-2 p-4 font-sans font-black uppercase tracking-widest text-sm border-4 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer";
    }
    if (variant === 'retro') {
      return isPrimary
        ? "flex flex-col items-center justify-center gap-2 p-3 sm:p-4 border-[3px] border-black bg-[#FF00FF] text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all font-bold uppercase tracking-widest text-sm"
        : "flex flex-col items-center justify-center gap-2 p-3 sm:p-4 border-[3px] border-black bg-[#39FF14] text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all font-bold uppercase tracking-widest text-sm cursor-pointer";
    }
    // Classic
    return isPrimary
      ? "flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20 text-primary dark:text-primary-foreground text-center"
      : "flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors border border-black/10 dark:border-white/10 text-center cursor-pointer";
  };

  return (
    <div className={`flex flex-col h-full gap-3 ${variant === 'editorial' ? 'font-sans' : ''}`}>
      <div className={`${variant === 'editorial' ? 'border-b-4 border-black pb-2 mb-2' : variant === 'retro' ? 'border-b-4 border-black border-dashed pb-2 mb-2' : ''}`}>
        <h3 className={`font-bold ${variant === 'editorial' ? 'uppercase tracking-widest text-base font-black' : variant === 'retro' ? 'uppercase tracking-widest' : 'text-lg opacity-80 mb-1'}`}>
          เมนูลัด
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-auto h-full">
        {/* Manage Queues Shortcut */}
        <Link 
          href="/admin/queues"
          className={getActionStyles(true)}
        >
          <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10" />
          <span className={variant === 'editorial' ? 'mt-2' : ''}>จัดการคิว</span>
        </Link>
        
        {/* Settings Stub */}
        <button 
          onClick={() => alert('ฟังก์ชันการตั้งค่าร้านค้าจะเปิดให้ใช้งานเร็วๆ นี้')}
          className={getActionStyles(false)}
        >
          <Settings className="w-8 h-8 sm:w-10 sm:h-10" />
          <span className={variant === 'editorial' ? 'mt-2' : ''}>ตั้งค่าร้าน</span>
        </button>
      </div>
    </div>
  );
}
