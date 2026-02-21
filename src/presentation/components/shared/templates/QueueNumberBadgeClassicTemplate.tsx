import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

export interface QueueNumberBadgeClassicTemplateProps {
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

export function QueueNumberBadgeClassicTemplate({
  number,
  size = 'md',
  variant = 'default',
  id,
}: QueueNumberBadgeClassicTemplateProps) {
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
