import { animated, useSpring } from 'react-spring';

export function AudioInteractionEditorialTemplate() {
  const spring = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 350, friction: 25 }
  });

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] pointer-events-none flex justify-center p-4 sm:p-8 font-serif selection:bg-white selection:text-black">
      <animated.div
        style={spring}
        className="pointer-events-auto w-full max-w-[1400px] bg-black text-white border-[4px] sm:border-[6px] border-black shadow-[8px_8px_0_0_rgba(255,255,255,1)] ring-[4px] ring-black flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 lg:p-8 cursor-pointer hover:bg-gray-900 transition-colors active:scale-[0.99] group gap-4 lg:gap-8"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto text-center sm:text-left">
          <div className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter shrink-0 leading-none group-hover:animate-pulse">
            AUDIO
          </div>
          <div className="hidden sm:block w-[4px] align-self-stretch self-stretch bg-white shrink-0"></div>
          <div className="flex flex-col justify-center">
            <h3 className="font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-tighter leading-none mb-1 sm:mb-2">
              INTERACTION REQUIRED
            </h3>
            <p className="font-bold text-[10px] sm:text-xs uppercase tracking-widest opacity-80">
              Browser policy requires a click. Tap here to enable queue sound alerts.
            </p>
          </div>
        </div>
        
        <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end">
          <span className="font-black text-[10px] sm:text-sm uppercase tracking-widest bg-white text-black px-6 py-3 sm:px-8 sm:py-4 transition-transform group-hover:-translate-y-1 w-full lg:w-auto text-center border-[2px] border-transparent group-hover:border-white">
            ENABLE SOUND
          </span>
        </div>
      </animated.div>
    </div>
  );
}
