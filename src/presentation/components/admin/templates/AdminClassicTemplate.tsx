import { PendingRequestsSection } from '@/src/presentation/components/admin/PendingRequestsSection';
import { AnimatedCounter } from '@/src/presentation/components/shared/AnimatedCounter';
import { FadeInSection } from '@/src/presentation/components/shared/FadeInSection';
import { GlassCard } from '@/src/presentation/components/shared/GlassCard';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';

// Widgets
import { CurrentQueueWidget } from '@/src/presentation/components/admin/widgets/CurrentQueueWidget';
import { QuickActionsWidget } from '@/src/presentation/components/admin/widgets/QuickActionsWidget';
import { RecentActivityLog } from '@/src/presentation/components/admin/widgets/RecentActivityLog';
import { BarChart2, CheckCircle2, Hourglass, RefreshCw, XCircle } from 'lucide-react';

export interface AdminClassicTemplateProps {
  state: AdminPresenterState;
  actions: AdminPresenterActions;
}

export function AdminClassicTemplate({
  state,
  actions,
}: AdminClassicTemplateProps) {
  const viewModel = state.viewModel;
  if (!viewModel) return null;

  const stats = viewModel.stats;
  const pendingRequests = viewModel.pendingRequests || [];

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 gap-3 sm:gap-4 overflow-y-auto" id="admin-classic-layout">
      <FadeInSection delay={100} direction="up">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          <GlassCard className="p-2 sm:p-3" glowColor="rgba(124, 58, 237, 0.1)">
            <AnimatedCounter value={stats?.totalItems || 0} label="ทั้งหมด" icon={<BarChart2 className="w-5 h-5 sm:w-6 sm:h-6" />} color="text-primary" />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3" glowColor="rgba(245, 158, 11, 0.1)">
            <AnimatedCounter value={stats?.waitingItems || 0} label="รอคิว" icon={<Hourglass className="w-5 h-5 sm:w-6 sm:h-6" />} color="text-amber-500" />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3" glowColor="rgba(59, 130, 246, 0.1)">
            <AnimatedCounter value={stats?.inProgressItems || 0} label="กำลังบริการ" icon={<RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />} color="text-blue-500" />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3" glowColor="rgba(16, 185, 129, 0.1)">
            <AnimatedCounter value={stats?.completedItems || 0} label="เสร็จแล้ว" icon={<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />} color="text-emerald-500" />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3 hidden sm:block" glowColor="rgba(239, 68, 68, 0.1)">
            <AnimatedCounter value={stats?.cancelledItems || 0} label="ยกเลิก" icon={<XCircle className="w-5 h-5 sm:w-6 sm:h-6" />} color="text-red-500" />
          </GlassCard>
        </div>
      </FadeInSection>

      {/* ─── Pending Queue Requests ─── */}
      {pendingRequests.length > 0 && (
        <FadeInSection delay={150} direction="up">
          <PendingRequestsSection
            requests={pendingRequests}
            totalCount={viewModel.pendingCount}
            onApprove={actions.approveRequest}
            onReject={actions.openRejectModal}
          />
        </FadeInSection>
      )}

      {/* ─── Dashboard Widgets ─── */}
      <FadeInSection delay={200} direction="up" className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 h-full min-h-[220px]">
          <GlassCard className="p-4 md:col-span-2 lg:col-span-1" glowColor="rgba(16, 185, 129, 0.05)">
            <CurrentQueueWidget currentQueueNumber={viewModel.currentQueueNumber || 0} variant="classic" />
          </GlassCard>
          
          <GlassCard className="p-4 md:col-span-2 lg:col-span-1" glowColor="rgba(245, 158, 11, 0.05)">
            <QuickActionsWidget />
          </GlassCard>

          <GlassCard className="p-4 overflow-hidden md:col-span-2 lg:col-span-2" glowColor="rgba(16, 185, 129, 0.05)">
            <RecentActivityLog recentActivity={viewModel.recentActivity} />
          </GlassCard>
        </div>
      </FadeInSection>
    </div>
  );
}
