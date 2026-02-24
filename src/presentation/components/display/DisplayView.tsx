'use client';

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';
import { QueueItem } from '@/src/domain/types/queue';
import { AudioInteractionOverlay } from '@/src/presentation/components/shared/AudioInteractionOverlay';
import { useQueueSoundAlert } from '@/src/presentation/hooks/useQueueSoundAlert';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { QueueViewModel } from '@/src/presentation/presenters/queue/QueuePresenter';
import { useQueuePresenter } from '@/src/presentation/presenters/queue/useQueuePresenter';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DisplayClassicTemplate } from './templates/DisplayClassicTemplate';
import { DisplayEditorialTemplate } from './templates/DisplayEditorialTemplate';
import { DisplayRetroTechMagazineTemplate } from './templates/DisplayRetroTechMagazineTemplate';

export interface DisplayViewModel {
  /** Current serving item (latest by updatedAt) */
  currentServingItem: QueueItem | null;
  /** All in_progress items sorted by updatedAt desc */
  servingItems: QueueItem[];
  /** Next waiting item */
  nextUpItem: QueueItem | null;
  /** All waiting items sorted by queueNumber asc */
  waitingItems: QueueItem[];
  /** Recently completed items (latest 5) */
  recentCompleted: QueueItem[];
  /** Current serving number */
  currentServingNumber: number;
  /** Stats */
  stats: {
    total: number;
    waiting: number;
    serving: number;
    completed: number;
  };
  /** Estimated wait */
  estimatedWaitMinutes: number;
  /** Shop name */
  shopName: string;
  /** Operating hours */
  operatingHours: { open: string; close: string };
}

interface DisplayViewProps {
  initialViewModel?: QueueViewModel;
}

export function DisplayView({ initialViewModel }: DisplayViewProps) {
  const [state] = useQueuePresenter(initialViewModel);
  const { template } = useTemplate();
  const viewModel = state.viewModel;

  // Live clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Intl.DateTimeFormat('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date())
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sound alert
  const currentQ = viewModel?.currentServingNumber || 0;
  const { soundEnabled, setSoundEnabled } = useQueueSoundAlert(currentQ);

  // Track Modal
  const [isTrackModalOpen, setTrackModalOpen] = useState(false);

  if (state.loading && !viewModel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-sans space-y-4">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-medium animate-pulse">กำลังโหลดหน้าจอแสดงคิว...</div>
      </div>
    );
  }

  if (!viewModel) return null;

  // Build display-specific view model — data is pre-sorted from repo
  const inProgressItems = viewModel.inProgressItems;
  const waitingItems = viewModel.waitingItems;
  const recentCompleted = viewModel.completedItems.slice(0, 5);

  const displayViewModel: DisplayViewModel = {
    currentServingItem: viewModel.currentServingItem || (inProgressItems.length > 0 ? inProgressItems[0] : null),
    servingItems: inProgressItems,
    nextUpItem: waitingItems.length > 0 ? waitingItems[0] : null,
    waitingItems,
    recentCompleted,
    currentServingNumber: viewModel.currentServingNumber,
    stats: {
      total: viewModel.stats?.totalItems || 0,
      waiting: viewModel.stats?.waitingItems || 0,
      serving: viewModel.stats?.inProgressItems || 0,
      completed: viewModel.stats?.completedItems || 0,
    },

    estimatedWaitMinutes: viewModel.estimatedWaitMinutes,
    shopName: DEFAULT_SHOP_CONFIG.shopName,
    operatingHours: DEFAULT_SHOP_CONFIG.operatingHours,
  };

  const templateProps = {
    displayViewModel,
    currentTime,
    soundEnabled,
    setSoundEnabled,
    onOpenTrackModal: () => setTrackModalOpen(true),
  };

  return (
    <>
      <AudioInteractionOverlay />
      {template === 'retroTechMagazine' && <DisplayRetroTechMagazineTemplate {...templateProps} />}
      {template === 'editorial' && <DisplayEditorialTemplate {...templateProps} />}
      {template === 'classic' && <DisplayClassicTemplate {...templateProps} />}

      {isTrackModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
           <div className="w-full max-w-2xl h-[85vh] bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden relative flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
                 <h2 className="font-bold text-lg text-slate-800">ตรวจสอบสถานะคิว</h2>
                 <button 
                   onClick={() => setTrackModalOpen(false)} 
                   className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-red-500"
                 >
                   <X className="w-6 h-6" />
                 </button>
              </div>
              <iframe src="/track" className="w-full flex-1 border-0" title="Track Queue" />
           </div>
        </div>
      )}
    </>
  );
}
