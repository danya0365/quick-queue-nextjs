import { ServiceType } from '@/src/domain/types/queue';
import { CheckCircle2, Lock } from 'lucide-react';
import { FormEvent } from 'react';
import { animated } from 'react-spring';

export interface RequestQueueEditorialTemplateProps {
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

export function RequestQueueEditorialTemplate({
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
}: RequestQueueEditorialTemplateProps) {
  // ─── Success state ───
  if (successCode) {
    return (
      <animated.div style={modalSpring} onClick={(e) => e.stopPropagation()} className="relative z-10 w-full max-w-lg">
        <div className="bg-white border-[6px] md:border-[8px] border-black p-8 md:p-12 text-center font-serif text-black shadow-[12px_12px_0_0_rgba(0,0,0,0.05)]">
          <div className="flex justify-center mb-8 relative">
            <div className="absolute w-24 h-24 border-[3px] border-black rounded-full animate-ping opacity-20"></div>
            <CheckCircle2 className="w-20 h-20 text-black z-10 bg-white" strokeWidth={1.5} />
          </div>
          <div className="font-bold uppercase tracking-widest text-xs md:text-sm border-b-[3px] border-black pb-2 mb-4 inline-block">สถานะการทำรายการ</div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">ส่งคำขอ<br/>สำเร็จ</h2>
          
          <div className="bg-gray-100 border-[3px] border-black p-6 md:p-8 mb-8 mt-8 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest border-[3px] border-black whitespace-nowrap">รหัสติดตามของคุณ</div>
             <div className="text-5xl md:text-6xl font-black tracking-[0.2em] lg:tracking-[0.3em] font-sans text-center mt-2 break-all">{successCode}</div>
          </div>
          
          <p className="text-xs font-bold uppercase tracking-widest mb-8 opacity-60 border-t-[2px] border-gray-200 pt-4 px-4 leading-relaxed">กรุณาจดรหัสเพื่อใช้ในหน้า &quot;เช็คสถานะ&quot; <br className="hidden sm:block" /> เพื่อตรวจสอบคิวของคุณ</p>
          <button onClick={onClose} className="w-full py-5 bg-black text-white font-black uppercase tracking-widest border-[4px] border-black hover:bg-white hover:text-black transition-colors text-lg active:translate-y-1">
            รับทราบ — ดำเนินการต่อ
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
        bg-white border-[6px] border-black text-black
        font-serif shadow-[8px_8px_0_0_#000]
        max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden
      "
    >
      <div className="px-6 py-4 border-b-[6px] border-black flex items-center justify-between bg-white text-black">
        <div>
          <h2 className="font-black text-3xl uppercase tracking-tighter">ขอบัตรคิว</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 border-[4px] border-black flex items-center justify-center font-black hover:bg-black hover:text-white transition-colors text-xl"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 font-sans">
        {error && (
          <div className="bg-white border-[4px] border-black p-4 text-sm font-black text-black uppercase tracking-widest shadow-[4px_4px_0_0_#ff0000]">
            Opps! {error}
          </div>
        )}

        <div>
           <label className="block font-black text-md uppercase tracking-widest mb-2 flex justify-between items-end border-b-[3px] border-black pb-1">
            <span>รายละเอียดลูกค้า <span className="text-red-500">*</span></span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="
                w-full px-4 py-3 border-[4px] border-black bg-white
                text-black font-bold text-sm
                placeholder:text-gray-400 placeholder:font-bold
                focus:outline-none focus:ring-4 focus:ring-black/20
                transition-all duration-200 uppercase
              "
              placeholder="กรอกชื่อของคุณ"
              autoFocus
            />
            {customerName && (
              <button
                type="button"
                onClick={() => setCustomerName('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black bg-transparent border-none p-1 font-black"
                title="เคลียร์"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block font-black text-md uppercase tracking-widest mb-2 border-b-[3px] border-black pb-1">
            ประเภทบริการ
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: ServiceType.GENERAL, label: 'ทั่วไป' },
              { value: ServiceType.EXPRESS, label: 'ด่วน' },
              { value: ServiceType.VIP, label: 'VIP' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setServiceType(option.value)}
                className={`
                  px-3 py-3 font-black text-sm uppercase tracking-widest border-[4px] border-black transition-all duration-200
                  ${
                    serviceType === option.value
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-gray-100'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-black text-md uppercase tracking-widest mb-2 border-b-[3px] border-black pb-1">
             หมายเหตุ <span className="text-[10px] font-bold opacity-50">(ไม่บังคับ)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="
                w-full px-4 py-3 border-[4px] border-black bg-white
                text-black font-bold text-sm
                placeholder:text-gray-400 placeholder:font-bold
                focus:outline-none focus:ring-4 focus:ring-black/20
                transition-all duration-200 uppercase
              "
              placeholder="ข้อมูลเพิ่มเติม..."
            />
            {note && (
              <button
                type="button"
                onClick={() => setNote('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black font-black bg-transparent border-none p-1"
                title="เคลียร์"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-100 border-[4px] border-black p-4 mt-2">
           <label className="block font-black text-sm uppercase tracking-widest mb-2 text-black flex items-center gap-1.5">
            <Lock className="w-4 h-4" /> ยืนยันตัวตน <span className="text-red-500">*</span>
          </label>
          {challenge ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-black whitespace-nowrap bg-white border-[3px] border-black px-4 py-1">{challenge.question}</span>
              <input type="number" value={challengeAnswer} onChange={(e) => setChallengeAnswer(e.target.value)} required
                className="w-full px-4 py-2 border-[4px] border-black bg-white text-black text-center text-xl font-black focus:outline-none focus:ring-4 focus:ring-black/20 transition-all duration-200" placeholder="?" />
            </div>
          ) : (
            <div className="text-xs font-bold opacity-60 uppercase tracking-widest">LOADING...</div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting || !customerName.trim() || !challengeAnswer}
          className="w-full mt-6 py-4 bg-black text-white font-black uppercase tracking-widest border-[4px] border-black hover:bg-white hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-lg">
          {isSubmitting ? 'กำลังส่ง...' : 'ส่งขอบัตรคิว'}
        </button>
      </form>
    </animated.div>
  );
}
