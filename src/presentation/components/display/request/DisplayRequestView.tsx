'use client';

import { QUEUE_FORM_PRESETS } from '@/src/config/queue-form.config';
import { CreateQueueRequestData, ServiceType } from '@/src/domain/types/queue';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useTrackingHistory } from '@/src/presentation/hooks/useTrackingHistory';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { DisplayRequestClassicTemplate } from './templates/DisplayRequestClassicTemplate';
import { DisplayRequestEditorialTemplate } from './templates/DisplayRequestEditorialTemplate';
import { DisplayRequestRetroTechMagazineTemplate } from './templates/DisplayRequestRetroTechMagazineTemplate';

interface MathChallenge {
  question: string;
  token: string;
}

export type RequestStep = 'info' | 'verify' | 'preview';

export interface DisplayRequestTemplateProps {
  // Step navigation
  currentStep: RequestStep;
  setCurrentStep: (step: RequestStep) => void;
  // Form data
  customerName: string;
  setCustomerName: (name: string) => void;
  serviceType: ServiceType;
  setServiceType: (type: ServiceType) => void;
  note: string;
  setNote: (note: string | ((prev: string) => string)) => void;
  // Challenge
  challenge: MathChallenge | null;
  challengeAnswer: string;
  setChallengeAnswer: (answer: string) => void;
  // Status
  isSubmitting: boolean;
  error: string | null;
  successCode: string | null;
  // Actions
  handleSubmit: (e: FormEvent) => void;
  canGoNext: boolean;
  // Presets
  presets: typeof QUEUE_FORM_PRESETS;
}

export function DisplayRequestView() {
  const { template } = useTemplate();
  const router = useRouter();
  const addTrackingEntry = useTrackingHistory((s) => s.addEntry);

  // Form state
  const [currentStep, setCurrentStep] = useState<RequestStep>('info');
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

  // Fetch challenge on mount
  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const canGoNext = (() => {
    if (currentStep === 'info') return !!customerName.trim();
    if (currentStep === 'verify') return !!challengeAnswer;
    return true;
  })();

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
        fetchChallenge();
        setChallengeAnswer('');
        setCurrentStep('verify');
        return;
      }

      setSuccessCode(data.trackingCode);
      addTrackingEntry({ code: data.trackingCode, customerName: customerName.trim() });
      
      // Redirect to the Kiosk Ticket Success Screen
      router.push(`/display/ticket/${data.trackingCode}`);
    } catch {
      setError('เกิดข้อผิดพลาดในการส่งคำขอ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const templateProps: DisplayRequestTemplateProps = {
    currentStep,
    setCurrentStep,
    customerName,
    setCustomerName,
    serviceType,
    setServiceType,
    note,
    setNote,
    challenge,
    challengeAnswer,
    setChallengeAnswer,
    isSubmitting,
    error,
    successCode,
    handleSubmit,
    canGoNext,
    presets: QUEUE_FORM_PRESETS,
  };

  if (template === 'retroTechMagazine') {
    return <DisplayRequestRetroTechMagazineTemplate {...templateProps} />;
  }
  if (template === 'editorial') {
    return <DisplayRequestEditorialTemplate {...templateProps} />;
  }
  return <DisplayRequestClassicTemplate {...templateProps} />;
}
