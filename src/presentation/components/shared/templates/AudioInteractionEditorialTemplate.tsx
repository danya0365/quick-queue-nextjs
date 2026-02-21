import { animated, useSpring } from 'react-spring';

export function AudioInteractionEditorialTemplate() {
  const spring = useSpring({
    from: { opacity: 0, transform: 'translateY(-40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 350, friction: 25 }
  });

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none flex mx-auto justify-center pt-24 sm:pt-32 px-4 max-w-7xl font-serif">
      <animated.div
        style={spring}
        className="bg-black text-white pointer-events-auto p-6 sm:p-10 border-[6px] border-black flex flex-col items-center gap-6 max-w-2xl w-full cursor-pointer hover:bg-gray-900 transition-colors active:scale-95 shadow-[12px_12px_0_0_rgba(255,255,255,1)] ring-4 ring-black"
      >
        <div className="text-6xl sm:text-8xl w-full text-center border-b-[6px] border-white pb-6 uppercase font-black tracking-tighter">
          AUDIO
        </div>
        <div className="w-full text-center flex flex-col gap-2">
          <h3 className="font-bold text-2xl sm:text-3xl uppercase tracking-widest leading-none">
            INTERACTION REQUIRED
          </h3>
          <p className="font-bold text-xs sm:text-sm uppercase tracking-widest bg-white text-black px-4 py-2 mx-auto inline-block mt-4">
            CLICK ANYWHERE TO ENABLE SOUND
          </p>
        </div>
      </animated.div>
    </div>
  );
}
