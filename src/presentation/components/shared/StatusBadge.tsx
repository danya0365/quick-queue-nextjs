'use client';

import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { QueueNumberBadgeClassicTemplate } from './templates/QueueNumberBadgeClassicTemplate';
import { QueueNumberBadgeRetroTechMagazineTemplate } from './templates/QueueNumberBadgeRetroTechMagazineTemplate';
import { StatusBadgeClassicTemplate } from './templates/StatusBadgeClassicTemplate';
import { StatusBadgeRetroTechMagazineTemplate } from './templates/StatusBadgeRetroTechMagazineTemplate';

interface StatusBadgeProps {
  label: string;
  icon?: React.ReactNode;
  colorClass?: string;
  bgClass?: string;
  pulsing?: boolean;
  id?: string;
}

/**
 * StatusBadge - Animated status badge with hover effect
 */
export function StatusBadge(props: StatusBadgeProps) {
  const { template } = useTemplate();

  if (template === 'retroTechMagazine') {
    return <StatusBadgeRetroTechMagazineTemplate {...props} />;
  }

  return <StatusBadgeClassicTemplate {...props} />;
}

// ─── QueueNumberBadge ───

interface QueueNumberBadgeProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'active' | 'completed';
  id?: string;
}

export function QueueNumberBadge(props: QueueNumberBadgeProps) {
  const { template } = useTemplate();

  if (template === 'retroTechMagazine') {
    return <QueueNumberBadgeRetroTechMagazineTemplate {...props} />;
  }

  return <QueueNumberBadgeClassicTemplate {...props} />;
}
