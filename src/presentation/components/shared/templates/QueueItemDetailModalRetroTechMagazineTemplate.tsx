import { QUEUE_STATUS_CONFIG, QueueItem, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { animated } from 'react-spring';

export interface QueueItemDetailModalRetroTechMagazineTemplateProps {
  onClose: () => void;
  item: QueueItem;
  modalSpring: any;
}

export function QueueItemDetailModalRetroTechMagazineTemplate({ onClose, item, modalSpring }: QueueItemDetailModalRetroTechMagazineTemplateProps) {
  const statusConfig = QUEUE_STATUS_CONFIG[item.status];
  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <animated.div
        style={{ ...modalSpring, backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '10px 10px' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-black border-4 border-white shadow-[8px_8px_0_0_rgba(255,0,255,1)] p-6 max-h-[90vh] flex flex-col font-sans text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-white text-black hover:bg-[#FF00FF] hover:text-white border-2 border-black font-black text-xl flex items-center justify-center transition-colors shadow-[2px_2px_0_0_rgba(0,255,255,1)] z-10"
        >
          ✕
        </button>

        <div className="border-b-4 border-white pb-4 mb-4 flex justify-between items-end relative">
          <div className="absolute top-0 right-10 text-[10px] font-mono text-[#00FFFF] animate-pulse">
            LINK_SECURE
          </div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#FF00FF] drop-shadow-[2px_2px_0_rgba(255,255,255,1)]">
            SYS_DETAIL
          </h2>
          <div className="text-right">
             <div className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">QUEUE_ID</div>
             <div className="text-3xl font-mono text-[#39FF14]">{item.queueNumber.toString().padStart(2, '0')}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           <div className="bg-black/80 border-2 border-[#00FFFF] p-4 shadow-[4px_4px_0_0_rgba(255,255,255,1)]">
             <div className="text-xs font-bold uppercase text-[#00FFFF] border-b-2 border-dashed border-gray-600 pb-1 mb-2">&gt; USER_DATA</div>
             <div className="font-mono text-xl">{item.customerName}</div>
           </div>

           <div className="grid grid-cols-2 gap-4">
               <div className="bg-black/80 border-2 border-white p-3 shadow-[4px_4px_0_0_rgba(57,255,20,1)]">
                 <div className="text-[10px] font-bold uppercase text-gray-400 mb-1">TYPE_</div>
                 <div className="font-bold text-sm uppercase bg-white text-black px-1 inline-block">{serviceConfig.label}</div>
               </div>
               <div className="bg-black/80 border-2 border-white p-3 shadow-[4px_4px_0_0_rgba(255,0,255,1)]">
                 <div className="text-[10px] font-bold uppercase text-gray-400 mb-1">STATUS_</div>
                 <div className="font-bold text-sm uppercase text-[#39FF14]">{statusConfig.label}</div>
               </div>
           </div>

           <div className="bg-black/80 border-2 border-white p-4">
             <div className="text-[10px] font-bold uppercase text-gray-400 mb-2 border-b-2 border-dashed border-gray-600 pb-1">NOTES_</div>
             <div className="font-mono text-sm text-gray-300">{item.note || 'NO_DATA'}</div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 text-center">
               <div className="bg-black/80 border border-gray-600 p-2">
                 <div className="text-[8px] font-mono text-gray-400 mb-1 hover:text-[#00FFFF] cursor-default transition-colors">INIT_TIME</div>
                 <div className="font-mono text-sm">{new Date(item.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</div>
               </div>
               <div className="bg-black/80 border border-gray-600 p-2">
                 <div className="text-[8px] font-mono text-gray-400 mb-1 hover:text-[#00FFFF] cursor-default transition-colors">UPDATE_TIME</div>
                 <div className="font-mono text-sm">{new Date(item.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</div>
               </div>
           </div>
        </div>

        <div className="mt-6 pt-4 border-t-4 border-dashed border-white">
            <button
               onClick={onClose}
               className="w-full bg-[#39FF14] text-black border-4 border-white font-black uppercase tracking-widest text-sm px-6 py-3 transition-colors shadow-[4px_4px_0_0_rgba(255,0,255,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(255,0,255,1)] active:shadow-none active:translate-y-[4px]"
            >
              /CLOSE_CONNECTION/
            </button>
        </div>
      </animated.div>
    </div>
  );
}
