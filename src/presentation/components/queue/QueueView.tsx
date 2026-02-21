'use client';

import { QueueSkeleton } from '@/src/presentation/components/queue/QueueSkeleton';
import { QueueClassicTemplate } from '@/src/presentation/components/queue/templates/QueueClassicTemplate';
import { QueueEditorialTemplate } from '@/src/presentation/components/queue/templates/QueueEditorialTemplate';
import { QueueRetroTechMagazineTemplate } from '@/src/presentation/components/queue/templates/QueueRetroTechMagazineTemplate';
import { AudioInteractionOverlay } from '@/src/presentation/components/shared/AudioInteractionOverlay';
import { QRModal } from '@/src/presentation/components/shared/QRModal';
import { useQueueSoundAlert } from '@/src/presentation/hooks/useQueueSoundAlert';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { QueueViewModel } from '@/src/presentation/presenters/queue/QueuePresenter';
import { useQueuePresenter } from '@/src/presentation/presenters/queue/useQueuePresenter';
import { useEffect, useState } from 'react';
import { useSpring } from 'react-spring';

interface QueueViewProps {
  initialViewModel?: QueueViewModel;
}

export function QueueView({ initialViewModel }: QueueViewProps) {
  const [state, actions] = useQueuePresenter(initialViewModel);
  const viewModel = state.viewModel;
  const { template } = useTemplate();

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

  // Countdown to next refresh
  const [refreshCountdown, setRefreshCountdown] = useState(15);
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCountdown((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pulsing animation for "currently serving" badge
  const pulseSpring = useSpring({
    from: { opacity: 0.6, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 120, friction: 14 },
    loop: { reverse: true },
  });

  const currentQ = viewModel?.currentServingNumber || 0;
  const { soundEnabled, setSoundEnabled } = useQueueSoundAlert(currentQ);

  // QR Code Modal
  const [showQR, setShowQR] = useState(false);

  // Get current URL for QR Code
  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    // Only set URL on client to avoid hydration mismatch
    setCurrentUrl(window.location.origin);
  }, []);

  if (state.loading && !viewModel) {
    return <QueueSkeleton />;
  }

  if (state.error && !viewModel) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-500 font-medium mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-muted text-sm mb-4">{state.error}</p>
          <button
            onClick={actions.loadData}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }
  
  // Mobile tab state
  const [mobileTab, setMobileTab] = useState<'in_progress' | 'waiting' | 'completed'>('in_progress');

  if (!viewModel) return null;

  const layoutProps = {
    viewModel,
    currentTime,
    refreshCountdown,
    soundEnabled,
    setSoundEnabled,
    pulseSpring,
    mobileTab,
    setMobileTab,
    showQR,
    setShowQR,
  };

  return (
    <>
      <AudioInteractionOverlay />
      {template === 'retroTechMagazine' && (
        <QueueRetroTechMagazineTemplate {...layoutProps} />
      )}
      {template === 'editorial' && (
        <QueueEditorialTemplate {...layoutProps} />
      )}
      {template === 'classic' && (
        <QueueClassicTemplate {...layoutProps} />
      )}
      <QRModal isOpen={showQR} onClose={() => setShowQR(false)} url={currentUrl} />
    </>
  );
}
