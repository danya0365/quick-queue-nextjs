'use client';

import {
    QUEUE_STATUS_CONFIG,
    QueueItem,
    QueueStatus,
    SERVICE_TYPE_CONFIG,
} from '@/src/domain/types/queue';
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
import { useState } from 'react';

interface AdminViewProps {
  initialViewModel?: AdminViewModel;
}

export function AdminView({ initialViewModel }: AdminViewProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [state, actions] = useAdminPresenter(initialViewModel);
  const viewModel = state.viewModel;
  const [filter, setFilter] = useState<'all' | QueueStatus>('all');

  // ─── Auth Gate ───
  if (!isAuthenticated) {
    return <LoginGate onLogin={() => setIsAuthenticated(true)} />;
  }

  // ─── Loading ───
  if (state.loading && !viewModel) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted text-sm">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  const stats = viewModel?.stats;
  const items = viewModel?.items || [];
  const nextQ = viewModel?.nextQueueNumber || 1;

  // Filter items
  const filteredItems = filter === 'all'
    ? items
    : items.filter((i) => i.status === filter);

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
    <div className="h-full flex flex-col p-4 sm:p-6 gap-4 overflow-y-auto" id="admin-view">
      {/* ─── Header Row ─── */}
      <FadeInSection delay={0} direction="up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-foreground text-xl sm:text-2xl font-bold flex items-center gap-2">
              ⚙️ จัดการคิว
            </h1>
            <p className="text-muted text-sm mt-0.5">จัดการรายการคิวแบบเรียลไทม์</p>
          </div>
          <div className="flex items-center gap-2">
            <AnimatedButton
              variant="primary"
              size="md"
              onClick={actions.openCreateModal}
              icon={<span>➕</span>}
              id="add-queue-btn"
            >
              เพิ่มคิว
            </AnimatedButton>
            <AnimatedButton
              variant="ghost"
              size="md"
              onClick={() => setIsAuthenticated(false)}
              icon={<span>🚪</span>}
            >
              ออก
            </AnimatedButton>
          </div>
        </div>
      </FadeInSection>

      {/* ─── Stats ─── */}
      <FadeInSection delay={100} direction="up">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <GlassCard className="p-3" glowColor="rgba(124, 58, 237, 0.1)">
            <AnimatedCounter value={stats?.totalItems || 0} label="ทั้งหมด" icon={<span>📊</span>} color="text-primary" />
          </GlassCard>
          <GlassCard className="p-3" glowColor="rgba(245, 158, 11, 0.1)">
            <AnimatedCounter value={stats?.waitingItems || 0} label="รอคิว" icon={<span>⏳</span>} color="text-amber-500" />
          </GlassCard>
          <GlassCard className="p-3" glowColor="rgba(59, 130, 246, 0.1)">
            <AnimatedCounter value={stats?.inProgressItems || 0} label="กำลังบริการ" icon={<span>🔄</span>} color="text-blue-500" />
          </GlassCard>
          <GlassCard className="p-3" glowColor="rgba(16, 185, 129, 0.1)">
            <AnimatedCounter value={stats?.completedItems || 0} label="เสร็จแล้ว" icon={<span>✅</span>} color="text-emerald-500" />
          </GlassCard>
          <GlassCard className="p-3 hidden sm:block" glowColor="rgba(239, 68, 68, 0.1)">
            <AnimatedCounter value={stats?.cancelledItems || 0} label="ยกเลิก" icon={<span>❌</span>} color="text-red-500" />
          </GlassCard>
        </div>
      </FadeInSection>

      {/* ─── Filter Tabs ─── */}
      <FadeInSection delay={200} direction="up">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all' as const, label: 'ทั้งหมด', count: items.length },
            { key: QueueStatus.WAITING, label: '⏳ รอคิว', count: stats?.waitingItems || 0 },
            { key: QueueStatus.IN_PROGRESS, label: '🔄 กำลังบริการ', count: stats?.inProgressItems || 0 },
            { key: QueueStatus.COMPLETED, label: '✅ เสร็จ', count: stats?.completedItems || 0 },
            { key: QueueStatus.CANCELLED, label: '❌ ยกเลิก', count: stats?.cancelledItems || 0 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`
                flex items-center gap-1.5
                px-4 py-2 rounded-xl text-sm font-medium
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
          <div className="flex-1 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-muted font-medium">ไม่มีรายการ</p>
                <p className="text-muted-light text-sm mt-1">
                  {filter === 'all' ? 'เริ่มต้นด้วยการเพิ่มคิวใหม่' : 'ไม่มีรายการในหมวดนี้'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredItems.map((item, index) => {
                  const statusConfig = QUEUE_STATUS_CONFIG[item.status];
                  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];
                  const statusActions = getStatusActions(item);

                  return (
                    <div
                      key={item.id}
                      className="
                        flex items-center gap-3 sm:gap-4
                        px-4 sm:px-5 py-3
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
                        opacity-0 group-hover:opacity-100
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
    </div>
  );
}
