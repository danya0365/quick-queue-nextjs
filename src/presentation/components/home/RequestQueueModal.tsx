'use client';

import { CreateQueueRequestData, ServiceType } from '@/src/domain/types/queue';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useTrackingHistory } from '@/src/presentation/hooks/useTrackingHistory';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface RequestQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MathChallenge {
  question: string;
  token: string;
}

export function RequestQueueModal({ isOpen, onClose }: RequestQueueModalProps) {
  const { template } = useTemplate();
  const addTrackingEntry = useTrackingHistory((s) => s.addEntry);

  const [customerName, setCustomerName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.GENERAL);
  const [note, setNote] = useState('');
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challenge, setChallenge] = useState<MathChallenge | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const fetchChallenge = useCallback(async () => {
    try {
      const res = await fetch('/api/queue-requests/challenge');
      if (res.ok) {
        const data = await res.json();
        setChallenge(data);
      }
    } catch {
      // silent
    }
  }, []);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setCustomerName('');
      setServiceType(ServiceType.GENERAL);
      setNote('');
      setChallengeAnswer('');
      setError(null);
      setSuccessCode(null);
      fetchChallenge();
    }
  }, [isOpen, fetchChallenge]);

  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { tension: 300, friction: 25 },
  });

  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1) translateY(0px)' : 'scale(0.95) translateY(20px)',
    config: { tension: 300, friction: 25 },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!challenge) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateQueueRequestData & { challengeToken: string; challengeAnswer: number } = {
        customerName: customerName.trim(),
        serviceType,
        note: note.trim() || undefined,
        challengeToken: challenge.token,
        challengeAnswer: Number(challengeAnswer),
      };

      const res = await fetch('/api/queue-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด');
        // Refresh challenge on failure
        fetchChallenge();
        setChallengeAnswer('');
        return;
      }

      setSuccessCode(data.trackingCode);
      // Save to history
      addTrackingEntry({ code: data.trackingCode, customerName: customerName.trim() });
    } catch {
      setError('เกิดข้อผิดพลาดในการส่งคำขอ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypes = [
    { value: ServiceType.GENERAL, label: '📋 ทั่วไป' },
    { value: ServiceType.EXPRESS, label: '⚡ ด่วน' },
    { value: ServiceType.VIP, label: '👑 VIP' },
  ];

  // ─── Success state ───
  if (successCode) {
    return (
      <animated.div style={overlaySpring} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <animated.div style={modalSpring} className="relative z-10 w-full max-w-md">
          {template === 'editorial' ? (
            <div className="bg-white border-[6px] border-black p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-black uppercase mb-2">ส่งคำขอสำเร็จ!</h2>
              <p className="text-sm uppercase tracking-widest mb-6 opacity-60">กรุณาจดรหัสติดตามของคุณ</p>
              <div className="bg-black text-white p-6 mb-6">
                <div className="text-sm font-bold uppercase tracking-widest mb-2 opacity-60">รหัสติดตาม</div>
                <div className="text-5xl font-black tracking-[0.3em] font-mono">{successCode}</div>
              </div>
              <p className="text-xs uppercase tracking-widest mb-6 opacity-60">ใช้รหัสนี้ที่หน้า &quot;ขอบัตรคิว&quot; เพื่อเช็คสถานะ</p>
              <button onClick={onClose} className="w-full py-4 bg-black text-white font-black uppercase tracking-widest border-[4px] border-black hover:bg-white hover:text-black transition-colors">
                ปิด
              </button>
            </div>
          ) : template === 'retroTechMagazine' ? (
            <div className="bg-zinc-900 border-2 border-cyan-400 p-8 text-center text-cyan-400 font-mono">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold uppercase mb-2">ส่งคำขอสำเร็จ!</h2>
              <p className="text-sm mb-6 opacity-60">กรุณาจดรหัสติดตามของคุณ</p>
              <div className="bg-black border border-cyan-400 p-6 mb-6">
                <div className="text-xs uppercase mb-2 opacity-60">TRACKING CODE</div>
                <div className="text-5xl font-bold tracking-[0.3em]">{successCode}</div>
              </div>
              <p className="text-xs mb-6 opacity-60">ใช้รหัสนี้ที่หน้า &quot;ขอบัตรคิว&quot; เพื่อเช็คสถานะ</p>
              <button onClick={onClose} className="w-full py-3 bg-cyan-400 text-black font-bold uppercase border border-cyan-400 hover:bg-transparent hover:text-cyan-400 transition-colors">
                ปิด
              </button>
            </div>
          ) : (
            <div className="bg-surface rounded-2xl p-8 text-center shadow-2xl">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">ส่งคำขอสำเร็จ!</h2>
              <p className="text-sm text-muted mb-6">กรุณาจดรหัสติดตามของคุณ</p>
              <div className="bg-primary/10 dark:bg-primary/20 rounded-xl p-6 mb-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">รหัสติดตาม</div>
                <div className="text-5xl font-black tracking-[0.3em] text-primary font-mono">{successCode}</div>
              </div>
              <p className="text-xs text-muted mb-6">ใช้รหัสนี้ที่หน้า &quot;ขอบัตรคิว&quot; เพื่อเช็คสถานะ</p>
              <button onClick={onClose} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">
                ปิด
              </button>
            </div>
          )}
        </animated.div>
      </animated.div>
    );
  }

  // ─── Form state ───
  return (
    <animated.div style={overlaySpring} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <animated.div style={modalSpring} className="relative z-10 w-full max-w-md">
        {template === 'editorial' ? (
          /* ═══ Editorial Template ═══ */
          <form onSubmit={handleSubmit} className="bg-white border-[6px] border-black p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-[4px] border-black">
              <h2 className="text-2xl font-black uppercase tracking-tight">ขอบัตรคิว</h2>
              <button type="button" onClick={onClose} className="text-3xl font-black hover:opacity-50 transition-opacity">&times;</button>
            </div>

            {error && (
              <div className="bg-red-50 border-[3px] border-red-500 p-3 mb-4 text-sm font-bold text-red-600 uppercase">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">ชื่อลูกค้า *</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required
                  className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:ring-0" placeholder="กรอกชื่อ" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">ประเภทบริการ</label>
                <div className="flex gap-2">
                  {serviceTypes.map((st) => (
                    <button key={st.value} type="button" onClick={() => setServiceType(st.value)}
                      className={`flex-1 py-2 px-2 text-xs font-bold uppercase border-[3px] border-black transition-colors ${serviceType === st.value ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">หมายเหตุ (ไม่บังคับ)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
                  className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none resize-none" placeholder="ข้อมูลเพิ่มเติม..." />
              </div>

              {/* Math Challenge */}
              <div className="bg-gray-100 border-[3px] border-black p-4">
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">🔒 ยืนยันตัวตน</label>
                {challenge ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black whitespace-nowrap">{challenge.question}</span>
                    <input type="number" value={challengeAnswer} onChange={(e) => setChallengeAnswer(e.target.value)} required
                      className="w-24 px-3 py-2 border-[3px] border-black font-bold text-center text-xl focus:outline-none" placeholder="?" />
                  </div>
                ) : (
                  <div className="text-sm opacity-60">กำลังโหลด...</div>
                )}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || !customerName.trim() || !challengeAnswer}
              className="w-full mt-6 py-4 bg-black text-white font-black uppercase tracking-widest border-[4px] border-black hover:bg-white hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {isSubmitting ? 'กำลังส่ง...' : 'ส่งขอบัตรคิว'}
            </button>
          </form>
        ) : template === 'retroTechMagazine' ? (
          /* ═══ Retro Tech Magazine Template ═══ */
          <form onSubmit={handleSubmit} className="bg-zinc-900 border-2 border-cyan-400 p-6 sm:p-8 font-mono text-cyan-400">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-cyan-400/50">
              <h2 className="text-xl font-bold uppercase">&gt; ขอบัตรคิว</h2>
              <button type="button" onClick={onClose} className="text-2xl hover:text-white transition-colors">&times;</button>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500 p-3 mb-4 text-sm text-red-400">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase mb-1 opacity-60">ชื่อลูกค้า *</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required
                  className="w-full px-4 py-2 bg-black border border-cyan-400/50 text-cyan-400 focus:outline-none focus:border-cyan-400" placeholder="กรอกชื่อ" />
              </div>

              <div>
                <label className="block text-xs uppercase mb-1 opacity-60">ประเภทบริการ</label>
                <div className="flex gap-2">
                  {serviceTypes.map((st) => (
                    <button key={st.value} type="button" onClick={() => setServiceType(st.value)}
                      className={`flex-1 py-2 text-xs uppercase border transition-colors ${serviceType === st.value ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-transparent border-cyan-400/30 hover:border-cyan-400'}`}>
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase mb-1 opacity-60">หมายเหตุ</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
                  className="w-full px-4 py-2 bg-black border border-cyan-400/50 text-cyan-400 focus:outline-none resize-none" placeholder="..." />
              </div>

              <div className="bg-black border border-cyan-400/50 p-4">
                <label className="block text-xs uppercase mb-2 opacity-60">🔒 CAPTCHA_</label>
                {challenge ? (
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold whitespace-nowrap">{challenge.question}</span>
                    <input type="number" value={challengeAnswer} onChange={(e) => setChallengeAnswer(e.target.value)} required
                      className="w-20 px-3 py-2 bg-zinc-900 border border-cyan-400 text-cyan-400 text-center text-lg focus:outline-none" placeholder="?" />
                  </div>
                ) : (
                  <div className="text-xs opacity-60">LOADING...</div>
                )}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || !customerName.trim() || !challengeAnswer}
              className="w-full mt-6 py-3 bg-cyan-400 text-black font-bold uppercase border border-cyan-400 hover:bg-transparent hover:text-cyan-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {isSubmitting ? 'PROCESSING...' : 'ส่งขอบัตรคิว'}
            </button>
          </form>
        ) : (
          /* ═══ Classic Template ═══ */
          <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">📝 ขอบัตรคิว</h2>
              <button type="button" onClick={onClose} className="text-2xl text-muted hover:text-foreground transition-colors">&times;</button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 text-sm text-red-600 dark:text-red-400">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">ชื่อลูกค้า *</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="กรอกชื่อ" />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">ประเภทบริการ</label>
                <div className="flex gap-2">
                  {serviceTypes.map((st) => (
                    <button key={st.value} type="button" onClick={() => setServiceType(st.value)}
                      className={`flex-1 py-2 px-2 text-sm rounded-xl border-2 transition-colors ${serviceType === st.value ? 'bg-primary text-white border-primary' : 'bg-background text-foreground border-border hover:border-primary/50'}`}>
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">หมายเหตุ (ไม่บังคับ)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="ข้อมูลเพิ่มเติม..." />
              </div>

              <div className="bg-background border border-border rounded-xl p-4">
                <label className="block text-sm font-medium text-muted mb-2">🔒 ยืนยันตัวตน</label>
                {challenge ? (
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-foreground whitespace-nowrap">{challenge.question}</span>
                    <input type="number" value={challengeAnswer} onChange={(e) => setChallengeAnswer(e.target.value)} required
                      className="w-24 px-3 py-2 rounded-xl border border-border bg-surface text-foreground text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="?" />
                  </div>
                ) : (
                  <div className="text-sm text-muted">กำลังโหลด...</div>
                )}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || !customerName.trim() || !challengeAnswer}
              className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {isSubmitting ? 'กำลังส่ง...' : '📨 ส่งขอบัตรคิว'}
            </button>
          </form>
        )}
      </animated.div>
    </animated.div>
  );
}
