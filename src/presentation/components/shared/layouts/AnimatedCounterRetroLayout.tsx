import { ReactNode } from 'react';
import { animated, useSpring } from 'react-spring';

export interface AnimatedCounterRetroLayoutProps {
  value: number;
  label: string;
  icon: ReactNode;
  color?: string; // We might ignore color for true retro, or let the caller pass retro colors (e.g. text-[#00FFFF])
  id?: string;
}

export function AnimatedCounterRetroLayout({
  value,
  label,
  icon,
  color = 'text-[#39FF14]',
  id,
}: AnimatedCounterRetroLayoutProps) {
  // Retro numbers might jump up much faster or with 0 tension like early computing.
  // Actually, standard spring gives a fun "loading up" effect.
  const numberSpring = useSpring({
    from: { val: 0 },
    to: { val: value },
    config: { tension: 120, friction: 14 },
  });

  return (
    <div className="flex flex-col border-2 border-black bg-black p-2 shadow-[4px_4px_0_0_rgba(255,255,255,1)]" id={id}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`text-xl ${color}`}>{icon}</div>
        <p className={`text-[10px] uppercase font-bold tracking-widest ${color}`}>{label}</p>
      </div>
      <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tighter ${color} tabular-nums text-right`}>
        <animated.span>
          {numberSpring.val.to((v) => Math.floor(v))}
        </animated.span>
      </div>
    </div>
  );
}
