'use client';

import { ReactNode } from 'react';
import { animated, useSpring } from 'react-spring';

interface AnimatedCounterProps {
  value: number;
  label: string;
  icon: ReactNode;
  color?: string;
  id?: string;
}

/**
 * AnimatedCounter - Displays a stat number with spring animation
 * The number smoothly animates to its target value
 */
export function AnimatedCounter({
  value,
  label,
  icon,
  color = 'text-primary',
  id,
}: AnimatedCounterProps) {
  const numberSpring = useSpring({
    from: { val: 0 },
    to: { val: value },
    config: { tension: 80, friction: 20 },
  });

  return (
    <div className="flex items-center gap-2 sm:gap-3" id={id}>
      <div className={`text-lg sm:text-2xl ${color}`}>{icon}</div>
      <div>
        <animated.span className={`text-lg sm:text-2xl font-bold ${color} tabular-nums`}>
          {numberSpring.val.to((v) => Math.floor(v))}
        </animated.span>
        <p className="text-[10px] sm:text-xs text-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}
