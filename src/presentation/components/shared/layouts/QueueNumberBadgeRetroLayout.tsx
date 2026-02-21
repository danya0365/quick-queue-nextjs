import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

export interface QueueNumberBadgeRetroLayoutProps {
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
  default: 'bg-white border-black text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]',
  active: 'bg-[#FF00FF] border-black text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]',
  completed: 'bg-[#39FF14] border-black text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]',
};

export function QueueNumberBadgeRetroLayout({
  number,
  size = 'md',
  variant = 'default',
  id,
}: QueueNumberBadgeRetroLayoutProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Retro has hard jumps
  const spring = useSpring({
    transform: isHovered ? 'translate(-2px, -2px)' : 'translate(0px, 0px)',
    config: { tension: 400, friction: 30 },
  });

  return (
    <animated.div
      style={spring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        ${BADGE_SIZE[size]}
        ${BADGE_VARIANT[variant]}
        border-4
        flex items-center justify-center
        font-black font-mono
        cursor-default select-none
        transition-colors
      `}
      id={id}
    >
      {number}
    </animated.div>
  );
}
