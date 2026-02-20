'use client';

import { CreateQueueItemData, ServiceType } from '@/src/domain/types/queue';
import { FormEvent, useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface CreateQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQueueItemData) => Promise<void>;
  nextQueueNumber: number;
}

export function CreateQueueModal({
  isOpen,
  onClose,
  onSubmit,
  nextQueueNumber,
}: CreateQueueModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.GENERAL);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setCustomerName('');
      setServiceType(ServiceType.GENERAL);
      setNote('');
    }
  }, [isOpen]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        customerName: customerName.trim() || `ลูกค้าคิว #${nextQueueNumber}`,
        serviceType,
        note: note.trim() || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <animated.div
      style={overlaySpring}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay - Removed onClick onClose to force button click */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <animated.div
        style={modalSpring}
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-md
          bg-surface border border-border
          rounded-2xl shadow-xl
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-foreground font-bold text-lg">เพิ่มคิวใหม่</h2>
            <p className="text-muted text-xs mt-0.5">
              คิวหมายเลข <strong className="text-primary">#{nextQueueNumber}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 flex justify-between items-end">
              <span>ชื่อลูกค้า</span>
              <span className="text-muted text-xs font-normal">ถ้าปล่อยว่าง ระบบจะตั้งชื่อให้</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="
                  w-full px-4 py-2.5 pr-10 rounded-xl
                  bg-surface-alt border border-border
                  text-foreground text-sm
                  placeholder:text-muted-light
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                  transition-all duration-200
                "
                placeholder={`เช่น ลูกค้าคิว #${nextQueueNumber}`}
                autoFocus
                id="create-customer-name"
              />
              {customerName && (
                <button
                  type="button"
                  onClick={() => setCustomerName('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light hover:text-muted bg-transparent border-none p-1"
                  title="เคลียร์"
                >
                  ✕
                </button>
              )}
            </div>
            {/* Quick Presets for Lazy Input */}
            <div className="flex flex-wrap gap-2 mt-2">
              {['คุณพี่', 'Grab', 'Lineman', 'Foodpanda', 'Lalamove'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCustomerName(preset)}
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-alt hover:border-primary/30 transition-all"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              ประเภทบริการ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: ServiceType.GENERAL, label: '📋 ทั่วไป' },
                { value: ServiceType.EXPRESS, label: '⚡ ด่วน' },
                { value: ServiceType.VIP, label: '👑 VIP' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setServiceType(option.value)}
                  className={`
                    px-3 py-2.5 rounded-xl text-sm font-medium
                    border transition-all duration-200
                    ${
                      serviceType === option.value
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-surface-alt border-border text-muted hover:text-foreground hover:border-border'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 flex justify-between items-end">
              <span>รายการสั่งซื้อ / หมายเหตุ</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="
                  w-full px-4 py-2.5 pr-10 rounded-xl
                  bg-surface-alt border border-border
                  text-foreground text-sm
                  placeholder:text-muted-light
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                  transition-all duration-200
                "
                placeholder="เช่น 1 ชิ้น, เนื้อ 2 ไก่ 1"
                id="create-note"
              />
              {note && (
                <button
                  type="button"
                  onClick={() => setNote('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light hover:text-muted bg-transparent border-none p-1"
                  title="เคลียร์"
                >
                  ✕
                </button>
              )}
            </div>
            {/* Quick Presets for Food Orders (Ramadan Murtabak Use Case) */}
            <div className="flex flex-wrap gap-2 mt-2">
              {['1 ชิ้น', '2 ชิ้น', '3 ชิ้น', '4 ชิ้น', '5 ชิ้น', 'เนื้อ', 'ไก่', 'กล้วย', 'ธรรมดา', 'พิเศษ'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setNote((prev) => (prev ? prev + ' ' + preset : preset))}
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-alt hover:border-primary/30 transition-all"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
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
              type="submit"
              disabled={isSubmitting}
              className="
                flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-primary to-accent text-white
                hover:opacity-90
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              "
              id="create-submit"
            >
              {isSubmitting ? 'กำลังสร้าง...' : `สร้างคิว #${nextQueueNumber}`}
            </button>
          </div>
        </form>
      </animated.div>
    </animated.div>
  );
}
