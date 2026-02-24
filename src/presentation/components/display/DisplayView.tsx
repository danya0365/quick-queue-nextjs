'use client';

import { AudioInteractionOverlay } from '@/src/presentation/components/shared/AudioInteractionOverlay';
import { useQueueSoundAlert } from '@/src/presentation/hooks/useQueueSoundAlert';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { DisplayViewModel } from '@/src/presentation/presenters/display/DisplayPresenter';
import { useDisplayPresenter } from '@/src/presentation/presenters/display/useDisplayPresenter';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DisplayClassicTemplate } from './templates/DisplayClassicTemplate';
import { DisplayEditorialTemplate } from './templates/DisplayEditorialTemplate';
import { DisplayRetroTechMagazineTemplate } from './templates/DisplayRetroTechMagazineTemplate';

export type { DisplayViewModel };

interface DisplayViewProps {
  initialViewModel?: DisplayViewModel;
}

export function DisplayView({ initialViewModel }: DisplayViewProps) {
  const [state] = useDisplayPresenter(initialViewModel);
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

  if (!viewModel) return null;

  const displayViewModel = viewModel;

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
