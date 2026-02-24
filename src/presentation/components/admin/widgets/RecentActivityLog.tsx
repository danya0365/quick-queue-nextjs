'use client';

import { formatQueueNumber } from '@/src/config/queue-display.config';
import { QUEUE_STATUS_CONFIG, QueueItem } from '@/src/domain/types/queue';
import { WidgetVariant } from './ServiceTypeBreakdown';

interface RecentActivityLogProps {
  recentActivity?: QueueItem[];
  variant?: WidgetVariant;
}

export function RecentActivityLog({ recentActivity = [], variant = 'classic' }: RecentActivityLogProps) {
  if (recentActivity.length === 0) {
    return (
      <div className="flex flex-col h-full justify-center items-center opacity-50 text-sm font-bold">
        ไม่มีความเคลื่อนไหวล่าสุด
      </div>
    );
  }

  // Helper to format "X mins ago"
  const getTimeAgo = (dateStr: string) => {
    const minDiff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    if (minDiff < 1) return 'เพิ่งแก้ไข';
    if (minDiff < 60) return `${minDiff} นาทีที่แล้ว`;
    return `${Math.floor(minDiff / 60)} ชั่วโมงที่แล้ว`;
  };

  return (
    <div className={`flex flex-col h-full gap-3 ${variant === 'editorial' ? 'font-sans' : ''}`}>
      <div className={`${variant === 'editorial' ? 'border-b-4 border-black pb-2 mb-2' : variant === 'retro' ? 'border-b-4 border-black border-dashed pb-2 mb-2' : ''}`}>
        <h3 className={`font-bold ${variant === 'editorial' ? 'uppercase tracking-widest text-base font-black' : variant === 'retro' ? 'uppercase tracking-widest' : 'text-lg opacity-80 mb-1'}`}>
          ความเคลื่อนไหวล่าสุด
        </h3>
      </div>
      
      <div className="flex flex-col gap-2 overflow-y-auto pr-2" style={{ maxHeight: '180px' }}>
        {recentActivity.map((item) => {
          const statusConfig = QUEUE_STATUS_CONFIG[item.status];
          
          let itemClass = "flex flex-row items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/5";
          if (variant === 'editorial') {
            itemClass = "flex flex-row items-center gap-3 py-2 border-b-2 border-dashed border-black/20 hover:border-black transition-colors group";
          } else if (variant === 'retro') {
            itemClass = "flex flex-row items-center gap-3 p-2 bg-white text-black border-[3px] border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform";
          }
          
          return (
            <div key={item.id} className={itemClass}>
              <div className="text-xl sm:text-2xl flex-shrink-0">{statusConfig.icon}</div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className={`text-sm sm:text-base font-bold truncate ${variant === 'editorial' ? 'font-black' : ''}`}>
                  คิว {formatQueueNumber(item.queueNumber)} - {item.customerName}
                </div>
                <div className={`text-xs ${variant === 'editorial' ? 'uppercase tracking-widest font-bold opacity-60 group-hover:opacity-100' : 'opacity-60 font-bold'}`}>
                  สถานะ: {statusConfig.label}
                </div>
              </div>
              <div className={`text-[10px] sm:text-xs font-mono whitespace-nowrap text-right ${variant === 'editorial' ? 'font-black bg-black text-white px-1' : variant === 'retro' ? 'font-black bg-[#FF00FF] px-1 text-white border-2 border-black' : 'opacity-50'}`}>
                {getTimeAgo(item.updatedAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
