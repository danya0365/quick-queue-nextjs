'use client';

import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

export function FooterClassicTemplate() {
  const [isHovered, setIsHovered] = useState(false);

  const heartSpring = useSpring({
    transform: isHovered ? 'scale(1.3)' : 'scale(1)',
    config: { tension: 300, friction: 10 },
  });

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        h-10 flex-shrink-0
        hidden sm:flex items-center justify-between px-4 sm:px-6
        border-t border-border
        bg-surface/80 backdrop-blur-sm
      "
      id="main-footer"
    >
      <div className="flex items-center gap-2 text-xs text-muted">
        <span>© {currentYear} Quick Queue</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">Powered by Next.js</span>
      </div>

      <a
        href="https://cleancode1986-portfolio.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span>สร้างด้วย</span>
        <animated.span style={heartSpring} className="inline-block">
          ❤️
        </animated.span>
        <span className="font-semibold ml-0.5 hidden sm:inline">โดย Clean Code 1986</span>
        <span className="font-semibold ml-0.5 sm:hidden">Clean Code 1986</span>
      </a>
    </footer>
  );
}
