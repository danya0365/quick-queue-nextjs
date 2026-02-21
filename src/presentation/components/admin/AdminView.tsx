'use client';

import { QueueItem, QueueStatus } from '@/src/domain/types/queue';
import { AdminSkeleton } from '@/src/presentation/components/admin/AdminSkeleton';
import { AdminClassicTemplate } from '@/src/presentation/components/admin/templates/AdminClassicTemplate';
import { AdminRetroTechMagazineTemplate } from '@/src/presentation/components/admin/templates/AdminRetroTechMagazineTemplate';
import { LoginGate } from '@/src/presentation/components/admin/LoginGate';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { AdminViewModel } from '@/src/presentation/presenters/admin/AdminPresenter';
import { useAdminPresenter } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { useEffect, useState } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [state, actions] = useAdminPresenter(initialViewModel);
  const viewModel = state.viewModel;
  const { template } = useTemplate();

  // ─── Check existing session on mount ───
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          setIsAuthenticated(true);
        }
      } catch {
        // No session
      } finally {
        setAuthChecking(false);
      }
    }
    checkSession();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  // Status actions for an item
  const getStatusActions = (item: QueueItem) => {
    switch (item.status) {
      case QueueStatus.WAITING:
        return [
          { label: '🔄 เริ่มให้บริการ', action: () => actions.markInProgress(item.id), color: 'text-blue-500' },
          { label: '❌ ยกเลิก', action: () => actions.markCancelled(item.id), color: 'text-red-500' },
        ];
      case QueueStatus.IN_PROGRESS:
        return [
          { label: '✅ เสร็จแล้ว', action: () => actions.markCompleted(item.id), color: 'text-emerald-500' },
          { label: '❌ ยกเลิก', action: () => actions.markCancelled(item.id), color: 'text-red-500' },
        ];
      default:
        return [];
    }
  };

  // ─── Auth checking spinner ───
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

  // ─── Auth Gate ───
  if (!isAuthenticated) {
    return <LoginGate onLogin={() => { setIsAuthenticated(true); actions.loadData(); }} />;
  }

  // ─── Loading ───
  if (state.loading && !viewModel) {
    return <AdminSkeleton />;
  }

  if (!viewModel) return null;

  const layoutProps = {
    state,
    actions,
    handleLogout,
    generatePageNumbers,
    getStatusActions,
  };

  return (
    <>
      {template === 'retroTechMagazine' ? (
        <AdminRetroTechMagazineTemplate {...layoutProps} />
      ) : (
        <AdminClassicTemplate {...layoutProps} />
      )}
    </>
  );
}
