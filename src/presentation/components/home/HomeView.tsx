'use client';

import { HomeSkeleton } from '@/src/presentation/components/home/HomeSkeleton';
import { HomeClassicTemplate } from '@/src/presentation/components/home/templates/HomeClassicTemplate';
import { HomeRetroTechMagazineTemplate } from '@/src/presentation/components/home/templates/HomeRetroTechMagazineTemplate';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useQueueSoundAlert } from '@/src/presentation/hooks/useQueueSoundAlert';
import { HomeViewModel } from '@/src/presentation/presenters/home/HomePresenter';
import { useHomePresenter } from '@/src/presentation/presenters/home/useHomePresenter';
import { useEffect, useState } from 'react';
import { useSpring } from 'react-spring';

interface HomeViewProps {
  initialViewModel?: HomeViewModel;
}

export function HomeView({ initialViewModel }: HomeViewProps) {
  const [state] = useHomePresenter(initialViewModel);
  const viewModel = state.viewModel;

  // Theme switcher state from Zustand
  const { template } = useTemplate();

  // Animated gradient rotation
  const [gradientAngle, setGradientAngle] = useState(135);
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientAngle((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Current time display
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

  // QR Code Modal
  const [showQR, setShowQR] = useState(false);
  const qrSpring = useSpring({
    opacity: showQR ? 1 : 0,
    transform: showQR ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 300, friction: 25 },
  });

  // Get current URL for QR Code
  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    // Only set URL on client to avoid hydration mismatch
    setCurrentUrl(window.location.origin);
  }, []);

  // Sound Alert Hook
  const currentQ = viewModel?.currentQueueNumber || 0;
  const { soundEnabled, setSoundEnabled } = useQueueSoundAlert(currentQ);

  // Big queue number spring
  const bigNumberSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.5)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 100, friction: 12 },
    delay: 200,
  });

  if (state.loading && !viewModel) {
    return <HomeSkeleton />;
  }

  if (state.error && !viewModel) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-500 font-medium mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-muted text-sm">{state.error}</p>
        </div>
      </div>
    );
  }

  if (!viewModel) return null;

  const props = {
    viewModel,
    gradientAngle,
    currentTime,
    soundEnabled,
    setSoundEnabled,
    showQR,
    setShowQR,
    qrSpring,
    currentUrl,
    bigNumberSpring,
  };

  return (
    <>
      {template === 'retroTechMagazine' ? (
        <HomeRetroTechMagazineTemplate {...props} />
      ) : (
        <HomeClassicTemplate {...props} />
      )}
    </>
  );
}
