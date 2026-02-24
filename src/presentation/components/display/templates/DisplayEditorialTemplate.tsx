'use client';

import { formatQueueNumber } from '@/src/config/queue-display.config';
import { SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { Clock, Home, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { DisplayViewModel } from '../DisplayView';

interface DisplayTemplateProps {
  displayViewModel: DisplayViewModel;
  currentTime: string;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export function DisplayEditorialTemplate({ displayViewModel, currentTime, soundEnabled, setSoundEnabled }: DisplayTemplateProps) {
  const { currentServingItem, nextUpItem, waitingItems, recentCompleted, stats, estimatedWaitMinutes, shopName, operatingHours } = displayViewModel;

  return (
    <div className="fixed inset-0 z-[999] w-full h-full overflow-hidden flex flex-col bg-white text-black font-serif selection:bg-black selection:text-white">

      {/* ─── Info Bar ─── */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-3 bg-white border-b-4 border-black shrink-0">
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="p-2 border-2 border-black bg-white hover:bg-black text-black hover:text-white transition-colors"
            title="กลับหน้าหลัก"
          >
            <Home className="w-5 h-5" />
          </Link>
          <h1 className="text-xl sm:text-3xl font-black tracking-tighter uppercase">{shopName}</h1>
        </div>

        <div className="flex items-center gap-0 sm:gap-0">
          {/* Stats in connected badges */}
          <div className="hidden sm:flex items-center text-[10px] font-black uppercase tracking-wider">
            <span className="border-2 border-black px-2 py-1.5 bg-amber-50 text-amber-800">WAIT: {stats.waiting}</span>
            <span className="border-2 border-l-0 border-black px-2 py-1.5 bg-blue-50 text-blue-800">SRV: {stats.serving}</span>
            <span className="border-2 border-l-0 border-black px-2 py-1.5 bg-emerald-50 text-emerald-800">DONE: {stats.completed}</span>
          </div>

          {/* Sound */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors ml-3"
            title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Hours */}
          <div className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-3">
            OPEN {operatingHours.open}–{operatingHours.close}
          </div>

          {/* Clock */}
          <div className="flex items-center gap-1.5 font-mono font-black text-lg sm:text-xl border-2 border-black px-3 py-1.5 ml-3">
            <Clock className="w-4 h-4" />
            {currentTime}
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* ═══ Left: Hero ═══ */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 border-b-4 lg:border-b-0 lg:border-r-4 border-black bg-gray-50 relative">

          <div className="text-black font-black uppercase tracking-[0.2em] text-sm sm:text-base border-b-2 border-black pb-2 mb-8">CURRENTLY SERVING</div>

          <div className="w-full max-w-2xl bg-white border-[8px] border-black flex flex-col items-center justify-center p-8 sm:p-12 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative">
            <div className="text-[100px] sm:text-[160px] lg:text-[200px] font-black leading-none tracking-tighter">
              {currentServingItem ? formatQueueNumber(currentServingItem.queueNumber) : '--'}
            </div>
            {currentServingItem && (currentServingItem.customerName || currentServingItem.note) && (
              <div className="flex flex-col items-center w-full mt-4 border-t-4 border-black pt-4">
                {currentServingItem.customerName && (
                  <div className="text-2xl sm:text-4xl text-gray-600 font-bold">
                    คุณ {currentServingItem.customerName}
                  </div>
                )}
                {currentServingItem.note && (
                  <div className="text-sm text-gray-400 mt-2 font-bold uppercase tracking-wider text-center">
                    {currentServingItem.note}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next Up + Wait Info */}
          <div className="flex items-center gap-8 sm:gap-12 mt-10">
            <div className="text-center border-4 border-black p-4 sm:p-6 bg-white shadow-[6px_6px_0_0_rgba(0,0,0,0.1)]">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">NEXT.IN.LINE</div>
              <div className="text-4xl sm:text-5xl font-black tracking-tighter">
                {nextUpItem ? formatQueueNumber(nextUpItem.queueNumber) : '--'}
              </div>
              {nextUpItem && (nextUpItem.customerName || nextUpItem.note) && (
                <div className="mt-1 flex flex-col items-center">
                  {nextUpItem.customerName && (
                    <div className="text-sm text-gray-500 font-bold">คุณ {nextUpItem.customerName}</div>
                  )}
                  {nextUpItem.note && (
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider max-w-[150px] truncate">{nextUpItem.note}</div>
                  )}
                </div>
              )}
            </div>
            <div className="text-center border-4 border-black p-4 sm:p-6 bg-white shadow-[6px_6px_0_0_rgba(0,0,0,0.1)]">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">WAITING.COUNT</div>
              <div className="text-4xl sm:text-5xl font-black">{stats.waiting}</div>
              <div className="text-sm text-gray-400 font-bold mt-1">≈ {estimatedWaitMinutes} MIN</div>
            </div>
          </div>
        </div>

        {/* ═══ Right: Queue Lists ═══ */}
        <div className="w-full lg:w-[420px] xl:w-[480px] flex flex-col bg-white shrink-0 overflow-hidden">

          {/* Waiting Queue */}
          <div className="flex-1 flex flex-col overflow-hidden border-b-4 border-black">
            <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b-2 border-black shrink-0">
              <span className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-black animate-pulse"></span>
                QUEUE.WAITING ({waitingItems.length})
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {waitingItems.length === 0 ? (
                <div className="p-6 text-center text-gray-300 text-sm font-bold uppercase">EMPTY</div>
              ) : (
                waitingItems.map((item, idx) => (
                  <div key={item.id} className={`flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-gray-200 ${idx === 0 ? 'bg-amber-50/50' : ''}`}>
                    <div className="text-xl sm:text-2xl font-black tracking-tighter min-w-[70px]">
                      {formatQueueNumber(item.queueNumber)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold uppercase truncate">{item.customerName || '-'}</div>
                      {item.note && (
                        <div className="text-[10px] text-gray-400 uppercase font-bold truncate mt-0.5">{item.note}</div>
                      )}
                    </div>
                    <div className="text-[10px] font-bold uppercase text-gray-400 shrink-0">
                      {SERVICE_TYPE_CONFIG[item.serviceType]?.label}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed */}
          <div className="shrink-0">
            <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b-2 border-black">
              <span className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                COMPLETED (RECENT)
              </span>
            </div>
            {recentCompleted.length === 0 ? (
              <div className="p-4 text-center text-gray-300 text-sm font-bold uppercase">NONE</div>
            ) : (
              recentCompleted.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 sm:px-6 py-2.5 border-b border-gray-100 opacity-50">
                  <div className="text-lg font-black tracking-tighter min-w-[70px] line-through text-gray-400">
                    {formatQueueNumber(item.queueNumber)}
                  </div>
                  <div className="text-sm text-gray-400 uppercase truncate flex-1 font-bold">{item.customerName}</div>
                  <div className="text-[10px] font-mono text-gray-300">
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
