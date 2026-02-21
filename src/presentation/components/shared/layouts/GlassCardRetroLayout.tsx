import { ReactNode, useState } from 'react';
import { animated, useSpring } from 'react-spring';

export interface GlassCardRetroLayoutProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  glowColor?: string; // Will be ignored in retro usually
  onClick?: () => void;
  id?: string;
}

export function GlassCardRetroLayout({
  children,
  className = '',
  onClick,
  id,
}: GlassCardRetroLayoutProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Retro card animations - hard translations instead of soft scale
  const spring = useSpring({
    transform: isPressed
      ? 'translate(4px, 4px)'
      : isHovered
        ? 'translate(-2px, -2px)'
        : 'translate(0px, 0px)',
    boxShadow: isPressed
      ? '0px 0px 0 0 rgba(0,0,0,1)'
      : isHovered
        ? '6px 6px 0 0 rgba(0,0,0,1)'
        : '4px 4px 0 0 rgba(0,0,0,1)',
    config: { tension: 400, friction: 30 },
  });

  return (
    <animated.div
      style={spring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => onClick && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      className={`
        border-4 border-black
        bg-white
        transition-colors duration-200
        ${onClick ? 'cursor-pointer hover:bg-gray-100' : ''}
        ${className}
      `}
      id={id}
    >
      {children}
    </animated.div>
  );
}
