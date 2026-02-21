import { animated, useSpring } from 'react-spring';

export function AudioInteractionRetroTechMagazineTemplate() {
  const spring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  });

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none flex items-start justify-center pt-24 sm:pt-28 px-4">
      <animated.div
        style={spring}
        className="bg-[#FF00FF] pointer-events-auto text-white p-4 sm:p-6 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex items-center gap-4 sm:gap-6 max-w-lg w-full cursor-pointer hover:-translate-y-1 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-transform active:scale-95"
      >
        <div className="text-4xl sm:text-5xl animate-bounce">
          📢
        </div>
        <div className="flex-1">
          <h3 className="font-black text-xl sm:text-2xl mb-1.5 uppercase tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,1)] leading-none">
            ACTION REQUIRED
          </h3>
          <p className="text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-black px-2 py-1 inline-block border-2 border-white shadow-[2px_2px_0_0_rgba(255,255,255,1)]">
            CLICK ANYWHERE TO ENABLE AUDIO
          </p>
        </div>
      </animated.div>
    </div>
  );
}
