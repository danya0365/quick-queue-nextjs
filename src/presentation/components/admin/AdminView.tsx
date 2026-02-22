'use client';

import { QueueItem, QueueStatus } from '@/src/domain/types/queue';
import { AdminSkeleton } from '@/src/presentation/components/admin/AdminSkeleton';
import { PendingRequestsSection, RejectReasonModal } from '@/src/presentation/components/admin/PendingRequestsSection';
import { AdminClassicTemplate } from '@/src/presentation/components/admin/templates/AdminClassicTemplate';
import { AdminEditorialTemplate } from '@/src/presentation/components/admin/templates/AdminEditorialTemplate';
import { AdminRetroTechMagazineTemplate } from '@/src/presentation/components/admin/templates/AdminRetroTechMagazineTemplate';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { AdminViewModel } from '@/src/presentation/presenters/admin/AdminPresenter';
import { useAdminPresenter } from '@/src/presentation/presenters/admin/useAdminPresenter';

interface AdminViewProps {
  initialViewModel?: AdminViewModel;
}

/**
 * Generate page numbers with ellipsis for pagination
 * Example: [1, 2, '...', 48, 49, 50] or [1, '...', 5, 6, 7, '...', 50]
 */
function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) pages.push('...');

  // Show pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  // Always show last page
  if (total > 1) pages.push(total);

  return pages;
}

export function AdminView({ initialViewModel }: AdminViewProps) {
  const [state, actions] = useAdminPresenter(initialViewModel);
  const viewModel = state.viewModel;
  const { template } = useTemplate();

  // Status actions for an item
  const getStatusActions = (item: QueueItem) => {
    switch (item.status) {
      case QueueStatus.WAITING:
        return [
          { label: 'เริ่มให้บริการ', action: () => actions.markInProgress(item.id), color: 'text-blue-500' },
          { label: 'ยกเลิก', action: () => actions.markCancelled(item.id), color: 'text-red-500' },
        ];
      case QueueStatus.IN_PROGRESS:
        return [
          { label: 'เสร็จสิ้น', action: () => actions.markCompleted(item.id), color: 'text-emerald-500' },
          { label: 'ยกเลิก', action: () => actions.markCancelled(item.id), color: 'text-red-500' },
        ];
      default:
        return [];
    }
  };



  // ─── Loading ───
  if (state.loading && !viewModel) {
    return <AdminSkeleton />;
  }

  if (!viewModel) return null;

  const layoutProps = {
    state,
    actions,
    generatePageNumbers,
    getStatusActions,
  };

  const pendingRequests = viewModel.pendingRequests || [];

  return (
    <>
      {template === 'retroTechMagazine' && (
        <AdminRetroTechMagazineTemplate {...layoutProps} />
      )}
      {template === 'editorial' && (
        <AdminEditorialTemplate {...layoutProps} />
      )}
      {template === 'classic' && (
        <AdminClassicTemplate {...layoutProps} />
      )}

      {/* Reject Reason Modal */}
      <RejectReasonModal
        isOpen={state.isRejectModalOpen}
        onClose={actions.closeRejectModal}
        onReject={(reason) => {
          if (state.selectedRequestId) {
            actions.rejectRequest(state.selectedRequestId, reason);
          }
        }}
      />
    </>
  );
}

// Re-export for use in templates
export { PendingRequestsSection };

