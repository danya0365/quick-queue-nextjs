import { QueueItem, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { ClearConfirmModal } from '@/src/presentation/components/admin/ClearConfirmModal';
import { CreateQueueModal } from '@/src/presentation/components/admin/CreateQueueModal';
import { DeleteConfirmModal } from '@/src/presentation/components/admin/DeleteConfirmModal';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';

export interface AdminEditorialTemplateProps {
  state: AdminPresenterState;
  actions: AdminPresenterActions;
  handleLogout: () => Promise<void>;
  generatePageNumbers: (current: number, total: number) => (number | '...')[];
  getStatusActions: (item: QueueItem) => { label: string; action: () => void; color: string }[];
}

export function AdminEditorialTemplate({
  state,
  actions,
  handleLogout,
  generatePageNumbers,
  getStatusActions,
}: AdminEditorialTemplateProps) {
  const { template } = useTemplate();
  const viewModel = state.viewModel;
  const isEditorial = template === 'editorial';

  const filter = state.statusFilter;
  const stats = viewModel?.stats;
  const items = viewModel?.items || [];
  const nextQ = viewModel?.nextQueueNumber || 1;
  const totalPages = viewModel?.totalPages || 1;
  const currentPage = viewModel?.currentPage || 1;
  const totalItems = viewModel?.totalItems || 0;

  const selectedItem = state.selectedItemId ? items.find((i) => i.id === state.selectedItemId) : null;

  // Status mapping to Editorial visual presentation
  const getStatusBadge = (status: QueueStatus) => {
    switch (status) {
      case QueueStatus.WAITING:
        return <span className="px-3 py-1 font-bold text-xs uppercase tracking-widest border-[3px] border-black bg-white text-black">WAITING</span>;
      case QueueStatus.IN_PROGRESS:
        return <span className="px-3 py-1 font-bold text-xs uppercase tracking-widest border-[3px] border-white bg-black text-white">SERVING</span>;
      case QueueStatus.COMPLETED:
        return <span className="px-3 py-1 font-bold text-xs uppercase tracking-widest border-[3px] border-gray-400 text-gray-400">DONE</span>;
      case QueueStatus.CANCELLED:
        return <span className="px-3 py-1 font-bold text-xs uppercase tracking-widest border-[3px] border-dashed border-black text-black opacity-50">VOID</span>;
    }
  };

  const tabs = [
    { key: 'all', label: 'ALL TICKETS', count: stats?.totalItems || 0 },
    { key: QueueStatus.WAITING, label: 'WAITING', count: stats?.waitingItems || 0 },
    { key: QueueStatus.IN_PROGRESS, label: 'SERVING', count: stats?.inProgressItems || 0 },
    { key: QueueStatus.COMPLETED, label: 'DONE', count: stats?.completedItems || 0 },
    { key: QueueStatus.CANCELLED, label: 'VOID', count: stats?.cancelledItems || 0 },
  ];

  if (!viewModel) return null;

  return (
    <div className="min-h-full font-serif bg-white text-black selection:bg-black selection:text-white pb-20">
      
      {/* ─── Editorial Sticky Action Bar ─── */}
      <div className="sticky top-0 z-40 bg-white border-b-[4px] sm:border-b-[8px] border-black px-4 sm:px-12 py-3 sm:py-4 flex flex-col lg:flex-row justify-between items-center gap-3 lg:gap-4">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter w-full lg:w-auto text-center lg:text-left">
          CONTROL<span className="bg-black text-white px-2 ml-1">PANEL</span>
        </h1>
        <div className="flex gap-2 sm:gap-4 items-center flex-wrap justify-center lg:justify-end w-full lg:w-auto">
          {state.loading && (
             <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-black text-white px-2 py-1 sm:px-3 sm:py-1 animate-pulse">
               SYNCING
             </span>
          )}
          <button
            onClick={() => actions.loadData()}
            className="w-8 h-8 sm:w-10 sm:h-10 border-[2px] sm:border-[4px] border-black flex items-center justify-center font-black hover:bg-black hover:text-white transition-colors text-sm sm:text-base"
            title="Refresh"
          >
            ↺
          </button>
          <button
            onClick={actions.openClearAllModal}
            className="flex-1 sm:flex-none px-2 py-2 sm:px-6 sm:py-2 bg-white text-red-600 border-[2px] sm:border-[4px] border-black font-black uppercase tracking-widest text-[10px] sm:text-sm hover:bg-red-600 hover:border-black hover:text-white transition-colors"
          >
            PURGE DB
          </button>
          <button
            onClick={actions.openCreateModal}
            className="flex-1 sm:flex-none px-2 py-2 sm:px-6 sm:py-2 bg-black text-white border-[2px] sm:border-[4px] border-black font-black uppercase tracking-widest text-[10px] sm:text-sm hover:bg-white hover:text-black transition-colors"
            id="add-queue-btn"
          >
            + ADD TICKET
          </button>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-2 py-2 sm:px-6 sm:py-2 bg-white text-black border-[2px] sm:border-[4px] border-black font-black uppercase tracking-widest text-[10px] sm:text-sm hover:bg-gray-100 transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 sm:p-12 space-y-6 sm:space-y-12">
        {/* ─── Error Banner ─── */}
        {state.error && (
          <div className="bg-black text-white border-[6px] border-black p-6 font-sans">
            <h3 className="font-black text-xl uppercase tracking-widest mb-2 border-b-[4px] border-white pb-2 inline-block">SYSTEM ERROR</h3>
            <p className="font-bold">{state.error}</p>
          </div>
        )}

        {/* ─── STATS ─── */}
        <section className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 font-sans uppercase">
          <div className="border-[4px] sm:border-[6px] border-black p-3 sm:p-4 bg-white hover:bg-black hover:text-white transition-colors group cursor-default">
            <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">TOTAL</div>
            <div className="text-4xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.totalItems || 0}</div>
          </div>
          <div className="border-[4px] sm:border-[6px] border-black p-3 sm:p-4 bg-white hover:bg-black hover:text-white transition-colors group cursor-default">
            <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">WAITING</div>
            <div className="text-4xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.waitingItems || 0}</div>
          </div>
          <div className="border-[4px] sm:border-[6px] border-black p-3 sm:p-4 bg-black text-white hover:bg-white hover:text-black transition-colors group cursor-default">
            <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">SERVING</div>
            <div className="text-4xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.inProgressItems || 0}</div>
          </div>
          <div className="border-[4px] sm:border-[6px] border-black p-3 sm:p-4 bg-white hover:bg-black hover:text-white transition-colors group cursor-default">
            <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">DONE</div>
            <div className="text-4xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.completedItems || 0}</div>
          </div>
          <div className="border-[4px] sm:border-[6px] border-dashed border-black/50 p-3 sm:p-4 bg-white hover:border-solid hover:border-black hover:bg-black hover:text-white transition-colors group cursor-default hidden sm:block">
            <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">VOID</div>
            <div className="text-4xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2 text-black/50 group-hover:text-white">{stats?.cancelledItems || 0}</div>
          </div>
        </section>

        {/* ─── Filter Tabs ─── */}
        <section className="flex flex-wrap gap-2 font-sans overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => actions.setStatusFilter(tab.key)}
              className={`
                px-4 py-2 sm:px-6 sm:py-3 font-black uppercase tracking-widest text-[10px] sm:text-sm border-[3px] sm:border-[4px] border-black transition-colors whitespace-nowrap flex items-center
                ${filter === tab.key ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}
              `}
            >
              {tab.label} <span className="ml-2 px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-current text-current font-bold mix-blend-difference border-[2px] border-current leading-none">{tab.count}</span>
            </button>
          ))}
        </section>

        {/* ─── The Data ─── */}
        <section className="border-[6px] border-black bg-white font-sans overflow-x-auto relative">
          <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 font-black text-xs uppercase tracking-widest z-10">
             PAGE {currentPage} OF {totalPages}
          </div>
          <table className="w-full text-left font-bold border-collapse">
            <thead className="bg-black text-white text-xs uppercase tracking-widest">
              <tr>
                <th className="p-4 border-b-[4px] border-black border-l-[4px] w-24">NO.</th>
                <th className="p-4 border-b-[4px] border-black border-l-[4px]">IDENTITY</th>
                <th className="p-4 border-b-[4px] border-black border-l-[4px]">INFO</th>
                <th className="p-4 border-b-[4px] border-black border-l-[4px] w-32">STATUS</th>
                <th className="p-4 border-b-[4px] border-black border-l-[4px] w-48 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {items.map((item) => {
                 const statusActions = getStatusActions(item);
                 return (
                  <tr key={item.id} className="border-b-[4px] border-black hover:bg-gray-100 transition-colors last:border-b-0 group">
                    <td className="p-4 border-l-[4px] border-black font-black text-4xl tabular-nums tracking-tighter">
                      {item.queueNumber.toString().padStart(2, '0')}
                    </td>
                    <td className="p-4 border-l-[4px] border-black">
                      <div className="font-black uppercase text-xl leading-none mb-1">{item.customerName}</div>
                    </td>
                    <td className="p-4 border-l-[4px] border-black text-xs">
                       <span className="px-2 py-1 uppercase font-bold border-[2px] border-black tracking-widest inline-block mb-1">
                          {SERVICE_TYPE_CONFIG[item.serviceType].label}
                       </span>
                       {item.note && <div className="mt-1 opacity-70 border-l-[3px] border-black pl-2 leading-tight">{item.note}</div>}
                    </td>
                    <td className="p-4 border-l-[4px] border-black">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="p-4 border-l-[4px] border-black text-right">
                       <div className="flex justify-end gap-1 flex-wrap">
                          {statusActions.map((sa, i) => (
                            <button
                              key={i}
                              onClick={sa.action}
                              className={`
                                text-[10px] uppercase font-black tracking-widest px-3 py-2 border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors
                                ${sa.color.includes('emerald') ? 'bg-emerald-100 hover:border-emerald-500' : sa.color.includes('blue') ? 'bg-blue-100 hover:border-blue-500' : ''}
                              `}
                              title={sa.label}
                            >
                              {sa.label.includes('เริ่ม') ? 'START' : sa.label.includes('เสร็จ') ? 'DONE' : sa.label.includes('ยกเลิก') ? 'VOID' : sa.label}
                            </button>
                          ))}
                          <button
                            onClick={() => actions.openDeleteModal(item.id)}
                            className="text-[10px] uppercase font-black tracking-widest px-3 py-2 border-[3px] border-black bg-red-100 hover:bg-red-500 hover:text-white transition-colors text-red-600"
                            title="DELETE"
                          >
                            DEL
                          </button>
                       </div>
                    </td>
                  </tr>
                )
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-gray-400 font-black uppercase text-2xl border-l-[4px] border-black">
                    NO TICKETS FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Editorial Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 font-sans font-black tabular-nums">
            <button
              onClick={() => currentPage > 1 && actions.goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-12 h-12 border-[4px] border-black flex items-center justify-center disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
            >
              ←
            </button>
            
            {generatePageNumbers(currentPage, totalPages).map((page, i) => (
              <button
                key={i}
                onClick={() => typeof page === 'number' && actions.goToPage(page)}
                disabled={page === '...'}
                className={`w-12 h-12 border-[4px] flex items-center justify-center transition-colors ${
                  page === currentPage
                    ? 'bg-black text-white border-black'
                    : page === '...'
                    ? 'border-transparent text-gray-500 cursor-default'
                    : 'border-black bg-white hover:bg-gray-100 text-black'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => currentPage < totalPages && actions.goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-12 h-12 border-[4px] border-black flex items-center justify-center disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
            >
              →
            </button>
          </div>
        )}

      </div>

      {/* ─── Shared Modals ─── */}
      {state.isCreateModalOpen && (
        <CreateQueueModal
          isOpen={state.isCreateModalOpen}
          onClose={actions.closeCreateModal}
          onSubmit={actions.createQueueItem}
          nextQueueNumber={nextQ}
        />
      )}
      
      {state.isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={state.isDeleteModalOpen}
          onClose={actions.closeDeleteModal}
          onConfirm={async () => {
            if (state.selectedItemId) {
              await actions.deleteQueueItem(state.selectedItemId);
              actions.closeDeleteModal();
            }
          }}
          customerName={selectedItem?.customerName || ''}
          queueNumber={selectedItem?.queueNumber || 0}
        />
      )}

      {state.isClearAllModalOpen && (
        <ClearConfirmModal
          isOpen={state.isClearAllModalOpen}
          onClose={actions.closeClearAllModal}
          onConfirm={async () => {
            await actions.clearAllQueues();
            actions.closeClearAllModal();
          }}
        />
      )}

    </div>
  );
}
