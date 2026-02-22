'use client';

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

export function AdminView({ initialViewModel }: AdminViewProps) {
  const [state, actions] = useAdminPresenter(initialViewModel, 'dashboard');
  const viewModel = state.viewModel;
  const { template } = useTemplate();



  // ─── Loading ───
  if (state.loading && !viewModel) {
    return <AdminSkeleton />;
  }

  if (!viewModel) return null;

  const layoutProps = {
    state,
    actions,
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

