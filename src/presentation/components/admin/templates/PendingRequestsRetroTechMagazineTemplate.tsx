import { REQUEST_STATUS_CONFIG, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { CustomSelect } from '@/src/presentation/components/shared/CustomSelect';
import { PendingRequestsViewModel } from '@/src/presentation/presenters/admin/PendingRequestsPresenter';

interface PendingRequestsRetroTechMagazineTemplateProps {
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

export function PendingRequestsRetroTechMagazineTemplate({
  state: { viewModel },
  actions,
  generatePageNumbers,
}: PendingRequestsRetroTechMagazineTemplateProps) {
  const { requests, totalCount, currentPage, totalPages } = viewModel;
  const statusConfig = REQUEST_STATUS_CONFIG;

  return (
    <div className="min-h-full font-sans p-2 sm:p-4 md:p-8 bg-[#00FFFF] text-black">

      {/* ─── Filters ─── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-8 font-sans">
        <input
          type="text"
          placeholder="ค้นหาชื่อ หรือ รหัสติดตาม..."
          value={viewModel.search}
          onChange={(e) => actions.setSearch(e.target.value)}
          className="flex-1 px-4 py-3 border-4 border-black text-sm font-bold uppercase focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white"
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
          triggerClassName="px-4 py-3 border-4 border-black text-sm font-bold uppercase focus:outline-none cursor-pointer bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          dropdownClassName="bg-[#00FFFF] border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-none mt-4 p-0"
          itemClassName="text-black font-black uppercase hover:bg-black hover:text-[#00FFFF] rounded-none border-b-4 border-black last:border-b-0"
          activeItemClassName="bg-[#FF00FF] text-white font-black uppercase rounded-none border-b-4 border-black last:border-b-0"
        />
      </div>

      {/* ─── Main Content ─── */}
      <div className="bg-white border-[4px] sm:border-8 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] sm:shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-3 sm:p-6 flex flex-col min-h-[400px] sm:min-h-[500px]">
        {requests.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-100 border-4 border-dashed border-black m-2">
            <div className="text-center opacity-50">
              <div className="text-5xl sm:text-6xl mb-4 grayscale">📭</div>
              <p className="text-lg sm:text-xl font-black uppercase">NO PENDING REQUESTS</p>
              <p className="text-xs sm:text-sm font-bold mt-2">ไม่มีคำขอที่รอการอนุมัติในขณะนี้</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const serviceConfig = SERVICE_TYPE_CONFIG[req.serviceType];
              return (
                <div key={req.id} className="border-4 border-black p-4 sm:p-6 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all bg-white relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#FF00FF] group-hover:bg-[#00FFFF] transition-colors"></div>
                  <div className="flex-1 min-w-0 pl-2">
                    <div className="font-black text-xl sm:text-2xl uppercase truncate">{req.customerName}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs font-black uppercase px-2 py-0.5 bg-[#FF00FF] text-white border-2 border-black tracking-widest">{statusConfig.pending.label}</span>
                      <span className="text-xs font-bold uppercase opacity-80 border-2 border-black px-2 py-0.5">{serviceConfig.icon} {serviceConfig.label}</span>
                      <span className="text-xs font-black uppercase font-mono bg-black text-[#39FF14] px-2 py-0.5 border-2 border-black tracking-widest">{req.trackingCode}</span>
                    </div>
                    {req.note && <p className="text-sm mt-3 font-bold border-l-4 border-black pl-3 opacity-80 italic">📝 {req.note}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                    <button onClick={() => actions.approveRequest(req.id)}
                      className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-[#39FF14] text-black font-black uppercase text-sm sm:text-base border-4 border-black hover:bg-[#00FFFF] transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] tracking-widest">
                      ✅ APPROVE
                    </button>
                    <button onClick={() => actions.openRejectModal(req.id)}
                      className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-[#FF00FF] text-white font-black uppercase text-sm sm:text-base border-4 border-black hover:bg-black transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] tracking-widest">
                      ❌ REJECT
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Pagination ─── */}
        {totalPages > 1 && (
          <div className="mt-auto pt-6 border-t-8 border-black flex flex-wrap justify-center gap-2">
            <button
              onClick={() => actions.changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 border-4 border-black font-bold disabled:opacity-30 hover:bg-black hover:text-white transition-colors bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] text-lg"
            >
              &lt;
            </button>
            {generatePageNumbers(currentPage, totalPages).map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === 'number' && actions.changePage(p)}
                disabled={p === '...'}
                className={`w-10 h-10 border-4 border-black font-black transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-sm
                  ${p === currentPage ? 'bg-[#FF00FF] text-white' : p === '...' ? 'bg-transparent shadow-none border-none opacity-50' : 'bg-white hover:bg-black hover:text-[#00FFFF]'}
                  ${p !== '...' ? 'active:shadow-none active:translate-x-[2px] active:translate-y-[2px]' : ''}
                `}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => actions.changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 border-4 border-black font-bold disabled:opacity-30 hover:bg-black hover:text-white transition-colors bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] text-lg"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
