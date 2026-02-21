import { animated } from 'react-spring';

export interface ClearConfirmRetroTechMagazineTemplateProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  modalSpring: any;
}

export function ClearConfirmRetroTechMagazineTemplate({
  onClose,
  onConfirm,
  modalSpring,
}: ClearConfirmRetroTechMagazineTemplateProps) {
  return (
    <animated.div
      style={modalSpring}
      className="
        relative w-full max-w-sm
        bg-black border-4 border-white
        p-8 shadow-[8px_8px_0_0_rgba(255,0,255,1)]
        text-center
        max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden
      "
    >
      <div className="absolute top-0 left-0 w-3 h-3 bg-white"></div>
      <div className="absolute top-0 right-0 w-3 h-3 bg-white"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 bg-white"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-white"></div>

      <div className="text-6xl mb-6">☢️</div>
      <h2 className="text-white font-black text-2xl mb-4 uppercase tracking-widest">
        ล้างข้อมูลทั้งหมด?
      </h2>
      <p className="text-gray-300 font-mono text-sm mb-8 uppercase">
        คำเตือน! การกระทำนี้จะลบข้อมูลคิวทั้งหมด 
        <br />
        และไม่สามารถกู้คืนได้
      </p>

      <div className="flex flex-col gap-4">
        <button
          onClick={async () => {
            await onConfirm();
          }}
          className="
            w-full bg-[#FF00FF] text-white border-2 border-white
            px-4 py-3 font-black uppercase text-xl
            hover:bg-white hover:text-[#FF00FF] hover:border-[#FF00FF]
            transition-all shadow-[4px_4px_0_0_rgba(255,255,255,1)]
            active:translate-y-1 active:shadow-none
          "
        >
          ยืนยันการล้างข้อมูล
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
          ยกเลิก
        </button>
      </div>
    </animated.div>
  );
}
