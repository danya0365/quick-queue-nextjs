'use client';

import { QueueRequest, REQUEST_STATUS_CONFIG, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { CheckCircle2, Edit3, Hourglass, XCircle } from 'lucide-react';
import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface PendingRequestsSectionProps {
  requests: QueueRequest[];
  totalCount: number;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => void;
}

export function PendingRequestsSection({ requests, totalCount, onApprove, onReject }: PendingRequestsSectionProps) {
  const { template } = useTemplate();
  const [approvingId, setApprovingId] = useState<string | null>(null);

  if (requests.length === 0) return null;

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await onApprove(id);
    } finally {
      setApprovingId(null);
    }
  };

  const statusConfig = REQUEST_STATUS_CONFIG;

  // ═══ Editorial ═══
  if (template === 'editorial') {
    return (
      <div className="border-[3px] sm:border-[6px] border-amber-500 p-3 sm:p-6 bg-amber-50">
        <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-[3px] sm:border-b-[4px] border-amber-500">
          <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-amber-800 flex items-center gap-2">
            <Hourglass className="w-5 h-5 sm:w-6 sm:h-6" /> ขอบัตรคิว ({totalCount > 0 ? totalCount : requests.length})
          </h3>
          {totalCount > requests.length && (
            <a href="/admin/pending-requests" className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-800 hover:text-black hover:underline underline-offset-4 decoration-[2px] transition-colors">
              ดูทั้งหมด ({totalCount}) ↗
            </a>
          )}
        </div>
        <div className="space-y-2 sm:space-y-3">
          {requests.map((req) => {
            const serviceConfig = SERVICE_TYPE_CONFIG[req.serviceType];
            return (
              <div key={req.id} className="border-[2px] sm:border-[3px] border-black p-2 sm:p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-black text-base sm:text-lg uppercase truncate">{req.customerName}</div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase px-1.5 sm:px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-700">{statusConfig.pending.label}</span>
                    <span className="text-[10px] sm:text-xs font-bold uppercase opacity-60">{serviceConfig.icon} {serviceConfig.label}</span>
                    <span className="text-[10px] sm:text-xs font-bold uppercase opacity-40 font-mono">{req.trackingCode}</span>
                  </div>
                  {req.note && <p className="text-xs sm:text-sm mt-1 opacity-60 truncate flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5" /> {req.note}</p>}
                </div>
                <div className="flex gap-1.5 sm:gap-2 shrink-0">
                  <button onClick={() => handleApprove(req.id)} disabled={approvingId === req.id}
                    className="px-2 sm:px-4 py-1.5 sm:py-2 bg-emerald-500 text-white font-bold uppercase text-[10px] sm:text-xs border-[2px] border-emerald-700 hover:bg-emerald-600 transition-colors disabled:opacity-40 flex items-center gap-1">
                    {approvingId === req.id ? '...' : <><CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> อนุมัติ</>}
                  </button>
                  <button onClick={() => onReject(req.id)}
                    className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white font-bold uppercase text-[10px] sm:text-xs border-[2px] border-red-700 hover:bg-red-600 transition-colors flex items-center gap-1">
                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> ปฏิเสธ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══ RetroTechMagazine ═══
  if (template === 'retroTechMagazine') {
    return (
      <div className="border-4 border-[#FF00FF] shadow-[6px_6px_0_0_rgba(255,0,255,0.5)] p-4 sm:p-6 bg-white">
        <div className="flex items-center justify-between mb-4 pb-3 border-b-4 border-[#FF00FF]">
          <h3 className="text-xl sm:text-2xl font-black uppercase bg-[#FF00FF] text-white px-3 py-1 flex items-center gap-2">
            <Hourglass className="w-5 h-5 sm:w-6 sm:h-6" /> PENDING ({totalCount > 0 ? totalCount : requests.length})
          </h3>
          {totalCount > requests.length && (
            <a href="/admin/pending-requests" className="text-xs sm:text-sm font-black uppercase text-black hover:bg-[#FF00FF] hover:text-white border-2 border-transparent hover:border-black px-2 py-1 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-[#00FFFF]">
              VIEW ALL_ ↗
            </a>
          )}
        </div>
        <div className="space-y-3">
          {requests.map((req) => {
            const serviceConfig = SERVICE_TYPE_CONFIG[req.serviceType];
            return (
              <div key={req.id} className="border-4 border-black p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all bg-white">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#FF00FF]"></div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base sm:text-lg uppercase truncate">{req.customerName}</div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 bg-[#FF00FF] text-white">{statusConfig.pending.label}</span>
                    <span className="text-xs font-bold uppercase opacity-60">{serviceConfig.icon} {serviceConfig.label}</span>
                    <span className="text-xs font-bold uppercase opacity-40 font-mono bg-black text-[#00FFFF] px-1">{req.trackingCode}</span>
                  </div>
                  {req.note && <p className="text-sm mt-1 opacity-60 truncate flex items-center gap-1.5"><Edit3 className="w-4 h-4" /> {req.note}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleApprove(req.id)} disabled={approvingId === req.id}
                    className="px-3 sm:px-4 py-2 bg-[#39FF14] text-black font-bold uppercase text-xs border-2 border-black hover:bg-[#00FFFF] transition-colors disabled:opacity-40 shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center gap-1.5">
                    {approvingId === req.id ? '...' : <><CheckCircle2 className="w-4 h-4" /> APPROVE</>}
                  </button>
                  <button onClick={() => onReject(req.id)}
                    className="px-3 sm:px-4 py-2 bg-red-500 text-white font-bold uppercase text-xs border-2 border-black hover:bg-red-600 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> REJECT
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══ Classic ═══
  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
          <Hourglass className="w-4 h-4" /> ขอบัตรคิวรอการอนุมัติ ({totalCount > 0 ? totalCount : requests.length})
        </h3>
        {totalCount > requests.length && (
          <a href="/admin/pending-requests" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors bg-primary/10 px-3 py-1.5 rounded-full">
            ดูทั้งหมด ({totalCount}) →
          </a>
        )}
      </div>
      <div className="space-y-2">
        {requests.map((req) => {
          const serviceConfig = SERVICE_TYPE_CONFIG[req.serviceType];
          return (
            <div key={req.id} className="bg-surface rounded-xl border border-border p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground truncate">{req.customerName}</div>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] sm:text-xs rounded-full px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium">{statusConfig.pending.icon} {statusConfig.pending.label}</span>
                  <span className="text-[10px] sm:text-xs text-muted">{serviceConfig.icon} {serviceConfig.label}</span>
                  <span className="text-[10px] sm:text-xs text-muted font-mono">{req.trackingCode}</span>
                </div>
                {req.note && <p className="text-xs text-muted mt-0.5 truncate flex items-center gap-1.5"><Edit3 className="w-3 h-3" /> {req.note}</p>}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => handleApprove(req.id)} disabled={approvingId === req.id}
                  className="px-2.5 sm:px-3 py-1.5 bg-emerald-500 text-white text-[10px] sm:text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-40 flex items-center gap-1">
                  {approvingId === req.id ? '...' : <><CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> อนุมัติ</>}
                </button>
                <button onClick={() => onReject(req.id)}
                  className="px-2.5 sm:px-3 py-1.5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1">
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> ปฏิเสธ
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Reject Reason Modal ───

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}

export function RejectReasonModal({ isOpen, onClose, onReject }: RejectReasonModalProps) {
  const { template } = useTemplate();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { tension: 300, friction: 25 },
  });

  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
    config: { tension: 300, friction: 25 },
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setIsSubmitting(true);
    onReject(reason.trim());
    setReason('');
    setIsSubmitting(false);
  };

  return (
    <animated.div style={overlaySpring} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <animated.div style={modalSpring} className="relative z-10 w-full max-w-md">
        {template === 'editorial' ? (
          <div className="bg-white border-[6px] border-black p-6 sm:p-8">
            <h2 className="text-xl font-black uppercase mb-4 pb-3 border-b-[4px] border-black">เหตุผลในการปฏิเสธ</h2>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
              className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none resize-none mb-4" placeholder="ระบุเหตุผล..." />
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-3 border-[3px] border-black font-bold uppercase hover:bg-gray-100 transition-colors">ยกเลิก</button>
              <button onClick={handleSubmit} disabled={!reason.trim() || isSubmitting}
                className="flex-1 py-3 bg-red-500 text-white border-[3px] border-red-700 font-bold uppercase hover:bg-red-600 transition-colors disabled:opacity-40">
                ปฏิเสธ
              </button>
            </div>
          </div>
        ) : template === 'retroTechMagazine' ? (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 sm:p-8">
            <h2 className="text-xl font-black uppercase mb-4 pb-3 border-b-4 border-black bg-red-500 text-white px-3 py-1 inline-block">REJECT REASON</h2>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
              className="w-full px-4 py-3 border-4 border-black font-bold focus:outline-none resize-none mb-4 mt-4" placeholder="ระบุเหตุผล..." />
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-3 border-4 border-black font-bold uppercase hover:bg-gray-100 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]">CANCEL</button>
              <button onClick={handleSubmit} disabled={!reason.trim() || isSubmitting}
                className="flex-1 py-3 bg-red-500 text-white border-4 border-black font-bold uppercase hover:bg-red-600 transition-colors disabled:opacity-40 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                REJECT
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-lg font-bold text-foreground mb-4">เหตุผลในการปฏิเสธ</h2>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4" placeholder="ระบุเหตุผล..." />
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-3 border border-border rounded-xl font-medium hover:bg-surface-alt transition-colors">ยกเลิก</button>
              <button onClick={handleSubmit} disabled={!reason.trim() || isSubmitting}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-40">
                ปฏิเสธ
              </button>
            </div>
          </div>
        )}
      </animated.div>
    </animated.div>
  );
}
