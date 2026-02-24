import { formatQueueNumber } from '@/src/config/queue-display.config';
import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';
import { QUEUE_STATUS_CONFIG, QueueItem, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { animated } from 'react-spring';

export interface QueueItemDetailModalEditorialTemplateProps {
  onClose: () => void;
  item: QueueItem;
  modalSpring: any;
}

export function QueueItemDetailModalEditorialTemplate({ onClose, item, modalSpring }: QueueItemDetailModalEditorialTemplateProps) {
  const statusConfig = QUEUE_STATUS_CONFIG[item.status];
  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-md" onClick={onClose}>
      <animated.div
        style={modalSpring}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white border-[6px] border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-8 max-h-[90vh] flex flex-col font-serif"
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white hover:bg-white hover:text-black border-[4px] border-black font-black text-xl flex items-center justify-center transition-colors z-10"
        >
          ✕
        </button>

        <div className="border-b-[4px] border-black pb-4 mb-6 flex justify-between items-end">
          <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">
            รายละเอียด<br />
            <span className="bg-black text-white px-2 mt-1 inline-block">คิวการจอง</span>
          </h2>
          <div className="text-right">
             <div className="text-[10px] font-bold uppercase tracking-widest text-black/60">TICKET NO.</div>
             <div className="text-4xl font-black tabular-nums">{formatQueueNumber(item.queueNumber)}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-6">
             <div className="text-xs font-bold uppercase tracking-widest text-black/50 border-r-[2px] border-black text-right pr-4 py-1">ลูกค้า</div>
             <div className="font-black text-2xl uppercase break-words">{item.customerName}</div>

             <div className="text-xs font-bold uppercase tracking-widest text-black/50 border-r-[2px] border-black text-right pr-4 py-1">ประเภท</div>
             <div className="font-bold text-lg uppercase">{serviceConfig.label}</div>

             <div className="text-xs font-bold uppercase tracking-widest text-black/50 border-r-[2px] border-black text-right pr-4 py-1">สถานะ</div>
             <div className="font-bold text-lg uppercase inline-block border-[2px] border-black px-2 py-0.5">{statusConfig.label}</div>

             <div className="text-xs font-bold uppercase tracking-widest text-black/50 border-r-[2px] border-black text-right pr-4 py-1">หมายเหตุ</div>
             <div className="font-medium text-sm border-[2px] border-black/20 p-3 italic bg-gray-50">{item.note || 'ไม่มีระบุ'}</div>
             
             <div className="text-xs font-bold uppercase tracking-widest text-black/50 border-r-[2px] border-black text-right pr-4 py-1 pt-4 border-t-[2px]">เวลาจอง</div>
             <div className="font-mono text-sm pt-4 border-t-[2px] border-black/10">
               {new Date(item.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
             </div>
             
             <div className="text-xs font-bold uppercase tracking-widest text-black/50 border-r-[2px] border-black text-right pr-4 py-1">อัปเดต</div>
             <div className="font-mono text-sm">
               {new Date(item.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
             </div>
           </div>
        </div>


        <div className="mt-8 pt-6 border-t-[4px] border-black flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-widest border-[2px] border-black px-2 py-1">{DEFAULT_SHOP_CONFIG.shopName} SYSTEM</div>
            <button
               onClick={onClose}
               className="bg-black text-white hover:bg-white hover:text-black border-[4px] border-black font-black uppercase tracking-widest text-sm px-6 py-2 transition-colors inline-block"
            >
              ปิด (CLOSE)
            </button>
        </div>
      </animated.div>
    </div>
  );
}
