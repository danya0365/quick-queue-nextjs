import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

export function ColorModeToggleClassicTemplate() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  // Rotation animation for the icon
  const iconSpring = useSpring({
    transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)',
    config: { tension: 200, friction: 20 },
  });

  // Scale bounce on hover
  const hoverSpring = useSpring({
    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
    config: { tension: 300, friction: 15 },
  });

  // Glow effect
  const glowSpring = useSpring({
    boxShadow: isHovered
      ? isDark
        ? '0 0 20px rgba(250, 204, 21, 0.4)'
        : '0 0 20px rgba(124, 58, 237, 0.4)'
      : '0 0 0px rgba(0, 0, 0, 0)',
    config: { tension: 200, friction: 20 },
  });

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-surface-alt border border-border" />
    );
  }

  return (
    <animated.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...hoverSpring,
        ...glowSpring,
      }}
      className="
        relative w-10 h-10 rounded-full
        bg-surface-alt border border-border
        flex items-center justify-center
        cursor-pointer transition-colors duration-200
        hover:border-primary/50
        focus:outline-none focus:ring-2 focus:ring-primary/30
      "
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      id="template-toggle-btn"
    >
      <animated.span
        style={iconSpring}
        className="text-lg leading-none select-none"
      >
        {isDark ? '🌙' : '☀️'}
      </animated.span>
    </animated.button>
  );
}
