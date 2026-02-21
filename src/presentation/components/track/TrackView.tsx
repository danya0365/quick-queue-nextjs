'use client';

import { QueueRequest, REQUEST_STATUS_CONFIG, RequestStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useTrackingHistory } from '@/src/presentation/hooks/useTrackingHistory';
import { FormEvent, useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

export function TrackView() {
  const { template } = useTemplate();
  const { entries, removeEntry, clearAll } = useTrackingHistory();
  const [trackingCode, setTrackingCode] = useState('');
  const [result, setResult] = useState<(QueueRequest & { queueNumber?: number }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for Zustand persisted state
  useEffect(() => { setMounted(true); }, []);

  const resultSpring = useSpring({
    opacity: result ? 1 : 0,
    transform: result ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 200, friction: 20 },
  });

  const searchByCode = async (code: string) => {
    const c = code.trim().toUpperCase();
    if (!c || c.length !== 6) {
      setError('กรุณากรอกรหัสติดตาม 6 หลัก');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSearched(true);
    setTrackingCode(c);

    try {
      const res = await fetch(`/api/queue-requests/track/${c}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'ไม่พบคำขอนี้');
        return;
      }

      setResult(data);
    } catch {
      setError('เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await searchByCode(trackingCode);
  };

  const statusConfig = result ? REQUEST_STATUS_CONFIG[result.status] : null;
  const serviceConfig = result ? SERVICE_TYPE_CONFIG[result.serviceType] : null;

  // ─── Shared Result Card ───
  const renderResultCard = () => {
    if (!result || !statusConfig || !serviceConfig) return null;

    // ═══ Editorial ═══
    if (template === 'editorial') {
      return (
        <animated.div style={resultSpring} className="border-[3px] sm:border-[6px] border-black p-4 sm:p-8">
          <div className="flex justify-between items-start mb-4 sm:mb-6 pb-4 sm:pb-6 border-b-[3px] sm:border-b-[6px] border-black">
            <div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-60">ชื่อลูกค้า</div>
              <div className="text-xl sm:text-3xl font-black uppercase">{result.customerName}</div>
            </div>
            <div className="text-right">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-60">รหัส</div>
              <div className="text-xl sm:text-3xl font-black font-mono tracking-widest">{result.trackingCode}</div>
            </div>
          </div>
          <div className="text-center py-4 sm:py-8">
            <div className="text-4xl sm:text-6xl mb-2">{statusConfig.icon}</div>
            <div className="text-lg sm:text-2xl font-black uppercase">{statusConfig.label}</div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest mt-1 opacity-60">{serviceConfig.icon} {serviceConfig.label}</div>
          </div>
          {result.status === RequestStatus.APPROVED && result.queueNumber && (
            <div className="bg-black text-white p-4 sm:p-8 text-center mt-4 sm:mt-6">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-2 opacity-60">หมายเลขคิวของคุณ</div>
              <div className="text-6xl sm:text-8xl font-black tabular-nums tracking-tighter">{result.queueNumber.toString().padStart(2, '0')}</div>
              <p className="text-xs sm:text-sm mt-4 opacity-60 uppercase">ไปที่หน้าแรกเพื่อดูสถานะคิวของคุณ</p>
            </div>
          )}
          {result.status === RequestStatus.REJECTED && result.rejectReason && (
            <div className="bg-red-50 border-[3px] sm:border-[4px] border-red-500 p-4 sm:p-6 mt-4 sm:mt-6">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-red-600 mb-1">เหตุผล</div>
              <div className="text-sm sm:text-lg font-bold text-red-700">{result.rejectReason}</div>
            </div>
          )}
          {result.status === RequestStatus.PENDING && (
            <div className="bg-amber-50 border-[3px] sm:border-[4px] border-amber-500 p-4 sm:p-6 mt-4 sm:mt-6 text-center">
              <p className="text-sm sm:text-lg font-bold text-amber-700 uppercase">คำขอของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ</p>
            </div>
          )}
        </animated.div>
      );
    }

    // ═══ RetroTechMagazine ═══
    if (template === 'retroTechMagazine') {
      return (
        <animated.div style={resultSpring} className="bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6 pb-4 border-b-4 border-black">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-60">ชื่อลูกค้า</div>
              <div className="text-2xl font-black uppercase">{result.customerName}</div>
            </div>
            <div className="bg-black text-[#00FFFF] font-black px-3 py-1 text-lg tracking-widest font-mono">{result.trackingCode}</div>
          </div>
          <div className="text-center py-6">
            <div className="text-5xl mb-2">{statusConfig.icon}</div>
            <div className="text-2xl font-black uppercase">{statusConfig.label}</div>
            <div className="text-sm font-bold uppercase mt-1 opacity-60">{serviceConfig.icon} {serviceConfig.label}</div>
          </div>
          {result.status === RequestStatus.APPROVED && result.queueNumber && (
            <div className="bg-[#39FF14] border-4 border-black p-6 text-center mt-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <div className="text-sm font-bold uppercase tracking-widest mb-2">หมายเลขคิว</div>
              <div className="text-7xl font-black tabular-nums tracking-tighter text-black">{result.queueNumber.toString().padStart(2, '0')}</div>
            </div>
          )}
          {result.status === RequestStatus.REJECTED && result.rejectReason && (
            <div className="bg-red-100 border-4 border-red-600 p-4 mt-4">
              <div className="text-xs font-bold uppercase text-red-700 mb-1">เหตุผล</div>
              <div className="text-lg font-bold text-red-800">{result.rejectReason}</div>
            </div>
          )}
          {result.status === RequestStatus.PENDING && (
            <div className="bg-[#00FFFF] border-4 border-black p-4 mt-4 text-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <p className="font-bold text-black uppercase">⏳ รอการอนุมัติจากผู้ดูแลระบบ</p>
            </div>
          )}
        </animated.div>
      );
    }

    // ═══ Classic ═══
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
            <div className="text-5xl sm:text-7xl font-black tabular-nums tracking-tighter text-emerald-600 dark:text-emerald-400">{result.queueNumber.toString().padStart(2, '0')}</div>
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
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">⏳ คำขอของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ</p>
          </div>
        )}
      </animated.div>
    );
  };

  // ─── Shared History List ───
  const renderHistory = () => {
    if (!mounted || entries.length === 0) return null;

    // ═══ Editorial ═══
    if (template === 'editorial') {
      return (
        <div className="border-[3px] sm:border-[6px] border-black">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-black text-white">
            <h3 className="text-sm sm:text-lg font-black uppercase tracking-widest">📋 ประวัติคำขอ ({entries.length})</h3>
            <button onClick={clearAll} className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">ล้าง</button>
          </div>
          <div className="divide-y-[2px] sm:divide-y-[3px] divide-black">
            {entries.map((entry) => (
              <button key={entry.code} onClick={() => searchByCode(entry.code)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-100 transition-colors text-left group">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span className="font-black text-lg sm:text-2xl font-mono tracking-widest shrink-0">{entry.code}</span>
                  <span className="text-xs sm:text-sm font-bold uppercase truncate opacity-60">{entry.customerName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] sm:text-xs opacity-40 font-bold hidden sm:inline">{new Date(entry.createdAt).toLocaleDateString('th-TH')}</span>
                  <span className="text-sm sm:text-lg opacity-30 group-hover:opacity-100 transition-opacity">→</span>
                  <button onClick={(e) => { e.stopPropagation(); removeEntry(entry.code); }}
                    className="text-xs opacity-30 hover:opacity-100 hover:text-red-500 transition-all ml-1">✕</button>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ═══ RetroTechMagazine ═══
    if (template === 'retroTechMagazine') {
      return (
        <div className="border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black text-[#00FFFF]">
            <h3 className="text-sm sm:text-lg font-black uppercase tracking-widest">📋 HISTORY ({entries.length})</h3>
            <button onClick={clearAll} className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[#FF00FF] transition-all">CLEAR</button>
          </div>
          <div className="divide-y-[3px] divide-black">
            {entries.map((entry) => (
              <button key={entry.code} onClick={() => searchByCode(entry.code)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-[#00FFFF]/10 transition-colors text-left group">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-black text-lg sm:text-xl font-mono tracking-widest bg-black text-[#00FFFF] px-2 py-0.5 shrink-0">{entry.code}</span>
                  <span className="text-xs sm:text-sm font-bold uppercase truncate opacity-60">{entry.customerName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] sm:text-xs opacity-40 font-bold hidden sm:inline">{new Date(entry.createdAt).toLocaleDateString('th-TH')}</span>
                  <span className="text-lg font-black opacity-30 group-hover:opacity-100 group-hover:text-[#FF00FF] transition-all">→</span>
                  <button onClick={(e) => { e.stopPropagation(); removeEntry(entry.code); }}
                    className="text-xs opacity-30 hover:opacity-100 hover:text-red-500 transition-all ml-1">✕</button>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ═══ Classic ═══
    return (
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">📋 ประวัติคำขอ ({entries.length})</h3>
          <button onClick={clearAll} className="text-[10px] sm:text-xs text-muted hover:text-red-500 font-medium transition-colors">ล้างทั้งหมด</button>
        </div>
        <div className="divide-y divide-border">
          {entries.map((entry) => (
            <button key={entry.code} onClick={() => searchByCode(entry.code)}
              className="w-full flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-surface-alt transition-colors text-left group">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <span className="font-bold text-base sm:text-lg font-mono tracking-widest text-primary shrink-0">{entry.code}</span>
                <span className="text-xs sm:text-sm text-muted truncate">{entry.customerName}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] sm:text-xs text-muted hidden sm:inline">{new Date(entry.createdAt).toLocaleDateString('th-TH')}</span>
                <span className="text-muted group-hover:text-primary transition-colors">→</span>
                <button onClick={(e) => { e.stopPropagation(); removeEntry(entry.code); }}
                  className="text-xs text-muted hover:text-red-500 transition-colors ml-1">✕</button>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ═══ Editorial Template ═══
  if (template === 'editorial') {
    return (
      <div className="min-h-full font-serif p-3 sm:p-6 md:p-10 bg-white text-black overflow-x-hidden selection:bg-black selection:text-white">
        <div className="max-w-[700px] mx-auto space-y-6 sm:space-y-10">
          <header className="border-b-[3px] sm:border-b-[8px] border-black pb-4 sm:pb-8">
            <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter leading-none">ขอบัตรคิว</h1>
            <p className="text-xs sm:text-lg font-bold uppercase tracking-widest mt-2 sm:mt-4 opacity-60">กรอกรหัสติดตามเพื่อเช็คสถานะคำขอของคุณ</p>
          </header>

          <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4">
            <input type="text" value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              maxLength={6} placeholder="กรอกรหัส 6 หลัก"
              className="flex-1 px-4 sm:px-6 py-3 sm:py-5 border-[3px] sm:border-[6px] border-black font-black text-xl sm:text-3xl tracking-[0.2em] text-center uppercase focus:outline-none" />
            <button type="submit" disabled={loading}
              className="px-4 sm:px-8 py-3 sm:py-5 bg-black text-white font-black uppercase tracking-widest border-[3px] sm:border-[6px] border-black hover:bg-white hover:text-black transition-colors text-sm sm:text-lg disabled:opacity-40 whitespace-nowrap">
              {loading ? '...' : '🔍 ค้นหา'}
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

  // ═══ RetroTechMagazine Template ═══
  if (template === 'retroTechMagazine') {
    return (
      <div className="min-h-full font-sans p-4 sm:p-8 overflow-y-auto selection:bg-[#FF00FF] selection:text-white"
        style={{ backgroundColor: '#f4f4f0', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px', color: '#111' }}>
        <div className="max-w-[700px] mx-auto space-y-8">
          <header className="border-b-8 border-black pb-4">
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">
              TRACK<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]" style={{ WebkitTextStroke: '2px black' }}>QUEUE</span>
            </h1>
            <p className="font-bold text-sm uppercase tracking-widest mt-2 px-2 bg-black text-white inline-block">ค้นหาสถานะคำขอของคุณ</p>
          </header>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input type="text" value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              maxLength={6} placeholder="TRACKING CODE"
              className="flex-1 px-4 py-4 border-4 border-black font-black text-2xl tracking-[0.3em] text-center uppercase focus:outline-none bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]" />
            <button type="submit" disabled={loading}
              className="px-6 py-4 bg-[#00FFFF] text-black font-black uppercase border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[#FF00FF] hover:text-white transition-colors disabled:opacity-40">
              {loading ? '...' : '🔍'}
            </button>
          </form>

          {error && (
            <div className="border-4 border-red-600 bg-red-100 p-4 font-bold text-red-700 uppercase text-center shadow-[4px_4px_0_0_rgba(220,38,38,1)]">{error}</div>
          )}

          {renderResultCard()}

          {renderHistory()}
        </div>
      </div>
    );
  }

  // ═══ Classic Template ═══
  return (
    <div className="h-full flex flex-col p-3 sm:p-6 gap-3 sm:gap-5 overflow-y-auto">
      <div className="max-w-[600px] mx-auto w-full space-y-4 sm:space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">📋 ขอบัตรคิว</h1>
          <p className="text-sm text-muted mt-1">กรอกรหัสติดตามเพื่อเช็คสถานะคำขอของคุณ</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
          <input type="text" value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
            maxLength={6} placeholder="กรอกรหัส 6 หลัก"
            className="flex-1 px-4 py-3 sm:py-4 rounded-xl border-2 border-border bg-background text-foreground font-bold text-xl sm:text-2xl tracking-[0.2em] text-center uppercase focus:outline-none focus:ring-2 focus:ring-primary" />
          <button type="submit" disabled={loading}
            className="px-4 sm:px-6 py-3 sm:py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 whitespace-nowrap">
            {loading ? '...' : '🔍 ค้นหา'}
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
