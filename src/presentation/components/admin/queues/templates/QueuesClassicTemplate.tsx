import { QUEUE_STATUS_CONFIG, QueueItem, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { ClearConfirmModal } from '@/src/presentation/components/admin/ClearConfirmModal';
import { CreateQueueModal } from '@/src/presentation/components/admin/CreateQueueModal';
import { DeleteConfirmModal } from '@/src/presentation/components/admin/DeleteConfirmModal';
import { CurrentQueueWidget } from '@/src/presentation/components/admin/widgets/CurrentQueueWidget';
import { FadeInSection } from '@/src/presentation/components/shared/FadeInSection';
import { GlassCard } from '@/src/presentation/components/shared/GlassCard';
import { QueueNumberBadge, StatusBadge } from '@/src/presentation/components/shared/StatusBadge';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { AlertTriangle, CheckCircle2, ClipboardList, Hourglass, RefreshCw, Trash2, XCircle } from 'lucide-react';

export interface QueuesClassicTemplateProps {
  state: AdminPresenterState;
  actions: AdminPresenterActions;
  generatePageNumbers: (current: number, total: number) => (number | '...')[];
  getStatusActions: (item: QueueItem) => { label: string; action: () => void; color: string }[];
}

export function QueuesClassicTemplate({
  state,
  actions,
  generatePageNumbers,
  getStatusActions,
}: QueuesClassicTemplateProps) {
  const viewModel = state.viewModel;
  if (!viewModel) return null;

  const filter = state.statusFilter;
  const stats = viewModel.stats;
  const items = viewModel.items || [];
  const nextQ = viewModel.nextQueueNumber || 1;
  const totalPages = viewModel.totalPages || 1;
  const currentPage = viewModel.currentPage || 1;
  const totalItems = viewModel.totalItems || 0;

  const selectedItem = state.selectedItemId
    ? items.find((i) => i.id === state.selectedItemId)
    : null;

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 gap-3 sm:gap-4 overflow-y-auto" id="admin-queues-classic-layout">
      
      {/* ─── Header Actions ─── */}
      <FadeInSection delay={100} direction="up" className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">จัดการคิว</h1>
        <div className="flex items-center gap-2">
            <button
              onClick={actions.openClearAllModal}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-lg sm:rounded-xl transition-all font-medium whitespace-nowrap"
            >
              รีเซ็ตคิวใหม่
            </button>
            <button
              onClick={actions.openCreateModal}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary text-white hover:bg-primary-dark rounded-lg sm:rounded-xl shadow-sm transition-all shadow-primary/20 font-medium flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>+</span> เพิ่มคิว
            </button>
        </div>
      </FadeInSection>

      {/* ─── Current Queue & Stats Widget ─── */}
      <FadeInSection delay={150} direction="up">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <GlassCard className="p-4 md:col-span-2 min-h-[160px]" glowColor="rgba(16, 185, 129, 0.05)">
            <CurrentQueueWidget currentQueueNumber={viewModel.currentQueueNumber || 0} variant="classic" />
          </GlassCard>
          
          <div className="grid grid-cols-2 md:col-span-2 gap-2 sm:gap-3">
             <GlassCard className="p-3 sm:p-4 flex flex-col justify-center" glowColor="rgba(124, 58, 237, 0.1)">
               <div className="text-xs sm:text-sm font-semibold opacity-70 uppercase tracking-wider mb-1">คิวทั้งหมดวันนี้</div>
               <div className="text-2xl sm:text-4xl font-black text-primary">{stats?.totalItems || 0}</div>
             </GlassCard>
             <GlassCard className="p-3 sm:p-4 flex flex-col justify-center" glowColor="rgba(245, 158, 11, 0.1)">
               <div className="text-xs sm:text-sm font-semibold opacity-70 uppercase tracking-wider mb-1">กำลังรอคิว</div>
               <div className="text-2xl sm:text-4xl font-black text-amber-500">{stats?.waitingItems || 0}</div>
             </GlassCard>
             <GlassCard className="p-3 sm:p-4 flex flex-col justify-center" glowColor="rgba(16, 185, 129, 0.1)">
               <div className="text-xs sm:text-sm font-semibold opacity-70 uppercase tracking-wider mb-1">ให้บริการเสร็จสิ้น</div>
               <div className="text-2xl sm:text-4xl font-black text-emerald-500">{stats?.completedItems || 0}</div>
             </GlassCard>
             <GlassCard className="p-3 sm:p-4 flex flex-col justify-center" glowColor="rgba(239, 68, 68, 0.1)">
               <div className="text-xs sm:text-sm font-semibold opacity-70 uppercase tracking-wider mb-1">ยกเลิกแล้ว</div>
               <div className="text-2xl sm:text-4xl font-black text-red-500">{stats?.cancelledItems || 0}</div>
             </GlassCard>
          </div>
        </div>
      </FadeInSection>

      {/* ─── Filter Tabs ─── */}
      <FadeInSection delay={200} direction="up">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'ทั้งหมด', count: stats?.totalItems || 0 },
            { key: QueueStatus.WAITING, label: <span className="flex items-center gap-1"><Hourglass className="w-3.5 h-3.5" /> รอคิว</span>, count: stats?.waitingItems || 0 },
            { key: QueueStatus.IN_PROGRESS, label: <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> กำลังบริการ</span>, count: stats?.inProgressItems || 0 },
            { key: QueueStatus.COMPLETED, label: <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> เสร็จ</span>, count: stats?.completedItems || 0 },
            { key: QueueStatus.CANCELLED, label: <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> ยกเลิก</span>, count: stats?.cancelledItems || 0 },
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
                    <span key={`dots-${i}`} className="px-1 text-xs text-muted">...</span>
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
                <div className="mb-3 text-muted flex justify-center"><ClipboardList className="w-12 h-12" /></div>
                <p className="text-muted font-medium">ไม่มีรายการ</p>
                <p className="text-muted-light text-sm mt-1">
                  {filter === 'all' ? 'เริ่มต้นด้วยการเพิ่มคิวใหม่' : 'ไม่มีรายการในหมวดนี้'}
              </p>
            </div>
            ) : (
            <>
              <div className="divide-y divide-border">
                {items.map((item) => {
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
                          <Trash2 className="w-4 h-4" />
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
            <AlertTriangle className="w-4 h-4 shrink-0" />
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
