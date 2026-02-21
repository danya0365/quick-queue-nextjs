import { QUEUE_STATUS_CONFIG, QueueItem, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { ClearConfirmModal } from '@/src/presentation/components/admin/ClearConfirmModal';
import { CreateQueueModal } from '@/src/presentation/components/admin/CreateQueueModal';
import { DeleteConfirmModal } from '@/src/presentation/components/admin/DeleteConfirmModal';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';

export interface AdminRetroTechMagazineTemplateProps {
  state: AdminPresenterState;
  actions: AdminPresenterActions;
  handleLogout: () => Promise<void>;
  generatePageNumbers: (current: number, total: number) => (number | '...')[];
  getStatusActions: (item: QueueItem) => { label: string; action: () => void; color: string }[];
}

export function AdminRetroTechMagazineTemplate({
  state,
  actions,
  handleLogout,
  generatePageNumbers,
  getStatusActions,
}: AdminRetroTechMagazineTemplateProps) {
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
    <div
      className="min-h-full font-sans p-4 sm:p-8 overflow-y-auto selection:bg-[#FF00FF] selection:text-white"
      style={{
        backgroundColor: '#f4f4f0',
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#111',
      }}
      id="admin-retro-layout"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ─── Header ─── */}
        <header className="flex flex-col sm:flex-row justify-between items-end border-b-8 border-black pb-4 gap-4">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none text-black">
              ผู้ดูแลระบบ
              <span className="block text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] stroke-black" style={{ WebkitTextStroke: '1px black' }}>
                แผงควบคุม
              </span>
            </h1>
          </div>
          <div className="flex gap-4 border-4 border-black bg-white p-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform -skew-x-2">
            <button
              onClick={actions.openCreateModal}
              className="bg-[#39FF14] text-black px-4 py-2 font-bold uppercase tracking-wider border-2 border-black hover:-translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
            >
              + สร้างคิว
            </button>
            <button
              onClick={actions.openClearAllModal}
              className="bg-[#FF00FF] text-white px-4 py-2 font-bold uppercase tracking-wider border-2 border-black hover:-translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
            >
              ล้างข้อมูล
            </button>
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 font-bold uppercase tracking-wider border-2 border-black hover:-translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
            >
              ออก
            </button>
          </div>
        </header>

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <RetroStatBox label="รวม" value={stats?.totalItems || 0} color="#FFFFFF" />
          <RetroStatBox label="รอคิว" value={stats?.waitingItems || 0} color="#FF00FF" textColor="text-white" />
          <RetroStatBox label="เรียกคิว" value={stats?.inProgressItems || 0} color="#00FFFF" />
          <RetroStatBox label="เสร็จ" value={stats?.completedItems || 0} color="#39FF14" />
          <RetroStatBox label="ยกเลิก" value={stats?.cancelledItems || 0} color="#000000" textColor="text-white" />
        </div>

        {/* ─── Main Content ─── */}
        <div className="bg-white border-8 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-6 flex flex-col min-h-[500px]">
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
          <div className="flex-1 overflow-x-auto border-4 border-black mb-4 bg-gray-50">
            {items.length === 0 ? (
              <div className="p-12 text-center text-xl font-black uppercase tracking-widest text-gray-400">
                ไม่พบข้อมูลคิว
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-black text-white font-bold uppercase tracking-wider">
                    <th className="p-3 border-r-2 border-white/20 whitespace-nowrap">หมายเลข</th>
                    <th className="p-3 border-r-2 border-white/20">ชื่อ / บริการ</th>
                    <th className="p-3 border-r-2 border-white/20">สถานะ</th>
                    <th className="p-3 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const statusConfig = QUEUE_STATUS_CONFIG[item.status];
                    const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];
                    const statusActions = getStatusActions(item);
                    return (
                      <tr key={item.id} className={`border-b-2 border-black hover:bg-[#00FFFF]/20 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                        <td className="p-3 border-r-2 border-black font-black text-2xl tabular-nums">
                          {item.queueNumber.toString().padStart(2, '0')}
                        </td>
                        <td className="p-3 border-r-2 border-black">
                          <div className="font-bold text-lg uppercase">{item.customerName}</div>
                          <div className="text-xs font-bold uppercase bg-black text-white inline-block px-1 mt-1">
                            {serviceConfig.label}
                          </div>
                          {item.note && <div className="text-xs font-mono mt-1 opacity-70">หมายเหตุ: {item.note}</div>}
                        </td>
                        <td className="p-3 border-r-2 border-black whitespace-nowrap">
                          <span className={`px-2 py-1 border-2 border-black font-bold uppercase text-xs ${
                            item.status === QueueStatus.IN_PROGRESS ? 'bg-[#39FF14] text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]' : 'bg-white text-black'
                          }`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            {statusActions.map((sa, i) => {
                              // Map Tailwind colors back to generic tech zine names for custom colors
                              let btnColor = 'bg-white hover:bg-gray-200';
                              if (sa.color.includes('blue')) btnColor = 'bg-[#00FFFF] hover:bg-[#00CCCC]';
                              if (sa.color.includes('emerald') || sa.color.includes('green')) btnColor = 'bg-[#39FF14] hover:bg-[#32CC12]';
                              if (sa.color.includes('red')) btnColor = 'bg-[#FF00FF] text-white hover:bg-[#CC00CC]';
                              
                              return (
                                <button
                                  key={i}
                                  onClick={sa.action}
                                  className={`${btnColor} text-black px-2 py-1 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all whitespace-nowrap`}
                                >
                                  {sa.label}
                                </button>
                              );
                            })}
                            <button
                               onClick={() => actions.openDeleteModal(item.id)}
                               className="bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all"
                            >
                              ลบ
                            </button>
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

      {/* ─── Modals (Existing standard modals remain, retro styles can be added later if needed) ─── */}
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

// ─── Retro Stat Box ───
function RetroStatBox({ label, value, color, textColor = 'text-black' }: { label: string; value: number; color: string; textColor?: string }) {
  return (
    <div className={`border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-3 flex flex-col items-center justify-center transform hover:scale-105 transition-transform ${textColor}`} style={{ backgroundColor: color }}>
      <div className="text-4xl font-black tabular-nums">{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest mt-1 bg-black text-white px-1">{label}</div>
    </div>
  );
}
