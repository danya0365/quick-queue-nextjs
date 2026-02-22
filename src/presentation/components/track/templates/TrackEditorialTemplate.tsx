import { QueueRequest, REQUEST_STATUS_CONFIG, RequestStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { ClipboardList, Search } from 'lucide-react';
import { FormEvent } from 'react';
import { animated } from 'react-spring';

export interface TrackEditorialTemplateProps {
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

export function TrackEditorialTemplate({
  trackingCode,
  setTrackingCode,
  result,
  loading,
  error,
  searched,
  entries,
  removeEntry,
  clearAll,
  mounted,
  searchByCode,
  handleSubmit,
  resultSpring,
}: TrackEditorialTemplateProps) {
  const statusConfig = result ? REQUEST_STATUS_CONFIG[result.status] : null;
  const serviceConfig = result ? SERVICE_TYPE_CONFIG[result.serviceType] : null;

  const renderResultCard = () => {
    if (!result || !statusConfig || !serviceConfig) return null;

    return (
      <animated.div style={resultSpring} className="mt-8 border-[3px] sm:border-[6px] border-black p-4 sm:p-8 bg-white max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-end mb-6 pb-4 border-b-[3px] sm:border-b-[4px] border-black">
          <div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
              ผู้ขอคิว
            </div>
            <div className="text-xl sm:text-3xl font-black uppercase tracking-tighter leading-none">{result.customerName}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
              รหัสติดตาม
            </div>
            <div className="text-sm sm:text-xl font-black font-mono tracking-widest leading-none bg-gray-100 px-2 py-1 border-[2px] border-black">{result.trackingCode}</div>
          </div>
        </div>
        
        {/* Status Area */}
        <div className={`py-6 sm:py-10 text-center border-[3px] sm:border-[4px] border-black mb-6 transition-colors ${
          result.status === RequestStatus.APPROVED ? 'bg-gray-100' :
          result.status === RequestStatus.REJECTED ? 'bg-black text-white' : 'bg-white'
        }`}>
          <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest mb-3 border-2 inline-block px-3 py-1 border-current opacity-80">
            สถานะคำขอ
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
            <span className={`text-4xl sm:text-5xl grayscale brightness-0 ${result.status === RequestStatus.REJECTED ? 'invert' : ''}`}>{statusConfig.icon}</span>
            <span className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">{statusConfig.label}</span>
          </div>
          <div className="text-xs sm:text-sm font-bold opacity-70 flex items-center justify-center gap-2 mt-4">
            <span className={`grayscale brightness-0 opacity-70 ${result.status === RequestStatus.REJECTED ? 'invert' : ''}`}>{serviceConfig.icon}</span> 
            ประเภทบริการ: <span className="underline underline-offset-4">{serviceConfig.label}</span>
          </div>
        </div>

        {/* Dynamic Content based on Status */}
        {result.status === RequestStatus.APPROVED && result.queueNumber && (
          <div className="bg-black text-white p-6 sm:p-12 text-center border-[3px] sm:border-[4px] border-black">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-2 opacity-80 decoration-2 underline-offset-8">หมายเลขคิวของคุณ</div>
            <div className="text-[5rem] sm:text-[8rem] font-black tabular-nums tracking-tighter leading-none py-2">{result.queueNumber.toString().padStart(2, '0')}</div>
            <p className="text-[10px] sm:text-xs mt-4 font-bold tracking-widest opacity-60 uppercase border-t-[2px] border-white/20 pt-4 inline-block">ไปที่หน้าแรกเพื่อดูสถานะคิวของคุณ</p>
          </div>
        )}
        
        {result.status === RequestStatus.REJECTED && result.rejectReason && (
          <div className="bg-white text-black border-[3px] sm:border-[4px] border-black p-6 sm:p-8 text-center text-sm sm:text-base">
            <div className="font-bold uppercase tracking-widest mb-2">เหตุผลที่ถูกปฏิเสธ</div>
            <div className="font-serif italic border-l-4 border-black pl-4 text-left inline-block max-w-full">{result.rejectReason}</div>
          </div>
        )}
        
        {result.status === RequestStatus.PENDING && (
          <div className="bg-white border-[3px] sm:border-[4px] border-black p-6 sm:p-8 border-dashed flex items-center justify-center gap-4">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-black rounded-full animate-pulse"></div>
            <p className="text-xs sm:text-base font-black uppercase tracking-widest">รอการอนุมัติ</p>
          </div>
        )}
      </animated.div>
    );
  };

  const renderHistory = () => {
    if (!mounted || entries.length === 0) return null;

    return (
      <div className="border-[3px] sm:border-[6px] border-black mt-4 sm:mt-6">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-black text-white">
          <h3 className="text-sm sm:text-lg font-black uppercase tracking-widest flex items-center gap-2"><ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" /> ประวัติคำขอ ({entries.length})</h3>
          <button onClick={clearAll} className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">ล้าง</button>
        </div>
        <div className="divide-y-[2px] sm:divide-y-[3px] divide-black">
          {entries.map((entry) => (
            <div key={entry.code} onClick={() => searchByCode(entry.code)}
              className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-100 transition-colors text-left group cursor-pointer">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <span className="font-black text-sm sm:text-2xl font-mono tracking-widest shrink-0">{entry.code}</span>
                <span className="text-[10px] sm:text-sm font-bold uppercase truncate opacity-60">{entry.customerName}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-[10px] sm:text-xs opacity-40 font-bold hidden sm:inline">{new Date(entry.createdAt).toLocaleDateString('th-TH')}</span>
                <span className="text-sm sm:text-lg opacity-30 group-hover:opacity-100 transition-opacity">→</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeEntry(entry.code); }}
                  className="text-[10px] sm:text-xs opacity-30 hover:opacity-100 hover:text-red-500 transition-all ml-1 p-1 border-[2px] border-transparent hover:border-black rounded-full">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full font-serif p-3 sm:p-6 md:p-10 bg-white text-black overflow-x-hidden selection:bg-black selection:text-white absolute inset-0 max-w-full">
      <div className="max-w-[700px] mx-auto space-y-6 sm:space-y-10 flex flex-col pt-8">
        <header className="border-b-[3px] sm:border-b-[8px] border-black pb-4 sm:pb-8">
          <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter leading-none">ขอบัตรคิว</h1>
          <p className="text-xs sm:text-lg font-bold uppercase tracking-widest mt-2 sm:mt-4 opacity-60">กรอกรหัสติดตามเพื่อเช็คสถานะคำขอของคุณ</p>
        </header>

        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4 w-full">
          <input type="text" value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
            maxLength={6} placeholder="กรอกรหัส 6 หลัก"
            className="flex-1 min-w-0 px-3 sm:px-6 py-3 sm:py-5 border-[3px] sm:border-[6px] border-black font-black text-lg sm:text-3xl tracking-[0.1em] sm:tracking-[0.2em] text-center uppercase focus:outline-none w-full" />
          <button type="submit" disabled={loading}
            className="px-4 sm:px-8 py-3 sm:py-5 bg-black text-white font-black uppercase tracking-widest border-[3px] sm:border-[6px] border-black hover:bg-white hover:text-black transition-colors text-sm sm:text-lg disabled:opacity-40 whitespace-nowrap active:scale-95 shrink-0 flex items-center justify-center gap-2">
            {loading ? '...' : <><Search className="w-5 h-5 sm:w-6 sm:h-6" /> ค้นหา</>}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border-[3px] sm:border-[6px] border-red-500 p-4 sm:p-6 text-center font-bold text-red-600 uppercase">{error}</div>
        )}

        {renderResultCard()}

        {searched && !result && !loading && !error && (
          <div className="p-6 sm:p-12 border-[3px] sm:border-[6px] border-dashed border-gray-300 text-center font-bold text-lg sm:text-2xl uppercase text-gray-400">ไม่พบคำขอ</div>
        )}

        {renderHistory()}
      </div>
    </div>
  );
}
