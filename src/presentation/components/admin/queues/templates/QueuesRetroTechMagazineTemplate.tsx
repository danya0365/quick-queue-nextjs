import { QUEUE_STATUS_CONFIG, QueueItem, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { ClearConfirmModal } from '@/src/presentation/components/admin/ClearConfirmModal';
import { CreateQueueModal } from '@/src/presentation/components/admin/CreateQueueModal';
import { DeleteConfirmModal } from '@/src/presentation/components/admin/DeleteConfirmModal';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';

export interface QueuesRetroTechMagazineTemplateProps {
  state: AdminPresenterState;
  actions: AdminPresenterActions;
  generatePageNumbers: (current: number, total: number) => (number | '...')[];
  getStatusActions: (item: QueueItem) => { label: string; action: () => void; color: string }[];
}

export function QueuesRetroTechMagazineTemplate({
  state,
  actions,
  generatePageNumbers,
  getStatusActions,
}: QueuesRetroTechMagazineTemplateProps) {
  const viewModel = state.viewModel;
  if (!viewModel) return null;

  const filter = state.statusFilter;
  const items = viewModel.items || [];
  const nextQ = viewModel.nextQueueNumber || 1;
  const totalPages = viewModel.totalPages || 1;
  const currentPage = viewModel.currentPage || 1;

  const selectedItem = state.selectedItemId
    ? items.find((i) => i.id === state.selectedItemId)
    : null;

  return (
    <div
      className="min-h-full font-sans bg-[#f4f4f0] text-[#111] p-2 sm:p-6 pb-20 sm:pb-6 flex flex-col gap-4 sm:gap-6"
      style={{
        backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* ─── Header ─── */}
      <div className="bg-black text-[#00FFFF] p-4 border-[4px] sm:border-8 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] sm:shadow-[12px_12px_0_0_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-widest" style={{ WebkitTextStroke: '1px white' }}>
          MNG<span className="text-[#FF00FF]">.QUEUE</span>
        </h1>
        
        <div className="flex gap-2">
           <button
             onClick={actions.openClearAllModal}
             className="bg-black text-[#FF00FF] px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-widest border-[3px] border-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-colors"
           >
             SYS.RESET
           </button>
           <button
             onClick={actions.openCreateModal}
             className="bg-[#39FF14] text-black px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-widest border-[3px] border-black hover:bg-white transition-colors"
           >
             + ADD.Q
           </button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="bg-white border-[4px] sm:border-8 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] sm:shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-3 sm:p-6 flex flex-col min-h-[400px] sm:min-h-[500px]">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 border-b-4 border-black pb-4">
          {[
             { key: 'all', label: 'ทั้งหมด' },
             { key: QueueStatus.WAITING, label: 'รอคิว' },
             { key: QueueStatus.IN_PROGRESS, label: 'กำลังเรียก' },
             { key: QueueStatus.COMPLETED, label: 'เสร็จสิ้น' },
             { key: QueueStatus.CANCELLED, label: 'ยกเลิก' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => actions.setStatusFilter(tab.key)}
              className={`px-4 py-1 font-bold uppercase border-2 border-black transition-all ${
                filter === tab.key
                  ? 'bg-black text-[#00FFFF] shadow-[2px_2px_0_0_rgba(0,255,255,1)] translate-y-[2px]'
                  : 'bg-white text-black hover:bg-gray-200 shadow-[2px_2px_0_0_rgba(0,0,0,1)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-x-auto border-[4px] sm:border-8 border-black mb-4 bg-gray-50">
          {items.length === 0 ? (
            <div className="p-12 text-center text-xl font-black uppercase tracking-widest text-gray-400">
              ไม่พบข้อมูลคิว
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-full">
              <thead>
                <tr className="bg-black text-white font-bold uppercase tracking-wider text-[10px] sm:text-sm">
                  <th className="p-2 sm:p-3 w-16 sm:w-24 border-r-[2px] sm:border-r-[4px] border-white text-center">คิว</th>
                  <th className="p-2 sm:p-3">ข้อมูล</th>
                </tr>
              </thead>
              <tbody className="text-[10px] sm:text-sm">
                {items.map((item, idx) => {
                  const statusConfig = QUEUE_STATUS_CONFIG[item.status];
                  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];
                  const statusActions = getStatusActions(item);
                  return (
                    <tr key={item.id} className={`border-b-[4px] border-black hover:bg-[#00FFFF]/20 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'} group`}>
                      <td className="p-2 sm:p-4 border-r-[4px] border-black font-black text-3xl sm:text-5xl tabular-nums text-center align-middle">
                        {item.queueNumber.toString().padStart(2, '0')}
                      </td>
                      <td className="p-0 align-top">
                          {/* Data wrapper */}
                          <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between gap-4 h-full relative overflow-hidden">
                            
                            {/* Left side: Info */}
                            <div className="flex flex-col z-10 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="font-black text-lg sm:text-2xl uppercase">{item.customerName}</div>
                                <span className={`px-2 py-0.5 border-2 border-black font-black uppercase text-[10px] sm:text-xs tracking-widest ${
                                  item.status === QueueStatus.IN_PROGRESS ? 'bg-[#39FF14] text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]' : 'bg-white text-black'
                                }`}>
                                  {statusConfig.label}
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest bg-black text-[#00FFFF] inline-block px-1.5 py-0.5 border-[2px] border-black">
                                  SVC: {serviceConfig.label}
                                </div>
                                {item.note && (
                                    <div className="text-[10px] sm:text-xs font-bold bg-white border-[2px] border-black px-1.5 py-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center gap-1">
                                      <span className="bg-black text-white px-1">NOTE</span>
                                      <span className="opacity-80">{item.note}</span>
                                    </div>
                                )}
                              </div>
                            </div>

                            {/* Right side: Actions */}
                            <div className="flex flex-row sm:flex-col justify-end sm:justify-start gap-2 z-10 shrink-0">
                              <div className="flex flex-wrap gap-2 w-full justify-end">
                                {statusActions.map((sa, i) => {
                                  let btnColor = 'bg-white hover:bg-gray-200';
                                  if (sa.color.includes('blue')) btnColor = 'bg-[#00FFFF] hover:bg-[#00CCCC]';
                                  if (sa.color.includes('emerald') || sa.color.includes('green')) btnColor = 'bg-[#39FF14] hover:bg-[#32CC12]';
                                  if (sa.color.includes('red')) btnColor = 'bg-[#FF00FF] text-white hover:bg-[#CC00CC]';
                                  
                                  return (
                                    <button
                                      key={i}
                                      onClick={sa.action}
                                      className={`${btnColor} text-black px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest border-[3px] border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-center min-w-[70px] sm:min-w-0`}
                                    >
                                      {sa.label}
                                    </button>
                                  );
                                })}
                                <button
                                  onClick={() => actions.openDeleteModal(item.id)}
                                  className="bg-black text-[#FF00FF] hover:text-white hover:bg-red-600 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest border-[3px] border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-center min-w-[70px] sm:min-w-0"
                                >
                                  ลบ
                                </button>
                              </div>
                            </div>
                          </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center font-bold uppercase tracking-widest text-sm">
          <div>
            หน้า {currentPage} จาก {totalPages}
          </div>
          {totalPages > 1 && (
            <div className="flex gap-1 border-2 border-black bg-black p-1">
                <button
                onClick={() => actions.goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-2 py-1 bg-white text-black hover:bg-[#00FFFF] disabled:opacity-50 disabled:hover:bg-white"
              >
                &lt;
              </button>
              {generatePageNumbers(currentPage, totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className="px-2 py-1 text-white">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => actions.goToPage(p as number)}
                    className={`px-2 py-1 ${currentPage === p ? 'bg-[#FF00FF] text-white' : 'bg-white text-black hover:bg-[#00FFFF]'}`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => actions.goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-2 py-1 bg-white text-black hover:bg-[#00FFFF] disabled:opacity-50 disabled:hover:bg-white"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Error Toast ─── */}
      {state.error && (
        <div className="fixed bottom-20 right-6 bg-red-600 text-white font-bold p-4 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] z-40 animate-bounce">
          <div className="flex items-center gap-4">
            <span className="text-2xl">ข้อผิดพลาด</span>
            <span className="text-sm uppercase tracking-wider">{state.error}</span>
            <button onClick={() => actions.setError(null)} className="ml-4 bg-black text-white px-2 border-2 border-white hover:bg-white hover:text-black">X</button>
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
