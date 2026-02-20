'use client';

import {
  QUEUE_STATUS_CONFIG,
  QueueItem,
  QueueStatus,
  SERVICE_TYPE_CONFIG,
} from '@/src/domain/types/queue';
import { AdminSkeleton } from '@/src/presentation/components/admin/AdminSkeleton';
import { ClearConfirmModal } from '@/src/presentation/components/admin/ClearConfirmModal';
import { CreateQueueModal } from '@/src/presentation/components/admin/CreateQueueModal';
import { DeleteConfirmModal } from '@/src/presentation/components/admin/DeleteConfirmModal';
import { LoginGate } from '@/src/presentation/components/admin/LoginGate';
import { AnimatedButton } from '@/src/presentation/components/shared/AnimatedButton';
import { AnimatedCounter } from '@/src/presentation/components/shared/AnimatedCounter';
import { FadeInSection } from '@/src/presentation/components/shared/FadeInSection';
import { GlassCard } from '@/src/presentation/components/shared/GlassCard';
import { QueueNumberBadge, StatusBadge } from '@/src/presentation/components/shared/StatusBadge';
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
  const filter = state.statusFilter;

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

  const stats = viewModel?.stats;
  const items = viewModel?.items || [];
  const nextQ = viewModel?.nextQueueNumber || 1;
  const totalPages = viewModel?.totalPages || 1;
  const currentPage = viewModel?.currentPage || 1;
  const totalItems = viewModel?.totalItems || 0;

  // Find selected item for delete modal
  const selectedItem = state.selectedItemId
    ? items.find((i) => i.id === state.selectedItemId)
    : null;

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

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 gap-3 sm:gap-4 overflow-y-auto" id="admin-view">
      {/* ─── Header Row ─── */}
      <FadeInSection delay={0} direction="up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-foreground text-lg sm:text-2xl font-bold flex items-center gap-2">
              ⚙️ จัดการคิว
            </h1>
            <p className="text-muted text-xs sm:text-sm mt-0.5">จัดการรายการคิวแบบเรียลไทม์</p>
          </div>
          <div className="flex items-center gap-2">
            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={actions.openCreateModal}
              icon={<span>➕</span>}
              id="add-queue-btn"
            >
              เพิ่มคิว
            </AnimatedButton>
            <button
              onClick={actions.openClearAllModal}
              title="ล้างคิวทั้งหมด"
              className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 text-sm font-medium transition-all duration-200"
            >
              ล้างคิว
            </button>
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              icon={<span>🚪</span>}
            >
              ออก
            </AnimatedButton>
          </div>
        </div>
      </FadeInSection>

      {/* ─── Stats ─── */}
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

      {/* ─── Filter Tabs ─── */}
      <FadeInSection delay={200} direction="up">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'ทั้งหมด', count: stats?.totalItems || 0 },
            { key: QueueStatus.WAITING, label: '⏳ รอคิว', count: stats?.waitingItems || 0 },
            { key: QueueStatus.IN_PROGRESS, label: '🔄 กำลังบริการ', count: stats?.inProgressItems || 0 },
            { key: QueueStatus.COMPLETED, label: '✅ เสร็จ', count: stats?.completedItems || 0 },
            { key: QueueStatus.CANCELLED, label: '❌ ยกเลิก', count: stats?.cancelledItems || 0 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => actions.setStatusFilter(tab.key)}
              className={`
                flex items-center gap-1
                px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium
                whitespace-nowrap
                border transition-all duration-200
                ${
                  filter === tab.key
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-surface-alt border-border text-muted hover:text-foreground'
                }
              `}
            >
              {tab.label}
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full
                ${filter === tab.key ? 'bg-primary/20' : 'bg-surface-alt'}
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </FadeInSection>

      {/* ─── Queue Table ─── */}
      <FadeInSection delay={300} direction="up" className="flex-1 min-h-0">
        <GlassCard className="h-full flex flex-col overflow-hidden">
          {/* Pagination Header */}
          <div className="flex items-center justify-between px-3 sm:px-5 py-2 border-b border-border">
            <span className="text-xs text-muted">
              แสดง {items.length} จาก {totalItems} รายการ (หน้า {currentPage}/{totalPages})
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => actions.goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-2 py-1 text-xs rounded-md border border-border disabled:opacity-30 hover:bg-surface-alt transition-colors"
                >
                  ‹ ก่อน
                </button>
                {generatePageNumbers(currentPage, totalPages).map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="px-1 text-xs text-muted">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => actions.goToPage(p as number)}
                      className={`
                        w-7 h-7 text-xs rounded-md border transition-colors
                        ${currentPage === p
                          ? 'bg-primary/15 border-primary text-primary font-semibold'
                          : 'border-border hover:bg-surface-alt text-muted'
                        }
                      `}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => actions.goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-2 py-1 text-xs rounded-md border border-border disabled:opacity-30 hover:bg-surface-alt transition-colors"
                >
                  ถัดไป ›
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-muted font-medium">ไม่มีรายการ</p>
                <p className="text-muted-light text-sm mt-1">
                  {filter === 'all' ? 'เริ่มต้นด้วยการเพิ่มคิวใหม่' : 'ไม่มีรายการในหมวดนี้'}
              </p>
            </div>
            ) : (
            <>
              <div className="divide-y divide-border">
                {items.map((item, index) => {
                  const statusConfig = QUEUE_STATUS_CONFIG[item.status];
                  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];
                  const statusActions = getStatusActions(item);

                  return (
                    <div
                      key={item.id}
                      className="
                        flex items-center gap-2 sm:gap-4
                        px-2.5 sm:px-5 py-2 sm:py-3
                        hover:bg-surface-alt/50
                        transition-colors duration-150
                        group
                      "
                    >
                      {/* Queue Number */}
                      <QueueNumberBadge
                        number={item.queueNumber}
                        size="sm"
                        variant={
                          item.status === QueueStatus.IN_PROGRESS
                            ? 'active'
                            : item.status === QueueStatus.COMPLETED
                              ? 'completed'
                              : 'default'
                        }
                      />

                      {/* Customer Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-foreground font-medium text-sm">
                            {item.customerName}
                          </span>
                          <StatusBadge
                            label={serviceConfig.label}
                            icon={serviceConfig.icon}
                            colorClass={serviceConfig.color}
                            bgClass={serviceConfig.bgColor}
                          />
                        </div>
                        {item.note && (
                          <p className="text-muted text-xs mt-0.5 truncate">{item.note}</p>
                        )}
                      </div>

                      {/* Status Badge */}
                      <StatusBadge
                        label={statusConfig.label}
                        icon={statusConfig.icon}
                        colorClass={statusConfig.color}
                        bgClass={statusConfig.bgColor}
                        pulsing={item.status === QueueStatus.IN_PROGRESS}
                      />

                      {/* Actions */}
                      <div className="
                        flex items-center gap-1
                        sm:opacity-0 sm:group-hover:opacity-100
                        transition-opacity duration-200
                      ">
                        {statusActions.map((sa, i) => (
                          <button
                            key={i}
                            onClick={sa.action}
                            className={`
                              text-xs px-2.5 py-1.5 rounded-lg
                              bg-surface-alt border border-border
                              hover:border-primary/30
                              ${sa.color}
                              transition-all duration-200
                              whitespace-nowrap
                            `}
                            title={sa.label}
                          >
                            {sa.label}
                          </button>
                        ))}
                        <button
                          onClick={() => actions.openDeleteModal(item.id)}
                          className="
                            text-xs px-2.5 py-1.5 rounded-lg
                            bg-surface-alt border border-border
                            hover:border-red-500/30
                            text-red-500
                            transition-all duration-200
                          "
                          title="ลบ"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Pagination (mobile-friendly) */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 py-3 border-t border-border">
                  <button
                    onClick={() => actions.goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1.5 text-xs rounded-lg border border-border disabled:opacity-30 hover:bg-surface-alt transition-colors"
                  >
                    ‹ ก่อน
                  </button>
                  <span className="text-xs text-muted px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => actions.goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1.5 text-xs rounded-lg border border-border disabled:opacity-30 hover:bg-surface-alt transition-colors"
                  >
                    ถัดไป ›
                  </button>
                </div>
              )}
            </>
            )}
          </div>
        </GlassCard>
      </FadeInSection>

      {/* ─── Error Toast ─── */}
      {state.error && (
        <div className="fixed bottom-20 right-6 bg-red-500 text-white px-5 py-3 rounded-xl shadow-lg z-40 animate-slide-up">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span className="text-sm">{state.error}</span>
            <button onClick={() => actions.setError(null)} className="ml-2 hover:opacity-80">✕</button>
          </div>
        </div>
      )}

      {/* ─── Modals ─── */}
      <CreateQueueModal
        isOpen={state.isCreateModalOpen}
        onClose={actions.closeCreateModal}
        onSubmit={actions.createQueueItem}
        nextQueueNumber={nextQ}
      />

      <DeleteConfirmModal
        isOpen={state.isDeleteModalOpen}
        onClose={actions.closeDeleteModal}
        onConfirm={async () => {
          if (state.selectedItemId) {
            await actions.deleteQueueItem(state.selectedItemId);
          }
        }}
        customerName={selectedItem?.customerName || ''}
        queueNumber={selectedItem?.queueNumber || 0}
      />

      <ClearConfirmModal
        isOpen={state.isClearAllModalOpen}
        onClose={actions.closeClearAllModal}
        onConfirm={async () => {
          await actions.clearAllQueues();
        }}
      />
    </div>
  );
}
