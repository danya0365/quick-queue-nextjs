'use client';

import { useAppTheme } from '@/src/presentation/hooks/useAppTheme';
import { ThemeToggleClassicLayout } from './layouts/ThemeToggleClassicLayout';
import { ThemeToggleRetroLayout } from './layouts/ThemeToggleRetroLayout';

export function ThemeToggle() {
  const { theme } = useAppTheme();

  if (theme === 'retro') {
    return <ThemeToggleRetroLayout />;
  }

  return <ThemeToggleClassicLayout />;
}
