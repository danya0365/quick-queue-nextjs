'use client';

import { formatQueueNumber } from '@/src/config/queue-display.config';
import { QueueItem, SERVICE_TYPE_CONFIG, ServiceType } from '@/src/domain/types/queue';
import { AdminPresenterActions, AdminPresenterState } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { ArrowLeft, BarChart2, Bell, Check, ChevronDown, ChevronUp, FastForward, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { KioskViewModel } from '../AdminKioskView';

interface AdminKioskTemplateProps {
  kioskViewModel: KioskViewModel;
  state: AdminPresenterState;
  actions: AdminPresenterActions;
}

export function AdminKioskClassicTemplate({ kioskViewModel, state, actions }: AdminKioskTemplateProps) {
  const { servingItems, latestServingItem, nextUpItem, waitingCount, pendingRequests, pendingCount, stats } = kioskViewModel;
  const [isPendingExpanded, setIsPendingExpanded] = useState(false);
  const [isOtherServingExpanded, setIsOtherServingExpanded] = useState(false);

  return (
    <div className="fixed inset-0 z-[999] w-full h-full overflow-hidden flex flex-col bg-slate-900 text-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* ─── Header with Stats ─── */}
      <header className="flex items-center justify-between p-3 sm:p-4 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin" 
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight">จอปฏิบัติการ</h1>
            <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              ระบบพร้อมใช้งาน
            </p>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="bg-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">ทั้งหมด</span>
              <span className="font-bold text-white">{stats.total}</span>
            </span>
            <span className="bg-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="text-amber-400">รอ</span>
              <span className="font-bold text-amber-300">{stats.waiting}</span>
            </span>
            <span className="bg-blue-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="text-blue-400">บริการ</span>
              <span className="font-bold text-blue-300">{stats.serving}</span>
            </span>
            <span className="bg-emerald-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="text-emerald-400">เสร็จ</span>
              <span className="font-bold text-emerald-300">{stats.completed}</span>
            </span>
          </div>
        </div>
      </header>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ═══ Left Zone: Serving Status ═══ */}
        {/* Changed p-4 to p-3 for mobile, and added pb-20 sm:pb-6 space-y-4 sm:space-y-8 custom-scrollbar */}
        <div className="flex-1 flex flex-col overflow-y-auto p-3 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-800/50 pb-20 sm:pb-6 space-y-4 sm:space-y-8 custom-scrollbar">
          
          {/* Section Title */}
          <div className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            กำลังให้บริการ ({servingItems.length})
          </div>

          {/* ── Other Serving Items ── */}
          {servingItems.length > 0 && (
            <div className="flex flex-col gap-4">
              {/* ★ Hero Card — Latest Serving Item */}
              {latestServingItem && (
                <div className="w-full bg-slate-950 rounded-3xl border-2 border-blue-500/30 p-6 sm:p-8 shadow-[0_0_60px_-15px_rgba(59,130,246,0.3)] relative overflow-hidden">
                  {/* Glow */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <span className="bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">คิวล่าสุด</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(latestServingItem.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 relative z-10">
                    <div className="text-[80px] sm:text-[120px] lg:text-[160px] font-black leading-none tracking-tighter text-white drop-shadow-lg">
                      {formatQueueNumber(latestServingItem.queueNumber)}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      {latestServingItem.customerName && (
                        <div className="text-2xl sm:text-3xl font-bold text-slate-200 mb-2">
                          คุณ {latestServingItem.customerName}
                        </div>
                      )}
                      <div className="text-sm text-slate-400">
                        {SERVICE_TYPE_CONFIG[latestServingItem.serviceType]?.label || latestServingItem.serviceType}
                      </div>
                      {latestServingItem.note && (
                        <div className="mt-3 text-base text-amber-300 bg-amber-500/10 px-4 py-2.5 rounded-xl border border-amber-500/20 inline-flex items-start gap-2 max-w-full font-medium">
                          <span className="text-lg leading-none">📝</span>
                          <span className="break-words line-clamp-3">{latestServingItem.note}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons for Hero */}
                  <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
                    <button 
                      disabled={state.loading}
                      onClick={() => actions.markCompleted(latestServingItem.id)}
                      className="py-4 sm:py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all text-white font-bold text-lg sm:text-xl flex items-center justify-center gap-2 shadow-lg active:scale-95"
                    >
                      <Check className="w-6 h-6" strokeWidth={3} />
                      เสร็จสิ้น
                    </button>
                    <button 
                      disabled={state.loading}
                      onClick={() => actions.markCancelled(latestServingItem.id)}
                      className="py-4 sm:py-5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 transition-all text-slate-300 hover:text-white font-bold text-lg sm:text-xl flex items-center justify-center gap-2 active:scale-95"
                    >
                      <FastForward className="w-6 h-6" strokeWidth={3} />
                      ข้ามคิว
                    </button>
                  </div>
                </div>
              )}

              {/* ── Other Serving Items (Compact List) ── */}
              {/* Replaced with new conditional rendering and inline items */}
              {servingItems.length > 1 && (
                <>
                  <button
                    onClick={() => setIsOtherServingExpanded(!isOtherServingExpanded)}
                    className="w-full flex sm:hidden items-center justify-between mt-3 p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">คิวอื่นๆ ที่กำลังให้บริการ</span>
                      <span className="text-[10px] font-black bg-slate-700 px-2 py-0.5 rounded-full text-white">{servingItems.length - 1}</span>
                    </div>
                    {isOtherServingExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  
                  <div className={`space-y-3 mt-3 sm:mt-4 sm:flex flex-col ${isOtherServingExpanded ? 'flex' : 'hidden'}`}>
                    {servingItems.slice(1).map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-2xl font-black text-slate-300 min-w-[70px]">
                          {formatQueueNumber(item.queueNumber)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-200">{item.customerName || '-'}</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {new Date(item.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <button
                          onClick={() => actions.markCompleted(item.id)}
                          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-lg transition-colors border border-emerald-500/20"
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

        {/* ═══ Right Zone: Control Panel ═══ */}
        {/* Changed pt-2 sm:pt-0 px-4 sm:px-6 to pt-2 sm:pt-0 px-3 sm:px-6 pb-4 sm:pb-6 */}
        <div className="w-full lg:w-[400px] xl:w-[460px] flex flex-col bg-slate-950 pt-2 sm:pt-6 px-3 sm:px-6 pb-4 sm:pb-6 shrink-0 overflow-y-auto">
          
          {/* Next Up Card */}
          <div className="bg-slate-900 rounded-2xl p-3 sm:p-6 border border-slate-800 mb-2 sm:mb-4 flex flex-row sm:flex-col items-center sm:items-center justify-between sm:justify-start">
            
            {/* Left Side (Mobile) / Top (Desktop): Queue Info */}
            <div className="flex flex-col items-start sm:items-center">
              <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-0.5 sm:mb-2">คิวถัดไป</div>
              <div className="flex items-baseline gap-2 sm:block sm:text-center">
                <div className="text-3xl sm:text-6xl font-black text-white tracking-tighter leading-none">
                  {nextUpItem ? formatQueueNumber(nextUpItem.queueNumber) : '--'}
                </div>
                {nextUpItem?.customerName && (
                  <div className="text-xs sm:text-lg text-slate-300 font-bold sm:mt-3 relative z-10">คุณ {nextUpItem.customerName}</div>
                )}
              </div>
            </div>
            
            <div className="hidden sm:block w-full h-px bg-slate-800 my-4"></div>

            {/* Right Side (Mobile) / Bottom (Desktop): Waiting Count */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3 text-slate-300">
              <div className="hidden sm:flex w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-right sm:text-left">
                <div className="text-[9px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">คิวรอทั้งหมด</div>
                <div className="text-lg sm:text-2xl font-black text-white leading-none mt-0.5">{waitingCount} <span className="text-[10px] sm:text-sm font-medium text-slate-500">คิว</span></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 sm:gap-0 mb-3 sm:mb-4">
            {/* Call Next Button */}
            <button 
              disabled={!nextUpItem || state.loading}
              onClick={() => nextUpItem && actions.markInProgress(nextUpItem.id)}
              className="w-full py-1.5 sm:py-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all rounded-xl sm:rounded-2xl text-white font-black text-xs sm:text-3xl shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] sm:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] flex flex-col items-center justify-center gap-0 sm:gap-1 active:scale-95 sm:mb-4 px-1 text-center leading-tight min-h-[36px] sm:min-h-0"
            >
              <span className="uppercase tracking-wide">เรียกคิวถัดไป</span>
              {nextUpItem && (
                <span className="text-blue-200 text-[10px] sm:text-sm font-bold">
                  ({formatQueueNumber(nextUpItem.queueNumber)})
                </span>
              )}
            </button>

            {/* Walk-in Button */}
            <button 
              onClick={() => {
                const dummyData = {
                  customerName: 'Walk-in',
                  serviceType: ServiceType.GENERAL,
                  note: 'Walk-in จาก จอปฏิบัติการ'
                };
                actions.createQueueItem(dummyData).catch(console.error);
              }}
              className="w-full py-1.5 sm:py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-base flex items-center justify-center gap-1 sm:gap-2 border border-slate-700 active:scale-95 px-1 text-center leading-tight min-h-[36px] sm:min-h-0"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 shrink-0" />
              <span className="truncate">เพิ่มคิวหน้าร้าน</span>
            </button>
          </div>

          {/* Pending Requests — Expandable */}
          {pendingCount > 0 && (
            <div className="mt-auto">
              <button
                onClick={() => setIsPendingExpanded(!isPendingExpanded)}
                className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="font-bold text-sm">คำขอบัตรคิว</span>
                  <span className="bg-amber-500 text-black text-xs font-black px-2 py-0.5 rounded-full">{pendingCount}</span>
                </div>
                {isPendingExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {isPendingExpanded && (
                <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-white truncate">{req.customerName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <span>{SERVICE_TYPE_CONFIG[req.serviceType]?.label}</span>
                          <span className="font-mono opacity-60">{req.trackingCode}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button 
                          onClick={async () => { await actions.approveRequest(req.id); }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          อนุมัติ
                        </button>
                        <button 
                          onClick={() => actions.openRejectModal(req.id)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    </div>
                  ))}
                  <Link
                    href="/admin/pending-requests"
                    className="block text-center text-xs font-bold text-amber-400 hover:text-amber-300 py-2 transition-colors"
                  >
                    ดูทั้งหมดในหน้า Admin →
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

/* ─── Compact Serving Item Row ─── */
function ServingItemCompact({ item, state, actions, variant }: { item: QueueItem; state: AdminPresenterState; actions: AdminPresenterActions; variant: string }) {
  return (
    <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-800 rounded-xl p-3">
      <div className="text-2xl font-black text-white tracking-tighter min-w-[80px]">
        {formatQueueNumber(item.queueNumber)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-300 truncate">{item.customerName || '-'}</div>
        <div className="text-xs text-slate-500 mb-1">
          {SERVICE_TYPE_CONFIG[item.serviceType]?.label} · {new Date(item.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
        </div>
        {item.note && (
          <div className="text-xs text-amber-300 bg-amber-500/10 px-2 py-1.5 rounded-lg border border-amber-500/20 truncate max-w-full flex items-center gap-1.5">
            📝 {item.note}
          </div>
        )}
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button
          disabled={state.loading}
          onClick={() => actions.markCompleted(item.id)}
          className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors disabled:opacity-50"
          title="เสร็จสิ้น"
        >
          <Check className="w-4 h-4" strokeWidth={3} />
        </button>
        <button
          disabled={state.loading}
          onClick={() => actions.markCancelled(item.id)}
          className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
          title="ข้ามคิว"
        >
          <FastForward className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
