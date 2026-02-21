import { animated } from 'react-spring';

export interface DeleteConfirmRetroLayoutProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  customerName: string;
  queueNumber: number;
  modalSpring: any;
}

export function DeleteConfirmRetroLayout({
  onClose,
  onConfirm,
  customerName,
  queueNumber,
  modalSpring,
}: DeleteConfirmRetroLayoutProps) {
  return (
    <animated.div
      style={modalSpring}
      onClick={(e) => e.stopPropagation()}
      className="
        relative w-full max-w-sm
        bg-black border-4 border-white
        p-8 shadow-[8px_8px_0_0_rgba(255,0,0,1)]
        text-center
      "
    >
      <div className="absolute top-0 left-0 w-3 h-3 bg-white"></div>
      <div className="absolute top-0 right-0 w-3 h-3 bg-white"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 bg-white"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-white"></div>

      <div className="text-6xl mb-6">🗑️</div>
      <h2 className="text-white font-black text-2xl mb-2 uppercase tracking-widest">
        DELETE FILE?
      </h2>
      <p className="text-gray-300 font-mono text-sm mb-8 uppercase">
        TARGET: <strong className="text-[#FF0000]">Q#{queueNumber}</strong>
        <br />
        ID: {customerName}
      </p>

      <div className="flex flex-col gap-4">
        <button
          onClick={async () => {
            await onConfirm();
          }}
          className="
            w-full bg-[#FF0000] text-white border-2 border-white
            px-4 py-3 font-black uppercase text-xl
            hover:bg-white hover:text-[#FF0000] hover:border-[#FF0000]
            transition-all shadow-[4px_4px_0_0_rgba(255,255,255,1)]
            active:translate-y-1 active:shadow-none
          "
          id="delete-confirm"
        >
          CONFIRM DEL
        </button>
        <button
          onClick={onClose}
          className="
            w-full bg-black text-white border-2 border-white
            px-4 py-3 font-bold uppercase text-sm
            hover:bg-white hover:text-black
            transition-all
          "
        >
          ABORT
        </button>
      </div>
    </animated.div>
  );
}
