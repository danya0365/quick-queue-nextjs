'use client';

import { QueueStatus, ServiceType } from '@/src/domain/types/queue';
import { AdminViewModel } from '@/src/presentation/presenters/admin/AdminPresenter';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { ArrowLeft, Check, FastForward, Plus } from 'lucide-react';
import Link from 'next/link';

export function AdminFocusEditorialTemplate({ viewModel, state, actions }: { viewModel: AdminViewModel, state: AdminPresenterState, actions: AdminPresenterActions }) {
  const waitingItems = viewModel.items.filter(i => i.status === QueueStatus.WAITING);
  const inProgressItems = viewModel.items.filter(i => i.status === QueueStatus.IN_PROGRESS);
  
  const currentServingItem = inProgressItems.length > 0 ? inProgressItems[0] : null;
  const nextUpItem = waitingItems.length > 0 ? waitingItems[0] : null;

  const waitingCount = viewModel.stats?.waitingItems || waitingItems.length;

  return (
    <div className="fixed inset-0 z-[999] w-full h-full overflow-hidden flex flex-col bg-white text-black font-serif selection:bg-black selection:text-white">
      
      {/* ─── Top Bar ─── */}
      <header className="flex items-center justify-between p-4 sm:p-6 bg-white border-b-4 border-black">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin" 
            className="p-3 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase">{viewModel.shopConfig.shopName}</h1>
            <p className="text-black text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
              SYSTEM.READY
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <div className="text-xs font-black uppercase tracking-widest">OPERATION.HOURS</div>
            <div className="font-mono font-bold text-lg border-b-2 border-black">
              {viewModel.shopConfig.operatingHours.open} - {viewModel.shopConfig.operatingHours.close}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col lg:flex-row h-full">
        
        {/* Left Side: Current Serving (Hero) */}
        <div className="flex-1 flex flex-col bg-gray-50 p-6 sm:p-12 items-center justify-center border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black">
          <div className="text-black font-black uppercase tracking-[0.2em] text-sm sm:text-base border-b-2 border-black pb-2 mb-8 text-center">CURRENTLY SERVING</div>
          
          <div className="w-full max-w-3xl aspect-[16/9] bg-white border-[8px] border-black flex flex-col items-center justify-center shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="text-[120px] sm:text-[180px] lg:text-[240px] font-black leading-none tracking-tighter text-black">
              {currentServingItem ? `A${currentServingItem.queueNumber.toString().padStart(3, '0')}` : '--'}
            </div>
            
            {currentServingItem && currentServingItem.customerName && (
              <div className="text-2xl sm:text-4xl text-gray-600 mt-4 font-bold border-t-4 border-black pt-4">
                คุณ {currentServingItem.customerName}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 w-full max-w-3xl mt-12">
            <button 
              disabled={!currentServingItem || state.loading}
              onClick={() => currentServingItem && actions.markCompleted(currentServingItem.id)}
              className="py-6 sm:py-8 bg-black hover:bg-white disabled:opacity-50 disabled:hover:bg-black transition-all text-white hover:text-black border-4 border-black font-black uppercase tracking-widest text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] hover:shadow-none active:translate-x-2 active:translate-y-2"
            >
              <Check className="w-8 h-8" strokeWidth={3} />
              เสร็จสิ้น / COMPLETE
            </button>
            <button 
              disabled={!currentServingItem || state.loading}
              onClick={() => currentServingItem && actions.markCancelled(currentServingItem.id)}
              className="py-6 sm:py-8 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white border-4 border-black transition-all text-black font-black uppercase tracking-widest text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] hover:shadow-none active:translate-x-2 active:translate-y-2"
            >
              <FastForward className="w-8 h-8" strokeWidth={3} />
              ข้ามคิว / SKIP
            </button>
          </div>
        </div>

          {/* Right Side: Control & Next Up */}
          <div className="w-full lg:w-[480px] flex flex-col bg-white p-6 sm:p-10 shrink-0">
            
            <div className="bg-white p-8 border-[4px] border-black mb-8 flex flex-col items-center justify-center flex-1 lg:flex-none relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-black"></div>
               <div className="absolute top-2 right-2 w-12 h-12 border-2 border-white flex items-center justify-center text-white font-black text-2xl group-hover:rotate-180 transition-transform duration-500">
                  <ArrowLeft className="w-6 h-6 -rotate-45" />
               </div>

              <div className="text-black font-black uppercase tracking-[0.2em] text-sm mb-4 border-b-2 border-black pb-2 text-center w-full">NEXT.IN.LINE</div>
              <div className="text-7xl sm:text-8xl font-black text-black mb-4 tracking-tighter">
                {nextUpItem ? `A${nextUpItem.queueNumber.toString().padStart(3, '0')}` : '--'}
              </div>
              {nextUpItem && nextUpItem.customerName && (
                 <div className="text-2xl text-gray-600 font-bold">คุณ {nextUpItem.customerName}</div>
              )}
              
              <div className="w-full h-[4px] bg-black my-8"></div>
  
              <div className="flex flex-col items-center gap-2 text-black w-full border-[2px] border-black p-4 bg-gray-50">
                <div className="text-xs font-black uppercase tracking-widest text-gray-500">WAITING.COUNT</div>
                <div className="text-4xl font-black flex items-baseline gap-2">
                   {waitingCount} <span className="text-lg font-bold text-gray-400 uppercase">Persons</span>
                </div>
              </div>
            </div>
  
            <button 
              disabled={!nextUpItem || state.loading}
              onClick={() => nextUpItem && actions.markInProgress(nextUpItem.id)}
              className="w-full py-8 sm:py-10 bg-black hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black transition-all text-white font-black text-2xl sm:text-3xl border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] flex flex-col items-center justify-center gap-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none mb-8"
            >
              <span className="uppercase tracking-[0.1em]">เรียกคิวถัดไป</span>
              {nextUpItem && (
                <span className="text-gray-400 text-lg font-bold border-t-2 border-gray-700 pt-2 w-1/2 text-center">
                  (A{nextUpItem.queueNumber.toString().padStart(3, '0')})
                </span>
              )}
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
                  className="w-full py-6 bg-white hover:bg-gray-100 text-black border-[4px] border-black font-black uppercase tracking-widest text-lg flex items-center justify-center gap-3 active:translate-x-1 active:translate-y-1"
                >
                  <Plus className="w-6 h-6" strokeWidth={3} />
                  เพิ่มคิวหน้าร้าน / WALK-IN
                </button>
            </div>
  
          </div>

      </main>
    </div>
  );
}
