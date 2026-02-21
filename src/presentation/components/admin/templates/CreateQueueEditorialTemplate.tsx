import { ServiceType } from '@/src/domain/types/queue';
import { FormEvent } from 'react';
import { animated } from 'react-spring';

export interface CreateQueueEditorialTemplateProps {
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

export function CreateQueueEditorialTemplate({
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
}: CreateQueueEditorialTemplateProps) {
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
      {/* Header */}
      <div className="px-6 py-4 border-b-[6px] border-black flex items-center justify-between bg-white text-black">
        <div>
          <h2 className="font-black text-3xl uppercase tracking-tighter">NEW TICKET</h2>
          <p className="font-bold text-xs uppercase tracking-widest mt-1 opacity-60">
            TICKET <span className="bg-black text-white px-2 py-0.5 ml-1">#{nextQueueNumber}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 border-[4px] border-black flex items-center justify-center font-black hover:bg-black hover:text-white transition-colors text-xl"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6 font-sans">
        <div>
          <label className="block font-black text-md uppercase tracking-widest mb-2 flex justify-between items-end border-b-[3px] border-black pb-1">
            <span>IDENTITY</span>
            <span className="text-[10px] font-bold opacity-50">AUTO-FILL AVAILABLE</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="
                w-full px-4 py-3 border-[4px] border-black bg-white
                text-black font-bold text-sm
                placeholder:text-gray-400 placeholder:font-bold
                focus:outline-none focus:ring-4 focus:ring-black/20
                transition-all duration-200 uppercase
              "
              placeholder={`E.G. TICKET #${nextQueueNumber}`}
              autoFocus
              id="create-customer-name"
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
          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 mt-3">
            {['GUEST', 'GRAB', 'LINEMAN', 'PANDA', 'LALA'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCustomerName(preset)}
                className="px-3 py-1 text-[10px] font-black uppercase tracking-widest border-[2px] border-black text-black hover:bg-black hover:text-white transition-all"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-black text-md uppercase tracking-widest mb-2 border-b-[3px] border-black pb-1">
            SERVICE TYPE
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: ServiceType.GENERAL, label: 'STD' },
              { value: ServiceType.EXPRESS, label: 'EXP' },
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
             INFO
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
              placeholder="E.G. ADD DETAIL"
              id="create-note"
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
          <div className="flex flex-wrap gap-2 mt-3">
            {['1X', '2X', '3X', 'BEEF', 'CHICKEN', 'BANANA', 'REG', 'SPCL'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setNote((prev) => (prev ? prev + ' ' + preset : preset))}
                className="px-3 py-1 text-[10px] font-black uppercase tracking-widest border-[2px] border-black text-black hover:bg-black hover:text-white transition-all"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t-[6px] border-black">
          <button
            type="button"
            onClick={onClose}
            className="
              flex-1 px-4 py-4 font-black uppercase tracking-widest text-sm
              border-[4px] border-black bg-white text-black
              hover:bg-gray-100 transition-colors
            "
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex-1 px-4 py-4 font-black uppercase tracking-widest text-sm
              border-[4px] border-black bg-black text-white
              hover:bg-white hover:text-black hover:opacity-100
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all
            "
            id="create-submit"
          >
            {isSubmitting ? 'WORKING...' : `ISSUE #${nextQueueNumber}`}
          </button>
        </div>
      </form>
    </animated.div>
  );
}
