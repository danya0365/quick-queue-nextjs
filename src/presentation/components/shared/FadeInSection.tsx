'use client';

import { useAppTheme } from '@/src/presentation/hooks/useAppTheme';
import { ReactNode } from 'react';
import { FadeInSectionClassicLayout } from './layouts/FadeInSectionClassicLayout';
import { FadeInSectionRetroLayout } from './layouts/FadeInSectionRetroLayout';

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

/**
 * FadeInSection - Wraps children with a fade + translate entrance animation
 * Triggers once when the component mounts
 */
export function FadeInSection(props: FadeInSectionProps) {
  const { theme } = useAppTheme();

  if (theme === 'retro') {
    return <FadeInSectionRetroLayout {...props} />;
  }

  return <FadeInSectionClassicLayout {...props} />;
}
