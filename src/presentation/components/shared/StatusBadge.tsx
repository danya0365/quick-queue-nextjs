'use client';

import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface StatusBadgeProps {
  label: string;
  icon?: string;
  colorClass?: string;
  bgClass?: string;
  pulsing?: boolean;
  id?: string;
}

/**
 * StatusBadge - Animated status badge with hover effect
 */
export function StatusBadge({
  label,
  icon,
  colorClass = 'text-primary',
  bgClass = 'bg-primary/10',
  pulsing = false,
  id,
}: StatusBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spring = useSpring({
    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
    config: { tension: 300, friction: 15 },
  });

  return (
    <animated.span
      style={spring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1 rounded-full
        text-xs font-medium
        ${bgClass} ${colorClass}
        transition-colors duration-200
        cursor-default select-none
      `}
      id={id}
    >
      {pulsing && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bgClass}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${bgClass.replace('/10', '')}`}></span>
        </span>
      )}
      {icon && <span>{icon}</span>}
      {label}
    </animated.span>
  );
}

// ─── QueueNumberBadge ───

interface QueueNumberBadgeProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'active' | 'completed';
  id?: string;
}

const BADGE_SIZE = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-2xl',
};

const BADGE_VARIANT = {
  default: 'bg-surface-alt border-border text-foreground',
  active: 'bg-gradient-to-br from-primary to-accent border-primary/30 text-white',
  completed: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
};

/**
 * QueueNumberBadge - Circular badge showing queue number
 */
export function QueueNumberBadge({
  number,
  size = 'md',
  variant = 'default',
  id,
}: QueueNumberBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spring = useSpring({
    transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
    config: { tension: 300, friction: 15 },
  });

  return (
    <animated.div
      style={spring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        ${BADGE_SIZE[size]}
        ${BADGE_VARIANT[variant]}
        rounded-full border
        flex items-center justify-center
        font-bold
        cursor-default select-none
      `}
      id={id}
    >
      {number}
    </animated.div>
  );
}
