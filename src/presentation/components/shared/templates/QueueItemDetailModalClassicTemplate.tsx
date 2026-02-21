import { QUEUE_STATUS_CONFIG, QueueItem, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { QueueNumberBadge, StatusBadge } from '@/src/presentation/components/shared/StatusBadge';
import { animated } from 'react-spring';

export interface QueueItemDetailModalClassicTemplateProps {
  onClose: () => void;
  item: QueueItem;
  modalSpring: any;
}

export function QueueItemDetailModalClassicTemplate({ onClose, item, modalSpring }: QueueItemDetailModalClassicTemplateProps) {
  const statusConfig = QUEUE_STATUS_CONFIG[item.status];
  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <animated.div
        style={modalSpring}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-surface border border-border rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-surface-alt/50 flex items-center justify-between">
          <h2 className="text-foreground font-semibold">รายละเอียดคิว</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-muted transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            <QueueNumberBadge number={item.queueNumber} size="lg" />
            <div className="mt-4 text-center">
              <div className="text-xl font-bold text-foreground mb-1">{item.customerName}</div>
              <div className="flex items-center gap-2 justify-center">
                <StatusBadge
                  label={serviceConfig.label}
                  icon={serviceConfig.icon}
                  colorClass={serviceConfig.color}
                  bgClass={serviceConfig.bgColor}
                />
                <StatusBadge
                  label={statusConfig.label}
                  icon={statusConfig.icon}
                  colorClass={statusConfig.color}
                  bgClass={statusConfig.bgColor}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-surface-alt/30 p-4 rounded-xl border border-border/50">
            <div>
              <div className="text-xs text-muted mb-1 font-medium">หมายเหตุ</div>
              <div className="text-sm text-foreground">{item.note || '-'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted mb-1 font-medium">รับคิวเมื่อ</div>
                <div className="text-sm text-foreground">{new Date(item.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div>
                <div className="text-xs text-muted mb-1 font-medium">อัปเดตล่าสุด</div>
                <div className="text-sm text-foreground">{new Date(item.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface-alt/50">
          <button onClick={onClose} className="w-full py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            ปิด
          </button>
        </div>
      </animated.div>
    </div>
  );
}
