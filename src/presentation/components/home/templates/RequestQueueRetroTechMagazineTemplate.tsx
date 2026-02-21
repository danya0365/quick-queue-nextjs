import { ServiceType } from '@/src/domain/types/queue';
import { FormEvent } from 'react';
import { animated } from 'react-spring';

export interface RequestQueueRetroTechMagazineTemplateProps {
  onClose: () => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  serviceType: ServiceType;
  setServiceType: (service: ServiceType) => void;
  note: string;
  setNote: (note: string | ((prev: string) => string)) => void;
  challengeAnswer: string;
  setChallengeAnswer: (answer: string) => void;
  challenge: { question: string } | null;
  isSubmitting: boolean;
  error: string | null;
  successCode: string | null;
  handleSubmit: (e: FormEvent) => void;
  modalSpring: any;
}

export function RequestQueueRetroTechMagazineTemplate({
  onClose,
  customerName,
  setCustomerName,
  serviceType,
  setServiceType,
  note,
  setNote,
  challengeAnswer,
  setChallengeAnswer,
  challenge,
  isSubmitting,
  error,
  successCode,
  handleSubmit,
  modalSpring,
}: RequestQueueRetroTechMagazineTemplateProps) {
  // ─── Success state ───
  if (successCode) {
    return (
      <animated.div style={modalSpring} onClick={(e) => e.stopPropagation()} className="relative z-10 w-full max-w-md">
        <div className="bg-zinc-900 border-8 border-cyan-400 p-8 text-center text-cyan-400 font-mono shadow-[12px_12px_0_0_rgba(0,255,255,0.5)]">
          <div className="text-6xl mb-4 text-[#39FF14]">✅</div>
          <h2 className="text-3xl font-bold uppercase mb-2 tracking-widest">SUCCESS!</h2>
          <p className="text-sm font-bold mb-6 opacity-60">กรุณาจดรหัสติดตามของคุณ</p>
          <div className="bg-black border-4 border-cyan-400 p-6 mb-6">
            <div className="text-xs uppercase mb-2 opacity-60 font-bold">TRACKING_CODE</div>
            <div className="text-5xl font-bold tracking-[0.3em] text-[#FF00FF]">{successCode}</div>
          </div>
          <p className="text-xs font-bold mb-6 opacity-60">ใช้รหัสนี้ที่หน้า &quot;ขอบัตรคิว&quot; เพื่อเช็คสถานะ</p>
          <button onClick={onClose} className="w-full py-4 bg-transparent text-cyan-400 font-bold uppercase tracking-widest border-4 border-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors text-lg shadow-[6px_6px_0_0_rgba(0,255,255,0.3)] hover:translate-y-1 hover:shadow-none">
            ปิด / CLOSE
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
        relative w-full max-w-lg
        bg-white border-8 border-black
        shadow-[12px_12px_0_0_rgba(0,0,0,1)]
        max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden
      "
    >
      <div className="bg-[#39FF14] px-6 py-4 border-b-8 border-black flex items-center justify-between">
        <div>
          <h2 className="text-black font-black text-2xl uppercase tracking-widest">
            &gt; ขอบัตรคิว_
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-black text-[#39FF14] hover:bg-[#39FF14] hover:text-black hover:border-black border-2 border-transparent transition-colors font-black text-xl flex items-center justify-center transform hover:scale-110"
        >
          X
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-500 text-white font-black p-4 text-center uppercase border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            ! ERROR: {error}
          </div>
        )}

        <div>
           <label className="block text-sm font-black text-black mb-2 uppercase tracking-widest bg-[#00FFFF] inline-block px-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            ชื่อลูกค้า <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="
                w-full px-4 py-3
                bg-white border-4 border-black
                text-black font-mono font-bold text-lg
                placeholder:text-gray-400
                focus:outline-none focus:bg-[#00FFFF]/10 focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]
                transition-all block
              "
              placeholder="กรอกชื่อของคุณ..."
              autoFocus
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-black text-black mb-2 uppercase tracking-widest bg-[#FF00FF] text-white inline-block px-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            ประเภทบริการ
          </label>
          <div className="flex gap-2">
            {[
              { value: ServiceType.GENERAL, label: 'ทั่วไป' },
              { value: ServiceType.EXPRESS, label: 'ด่วน' },
              { value: ServiceType.VIP, label: 'วีไอพี' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setServiceType(option.value)}
                className={`
                  flex-1 py-3 font-black text-sm uppercase tracking-widest border-4 border-black transition-all
                  ${
                    serviceType === option.value
                      ? 'bg-black text-[#FF00FF] shadow-[4px_4px_0_0_rgba(255,0,255,1)] translate-y-1'
                      : 'bg-white text-black hover:bg-gray-200 shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className="block text-sm font-black text-black mb-2 uppercase tracking-widest bg-[#39FF14] inline-block px-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            หมายเหตุ <span className="text-[10px] font-bold">(ไม่บังคับ)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="
                w-full px-4 py-3
                bg-white border-4 border-black
                text-black font-mono font-bold
                placeholder:text-gray-400
                focus:outline-none focus:bg-[#39FF14]/10 focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]
                transition-all block
              "
              placeholder="..."
            />
          </div>
        </div>

        <div className="bg-black text-[#00FFFF] border-4 border-black p-4 mt-2 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
          <label className="block text-sm font-black mb-2 uppercase tracking-widest text-[#FF00FF]">
            &gt; CAPTCHA_AUTH <span className="text-white">*</span>
          </label>
          {challenge ? (
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black whitespace-nowrap bg-white text-black border-4 border-black px-4 py-1">{challenge.question}</span>
              <input type="number" value={challengeAnswer} onChange={(e) => setChallengeAnswer(e.target.value)} required
                className="w-full px-4 py-3 border-4 border-cyan-400 bg-black text-[#00FFFF] text-center text-2xl font-black focus:outline-none focus:bg-cyan-400/20 focus:shadow-[4px_4px_0_0_rgba(0,255,255,1)] transition-all block" placeholder="?" />
            </div>
          ) : (
            <div className="text-sm font-bold opacity-60 uppercase tracking-widest animate-pulse">LOADING_DATA...</div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !customerName.trim() || !challengeAnswer}
            className="
              w-full py-5 font-black text-2xl uppercase tracking-widest
              bg-[#00FFFF] text-black border-4 border-black
              hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed
              shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]
              transition-all
            "
          >
            {isSubmitting ? 'PROCESSING...' : 'ส่งขอบัตรคิว'}
          </button>
        </div>
      </form>
    </animated.div>
  );
}
