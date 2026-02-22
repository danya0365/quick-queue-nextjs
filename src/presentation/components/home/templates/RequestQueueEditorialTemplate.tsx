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
      <animated.div style={modalSpring} onClick={(e) => e.stopPropagation()} className="relative z-10 w-full max-w-md">
        <div className="bg-white border-[6px] border-black p-8 text-center font-serif text-black shadow-[8px_8px_0_0_#000]">
          <div className="flex justify-center mb-4"><CheckCircle2 className="w-16 h-16" /></div>
          <h2 className="text-3xl font-black uppercase mb-2 tracking-tighter">ส่งคำขอสำเร็จ!</h2>
          <p className="text-sm font-bold uppercase tracking-widest mb-6 opacity-60">กรุณาจดรหัสติดตามของคุณ</p>
          <div className="bg-black text-white p-6 mb-6">
            <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">รหัสติดตาม</div>
            <div className="text-5xl font-black tracking-[0.3em] font-mono">{successCode}</div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-6 opacity-60">ใช้รหัสนี้ที่หน้า &quot;ขอบัตรคิว&quot; เพื่อเช็คสถานะ</p>
          <button onClick={onClose} className="w-full py-4 bg-white text-black font-black uppercase tracking-widest border-[4px] border-black hover:bg-black hover:text-white transition-colors">
            ปิด
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
