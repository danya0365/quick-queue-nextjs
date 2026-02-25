'use client';

import { CreateQueueRequestData, ServiceType } from '@/src/domain/types/queue';
import { RequestQueueClassicTemplate } from '@/src/presentation/components/home/templates/RequestQueueClassicTemplate';
import { RequestQueueEditorialTemplate } from '@/src/presentation/components/home/templates/RequestQueueEditorialTemplate';
import { RequestQueueRetroTechMagazineTemplate } from '@/src/presentation/components/home/templates/RequestQueueRetroTechMagazineTemplate';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useTrackingHistory } from '@/src/presentation/hooks/useTrackingHistory';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface RequestQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MathChallenge {
  question: string;
  token: string;
}

export function RequestQueueModal({ isOpen, onClose }: RequestQueueModalProps) {
  const { template } = useTemplate();
  const addTrackingEntry = useTrackingHistory((s) => s.addEntry);

  const [customerName, setCustomerName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.GENERAL);
  const [note, setNote] = useState('');
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challenge, setChallenge] = useState<MathChallenge | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const fetchChallenge = useCallback(async () => {
    try {
      const res = await fetch('/api/queue-requests/challenge');
      if (res.ok) {
        const data = await res.json();
        setChallenge(data);
      }
    } catch {
      // silent
    }
  }, []);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setCustomerName('');
      setServiceType(ServiceType.GENERAL);
      setNote('');
      setChallengeAnswer('');
      setError(null);
      setSuccessCode(null);
      fetchChallenge();
    }
  }, [isOpen, fetchChallenge]);

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
    if (!challenge) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateQueueRequestData & { challengeToken: string; challengeAnswer: number } = {
        customerName: customerName.trim(),
        serviceType,
        note: note.trim() || undefined,
        challengeToken: challenge.token,
        challengeAnswer: Number(challengeAnswer),
      };

      const res = await fetch('/api/queue-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด');
        // Refresh challenge on failure
        fetchChallenge();
        setChallengeAnswer('');
        return;
      }

      setSuccessCode(data.trackingCode);
      // Save to history
      addTrackingEntry({ code: data.trackingCode, customerName: customerName.trim() });
    } catch {
      setError('เกิดข้อผิดพลาดในการส่งคำขอ');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleClose = () => {
    if (successCode) {
      // Force refresh on close if success (optional, or just onClose if you prefer)
      onClose();
    } else {
      onClose();
    }
  };

  const templateProps = {
    onClose: handleClose,
    customerName,
    setCustomerName,
    clearCustomerName,
    serviceType,
    setServiceType,
    note,
    setNote,
    appendNote,
    clearNote,
    challengeAnswer,
    setChallengeAnswer,
    challenge,
    isSubmitting,
    error,
    successCode,
    handleSubmit,
    modalSpring,
  };

  return (
    <animated.div
      style={overlaySpring}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {template === 'retroTechMagazine' ? (
        <RequestQueueRetroTechMagazineTemplate {...templateProps} />
      ) : template === 'editorial' ? (
        <RequestQueueEditorialTemplate {...templateProps} />
      ) : (
        <RequestQueueClassicTemplate {...templateProps} />
      )}
    </animated.div>
  );
}
