import { ServiceType } from '@/src/domain/types/queue';
import { FormEvent } from 'react';
import { animated } from 'react-spring';

export interface CreateQueueRetroTechMagazineTemplateProps {
  onClose: () => void;
  nextQueueNumber: number;
  customerName: string;
  setCustomerName: (name: string) => void;
  serviceType: ServiceType;
  setServiceType: (service: ServiceType) => void;
  note: string;
  setNote: (note: string | ((prev: string) => string)) => void;
  isSubmitting: boolean;
  handleSubmit: (e: FormEvent) => void;
  modalSpring: any;
}

export function CreateQueueRetroTechMagazineTemplate({
  onClose,
  nextQueueNumber,
  customerName,
  setCustomerName,
  serviceType,
  setServiceType,
  note,
  setNote,
  isSubmitting,
  handleSubmit,
  modalSpring,
}: CreateQueueRetroTechMagazineTemplateProps) {
  return (
    <animated.div
      style={modalSpring}
      onClick={(e) => e.stopPropagation()}
      className="
        relative w-full max-w-lg
        bg-white border-8 border-black
        shadow-[12px_12px_0_0_rgba(0,0,0,1)]
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="bg-[#39FF14] px-6 py-4 border-b-8 border-black flex items-center justify-between">
        <div>
          <h2 className="text-black font-black text-2xl uppercase tracking-widest">
            ADD_Q RECORD
          </h2>
          <p className="text-black font-mono text-sm mt-1 uppercase font-bold">
            NEXT INT: <strong className="text-white bg-black px-1 py-0.5">#{nextQueueNumber}</strong>
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-black text-white hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors font-black text-xl flex items-center justify-center transform hover:scale-110"
        >
          X
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-black text-black mb-2 uppercase tracking-widest bg-[#00FFFF] inline-block px-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            CUSTOMER_ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="
                w-full px-4 py-3
                bg-white border-4 border-black
                text-black font-mono font-bold text-lg
                placeholder:text-gray-400
                focus:outline-none focus:bg-[#00FFFF]/10 focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]
                transition-all block
              "
              placeholder={`AUTO GEN IF EMPTY`}
              autoFocus
              id="create-customer-name-retro"
            />
          </div>
          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 mt-3">
            {['คุณพี่', 'Grab', 'Lineman', 'Foodpanda', 'Lalamove'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCustomerName(preset)}
                className="px-3 py-1 font-bold text-xs uppercase bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-black mb-2 uppercase tracking-widest bg-[#FF00FF] text-white inline-block px-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            PROCESS_TYPE
          </label>
          <div className="flex gap-2">
            {[
              { value: ServiceType.GENERAL, label: 'STD' },
              { value: ServiceType.EXPRESS, label: 'FAST' },
              { value: ServiceType.VIP, label: 'PRIME' },
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
            PARAMS / NOTES
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
              placeholder="OPTIONAL ARGS..."
              id="create-note-retro"
            />
          </div>
          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 mt-3">
            {['1 ชิ้น', '2 ชิ้น', 'เนื้อ', 'ไก่', 'ธรรมดา', 'พิเศษ'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setNote((prev) => (prev ? prev + ' ' + preset : preset))}
                className="px-3 py-1 font-bold text-xs uppercase bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t-8 border-black">
          <button
            type="button"
            onClick={onClose}
            className="
              flex-1 py-4 font-black text-xl uppercase tracking-widest
              bg-white text-black border-4 border-black
              hover:bg-black hover:text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none
              transition-all
            "
          >
            ABORT
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex-1 py-4 font-black text-xl uppercase tracking-widest
              bg-[#00FFFF] text-black border-4 border-black
              hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed
              shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none
              transition-all
            "
            id="create-submit-retro"
          >
            {isSubmitting ? 'WORKING...' : 'EXECUTE'}
          </button>
        </div>
      </form>
    </animated.div>
  );
}
