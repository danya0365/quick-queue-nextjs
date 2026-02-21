'use client';

import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { ReactNode } from 'react';
import { AnimatedButtonClassicTemplate } from './templates/AnimatedButtonClassicTemplate';
import { AnimatedButtonRetroTechMagazineTemplate } from './templates/AnimatedButtonRetroTechMagazineTemplate';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  id?: string;
}

export function AnimatedButton(props: AnimatedButtonProps) {
  const { template } = useTemplate();

  if (template === 'retroTechMagazine') {
    return <AnimatedButtonRetroTechMagazineTemplate {...props} />;
  }

  return <AnimatedButtonClassicTemplate {...props} />;
}
