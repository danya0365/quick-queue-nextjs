import { QueueItem, SERVICE_TYPE_CONFIG, ServiceType } from '@/src/domain/types/queue';
import { QueueViewModel } from '@/src/presentation/presenters/queue/QueuePresenter';
import { animated, SpringValue } from 'react-spring';

export interface QueueEditorialTemplateProps {
  viewModel: QueueViewModel;
  currentTime: string;
  refreshCountdown: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  pulseSpring: { opacity: SpringValue<number>; transform: SpringValue<string> };
  mobileTab: 'in_progress' | 'waiting' | 'completed';
  setMobileTab: (tab: 'in_progress' | 'waiting' | 'completed') => void;
  showQR: boolean;
  setShowQR: (show: boolean) => void;
  onItemClick: (item: QueueItem) => void;
}

export function QueueEditorialTemplate({
  viewModel,
  currentTime,
  refreshCountdown,
  soundEnabled,
  setSoundEnabled,
  pulseSpring,
  mobileTab,
  setMobileTab,
  showQR,
  setShowQR,
  onItemClick,
}: QueueEditorialTemplateProps) {
  const stats = viewModel.stats;
  const currentQ = viewModel.currentServingNumber || 0;
  const waitTime = viewModel.estimatedWaitMinutes || 0;
  const waitingItems = viewModel.waitingItems || [];
  const inProgressItems = viewModel.inProgressItems || [];
  const completedItems = viewModel.completedItems || [];

  return (
    <div
      className="min-h-full font-serif p-4 sm:p-8 bg-white text-black overflow-y-auto selection:bg-black selection:text-white"
      id="queue-editorial-layout"
    >
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-8">
        {/* ─── Header ─── */}
        <header className="flex flex-row justify-between items-end border-b-[3px] sm:border-b-[6px] border-black pb-2 sm:pb-6 gap-2 sm:gap-6 overflow-hidden">
          <div className="w-auto flex flex-col shrink-0">
            <h1 className="text-3xl sm:text-7xl font-black uppercase tracking-tighter leading-none mb-1 sm:mb-2 text-black">
              ข้อมูลคิว
            </h1>
            <div className="flex items-center gap-1.5 sm:gap-4">
              <span className="font-bold text-[6px] sm:text-xs uppercase tracking-widest bg-black text-white px-1.5 py-0.5 sm:px-3 sm:py-1 whitespace-nowrap">
                สถานะเรียลไทม์
              </span>
              <span className="font-bold text-[6px] sm:text-sm tracking-widest uppercase whitespace-nowrap">
                รีโหลดใน: {refreshCountdown}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end justify-end gap-1.5 sm:gap-4 w-auto shrink-0 pb-0.5 sm:pb-0">
            <div className="text-right w-auto pb-1 sm:pb-1 border-b-[2px] sm:border-b-[6px] border-black flex flex-col justify-end items-end">
              <div className="text-xl sm:text-5xl font-black tabular-nums tracking-tighter leading-none">
                {currentTime}
              </div>
            </div>
            <div className="flex flex-row gap-1 sm:gap-4 w-auto">
              <button
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`px-1.5 py-1 sm:px-8 sm:py-3 font-black uppercase border-[2px] sm:border-[6px] border-black hover:bg-black hover:text-white transition-all text-[6px] sm:text-sm tracking-widest whitespace-nowrap ${
                  soundEnabled ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                {soundEnabled ? 'เสียง: เปิด' : 'เสียง: ปิด'}
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="px-1.5 py-1 sm:px-10 sm:py-3 font-black uppercase border-[2px] sm:border-[6px] border-black bg-black text-white hover:bg-white hover:text-black transition-colors text-[6px] sm:text-sm tracking-widest whitespace-nowrap"
              >
                สแกนดูคิว
              </button>
            </div>
          </div>
        </header>

        {/* ─── Hero Serving Section ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 border-[4px] sm:border-[6px] border-black p-4 sm:p-8 relative overflow-hidden bg-white">
          {/* Diagonal Ribbon */}
          <div className="absolute top-4 sm:top-8 -left-16 sm:-left-12 z-20 bg-black text-white font-black text-[10px] sm:text-xl uppercase px-20 sm:px-16 py-1.5 sm:py-3 transform -rotate-45 shadow-none lg:shadow-xl border-y-[2px] sm:border-y-[6px] border-white">
            กำลังเรียกคิว
          </div>

          <div className="col-span-1 lg:col-span-8 flex flex-col justify-center items-center lg:items-start lg:border-r-[6px] lg:border-black lg:pr-12 relative z-10 pt-10 lg:pt-0">
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tighter mb-2 sm:mb-4 opacity-50">คิวปัจจุบัน</h2>
            <animated.div style={pulseSpring} className="relative w-full text-center lg:text-left">
              <div className="text-[10rem] sm:text-[18rem] md:text-[22rem] font-black tabular-nums leading-[0.8] tracking-tighter text-black">
                {currentQ > 0 ? currentQ.toString().padStart(2, '0') : '—'}
              </div>
            </animated.div>
          </div>

          <div className="col-span-1 lg:col-span-4 flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-stretch gap-4 sm:gap-8 relative z-10 lg:pl-4 border-t-[4px] lg:border-t-0 p-4 lg:p-0 border-black mt-4 lg:mt-0">
            <EditorialStat title="รอคิว" value={stats?.waitingItems || 0} />
            <div className="hidden lg:block w-full h-[6px] bg-black"></div>
            <div className="block lg:hidden w-[4px] h-12 bg-black"></div>
            <EditorialStat title="เวลารอโดยประมาณ" value={`${waitTime} นาที`} />
          </div>
        </div>

        {/* ─── Mobile Tabs (Hidden on Desktop) ─── */}
        <div className="lg:hidden mt-8 flex border-[4px] border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] font-bold uppercase tracking-widest text-[10px] sm:text-sm">
          <button
            onClick={() => setMobileTab('in_progress')}
            className={`flex-1 py-3 text-center transition-colors border-r-[4px] border-black flex flex-col items-center justify-center ${mobileTab === 'in_progress' ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'}`}
          >
            กำลังเรียก <span className={`px-2 py-0.5 mt-1 border-[2px] tabular-nums ${mobileTab === 'in_progress' ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`}>{inProgressItems.length}</span>
          </button>
          <button
            onClick={() => setMobileTab('waiting')}
            className={`flex-1 py-3 text-center transition-colors border-r-[4px] border-black flex flex-col items-center justify-center ${mobileTab === 'waiting' ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'}`}
          >
            รอคิว <span className={`px-2 py-0.5 mt-1 border-[2px] tabular-nums ${mobileTab === 'waiting' ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`}>{waitingItems.length}</span>
          </button>
          <button
            onClick={() => setMobileTab('completed')}
            className={`flex-1 py-3 text-center transition-colors flex flex-col items-center justify-center ${mobileTab === 'completed' ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'}`}
          >
            เสร็จสิ้น <span className={`px-2 py-0.5 mt-1 border-[2px] tabular-nums ${mobileTab === 'completed' ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`}>{completedItems.length}</span>
          </button>
        </div>

        {/* ─── Active Track Column (Mobile Only) ─── */}
        <div className="lg:hidden mt-6">
          {mobileTab === 'in_progress' && <EditorialColumn title="กำลังเรียก" items={inProgressItems} isServing />}
          {mobileTab === 'waiting' && <EditorialColumn title="รอคิว" items={waitingItems} />}
          {mobileTab === 'completed' && <EditorialColumn title="เสร็จสิ้น" items={completedItems} />}
        </div>

        {/* ─── Track Columns (Desktop Only) ─── */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative before:hidden lg:before:block before:absolute before:inset-0 before:pointer-events-none before:border-t-[6px] before:border-black before:-top-4">
          <EditorialColumn title="กำลังเรียก" items={inProgressItems} isServing onItemClick={onItemClick} />
          <EditorialColumn title="รอคิว" items={waitingItems} onItemClick={onItemClick} />
          <EditorialColumn title="เสร็จสิ้น" items={completedItems} onItemClick={onItemClick} />
        </div>

      </div>
    </div>
  );
}

// ─── Editorial Components ───

function EditorialStat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="flex flex-col text-center lg:text-left">
      <span className="font-bold text-[10px] sm:text-sm uppercase tracking-widest opacity-60 mb-1 sm:mb-2">{title}</span>
      <span className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-none">{value}</span>
    </div>
  );
}

