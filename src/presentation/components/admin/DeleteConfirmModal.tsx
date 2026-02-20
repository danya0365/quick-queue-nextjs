'use client';

import { animated, useSpring } from 'react-spring';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  customerName: string;
  queueNumber: number;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  queueNumber,
}: DeleteConfirmModalProps) {
  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { tension: 300, friction: 25 },
  });

  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
    config: { tension: 300, friction: 25 },
  });

  if (!isOpen) return null;

  return (
    <animated.div
      style={overlaySpring}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <animated.div
        style={modalSpring}
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-sm
          bg-surface border border-border
          rounded-2xl shadow-xl p-6
          text-center
        "
      >
        <div className="text-5xl mb-4">🗑️</div>
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
    </animated.div>
  );
}
