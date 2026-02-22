import { QUEUE_STATUS_CONFIG, QueueItem, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { ClearConfirmModal } from '@/src/presentation/components/admin/ClearConfirmModal';
import { CreateQueueModal } from '@/src/presentation/components/admin/CreateQueueModal';
import { DeleteConfirmModal } from '@/src/presentation/components/admin/DeleteConfirmModal';
import { PendingRequestsSection } from '@/src/presentation/components/admin/PendingRequestsSection';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Logout modal springs
  const overlaySpring = useSpring({
    opacity: isLogoutModalOpen ? 1 : 0,
    config: { tension: 300, friction: 25 },
  });

  const modalSpring = useSpring({
    opacity: isLogoutModalOpen ? 1 : 0,
    transform: isLogoutModalOpen ? 'scale(1) translateY(0px)' : 'scale(0.95) translateY(20px)',
    config: { tension: 300, friction: 25 },
  });

  // Infinite marquee for stats (mobile only)
  const marqueeSpring = useSpring({
    from: { transform: 'translateX(0%)' },
    to: { transform: 'translateX(-50%)' },
    config: { duration: 15000 }, // 15 seconds per loop
    loop: true,
  });

  const viewModel = state.viewModel;
  if (!viewModel) return null;

  const filter = state.statusFilter;
  const stats = viewModel.stats;
  const items = viewModel.items || [];

  const statItems = [
    { label: 'รวม', value: stats?.totalItems || 0, color: '#FFFFFF' },
    { label: 'รอคิว', value: stats?.waitingItems || 0, color: '#FF00FF', textColor: 'text-white' },
    { label: 'เรียกคิว', value: stats?.inProgressItems || 0, color: '#00FFFF' },
    { label: 'เสร็จ', value: stats?.completedItems || 0, color: '#39FF14' },
    { label: 'ยกเลิก', value: stats?.cancelledItems || 0, color: '#000000', textColor: 'text-white' },
  ];
  const nextQ = viewModel.nextQueueNumber || 1;
  const totalPages = viewModel.totalPages || 1;
  const currentPage = viewModel.currentPage || 1;
  const totalItems = viewModel.totalItems || 0;
  const pendingRequests = viewModel.pendingRequests || [];

  const selectedItem = state.selectedItemId
    ? items.find((i) => i.id === state.selectedItemId)
    : null;

  return (
    <div
      className="min-h-full font-sans p-2 sm:p-8 overflow-y-auto selection:bg-[#FF00FF] selection:text-white pb-24 sm:pb-8"
      style={{
        backgroundColor: '#f4f4f0',
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#111',
      }}
      id="admin-retro-layout"
    >
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        {/* ─── Header ─── */}
        <header className="flex flex-row justify-between items-start sm:items-end border-b-[4px] sm:border-b-8 border-black pb-4 gap-4">
          <div>
            <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter leading-none text-black">
              ผู้ดูแลระบบ
              <span className="block text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] stroke-black" style={{ WebkitTextStroke: '1px black' }}>
                แผงควบคุม
              </span>
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 relative self-end sm:self-auto">
            <button
              onClick={actions.openCreateModal}
              className="bg-[#39FF14] text-black px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-black uppercase tracking-widest border-[4px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex-1 sm:flex-none text-center transform sm:-skew-x-2"
            >
              + สร้างคิว
            </button>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="bg-white text-black w-10 h-10 sm:w-14 sm:h-auto sm:px-4 flex items-center justify-center font-black uppercase tracking-widest border-[4px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-xl shrink-0 transform sm:-skew-x-2"
            >
              ⋮
            </button>

            {/* Dropdown Menu */}
            {isMoreMenuOpen && (
              <div className="absolute top-full right-0 mt-3 border-[4px] border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col z-50 w-48 overflow-hidden transform sm:-skew-x-2">
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    actions.openClearAllModal();
                  }}
                  className="px-4 py-3 sm:py-4 bg-white hover:bg-[#FF00FF] hover:text-white text-black font-black uppercase tracking-widest text-[10px] sm:text-sm text-left transition-colors border-b-[4px] border-black whitespace-nowrap"
                >
                  ล้างข้อมูล
                </button>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="px-4 py-3 sm:py-4 bg-white hover:bg-black hover:text-[#00FFFF] text-black font-black uppercase tracking-widest text-[10px] sm:text-sm text-left transition-colors whitespace-nowrap"
                >
                  ออก
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ─── Stats Grid (Desktop) ─── */}
        <div className="hidden sm:grid sm:grid-cols-5 gap-4">
          {statItems.map((stat, i) => (
            <RetroStatBox key={`desktop-${i}`} {...stat} />
          ))}
        </div>

        {/* ─── Infinite Carousel (Mobile) ─── */}
        <div className="sm:hidden overflow-hidden w-full pb-2 relative -mx-2 px-2">
          {/* Fade edges to look better when scrolling */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-[#f4f4f0] z-10" style={{ maskImage: 'linear-gradient(to right, black, transparent)', WebkitMaskImage: 'linear-gradient(to right, black, transparent)' }}></div>
          <div className="absolute top-0 bottom-0 right-0 w-4 bg-[#f4f4f0] z-10" style={{ maskImage: 'linear-gradient(to left, black, transparent)', WebkitMaskImage: 'linear-gradient(to left, black, transparent)' }}></div>
          
          <animated.div
            style={marqueeSpring}
            className="flex flex-nowrap w-max"
          >
            {[statItems, statItems].map((list, listIdx) => (
              <div key={`list-${listIdx}`} className="flex gap-2 pr-2">
                {list.map((stat, i) => (
                  <div key={`${listIdx}-${i}`} className="min-w-[110px]">
                    <RetroStatBox {...stat} />
                  </div>
                ))}
              </div>
            ))}
          </animated.div>
        </div>

        {/* ─── Pending Queue Requests ─── */}
        {/* Pending Requests Section */}
      <PendingRequestsSection 
        requests={viewModel.pendingRequests} 
        totalCount={viewModel.pendingCount}
        onApprove={actions.approveRequest}
        onReject={actions.openRejectModal}
      />
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

      {/* ─── Logout Confirm Modal ─── */}
      {isLogoutModalOpen && (
        <animated.div
          style={overlaySpring}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          {/* Overlay */}
          <div className="absolute inset-0" onClick={() => setIsLogoutModalOpen(false)} />

          {/* Modal */}
          <animated.div
            style={modalSpring}
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-sm
              bg-white border-[6px] sm:border-8 border-black text-black
              font-sans shadow-[8px_8px_0_0_#FF00FF] sm:shadow-[12px_12px_0_0_#FF00FF]
              max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden
              transform sm:-skew-x-2
            "
          >
            <div className="px-6 py-4 border-b-[6px] border-black flex justify-between items-center bg-black text-[#00FFFF]">
              <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2 transform sm:skew-x-2">
                SYS.EXIT
              </h2>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-10 h-10 border-[4px] border-[#00FFFF] text-[#00FFFF] font-black flex items-center justify-center hover:bg-[#00FFFF] hover:text-black transition-colors transform sm:skew-x-2"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-white text-black">
              <div className="transform sm:skew-x-2">
                <h3 className="text-xl sm:text-2xl font-black uppercase mb-2 leading-tight">ต้องการออกจาก<br/>ระบบแผงควบคุม?</h3>
                <p className="text-sm font-bold opacity-80 mb-6 uppercase tracking-widest bg-black text-white px-2 py-1 inline-block">
                  สิ้นสุดเซสชันปัจจุบัน
                </p>
                
                <div className="flex gap-4 border-t-[4px] border-black pt-6">
                  <button
                    onClick={() => setIsLogoutModalOpen(false)}
                    className="flex-1 px-4 py-3 sm:py-4 font-black uppercase text-sm border-[4px] border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => {
                      setIsLogoutModalOpen(false);
                      handleLogout();
                    }}
                    className="flex-1 px-4 py-3 sm:py-4 font-black uppercase text-sm border-[4px] border-black bg-[#39FF14] text-black hover:bg-black hover:text-[#39FF14] transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                  >
                    ตกลง
                  </button>
                </div>
              </div>
            </div>
          </animated.div>
        </animated.div>
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
    <div className={`border-[3px] sm:border-4 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)] py-1.5 px-2 sm:p-3 flex flex-col items-center justify-center transform hover:scale-105 transition-transform ${textColor}`} style={{ backgroundColor: color }}>
      <div className="text-2xl sm:text-4xl font-black tabular-nums leading-none mb-1 sm:mb-0">{value}</div>
      <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest sm:mt-1 bg-black text-white px-1 leading-none py-0.5">{label}</div>
    </div>
  );
}
