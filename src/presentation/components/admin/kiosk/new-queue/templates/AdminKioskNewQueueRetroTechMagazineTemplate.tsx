'use client';

import { SERVICE_TYPE_CONFIG, ServiceType } from '@/src/domain/types/queue';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { AdminKioskNewQueueTemplateProps } from '../AdminKioskNewQueueView';

export function AdminKioskNewQueueRetroTechMagazineTemplate({
  customerName,
  setCustomerName,
  serviceType,
  setServiceType,
  note,
  setNote,
  presets,
  clearCustomerName,
  appendNote,
  clearNote,
  isSubmitting,
  error,
  handleSubmit,
  canSubmit,
}: AdminKioskNewQueueTemplateProps) {
  return (
    <div
      className="fixed inset-0 z-[999] w-full h-full overflow-y-auto flex flex-col font-sans selection:bg-[#FF00FF] selection:text-white"
      style={{ backgroundColor: '#f4f4f0', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px', color: '#111' }}
    >
      
      {/* ─── Header ─── */}
      <header className="flex items-center justify-between p-3 sm:p-5 bg-[#00FFFF] border-b-[4px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/kiosk" 
            className="p-2.5 bg-white border-[3px] border-black hover:bg-[#FF00FF] hover:text-white transition-colors flex items-center justify-center shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <ArrowLeft className="w-5 h-5 stroke-[3px]" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-widest uppercase" style={{ WebkitTextStroke: '0.5px black' }}>
              QUEUE.NEW()
            </h1>
            <p className="text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-[#39FF14] px-2 py-0.5 border-2 border-black w-max mt-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
              INPUT.MODE_
            </p>
          </div>
        </div>
      </header>

      {/* ─── Form Content ─── */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 gap-6 sm:gap-8">

        {/* Error */}
        {error && (
          <div className="border-[3px] border-black bg-[#FF00FF] text-white px-4 py-3 font-black text-xs uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            ERR=&gt; {error}
          </div>
        )}

        {/* ── Section 1: Customer Name ── */}
        <section>
          <label className="inline-block text-[10px] font-black uppercase tracking-widest mb-3 bg-[#FF00FF] text-white px-2 py-1 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            CUSTOMER.NAME_ <span className="text-[#39FF14]">*</span>
          </label>
          <div className="relative bg-black border-[3px] border-[#FF00FF] p-1 mt-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder=">> ระบุชื่อลูกค้า..."
              className="w-full bg-black text-[#39FF14] px-4 py-3.5 pr-24 text-lg font-black font-mono placeholder:text-[#39FF14]/30 focus:outline-none border-none"
              autoFocus
            />
            {customerName && (
              <button
                type="button"
                onClick={clearCustomerName}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-black bg-[#FF00FF] border-2 border-black hover:bg-white hover:text-black transition-colors"
              >
                CLEAR()
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {presets.customerNames.map(name => (
              <button
                key={name}
                type="button"
                onClick={() => setCustomerName(name)}
                className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-[2px] border-black ${
                  customerName === name
                    ? 'bg-[#FF00FF] text-white shadow-none translate-x-[2px] translate-y-[2px]'
                    : 'bg-white text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-[#00FFFF] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        {/* ── Section 2: Service Type ── */}
        <section>
          <label className="inline-block text-[10px] font-black uppercase tracking-widest mb-3 bg-[#00FFFF] text-black px-2 py-1 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            SERVICE.TYPE_
          </label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {Object.values(ServiceType).map(type => {
              const config = SERVICE_TYPE_CONFIG[type];
              const isSelected = serviceType === type;
              const colors = type === ServiceType.VIP
                ? { bg: '#FF00FF', text: 'white' }
                : type === ServiceType.EXPRESS
                ? { bg: '#00FFFF', text: 'black' }
                : { bg: '#39FF14', text: 'black' };
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setServiceType(type)}
                  className={`py-5 sm:py-6 font-black uppercase tracking-widest text-xs sm:text-sm transition-all flex flex-col items-center gap-2 border-[3px] border-black ${
                    isSelected
                      ? 'shadow-none translate-x-[4px] translate-y-[4px]'
                      : 'shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none'
                  }`}
                  style={{
                    backgroundColor: isSelected ? colors.bg : 'white',
                    color: isSelected ? colors.text : 'black',
                  }}
                >
                  <span className="text-2xl">{type === ServiceType.VIP ? '👑' : type === ServiceType.EXPRESS ? '⚡' : '📋'}</span>
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Section 3: Note ── */}
        <section>
          <label className="inline-block text-[10px] font-black uppercase tracking-widest mb-3 bg-[#39FF14] text-black px-2 py-1 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            NOTE.MSG_ <span className="text-gray-600">// APPEND_MODE</span>
          </label>
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {presets.notes.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => appendNote(n)}
                className="px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-[2px] border-black bg-white text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-[#00FFFF] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                {n}
              </button>
            ))}
          </div>
          <div className="relative bg-black border-[3px] border-[#00FFFF] p-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder=">> ระบุหมายเหตุเพิ่มเติม..."
              className="w-full bg-black text-[#00FFFF] px-4 py-3 pr-24 text-sm font-black font-mono placeholder:text-[#00FFFF]/30 focus:outline-none border-none"
            />
            {note && (
              <button
                type="button"
                onClick={clearNote}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-black bg-[#FF00FF] border-2 border-black hover:bg-white hover:text-black transition-colors"
              >
                CLEAR()
              </button>
            )}
          </div>
        </section>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Submit ── */}
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <Link
            href="/admin/kiosk"
            className="sm:flex-1 py-4 bg-white text-black border-[3px] border-black font-black uppercase tracking-widest text-center text-xs hover:bg-[#00FFFF] transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            CANCEL()
          </Link>
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="sm:flex-[2] py-4 bg-[#FF00FF] hover:bg-[#00FFFF] disabled:opacity-50 text-white hover:text-black font-black uppercase tracking-widest text-sm sm:text-base transition-all border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] flex items-center justify-center gap-2 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                PROCESSING_...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 bg-black text-white p-0.5" strokeWidth={4} />
                QUEUE.CREATE()
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
