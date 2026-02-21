'use client';

import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { ReactNode } from 'react';
import { GlassCardClassicTemplate } from './templates/GlassCardClassicTemplate';
import { GlassCardRetroTechMagazineTemplate } from './templates/GlassCardRetroTechMagazineTemplate';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  glowColor?: string;
  onClick?: () => void;
  id?: string;
}

export function GlassCard(props: GlassCardProps) {
  const { template } = useTemplate();

  if (template === 'retroTechMagazine') {
    return <GlassCardRetroTechMagazineTemplate {...props} />;
  }

  return <GlassCardClassicTemplate {...props} />;
}
