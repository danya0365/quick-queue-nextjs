'use client';

import { ClearConfirmClassicLayout } from '@/src/presentation/components/admin/layouts/ClearConfirmClassicLayout';
import { ClearConfirmRetroLayout } from '@/src/presentation/components/admin/layouts/ClearConfirmRetroLayout';
import { useAppTheme } from '@/src/presentation/hooks/useAppTheme';
import { animated, useSpring } from 'react-spring';

interface ClearConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ClearConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: ClearConfirmModalProps) {
  const { theme } = useAppTheme();
  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { tension: 300, friction: 25 },
  });

  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1) translateY(0px)' : 'scale(0.95) translateY(20px)',
    config: { tension: 300, friction: 25 },
  });

  if (!isOpen) return null;

  return (
    <animated.div
      style={overlaySpring}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      {theme === 'retro' ? (
        <ClearConfirmRetroLayout onClose={onClose} onConfirm={onConfirm} modalSpring={modalSpring} />
      ) : (
        <ClearConfirmClassicLayout onClose={onClose} onConfirm={onConfirm} modalSpring={modalSpring} />
      )}
    </animated.div>
  );
}
