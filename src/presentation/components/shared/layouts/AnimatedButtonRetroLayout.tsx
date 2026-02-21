import { ReactNode, useState } from 'react';
import { animated, useSpring } from 'react-spring';

export interface AnimatedButtonRetroLayoutProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  id?: string;
}

const VARIANT_STYLES = {
  primary: `
    bg-[#00FFFF] text-black border-2 border-black
    shadow-[3px_3px_0_0_rgba(0,0,0,1)]
    hover:bg-white hover:text-black
  `,
  secondary: `
    bg-white text-black border-2 border-black
    shadow-[3px_3px_0_0_rgba(0,0,0,1)]
    hover:bg-black hover:text-white
  `,
  ghost: `
    bg-transparent border-2 border-transparent
    text-black
    hover:border-black hover:bg-white
  `,
  danger: `
    bg-[#FF0000] text-white border-2 border-black
    shadow-[3px_3px_0_0_rgba(0,0,0,1)]
    hover:bg-white hover:text-[#FF0000]
  `,
};

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-xs font-black gap-1 uppercase tracking-widest',
  md: 'px-5 py-2.5 text-sm font-black gap-2 uppercase tracking-widest',
  lg: 'px-7 py-3 text-base font-black gap-2.5 uppercase tracking-widest',
};

export function AnimatedButtonRetroLayout({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon,
  id,
}: AnimatedButtonRetroLayoutProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Retro buttons usually have hard translation (jumping) instead of scaling
  const spring = useSpring({
    transform: isPressed
      ? 'translate(3px, 3px)'
      : isHovered
        ? 'translate(-1px, -1px)'
        : 'translate(0px, 0px)',
    boxShadow: isPressed
      ? '0px 0px 0 0 rgba(0,0,0,1)' // when pressed, shadow touches the element
      : isHovered && variant !== 'ghost'
        ? '4px 4px 0 0 rgba(0,0,0,1)' // larger shadow on hover
        : variant !== 'ghost'
          ? '3px 3px 0 0 rgba(0,0,0,1)' // default shadow
          : 'none',
    config: { tension: 400, friction: 30 },
  });

  return (
    <animated.button
      style={spring}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-black
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${className}
      `}
      id={id}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </animated.button>
  );
}