function EditorialColumn({ title, items, isServing = false, onItemClick }: { title: string; items: QueueItem[]; isServing?: boolean; onItemClick?: (item: QueueItem) => void }) {
  return (
    <div className={`flex flex-col border-[4px] sm:border-[6px] border-black h-[450px] sm:h-[600px] ${isServing ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className={`px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between border-b-[4px] sm:border-b-[6px] ${isServing ? 'border-white' : 'border-black'}`}>
        <h3 className="font-black uppercase tracking-tighter text-xl sm:text-2xl">{title}</h3>
        <span className={`px-2 sm:px-3 py-1 font-bold text-base sm:text-lg border-[2px] sm:border-[3px] tabular-nums ${isServing ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`}>
          {items.length}
        </span>
      </div>
      
      <div className={`flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-6 ${isServing ? 'bg-black' : 'bg-gray-100'}`}>
        {items.length === 0 ? (
          <div className={`h-full flex items-center justify-center font-bold uppercase border-[4px] sm:border-[6px] border-dashed text-center p-6 ${isServing ? 'border-white/20 text-white/40' : 'border-black/20 text-black/40'}`}>
            ไม่มีข้อมูล
          </div>
        ) : (
           items.map((item) => <EditorialRow key={item.id} item={item} isServing={isServing} onClick={() => onItemClick?.(item)} />)
        )}
      </div>
    </div>
  );
}

function EditorialRow({ item, isServing, onClick }: { item: QueueItem; isServing: boolean; onClick?: () => void }) {
  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];

  const getBadgeStyle = (type: ServiceType) => {
    switch (type) {
      case ServiceType.EXPRESS:
        return 'bg-amber-400 text-black border-amber-400 group-hover:border-black';
      case ServiceType.VIP:
        return 'bg-fuchsia-600 text-white border-fuchsia-600 group-hover:border-black';
      case ServiceType.GENERAL:
      default:
        return isServing ? 'bg-transparent text-white border-white group-hover:text-black group-hover:border-black' : 'bg-transparent text-black border-black group-hover:text-white group-hover:border-white';
    }
  };

  const getStripeStyle = (type: ServiceType) => {
    switch (type) {
      case ServiceType.EXPRESS:
        return 'bg-amber-400 border-amber-400 group-hover:border-black';
      case ServiceType.VIP:
        return 'bg-fuchsia-600 border-fuchsia-600 group-hover:border-black';
      case ServiceType.GENERAL:
      default:
        return isServing ? 'bg-white border-white group-hover:bg-black group-hover:border-black' : 'bg-black border-black group-hover:bg-white group-hover:border-white';
    }
  };
  
  return (
    <div onClick={onClick} className={`border-[3px] sm:border-[6px] ${isServing ? 'border-white bg-black hover:bg-white hover:text-black' : 'border-black bg-white hover:bg-black hover:text-white'} p-3 sm:p-5 flex items-start gap-2 sm:gap-4 transition-colors group cursor-pointer`}>
      <div className={`w-2 sm:w-3 flex-shrink-0 self-stretch border-[2px] sm:border-[3px] ${getStripeStyle(item.serviceType)}`}></div>
      
      <div className="flex flex-col justify-center min-w-[3rem] sm:min-w-[3.5rem] border-r-[2px] sm:border-r-[4px] border-inherit pr-2 sm:pr-4">
        <div className="font-black text-2xl sm:text-4xl tabular-nums leading-none tracking-tighter">{item.queueNumber.toString().padStart(2, '0')}</div>
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center pl-2">
        <div className="font-black text-lg sm:text-xl leading-tight uppercase truncate">{item.customerName}</div>
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
           <span className={`text-[9px] sm:text-[11px] font-bold uppercase px-1.5 py-0.5 sm:px-2 sm:py-1 border-[2px] sm:border-[3px] inline-block tracking-widest ${getBadgeStyle(item.serviceType)}`}>
            {serviceConfig.label}
          </span>
          {item.note && (
             <span className={`text-[9px] sm:text-[11px] font-bold uppercase px-1.5 py-0.5 sm:px-2 sm:py-1 border-[2px] sm:border-[3px] inline-block tracking-widest truncate max-w-[80px] sm:max-w-[120px] ${isServing ? 'border-white/50 text-white/70 group-hover:border-black/50 group-hover:text-black/70' : 'border-black/30 text-black/50 group-hover:border-white/30 group-hover:text-white/50'}`}>
              {item.note}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
