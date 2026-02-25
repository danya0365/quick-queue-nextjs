'use client';

import { QUEUE_FORM_PRESETS } from '@/src/config/queue-form.config';
import { CreateQueueItemData, ServiceType } from '@/src/domain/types/queue';
import { useAdminLayoutPresenter } from '@/src/presentation/presenters/admin/useAdminLayoutPresenter';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useState } from 'react';
import { AdminKioskNewQueueClassicTemplate } from './templates/AdminKioskNewQueueClassicTemplate';
import { AdminKioskNewQueueEditorialTemplate } from './templates/AdminKioskNewQueueEditorialTemplate';
import { AdminKioskNewQueueRetroTechMagazineTemplate } from './templates/AdminKioskNewQueueRetroTechMagazineTemplate';

export interface AdminKioskNewQueueTemplateProps {
  // Form data
  customerName: string;
  setCustomerName: (name: string) => void;
  serviceType: ServiceType;
  setServiceType: (type: ServiceType) => void;
  note: string;
  setNote: (note: string) => void;
  // Presets
  presets: typeof QUEUE_FORM_PRESETS;
  clearCustomerName: () => void;
  // Note chips — append to existing text
  appendNote: (note: string) => void;
  clearNote: () => void;
  // Status
  isSubmitting: boolean;
  error: string | null;
  // Actions
  handleSubmit: (e: FormEvent) => void;
  canSubmit: boolean;
}

export function AdminKioskNewQueueView() {
  const [layoutState] = useAdminLayoutPresenter();
  const router = useRouter();

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.GENERAL);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = customerName.trim().length > 0;

  const appendNote = useCallback((noteChip: string) => {
    setNote(prev => {
      if (!prev) return noteChip;
      const stripped = prev.trim();
      if (stripped.endsWith(',')) {
        return `${stripped} ${noteChip}`;
      }
      return `${stripped}, ${noteChip}`;
    });
  }, []);

  const clearCustomerName = useCallback(() => {
    setCustomerName('');
  }, []);

  const clearNote = useCallback(() => {
    setNote('');
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const data: CreateQueueItemData = {
        customerName: customerName.trim(),
        serviceType,
        note: note.trim() || undefined,
      };

      const res = await fetch('/api/queue-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'เกิดข้อผิดพลาดในการสร้างคิว');
      }

      // Success — redirect back to kiosk
      router.push('/admin/kiosk');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, customerName, serviceType, note, router]);

  const templateProps: AdminKioskNewQueueTemplateProps = {
    customerName,
    setCustomerName,
    serviceType,
    setServiceType,
    note,
    setNote,
    presets: QUEUE_FORM_PRESETS,
    clearCustomerName,
    appendNote,
    clearNote,
    isSubmitting,
    error,
    handleSubmit,
    canSubmit,
  };

  switch (layoutState.template) {
    case 'retroTechMagazine':
      return <AdminKioskNewQueueRetroTechMagazineTemplate {...templateProps} />;
    case 'editorial':
      return <AdminKioskNewQueueEditorialTemplate {...templateProps} />;
    case 'classic':
    default:
      return <AdminKioskNewQueueClassicTemplate {...templateProps} />;
  }
}
