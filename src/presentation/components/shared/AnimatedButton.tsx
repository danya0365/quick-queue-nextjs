'use client';

import { useAppTheme } from '@/src/presentation/hooks/useAppTheme';
import { ReactNode } from 'react';
import { AnimatedButtonClassicLayout } from './layouts/AnimatedButtonClassicLayout';
import { AnimatedButtonRetroLayout } from './layouts/AnimatedButtonRetroLayout';

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
  const { theme } = useAppTheme();

  if (theme === 'retro') {
    return <AnimatedButtonRetroLayout {...props} />;
  }

  return <AnimatedButtonClassicLayout {...props} />;
}
