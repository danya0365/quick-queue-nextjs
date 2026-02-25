import { QUEUE_FORM_PRESETS } from '@/src/config/queue-form.config';
import { ServiceType } from '@/src/domain/types/queue';
import { CheckCircle2, ClipboardList, Crown, Edit3, Lock, Send, Zap } from 'lucide-react';
import { FormEvent } from 'react';
import { animated } from 'react-spring';

export interface RequestQueueClassicTemplateProps {
  onClose: () => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  serviceType: ServiceType;
  setServiceType: (service: ServiceType) => void;
  note: string;
  setNote: (note: string) => void;
  appendNote: (note: string) => void;
  clearNote: () => void;
  clearCustomerName: () => void;
  challengeAnswer: string;
  setChallengeAnswer: (answer: string) => void;
  challenge: { question: string } | null;
  isSubmitting: boolean;
  error: string | null;
  successCode: string | null;
  handleSubmit: (e: FormEvent) => void;
  modalSpring: any;
}

export function RequestQueueClassicTemplate({
  onClose,
  customerName,
  setCustomerName,
  serviceType,
  setServiceType,
  note,
  setNote,
  appendNote,
  clearNote,
  clearCustomerName,
  challengeAnswer,
  setChallengeAnswer,
  challenge,
  isSubmitting,
  error,
  successCode,
  handleSubmit,
  modalSpring,
}: RequestQueueClassicTemplateProps) {
  // ─── Success state ───
  if (successCode) {
    return (
      <animated.div style={modalSpring} onClick={(e) => e.stopPropagation()} className="relative z-10 w-full max-w-md">
        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
          
          <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/10">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">ส่งคำขอสำเร็จ!</h2>
          <p className="text-base text-muted mb-8">เราได้รับคำขอคิวของคุณเรียบร้อยแล้ว</p>
          
          <div className="bg-surface-alt border border-border rounded-xl p-6 mb-8 relative">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-border"></span>
              รหัสติดตาม
              <span className="w-8 h-px bg-border"></span>
            </div>
            <div className="text-4xl sm:text-5xl font-black tracking-[0.2em] text-primary font-mono select-all bg-background py-3 rounded-lg border border-border shadow-inner break-all">{successCode}</div>
          </div>
          
          <p className="text-sm text-muted mb-8 bg-surface inline-block px-4 py-2 rounded-lg border border-border">กรุณาจดรหัสเพื่อใช้เช็คสถานะ</p>
          
          <button onClick={onClose} className="w-full py-3.5 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] active:scale-95 text-base sm:text-lg">
            เข้าใจแล้ว
          </button>
        </div>
      </animated.div>
    );
  }

  // ─── Form state ───
  return (
    <animated.div
      style={modalSpring}
      onClick={(e) => e.stopPropagation()}
      className="
        relative w-full max-w-md
        bg-surface border border-border
        rounded-2xl shadow-2xl
        max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden
      "
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-foreground font-bold text-lg flex items-center gap-2"><Edit3 className="w-5 h-5" /> ขอบัตรคิว</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-foreground transition-colors p-1"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 flex justify-between items-end">
            <span>ชื่อลูกค้า <span className="text-red-500">*</span></span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="
                w-full px-4 py-2.5 pr-10 rounded-xl
                bg-surface-alt border border-border
                text-foreground text-sm
                placeholder:text-muted-light
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                transition-all duration-200
              "
              placeholder="กรอกชื่อของคุณ"
              autoFocus
            />
            {customerName && (
              <button
                type="button"
                onClick={clearCustomerName}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light hover:text-muted bg-transparent border-none p-1"
                title="เคลียร์"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {QUEUE_FORM_PRESETS.customerNames.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCustomerName(preset)}
                className="px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-alt hover:border-primary/30 transition-all"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-foreground mb-1.5">
            ประเภทบริการ
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: ServiceType.GENERAL, label: <span className="flex items-center justify-center gap-1.5"><ClipboardList className="w-4 h-4" /> ทั่วไป</span> },
              { value: ServiceType.EXPRESS, label: <span className="flex items-center justify-center gap-1.5"><Zap className="w-4 h-4" /> ด่วน</span> },
              { value: ServiceType.VIP, label: <span className="flex items-center justify-center gap-1.5"><Crown className="w-4 h-4" /> VIP</span> },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setServiceType(option.value)}
                className={`
                  px-3 py-2.5 rounded-xl text-sm font-medium
                  border transition-all duration-200
                  ${
                    serviceType === option.value
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-surface-alt border-border text-muted hover:text-foreground hover:border-border'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 flex justify-between items-end">
            <span>รายการสั่งซื้อ / หมายเหตุ <span className="text-muted text-xs font-normal">(ไม่บังคับ)</span></span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="
                w-full px-4 py-2.5 pr-10 rounded-xl
                bg-surface-alt border border-border
                text-foreground text-sm
                placeholder:text-muted-light
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                transition-all duration-200
              "
              placeholder="ข้อมูลเพิ่มเติม..."
            />
            {note && (
              <button
                type="button"
                onClick={clearNote}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light hover:text-muted bg-transparent border-none p-1"
                title="เคลียร์"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {QUEUE_FORM_PRESETS.notes.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => appendNote(preset)}
                className="px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-alt hover:border-primary/30 transition-all"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface-alt border border-border rounded-xl p-4 mt-2">
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
            <Lock className="w-4 h-4" /> ยืนยันตัวตน <span className="text-red-500">*</span>
          </label>
          {challenge ? (
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-foreground whitespace-nowrap bg-surface border border-border px-4 py-2 rounded-lg">{challenge.question}</span>
              <input type="number" value={challengeAnswer} onChange={(e) => setChallengeAnswer(e.target.value)} required
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-foreground text-center text-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200" placeholder="?" />
            </div>
          ) : (
            <div className="text-sm text-muted animate-pulse">กำลังโหลด...</div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting || !customerName.trim() || !challengeAnswer}
          className="w-full mt-4 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isSubmitting ? 'กำลังส่ง...' : <><Send className="w-5 h-5" /> ส่งขอบัตรคิว</>}
        </button>
      </form>
    </animated.div>
  );
}
