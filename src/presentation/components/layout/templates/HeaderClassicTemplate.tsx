'use client';

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';
import { NAV_ITEMS } from '@/src/domain/types/queue';
import { ColorModeToggle } from '@/src/presentation/components/shared/ColorModeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

export function HeaderClassicTemplate() {
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const pathname = usePathname();

  // Logo pulse animation on hover
  const logoSpring = useSpring({
    transform: isLogoHovered ? 'scale(1.05)' : 'scale(1)',
    config: { tension: 300, friction: 15 },
  });

  // Glow on hover
  const logoGlowSpring = useSpring({
    textShadow: isLogoHovered
      ? '0 0 20px rgba(124, 58, 237, 0.6)'
      : '0 0 0px rgba(124, 58, 237, 0)',
    config: { tension: 200, friction: 20 },
  });

  return (
    <header
      className="
        h-12 sm:h-14 flex-shrink-0
        flex items-center justify-between px-3 sm:px-6
        border-b border-border
        backdrop-blur-xl
        bg-[var(--header-bg)]
      "
      id="main-header"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 sm:gap-6">
        <Link href="/">
          <animated.div
            style={{ ...logoSpring, ...logoGlowSpring }}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
          >
            <div className="
              w-7 h-7 sm:w-9 sm:h-9 rounded-lg
              bg-gradient-to-br from-primary to-accent
              flex items-center justify-center
              shadow-md
            ">
              <span className="text-white font-bold text-xs sm:text-sm">QQ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-bold text-sm sm:text-lg leading-tight tracking-tight">
                {DEFAULT_SHOP_CONFIG.shopName}
              </span>
              <span className="text-muted text-[10px] leading-none tracking-wide uppercase hidden sm:block">
                ระบบจัดการคิวอัจฉริยะ
              </span>
            </div>
          </animated.div>
        </Link>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-1.5
                  px-3 py-1.5 rounded-lg
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted hover:text-foreground hover:bg-surface-alt'
                  }
                `}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Live Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-alt border border-border">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-muted font-medium">ออนไลน์</span>
        </div>

        <ColorModeToggle />
      </div>
    </header>
  );
}
