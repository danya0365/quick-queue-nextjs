'use client';

import { QueueStats, SERVICE_TYPE_CONFIG, ServiceType } from '@/src/domain/types/queue';

export type WidgetVariant = 'classic' | 'editorial' | 'retro';

interface ServiceTypeBreakdownProps {
  stats: QueueStats;
  variant?: WidgetVariant;
}

export function ServiceTypeBreakdown({ stats, variant = 'classic' }: ServiceTypeBreakdownProps) {
  const total = stats.generalItems + stats.expressItems + stats.vipItems;
  
  const getPercentage = (count: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const generalPct = getPercentage(stats.generalItems);
  const expressPct = getPercentage(stats.expressItems);
  const vipPct = getPercentage(stats.vipItems);

  // Theme configuration
  const bgColors = {
    general: variant === 'editorial' ? 'bg-black' : variant === 'retro' ? 'bg-black' : 'bg-slate-500',
    express: variant === 'editorial' ? 'bg-black/60' : variant === 'retro' ? 'bg-black/50' : 'bg-orange-500',
    vip: variant === 'editorial' ? 'bg-black/30' : variant === 'retro' ? 'bg-black/20' : 'bg-purple-500',
  };

  const textColors = {
    general: variant === 'editorial' ? 'text-black' : variant === 'retro' ? 'text-black' : 'text-slate-600 dark:text-slate-400',
    express: variant === 'editorial' ? 'text-black/60' : variant === 'retro' ? 'text-black/70' : 'text-orange-600 dark:text-orange-400',
    vip: variant === 'editorial' ? 'text-black/30' : variant === 'retro' ? 'text-black/50' : 'text-purple-600 dark:text-purple-400',
  };

  const containerBorder = variant === 'editorial' ? 'border-2 border-black' : variant === 'retro' ? 'border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white' : '';
  const isSquare = variant !== 'classic';

  return (
    <div className={`flex flex-col h-full justify-between gap-4 ${variant === 'editorial' ? 'font-sans' : ''}`}>
      <div className={`flex items-center justify-between mb-2 ${variant === 'editorial' ? 'border-b-4 border-black pb-2' : ''} ${variant === 'retro' ? 'border-b-4 border-black border-dashed pb-2' : ''}`}>
        <h3 className={`font-bold ${variant === 'editorial' ? 'uppercase tracking-widest text-base font-black' : variant === 'retro' ? 'uppercase tracking-widest' : 'text-lg opacity-80'}`}>สัดส่วนประเภทคิว</h3>
        <span className={`text-xs font-mono font-bold ${variant === 'editorial' ? 'bg-black text-white px-2 py-0.5 tracking-widest' : variant === 'retro' ? 'bg-black text-white px-1' : 'opacity-50'}`}>TOTAL: {total}</span>
      </div>

      {/* Progress Bar */}
      <div className={`w-full h-4 sm:h-6 flex overflow-hidden ${isSquare ? '' : 'rounded-full bg-black/5 dark:bg-white/5'} ${containerBorder}`}>
        {generalPct > 0 && <div style={{ width: `${generalPct}%` }} className={`${bgColors.general} transition-all duration-1000 ${isSquare && generalPct !== 100 ? 'border-r-2 border-black' : ''}`} title={`ทั่วไป ${generalPct}%`} />}
        {expressPct > 0 && <div style={{ width: `${expressPct}%` }} className={`${bgColors.express} transition-all duration-1000 ${isSquare && (generalPct + expressPct) !== 100 ? 'border-r-2 border-black' : ''}`} title={`ด่วน ${expressPct}%`} />}
        {vipPct > 0 && <div style={{ width: `${vipPct}%` }} className={`${bgColors.vip} transition-all duration-1000`} title={`VIP ${vipPct}%`} />}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 mt-auto">
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${textColors.general}`}>
            <span>{SERVICE_TYPE_CONFIG[ServiceType.GENERAL].icon}</span>
            <span className={variant !== 'classic' ? 'uppercase tracking-widest font-black text-[10px]' : ''}>ทั่วไป</span>
          </div>
          <div className={`text-xl sm:text-3xl font-black ${variant === 'editorial' ? 'tabular-nums' : ''}`}>{generalPct}%</div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${textColors.express}`}>
            <span>{SERVICE_TYPE_CONFIG[ServiceType.EXPRESS].icon}</span>
            <span className={variant !== 'classic' ? 'uppercase tracking-widest font-black text-[10px]' : ''}>ด่วน</span>
          </div>
          <div className={`text-xl sm:text-3xl font-black ${variant === 'editorial' ? 'tabular-nums' : ''}`}>{expressPct}%</div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${textColors.vip}`}>
            <span>{SERVICE_TYPE_CONFIG[ServiceType.VIP].icon}</span>
            <span className={variant !== 'classic' ? 'uppercase tracking-widest font-black text-[10px]' : ''}>VIP</span>
          </div>
          <div className={`text-xl sm:text-3xl font-black ${variant === 'editorial' ? 'tabular-nums' : ''}`}>{vipPct}%</div>
        </div>
      </div>
    </div>
  );
}
