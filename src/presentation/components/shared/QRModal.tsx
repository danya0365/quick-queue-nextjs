'use client';

import { QRModalClassicTemplate } from '@/src/presentation/components/shared/templates/QRModalClassicTemplate';
import { QRModalEditorialTemplate } from '@/src/presentation/components/shared/templates/QRModalEditorialTemplate';
import { QRModalRetroTechMagazineTemplate } from '@/src/presentation/components/shared/templates/QRModalRetroTechMagazineTemplate';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useSpring } from 'react-spring';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function QRModal({ isOpen, onClose, url }: QRModalProps) {
  const { template } = useTemplate();
  
  const qrSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 300, friction: 25 },
  });

  // We still render the component structurally to allow the exit animation to finish
  // (unless the individual templates handle unmounting differently. For simplicity
  // and given the existing codebase's approach, we do conditional rendering here).
  if (!isOpen) return null;

  return (
    <>
      {template === 'retroTechMagazine' && <QRModalRetroTechMagazineTemplate onClose={onClose} url={url} qrSpring={qrSpring} />}
      {template === 'editorial' && <QRModalEditorialTemplate onClose={onClose} url={url} qrSpring={qrSpring} />}
      {template === 'classic' && <QRModalClassicTemplate onClose={onClose} url={url} qrSpring={qrSpring} />}
    </>
  );
}
