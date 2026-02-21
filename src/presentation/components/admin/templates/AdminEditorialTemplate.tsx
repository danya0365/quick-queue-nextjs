import { QueueItem, QueueStatus, SERVICE_TYPE_CONFIG, ServiceType } from '@/src/domain/types/queue';
import { ClearConfirmModal } from '@/src/presentation/components/admin/ClearConfirmModal';
import { CreateQueueModal } from '@/src/presentation/components/admin/CreateQueueModal';
import { DeleteConfirmModal } from '@/src/presentation/components/admin/DeleteConfirmModal';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

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
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  // Status mapping to Editorial visual presentation via stamps/ribbons
  const getStatusStamp = (status: QueueStatus) => {
    switch (status) {
      case QueueStatus.WAITING:
        return null;
      case QueueStatus.IN_PROGRESS:
        return (
          <div className="absolute -right-6 top-1.5 sm:-right-8 sm:top-2 bg-black text-white font-black text-[6px] sm:text-[8px] px-8 sm:px-10 py-0.5 sm:py-1 transform rotate-45 border-y-[1px] sm:border-y-[2px] border-white pointer-events-none tracking-widest shadow-sm z-0">
            SERVING
          </div>
        );
      case QueueStatus.COMPLETED:
        return (
          <div className="absolute -right-6 top-1.5 sm:-right-8 sm:top-2 bg-emerald-500 text-white font-black text-[6px] sm:text-[8px] px-8 sm:px-10 py-0.5 sm:py-1 transform rotate-45 border-y-[1px] sm:border-y-[2px] border-white pointer-events-none tracking-widest shadow-sm z-0">
            DONE
          </div>
        );
      case QueueStatus.CANCELLED:
        return (
          <div className="absolute right-2 top-2 border-[2px] sm:border-[3px] border-solid border-gray-400 text-gray-400 font-black text-[6px] sm:text-[10px] px-1.5 py-0.5 transform -rotate-[15deg] pointer-events-none tracking-widest uppercase z-0">
            VOID
          </div>
        );
    }
  };

  const tabs = [
    { key: 'all', label: 'ALL TICKETS', count: stats?.totalItems || 0 },
    { key: QueueStatus.WAITING, label: 'WAITING', count: stats?.waitingItems || 0 },
    { key: QueueStatus.IN_PROGRESS, label: 'SERVING', count: stats?.inProgressItems || 0 },
    { key: QueueStatus.COMPLETED, label: 'DONE', count: stats?.completedItems || 0 },
    { key: QueueStatus.CANCELLED, label: 'VOID', count: stats?.cancelledItems || 0 },
  ];

  // Service Type Color mapping for Vertical Stripe
  const getServiceTypeColor = (type: ServiceType) => {
    switch (type) {
      case ServiceType.EXPRESS:
        return 'bg-amber-400 text-black border-r-black';
      case ServiceType.VIP:
        return 'bg-fuchsia-600 text-white border-r-black';
      case ServiceType.GENERAL:
      default:
        return 'bg-black text-white border-r-black';
    }
  };

  if (!viewModel) return null;

  const activeTab = tabs.find(t => t.key === filter) || tabs[0];

  return (
    <div className="min-h-full font-serif bg-white text-black selection:bg-black selection:text-white pb-20">
      
      {/* ─── Editorial Sticky Action Bar ─── */}
      <div className="sticky top-0 z-40 bg-white border-b-[3px] sm:border-b-[8px] border-black flex flex-row sm:items-center sm:justify-between px-0 sm:px-12">
        {/* Main Row / Primary Actions */}
        <div className="px-4 py-3 sm:py-4 flex justify-between items-center w-full">
          <h1 className="text-xl sm:text-5xl font-black uppercase tracking-tighter shrink-0 mr-4">
            CONTROL<span className="bg-black text-white px-1 sm:px-2 ml-0.5 sm:ml-1">PANEL</span>
          </h1>
          
          <div className="flex gap-2 sm:gap-4 items-center flex-1 justify-end">
            {state.loading && (
              <span className="font-bold uppercase tracking-widest bg-black text-white px-2 py-1 sm:px-3 animate-pulse text-[8px] sm:text-xs">
                <span className="sm:hidden">SYNC</span>
                <span className="hidden sm:inline">SYNCING</span>
              </span>
            )}
            <button
              onClick={() => actions.loadData()}
              className="w-8 h-8 sm:w-10 sm:h-10 border-[2px] sm:border-[4px] border-black flex items-center justify-center font-black active:bg-black active:text-white sm:hover:bg-black sm:hover:text-white transition-colors text-xs sm:text-base shrink-0"
              title="Refresh"
            >
              ↺
            </button>
            <button
              onClick={actions.openCreateModal}
              className="px-3 py-1.5 sm:px-6 sm:py-2.5 bg-black text-white border-[2px] sm:border-[4px] border-black font-black uppercase tracking-widest text-[10px] sm:text-sm active:scale-95 transition-transform sm:hover:bg-white sm:hover:text-black shrink-0"
            >
              <span className="sm:hidden">+ ADD</span>
              <span className="hidden sm:inline">+ ADD TICKET</span>
            </button>
            <div className="relative shrink-0">
              <button 
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="w-8 h-8 sm:w-10 sm:h-10 border-[2px] sm:border-[4px] border-black flex items-center justify-center font-black bg-white active:bg-black active:text-white sm:hover:bg-black sm:hover:text-white transition-colors text-xs sm:text-base shrink-0"
              >
                ⋮
              </button>
              {isMoreMenuOpen && (
                <div className="absolute top-full right-0 mt-2 border-[3px] border-black bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex flex-col z-50 w-32 sm:w-48 overflow-hidden divide-y-[2px] sm:divide-y-[3px] divide-black">
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      actions.openClearAllModal();
                    }}
                    className="px-4 py-3 sm:py-4 text-red-600 font-black uppercase tracking-widest text-[10px] sm:text-sm hover:bg-gray-100 text-left transition-colors whitespace-nowrap"
                  >
                    PURGE DB
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="px-4 py-3 sm:py-4 text-black font-black uppercase tracking-widest text-[10px] sm:text-sm hover:bg-gray-100 text-left transition-colors whitespace-nowrap"
                  >
                    LOGOUT
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 sm:p-8 space-y-4 sm:space-y-8">
        {/* ─── Error Banner ─── */}
        {state.error && (
          <div className="bg-black text-white border-[6px] border-black p-6 font-sans">
            <h3 className="font-black text-xl uppercase tracking-widest mb-2 border-b-[4px] border-white pb-2 inline-block">SYSTEM ERROR</h3>
            <p className="font-bold">{state.error}</p>
          </div>
        )}

        {/* ─── STATS ─── */}
        <section className="font-sans uppercase">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
            <div className="col-span-2 sm:col-span-1 border-[3px] sm:border-[6px] border-black p-3 sm:p-4 bg-white hover:bg-black hover:text-white transition-colors group cursor-default">
              <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">TOTAL</div>
              <div className="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.totalItems || 0}</div>
            </div>
            <div className="border-[3px] sm:border-[6px] border-black p-3 sm:p-4 bg-white hover:bg-black hover:text-white transition-colors group cursor-default">
              <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">WAITING</div>
              <div className="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.waitingItems || 0}</div>
            </div>
            <div className="border-[3px] sm:border-[6px] border-black p-3 sm:p-4 bg-black text-white hover:bg-white hover:text-black transition-colors group cursor-default">
              <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">SERVING</div>
              <div className="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.inProgressItems || 0}</div>
            </div>
            <div className="border-[3px] sm:border-[6px] border-black p-3 sm:p-4 bg-white hover:bg-black hover:text-white transition-colors group cursor-default">
              <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">DONE</div>
              <div className="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2">{stats?.completedItems || 0}</div>
            </div>
            <div className="border-[3px] sm:border-[6px] border-dashed border-black/50 p-3 sm:p-4 bg-white hover:border-solid hover:border-black hover:bg-black hover:text-white transition-colors group cursor-default">
              <div className="text-[10px] sm:text-sm font-black tracking-widest opacity-60 group-hover:opacity-100">VOID</div>
              <div className="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter mt-1 sm:mt-2 text-black/50 group-hover:text-white">{stats?.cancelledItems || 0}</div>
            </div>
          </div>
        </section>

        {/* ─── Filter Tabs (Responsive) ─── */}
        <div className="mb-2 sm:mb-4 relative font-sans w-full z-30">
          
          {/* Mobile Dropdown Button */}
          <button 
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="sm:hidden w-full flex items-center justify-between px-4 py-3 bg-black text-white border-[3px] border-black font-black uppercase tracking-widest text-[10px] active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center">
               <span className="opacity-60 mr-2">FILTER:</span>
               {activeTab.label}
            </div>
            <div className="flex items-center">
               <span className="font-bold border-[2px] border-white px-1.5 py-0.5 leading-none text-[8px] mr-2 text-white">
                 {activeTab.count}
               </span>
               <span className={`transform transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </div>
          </button>

          {/* Mobile Dropdown Menu */}
          {isFilterDropdownOpen && (
            <div className="sm:hidden absolute top-full left-0 right-0 mt-1 sm:mt-2 border-[3px] border-black bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex flex-col z-40 max-h-[300px] overflow-y-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    actions.setStatusFilter(tab.key);
                    setIsFilterDropdownOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-3 font-black uppercase tracking-widest text-[10px] flex items-center justify-between border-b-[2px] border-black/10 last:border-b-0 transition-colors
                    ${filter === tab.key ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}
                  `}
                >
                  <span className="flex items-center gap-2">
                    {filter === tab.key && <span className="text-[10px] text-white">▶</span>}
                    {tab.label}
                  </span>
                  <span className={`font-bold border-[2px] px-1.5 py-0.5 leading-none text-[8px] ${filter === tab.key ? 'border-white text-white' : 'border-black text-black'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Desktop Segmented Control */}
          <section className="hidden sm:flex flex-nowrap w-full overflow-x-auto border-[3px] sm:border-[6px] border-black bg-white scrollbar-hide snap-x">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => actions.setStatusFilter(tab.key)}
                className={`
                  flex-1 min-w-[120px] sm:min-w-0 px-4 py-3 sm:px-6 sm:py-4 font-black uppercase tracking-widest text-[10px] sm:text-sm transition-colors whitespace-nowrap flex items-center justify-center shrink-0 snap-start border-r-[3px] sm:border-r-[6px] border-black last:border-r-0 sm:last:border-r-0
                  ${filter === tab.key ? 'bg-black text-white hover:bg-black/90' : 'bg-white text-black hover:bg-gray-100'}
                `}
              >
                {tab.label} 
                <span className={`ml-2 px-1.5 py-0.5 sm:px-2 sm:py-0.5 font-bold border-[2px] leading-none text-[8px] sm:text-[10px] ${filter === tab.key ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </section>
        </div>

        {/* ─── The Data ─── */}
        <section className="border-[2px] sm:border-[6px] border-black bg-white font-sans overflow-x-auto relative min-w-full block">
          {/* Pagination Top Banner */}
          <div className="flex justify-between items-center bg-black text-white px-2 py-1.5 sm:px-4 sm:py-2">
            <div className="font-black text-[10px] sm:text-sm uppercase tracking-widest hidden sm:block">THE ROSTER</div>
            <div className="font-black text-[8px] sm:text-xs uppercase tracking-widest w-full text-right sm:w-auto">
               PAGE {currentPage} OF {totalPages}
            </div>
          </div>
          
          <table className="w-full text-left font-bold border-collapse whitespace-nowrap sm:whitespace-normal min-w-max sm:min-w-0">
            <thead className="bg-[#f0f0f0] border-b-[2px] sm:border-b-[4px] border-black text-black text-[8px] sm:text-xs uppercase tracking-widest">
              <tr>
                <th className="p-2 sm:p-4 border-l-[2px] sm:border-l-[4px] border-black w-12 sm:w-24">NO.</th>
                <th className="p-2 sm:p-4 border-b-[2px] sm:border-b-[4px] border-black border-l-[2px] sm:border-l-[4px]">IDENTITY</th>
              </tr>
            </thead>
            <tbody className="text-[10px] sm:text-sm">
              {items.map((item) => {
                 const statusActions = getStatusActions(item);
                 return (
                  <tr key={item.id} className="border-b-[2px] sm:border-b-[4px] border-black hover:bg-gray-100 transition-colors last:border-b-0 group">
                    <td className="p-2 sm:p-4 border-l-[2px] sm:border-l-[4px] border-black font-black text-2xl sm:text-4xl tabular-nums tracking-tighter">
                      {item.queueNumber.toString().padStart(2, '0')}
                    </td>
                    <td className="p-0 border-l-[2px] sm:border-l-[4px] border-black align-top">
                      <div className="relative w-full h-full overflow-hidden flex min-h-[50px] sm:min-h-[85px] group-hover:bg-gray-50 transition-colors">
                        {getStatusStamp(item.status)}
                        
                        {/* The Vertical Info Stripe */}
                        <div className={`w-5 sm:w-8 flex items-center justify-center shrink-0 relative z-10 border-r-[2px] sm:border-r-[4px] border-black ${getServiceTypeColor(item.serviceType)}`}>
                           <span className="text-[6px] sm:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                             {SERVICE_TYPE_CONFIG[item.serviceType].label}
                           </span>
                        </div>

                        {/* Main Content Area */}
                        <div className="p-2 sm:p-4 flex flex-col justify-between flex-1 relative z-10 overflow-hidden min-w-0">
                          {/* Top Row: Customer Details */}
                          <div className="flex flex-col mb-4 sm:mb-6 pr-8 sm:pr-12">
                            <div className="font-black uppercase text-sm sm:text-xl leading-none truncate w-full">{item.customerName}</div>
                            {item.note && (
                               <div className="mt-1 sm:mt-2 flex">
                                 <span className="px-1.5 sm:px-2 py-0.5 text-[6px] sm:text-[8px] uppercase font-bold border-[1.5px] sm:border-[2px] border-black bg-white text-black tracking-widest inline-flex items-center gap-1 truncate max-w-full">
                                   <span className="text-black/50">NOTE:</span> {item.note}
                                 </span>
                               </div>
                            )}
                          </div>

                          {/* Bottom Row: Actions */}
                          <div className="flex justify-end gap-1 flex-wrap sm:flex-nowrap w-full mt-auto">
                            {statusActions.map((sa, i) => (
                              <button
                                key={i}
                                onClick={sa.action}
                                className={`
                                  text-[8px] sm:text-[10px] uppercase font-black tracking-widest px-1.5 py-1 sm:px-3 sm:py-2 border-[2px] sm:border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors flex-shrink-0
                                  ${sa.color.includes('emerald') ? 'bg-emerald-100 hover:border-emerald-500 text-emerald-700' : sa.color.includes('blue') ? 'bg-blue-100 hover:border-blue-500' : ''}
                                `}
                                title={sa.label}
                              >
                                {sa.label.includes('เริ่ม') ? 'START' : sa.label.includes('เสร็จ') ? 'DONE' : sa.label.includes('ยกเลิก') ? 'VOID' : sa.label}
                              </button>
                            ))}
                            <button
                              onClick={() => actions.openDeleteModal(item.id)}
                              className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest px-1.5 py-1 sm:px-3 sm:py-2 border-[2px] sm:border-[3px] border-black bg-red-100 hover:bg-red-500 hover:text-white transition-colors text-red-600 flex-shrink-0"
                              title="DELETE"
                            >
                              DEL
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-16 text-center text-gray-400 font-black uppercase text-2xl border-l-[4px] border-black">
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

      {/* ─── Logout Confirm Modal ─── */}
      {isLogoutModalOpen && (
        <animated.div
          style={overlaySpring}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsLogoutModalOpen(false)} />

          {/* Modal */}
          <animated.div
            style={modalSpring}
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-sm
              bg-white border-[6px] border-black text-black
              font-serif shadow-[8px_8px_0_0_#000]
            "
          >
            <div className="px-6 py-4 border-b-[6px] border-black flex justify-between items-center bg-white">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-black flex items-center gap-2">
                EXIT
              </h2>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-10 h-10 border-[4px] border-black text-black font-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 font-sans">
              <h3 className="text-xl font-bold uppercase mb-2">END SESSION?</h3>
              <p className="text-sm font-bold opacity-80 mb-6 uppercase">
                YOU ARE ABOUT TO DISCONNECT FROM THE SYSTEM.
              </p>
              
              <div className="flex gap-4 border-t-[6px] border-black pt-6">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 px-4 py-4 font-black uppercase text-sm border-[4px] border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
                >
                  STAY
                </button>
                <button
                  onClick={() => {
                    setIsLogoutModalOpen(false);
                    handleLogout();
                  }}
                  className="flex-1 px-4 py-4 font-black uppercase text-sm border-[4px] border-black bg-black text-white hover:bg-white hover:text-black transition-colors"
                >
                  LEAVE
                </button>
              </div>
            </div>
          </animated.div>
        </animated.div>
      )}

    </div>
  );
}
