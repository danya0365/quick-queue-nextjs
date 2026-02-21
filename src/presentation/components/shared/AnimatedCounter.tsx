'use client';

import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { ReactNode } from 'react';
import { AnimatedCounterClassicTemplate } from './templates/AnimatedCounterClassicTemplate';
import { AnimatedCounterRetroTechMagazineTemplate } from './templates/AnimatedCounterRetroTechMagazineTemplate';

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
  const { template } = useTemplate();

  if (template === 'retroTechMagazine') {
    return <AnimatedCounterRetroTechMagazineTemplate {...props} />;
  }

  return <AnimatedCounterClassicTemplate {...props} />;
}
