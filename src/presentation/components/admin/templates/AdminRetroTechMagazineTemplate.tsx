import { PendingRequestsSection } from '@/src/presentation/components/admin/PendingRequestsSection';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { animated, useSpring } from 'react-spring';

// Widgets
import { CurrentQueueWidget } from '@/src/presentation/components/admin/widgets/CurrentQueueWidget';
import { QuickActionsWidget } from '@/src/presentation/components/admin/widgets/QuickActionsWidget';
import { RecentActivityLog } from '@/src/presentation/components/admin/widgets/RecentActivityLog';

export interface AdminRetroTechMagazineTemplateProps {
  state: AdminPresenterState;
  actions: AdminPresenterActions;
}

export function AdminRetroTechMagazineTemplate({
  state,
  actions,
}: AdminRetroTechMagazineTemplateProps) {

  // Infinite marquee for stats (mobile only)
  const marqueeSpring = useSpring({
    from: { transform: 'translateX(0%)' },
    to: { transform: 'translateX(-50%)' },
    config: { duration: 15000 }, // 15 seconds per loop
    loop: true,
  });

  const viewModel = state.viewModel;
  if (!viewModel) return null;
  
  const stats = viewModel.stats;

  const statItems = [
    { label: 'รวม', value: stats?.totalItems || 0, color: '#FFFFFF' },
    { label: 'รอคิว', value: stats?.waitingItems || 0, color: '#FF00FF', textColor: 'text-white' },
    { label: 'เรียกคิว', value: stats?.inProgressItems || 0, color: '#00FFFF' },
    { label: 'เสร็จ', value: stats?.completedItems || 0, color: '#39FF14' },
    { label: 'ยกเลิก', value: stats?.cancelledItems || 0, color: '#000000', textColor: 'text-white' },
  ];

  return (
    <div
      className="min-h-full font-sans p-2 sm:p-8 overflow-y-auto selection:bg-[#FF00FF] selection:text-white pb-24 sm:pb-8"
      style={{
        backgroundColor: '#f4f4f0',
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#111',
      }}
      id="admin-retro-layout"
    >
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">


        {/* ─── Stats Grid (Desktop) ─── */}
        <div className="hidden sm:grid sm:grid-cols-5 gap-4">
          {statItems.map((stat, i) => (
            <RetroStatBox key={`desktop-${i}`} {...stat} />
          ))}
        </div>

        {/* ─── Infinite Carousel (Mobile) ─── */}
        <div className="sm:hidden overflow-hidden w-full pb-2 relative -mx-2 px-2">
          {/* Fade edges to look better when scrolling */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-[#f4f4f0] z-10" style={{ maskImage: 'linear-gradient(to right, black, transparent)', WebkitMaskImage: 'linear-gradient(to right, black, transparent)' }}></div>
          <div className="absolute top-0 bottom-0 right-0 w-4 bg-[#f4f4f0] z-10" style={{ maskImage: 'linear-gradient(to left, black, transparent)', WebkitMaskImage: 'linear-gradient(to left, black, transparent)' }}></div>
          
          <animated.div
            style={marqueeSpring}
            className="flex flex-nowrap w-max"
          >
            {[statItems, statItems].map((list, listIdx) => (
              <div key={`list-${listIdx}`} className="flex gap-2 pr-2">
                {list.map((stat, i) => (
                  <div key={`${listIdx}-${i}`} className="min-w-[110px]">
                    <RetroStatBox {...stat} />
                  </div>
                ))}
              </div>
            ))}
          </animated.div>
        </div>

        {/* ─── Pending Queue Requests ─── */}
        {/* Pending Requests Section */}
      <PendingRequestsSection 
        requests={viewModel.pendingRequests} 
        totalCount={viewModel.pendingCount}
        onApprove={actions.approveRequest}
        onReject={actions.openRejectModal}
      />

      {/* ─── DASHBOARD WIDGETS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-7xl mx-auto mt-4 sm:mt-8 pb-8">
        <div className="lg:col-span-2">
          <RetroWidgetBox color="#00FFFF" label="คิวปัจจุบัน">
            <CurrentQueueWidget currentQueueNumber={viewModel.currentQueueNumber || 0} variant="retro" />
          </RetroWidgetBox>
        </div>
        <div className="lg:col-span-2">
          <RetroWidgetBox color="#FF00FF" label="ความเคลื่อนไหวล่าสุด" textColor="text-white">
            <RecentActivityLog recentActivity={viewModel.recentActivity} variant="retro" />
          </RetroWidgetBox>
        </div>
        <div className="lg:col-span-4">
          <RetroWidgetBox color="#39FF14" label="เมนูลัด">
            <QuickActionsWidget variant="retro" />
          </RetroWidgetBox>
        </div>
      </div>
      </div>
      
      {/* ─── Error Toast ─── */}
      {state.error && (
        <div className="fixed bottom-20 right-6 bg-red-600 text-white font-bold p-4 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] z-40 animate-bounce">
          <div className="flex items-center gap-4">
            <span className="text-2xl">ข้อผิดพลาด</span>
            <span className="text-sm uppercase tracking-wider">{state.error}</span>
            <button onClick={() => actions.setError(null)} className="ml-4 bg-black text-white px-2 border-2 border-white hover:bg-white hover:text-black">X</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Retro Stat Box ───
function RetroStatBox({ label, value, color, textColor = 'text-black' }: { label: string; value: number; color: string; textColor?: string }) {
  return (
    <div className={`border-[3px] sm:border-4 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)] py-1.5 px-2 sm:p-3 flex flex-col items-center justify-center transform hover:scale-105 transition-transform ${textColor}`} style={{ backgroundColor: color }}>
      <div className="text-2xl sm:text-4xl font-black tabular-nums leading-none mb-1 sm:mb-0">{value}</div>
      <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest sm:mt-1 bg-black text-white px-1 leading-none py-0.5">{label}</div>
    </div>
  );
}

function RetroWidgetBox({ children, color, label, textColor = 'text-black' }: { children: React.ReactNode; color: string; label: string; textColor?: string }) {
  return (
    <div className={`border-[3px] sm:border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-4 sm:p-5 flex flex-col h-full ${textColor}`} style={{ backgroundColor: color }}>
      <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-1 mb-4 self-start">{label}</div>
      <div className="flex-1 bg-white/20 p-2 sm:p-4 rounded border-2 border-black/20">
        {children}
      </div>
    </div>
  );
}
