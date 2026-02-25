'use client';

import { SERVICE_TYPE_CONFIG, ServiceType } from '@/src/domain/types/queue';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { AdminKioskNewQueueTemplateProps } from '../AdminKioskNewQueueView';

export function AdminKioskNewQueueClassicTemplate({
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
    <div className="fixed inset-0 z-[999] w-full h-full overflow-y-auto flex flex-col bg-slate-900 text-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* ─── Header ─── */}
      <header className="flex items-center justify-between p-3 sm:p-4 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/kiosk" 
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight">สร้างคิวใหม่</h1>
            <p className="text-blue-400 text-xs font-semibold">กรอกข้อมูลลูกค้าเพื่อสร้างคิว</p>
          </div>
        </div>
      </header>

      {/* ─── Form Content ─── */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 gap-6 sm:gap-8">

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm font-medium">
            {error}
          </div>
        )}

        {/* ── Section 1: Customer Name ── */}
        <section>
          <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
            ชื่อลูกค้า <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="พิมพ์ชื่อลูกค้า..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 pr-24 text-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              autoFocus
            />
            {customerName && (
              <button
                type="button"
                onClick={clearCustomerName}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                ล้างข้อมูล
              </button>
            )}
          </div>
          {/* Preset Chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {presets.customerNames.map(name => (
              <button
                key={name}
                type="button"
                onClick={() => setCustomerName(name)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  customerName === name
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        {/* ── Section 2: Service Type ── */}
        <section>
          <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
            ประเภทบริการ
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(ServiceType).map(type => {
              const config = SERVICE_TYPE_CONFIG[type];
              const isSelected = serviceType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setServiceType(type)}
                  className={`py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? type === ServiceType.VIP
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-400'
                        : type === ServiceType.EXPRESS
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/25 ring-2 ring-orange-400'
                        : 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-400'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750 hover:border-slate-600'
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
          <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
            หมายเหตุ <span className="text-slate-600 normal-case text-xs font-normal">(กดเพิ่มข้อความประโยคเดิมซ้ำได้)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {presets.notes.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => appendNote(n)}
                className="px-3.5 py-2 rounded-lg text-sm font-semibold transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 active:bg-slate-600"
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
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-24 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            {note && (
              <button
                type="button"
                onClick={clearNote}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                ล้างข้อมูล
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
            className="sm:flex-1 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-center border border-slate-700 transition-colors"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="sm:flex-[2] py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold text-lg transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                กำลังสร้าง...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                สร้างคิว
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
