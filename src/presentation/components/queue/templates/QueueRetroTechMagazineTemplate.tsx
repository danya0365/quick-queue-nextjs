import { QueueItem, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { QueueViewModel } from '@/src/presentation/presenters/queue/QueuePresenter';
import { animated, SpringValue } from 'react-spring';

export interface QueueRetroTechMagazineTemplateProps {
  viewModel: QueueViewModel;
  currentTime: string;
  refreshCountdown: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  pulseSpring: { opacity: SpringValue<number>; transform: SpringValue<string> };
  mobileTab: 'in_progress' | 'waiting' | 'completed';
  setMobileTab: (tab: 'in_progress' | 'waiting' | 'completed') => void;
}

export function QueueRetroTechMagazineTemplate({
  viewModel,
  currentTime,
  refreshCountdown,
  soundEnabled,
  setSoundEnabled,
  pulseSpring,
  mobileTab,
  setMobileTab,
}: QueueRetroTechMagazineTemplateProps) {
  const stats = viewModel.stats;
  const currentQ = viewModel.currentServingNumber || 0;
  const waitTime = viewModel.estimatedWaitMinutes || 0;
  const waitingItems = viewModel.waitingItems || [];
  const inProgressItems = viewModel.inProgressItems || [];
  const completedItems = viewModel.completedItems || [];

  return (
    <div
      className="min-h-full font-sans p-4 sm:p-8 overflow-y-auto selection:bg-[#FF00FF] selection:text-white"
      style={{
        backgroundColor: '#f4f4f0',
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#111',
      }}
      id="queue-retro-layout"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ─── Header ─── */}
        <header className="flex flex-col sm:flex-row justify-between items-end border-b-8 border-black pb-4 gap-4">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none text-black">
              ระบบคิว
              <span className="block text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] stroke-black" style={{ WebkitTextStroke: '1px black' }}>
                ฟีดเรียลไทม์
              </span>
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
            <div className="flex gap-2 sm:gap-4 border-4 border-black bg-white p-1.5 sm:p-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform -skew-x-2 w-full sm:w-auto overflow-hidden">
              <div className="px-2 sm:px-4 py-1 sm:py-2 border-r-4 border-black font-bold text-[10px] sm:text-sm tracking-widest uppercase flex flex-1 items-center justify-center whitespace-nowrap min-w-0">
                รีโหลดใน <span className="text-[#FF00FF] ml-1">{refreshCountdown}วิ.</span>
              </div>
              <button
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`px-2 sm:px-4 py-1 sm:py-2 font-black uppercase border-2 border-black hover:-translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all flex-shrink-0 text-[10px] sm:text-sm ${
                  soundEnabled ? 'bg-[#39FF14] text-black' : 'bg-black text-white'
                }`}
              >
                {soundEnabled ? 'เสียงแจ้งเตือน: เปิด' : 'เสียงแจ้งเตือน: ปิด'}
              </button>
            </div>
            <div className="text-black bg-[#00FFFF] border-2 border-black px-3 py-1 font-bold text-xl uppercase tracking-widest shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              {currentTime}
            </div>
          </div>
        </header>

        {/* ─── Hero Serving Section ─── */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 z-20 bg-[#FF00FF] text-white font-black text-xs sm:text-lg uppercase px-3 py-1 sm:px-4 sm:py-2 border-4 border-black transform -rotate-12 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            กำลังเรียกคิว
          </div>
          
          <div className="bg-white border-8 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left: Giant Number */}
            <animated.div style={pulseSpring} className="relative z-10 flex-shrink-0 text-center mx-auto md:mx-0">
               <div className="text-9xl sm:text-[14rem] font-black tabular-nums leading-none tracking-tighter text-black drop-shadow-[6px_6px_0_rgba(0,255,255,1)]">
                 {currentQ > 0 ? currentQ.toString().padStart(2, '0') : '—'}
               </div>
            </animated.div>

            {/* Right: Quick Stats */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto relative z-10">
               <RetroQueueStat label="กำลังรอ (คิว)" val={stats?.waitingItems || 0} color="#FF00FF" />
               <RetroQueueStat label="ระยะเวลารอ" val={`${waitTime} นาที`} color="#39FF14" />
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
          </div>
        </div>

        {/* ─── Mobile Tabs (Hidden on Desktop) ─── */}
        <div className="lg:hidden mt-8 flex border-4 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] font-bold uppercase tracking-widest text-xs sm:text-sm">
          <button
            onClick={() => setMobileTab('in_progress')}
            className={`flex-1 py-3 text-center transition-colors border-r-4 border-black flex flex-col items-center justify-center ${mobileTab === 'in_progress' ? 'bg-[#00FFFF] text-black shadow-inner' : 'hover:bg-gray-100 text-black'}`}
          >
            กำลังเรียก <span className="bg-black text-white px-2 py-0.5 mt-1 border border-black tabular-nums">{inProgressItems.length}</span>
          </button>
          <button
            onClick={() => setMobileTab('waiting')}
            className={`flex-1 py-3 text-center transition-colors border-r-4 border-black flex flex-col items-center justify-center ${mobileTab === 'waiting' ? 'bg-[#FF00FF] text-white shadow-inner' : 'hover:bg-gray-100 text-black'}`}
          >
            รอคิว <span className="bg-black text-white px-2 py-0.5 mt-1 border border-black tabular-nums">{waitingItems.length}</span>
          </button>
          <button
            onClick={() => setMobileTab('completed')}
            className={`flex-1 py-3 text-center transition-colors flex flex-col items-center justify-center ${mobileTab === 'completed' ? 'bg-[#39FF14] text-black shadow-inner' : 'hover:bg-gray-100 text-black'}`}
          >
            เสร็จสิ้น <span className="bg-black text-white px-2 py-0.5 mt-1 border border-black tabular-nums">{completedItems.length}</span>
          </button>
        </div>

        {/* ─── Active Track Column (Mobile Only) ─── */}
        <div className="lg:hidden mt-6">
          {mobileTab === 'in_progress' && <RetroQueueColumn title="กำลังเรียก" items={inProgressItems} baseColor="#00FFFF" />}
          {mobileTab === 'waiting' && <RetroQueueColumn title="รอคิว" items={waitingItems} baseColor="#FF00FF" />}
          {mobileTab === 'completed' && <RetroQueueColumn title="เสร็จสิ้น" items={completedItems} baseColor="#39FF14" />}
        </div>

        {/* ─── Track Columns (Desktop Only) ─── */}
        <div className="hidden lg:grid grid-cols-3 gap-8 items-start mt-8">
          <RetroQueueColumn title="กำลังเรียก" items={inProgressItems} baseColor="#00FFFF" />
          <RetroQueueColumn title="รอคิว" items={waitingItems} baseColor="#FF00FF" />
          <RetroQueueColumn title="เสร็จสิ้น" items={completedItems} baseColor="#39FF14" />
        </div>

      </div>
    </div>
  );
}

// ─── Retro Components ───

function RetroQueueStat({ label, val, color }: { label: string; val: number | string; color: string }) {
  return (
    <div className="border-4 border-black p-4 flex flex-col items-center justify-center transform hover:scale-105 transition-transform" style={{ backgroundColor: color }}>
      <div className="font-black text-sm sm:text-base uppercase tracking-widest text-black bg-white px-2 mb-2 border-2 border-black">{label}</div>
      <div className="text-4xl sm:text-5xl font-black text-black tabular-nums">{val}</div>
    </div>
  );
}

function RetroQueueColumn({ title, items, baseColor }: { title: string; items: QueueItem[]; baseColor: string }) {
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col h-[500px]">
      <div className="px-4 py-3 border-b-4 border-black flex items-center justify-between" style={{ backgroundColor: baseColor }}>
        <h3 className="font-black text-black uppercase tracking-tighter text-lg">{title}</h3>
        <span className="bg-black text-white px-2 py-0.5 text-sm font-bold border-2 border-white tabular-nums">
          {items.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center font-bold uppercase text-gray-400 border-4 border-dashed border-gray-300 p-4 text-center">
            {title === 'เสร็จสิ้น' ? 'ยังไม่มีคิวที่เสร็จสิ้น' : 'ไม่มีข้อมูลคิว'}
          </div>
        ) : (
          items.map((item) => <RetroQueueItemRow key={item.id} item={item} highlightColor={baseColor} />)
        )}
      </div>
    </div>
  );
}

