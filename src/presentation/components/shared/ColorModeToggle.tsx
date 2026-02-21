'use client';

import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { ColorModeToggleClassicTemplate } from './templates/ColorModeToggleClassicTemplate';
import { ColorModeToggleRetroTechMagazineTemplate } from './templates/ColorModeToggleRetroTechMagazineTemplate';

export function ColorModeToggle() {
  const { template } = useTemplate();

  if (template === 'retroTechMagazine') {
    return <ColorModeToggleRetroTechMagazineTemplate />;
  }

  return <ColorModeToggleClassicTemplate />;
}
