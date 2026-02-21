'use client';

import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { ReactNode } from 'react';
import { FadeInSectionClassicTemplate } from './templates/FadeInSectionClassicTemplate';
import { FadeInSectionRetroTechMagazineTemplate } from './templates/FadeInSectionRetroTechMagazineTemplate';

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
  const { template } = useTemplate();

  if (template === 'retroTechMagazine') {
    return <FadeInSectionRetroTechMagazineTemplate {...props} />;
  }

  return <FadeInSectionClassicTemplate {...props} />;
}
