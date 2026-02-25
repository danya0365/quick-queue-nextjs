'use client';

import { CreateQueueItemData, ServiceType } from '@/src/domain/types/queue';
import { CreateQueueClassicTemplate } from '@/src/presentation/components/admin/templates/CreateQueueClassicTemplate';
import { CreateQueueEditorialTemplate } from '@/src/presentation/components/admin/templates/CreateQueueEditorialTemplate';
import { CreateQueueRetroTechMagazineTemplate } from '@/src/presentation/components/admin/templates/CreateQueueRetroTechMagazineTemplate';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
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
  const { template } = useTemplate();
  
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

  const appendNote = (noteChip: string) => {
    setNote((prev) => {
      if (!prev) return noteChip;
      const stripped = prev.trim();
      if (stripped.endsWith(',')) {
        return `${stripped} ${noteChip}`;
      }
      return `${stripped}, ${noteChip}`;
    });
  };

  const clearNote = () => setNote('');
  const clearCustomerName = () => setCustomerName('');

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

  const templateProps = {
    onClose,
    nextQueueNumber,
    customerName,
    setCustomerName,
    clearCustomerName,
    serviceType,
    setServiceType,
    note,
    setNote,
    appendNote,
    clearNote,
    isSubmitting,
    handleSubmit,
    modalSpring,
  };

  return (
    <animated.div
      style={overlaySpring}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay - Removed onClick onClose to force button click */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {template === 'retroTechMagazine' ? (
        <CreateQueueRetroTechMagazineTemplate {...templateProps} />
      ) : template === 'editorial' ? (
        <CreateQueueEditorialTemplate {...templateProps} />
      ) : (
        <CreateQueueClassicTemplate {...templateProps} />
      )}
    </animated.div>
  );
}
