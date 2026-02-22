'use client';

import { AdminSkeleton } from '@/src/presentation/components/admin/AdminSkeleton';
import { RejectReasonModal } from '@/src/presentation/components/admin/PendingRequestsSection';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { usePendingRequestsPresenter } from '@/src/presentation/presenters/admin/usePendingRequestsPresenter';
import { useEffect } from 'react';

// Templates
import { PendingRequestsClassicTemplate } from '@/src/presentation/components/admin/templates/PendingRequestsClassicTemplate';
import { PendingRequestsEditorialTemplate } from '@/src/presentation/components/admin/templates/PendingRequestsEditorialTemplate';
import { PendingRequestsRetroTechMagazineTemplate } from '@/src/presentation/components/admin/templates/PendingRequestsRetroTechMagazineTemplate';

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

export function PendingRequestsView() {
  const [state, actions] = usePendingRequestsPresenter();
  const viewModel = state.viewModel;
  const { template } = useTemplate();

  // Load data
  useEffect(() => {
    actions.loadData(1, 10);
  }, []);



  // Loading
  if (state.loading && viewModel.requests.length === 0) {
    return <AdminSkeleton />;
  }

  const layoutProps = {
    state,
    actions,
    generatePageNumbers,
  };

  return (
    <>
      {template === 'retroTechMagazine' && (
        <PendingRequestsRetroTechMagazineTemplate {...layoutProps} />
      )}
      {template === 'editorial' && (
        <PendingRequestsEditorialTemplate {...layoutProps} />
      )}
      {template === 'classic' && (
        <PendingRequestsClassicTemplate {...layoutProps} />
      )}

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
