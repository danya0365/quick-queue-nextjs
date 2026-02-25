'use client';

import { SERVICE_TYPE_CONFIG, ServiceType } from '@/src/domain/types/queue';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { AdminKioskNewQueueTemplateProps } from '../AdminKioskNewQueueView';

export function AdminKioskNewQueueEditorialTemplate({
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
    <div className="fixed inset-0 z-[999] w-full h-full overflow-y-auto flex flex-col bg-white text-black font-serif selection:bg-black selection:text-white">
      
      {/* ─── Header ─── */}
      <header className="flex items-center justify-between p-3 sm:p-5 bg-white border-b-4 border-black shrink-0">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/kiosk" 
            className="p-2.5 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase">สร้างคิวใหม่</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">เพิ่มรายการคิวใหม่ —</p>
          </div>
        </div>
      </header>

      {/* ─── Form Content ─── */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10 gap-8 sm:gap-10 bg-zinc-100">

        {/* Error */}
        {error && (
          <div className="border-[3px] border-black bg-red-50 px-4 py-3 font-bold text-red-900 text-sm uppercase tracking-wider shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            ⚠ {error}
          </div>
        )}

        {/* ── Section 1: Customer Name ── */}
        <section>
          <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 border-b-2 border-black pb-1">
            ชื่อลูกค้า <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="พิมพ์ชื่อลูกค้า..."
              className="w-full border-[3px] border-black bg-white px-4 py-3.5 pr-24 text-lg font-bold placeholder:text-gray-300 focus:outline-none focus:bg-amber-50 transition-colors"
              autoFocus
            />
            {customerName && (
              <button
                type="button"
                onClick={clearCustomerName}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black bg-gray-200 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                CLEAR
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {presets.customerNames.map(name => (
              <button
                key={name}
                type="button"
                onClick={() => setCustomerName(name)}
                className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                  customerName === name
                    ? 'bg-black text-white border-[2px] border-black shadow-none'
                    : 'bg-white text-black border-[2px] border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        {/* ── Section 2: Service Type ── */}
        <section>
          <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 border-b-2 border-black pb-1">
            ประเภทบริการ
          </label>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {Object.values(ServiceType).map(type => {
              const config = SERVICE_TYPE_CONFIG[type];
              const isSelected = serviceType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setServiceType(type)}
                  className={`py-5 sm:py-6 font-black uppercase tracking-widest text-sm sm:text-base transition-all flex flex-col items-center gap-2 border-[3px] border-black ${
                    isSelected
                      ? 'bg-black text-white shadow-none translate-x-[3px] translate-y-[3px]'
                      : 'bg-white text-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px]'
                  }`}
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
          <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 border-b-2 border-black pb-1">
            หมายเหตุ <span className="text-gray-400 normal-case text-[10px] font-bold tracking-wider">— กดเพิ่มข้อความเดิมซ้ำได้</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {presets.notes.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => appendNote(n)}
                className="px-3 py-2 text-xs font-black uppercase tracking-wider transition-all border-[2px] border-black bg-white text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                {n}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="หรือพิมพ์หมายเหตุเอง..."
              className="w-full border-[3px] border-black bg-white px-4 py-3 pr-24 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:bg-amber-50 transition-colors"
            />
            {note && (
              <button
                type="button"
                onClick={clearNote}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black bg-gray-200 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                CLEAR
              </button>
            )}
          </div>
        </section>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Submit ── */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4">
          <Link
            href="/admin/kiosk"
            className="sm:flex-1 py-4 bg-white text-black border-[3px] border-black font-black uppercase tracking-widest text-center text-sm hover:bg-gray-100 transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            — ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="sm:flex-[2] py-4 bg-black hover:bg-gray-800 disabled:opacity-50 text-white font-black uppercase tracking-widest text-base transition-all border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,0.1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] hover:translate-x-1 hover:translate-y-1 flex items-center justify-center gap-2 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                กำลังสร้าง...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" strokeWidth={3} />
                ยืนยันสร้างคิว —
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
