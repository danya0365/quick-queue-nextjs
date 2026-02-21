import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

export interface StatusBadgeRetroTechMagazineTemplateProps {
  label: string;
  icon?: string;
  colorClass?: string;
  bgClass?: string;
  pulsing?: boolean;
  id?: string;
}

export function StatusBadgeRetroTechMagazineTemplate({
  label,
  icon,
  colorClass = 'text-[#39FF14]',
  bgClass = 'bg-black',
  pulsing = false,
  id,
}: StatusBadgeRetroTechMagazineTemplateProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spring = useSpring({
    transform: isHovered ? 'translate(-2px, -2px)' : 'translate(0px, 0px)',
    boxShadow: isHovered ? '2px 2px 0 0 rgba(0,0,0,1)' : '0px 0px 0 0 rgba(0,0,0,1)',
    config: { tension: 400, friction: 30 },
  });

  return (
    <animated.span
      style={spring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1 border-2 border-black
        text-xs font-black uppercase tracking-widest
        ${bgClass} ${colorClass}
        transition-colors duration-200
        cursor-default select-none
      `}
      id={id}
    >
      {pulsing && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full opacity-75 bg-[#00FFFF]`}></span>
          <span className={`relative inline-flex h-2 w-2 bg-[#00FFFF]`}></span>
        </span>
      )}
      {icon && <span>{icon}</span>}
      {label}
    </animated.span>
  );
}
