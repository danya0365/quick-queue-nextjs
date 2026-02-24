'use client';

import { formatQueueNumber } from '@/src/config/queue-display.config';
import { QueueItem, SERVICE_TYPE_CONFIG, ServiceType } from '@/src/domain/types/queue';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { ArrowLeft, Bell, Check, ChevronDown, ChevronUp, FastForward, Inbox, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { KioskViewModel } from '../AdminKioskView';

interface AdminKioskTemplateProps {
  kioskViewModel: KioskViewModel;
  state: AdminPresenterState;
  actions: AdminPresenterActions;
}

export function AdminKioskEditorialTemplate({ kioskViewModel, state, actions }: AdminKioskTemplateProps) {
  const { servingItems, latestServingItem, nextUpItem, waitingCount, pendingRequests, pendingCount, stats } = kioskViewModel;
  const [isPendingExpanded, setIsPendingExpanded] = useState(false);
  const [isOtherServingExpanded, setIsOtherServingExpanded] = useState(false);

  return (
    <div className="fixed inset-0 z-[999] w-full h-full overflow-hidden flex flex-col bg-white text-black font-serif selection:bg-black selection:text-white">
      
      {/* ─── Header ─── */}
      <header className="flex items-center justify-between p-3 sm:p-5 bg-white border-b-4 border-black shrink-0">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin" 
            className="p-2.5 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase">จอปฏิบัติการ</h1>
            <p className="text-black text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
              SYSTEM.READY
            </p>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="hidden sm:flex items-center gap-0 text-xs font-black uppercase tracking-wider">
          <span className="border-2 border-black px-2.5 py-1.5 bg-gray-100">ALL: {stats.total}</span>
          <span className="border-2 border-l-0 border-black px-2.5 py-1.5 bg-amber-50 text-amber-800">WAIT: {stats.waiting}</span>
          <span className="border-2 border-l-0 border-black px-2.5 py-1.5 bg-blue-50 text-blue-800">SRV: {stats.serving}</span>
          <span className="border-2 border-l-0 border-black px-2.5 py-1.5 bg-emerald-50 text-emerald-800">DONE: {stats.completed}</span>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ═══ Left Zone: Serving Status ═══ */}
        <div className="flex-1 flex flex-col p-3 sm:p-6 lg:p-8 bg-zinc-100 overflow-y-auto border-b lg:border-b-0 lg:border-r-2 border-black pb-20 sm:pb-6 space-y-4 sm:space-y-8 custom-scrollbar">
          
          <div className="text-black font-black uppercase tracking-[0.15em] text-sm border-b-2 border-black pb-2 mb-6 flex items-center justify-between">
            <span>SERVING.STATUS ({servingItems.length})</span>
          </div>

          {servingItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30">
              <Inbox className="w-24 h-24 mb-4" strokeWidth={1} />
              <p className="text-2xl font-black uppercase tracking-widest">NO.ACTIVE.QUEUE</p>
              <p className="text-sm mt-2 font-bold uppercase tracking-wider">กด CALL.NEXT เพื่อเริ่ม</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* ★ Hero Card */}
              {latestServingItem && (
                <div className="w-full bg-white border-[6px] border-black p-6 sm:p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative">
                  {/* Corner tag */}
                  <div className="absolute -top-4 -left-1 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-2 border-black">
                    LATEST
                  </div>
                  
                  {/* Floating Service Type Badge */}
                  <div className="absolute -top-3 -right-3 bg-white border-[3px] border-black p-1.5 sm:p-2 font-black text-black text-[9px] sm:text-[10px] uppercase tracking-widest z-30 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                    {SERVICE_TYPE_CONFIG[latestServingItem.serviceType]?.label || latestServingItem.serviceType}
                  </div>

                  <div className="absolute top-4 right-4 text-xs font-mono font-bold text-gray-400 mt-4 sm:mt-6">
                    {new Date(latestServingItem.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mt-6">
                    <div className="text-[80px] sm:text-[120px] lg:text-[160px] font-black leading-none tracking-tighter">
                      {formatQueueNumber(latestServingItem.queueNumber)}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      {latestServingItem.customerName && (
                        <div className="text-2xl sm:text-3xl font-black text-gray-700 mb-1 border-b-4 border-black pb-2">
                          คุณ {latestServingItem.customerName}
                        </div>
                      )}
                      {latestServingItem.note && (
                        <div className="mt-3 text-sm font-bold text-black border-l-4 border-black pl-3 py-1 uppercase max-w-full break-words">
                          NOTE: {latestServingItem.note}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <button 
                      disabled={state.loading}
                      onClick={() => actions.markCompleted(latestServingItem.id)}
                      className="py-2.5 sm:py-5 bg-black hover:bg-white disabled:opacity-50 transition-all text-white hover:text-black border-[3px] sm:border-4 border-black font-black uppercase tracking-widest text-sm sm:text-xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] sm:shadow-[6px_6px_0_0_rgba(0,0,0,0.2)] hover:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                      <Check className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={3} />
                      COMPLETE
                    </button>
                    <button 
                      disabled={state.loading}
                      onClick={() => actions.markCancelled(latestServingItem.id)}
                      className="py-2.5 sm:py-5 bg-white hover:bg-gray-100 disabled:opacity-50 border-[3px] sm:border-4 border-black transition-all text-black font-black uppercase tracking-widest text-sm sm:text-xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] sm:shadow-[6px_6px_0_0_rgba(0,0,0,0.1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                      <FastForward className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={3} />
                      SKIP
                    </button>
                  </div>
                </div>
              )}

              {/* Other Items in Progress */}
              {servingItems.length > 1 && (
                <>
                  <button
                    onClick={() => setIsOtherServingExpanded(!isOtherServingExpanded)}
                    className="w-full flex sm:hidden items-center justify-between mt-4 p-3 border-[3px] border-black bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-black">OTHER.SERVING</span>
                      <span className="text-[10px] font-black bg-black text-white px-1.5 py-0.5">{servingItems.length - 1}</span>
                    </div>
                    {isOtherServingExpanded ? (
                      <ChevronUp className="w-4 h-4 text-black" strokeWidth={3} />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-black" strokeWidth={3} />
                    )}
                  </button>
                  
                  <div className={`space-y-3 mt-3 sm:mt-4 sm:block ${isOtherServingExpanded ? 'block' : 'hidden'}`}>
                    {servingItems.slice(1).map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div className="text-2xl font-black text-black min-w-[70px]">
                          {formatQueueNumber(item.queueNumber)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-black text-black">{item.customerName || '-'}</div>
                          <div className="text-xs font-bold text-gray-500 mt-0.5">
                            {new Date(item.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <button
                          onClick={() => actions.markCompleted(item.id)}
                          className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 border-2 border-black text-black text-sm font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                          เสร็จสิ้น
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ═══ Right Zone: Controls ═══ */}
        <div className="w-full lg:w-[400px] xl:w-[460px] flex flex-col pt-2 sm:pt-6 px-3 sm:px-6 pb-4 sm:pb-6 shrink-0 overflow-y-auto relative">
          
          {/* Next Up */}
          <div className="bg-white p-3 sm:p-6 border-[3px] sm:border-[4px] border-black mb-2 sm:mb-4 relative flex flex-row sm:flex-col items-center justify-between sm:justify-start">
            
            <div className="hidden sm:block absolute -top-3 right-4 bg-black text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 sm:py-1">
              NEXT.IN.LINE
            </div>
            
            {/* Left Side (Mobile) / Center (Desktop): Queue Info */}
            <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
              <div className="sm:hidden text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">NEXT.IN.LINE</div>
              <div className="flex items-baseline gap-2 sm:block">
                <div className="text-4xl sm:text-7xl font-black tracking-tighter leading-none">
                  {nextUpItem ? formatQueueNumber(nextUpItem.queueNumber) : '--'}
                </div>
                {nextUpItem?.customerName && (
                  <div className="text-xs sm:text-xl text-gray-500 font-bold sm:mt-1">คุณ {nextUpItem.customerName}</div>
                )}
              </div>
            </div>
            
            {/* Right Side (Mobile) / Bottom (Desktop): Waiting Count */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center sm:justify-between sm:border-2 sm:border-black sm:p-3 sm:bg-gray-50 sm:mt-4 sm:w-full">
              <span className="text-[8px] sm:text-xs font-black uppercase tracking-widest text-gray-400 sm:text-gray-400">WAITING</span>
              <span className="text-lg sm:text-2xl font-black leading-none mt-0.5 sm:mt-0">{waitingCount} <span className="text-[9px] sm:text-sm font-bold text-gray-400">PRS</span></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 sm:gap-0 mb-3 sm:mb-4">
            {/* Call Next */}
            <button 
              disabled={!nextUpItem || state.loading}
              onClick={() => nextUpItem && actions.markInProgress(nextUpItem.id)}
              className="w-full py-1.5 sm:py-8 bg-black hover:bg-gray-800 disabled:opacity-50 transition-all text-white font-black text-xs sm:text-3xl border-[3px] sm:border-[4px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] flex flex-col items-center justify-center gap-0 sm:gap-1 hover:translate-x-1 hover:translate-y-1 hover:shadow-none sm:mb-4 px-1 text-center leading-tight min-h-[36px] sm:min-h-0"
            >
              <span className="uppercase tracking-[0.05em] sm:tracking-[0.1em]">เรียกคิวถัดไป</span>
              {nextUpItem && (
                <span className="text-gray-400 text-[10px] sm:text-sm font-bold border-t sm:border-t-2 border-gray-700 pt-0.5 sm:pt-1 mt-0.5 sm:mt-1">
                  ({formatQueueNumber(nextUpItem.queueNumber)})
                </span>
              )}
            </button>

            {/* Walk-in */}
            <button 
              onClick={() => {
                const dummyData = {
                  customerName: 'Walk-in',
                  serviceType: ServiceType.GENERAL,
                  note: 'Walk-in จาก จอปฏิบัติการ'
                };
                actions.createQueueItem(dummyData).catch(console.error);
              }}
              className="w-full py-1.5 sm:py-4 bg-white hover:bg-gray-100 text-black border-[3px] border-black font-black uppercase tracking-widest text-[9px] sm:text-base flex items-center justify-center gap-1 sm:gap-2 active:translate-x-1 active:translate-y-1 px-1 text-center leading-tight min-h-[36px] sm:min-h-0"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" strokeWidth={3} />
              <span className="truncate">WALK-IN.ADD()</span>
            </button>
          </div>

          {/* Pending — Expandable */}
          <div className="mt-auto">
            <button
              onClick={() => setIsPendingExpanded(!isPendingExpanded)}
              className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-black bg-amber-50 hover:bg-amber-100 transition-colors border-[3px]"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="font-black text-sm uppercase tracking-widest">PENDING.REQ</span>
                <span className="bg-black text-white text-xs font-black px-2 py-0.5">{pendingCount}</span>
              </div>
              {isPendingExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {isPendingExpanded && (
              <div className="border-x-[3px] border-b-[3px] border-black space-y-0 max-h-[300px] overflow-y-auto">
                {pendingRequests.map(req => (
                  <div key={req.id} className="border-b border-gray-200 last:border-b-0 p-3 flex items-center justify-between gap-2 bg-white">
                    <div className="min-w-0">
                      <div className="font-black text-sm uppercase truncate">{req.customerName}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5">
                        <span>{SERVICE_TYPE_CONFIG[req.serviceType]?.label}</span>
                        <span className="font-mono">{req.trackingCode}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button 
                        onClick={async () => { await actions.approveRequest(req.id); }}
                        className="px-2.5 py-1.5 bg-black hover:bg-gray-800 text-white text-[10px] font-black uppercase transition-colors"
                      >
                        APPROVE
                      </button>
                      <button 
                        onClick={() => actions.openRejectModal(req.id)}
                        className="px-2.5 py-1.5 bg-white border-2 border-black hover:bg-gray-100 text-black text-[10px] font-black uppercase transition-colors"
                      >
                        REJECT
                      </button>
                    </div>
                  </div>
                ))}
                <Link
                  href="/admin/pending-requests"
                  className="block text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black py-2 transition-colors bg-gray-50 border-t border-gray-200"
                >
                  VIEW.ALL →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function EditorialServingRow({ item, state, actions }: { item: QueueItem; state: AdminPresenterState; actions: AdminPresenterActions }) {
  return (
    <div className="flex items-center gap-3 border-[3px] border-black p-3 bg-white">
      <div className="text-2xl font-black tracking-tighter min-w-[80px]">
        {formatQueueNumber(item.queueNumber)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-black uppercase truncate">{item.customerName || '-'}</div>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
          {SERVICE_TYPE_CONFIG[item.serviceType]?.label} · {new Date(item.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
        </div>
        {item.note && (
          <div className="text-[10px] font-bold text-black border-l-2 border-black pl-2 uppercase truncate max-w-full">
            N: {item.note}
          </div>
        )}
      </div>
      <div className="flex gap-1 shrink-0">
        <button
          disabled={state.loading}
          onClick={() => actions.markCompleted(item.id)}
          className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors disabled:opacity-50"
          title="COMPLETE"
        >
          <Check className="w-4 h-4" strokeWidth={3} />
        </button>
        <button
          disabled={state.loading}
          onClick={() => actions.markCancelled(item.id)}
          className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors disabled:opacity-50"
          title="SKIP"
        >
          <FastForward className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
