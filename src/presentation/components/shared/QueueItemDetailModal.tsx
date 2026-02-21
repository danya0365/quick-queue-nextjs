'use client';

import { QueueItem } from '@/src/domain/types/queue';
import { QueueItemDetailModalClassicTemplate } from '@/src/presentation/components/shared/templates/QueueItemDetailModalClassicTemplate';
import { QueueItemDetailModalEditorialTemplate } from '@/src/presentation/components/shared/templates/QueueItemDetailModalEditorialTemplate';
import { QueueItemDetailModalRetroTechMagazineTemplate } from '@/src/presentation/components/shared/templates/QueueItemDetailModalRetroTechMagazineTemplate';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useSpring } from 'react-spring';

interface QueueItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: QueueItem | null;
}

export function QueueItemDetailModal({ isOpen, onClose, item }: QueueItemDetailModalProps) {
  const { template } = useTemplate();
  
  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1) translateY(0px)' : 'scale(0.95) translateY(20px)',
    config: { tension: 300, friction: 25 },
  });

  if (!isOpen || !item) return null;

  return (
    <>
      {template === 'retroTechMagazine' && <QueueItemDetailModalRetroTechMagazineTemplate onClose={onClose} item={item} modalSpring={modalSpring} />}
      {template === 'editorial' && <QueueItemDetailModalEditorialTemplate onClose={onClose} item={item} modalSpring={modalSpring} />}
      {template === 'classic' && <QueueItemDetailModalClassicTemplate onClose={onClose} item={item} modalSpring={modalSpring} />}
    </>
  );
}
