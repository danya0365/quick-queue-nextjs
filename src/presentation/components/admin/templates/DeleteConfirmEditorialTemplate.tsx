import { animated } from 'react-spring';

export interface DeleteConfirmEditorialTemplateProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  customerName: string;
  queueNumber: number;
  modalSpring: any;
}

export function DeleteConfirmEditorialTemplate({
  onClose,
  onConfirm,
  customerName,
  queueNumber,
  modalSpring,
}: DeleteConfirmEditorialTemplateProps) {
  return (
    <animated.div
      style={modalSpring}
      onClick={(e) => e.stopPropagation()}
      className="
        relative w-full max-w-sm
        bg-black border-[6px] border-red-500 text-white
        font-serif shadow-[8px_8px_0_0_#ef4444]
      "
    >
      <div className="px-6 py-4 border-b-[6px] border-red-500 flex justify-between items-center bg-black">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-red-500 flex items-center gap-2">
          WARNING
        </h2>
        <button
          onClick={onClose}
          className="w-10 h-10 border-[4px] border-red-500 text-red-500 font-black flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="p-6 font-sans">
        <h3 className="text-xl font-bold uppercase mb-2">DESTROY TICKET?</h3>
        <p className="text-sm font-bold opacity-80 mb-6 uppercase">
          TICKET <span className="bg-red-500 text-white px-2 ml-1">#{queueNumber}</span> ({customerName}) WILL BE ERASED FROM RECORDS.
        </p>
        
        <div className="flex gap-4 border-t-[6px] border-red-500 pt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-4 font-black uppercase text-sm border-[4px] border-red-500 bg-black text-red-500 hover:bg-red-500 hover:text-black transition-colors"
          >
            ABORT
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-4 font-black uppercase text-sm border-[4px] border-red-500 bg-red-500 text-black hover:bg-white hover:text-black hover:border-white transition-colors"
          >
            DESTROY
          </button>
        </div>
      </div>
    </animated.div>
  );
}
