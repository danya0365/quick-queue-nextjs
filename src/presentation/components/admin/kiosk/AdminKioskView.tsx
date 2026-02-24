'use client';

import { QueueItem, QueueRequest } from '@/src/domain/types/queue';
import { useAdminLayoutPresenter } from '@/src/presentation/presenters/admin/useAdminLayoutPresenter';
import { useAdminPresenter } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { AdminKioskClassicTemplate } from './templates/AdminKioskClassicTemplate';
import { AdminKioskEditorialTemplate } from './templates/AdminKioskEditorialTemplate';
import { AdminKioskRetroTechMagazineTemplate } from './templates/AdminKioskRetroTechMagazineTemplate';

export interface KioskViewModel {
  /** All in_progress items sorted by updatedAt desc (latest first) */
  servingItems: QueueItem[];
  /** The latest serving item (hero) — first in servingItems */
  latestServingItem: QueueItem | null;
  /** The next waiting item to be called */
  nextUpItem: QueueItem | null;
  /** Total waiting count */
  waitingCount: number;
  /** Pending queue requests */
  pendingRequests: QueueRequest[];
  pendingCount: number;
  /** Stats */
  stats: {
    total: number;
    waiting: number;
    serving: number;
    completed: number;
    cancelled: number;
  };
}

export function AdminKioskView() {
  const [state, actions] = useAdminPresenter(undefined, 'queues');
  const [layoutState] = useAdminLayoutPresenter();

  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-sans space-y-4">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-medium animate-pulse">กำลังโหลดระบบ Kiosk...</div>
      </div>
    );
  }

  if (!viewModel) return null;

  // Build kiosk-specific view model using pre-fetched sorted items
  const inProgressItems = viewModel.inProgressItems;
  const waitingItems = viewModel.waitingItems;

  const kioskViewModel: KioskViewModel = {
    servingItems: inProgressItems,
    latestServingItem: inProgressItems.length > 0 ? inProgressItems[0] : null,
    nextUpItem: waitingItems.length > 0 ? waitingItems[0] : null,
    waitingCount: viewModel.stats?.waitingItems || waitingItems.length,
    pendingRequests: viewModel.pendingRequests || [],
    pendingCount: viewModel.pendingCount || 0,
    stats: {
      total: viewModel.stats?.totalItems || 0,
      waiting: viewModel.stats?.waitingItems || 0,
      serving: viewModel.stats?.inProgressItems || 0,
      completed: viewModel.stats?.completedItems || 0,
      cancelled: viewModel.stats?.cancelledItems || 0,
    },
  };

  const templateProps = {
    kioskViewModel,
    state,
    actions,
  };

  switch (layoutState.template) {
    case 'retroTechMagazine':
      return <AdminKioskRetroTechMagazineTemplate {...templateProps} />;
    case 'editorial':
      return <AdminKioskEditorialTemplate {...templateProps} />;
    case 'classic':
    default:
      return <AdminKioskClassicTemplate {...templateProps} />;
  }
}
