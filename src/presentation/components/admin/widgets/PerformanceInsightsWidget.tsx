'use client';

import { PerformanceInsights } from '@/src/domain/types/queue';
import { WidgetVariant } from './ServiceTypeBreakdown';

interface PerformanceInsightsWidgetProps {
  performance?: PerformanceInsights;
  variant?: WidgetVariant;
}

export function PerformanceInsightsWidget({ performance, variant = 'classic' }: PerformanceInsightsWidgetProps) {
  const avgWait = performance?.averageWaitTimeMinutes || 0;
  const avgService = performance?.averageServiceTimeMinutes || 0;

  const getBoxStyles = (isWait: boolean) => {
    if (variant === 'editorial') {
      return "flex border-4 border-black flex-col items-center justify-center p-2 sm:p-4 bg-white hover:bg-black hover:text-white transition-colors group";
    }
    if (variant === 'retro') {
      const color = isWait ? '#FFF000' : '#00FFFF';
      return `flex flex-col items-center justify-center border-[3px] border-black p-2 sm:p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-black hover:-translate-y-1 transition-transform`;
    }
    // Classic
    const colorClass = isWait ? 'bg-orange-500/10 border-orange-500/20' : 'bg-blue-500/10 border-blue-500/20';
    return `flex flex-col items-center justify-center rounded-xl border p-2 sm:p-4 ${colorClass}`;
  };

  const getNumberStyles = (isWait: boolean) => {
    if (variant === 'editorial') return "text-4xl sm:text-5xl font-black mb-1 tabular-nums tracking-tighter group-hover:text-white";
    if (variant === 'retro') return "text-4xl sm:text-5xl font-black mb-1 tabular-nums leading-none tracking-tighter";
    // Classic
    const colorClass = isWait ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400';
    return `text-4xl sm:text-5xl font-black mb-1 ${colorClass}`;
  };

  const getLabelStyles = () => {
    if (variant === 'editorial') return "text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100";
    if (variant === 'retro') return "text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black text-white px-2 leading-none py-1 mt-1";
    // Classic
    return "text-xs sm:text-sm font-semibold opacity-70 text-center uppercase tracking-wider";
  };

  return (
    <div className={`flex flex-col h-full justify-between gap-4 ${variant === 'editorial' ? 'font-sans' : ''}`}>
      <div className={`${variant === 'editorial' ? 'border-b-4 border-black pb-2 mb-2' : variant === 'retro' ? 'border-b-4 border-black border-dashed pb-2 mb-2' : ''}`}>
        <h3 className={`font-bold ${variant === 'editorial' ? 'uppercase tracking-widest text-base font-black' : variant === 'retro' ? 'uppercase tracking-widest' : 'text-lg opacity-80 mb-1'}`}>
          สถิติเวลาเฉลี่ย (นาที)
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Wait Time */}
        <div className={getBoxStyles(true)} style={variant === 'retro' ? { backgroundColor: '#FFF000' } : {}}>
          <div className={getNumberStyles(true)}>{avgWait}</div>
          <div className={getLabelStyles()}>รอคิวเฉลี่ย</div>
        </div>

        {/* Service Time */}
        <div className={getBoxStyles(false)} style={variant === 'retro' ? { backgroundColor: '#00FFFF' } : {}}>
          <div className={getNumberStyles(false)}>{avgService}</div>
          <div className={getLabelStyles()}>ให้บริการเฉลี่ย</div>
        </div>
      </div>
    </div>
  );
}
