'use client';

import { CreateQueueItemData, ServiceType } from '@/src/domain/types/queue';
import { CreateQueueClassicLayout } from '@/src/presentation/components/admin/layouts/CreateQueueClassicLayout';
import { CreateQueueRetroLayout } from '@/src/presentation/components/admin/layouts/CreateQueueRetroLayout';
import { useAppTheme } from '@/src/presentation/hooks/useAppTheme';
import { FormEvent, useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface CreateQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQueueItemData) => Promise<void>;
  nextQueueNumber: number;
}

export function CreateQueueModal({
  isOpen,
  onClose,
  onSubmit,
  nextQueueNumber,
}: CreateQueueModalProps) {
  const { theme } = useAppTheme();
  
  const [customerName, setCustomerName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.GENERAL);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setCustomerName('');
      setServiceType(ServiceType.GENERAL);
      setNote('');
    }
  }, [isOpen]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        customerName: customerName.trim() || `ลูกค้าคิว #${nextQueueNumber}`,
        serviceType,
        note: note.trim() || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <animated.div
      style={overlaySpring}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay - Removed onClick onClose to force button click */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {theme === 'retro' ? (
        <CreateQueueRetroLayout
          onClose={onClose}
          nextQueueNumber={nextQueueNumber}
          customerName={customerName}
          setCustomerName={setCustomerName}
          serviceType={serviceType}
          setServiceType={setServiceType}
          note={note}
          setNote={setNote}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          modalSpring={modalSpring}
        />
      ) : (
        <CreateQueueClassicLayout
          onClose={onClose}
          nextQueueNumber={nextQueueNumber}
          customerName={customerName}
          setCustomerName={setCustomerName}
          serviceType={serviceType}
          setServiceType={setServiceType}
          note={note}
          setNote={setNote}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          modalSpring={modalSpring}
        />
      )}
    </animated.div>
  );
}
