import { REQUEST_STATUS_CONFIG, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { CustomSelect } from '@/src/presentation/components/shared/CustomSelect';
import { PendingRequestsViewModel } from '@/src/presentation/presenters/admin/PendingRequestsPresenter';
import { CheckCircle2, Mailbox, XCircle } from 'lucide-react';

interface PendingRequestsClassicTemplateProps {
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

export function PendingRequestsClassicTemplate({
  state: { viewModel, loading },
  actions,
  generatePageNumbers,
}: PendingRequestsClassicTemplateProps) {
  const { requests, totalCount, currentPage, totalPages } = viewModel;
  const statusConfig = REQUEST_STATUS_CONFIG;

  return (
    <div className="min-h-full bg-background p-4 sm:p-6 lg:p-8 text-foreground max-w-5xl mx-auto">


      {/* ─── Filters ─── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="ค้นหาชื่อ หรือ รหัสติดตาม..."
          value={viewModel.search}
          onChange={(e) => actions.setSearch(e.target.value)}
          className="flex-1 px-4 py-2 sm:py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
        />
        <CustomSelect
          value={viewModel.serviceType}
          onChange={(value) => actions.setServiceType(value)}
          options={[
            { value: 'all', label: 'ทุกบริการ' },
            ...Object.entries(SERVICE_TYPE_CONFIG).map(([key, config]) => ({
              value: key,
              label: config.label,
              icon: config.icon
            }))
          ]}
          className="w-full sm:w-[180px]"
          triggerClassName="px-4 py-2 sm:py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:bg-surface-alt cursor-pointer"
        />
      </div>

      {/* ─── Main Content ─── */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm flex flex-col min-h-[500px] overflow-hidden">
        {requests.length === 0 && !loading ? (
          <div className="flex-1 flex items-center justify-center p-8 m-4 border-2 border-dashed border-border rounded-xl">
            <div className="text-center">
              <div className="mb-3 opacity-50 flex justify-center text-muted"><Mailbox className="w-12 h-12 sm:w-16 sm:h-16" /></div>
              <p className="text-lg font-bold text-foreground">ไม่มีคำขอที่รอการอนุมัติ</p>
              <p className="text-sm text-muted mt-1">อัปเดตล่าสุดเมื่อสักครู่นี้</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {requests.map((req) => {
              const serviceConfig = SERVICE_TYPE_CONFIG[req.serviceType];
              return (
                <div key={req.id} className="p-4 sm:p-6 hover:bg-surface-alt transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          {statusConfig.pending.icon} {statusConfig.pending.label}
                        </span>
                        <span className="text-xs text-muted font-mono bg-background border border-border px-1.5 py-0.5 rounded">
                          {req.trackingCode}
                        </span>
                      </div>
                      
                      <div className="font-semibold text-lg sm:text-xl text-foreground truncate">{req.customerName}</div>
                      
                      <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted">
                        <span>{serviceConfig.icon}</span>
                        <span>{serviceConfig.label}</span>
                      </div>
                      
                      {req.note && (
                        <div className="mt-3 text-sm text-muted bg-background border border-border rounded-lg p-3">
                          <span className="font-medium mr-2">หมายเหตุ:</span>
                          {req.note}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 shrink-0 md:flex-col lg:flex-row">
                      <button onClick={() => actions.approveRequest(req.id)}
                        className="flex-1 md:flex-none px-4 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm transition-all shadow-sm active:scale-95 text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> อนุมัติ
                      </button>
                      <button onClick={() => actions.openRejectModal(req.id)}
                        className="flex-1 md:flex-none px-4 py-2 sm:py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-sm transition-all shadow-sm active:scale-95 text-center flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" /> ปฏิเสธ
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
          <div className="mt-auto p-4 sm:p-6 border-t border-border bg-surface-alt/50 flex flex-wrap justify-between items-center gap-4">
            <span className="text-sm text-muted hidden sm:inline-block">
              หน้า {currentPage} จาก {totalPages}
            </span>
            <div className="flex justify-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <button
                onClick={() => actions.changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 sm:w-10 sm:h-10 border border-border rounded-lg flex items-center justify-center font-medium disabled:opacity-30 hover:bg-surface-alt transition-colors bg-surface shadow-sm text-muted hover:text-foreground"
              >
                ←
              </button>
              {generatePageNumbers(currentPage, totalPages).map((p, i) => (
                <button
                  key={i}
                  onClick={() => typeof p === 'number' && actions.changePage(p)}
                  disabled={p === '...'}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-medium transition-colors text-sm sm:text-base
                    ${p === currentPage 
                      ? 'bg-primary text-white shadow-sm border border-primary' 
                      : p === '...' 
                        ? 'text-muted' 
                        : 'bg-surface border border-border text-foreground hover:bg-surface-alt shadow-sm'
                    }
                  `}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => actions.changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 sm:w-10 sm:h-10 border border-border rounded-lg flex items-center justify-center font-medium disabled:opacity-30 hover:bg-surface-alt transition-colors bg-surface shadow-sm text-muted hover:text-foreground"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
