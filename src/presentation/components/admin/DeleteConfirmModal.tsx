'use client';

import { DeleteConfirmClassicTemplate } from '@/src/presentation/components/admin/templates/DeleteConfirmClassicTemplate';
import { DeleteConfirmEditorialTemplate } from '@/src/presentation/components/admin/templates/DeleteConfirmEditorialTemplate';
import { DeleteConfirmRetroTechMagazineTemplate } from '@/src/presentation/components/admin/templates/DeleteConfirmRetroTechMagazineTemplate';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { animated, useSpring } from 'react-spring';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  customerName: string;
  queueNumber: number;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  queueNumber,
}: DeleteConfirmModalProps) {
  const { template } = useTemplate();
  
  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { tension: 300, friction: 25 },
  });

  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
    config: { tension: 300, friction: 25 },
  });

  if (!isOpen) return null;

  return (
    <animated.div
      style={overlaySpring}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {template === 'retroTechMagazine' ? (
        <DeleteConfirmRetroTechMagazineTemplate
          onClose={onClose}
          onConfirm={onConfirm}
          customerName={customerName}
          queueNumber={queueNumber}
          modalSpring={modalSpring}
        />
      ) : template === 'editorial' ? (
        <DeleteConfirmEditorialTemplate
          onClose={onClose}
          onConfirm={onConfirm}
          customerName={customerName}
          queueNumber={queueNumber}
          modalSpring={modalSpring}
        />
      ) : (
        <DeleteConfirmClassicTemplate
          onClose={onClose}
          onConfirm={onConfirm}
          customerName={customerName}
          queueNumber={queueNumber}
          modalSpring={modalSpring}
        />
      )}
    </animated.div>
  );
}
