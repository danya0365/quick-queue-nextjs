import { Trash2 } from 'lucide-react';
import { animated } from 'react-spring';

export interface DeleteConfirmClassicTemplateProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  customerName: string;
  queueNumber: number;
  modalSpring: any;
}

export function DeleteConfirmClassicTemplate({
  onClose,
  onConfirm,
  customerName,
  queueNumber,
  modalSpring,
}: DeleteConfirmClassicTemplateProps) {
  return (
    <animated.div
      style={modalSpring}
      onClick={(e) => e.stopPropagation()}
      className="
        relative w-full max-w-sm
        bg-surface border border-border
        rounded-2xl shadow-xl p-6
        text-center
        max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden
      "
    >
      <div className="mb-4 flex justify-center text-muted"><Trash2 className="w-12 h-12" /></div>
      <h2 className="text-foreground font-bold text-lg mb-2">ยืนยันการลบ</h2>
      <p className="text-muted text-sm mb-6">
        ต้องการลบคิว <strong className="text-foreground">#{queueNumber}</strong> ({customerName}) หรือไม่?
      </p>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="
            flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
            bg-surface-alt border border-border text-muted
            hover:text-foreground transition-colors
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
            bg-gradient-to-r from-red-500 to-rose-600 text-white
            hover:opacity-90 transition-all
          "
          id="delete-confirm"
        >
          ลบคิว
        </button>
      </div>
    </animated.div>
  );
}
