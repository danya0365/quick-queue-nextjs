'use client';

import { NAV_ITEMS } from '@/src/domain/types/queue';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * MobileBottomNav - Fixed bottom nav for small screens
 * Shows on mobile only (hidden on sm+)
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        sm:hidden flex-shrink-0
        flex items-center justify-around
        h-14 px-2
        border-t border-border
        bg-surface/95 backdrop-blur-xl
        safe-area-bottom
      "
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
  );
}
