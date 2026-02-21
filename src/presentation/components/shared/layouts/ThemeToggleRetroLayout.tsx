import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

export function ThemeToggleRetroLayout() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  // Scale bounce on hover
  const spring = useSpring({
    transform: isPressed ? 'translate(2px, 2px)' : isHovered ? 'translate(-1px, -1px)' : 'translate(0px, 0px)',
    boxShadow: isPressed ? '0px 0px 0 0 rgba(0,0,0,1)' : isHovered ? '3px 3px 0 0 rgba(0,0,0,1)' : '2px 2px 0 0 rgba(0,0,0,1)',
    config: { tension: 400, friction: 30 },
  });

  if (!mounted) {
    return (
      <div className="w-10 h-10 border-2 border-black bg-white" />
    );
  }

  return (
    <animated.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={spring}
      className="
        relative w-10 h-10
        bg-white border-2 border-black
        flex items-center justify-center
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-black
      "
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      id="theme-toggle-btn-retro"
    >
      <span className="text-lg leading-none select-none font-bold">
        {isDark ? 'ON' : 'OFF'}
      </span>
    </animated.button>
  );
}
