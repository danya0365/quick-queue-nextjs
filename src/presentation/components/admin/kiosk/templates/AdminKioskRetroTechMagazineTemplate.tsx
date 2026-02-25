'use client';

import { formatQueueNumber } from '@/src/config/queue-display.config';
import { QueueItem, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
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

export function AdminKioskRetroTechMagazineTemplate({ kioskViewModel, state, actions }: AdminKioskTemplateProps) {
  const { servingItems, latestServingItem, nextUpItem, waitingCount, pendingRequests, pendingCount, stats } = kioskViewModel;
  const [isPendingExpanded, setIsPendingExpanded] = useState(false);
  const [isOtherServingExpanded, setIsOtherServingExpanded] = useState(false);

  return (
    <div className="fixed inset-0 z-[999] w-full h-full overflow-hidden flex flex-col font-sans selection:bg-[#FF00FF] selection:text-white"
         style={{ backgroundColor: '#f4f4f0', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px', color: '#111' }}>
      
      {/* ─── Header ─── */}
      <header className="flex items-center justify-between p-3 sm:p-5 bg-[#00FFFF] border-b-[4px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin" 
            className="p-2.5 bg-white border-[3px] border-black hover:bg-[#FF00FF] hover:text-white transition-colors flex items-center justify-center shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <ArrowLeft className="w-5 h-5 stroke-[3px]" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-widest uppercase" style={{ WebkitTextStroke: '0.5px black' }}>จอปฏิบัติการ</h1>
            <p className="text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-[#39FF14] px-2 py-0.5 border-2 border-black w-max mt-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></span>
              SYS.ONLINE
            </p>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="hidden sm:flex items-center gap-0 text-[10px] font-black uppercase tracking-widest">
          <span className="border-[3px] border-black px-2 py-1.5 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]">ทั้งหมด={stats.total}</span>
          <span className="border-[3px] border-l-0 border-black px-2 py-1.5 bg-[#FF00FF] text-white">รอ={stats.waiting}</span>
          <span className="border-[3px] border-l-0 border-black px-2 py-1.5 bg-[#00FFFF]">บริการ={stats.serving}</span>
          <span className="border-[3px] border-l-0 border-black px-2 py-1.5 bg-[#39FF14]">เสร็จ={stats.completed}</span>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ═══ Left Zone: Serving Status ═══ */}
        <div className="flex-1 flex flex-col overflow-y-auto p-3 sm:p-6 lg:p-8 border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black relative pb-20 sm:pb-6">
          <div className="absolute top-3 left-3 text-black font-black uppercase tracking-widest text-xs bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] z-10">
            กำลังให้บริการ [{servingItems.length}]
          </div>

          {servingItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 mt-8">
              <Inbox className="w-24 h-24 mb-4" strokeWidth={1.5} />
              <p className="text-2xl font-black uppercase tracking-widest">ไม่มีคิวที่กำลังให้บริการ</p>
              <p className="text-sm mt-2 font-bold uppercase tracking-wider">กด CALL.NEXT() เพื่อเริ่มเรียกคิว_</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 mt-8">
              {/* ★ Hero Card */}
              {latestServingItem && (
                <div className="w-full bg-black border-[5px] border-[#FF00FF] p-6 sm:p-8 shadow-[16px_16px_0_0_rgba(0,0,0,1)] relative group mt-4 sm:mt-6">
                  {/* Scanline effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-20"></div>
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                  
                  {/* Floating Service Type Badge */}
                  <div className="absolute -top-4 -right-4 bg-[#FF00FF] border-[3px] border-black p-2 sm:p-3 font-black text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] sm:shadow-[5px_5px_0_0_rgba(0,0,0,1)] transform rotate-12 text-[10px] sm:text-xs tracking-widest z-30">
                    TYPE={SERVICE_TYPE_CONFIG[latestServingItem.serviceType]?.label || latestServingItem.serviceType}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#FF00FF] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 border-2 border-[#00FFFF] shadow-[2px_2px_0_0_rgba(0,255,255,0.5)]">★ คิวล่าสุด_</span>
                      <span className="text-xs font-mono font-bold text-[#39FF14]">
                        @{new Date(latestServingItem.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                      <div className="text-[80px] sm:text-[120px] lg:text-[160px] font-black leading-none tracking-tighter text-[#00FFFF] drop-shadow-[0_0_15px_#00FFFF]">
                        {formatQueueNumber(latestServingItem.queueNumber)}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        {latestServingItem.customerName && (
                          <div className="text-2xl sm:text-3xl font-black text-white bg-[#FF00FF] px-4 py-2 border-3 border-[#00FFFF] inline-block transform -rotate-1 group-hover:rotate-1 transition-transform shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                            {latestServingItem.customerName}
                          </div>
                        )}
                        {latestServingItem.note && (
                          <div className="mt-4 text-xs font-black uppercase tracking-widest text-black bg-[#00FFFF] border-2 border-black p-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] inline-block transform rotate-1 break-words max-w-full">
                            MSG=&gt;{latestServingItem.note}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <button 
                        disabled={state.loading}
                        onClick={() => actions.markCompleted(latestServingItem.id)}
                        className="py-2.5 sm:py-5 bg-[#39FF14] hover:bg-white disabled:opacity-50 transition-all text-black border-[3px] sm:border-4 border-black font-black uppercase tracking-widest text-sm sm:text-xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 sm:active:translate-x-2 sm:active:translate-y-2 active:shadow-none"
                      >
                        <Check className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={4} />
                        COMPLETE()
                      </button>
                      <button 
                        disabled={state.loading}
                        onClick={() => actions.markCancelled(latestServingItem.id)}
                        className="py-2.5 sm:py-5 bg-[#FF00FF] hover:bg-white disabled:opacity-50 transition-all text-white hover:text-black border-[3px] sm:border-4 border-black font-black uppercase tracking-widest text-sm sm:text-xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 sm:active:translate-x-2 sm:active:translate-y-2 active:shadow-none"
                      >
                        <FastForward className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={4} />
                        SKIP()
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Other Serving Items ── */}
              {servingItems.length > 1 && (
                <>
                  <button
                    onClick={() => setIsOtherServingExpanded(!isOtherServingExpanded)}
                    className="w-full flex sm:hidden items-center justify-between mt-4 p-2.5 bg-[#00FFFF] border-[3px] border-black hover:bg-white text-black transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-widest">คิวอื่นๆ</span>
                      <span className="text-[11px] font-black bg-[#FF00FF] border-2 border-black text-white px-1.5 py-0.5">{servingItems.length - 1}</span>
                    </div>
                    {isOtherServingExpanded ? (
                      <ChevronUp className="w-5 h-5" strokeWidth={4} />
                    ) : (
                      <ChevronDown className="w-5 h-5" strokeWidth={4} />
                    )}
                  </button>
                  
                  <div className={`space-y-2 sm:block ${isOtherServingExpanded ? 'block' : 'hidden'}`}>
                    <div className="text-xs font-black uppercase tracking-widest text-[#FF00FF] bg-white border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                      คิวรอในระบบ [{servingItems.length - 1}]
                    </div>
                    {servingItems.slice(1).map((item) => (
                      <RetroServingRow key={item.id} item={item} state={state} actions={actions} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ═══ Right Zone: Controls ═══ */}
        <div className="w-full lg:w-[400px] xl:w-[460px] flex flex-col pt-2 lg:pt-6 px-3 lg:px-6 pb-4 lg:pb-6 shrink-0 overflow-y-auto bg-white border-l-[4px] border-black">
          
          {/* Next Up */}
          <div className="bg-[#f0f0f0] p-3 lg:p-5 border-[3px] lg:border-[4px] border-black mb-2 lg:mb-4 relative shadow-[3px_3px_0_0_rgba(0,0,0,1)] lg:shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-row lg:flex-col items-center justify-between lg:justify-start">
            
            <div className="hidden lg:block absolute -top-4 -right-4 bg-[#00FFFF] border-[3px] border-black p-2 font-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] transform rotate-12 text-[10px] tracking-widest z-10">
              คิวถัดไป
            </div>

            {/* Left Side (Mobile) / Center (Desktop): Queue Info */}
            <div className="flex flex-col items-start lg:items-center bg-black lg:bg-black w-auto lg:w-full py-2 lg:py-6 px-3 lg:px-0 border-[3px] lg:border-[3px] border-[#FF00FF] lg:mb-4 relative overflow-hidden">
               {/* Grid scanlines overlay only for desktop to keep mobile clean */}
              <div className="hidden lg:block absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
              
              <div className="lg:hidden text-[9px] font-black uppercase text-[#FF00FF] mb-0.5">คิวถัดไป</div>

              <div className="flex items-baseline gap-2 lg:block relative z-20">
                <div className="text-4xl lg:text-6xl font-black text-[#39FF14] tracking-tighter drop-shadow-[0_0_5px_#39FF14] lg:drop-shadow-[0_0_10px_#39FF14] leading-none">
                  {nextUpItem ? formatQueueNumber(nextUpItem.queueNumber) : '--'}
                </div>
                {nextUpItem?.customerName && (
                  <div className="hidden lg:inline-block bg-[#FF00FF] text-white text-xs font-black px-3 py-1 mt-2 transform -rotate-2 border-2 border-black">
                    {nextUpItem.customerName}
                  </div>
                )}
                 {nextUpItem?.customerName && (
                  <div className="lg:hidden text-[#FF00FF] text-[10px] font-black mt-0.5 tracking-wider">
                    {nextUpItem.customerName}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side (Mobile) / Bottom (Desktop): Waiting Count */}
            <div className="flex flex-col lg:flex-row items-end lg:items-center justify-end lg:justify-between border-[2px] lg:border-[3px] border-black p-1.5 lg:p-3 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] lg:shadow-[3px_3px_0_0_rgba(0,0,0,1)] lg:w-full">
              <span className="text-[8px] lg:text-xs font-black uppercase tracking-widest text-[#FF00FF]">คิวรอทั้งหมด</span>
              <span className="text-lg lg:text-2xl font-black leading-none mt-0.5 lg:mt-0 text-[#00FFFF]" style={{ WebkitTextStroke: '1px black' }}>
                {waitingCount} <span className="text-[9px] lg:text-sm font-black text-black" style={{ WebkitTextStroke: '0px' }}>คิว</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 lg:flex lg:flex-col gap-2 lg:gap-0 mb-3 lg:mb-4">
            {/* Call Next */}
            <button 
              disabled={!nextUpItem || state.loading}
              onClick={() => nextUpItem && actions.markInProgress(nextUpItem.id)}
              className="w-full py-1.5 lg:py-8 bg-[#FF00FF] hover:bg-[#00FFFF] disabled:opacity-50 transition-all text-white hover:text-black font-black text-xs lg:text-3xl border-[3px] lg:border-[4px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] lg:shadow-[10px_10px_0_0_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-0 lg:gap-1 hover:translate-x-1 lg:hover:translate-x-2 hover:translate-y-1 lg:hover:translate-y-2 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] lg:hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] lg:mb-4 active:translate-x-2 lg:active:translate-x-3 active:translate-y-2 lg:active:translate-y-3 active:shadow-none uppercase tracking-widest text-center px-1 leading-tight min-h-[36px] lg:min-h-0"
            >
              CALL.NEXT()
            </button>

            {/* Add Queue */}
            <Link
              href="/admin/kiosk/new-queue"
              className="w-full py-1.5 lg:py-4 bg-white hover:bg-[#39FF14] text-black border-[3px] lg:border-[4px] border-black font-black uppercase tracking-widest text-[9px] lg:text-base flex items-center justify-center gap-1 lg:gap-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)] lg:shadow-[5px_5px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none px-1 text-center leading-tight min-h-[36px] lg:min-h-0"
            >
              <Plus className="w-3 h-3 lg:w-6 lg:h-6 bg-black text-white p-0.5 shrink-0" strokeWidth={4} />
              <span className="truncate">QUEUE.NEW()</span>
            </Link>
          </div>

          {/* Pending — Expandable */}
          <div className="mt-auto">
            <button
              onClick={() => setIsPendingExpanded(!isPendingExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 sm:py-3 border-[3px] border-black bg-[#FF00FF] text-white hover:bg-[#00FFFF] hover:text-black transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" strokeWidth={3} />
                <span className="font-black text-xs uppercase tracking-widest">PENDING.REQ_</span>
                <span className="bg-[#39FF14] text-black text-xs font-black px-2 py-0.5 border-2 border-black">{pendingCount}</span>
              </div>
              {isPendingExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {isPendingExpanded && (
              <div className="border-x-[3px] border-b-[3px] border-black space-y-0 max-h-[300px] overflow-y-auto bg-white">
                {pendingRequests.map(req => (
                  <div key={req.id} className="border-b-2 border-black last:border-b-0 p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-black text-sm uppercase truncate">{req.customerName}</div>
                      <div className="text-[10px] text-[#FF00FF] font-bold uppercase flex items-center gap-1.5">
                        <span>{SERVICE_TYPE_CONFIG[req.serviceType]?.label}</span>
                        <span className="font-mono bg-black text-[#00FFFF] px-1">{req.trackingCode}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button 
                        onClick={async () => { await actions.approveRequest(req.id); }}
                        className="px-2 py-1.5 bg-[#39FF14] hover:bg-[#00FFFF] text-black text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                      >
                        APPROVE
                      </button>
                      <button 
                        onClick={() => actions.openRejectModal(req.id)}
                        className="px-2 py-1.5 bg-red-500 text-white text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                      >
                        REJECT
                      </button>
                    </div>
                  </div>
                ))}
                <Link
                  href="/admin/pending-requests"
                  className="block text-center text-[10px] font-black uppercase tracking-widest text-[#FF00FF] hover:text-black py-2 transition-colors bg-[#f0f0f0] border-t-2 border-black"
                >
                  VIEW.ALL_ →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function RetroServingRow({ item, state, actions }: { item: QueueItem; state: AdminPresenterState; actions: AdminPresenterActions }) {
  return (
    <div className="flex items-center gap-3 border-[3px] border-black p-3 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all">
      <div className="text-2xl font-black tracking-tighter min-w-[80px] text-[#FF00FF]" style={{ WebkitTextStroke: '0.5px black' }}>
        {formatQueueNumber(item.queueNumber)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-black uppercase truncate">{item.customerName || '-'}</div>
        <div className="text-[10px] text-[#FF00FF] font-bold uppercase tracking-wider mb-1">
          {SERVICE_TYPE_CONFIG[item.serviceType]?.label} · @{new Date(item.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
        </div>
        {item.note && (
          <div className="text-[9px] font-black text-black bg-[#00FFFF] border border-black px-1 py-0.5 inline-block truncate max-w-full">
            MSG:&gt;{item.note}
          </div>
        )}
      </div>
      <div className="flex gap-1 shrink-0">
        <button
          disabled={state.loading}
          onClick={() => actions.markCompleted(item.id)}
          className="p-2 border-[3px] border-black bg-[#39FF14] hover:bg-[#00FFFF] transition-colors disabled:opacity-50 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          title="COMPLETE"
        >
          <Check className="w-4 h-4" strokeWidth={4} />
        </button>
        <button
          disabled={state.loading}
          onClick={() => actions.markCancelled(item.id)}
          className="p-2 border-[3px] border-black bg-[#FF00FF] text-white hover:bg-[#00FFFF] hover:text-black transition-colors disabled:opacity-50 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          title="SKIP"
        >
          <FastForward className="w-4 h-4" strokeWidth={4} />
        </button>
      </div>
    </div>
  );
}
