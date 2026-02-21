'use client';

import { useAppTheme } from '@/src/presentation/hooks/useAppTheme';
import { ReactNode } from 'react';
import { AnimatedCounterClassicLayout } from './layouts/AnimatedCounterClassicLayout';
import { AnimatedCounterRetroLayout } from './layouts/AnimatedCounterRetroLayout';

interface AnimatedCounterProps {
  value: number;
  label: string;
  icon: ReactNode;
  color?: string;
  id?: string;
}

/**
 * AnimatedCounter - Displays a stat number with spring animation
 * The number smoothly animates to its target value
 */
export function AnimatedCounter(props: AnimatedCounterProps) {
  const { theme } = useAppTheme();

  if (theme === 'retro') {
    return <AnimatedCounterRetroLayout {...props} />;
  }

  return <AnimatedCounterClassicLayout {...props} />;
}
