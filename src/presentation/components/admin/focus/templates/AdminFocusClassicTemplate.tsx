'use client';

import { formatQueueNumber } from '@/src/config/queue-display.config';
import { QueueStatus, ServiceType } from '@/src/domain/types/queue';
import { AdminViewModel } from '@/src/presentation/presenters/admin/AdminPresenter';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { ArrowLeft, Check, FastForward, Plus, Users } from 'lucide-react';
import Link from 'next/link';

interface AdminFocusTemplateProps {
  viewModel: AdminViewModel;
  state: AdminPresenterState;
  actions: AdminPresenterActions;
}

export function AdminFocusClassicTemplate({ viewModel, state, actions }: AdminFocusTemplateProps) {
  // Extract data
  const waitingItems = viewModel.items.filter(i => i.status === QueueStatus.WAITING);
  const inProgressItems = viewModel.items.filter(i => i.status === QueueStatus.IN_PROGRESS);
  
  // Logical next and current (assuming sorted by queueNumber asc)
  const currentServingItem = inProgressItems.length > 0 ? inProgressItems[0] : null;
  const nextUpItem = waitingItems.length > 0 ? waitingItems[0] : null;

  const waitingCount = viewModel.stats?.waitingItems || waitingItems.length;

  return (
    <div className="fixed inset-0 z-[999] w-full h-full overflow-hidden flex flex-col bg-slate-900 text-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* ─── Top Bar ─── */}
      <header className="flex items-center justify-between p-4 sm:p-6 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin" 
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-slate-300" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{viewModel.shopConfig.shopName}</h1>
            <p className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              ระบบจัดการคิวทำงานปกติ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <div className="text-sm text-slate-400">เวลาทำการ</div>
            <div className="font-mono font-bold">
              {viewModel.shopConfig.operatingHours.open} - {viewModel.shopConfig.operatingHours.close}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col lg:flex-row h-full">
        
        {/* Left Side: Current Serving (Hero) */}
        <div className="flex-1 flex flex-col bg-slate-900 p-6 sm:p-12 items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800/50">
          <div className="text-slate-400 font-bold uppercase tracking-widest text-lg sm:text-2xl mb-4 text-center">คิวปัจจุบันที่กำลังเรียก</div>
          
          <div className="w-full max-w-3xl aspect-[16/9] bg-slate-950 rounded-3xl border-8 border-slate-800 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] pointer-events-none rounded-full"></div>
            
            <div className="text-[120px] sm:text-[180px] lg:text-[240px] font-black leading-none tracking-tighter text-white drop-shadow-lg z-10">
              {currentServingItem ? formatQueueNumber(currentServingItem.queueNumber) : '--'}
            </div>
            
            {currentServingItem && currentServingItem.customerName && (
              <div className="text-2xl sm:text-4xl text-slate-300 mt-4 z-10 font-bold">
                คุณ {currentServingItem.customerName}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mt-8">
            <button 
              disabled={!currentServingItem || state.loading}
              onClick={() => currentServingItem && actions.markCompleted(currentServingItem.id)}
              className="py-6 sm:py-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all text-white font-bold text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95"
            >
              <Check className="w-8 h-8" strokeWidth={3} />
              เสร็จสิ้น
            </button>
            <button 
              disabled={!currentServingItem || state.loading}
              onClick={() => currentServingItem && actions.markCancelled(currentServingItem.id)}
              className="py-6 sm:py-8 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 border-2 border-slate-700 transition-all text-slate-300 hover:text-white font-bold text-xl sm:text-2xl flex items-center justify-center gap-3 active:scale-95"
            >
              <FastForward className="w-8 h-8" strokeWidth={3} />
              ข้ามคิว
            </button>
          </div>
        </div>

          {/* Right Side: Control & Next Up */}
          <div className="w-full lg:w-[480px] flex flex-col bg-slate-950 p-6 sm:p-10 shrink-0 border-l border-slate-800/50">
            
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 mb-6 flex flex-col items-center justify-center flex-1 lg:flex-none">
              <div className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2 text-center">คิวถัดไป</div>
              <div className="text-6xl sm:text-7xl font-black text-white mb-2 tracking-tighter">
                {nextUpItem ? formatQueueNumber(nextUpItem.queueNumber) : '--'}
              </div>
              {nextUpItem && nextUpItem.customerName && (
                 <div className="text-xl text-slate-400 font-medium">คุณ {nextUpItem.customerName}</div>
              )}
              
              <div className="w-full h-px bg-slate-800 my-8"></div>
  
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-bold">จำนวนคิวรอทั้งหมด</div>
                  <div className="text-3xl font-black text-white">{waitingCount} <span className="text-lg font-medium text-slate-500 tracking-normal">คิว</span></div>
                </div>
              </div>
            </div>
  
            <button 
              disabled={!nextUpItem || state.loading}
              onClick={() => nextUpItem && actions.markInProgress(nextUpItem.id)}
              className="w-full py-8 sm:py-12 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all rounded-3xl text-white font-black text-3xl sm:text-4xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] flex flex-col items-center justify-center gap-2 active:scale-95 mb-6"
            >
              <span className="uppercase tracking-wide">เรียกคิวถัดไป</span>
              {nextUpItem && (
                <span className="text-blue-200 text-lg font-bold">
                  ({formatQueueNumber(nextUpItem.queueNumber)})
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
                  className="w-full py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors rounded-2xl font-bold text-lg flex items-center justify-center gap-3 border border-slate-700 active:scale-95"
                >
                  <Plus className="w-6 h-6" />
                  เพิ่มคิวหน้าร้าน (Walk-in)
                </button>
            </div>
  
          </div>

      </main>
    </div>
  );
}
