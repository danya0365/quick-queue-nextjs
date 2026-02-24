'use client';

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
  onRefreshPending: () => Promise<void>;
}

export function AdminKioskRetroTechMagazineTemplate({ kioskViewModel, state, actions, onRefreshPending }: AdminKioskTemplateProps) {
  const { servingItems, latestServingItem, nextUpItem, waitingCount, pendingRequests, pendingCount, stats } = kioskViewModel;
  const [isPendingExpanded, setIsPendingExpanded] = useState(false);

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
            <h1 className="text-xl sm:text-2xl font-black tracking-widest uppercase" style={{ WebkitTextStroke: '0.5px black' }}>KIOSK.SYS</h1>
            <p className="text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-[#39FF14] px-2 py-0.5 border-2 border-black w-max mt-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></span>
              SYS.ONLINE
            </p>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="hidden sm:flex items-center gap-0 text-[10px] font-black uppercase tracking-widest">
          <span className="border-[3px] border-black px-2 py-1.5 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]">TOT={stats.total}</span>
          <span className="border-[3px] border-l-0 border-black px-2 py-1.5 bg-[#FF00FF] text-white">WAIT={stats.waiting}</span>
          <span className="border-[3px] border-l-0 border-black px-2 py-1.5 bg-[#00FFFF]">SRV={stats.serving}</span>
          <span className="border-[3px] border-l-0 border-black px-2 py-1.5 bg-[#39FF14]">DONE={stats.completed}</span>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ═══ Left Zone: Serving Status ═══ */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black relative">
          <div className="absolute top-3 left-3 text-black font-black uppercase tracking-widest text-xs bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] z-10">
            VIEW.SERVING [{servingItems.length}]
          </div>

          {servingItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 mt-8">
              <Inbox className="w-24 h-24 mb-4" strokeWidth={1.5} />
              <p className="text-2xl font-black uppercase tracking-widest">NULL.ACTIVE.QUEUE</p>
              <p className="text-sm mt-2 font-bold uppercase tracking-wider">EXEC CALL.NEXT() TO START_</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 mt-8">
              {/* ★ Hero Card */}
              {latestServingItem && (
                <div className="w-full bg-black border-[5px] border-[#FF00FF] p-6 sm:p-8 shadow-[16px_16px_0_0_rgba(0,0,0,1)] relative overflow-hidden group">
                  {/* Scanline effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-20"></div>
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#FF00FF] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 border-2 border-[#00FFFF] shadow-[2px_2px_0_0_rgba(0,255,255,0.5)]">★ LATEST_</span>
                      <span className="text-xs font-mono font-bold text-[#39FF14]">
                        @{new Date(latestServingItem.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                      <div className="text-[80px] sm:text-[120px] lg:text-[160px] font-black leading-none tracking-tighter text-[#00FFFF] drop-shadow-[0_0_15px_#00FFFF]">
                        A{latestServingItem.queueNumber.toString().padStart(3, '0')}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        {latestServingItem.customerName && (
                          <div className="text-2xl sm:text-3xl font-black text-white bg-[#FF00FF] px-4 py-2 border-3 border-[#00FFFF] inline-block transform -rotate-1 group-hover:rotate-1 transition-transform shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                            {latestServingItem.customerName}
                          </div>
                        )}
                        <div className="text-sm font-black uppercase tracking-widest text-[#39FF14] mt-3">
                          TYPE={SERVICE_TYPE_CONFIG[latestServingItem.serviceType]?.label}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <button 
                        disabled={state.loading}
                        onClick={() => actions.markCompleted(latestServingItem.id)}
                        className="py-4 sm:py-5 bg-[#39FF14] hover:bg-white disabled:opacity-50 transition-all text-black border-4 border-black font-black uppercase tracking-widest text-lg sm:text-xl flex items-center justify-center gap-2 shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none"
                      >
                        <Check className="w-6 h-6" strokeWidth={4} />
                        COMPLETE()
                      </button>
                      <button 
                        disabled={state.loading}
                        onClick={() => actions.markCancelled(latestServingItem.id)}
                        className="py-4 sm:py-5 bg-[#FF00FF] hover:bg-white disabled:opacity-50 transition-all text-white hover:text-black border-4 border-black font-black uppercase tracking-widest text-lg sm:text-xl flex items-center justify-center gap-2 shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none"
                      >
                        <FastForward className="w-6 h-6" strokeWidth={4} />
                        SKIP()
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Other Serving Items ── */}
              {servingItems.length > 1 && (
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-widest text-[#FF00FF] bg-white border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    BUFFER.SERVING [{servingItems.length - 1}]
                  </div>
                  {servingItems.slice(1).map((item) => (
                    <RetroServingRow key={item.id} item={item} state={state} actions={actions} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══ Right Zone: Controls ═══ */}
        <div className="w-full lg:w-[400px] xl:w-[460px] flex flex-col bg-white p-4 sm:p-6 shrink-0 overflow-y-auto border-l-[4px] border-black">
          
          {/* Next Up */}
          <div className="bg-[#f0f0f0] p-5 border-[4px] border-black mb-4 relative shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <div className="absolute -top-4 -right-4 bg-[#00FFFF] border-[3px] border-black p-2 font-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] transform rotate-12 text-[10px] tracking-widest">
              UP.NEXT
            </div>
            
            <div className="bg-black w-full py-6 border-[3px] border-[#FF00FF] flex flex-col items-center relative overflow-hidden mb-4">
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
              <div className="text-5xl sm:text-6xl font-black text-[#39FF14] tracking-tighter drop-shadow-[0_0_10px_#39FF14] relative z-20">
                {nextUpItem ? `A${nextUpItem.queueNumber.toString().padStart(3, '0')}` : '---'}
              </div>
              {nextUpItem?.customerName && (
                <div className="text-lg text-white font-black bg-[#FF00FF] px-3 py-0.5 mt-2 transform skew-x-12 relative z-20">{nextUpItem.customerName}</div>
              )}
            </div>

            <div className="flex justify-between items-center border-[3px] border-black p-3 bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF00FF]">WAIT.COUNT =</span>
              <span className="text-2xl font-black text-[#00FFFF]" style={{ WebkitTextStroke: '1px black' }}>
                {waitingCount} <span className="text-sm font-black text-black" style={{ WebkitTextStroke: '0px' }}>USR</span>
              </span>
            </div>
          </div>

          {/* Call Next */}
          <button 
            disabled={!nextUpItem || state.loading}
            onClick={() => nextUpItem && actions.markInProgress(nextUpItem.id)}
            className="w-full py-6 sm:py-8 bg-[#FF00FF] hover:bg-[#00FFFF] disabled:opacity-50 transition-all text-white hover:text-black font-black text-2xl sm:text-3xl border-[4px] border-black shadow-[10px_10px_0_0_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-1 hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-4 active:translate-x-3 active:translate-y-3 active:shadow-none uppercase tracking-widest"
          >
            CALL.NEXT()
          </button>

          {/* Walk-in */}
          <button 
            onClick={() => {
              const dummyData = {
                customerName: 'Walk-in',
                serviceType: ServiceType.GENERAL,
                note: 'Walk-in from Kiosk Mode'
              };
              actions.createQueueItem(dummyData).catch(console.error);
            }}
            className="w-full py-4 bg-white hover:bg-[#39FF14] text-black border-[4px] border-black font-black uppercase tracking-widest text-base flex items-center justify-center gap-2 shadow-[5px_5px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none mb-4"
          >
            <Plus className="w-6 h-6 bg-black text-white p-0.5" strokeWidth={4} />
            WALK_IN.ADD()
          </button>

          {/* Pending — Expandable */}
          {pendingCount > 0 && (
            <div className="mt-auto">
              <button
                onClick={() => setIsPendingExpanded(!isPendingExpanded)}
                className="w-full flex items-center justify-between px-3 py-3 border-[3px] border-black bg-[#FF00FF] text-white hover:bg-[#00FFFF] hover:text-black transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
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
                          onClick={async () => { await actions.approveRequest(req.id); onRefreshPending(); }}
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
          )}
        </div>
      </main>
    </div>
  );
}

function RetroServingRow({ item, state, actions }: { item: QueueItem; state: AdminPresenterState; actions: AdminPresenterActions }) {
  return (
    <div className="flex items-center gap-3 border-[3px] border-black p-3 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all">
      <div className="text-2xl font-black tracking-tighter min-w-[80px] text-[#FF00FF]" style={{ WebkitTextStroke: '0.5px black' }}>
        A{item.queueNumber.toString().padStart(3, '0')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-black uppercase truncate">{item.customerName || '-'}</div>
        <div className="text-[10px] text-[#FF00FF] font-bold uppercase tracking-wider">
          {SERVICE_TYPE_CONFIG[item.serviceType]?.label} · @{new Date(item.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
        </div>
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
