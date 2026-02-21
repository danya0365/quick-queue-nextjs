import { animated } from 'react-spring';

export interface ClearConfirmClassicTemplateProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  modalSpring: any;
}

export function ClearConfirmClassicTemplate({
  onClose,
  onConfirm,
  modalSpring,
}: ClearConfirmClassicTemplateProps) {
  return (
    <animated.div
      style={modalSpring}
      className="
        relative w-full max-w-sm
        bg-surface border border-border
        rounded-2xl shadow-xl
        max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden
      "
    >
      <div className="p-6">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-2xl mb-4 mx-auto">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-foreground text-center mb-2">
          ยืนยันการล้างคิวทั้งหมด?
        </h3>
        <p className="text-muted text-sm text-center mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการ <strong className="text-red-500">ล้างคิวทั้งหมด</strong>? การกระทำนี้ไม่สามารถกู้คืนได้ และคิวที่อยู่ในระบบจะหายไปทันที
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="
              flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
              bg-surface-alt border border-border text-muted
              hover:text-foreground hover:bg-surface-alt
              transition-colors
            "
          >
            ยกเลิก
          </button>
          <button
            onClick={async () => {
              await onConfirm();
            }}
            className="
              flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
              bg-red-500 text-white
              hover:bg-red-600
              transition-colors
            "
          >
            ยืนยันการล้าง
          </button>
        </div>
      </div>
    </animated.div>
  );
}