function RetroQueueItemRow({ item, highlightColor }: { item: QueueItem; highlightColor: string }) {
  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];
  const isServing = item.status === QueueStatus.IN_PROGRESS;

  return (
    <div className={`border-4 border-black p-3 flex items-start gap-3 hover:-translate-y-1 transition-transform relative bg-white group cursor-default ${isServing ? 'shadow-[4px_4px_0_0_rgba(0,255,255,1)]' : 'shadow-[4px_4px_0_0_rgba(0,0,0,1)]'}`}>
      {/* Side Color Ribbon */}
      <div className="absolute left-0 top-0 bottom-0 w-2 border-r-4 border-black" style={{ backgroundColor: highlightColor }}></div>
      
      <div className="pl-2 flex flex-col justify-center min-w-[3rem]">
        <div className="font-black text-3xl tabular-nums leading-none mb-1">{item.queueNumber.toString().padStart(2, '0')}</div>
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="font-bold text-lg leading-tight uppercase truncate">{item.customerName}</div>
        <div className="flex flex-wrap gap-1 mt-1">
           <span className="text-[10px] font-bold uppercase bg-black text-white px-1 border border-black inline-block">
            {serviceConfig.label}
          </span>
          {item.note && (
             <span className="text-[10px] font-bold uppercase bg-gray-200 text-gray-600 px-1 border border-gray-400 inline-block truncate max-w-[100px]">
              {item.note}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
