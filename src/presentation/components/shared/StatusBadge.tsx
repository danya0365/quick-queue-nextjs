'use client';

import { useAppTheme } from '@/src/presentation/hooks/useAppTheme';
import { QueueNumberBadgeClassicLayout } from './layouts/QueueNumberBadgeClassicLayout';
import { QueueNumberBadgeRetroLayout } from './layouts/QueueNumberBadgeRetroLayout';
import { StatusBadgeClassicLayout } from './layouts/StatusBadgeClassicLayout';
import { StatusBadgeRetroLayout } from './layouts/StatusBadgeRetroLayout';

interface StatusBadgeProps {
  label: string;
  icon?: string;
  colorClass?: string;
  bgClass?: string;
  pulsing?: boolean;
  id?: string;
}

/**
 * StatusBadge - Animated status badge with hover effect
 */
export function StatusBadge(props: StatusBadgeProps) {
  const { theme } = useAppTheme();

  if (theme === 'retro') {
    return <StatusBadgeRetroLayout {...props} />;
  }

  return <StatusBadgeClassicLayout {...props} />;
}

// ─── QueueNumberBadge ───

interface QueueNumberBadgeProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'active' | 'completed';
  id?: string;
}

export function QueueNumberBadge(props: QueueNumberBadgeProps) {
  const { theme } = useAppTheme();

  if (theme === 'retro') {
    return <QueueNumberBadgeRetroLayout {...props} />;
  }

  return <QueueNumberBadgeClassicLayout {...props} />;
}
