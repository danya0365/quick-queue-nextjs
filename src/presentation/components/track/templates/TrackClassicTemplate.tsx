import { formatQueueNumber } from '@/src/config/queue-display.config';
import { QueueRequest, REQUEST_STATUS_CONFIG, RequestStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { ClipboardList, Hourglass, Search } from 'lucide-react';
import { FormEvent } from 'react';
import { animated } from 'react-spring';

export interface TrackClassicTemplateProps {
  trackingCode: string;
  setTrackingCode: (code: string) => void;
  result: (QueueRequest & { queueNumber?: number }) | null;
  loading: boolean;
  error: string | null;
  searched: boolean;
  entries: { code: string; customerName: string; createdAt: string }[];
  removeEntry: (code: string) => void;
  clearAll: () => void;
  mounted: boolean;
  searchByCode: (code: string) => void;
  handleSubmit: (e: FormEvent) => void;
  resultSpring: any;
}

export function TrackClassicTemplate({
  trackingCode,
  setTrackingCode,
  result,
  loading,
  error,
  entries,
  removeEntry,
  clearAll,
  mounted,
  searchByCode,
  handleSubmit,
  resultSpring,
}: TrackClassicTemplateProps) {
  const statusConfig = result ? REQUEST_STATUS_CONFIG[result.status] : null;
  const serviceConfig = result ? SERVICE_TYPE_CONFIG[result.serviceType] : null;

  const renderResultCard = () => {
    if (!result || !statusConfig || !serviceConfig) return null;

    return (
      <animated.div style={resultSpring} className="bg-surface rounded-2xl border border-border p-4 sm:p-6 shadow-lg">
        <div className="flex justify-between items-start mb-4 pb-4 border-b border-border">
          <div>
            <div className="text-xs font-medium text-muted mb-0.5">ชื่อลูกค้า</div>
            <div className="text-lg font-bold text-foreground">{result.customerName}</div>
          </div>
          <div className="bg-primary/10 dark:bg-primary/20 rounded-lg px-3 py-1">
            <div className="text-xs text-muted mb-0.5">รหัสติดตาม</div>
            <div className="text-lg font-bold text-primary font-mono tracking-widest">{result.trackingCode}</div>
          </div>
        </div>
        <div className="text-center py-4">
          <div className={`inline-flex items-center gap-2 ${statusConfig.bgColor} rounded-full px-4 py-2 mb-2`}>
            <span className="text-2xl">{statusConfig.icon}</span>
            <span className={`text-lg font-bold ${statusConfig.color}`}>{statusConfig.label}</span>
          </div>
          <div className="text-sm text-muted">{serviceConfig.icon} {serviceConfig.label}</div>
        </div>
        {result.status === RequestStatus.APPROVED && result.queueNumber && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 sm:p-6 text-center mt-4">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">หมายเลขคิวของคุณ</div>
            <div className="text-5xl sm:text-7xl font-black tabular-nums tracking-tighter text-emerald-600 dark:text-emerald-400">{formatQueueNumber(result.queueNumber)}</div>
            <p className="text-xs text-muted mt-3">ไปที่หน้าแรกเพื่อดูสถานะคิวของคุณ</p>
          </div>
        )}
        {result.status === RequestStatus.REJECTED && result.rejectReason && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mt-4">
            <div className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">เหตุผลที่ถูกปฏิเสธ</div>
            <div className="text-sm text-red-700 dark:text-red-300">{result.rejectReason}</div>
          </div>
        )}
        {result.status === RequestStatus.PENDING && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-4 text-center">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2"><Hourglass className="w-4 h-4" /> คำขอของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ</p>
          </div>
        )}
      </animated.div>
    );
  };

  const renderHistory = () => {
    if (!mounted || entries.length === 0) return null;

    return (
      <div className="bg-surface rounded-2xl border border-border overflow-hidden mt-4 sm:mt-6">
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5"><ClipboardList className="w-4 h-4" /> ประวัติคำขอ ({entries.length})</h3>
          <button onClick={clearAll} className="text-[10px] sm:text-xs text-muted hover:text-red-500 font-medium transition-colors">ล้างทั้งหมด</button>
        </div>
        <div className="divide-y divide-border">
          {entries.map((entry) => (
            <div key={entry.code} onClick={() => searchByCode(entry.code)}
              className="w-full flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-surface-alt transition-colors text-left group cursor-pointer">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <span className="font-bold text-base sm:text-lg font-mono tracking-widest text-primary shrink-0">{entry.code}</span>
                <span className="text-xs sm:text-sm text-muted truncate">{entry.customerName}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-[10px] sm:text-xs text-muted hidden sm:inline">{new Date(entry.createdAt).toLocaleDateString('th-TH')}</span>
                <span className="text-muted group-hover:text-primary transition-colors">→</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeEntry(entry.code); }}
                  className="text-xs text-muted hover:text-red-500 transition-colors ml-1 p-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 gap-3 sm:gap-5 overflow-y-auto w-full absolute inset-0">
      <div className="max-w-[600px] mx-auto w-full space-y-4 sm:space-y-6 flex flex-col pt-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex justify-center items-center gap-2"><ClipboardList className="w-8 h-8 sm:w-10 sm:h-10" /> ขอบัตรคิว</h1>
          <p className="text-sm text-muted mt-2">กรอกรหัสติดตามเพื่อเช็คสถานะคำขอของคุณ</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 w-full">
          <input type="text" value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
            maxLength={6} placeholder="กรอกรหัส 6 หลัก"
            className="flex-1 min-w-0 px-4 py-3 sm:py-4 rounded-xl border-2 border-border bg-background text-foreground font-bold text-lg sm:text-2xl tracking-widest sm:tracking-[0.2em] text-center uppercase focus:outline-none focus:ring-2 focus:ring-primary w-full" />
          <button type="submit" disabled={loading}
            className="px-5 sm:px-8 py-3 sm:py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 whitespace-nowrap active:scale-95 shrink-0 flex items-center justify-center gap-2">
            {loading ? '...' : <><Search className="w-5 h-5" /> ค้นหา</>}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center text-sm text-red-600 dark:text-red-400 font-medium">{error}</div>
        )}

        {renderResultCard()}
        {renderHistory()}
      </div>
    </div>
  );
}
