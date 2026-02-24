import { formatQueueNumber } from '@/src/config/queue-display.config';
import { QUEUE_STATUS_CONFIG, QueueItem, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { HomeViewModel } from '@/src/presentation/presenters/home/HomePresenter';
import { Edit3 } from 'lucide-react';
import { animated, SpringValue } from 'react-spring';

export interface HomeRetroTechMagazineTemplateProps {
  viewModel: HomeViewModel;
  gradientAngle: number;
  currentTime: string;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  showQR: boolean;
  setShowQR: (show: boolean) => void;
  bigNumberSpring: { opacity: SpringValue<number>; transform: SpringValue<string> };
  onItemClick: (item: QueueItem) => void;
  onRequestQueue: () => void;
}

export function HomeRetroTechMagazineTemplate({
  viewModel,
  currentTime,
  soundEnabled,
  setSoundEnabled,
  showQR,
  setShowQR,
  bigNumberSpring,
  onItemClick,
  onRequestQueue,
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
              นวัตกรรมจัดการคิวออนไลน์
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold uppercase tracking-widest">เวลาบนเซิร์ฟเวอร์</div>
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
                {soundEnabled ? 'เสียงแจ้งเตือน: เปิด' : 'เสียงแจ้งเตือน: ปิด'}
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="px-4 py-2 bg-[#00FFFF] hover:bg-[#FF00FF] hover:text-white transition-colors text-black border-r-4 border-black"
              >
                ดึงข้อมูลคิว
              </button>
              <button
                onClick={onRequestQueue}
                className="px-4 py-2 bg-[#39FF14] hover:bg-[#FF00FF] hover:text-white transition-colors text-black flex items-center gap-2"
              >
                <Edit3 className="w-5 h-5" /> ขอบัตรคิว
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
              ถึงคิว<br/>ของคุณ!
            </div>
            
            <animated.div
              style={bigNumberSpring}
              className="bg-white border-8 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-8 sm:p-12 relative overflow-hidden h-full flex flex-col justify-center items-center"
            >
              {/* Grain / pattern overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

              <div className="text-2xl font-black uppercase tracking-widest text-[#00FFFF] bg-black px-4 py-2 mb-6 transform -rotate-2">
                หมายเลขคิวล่าสุด
              </div>
              
              <div className="text-8xl sm:text-[10rem] font-black tabular-nums leading-none tracking-tighter text-black drop-shadow-[4px_4px_0_rgba(57,255,20,1)]">
                {currentQ > 0 ? formatQueueNumber(currentQ) : '—'}
              </div>

              <div className="mt-8 border-t-4 border-black pt-6 w-full text-center">
                <span className="font-bold text-xl block uppercase">ระยะเวลารอโดยประมาณ</span>
                <span className="text-4xl font-black bg-[#39FF14] px-4 py-1 border-2 border-black inline-block mt-2 transform skew-x-6">
                  {waitTime} นาที
                </span>
              </div>
            </animated.div>
          </div>

          {/* Center Column (Stats) - 3 cols */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2 inline-block">
              สถิติระบบ
            </h2>
            
            <div className="flex flex-col gap-4">
              <RetroStatCard label="ยอดรวม" value={stats?.totalItems || 0} color="#00FFFF" />
              <RetroStatCard label="กำลังรอ" value={stats?.waitingItems || 0} color="#FF00FF" />
              <RetroStatCard label="เรียกอยู่" value={stats?.inProgressItems || 0} color="#39FF14" />
              <RetroStatCard label="เสร็จสิ้น" value={stats?.completedItems || 0} color="#FFFFFF" />
            </div>
          </div>

          {/* Right Column (List) - 4 cols */}
          <div className="lg:col-span-4 bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 h-full min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-4 border-black">
              <h2 className="text-2xl font-black uppercase bg-black text-white px-3 py-1">
                ข้อมูลคิวล่าสุด
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {recentItems.length === 0 ? (
                <div className="p-8 border-4 border-dashed border-black font-bold text-center uppercase">
                  ไม่มีรายการคิวในระบบ
                </div>
              ) : (
                recentItems.map((item) => {
                  const statusConfig = QUEUE_STATUS_CONFIG[item.status];
                  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];
                  
                  return (
                    <div key={item.id} onClick={() => onItemClick(item)} className="border-4 border-black p-4 flex gap-4 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all bg-white group cursor-pointer relative overflow-hidden">
                      {/* Highlight color block */}
                      <div className={`absolute left-0 top-0 bottom-0 w-2 ${item.status === 'in_progress' ? 'bg-[#39FF14]' : 'bg-black'}`}></div>
                      
                      <div className="pl-2">
                        <div className="font-black text-2xl">{formatQueueNumber(item.queueNumber)}</div>
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
