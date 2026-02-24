'use client';

import { formatQueueNumber } from '@/src/config/queue-display.config';
import { QueueStatus, ServiceType } from '@/src/domain/types/queue';
import { AdminViewModel } from '@/src/presentation/presenters/admin/AdminPresenter';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { ArrowLeft, Check, FastForward, Plus } from 'lucide-react';
import Link from 'next/link';

export function AdminFocusRetroTechMagazineTemplate({ viewModel, state, actions }: { viewModel: AdminViewModel, state: AdminPresenterState, actions: AdminPresenterActions }) {
  const waitingItems = viewModel.items.filter(i => i.status === QueueStatus.WAITING);
  const inProgressItems = viewModel.items.filter(i => i.status === QueueStatus.IN_PROGRESS);
  
  const currentServingItem = inProgressItems.length > 0 ? inProgressItems[0] : null;
  const nextUpItem = waitingItems.length > 0 ? waitingItems[0] : null;

  const waitingCount = viewModel.stats?.waitingItems || waitingItems.length;

  return (
    <div className="fixed inset-0 z-[999] w-full h-full overflow-hidden flex flex-col font-sans selection:bg-[#FF00FF] selection:text-white"
         style={{ backgroundColor: '#f4f4f0', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px', color: '#111' }}>
      
      {/* ─── Top Bar ─── */}
      <header className="flex items-center justify-between p-4 sm:p-6 bg-[#00FFFF] border-b-[4px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin" 
            className="p-3 bg-white border-[3px] border-black hover:bg-[#FF00FF] hover:text-white transition-colors flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <ArrowLeft className="w-6 h-6 stroke-[3px]" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-widest uppercase" style={{ WebkitTextStroke: '1px black', color: 'white' }}>{viewModel.shopConfig.shopName}</h1>
            <p className="text-black text-sm font-black uppercase tracking-widest flex items-center gap-2 bg-[#39FF14] px-2 py-0.5 border-2 border-black w-max mt-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <span className="w-2 h-2 bg-black rounded-full animate-ping"></span>
              SYS.ONLINE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end bg-white border-[3px] border-black p-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#FF00FF]">TIME.SYS</div>
            <div className="font-mono font-black text-lg">
              {viewModel.shopConfig.operatingHours.open} - {viewModel.shopConfig.operatingHours.close}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col lg:flex-row h-full">
        
        {/* Left Side: Current Serving (Hero) */}
        <div className="flex-1 flex flex-col p-6 sm:p-12 items-center justify-center border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black relative">
          <div className="absolute top-4 left-4 text-black font-black uppercase tracking-widest text-sm bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] z-10">
            VIEW.CURRENT
          </div>
          
          <div className="w-full max-w-3xl aspect-[16/9] bg-black border-[6px] border-[#FF00FF] flex flex-col items-center justify-center shadow-[16px_16px_0_0_rgba(0,0,0,1)] relative overflow-hidden group">
            {/* Retro grid background internal */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="text-[120px] sm:text-[180px] lg:text-[240px] font-black leading-none tracking-tighter text-[#00FFFF] z-10 relative drop-shadow-[0_0_15px_#00FFFF]">
              {currentServingItem ? formatQueueNumber(currentServingItem.queueNumber) : '---'}
              {currentServingItem && (
                 <div className="absolute -right-12 -top-12 text-[#FF00FF] text-6xl opacity-50 blur-sm">A</div>
              )}
            </div>
            
            {currentServingItem && currentServingItem.customerName && (
              <div className="text-3xl sm:text-5xl text-white mt-8 z-10 font-black bg-[#FF00FF] px-6 py-2 border-4 border-[#00FFFF] -rotate-2 group-hover:rotate-2 transition-transform shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                {currentServingItem.customerName}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 w-full max-w-3xl mt-12">
            <button 
              disabled={!currentServingItem || state.loading}
              onClick={() => currentServingItem && actions.markCompleted(currentServingItem.id)}
              className="py-6 sm:py-8 bg-[#39FF14] hover:bg-white disabled:opacity-50 transition-all text-black border-4 border-black font-black uppercase tracking-widest text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-[8px_8px_0_0_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none"
            >
              <Check className="w-8 h-8" strokeWidth={4} />
              COMPLETE()
            </button>
            <button 
              disabled={!currentServingItem || state.loading}
              onClick={() => currentServingItem && actions.markCancelled(currentServingItem.id)}
              className="py-6 sm:py-8 bg-[#FF00FF] hover:bg-white disabled:opacity-50 transition-all text-white hover:text-black border-4 border-black font-black uppercase tracking-widest text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-[8px_8px_0_0_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none"
            >
              <FastForward className="w-8 h-8" strokeWidth={4} />
              SKIP()
            </button>
          </div>
        </div>

          {/* Right Side: Control & Next Up */}
          <div className="w-full lg:w-[480px] flex flex-col bg-white p-6 sm:p-10 shrink-0 border-l-[4px] border-black">
            
            <div className="bg-[#f0f0f0] p-6 border-[4px] border-black mb-8 flex flex-col items-center justify-center flex-1 lg:flex-none relative shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <div className="absolute -top-4 -right-4 bg-[#00FFFF] border-[3px] border-black p-2 font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform rotate-12">
                 UP.NEXT
              </div>
              <div className="text-black font-black uppercase tracking-widest text-sm mb-4 bg-white border-2 border-black w-full py-2 text-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">QUEUE.BUFFER</div>
              
              <div className="bg-black w-full py-8 border-[4px] border-[#FF00FF] flex flex-col items-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 pointer-events-none"></div>
                <div className="text-7xl sm:text-8xl font-black text-[#39FF14] mb-2 tracking-tighter drop-shadow-[0_0_10px_#39FF14] relative z-20">
                  {nextUpItem ? formatQueueNumber(nextUpItem.queueNumber) : '---'}
                </div>
                {nextUpItem && nextUpItem.customerName && (
                   <div className="text-xl text-white font-black bg-[#FF00FF] px-4 py-1 mt-2 transform skew-x-12 relative z-20">{nextUpItem.customerName}</div>
                )}
              </div>
              
              <div className="w-full h-[8px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzgnPgo8cmVjdCB3aWR0aD0nOCcgaGVpZ2h0PSc4JyBmaWxsPScjZmZmJy8+CjxwYXRoIGQ9J00wIDBMOCA4Wk04IDBMMCA4Wicgc3Ryb2tlPScjMDAwJyBzdHJva2Utd2lkdGg9JzEnLz4KPC9zdmc+')] my-6 border-y-2 border-black"></div>
  
              <div className="flex justify-between items-center text-black w-full border-[3px] border-black p-4 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <div className="text-sm font-black uppercase tracking-widest text-[#FF00FF]">WAIT.COUNT = </div>
                <div className="text-4xl font-black text-[#00FFFF]" style={{ WebkitTextStroke: '1.5px black' }}>
                   {waitingCount} <span className="text-base font-black text-black" style={{ WebkitTextStroke: '0px' }}>USR</span>
                </div>
              </div>
            </div>
  
            <button 
              disabled={!nextUpItem || state.loading}
              onClick={() => nextUpItem && actions.markInProgress(nextUpItem.id)}
              className="w-full py-8 sm:py-10 bg-[#FF00FF] hover:bg-[#00FFFF] disabled:opacity-50 transition-all text-white hover:text-black font-black text-3xl border-[4px] border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-2 hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-8 active:translate-x-3 active:translate-y-3 active:shadow-none"
            >
              <span className="uppercase tracking-widest">CALL.NEXT()</span>
            </button>
  
            <div className="mt-auto">
               <button 
                  onClick={() => {
                     const dummyData = {
                        customerName: 'Walk-in',
                        serviceType: ServiceType.GENERAL,
                        note: 'Walk-in from Focus Mode'
                     };
                     actions.createQueueItem(dummyData).catch(console.error);
                  }}
                  className="w-full py-5 bg-white hover:bg-[#39FF14] text-black border-[4px] border-black font-black uppercase tracking-widest text-lg flex items-center justify-center gap-3 shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  <Plus className="w-8 h-8 bg-black text-white p-1" strokeWidth={4} />
                  WALK_IN.ADD()
                </button>
            </div>
  
          </div>

      </main>
    </div>
  );
}
