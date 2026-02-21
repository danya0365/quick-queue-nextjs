import { QUEUE_STATUS_CONFIG, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { HomeViewModel } from '@/src/presentation/presenters/home/HomePresenter';
import { QRCodeSVG } from 'qrcode.react';
import { animated, SpringValue } from 'react-spring';

export interface HomeRetroTechMagazineTemplateProps {
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

export function HomeRetroTechMagazineTemplate({
  viewModel,
  currentTime,
  soundEnabled,
  setSoundEnabled,
  showQR,
  setShowQR,
  qrSpring,
  currentUrl,
  bigNumberSpring,
}: HomeRetroTechMagazineTemplateProps) {
  const stats = viewModel.stats;
  const currentQ = viewModel.currentQueueNumber || 0;
  const waitTime = viewModel.estimatedWaitMinutes || 0;
  const recentItems = viewModel.items.filter((i) => i.status !== QueueStatus.CANCELLED) || [];

  return (
    <div
      className="min-h-full font-sans p-4 sm:p-8 overflow-y-auto selection:bg-[#FF00FF] selection:text-white"
      style={{
        backgroundColor: '#f4f4f0',
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#111',
      }}
      id="home-retro-layout"
    >
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* ─── Magazine Header ─── */}
        <header className="flex flex-col sm:flex-row justify-between items-end border-b-8 border-black pb-4 gap-6">
          <div>
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none text-black">
              QUICK<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] stroke-black" style={{ WebkitTextStroke: '2px black' }}>
                QUEUE
              </span>
            </h1>
            <p className="font-bold text-xl uppercase tracking-widest mt-2 px-2 bg-black text-white inline-block">
              TECH ISSUE #01
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold uppercase tracking-widest">Live Time</div>
              <div className="text-3xl font-black tabular-nums">{currentTime}</div>
            </div>
            {/* Top Navigation Tabs */}
            <div className="flex border-4 border-black font-bold uppercase overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white transform -skew-x-6">
              <button
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`px-4 py-2 border-r-4 border-black transition-colors ${
                  soundEnabled ? 'bg-[#39FF14] text-black' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {soundEnabled ? 'BEEP ON' : 'MUTE'}
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="px-4 py-2 bg-[#00FFFF] hover:bg-[#FF00FF] hover:text-white transition-colors text-black"
              >
                SCAN QR
              </button>
            </div>
          </div>
        </header>

        {/* ─── 3 Column Grid Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Vertical Card (Left Column) - 5 cols */}
          <div className="lg:col-span-5 relative group">
            {/* Featured Sticker */}
            <div className="absolute -top-6 -right-6 z-20 bg-[#FF00FF] text-white font-black text-xl uppercase p-4 rounded-full border-4 border-black transform rotate-12 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:rotate-6 transition-transform">
              SERVING<br/>NOW!
            </div>
            
            <animated.div
              style={bigNumberSpring}
              className="bg-white border-8 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-8 sm:p-12 relative overflow-hidden h-full flex flex-col justify-center items-center"
            >
              {/* Grain / pattern overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

              <div className="text-2xl font-black uppercase tracking-widest text-[#00FFFF] bg-black px-4 py-2 mb-6 transform -rotate-2">
                Q-NUMBER
              </div>
              
              <div className="text-8xl sm:text-[10rem] font-black tabular-nums leading-none tracking-tighter text-black drop-shadow-[4px_4px_0_rgba(57,255,20,1)]">
                {currentQ > 0 ? currentQ.toString().padStart(2, '0') : '—'}
              </div>

              <div className="mt-8 border-t-4 border-black pt-6 w-full text-center">
                <span className="font-bold text-xl block uppercase">Estimated Wait</span>
                <span className="text-4xl font-black bg-[#39FF14] px-4 py-1 border-2 border-black inline-block mt-2 transform skew-x-6">
                  {waitTime} MIN
                </span>
              </div>
            </animated.div>
          </div>

          {/* Center Column (Stats) - 3 cols */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2 inline-block">
              SYS_STATS
            </h2>
            
            <div className="flex flex-col gap-4">
              <RetroStatCard label="Total" value={stats?.totalItems || 0} color="#00FFFF" />
              <RetroStatCard label="Waiting" value={stats?.waitingItems || 0} color="#FF00FF" />
              <RetroStatCard label="In Progress" value={stats?.inProgressItems || 0} color="#39FF14" />
              <RetroStatCard label="Completed" value={stats?.completedItems || 0} color="#FFFFFF" />
            </div>
          </div>

          {/* Right Column (List) - 4 cols */}
          <div className="lg:col-span-4 bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 h-full min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-4 border-black">
              <h2 className="text-2xl font-black uppercase bg-black text-white px-3 py-1">
                LATEST_Q
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {recentItems.length === 0 ? (
                <div className="p-8 border-4 border-dashed border-black font-bold text-center uppercase">
                  Empty Queue
                </div>
              ) : (
                recentItems.map((item) => {
                  const statusConfig = QUEUE_STATUS_CONFIG[item.status];
                  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];
                  
                  return (
                    <div key={item.id} className="border-4 border-black p-4 flex gap-4 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all bg-white group cursor-pointer relative overflow-hidden">
                      {/* Highlight color block */}
                      <div className={`absolute left-0 top-0 bottom-0 w-2 ${item.status === 'in_progress' ? 'bg-[#39FF14]' : 'bg-black'}`}></div>
                      
                      <div className="pl-2">
                        <div className="font-black text-2xl">{item.queueNumber.toString().padStart(2, '0')}</div>
                        <div className="text-xs font-bold uppercase px-2 py-1 bg-black text-white inline-block mt-1">
                          {statusConfig.label}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-bold text-lg leading-tight uppercase line-clamp-1">{item.customerName}</div>
                        <div className="text-sm font-bold opacity-60 uppercase mt-1">
                          {serviceConfig.label}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowQR(false)}
        >
          <animated.div
            style={qrSpring}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#39FF14] p-8 border-8 border-black shadow-[16px_16px_0_0_rgba(0,0,0,1)] flex flex-col items-center max-w-sm w-full relative transform rotate-1"
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute -top-5 -right-5 bg-[#FF00FF] text-white w-12 h-12 rounded-full border-4 border-black font-black text-xl hover:scale-110 transition-transform shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              X
            </button>
            <h3 className="text-3xl font-black uppercase text-black mb-2 bg-white px-4 border-4 border-black transform -rotate-2">
              SCAN ME
            </h3>
            <p className="text-sm font-bold text-black mb-6 text-center uppercase">
              Get your virtual queue ticket instantly
            </p>
            <div className="bg-white p-4 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <QRCodeSVG
                value={currentUrl}
                size={220}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
              />
            </div>
            <p className="mt-6 text-xs font-bold bg-black text-white px-4 py-2 uppercase tracking-widest truncate w-full text-center">
              {currentUrl}
            </p>
          </animated.div>
        </div>
      )}
    </div>
  );
}

// ─── Retro Stat Card ───
function RetroStatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-4 relative overflow-hidden" style={{ backgroundColor: color }}>
      {/* Halftone dot pattern overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '8px 8px' }}></div>
      <div className="relative z-10 flex justify-between items-center">
        <span className="font-bold uppercase tracking-wider text-black bg-white px-2 py-0.5 border-2 border-black">{label}</span>
        <span className="text-4xl font-black text-black">{value}</span>
      </div>
    </div>
  );
}
