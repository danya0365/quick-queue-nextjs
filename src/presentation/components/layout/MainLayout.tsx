'use client';

import { MainClassicLayout } from '@/src/presentation/components/layout/layouts/MainClassicLayout';
import { MainRetroLayout } from '@/src/presentation/components/layout/layouts/MainRetroLayout';
import { useAppTheme } from '@/src/presentation/hooks/useAppTheme';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout - Full screen layout, no scrolling on the outer container.
 * Content area scrolls internally if needed.
 * Structure: Header (fixed) + Content (flex-1) + Footer/MobileNav (fixed)
 */
export function MainLayout({ children }: MainLayoutProps) {
  // Theme state for switching layout shells globally (Single Source of Truth)
  const { theme, toggleTheme } = useAppTheme();

  return (
    <>
      {theme === 'retro' ? (
        <MainRetroLayout>{children}</MainRetroLayout>
      ) : (
        <MainClassicLayout>{children}</MainClassicLayout>
      )}

      {/* Global Application Theme Switcher Toggle */}
      <div className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 z-[100]">
        <button
          onClick={toggleTheme}
          className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-xl transition-all border border-white/20 active:scale-95"
        >
          App Shell: {theme}
        </button>
      </div>
    </>
  );
}

