'use client';

import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TicketClassicTemplate } from './templates/TicketClassicTemplate';
import { TicketEditorialTemplate } from './templates/TicketEditorialTemplate';
import { TicketRetroTechMagazineTemplate } from './templates/TicketRetroTechMagazineTemplate';

export interface DisplayTicketTemplateProps {
  trackingCode: string;
  customerName: string;
  serviceType: string;
  waitCount: number;
  qrCodeUrl: string;
  countdown: number;
  onDone: () => void;
}

interface DisplayTicketViewProps {
  trackingCode: string;
  customerName: string;
  serviceType: string;
  waitCount: number;
}

export function DisplayTicketView({
  trackingCode,
  customerName,
  serviceType,
  waitCount,
}: DisplayTicketViewProps) {
  const { template } = useTemplate();
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Generate QR code URL based on current origin
    if (typeof window !== 'undefined') {
      setQrCodeUrl(`${window.location.origin}/track?code=${trackingCode}`);
    }
  }, [trackingCode]);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/display');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  const handleDone = () => {
    router.push('/display');
  };

  const templateProps: DisplayTicketTemplateProps = {
    trackingCode,
    customerName,
    serviceType,
    waitCount,
    qrCodeUrl,
    countdown,
    onDone: handleDone,
  };

  if (template === 'retroTechMagazine') {
    return <TicketRetroTechMagazineTemplate {...templateProps} />;
  }
  if (template === 'editorial') {
    return <TicketEditorialTemplate {...templateProps} />;
  }
  return <TicketClassicTemplate {...templateProps} />;
}
