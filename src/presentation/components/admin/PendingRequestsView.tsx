'use client';

import { AdminSkeleton } from '@/src/presentation/components/admin/AdminSkeleton';
import { LoginGate } from '@/src/presentation/components/admin/LoginGate';
import { RejectReasonModal } from '@/src/presentation/components/admin/PendingRequestsSection';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { usePendingRequestsPresenter } from '@/src/presentation/presenters/admin/usePendingRequestsPresenter';
import { useEffect, useState } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [state, actions] = usePendingRequestsPresenter();
  const viewModel = state.viewModel;
  const { template } = useTemplate();

  // Check auth and load data
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          setIsAuthenticated(true);
          await actions.loadData(1, 10);
        }
      } catch {
        // No session
      } finally {
        setAuthChecking(false);
      }
    }
    init();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  // Auth checking spinner
  if (authChecking) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted text-sm">ตรวจสอบเซสชัน...</p>
        </div>
      </div>
    );
  }

  // Auth Gate
  if (!isAuthenticated) {
    return <LoginGate onLogin={() => { setIsAuthenticated(true); actions.loadData(); }} />;
  }

  // Loading
  if (state.loading && viewModel.requests.length === 0) {
    return <AdminSkeleton />;
  }

  const layoutProps = {
    state,
    actions,
    handleLogout,
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
