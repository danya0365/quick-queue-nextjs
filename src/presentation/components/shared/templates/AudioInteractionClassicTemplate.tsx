import { animated, useSpring } from 'react-spring';

export function AudioInteractionClassicTemplate() {
  const spring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  });

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none flex items-start justify-center pt-24 sm:pt-28 px-4">
      <animated.div
        style={spring}
        className="bg-primary text-white pointer-events-auto px-6 py-4 rounded-2xl shadow-[0_20px_40px_rgba(var(--primary),0.3)] flex items-center gap-4 max-w-md w-full ring-4 ring-primary/20 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
      >
        <div className="w-12 h-12 flex-shrink-0 bg-white/20 rounded-full flex items-center justify-center animate-pulse text-2xl">
          🎵
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">แตะหน้าจอเพื่อเปิดเสียง</h3>
          <p className="text-white/80 text-sm mt-0.5 leading-snug">
            เบราว์เซอร์ต้องการการตอบสนองจากคุณ ก่อนที่จะเริ่มเล่นเสียงเรียกคิวได้
          </p>
        </div>
      </animated.div>
    </div>
  );
}
