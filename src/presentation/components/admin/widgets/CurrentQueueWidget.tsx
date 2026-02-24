'use client';

import { formatQueueNumber } from '@/src/config/queue-display.config';
import { WidgetVariant } from './ServiceTypeBreakdown';

interface CurrentQueueWidgetProps {
  currentQueueNumber: number;
  variant?: WidgetVariant;
}

export function CurrentQueueWidget({ currentQueueNumber, variant = 'classic' }: CurrentQueueWidgetProps) {
  const displayValue = currentQueueNumber > 0 ? formatQueueNumber(currentQueueNumber) : '-';

  const getContainerStyles = () => {
    if (variant === 'editorial') {
      return "flex border-[4px] border-black flex-col items-center justify-center p-4 sm:p-8 bg-white hover:bg-black hover:text-white transition-colors group h-full";
    }
    if (variant === 'retro') {
      return `flex flex-col items-center justify-center border-[3px] border-black p-4 sm:p-8 shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-black hover:-translate-y-1 transition-transform h-full w-full bg-[#00FFFF]`; 
    }
    // Classic
    return `flex flex-col items-center justify-center rounded-2xl border p-4 sm:p-8 bg-emerald-500/10 border-emerald-500/20 h-full w-full transition-transform hover:-translate-y-1`;
  };

  const getNumberStyles = () => {
    if (variant === 'editorial') return "text-5xl sm:text-7xl font-black mb-2 tabular-nums tracking-tighter group-hover:text-white";
    if (variant === 'retro') return "text-5xl sm:text-7xl font-black mb-2 tabular-nums leading-none tracking-tighter";
    // Classic
    return `text-5xl sm:text-7xl font-black mb-2 text-emerald-600 dark:text-emerald-400`;
  };

  const getLabelStyles = () => {
    if (variant === 'editorial') return "text-xs sm:text-sm font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 mt-2 text-center";
    if (variant === 'retro') return "text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black text-white px-2 leading-none py-1 mt-2 text-center";
    // Classic
    return "text-xs sm:text-sm font-semibold opacity-70 text-center uppercase tracking-wider mt-2";
  };

  return (
    <div className={`flex flex-col h-full ${variant === 'editorial' ? 'font-sans' : ''}`}>
      <div className={`${variant === 'editorial' ? 'border-b-4 border-black pb-2 mb-4' : variant === 'retro' ? 'border-b-4 border-black border-dashed pb-2 mb-4' : 'mb-4'}`}>
        <h3 className={`font-bold ${variant === 'editorial' ? 'uppercase tracking-widest text-base font-black' : variant === 'retro' ? 'uppercase tracking-widest text-sm' : 'text-lg opacity-80'}`}>
          ตอนนี้ ถึงหมายเลขคิวไหน
        </h3>
      </div>
      
      <div className={getContainerStyles()}>
        <div className={getNumberStyles()}>{displayValue}</div>
        <div className={getLabelStyles()}>{currentQueueNumber > 0 ? "กำลังให้บริการ" : "ไม่มีคิวในขณะนี้"}</div>
      </div>
    </div>
  );
}
