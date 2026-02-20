'use client';

import { animated, useSpring } from 'react-spring';

interface ClearConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ClearConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: ClearConfirmModalProps) {
  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { tension: 300, friction: 25 },
  });

  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1) translateY(0px)' : 'scale(0.95) translateY(20px)',
    config: { tension: 300, friction: 25 },
  });

  if (!isOpen) return null;

  return (
    <animated.div
      style={overlaySpring}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <animated.div
        style={modalSpring}
        className="
          relative w-full max-w-sm
          bg-surface border border-border
          rounded-2xl shadow-xl
          overflow-hidden
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
    </animated.div>
  );
}
