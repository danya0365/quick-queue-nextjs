'use client';

import { NAV_ITEMS } from '@/src/domain/types/queue';
import { useAppVersion } from '@/src/presentation/hooks/useAppVersion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * MobileBottomNav - Fixed bottom nav for small screens
 * Shows on mobile only (hidden on sm+)
 */
export function MobileBottomNavClassicTemplate() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const { displayVersion } = useAppVersion();

  return (
    <div className="sm:hidden flex-shrink-0 flex flex-col bg-surface/95 backdrop-blur-xl border-t border-border safe-area-bottom z-50">
      {/* Mobile Credit Link & Version */}
      <div className="flex flex-row w-full items-center justify-between gap-1 py-1.5 px-4 text-[10px] text-muted border-b border-border/40">
        <div className="flex items-center gap-1.5 opacity-80">
          <span>© {currentYear}</span>
          <span>•</span>
          <span>{displayVersion}</span>
        </div>
        <a
          href="https://cleancode1986-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          <span>สร้างด้วย ❤️</span>
          <span className="font-semibold">Clean Code 1986</span>
        </a>
      </div>

      {/* Nav Items */}
      <nav
        className="flex items-center justify-around h-14 px-2"
        id="mobile-bottom-nav"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-0.5
                px-3 py-1
                rounded-lg
                text-[10px] font-medium
                transition-colors duration-200
                ${isActive
                  ? 'text-primary'
                  : 'text-muted'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
