import { ReactNode, useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

export interface FadeInSectionRetroTechMagazineTemplateProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function FadeInSectionRetroTechMagazineTemplate({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: FadeInSectionRetroTechMagazineTemplateProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTranslate = () => {
    switch (direction) {
      case 'up': return isVisible ? 'translateY(0px)' : 'translateY(15px)';
      case 'down': return isVisible ? 'translateY(0px)' : 'translateY(-15px)';
      case 'left': return isVisible ? 'translateX(0px)' : 'translateX(15px)';
      case 'right': return isVisible ? 'translateX(0px)' : 'translateX(-15px)';
      case 'none': return 'translate(0, 0)';
    }
  };

  // Retro animation often skips opacity fade or does it sharply.
  // Instead of soft tension, we use a snappy spring.
  const spring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: getTranslate(),
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.div style={spring} className={className}>
      {children}
    </animated.div>
  );
}
