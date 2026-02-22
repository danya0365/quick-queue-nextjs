import { QueueRequest, REQUEST_STATUS_CONFIG, RequestStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { Hourglass } from 'lucide-react';
import { FormEvent } from 'react';
import { animated } from 'react-spring';

export interface TrackRetroTechMagazineTemplateProps {
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

export function TrackRetroTechMagazineTemplate({
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
}: TrackRetroTechMagazineTemplateProps) {
  const statusConfig = result ? REQUEST_STATUS_CONFIG[result.status] : null;
  const serviceConfig = result ? SERVICE_TYPE_CONFIG[result.serviceType] : null;

  const renderResultCard = () => {
    if (!result || !statusConfig || !serviceConfig) return null;

    return (
      <animated.div style={resultSpring} className="bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 sm:p-8">
        <div className="flex justify-between items-start mb-6 pb-4 border-b-4 border-black">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-60">ชื่อลูกค้า</div>
            <div className="text-2xl font-black uppercase">{result.customerName}</div>
          </div>
          <div className="bg-black text-[#00FFFF] font-black px-3 py-1 text-lg tracking-widest font-mono border-2 border-[#FF00FF]">{result.trackingCode}</div>
        </div>
        <div className="my-6 sm:my-8 w-full z-10 relative group">
          <div className="relative p-1">
             <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3"></div>
             <div className={`relative border-4 border-black p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between transition-colors duration-300 ${
               result.status === RequestStatus.APPROVED ? 'bg-[#39FF14]' : 
               result.status === RequestStatus.REJECTED ? 'bg-[#FF00FF] text-white' : 'bg-[#00FFFF]'
             }`}>
               <div className="flex flex-col items-center sm:items-start text-center sm:text-left z-10">
                 <div className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-3 inline-block border-2 border-black shadow-[2px_2px_0_0_rgba(255,255,255,1)]">
                   &gt; STATUS_UPDATE
                 </div>
                 <div className={`text-4xl sm:text-5xl font-black uppercase tracking-tighter ${result.status === RequestStatus.REJECTED ? 'text-white' : 'text-black'}`} style={{ WebkitTextStroke: result.status === RequestStatus.REJECTED ? '2px black' : 'none' }}>
                   {statusConfig.label}_
                 </div>
                 <div className="mt-4 flex items-center gap-2 border-4 border-black px-3 py-1.5 font-bold uppercase text-sm tracking-widest bg-white text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-default">
                   <span>{serviceConfig.icon}</span>
                   <span>{serviceConfig.label}</span>
                 </div>
               </div>
               <div className="relative shrink-0 z-10">
                 <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white border-4 border-black rounded-full flex items-center justify-center text-5xl sm:text-7xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                   <div className="drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{statusConfig.icon}</div>
                 </div>
               </div>
               
               {/* Decorative elements */}
               <div className="absolute top-2 right-2 flex gap-1">
                 <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-black bg-white"></div>
                 <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-black bg-white"></div>
               </div>
               <div className={`absolute bottom-2 left-2 text-[10px] font-black tracking-widest opacity-80 ${result.status === RequestStatus.REJECTED ? 'text-white' : 'text-black'}`}>
                 SYS.TRACK.001
               </div>
             </div>
          </div>
        </div>
        {result.status === RequestStatus.APPROVED && result.queueNumber && (
          <div className="bg-[#39FF14] border-4 border-black p-6 text-center mt-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
            <div className="text-sm font-bold uppercase tracking-widest mb-2">หมายเลขคิว</div>
            <div className="text-7xl font-black tabular-nums tracking-tighter text-black">{result.queueNumber.toString().padStart(2, '0')}</div>
          </div>
        )}
        {result.status === RequestStatus.REJECTED && result.rejectReason && (
          <div className="bg-red-500 border-4 border-black p-4 mt-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <div className="text-xs font-bold uppercase text-black mb-1 bg-white inline-block px-1 border-2 border-black">เหตุผล</div>
            <div className="text-lg font-black text-white px-1 tracking-widest mt-1">{result.rejectReason}</div>
          </div>
        )}
        {result.status === RequestStatus.PENDING && (
          <div className="bg-[#00FFFF] border-4 border-black p-4 mt-4 text-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center gap-2">
            <Hourglass className="w-5 h-5" />
            <p className="font-black text-black uppercase tracking-widest">รอการอนุมัติ_</p>
          </div>
        )}
      </animated.div>
    );
  };

  const renderHistory = () => {
    if (!mounted || entries.length === 0) return null;

    return (
      <div className="border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[6px_6px_0_0_rgba(0,0,0,1)] bg-white mt-4 sm:mt-8">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black text-[#00FFFF] border-b-4 border-black">
          <h3 className="text-sm sm:text-lg font-black uppercase tracking-widest">&gt; HISTORY ({entries.length})_</h3>
          <button onClick={clearAll} className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[#FF00FF] transition-all border-2 border-transparent hover:border-[#FF00FF] px-1">CLEAR_ALL</button>
        </div>
        <div className="divide-y-[3px] divide-black">
          {entries.map((entry) => (
            <div key={entry.code} onClick={() => searchByCode(entry.code)}
              className="w-full flex items-center justify-between px-3 sm:px-6 py-3 hover:bg-[#00FFFF] transition-colors text-left group cursor-pointer">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <span className="font-black text-sm sm:text-xl font-mono tracking-widest bg-black text-[#00FFFF] px-2 py-0.5 shrink-0 border-2 border-transparent group-hover:border-black transition-colors">{entry.code}</span>
                <span className="text-[10px] sm:text-sm font-bold uppercase truncate opacity-60 group-hover:opacity-100 group-hover:text-black">{entry.customerName}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-2">
                <span className="text-[10px] sm:text-xs font-bold hidden sm:inline opacity-40 group-hover:opacity-100 group-hover:text-black">{new Date(entry.createdAt).toLocaleDateString('th-TH')}</span>
                <span className="text-sm sm:text-lg font-black opacity-30 group-hover:opacity-100 group-hover:text-black transition-all mx-1 sm:mx-2">&gt;</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeEntry(entry.code); }}
                  className="text-[10px] sm:text-xs font-black opacity-30 hover:opacity-100 hover:text-red-500 transition-all ml-1 bg-black text-white px-1.5 py-0.5 border-2 border-transparent hover:border-black group-hover:bg-transparent group-hover:text-red-600 group-hover:border-red-600">X</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full font-sans p-3 sm:p-8 overflow-y-auto overflow-x-hidden selection:bg-[#FF00FF] selection:text-white absolute inset-0 w-full"
      style={{ backgroundColor: '#f4f4f0', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px', color: '#111' }}>
      <div className="max-w-[700px] mx-auto space-y-6 sm:space-y-8 flex flex-col pt-4 sm:pt-8 w-full">
        <header className="border-b-4 sm:border-b-8 border-black pb-4 sm:pb-4 bg-white p-4 sm:p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[6px_6px_0_0_rgba(0,0,0,1)] inline-block mx-auto mb-2 sm:mb-4 w-full">
          <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter">
            TRACK<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]" style={{ WebkitTextStroke: '2px black' }}>QUEUE_</span>
          </h1>
          <p className="font-bold text-xs sm:text-sm uppercase tracking-widest mt-3 sm:mt-4 px-2 bg-black text-[#39FF14] inline-block border-2 border-black">ค้นหาสถานะคำขอของคุณ</p>
        </header>

        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 w-full">
          <input type="text" value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
            maxLength={6} placeholder="TRACKING CODE"
            className="flex-1 min-w-0 px-3 sm:px-4 py-3 sm:py-4 border-4 border-black font-black text-lg sm:text-2xl tracking-widest sm:tracking-[0.3em] text-center uppercase focus:outline-none bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all focus:-translate-y-1 focus:-translate-x-1" />
          <button type="submit" disabled={loading}
            className="px-5 sm:px-10 py-3 sm:py-4 bg-[#00FFFF] text-black font-black uppercase border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[#FF00FF] hover:text-white transition-all disabled:opacity-40 hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95 shrink-0">
            {loading ? '...' : '>'}
          </button>
        </form>

        {error && (
          <div className="border-4 border-black bg-red-500 p-4 font-black text-white uppercase text-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] tracking-widest">! {error} !</div>
        )}

        {renderResultCard()}

        {searched && !result && !loading && !error && (
           <div className="border-4 border-black bg-white p-6 sm:p-10 font-black text-black uppercase text-center shadow-[6px_6px_0_0_rgba(0,0,0,1)] tracking-widest">NO_DATA_FOUND_</div>
        )}

        {renderHistory()}
      </div>
    </div>
  );
}
