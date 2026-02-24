'use client';

import { QueueRequest } from '@/src/domain/types/queue';
import { TrackClassicTemplate } from '@/src/presentation/components/track/templates/TrackClassicTemplate';
import { TrackEditorialTemplate } from '@/src/presentation/components/track/templates/TrackEditorialTemplate';
import { TrackRetroTechMagazineTemplate } from '@/src/presentation/components/track/templates/TrackRetroTechMagazineTemplate';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useTrackingHistory } from '@/src/presentation/hooks/useTrackingHistory';
import { FormEvent, useEffect, useState } from 'react';
import { useSpring } from 'react-spring';

export function TrackView() {
  const { template } = useTemplate();
  const { entries, removeEntry, clearAll } = useTrackingHistory();
  const [trackingCode, setTrackingCode] = useState('');
  const [result, setResult] = useState<(QueueRequest & { queueNumber?: number }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for Zustand persisted state
  useEffect(() => { 
    setMounted(true); 
    
    // Auto-search if code is provided in URL (e.g. from QR code scan)
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam && codeParam.length === 6) {
      searchByCode(codeParam);
    }
  }, []);

  const resultSpring = useSpring({
    opacity: result ? 1 : 0,
    transform: result ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 200, friction: 20 },
  });

  const searchByCode = async (code: string) => {
    const c = code.trim().toUpperCase();
    if (!c || c.length !== 6) {
      setError('กรุณากรอกรหัสติดตาม 6 หลัก');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSearched(true);
    setTrackingCode(c);

    try {
      const res = await fetch(`/api/queue-requests/track/${c}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'ไม่พบคำขอนี้');
        return;
      }

      setResult(data);
    } catch {
      setError('เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await searchByCode(trackingCode);
  };

  const templateProps = {
    trackingCode,
    setTrackingCode,
    result,
    loading,
    error,
    searched,
    entries,
    removeEntry,
    clearAll,
    mounted,
    searchByCode,
    handleSubmit,
    resultSpring,
  };

  if (template === 'editorial') {
    return <TrackEditorialTemplate {...templateProps} />;
  }

  if (template === 'retroTechMagazine') {
    return <TrackRetroTechMagazineTemplate {...templateProps} />;
  }

  return <TrackClassicTemplate {...templateProps} />;
}
