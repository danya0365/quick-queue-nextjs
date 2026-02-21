import { ReactNode, useState } from 'react';
import { animated, useSpring } from 'react-spring';

export interface GlassCardClassicTemplateProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  glowColor?: string;
  onClick?: () => void;
  id?: string;
}

export function GlassCardClassicTemplate({
  children,
  className = '',
  hoverScale = 1.02,
  glowColor = 'rgba(124, 58, 237, 0.2)',
  onClick,
  id,
}: GlassCardClassicTemplateProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const spring = useSpring({
    transform: isPressed
      ? 'scale(0.98)'
      : isHovered
        ? `scale(${hoverScale})`
        : 'scale(1)',
    boxShadow: isHovered
      ? `0 8px 32px ${glowColor}`
      : '0 2px 8px rgba(0, 0, 0, 0.06)',
    config: { tension: 300, friction: 20 },
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
        rounded-xl
        border
        backdrop-blur-md
        transition-colors duration-200
        bg-[var(--glass-bg)]
        ${isHovered ? 'border-[var(--glass-border)]' : 'border-border'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      id={id}
    >
      {children}
    </animated.div>
  );
}
