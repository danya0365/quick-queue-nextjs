'use client';

import { MainClassicTemplate } from '@/src/presentation/components/layout/templates/MainClassicTemplate';
import { MainEditorialTemplate } from '@/src/presentation/components/layout/templates/MainEditorialTemplate';
import { MainRetroTechMagazineTemplate } from '@/src/presentation/components/layout/templates/MainRetroTechMagazineTemplate';
import { TemplateSwitcher } from '@/src/presentation/components/layout/TemplateSwitcher';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';

interface MainTemplateProps {
  children: React.ReactNode;
}

/**
 * MainTemplate - Full screen layout, no scrolling on the outer container.
 * Content area scrolls internally if needed.
 * Structure: Header (fixed) + Content (flex-1) + Footer/MobileNav (fixed)
 */
export function MainTemplate({ children }: MainTemplateProps) {
  // Theme state for switching layout shells globally (Single Source of Truth)
  const { template } = useTemplate();

  return (
    <>
      {template === 'retroTechMagazine' && (
        <MainRetroTechMagazineTemplate>{children}</MainRetroTechMagazineTemplate>
      )}
      {template === 'editorial' && (
        <MainEditorialTemplate>{children}</MainEditorialTemplate>
      )}
      {template === 'classic' && (
        <MainClassicTemplate>{children}</MainClassicTemplate>
      )}

      {/* Global Application Theme Switcher Toggle */}
      <TemplateSwitcher />
    </>
  );
}

