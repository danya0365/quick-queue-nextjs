import { ReactNode, useState } from 'react';
import { animated, config, useSpring } from 'react-spring';

export interface AnimatedButtonClassicLayoutProps {
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
    bg-gradient-to-r from-primary to-accent
    text-white font-semibold
    shadow-md hover:shadow-lg
  `,
  secondary: `
    bg-surface border border-border
    text-foreground font-medium
    hover:bg-surface-alt
  `,
  ghost: `
    bg-transparent
    text-muted font-medium
    hover:bg-surface-alt hover:text-foreground
  `,
  danger: `
    bg-gradient-to-r from-red-500 to-rose-600
    text-white font-semibold
    shadow-md hover:shadow-lg
  `,
};

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
};

export function AnimatedButtonClassicLayout({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon,
  id,
}: AnimatedButtonClassicLayoutProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const spring = useSpring({
    transform: isPressed
      ? 'scale(0.95)'
      : isHovered
        ? 'scale(1.03)'
        : 'scale(1)',
    config: config.wobbly,
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
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/30
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
