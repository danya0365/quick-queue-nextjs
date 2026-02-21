import { ReactNode, useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

export interface FadeInSectionClassicTemplateProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function FadeInSectionClassicTemplate({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: FadeInSectionClassicTemplateProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTranslate = () => {
    switch (direction) {
      case 'up': return isVisible ? 'translateY(0px)' : 'translateY(30px)';
      case 'down': return isVisible ? 'translateY(0px)' : 'translateY(-30px)';
      case 'left': return isVisible ? 'translateX(0px)' : 'translateX(30px)';
      case 'right': return isVisible ? 'translateX(0px)' : 'translateX(-30px)';
      case 'none': return 'translate(0, 0)';
    }
  };

  const spring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: getTranslate(),
    config: { tension: 120, friction: 14 },
  });

  return (
    <animated.div style={spring} className={className}>
      {children}
    </animated.div>
  );
}
