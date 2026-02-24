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

export function DisplayRetroTechMagazineTemplate({ displayViewModel, currentTime, soundEnabled, setSoundEnabled, onOpenTrackModal }: DisplayTemplateProps) {
  const { currentServingItem, nextUpItem, waitingItems, recentCompleted, stats, estimatedWaitMinutes, shopName, operatingHours } = displayViewModel;
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[999] w-full h-full overflow-hidden flex flex-col font-sans selection:bg-[#FF00FF] selection:text-white"
         style={{ backgroundColor: '#f4f4f0', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px', color: '#111' }}>

      {/* ─── Info Bar ─── */}
      <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 sm:px-8 py-3 bg-[#00FFFF] border-b-[4px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] z-10 shrink-0 gap-3 sm:gap-0">
        
        {/* Title row on mobile, Left segment on Desktop */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h1 className="text-xl sm:text-3xl font-black tracking-widest uppercase truncate mr-4" style={{ WebkitTextStroke: '1px black', color: 'white' }}>{shopName}</h1>
          <div className="sm:hidden flex items-center gap-1.5 font-mono font-black text-sm border-[3px] border-black px-2 py-1 bg-black text-[#39FF14] shadow-[2px_2px_0_0_rgba(0,0,0,1)] shrink-0">
            <Clock className="w-4 h-4 text-[#00FFFF]" />
            {currentTime}
          </div>
        </div>

        {/* Actions row on mobile, Right segment on Desktop */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link 
              href="/"
              className="p-2 border-[3px] border-black bg-white hover:bg-[#FF00FF] text-black hover:text-white transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shrink-0"
              title="กลับหน้าหลัก"
            >
              <Home className="w-5 h-5" strokeWidth={3} />
            </Link>
            <Link
              href="/display/request"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border-[3px] border-black bg-[#FF00FF] text-white hover:bg-[#39FF14] hover:text-black transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-black text-[10px] sm:text-xs uppercase tracking-widest shrink-0 whitespace-nowrap"
            >
              <Ticket className="w-4 h-4" strokeWidth={3} />
              <span className="hidden lg:inline">GET.TICKET_</span>
            </Link>
            <button
              onClick={onOpenTrackModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border-[3px] border-black bg-[#FF00FF] text-white hover:bg-[#00FFFF] hover:text-black transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-black text-[10px] sm:text-xs uppercase tracking-widest shrink-0 whitespace-nowrap"
            >
              <Search className="w-4 h-4" strokeWidth={3} />
              <span className="hidden lg:inline">TRACK.QUEUE_</span>
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 border-[3px] border-black bg-white hover:bg-[#FF00FF] hover:text-white transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shrink-0 ml-auto sm:ml-0"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 ml-3 pl-3 border-[3px] border-y-0 border-r-0 border-black border-dashed">
            {/* Hours */}
            <div className="hidden md:block text-[10px] font-black uppercase tracking-widest border-[2px] border-black px-2 py-1.5 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] whitespace-nowrap">
              OPEN {operatingHours.open}–{operatingHours.close}
            </div>
            {/* Clock */}
            <div className="flex items-center gap-1.5 font-mono font-black text-lg sm:text-xl border-[3px] border-black px-3 py-1.5 bg-black text-[#39FF14] shadow-[4px_4px_0_0_rgba(0,0,0,1)] shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#00FFFF]" />
              {currentTime}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* ═══ Left: Hero ═══ */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black relative overflow-y-auto lg:overflow-hidden">
          {/* Label */}
          <div className="absolute top-4 left-4 bg-white border-2 border-black px-3 py-1 font-black text-xs uppercase tracking-widest shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            VIEW.CURRENT
          </div>

          <div className="w-full max-w-2xl bg-black border-[6px] border-[#FF00FF] flex flex-col items-center justify-center p-8 sm:p-12 shadow-[16px_16px_0_0_rgba(0,0,0,1)] relative overflow-hidden group">
            {/* Scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-20"></div>
            {/* Grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="text-[100px] sm:text-[160px] lg:text-[200px] font-black leading-none tracking-tighter text-[#00FFFF] z-10 drop-shadow-[0_0_20px_#00FFFF] relative">
              {currentServingItem ? formatQueueNumber(currentServingItem.queueNumber) : '---'}
            </div>
            {currentServingItem && (currentServingItem.customerName || currentServingItem.note) && (
              <div className="flex flex-col items-center mt-6 z-10 transform -rotate-1 group-hover:rotate-1 transition-transform">
                {currentServingItem.customerName && (
                  <div className="text-2xl sm:text-4xl font-black text-white bg-[#FF00FF] px-6 py-2 border-4 border-[#00FFFF] shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                    {currentServingItem.customerName}
                  </div>
                )}
                {currentServingItem.note && (
                  <div className="text-xs sm:text-sm font-black text-white px-4 py-1 mt-3 tracking-widest uppercase bg-black border-2 border-[#39FF14] shadow-[4px_4px_0_0_rgba(57,255,20,0.5)]">
                    {currentServingItem.note}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next Up + Wait Info */}
          <div className="flex items-center gap-6 sm:gap-10 mt-10">
            <div className="text-center border-[4px] border-black p-4 sm:p-5 bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] relative">
              <div className="absolute -top-3 -right-3 bg-[#00FFFF] border-[2px] border-black px-2 py-0.5 font-black text-[10px] tracking-widest shadow-[2px_2px_0_0_rgba(0,0,0,1)] rotate-6">NEXT</div>
              <div className="bg-black px-4 py-2 border-2 border-[#FF00FF] mb-2">
                <div className="text-4xl sm:text-5xl font-black tracking-tighter text-[#39FF14] drop-shadow-[0_0_8px_#39FF14]">
                  {nextUpItem ? formatQueueNumber(nextUpItem.queueNumber) : '---'}
                </div>
              </div>
              {nextUpItem && (nextUpItem.customerName || nextUpItem.note) && (
                <div className="mt-1 flex flex-col items-center">
                  {nextUpItem.customerName && (
                    <div className="text-sm font-black text-[#FF00FF]">{nextUpItem.customerName}</div>
                  )}
                  {nextUpItem.note && (
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-0.5 truncate max-w-[120px]">{nextUpItem.note}</div>
                  )}
                </div>
              )}
            </div>
            <div className="text-center border-[4px] border-black p-4 sm:p-5 bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#FF00FF] mb-1">WAIT.COUNT =</div>
              <div className="text-4xl sm:text-5xl font-black text-[#00FFFF]" style={{ WebkitTextStroke: '1.5px black' }}>
                {stats.waiting}
              </div>
              <div className="text-sm font-black text-gray-500 mt-1">≈ {estimatedWaitMinutes} MIN_</div>
            </div>
          </div>

          <button 
            onClick={() => setIsMobileListOpen(true)}
            className="lg:hidden mt-10 px-6 py-4 border-[4px] border-black bg-[#FF00FF] text-white hover:bg-[#39FF14] hover:text-black transition-colors font-black text-xs uppercase tracking-widest shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex items-center gap-2 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            VIEW FULL QUEUE LIST [{waitingItems.length}]
          </button>
        </div>

        {/* ═══ Right: Queue Lists ═══ */}
        <div className={`
          absolute lg:static top-0 left-0 w-full h-full lg:w-[420px] xl:w-[480px] 
          flex flex-col bg-white shrink-0 overflow-hidden border-l-0 lg:border-l-[4px] border-black
          transition-transform duration-300 z-[1000] lg:z-auto lg:translate-y-0
          ${isMobileListOpen ? 'translate-y-0' : 'translate-y-full'}
        `}>

          {/* Mobile Close Header */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#00FFFF] border-b-[4px] border-black shrink-0">
            <span className="font-black uppercase tracking-widest text-base shadow-text-white" style={{ WebkitTextStroke: '0.5px black' }}>QUEUE.LIST</span>
            <button onClick={() => setIsMobileListOpen(false)} className="p-2 border-[3px] border-black bg-white hover:bg-[#FF00FF] text-black hover:text-white transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
              <X className="w-5 h-5" strokeWidth={3} />
            </button>
          </div>

          {/* Waiting Queue */}
          <div className="flex-1 flex flex-col overflow-hidden border-b-[4px] border-black">
            <div className="px-4 sm:px-6 py-3 bg-[#FF00FF] border-b-2 border-black shrink-0">
              <span className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                QUEUE.BUFFER [{waitingItems.length}]
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {waitingItems.length === 0 ? (
                <div className="p-6 text-center text-gray-300 text-sm font-black uppercase">NULL_</div>
              ) : (
                waitingItems.map((item, idx) => (
                  <div key={item.id} className={`flex items-center gap-3 px-4 sm:px-6 py-3 border-b-2 border-black ${idx === 0 ? 'bg-[#00FFFF]/10' : ''}`}>
                    <div className="text-xl sm:text-2xl font-black tracking-tighter min-w-[70px] text-[#FF00FF]" style={{ WebkitTextStroke: '0.5px black' }}>
                      {formatQueueNumber(item.queueNumber)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black uppercase truncate">{item.customerName || '-'}</div>
                      {item.note && (
                        <div className="text-[10px] uppercase font-black text-gray-500 truncate mt-0.5">{item.note}</div>
                      )}
                    </div>
                    <div className="text-[10px] font-black uppercase text-[#FF00FF] shrink-0">
                      {SERVICE_TYPE_CONFIG[item.serviceType]?.label}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed */}
          <div className="shrink-0">
            <div className="px-4 sm:px-6 py-3 bg-[#39FF14] border-b-2 border-black">
              <span className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                DONE.LOG_
              </span>
            </div>
            {recentCompleted.length === 0 ? (
              <div className="p-4 text-center text-gray-300 text-sm font-black uppercase">NULL_</div>
            ) : (
              recentCompleted.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 sm:px-6 py-2.5 border-b-2 border-black opacity-40">
                  <div className="text-lg font-black tracking-tighter min-w-[70px] line-through">
                    {formatQueueNumber(item.queueNumber)}
                  </div>
                  <div className="text-sm uppercase truncate flex-1 font-bold">{item.customerName}</div>
                  <div className="text-[10px] font-mono bg-black text-[#00FFFF] px-1">
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
