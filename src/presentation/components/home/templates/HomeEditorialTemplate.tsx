import { QUEUE_STATUS_CONFIG, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { HomeViewModel } from '@/src/presentation/presenters/home/HomePresenter';
import { QRCodeSVG } from 'qrcode.react';
import { animated, SpringValue } from 'react-spring';

export interface HomeEditorialTemplateProps {
  viewModel: HomeViewModel;
  gradientAngle: number;
  currentTime: string;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  showQR: boolean;
  setShowQR: (show: boolean) => void;
  qrSpring: { opacity: SpringValue<number>; transform: SpringValue<string> };
  currentUrl: string;
  bigNumberSpring: { opacity: SpringValue<number>; transform: SpringValue<string> };
}

export function HomeEditorialTemplate({
  viewModel,
  currentTime,
  soundEnabled,
  setSoundEnabled,
  showQR,
  setShowQR,
  qrSpring,
  currentUrl,
  bigNumberSpring,
}: HomeEditorialTemplateProps) {
  const stats = viewModel.stats;
  const currentQ = viewModel.currentQueueNumber || 0;
  const waitTime = viewModel.estimatedWaitMinutes || 0;
  const recentItems = viewModel.items.filter((i) => i.status !== QueueStatus.CANCELLED) || [];

  return (
    <div
      className="min-h-full font-serif p-3 sm:p-6 md:p-10 bg-white text-black overflow-x-hidden selection:bg-black selection:text-white"
      id="home-editorial-layout"
    >
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-8">
        
        {/* ─── Magazine Header ─── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-[4px] sm:border-b-[8px] border-black pb-4 sm:pb-8 gap-4 sm:gap-8">
          <div className="w-full md:w-auto">
            <h1 className="text-5xl sm:text-7xl lg:text-[6.5rem] font-black uppercase tracking-tighter leading-[0.9] sm:leading-[0.85] text-black">
              QUICK
              <br className="hidden md:block"/>
              <span className="text-black bg-white md:pl-2 mt-2 md:mt-0 inline-block">QUEUE</span>
            </h1>
            <p className="font-bold text-[10px] sm:text-xl uppercase tracking-widest mt-2 sm:mt-6 px-2 sm:px-4 py-1 sm:py-2 border-[2px] sm:border-[6px] border-black inline-block">
              ISSUE 01 // LIVE QUEUE SYSTEM
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-3 sm:gap-6 w-full md:w-auto">
            <div className="text-left md:text-right w-full md:w-auto pb-2 sm:pb-4 border-b-[2px] sm:border-b-[6px] border-black flex justify-between md:block items-end">
              <div className="text-[10px] sm:text-sm font-bold uppercase tracking-widest opacity-60">LOCAL TIME</div>
              <div className="text-3xl sm:text-5xl lg:text-6xl font-black tabular-nums tracking-tighter leading-none">{currentTime}</div>
            </div>
            <div className="flex flex-row gap-2 sm:gap-4 w-full md:w-auto">
              <button
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`flex-1 sm:flex-none px-2 py-2 sm:px-8 sm:py-4 font-black uppercase border-[2px] sm:border-[6px] border-black text-[10px] sm:text-sm tracking-widest transition-colors hover:bg-black hover:text-white ${
                  soundEnabled ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                {soundEnabled ? 'AUDIO ON' : 'MUTED'}
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="flex-1 sm:flex-none px-2 py-2 sm:px-10 sm:py-4 font-black uppercase border-[2px] sm:border-[6px] border-black bg-black text-white hover:bg-white hover:text-black transition-colors text-[10px] sm:text-sm tracking-widest"
              >
                SCAN TICKET
              </button>
            </div>
          </div>
        </header>

        {/* ─── 3 Column Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 xl:gap-12 items-start relative">
          
          {/* Main Visual Column (Left) - 6 cols */}
          <div className="lg:col-span-6 relative group h-full">            
            <animated.div
              style={bigNumberSpring}
              className="bg-black text-white border-[4px] sm:border-[8px] border-white ring-[2px] sm:ring-[6px] ring-black p-6 sm:p-12 lg:p-16 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[auto] py-12 sm:py-0 sm:h-[550px] lg:h-[700px]"
            >
              {/* Diagonal Ribbon */}
              <div className="absolute top-6 sm:top-12 -left-20 sm:-left-16 z-20 bg-white text-black font-black text-[10px] sm:text-xl uppercase px-24 py-1.5 sm:py-4 transform -rotate-45 font-sans tracking-widest border-y-[2px] sm:border-y-[6px] border-black">
                SPOTLIGHT
              </div>

              <div className="text-[10px] sm:text-sm font-bold uppercase tracking-widest border-[2px] sm:border-[4px] border-white px-3 py-1 sm:px-6 sm:py-2 mb-6 sm:mb-12 opacity-80 mt-6 sm:mt-0">
                CURRENT TICKET
              </div>
              
              <div className="text-[7rem] sm:text-[16rem] lg:text-[20rem] xl:text-[24rem] font-black tabular-nums leading-[0.75] tracking-tighter mix-blend-difference mb-6 sm:mb-12">
                {currentQ > 0 ? currentQ.toString().padStart(2, '0') : '—'}
              </div>

              <div className="mt-auto border-t-[2px] sm:border-t-[6px] border-white pt-4 sm:pt-8 w-full flex justify-between items-end">
                <span className="font-bold text-[10px] sm:text-xl uppercase tracking-widest text-left w-1/2 leading-tight">EST Wait<br/>TIME</span>
                <span className="text-3xl sm:text-6xl font-black tabular-nums tracking-tighter">{waitTime}M</span>
              </div>
            </animated.div>
          </div>

          {/* Stats Column (Center) - 2 cols */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-2 sm:gap-4 lg:gap-6 h-full mt-0 lg:mt-0 overflow-x-auto pb-2 lg:pb-0 snap-x">
            <h2 className="hidden lg:block text-2xl sm:text-3xl font-black uppercase border-b-[4px] sm:border-b-[6px] border-black pb-3 sm:pb-4">
              METRICS
            </h2>
            
            <div className="flex flex-row lg:flex-col gap-2 sm:gap-4 lg:gap-6 font-sans w-full min-w-max lg:min-w-0">
              <div className="snap-center"><EditorialStatCard label="TOTAL" value={stats?.totalItems || 0} isDark /></div>
              <div className="snap-center"><EditorialStatCard label="WAITING" value={stats?.waitingItems || 0} /></div>
              <div className="snap-center"><EditorialStatCard label="PLAYING" value={stats?.inProgressItems || 0} /></div>
              <div className="snap-center"><EditorialStatCard label="DONE" value={stats?.completedItems || 0} /></div>
            </div>
          </div>

          {/* List Column (Right) - 4 cols */}
          <div className="lg:col-span-4 border-[2px] sm:border-[6px] border-black p-3 sm:p-6 lg:p-8 min-h-[300px] sm:h-[550px] lg:h-[700px] flex flex-col bg-white">
            <div className="flex justify-between items-center mb-4 pb-2 sm:mb-8 sm:pb-6 border-b-[2px] sm:border-b-[6px] border-black">
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter">
                THE ROSTER
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 sm:pr-4 space-y-3 sm:space-y-6">
              {recentItems.length === 0 ? (
                <div className="p-6 sm:p-12 border-[2px] sm:border-[6px] border-dashed border-gray-300 font-bold text-lg sm:text-2xl text-center uppercase text-gray-400">
                  NO ENTRIES
                </div>
              ) : (
                recentItems.map((item) => {
                  const statusConfig = QUEUE_STATUS_CONFIG[item.status];
                  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];
                  const isServing = item.status === QueueStatus.IN_PROGRESS;
                  
                  return (
                    <div key={item.id} className={`border-[2px] sm:border-[6px] border-black p-2 sm:p-5 flex gap-2 sm:gap-5 transition-all cursor-pointer font-sans ${isServing ? 'bg-black text-white hover:bg-white hover:text-black hover:border-black' : 'bg-white text-black hover:bg-black hover:text-white'}`}>
                      <div className="flex flex-col justify-center border-r-[2px] sm:border-r-[4px] border-inherit pr-2 sm:pr-5 min-w-[50px] sm:min-w-[80px]">
                        <div className="font-black text-3xl sm:text-5xl tabular-nums leading-none tracking-tighter text-center">{item.queueNumber.toString().padStart(2, '0')}</div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center overflow-hidden">
                        <div className="font-black text-lg sm:text-2xl leading-tight uppercase truncate">{item.customerName}</div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                          <span className={`text-[10px] sm:text-xs font-bold uppercase px-2 py-1 sm:px-3 sm:py-1 border-[2px] sm:border-[3px] border-inherit inline-block tracking-widest whitespace-nowrap`}>
                            {statusConfig.label}
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 whitespace-nowrap">
                            {serviceConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ─── QR Modal ─── */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm"
          onClick={() => setShowQR(false)}
        >
          <animated.div
            style={qrSpring}
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-12 border-[8px] border-black flex flex-col items-center max-w-lg w-full relative shadow-[24px_24px_0_0_rgba(0,0,0,1)]"
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute -top-6 -right-6 bg-black text-white w-14 h-14 rounded-full border-[6px] border-white font-black text-2xl hover:scale-110 transition-transform shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center"
            >
              X
            </button>
            <h3 className="text-5xl font-black uppercase text-black mb-4 tracking-tighter w-full text-center border-b-[6px] border-black pb-6">
              DIGITAL TICKET
            </h3>
            <p className="text-sm font-bold text-gray-500 mb-10 text-center uppercase tracking-widest">
              SCAN TO JOIN THE QUEUE REMOTELY
            </p>
            <div className="bg-white p-6 border-[6px] border-black">
              <QRCodeSVG
                value={currentUrl}
                size={280}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
              />
            </div>
            <p className="mt-10 text-xs font-bold bg-black text-white px-6 py-3 uppercase tracking-widest truncate w-full text-center border-[4px] border-black">
              {currentUrl}
            </p>
          </animated.div>
        </div>
      )}
    </div>
  );
}

// ─── Editorial Stat Card ───
function EditorialStatCard({ label, value, isDark = false }: { label: string; value: number; isDark?: boolean }) {
  return (
    <div className={`border-[2px] sm:border-[6px] border-black p-3 sm:p-6 flex flex-col gap-1 sm:gap-4 transition-colors min-w-[100px] sm:min-w-[auto] ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <span className={`font-bold uppercase tracking-widest text-[8px] sm:text-xs border-b-[2px] sm:border-b-[4px] pb-1 sm:pb-2 ${isDark ? 'border-white/30' : 'border-black/30'}`}>{label}</span>
      <span className="text-3xl sm:text-5xl lg:text-6xl font-black tabular-nums tracking-tighter leading-none">{value}</span>
    </div>
  );
}
