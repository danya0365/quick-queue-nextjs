import { PendingRequestsSection } from '@/src/presentation/components/admin/PendingRequestsSection';
import { AnimatedCounter } from '@/src/presentation/components/shared/AnimatedCounter';
import { FadeInSection } from '@/src/presentation/components/shared/FadeInSection';
import { GlassCard } from '@/src/presentation/components/shared/GlassCard';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';

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
            <AnimatedCounter value={stats?.totalItems || 0} label="ทั้งหมด" icon={<span>📊</span>} color="text-primary" />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3" glowColor="rgba(245, 158, 11, 0.1)">
            <AnimatedCounter value={stats?.waitingItems || 0} label="รอคิว" icon={<span>⏳</span>} color="text-amber-500" />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3" glowColor="rgba(59, 130, 246, 0.1)">
            <AnimatedCounter value={stats?.inProgressItems || 0} label="กำลังบริการ" icon={<span>🔄</span>} color="text-blue-500" />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3" glowColor="rgba(16, 185, 129, 0.1)">
            <AnimatedCounter value={stats?.completedItems || 0} label="เสร็จแล้ว" icon={<span>✅</span>} color="text-emerald-500" />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3 hidden sm:block" glowColor="rgba(239, 68, 68, 0.1)">
            <AnimatedCounter value={stats?.cancelledItems || 0} label="ยกเลิก" icon={<span>❌</span>} color="text-red-500" />
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
    </div>
  );
}
