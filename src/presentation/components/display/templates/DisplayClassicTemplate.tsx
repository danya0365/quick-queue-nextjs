'use client';

import { formatQueueNumber } from '@/src/config/queue-display.config';
import { SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { Clock, Home, Search, Ticket, Volume2, VolumeX, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DisplayViewModel } from '../DisplayView';

interface DisplayTemplateProps {
  displayViewModel: DisplayViewModel;
  currentTime: string;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenTrackModal: () => void;
}

export function DisplayClassicTemplate({ displayViewModel, currentTime, soundEnabled, setSoundEnabled, onOpenTrackModal }: DisplayTemplateProps) {
  const { currentServingItem, nextUpItem, waitingItems, recentCompleted, stats, estimatedWaitMinutes, shopName, operatingHours } = displayViewModel;
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[999] w-full h-full overflow-hidden flex flex-col bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">

      {/* ─── Info Bar ─── */}
      <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 sm:px-8 py-3 bg-slate-950 border-b border-slate-800 shrink-0 gap-3 sm:gap-0">
        
        {/* Title row on mobile, Left segment on Desktop */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight truncate max-w-[200px] sm:max-w-none">{shopName}</h1>
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="sm:hidden flex items-center gap-1.5 text-white font-mono font-bold text-sm bg-slate-800 px-2 py-1 rounded-lg shrink-0">
            <Clock className="w-4 h-4 text-slate-400" />
            {currentTime}
          </div>
        </div>

        {/* Actions row on mobile, Right segment on Desktop */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link 
              href="/"
              className="p-2 sm:p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white shrink-0"
              title="กลับหน้าหลัก"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="/display/request"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-[10px] sm:text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 shrink-0 whitespace-nowrap"
            >
              <Ticket className="w-4 h-4" />
              <span className="hidden lg:inline">ขอบัตรคิว</span>
            </Link>
            <button
              onClick={onOpenTrackModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] sm:text-sm font-bold transition-all border border-slate-700 hover:border-slate-600 shrink-0 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">ตรวจสอบคิว</span>
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 sm:p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white shrink-0 ml-auto sm:ml-0"
              title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-4 sm:gap-6 ml-3 pl-3 border-l border-slate-800/50">
            {/* Operating Hours */}
            <div className="hidden md:block text-xs text-slate-400 whitespace-nowrap">
              {operatingHours.open} - {operatingHours.close}
            </div>
            {/* Live Clock */}
            <div className="flex items-center gap-1.5 text-white font-mono font-bold text-lg sm:text-xl bg-slate-800 px-3 py-1.5 rounded-lg shrink-0">
              <Clock className="w-4 h-4 text-slate-400" />
              {currentTime}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* ═══ Left: Current Serving (Hero) ═══ */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-800/50 relative overflow-y-auto lg:overflow-hidden">
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] pointer-events-none rounded-full"></div>

          <div className="text-slate-400 font-bold uppercase tracking-widest text-base sm:text-lg mb-4">กำลังเรียกคิว</div>

          <div className="w-full max-w-2xl bg-slate-950 rounded-3xl border-4 border-slate-800 flex flex-col items-center justify-center p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="text-[100px] sm:text-[160px] lg:text-[200px] font-black leading-none tracking-tighter text-white drop-shadow-lg z-10">
              {currentServingItem ? formatQueueNumber(currentServingItem.queueNumber) : '--'}
            </div>
            {currentServingItem && (currentServingItem.customerName || currentServingItem.note) && (
              <div className="flex flex-col items-center mt-4 z-10">
                {currentServingItem.customerName && (
                  <div className="text-2xl sm:text-4xl text-slate-300 font-bold">
                    คุณ {currentServingItem.customerName}
                  </div>
                )}
                {currentServingItem.note && (
                  <div className="text-sm sm:text-base text-slate-500 mt-2 font-medium max-w-sm text-center">
                    {currentServingItem.note}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next Up + Wait Info */}
          <div className="flex items-center gap-6 sm:gap-10 mt-8">
            <div className="text-center">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">คิวถัดไป</div>
              <div className="text-4xl sm:text-5xl font-black text-blue-400 tracking-tighter">
                {nextUpItem ? formatQueueNumber(nextUpItem.queueNumber) : '--'}
              </div>
              {nextUpItem && (nextUpItem.customerName || nextUpItem.note) && (
                <div className="mt-1 flex flex-col items-center">
                  {nextUpItem.customerName && (
                    <div className="text-sm text-slate-400">คุณ {nextUpItem.customerName}</div>
                  )}
                  {nextUpItem.note && (
                    <div className="text-xs text-slate-500 max-w-[120px] truncate">{nextUpItem.note}</div>
                  )}
                </div>
              )}
            </div>
            <div className="w-px h-16 bg-slate-800"></div>
            <div className="text-center">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">คิวรอ</div>
              <div className="text-4xl sm:text-5xl font-black text-amber-400">{stats.waiting}</div>
              <div className="text-sm text-slate-500 mt-1">≈ {estimatedWaitMinutes} นาที</div>
            </div>
          </div>

          <button 
            onClick={() => setIsMobileListOpen(true)}
            className="lg:hidden mt-8 px-6 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm shadow-lg flex items-center gap-2 border border-slate-700/50"
          >
            ดูคิวรอทั้งหมด ({waitingItems.length})
          </button>
        </div>

        {/* ═══ Right: Queue Lists ═══ */}
        <div className={`
          absolute lg:static top-0 left-0 w-full h-full lg:w-[420px] xl:w-[480px] 
          flex flex-col bg-slate-950 shrink-0 overflow-hidden border-l-0 lg:border-l border-slate-800
          transition-transform duration-300 z-[1000] lg:z-auto lg:translate-y-0
          ${isMobileListOpen ? 'translate-y-0' : 'translate-y-full'}
        `}>

          {/* Mobile Close Header */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
            <span className="font-bold text-slate-300 text-base">รายการคิว</span>
            <button onClick={() => setIsMobileListOpen(false)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Waiting Queue */}
          <div className="flex-1 flex flex-col overflow-hidden border-b border-slate-800">
            <div className="px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                รอคิว ({waitingItems.length})
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {waitingItems.length === 0 ? (
                <div className="p-6 text-center text-slate-600 text-sm">ไม่มีคิวรอ</div>
              ) : (
                waitingItems.map((item, idx) => (
                  <div key={item.id} className={`flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-slate-800/50 ${idx === 0 ? 'bg-amber-500/5' : ''}`}>
                    <div className="text-xl sm:text-2xl font-black text-white tracking-tighter min-w-[70px]">
                      {formatQueueNumber(item.queueNumber)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-300 truncate">{item.customerName || '-'}</div>
                      {item.note && (
                        <div className="text-xs text-slate-500 truncate mt-0.5">{item.note}</div>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 shrink-0">
                      {SERVICE_TYPE_CONFIG[item.serviceType]?.label}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed — Recent */}
          <div className="shrink-0">
            <div className="px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800">
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                เสร็จแล้ว (ล่าสุด)
              </span>
            </div>
            {recentCompleted.length === 0 ? (
              <div className="p-4 text-center text-slate-600 text-sm">ยังไม่มี</div>
            ) : (
              recentCompleted.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 sm:px-6 py-2.5 border-b border-slate-800/50 opacity-60">
                  <div className="text-lg font-bold text-emerald-400/60 tracking-tighter min-w-[70px] line-through">
                    {formatQueueNumber(item.queueNumber)}
                  </div>
                  <div className="text-sm text-slate-500 truncate flex-1">{item.customerName}</div>
                  <div className="text-xs text-slate-600">
                    {new Date(item.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
