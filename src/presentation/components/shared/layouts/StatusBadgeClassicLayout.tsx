import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

export interface StatusBadgeClassicLayoutProps {
  label: string;
  icon?: string;
  colorClass?: string;
  bgClass?: string;
  pulsing?: boolean;
  id?: string;
}

export function StatusBadgeClassicLayout({
  label,
  icon,
  colorClass = 'text-primary',
  bgClass = 'bg-primary/10',
  pulsing = false,
  id,
}: StatusBadgeClassicLayoutProps) {
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
