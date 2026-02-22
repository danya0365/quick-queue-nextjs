'use client';

import { QueueItem, QueueStatus } from '@/src/domain/types/queue';
import { QueuesClassicTemplate } from '@/src/presentation/components/admin/queues/templates/QueuesClassicTemplate';
import { QueuesEditorialTemplate } from '@/src/presentation/components/admin/queues/templates/QueuesEditorialTemplate';
import { QueuesRetroTechMagazineTemplate } from '@/src/presentation/components/admin/queues/templates/QueuesRetroTechMagazineTemplate';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { AdminViewModel } from '@/src/presentation/presenters/admin/AdminPresenter';
import { useAdminPresenter } from '@/src/presentation/presenters/admin/useAdminPresenter';

export interface QueuesViewProps {
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

export function QueuesView({ initialViewModel }: QueuesViewProps) {
  const [state, actions] = useAdminPresenter(initialViewModel, 'queues');
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
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full p-4 font-sans space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="text-muted font-medium animate-pulse">กำลังโหลดข้อมูลคิว...</div>
      </div>
    );
  }

  // Common Props for template injection
  const sharedProps = {
    state,
    actions,
    generatePageNumbers,
    getStatusActions,
  };

  if (template === 'retroTechMagazine') {
    return <QueuesRetroTechMagazineTemplate {...sharedProps} />;
  }

  if (template === 'editorial') {
    return <QueuesEditorialTemplate {...sharedProps} />;
  }

  return <QueuesClassicTemplate {...sharedProps} />;
}
