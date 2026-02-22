import { PendingRequestsSection } from '@/src/presentation/components/admin/PendingRequestsSection';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';

// Widgets
import { PerformanceInsightsWidget } from '@/src/presentation/components/admin/widgets/PerformanceInsightsWidget';
import { QuickActionsWidget } from '@/src/presentation/components/admin/widgets/QuickActionsWidget';
import { RecentActivityLog } from '@/src/presentation/components/admin/widgets/RecentActivityLog';
import { ServiceTypeBreakdown } from '@/src/presentation/components/admin/widgets/ServiceTypeBreakdown';

export interface AdminEditorialTemplateProps {
  state: AdminPresenterState;
  actions: AdminPresenterActions;
}

export function AdminEditorialTemplate({
  state,
  actions,
}: AdminEditorialTemplateProps) {
  const viewModel = state.viewModel;
  if (!viewModel) return null;
  const stats = viewModel.stats;

  return (
    <div className="min-h-full font-serif bg-white text-black selection:bg-black selection:text-white pb-20">

      <div className="max-w-[1400px] mx-auto p-4 sm:p-8 space-y-4 sm:space-y-8">
        {/* ─── Error Banner ─── */}
        {state.error && (
          <div className="bg-black text-white border-[6px] border-black p-6 font-sans">
            <h3 className="font-black text-xl uppercase tracking-widest mb-2 border-b-[4px] border-white pb-2 inline-block">เกิดข้อผิดพลาด</h3>
            <p className="font-bold">{state.error}</p>
          </div>
        )}

        {/* ─── Pending Queue Requests ─── */}
        <PendingRequestsSection 
          requests={viewModel.pendingRequests} 
          totalCount={viewModel.pendingCount}
          onApprove={actions.approveRequest}
          onReject={actions.openRejectModal}
        />
        {/* ─── STATS ─── */}
        <section className="font-sans uppercase">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
            <div className="col-span-2 sm:col-span-1 border-[3px] sm:border-[6px] border-black p-3 sm:p-4 bg-white hover:bg-black hover:text-white transition-colors group cursor-default">
              <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">รวม</div>
              <div className="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.totalItems || 0}</div>
            </div>
            <div className="border-[3px] sm:border-[6px] border-black p-3 sm:p-4 bg-white hover:bg-black hover:text-white transition-colors group cursor-default">
              <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">รอคิว</div>
              <div className="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.waitingItems || 0}</div>
            </div>
            <div className="border-[3px] sm:border-[6px] border-black p-3 sm:p-4 bg-black text-white hover:bg-white hover:text-black transition-colors group cursor-default">
              <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">กำลังเรียก</div>
              <div className="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.inProgressItems || 0}</div>
            </div>
            <div className="border-[3px] sm:border-[6px] border-black p-3 sm:p-4 bg-white hover:bg-black hover:text-white transition-colors group cursor-default">
              <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">เสร็จสิ้น</div>
              <div className="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.completedItems || 0}</div>
            </div>
            <div className="border-[3px] sm:border-[6px] border-dashed border-black/50 p-3 sm:p-4 bg-white hover:border-solid hover:border-black hover:bg-black hover:text-white transition-colors group cursor-default">
              <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">ยกเลิก</div>
              <div className="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2 text-black/50 group-hover:text-white">{stats?.cancelledItems || 0}</div>
            </div>
          </div>
        </section>

        {/* ─── DASHBOARD WIDGETS ─── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="border-[3px] sm:border-[6px] border-black p-4 sm:p-6 bg-white min-h-[220px]">
            <ServiceTypeBreakdown stats={stats} variant="editorial" />
          </div>
          <div className="border-[3px] sm:border-[6px] border-black p-4 sm:p-6 bg-white min-h-[220px]">
            <PerformanceInsightsWidget performance={viewModel.performance} variant="editorial" />
          </div>
          <div className="border-[3px] sm:border-[6px] border-black p-4 sm:p-6 bg-white min-h-[220px] overflow-hidden lg:col-span-2">
            <RecentActivityLog recentActivity={viewModel.recentActivity} variant="editorial" />
          </div>
          <div className="border-[3px] sm:border-[6px] border-black p-4 sm:p-6 bg-white min-h-[220px] lg:col-span-4">
            <QuickActionsWidget variant="editorial" />
          </div>
        </section>

      </div>



    </div>
  );
}
