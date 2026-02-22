import { REQUEST_STATUS_CONFIG, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { CustomSelect } from '@/src/presentation/components/shared/CustomSelect';
import { PendingRequestsViewModel } from '@/src/presentation/presenters/admin/PendingRequestsPresenter';

interface PendingRequestsEditorialTemplateProps {
  state: {
    loading: boolean;
    error: string | null;
    viewModel: PendingRequestsViewModel;
  };
  actions: {
    changePage: (page: number) => void;
    setSearch: (search: string) => void;
    setServiceType: (serviceType: string) => void;
    approveRequest: (id: string) => Promise<void>;
    openRejectModal: (id: string) => void;
  };
  generatePageNumbers: (current: number, total: number) => (number | '...')[];
}

export function PendingRequestsEditorialTemplate({
  state: { viewModel },
  actions,
  generatePageNumbers,
}: PendingRequestsEditorialTemplateProps) {
  const { requests, totalCount, currentPage, totalPages } = viewModel;
  const statusConfig = REQUEST_STATUS_CONFIG;

  return (
    <div className="min-h-full font-serif p-2 sm:p-4 md:p-8 bg-gray-100 text-black selection:bg-black selection:text-white">
      {/* ─── Header ─── */}
      {/* ─── Filters ─── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-8 font-sans">
        <input
          type="text"
          placeholder="ค้นหาชื่อ หรือ รหัสติดตาม..."
          value={viewModel.search}
          onChange={(e) => actions.setSearch(e.target.value)}
          className="flex-1 px-4 py-3 border-[3px] border-black text-sm font-bold uppercase focus:outline-none"
        />
        <CustomSelect
          value={viewModel.serviceType}
          onChange={(value) => actions.setServiceType(value)}
          options={[
            { value: 'all', label: 'ทุกบริการ (ALL)' },
            ...Object.entries(SERVICE_TYPE_CONFIG).map(([key, config]) => ({
              value: key,
              label: config.label,
              icon: config.icon
            }))
          ]}
          className="w-full sm:w-[220px]"
          triggerClassName="px-4 py-3 border-[3px] border-black text-sm font-bold uppercase focus:outline-none cursor-pointer bg-white transition-colors hover:bg-gray-50"
          dropdownClassName="bg-white border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] rounded-none"
          itemClassName="text-black font-bold uppercase hover:bg-gray-100 rounded-none"
          activeItemClassName="bg-black text-white font-bold uppercase rounded-none"
        />
      </div>

      {/* ─── Main Content ─── */}
      <div className="bg-white border-[4px] sm:border-[8px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.05)] p-4 sm:p-8 flex flex-col min-h-[400px] sm:min-h-[600px]">
        {requests.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 border-[3px] border-dashed border-gray-300 m-2">
            <div className="text-center opacity-40">
              <div className="text-5xl sm:text-6xl mb-4 grayscale">📭</div>
              <p className="text-xl sm:text-2xl font-black uppercase tracking-widest">NO PENDING REQUESTS</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => {
              const serviceConfig = SERVICE_TYPE_CONFIG[req.serviceType];
              return (
                <div key={req.id} className="border-[3px] sm:border-[4px] border-black bg-white group hover:bg-gray-50 transition-colors duration-300">
                  <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 mb-1">ผู้ขอคิว</div>
                      <div className="font-black text-2xl sm:text-3xl uppercase tracking-tighter truncate">{req.customerName}</div>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        <span className="text-[10px] sm:text-xs font-bold uppercase px-2 py-1 border-[2px] border-black tracking-widest bg-black text-white">
                          {statusConfig.pending.label}
                        </span>
                        <div className="text-xs font-bold uppercase tracking-widest opacity-80 flex items-center gap-1.5">
                          <span className="grayscale brightness-0">{serviceConfig.icon}</span> 
                          <span>{serviceConfig.label}</span>
                        </div>
                        <span className="text-[10px] sm:text-xs font-black uppercase font-mono bg-gray-200 px-2 py-1 tracking-widest">
                          ID: {req.trackingCode}
                        </span>
                      </div>
                      
                      {req.note && (
                        <div className="mt-4 pt-4 border-t-[2px] border-black/10">
                           <div className="text-[10px] font-bold tracking-widest uppercase opacity-50 mb-1">หมายเหตุ</div>
                           <p className="text-sm font-serif italic text-black/80">{req.note}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 shrink-0 w-full md:w-auto border-t-[3px] md:border-t-0 border-black md:border-l-[3px] md:pl-6 pt-4 md:pt-0">
                      <button onClick={() => actions.approveRequest(req.id)}
                        className="w-full lg:w-32 px-4 py-3 sm:py-4 bg-white text-black font-black uppercase text-xs sm:text-sm border-[3px] border-black hover:bg-black hover:text-white transition-colors tracking-widest">
                        อนุมัติ
                      </button>
                      <button onClick={() => actions.openRejectModal(req.id)}
                        className="w-full lg:w-32 px-4 py-3 sm:py-4 bg-black text-white font-black uppercase text-xs sm:text-sm border-[3px] border-black hover:bg-white hover:text-black transition-colors tracking-widest">
                        ปฏิเสธ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Pagination ─── */}
        {totalPages > 1 && (
          <div className="mt-8 pt-6 border-t-[4px] border-black flex flex-wrap justify-center gap-2">
            <button
              onClick={() => actions.changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 border-[3px] border-black font-bold disabled:opacity-30 hover:bg-black hover:text-white transition-colors text-lg flex items-center justify-center"
            >
              ←
            </button>
            {generatePageNumbers(currentPage, totalPages).map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === 'number' && actions.changePage(p)}
                disabled={p === '...'}
                className={`w-10 h-10 border-[3px] border-black font-black transition-colors text-sm flex items-center justify-center
                  ${p === currentPage ? 'bg-black text-white' : p === '...' ? 'border-none opacity-50' : 'bg-white hover:bg-gray-100'}
                `}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => actions.changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 border-[3px] border-black font-bold disabled:opacity-30 hover:bg-black hover:text-white transition-colors text-lg flex items-center justify-center"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
