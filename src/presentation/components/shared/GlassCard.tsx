'use client';

import { useAppTheme } from '@/src/presentation/hooks/useAppTheme';
import { ReactNode } from 'react';
import { GlassCardClassicLayout } from './layouts/GlassCardClassicLayout';
import { GlassCardRetroLayout } from './layouts/GlassCardRetroLayout';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  glowColor?: string;
  onClick?: () => void;
  id?: string;
}

export function GlassCard(props: GlassCardProps) {
  const { theme } = useAppTheme();

  if (theme === 'retro') {
    return <GlassCardRetroLayout {...props} />;
  }

  return <GlassCardClassicLayout {...props} />;
}
