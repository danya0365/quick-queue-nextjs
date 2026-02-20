'use client';

import { QUEUE_STATUS_CONFIG, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { QueueSkeleton } from '@/src/presentation/components/queue/QueueSkeleton';
import { AnimatedCounter } from '@/src/presentation/components/shared/AnimatedCounter';
import { FadeInSection } from '@/src/presentation/components/shared/FadeInSection';
import { GlassCard } from '@/src/presentation/components/shared/GlassCard';
import { QueueNumberBadge, StatusBadge } from '@/src/presentation/components/shared/StatusBadge';
import { QueueViewModel } from '@/src/presentation/presenters/queue/QueuePresenter';
import { useQueuePresenter } from '@/src/presentation/presenters/queue/useQueuePresenter';
import { useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface QueueViewProps {
  initialViewModel?: QueueViewModel;
}

export function QueueView({ initialViewModel }: QueueViewProps) {
  const [state, actions] = useQueuePresenter(initialViewModel);
  const viewModel = state.viewModel;

  // Live clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Intl.DateTimeFormat('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date())
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Countdown to next refresh
  const [refreshCountdown, setRefreshCountdown] = useState(15);
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCountdown((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pulsing animation for "currently serving" badge
  const pulseSpring = useSpring({
    from: { opacity: 0.6, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 120, friction: 14 },
    loop: { reverse: true },
  });

  if (state.loading && !viewModel) {
    return <QueueSkeleton />;
  }

  if (state.error && !viewModel) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-500 font-medium mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-muted text-sm mb-4">{state.error}</p>
          <button
            onClick={actions.loadData}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  const stats = viewModel?.stats;
  const currentQ = viewModel?.currentServingNumber || 0;
  const waitTime = viewModel?.estimatedWaitMinutes || 0;
  const waitingItems = viewModel?.waitingItems || [];
  const inProgressItems = viewModel?.inProgressItems || [];
  const completedItems = viewModel?.completedItems || [];

  // Mobile tab state
  const [mobileTab, setMobileTab] = useState<'in_progress' | 'waiting' | 'completed'>('in_progress');

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 gap-3 sm:gap-4 overflow-y-auto" id="queue-view">
      {/* ─── Top Bar: Live Status ─── */}
      <FadeInSection delay={0} direction="up">
        <div className="flex items-center justify-between">
          <h1 className="text-foreground text-lg sm:text-2xl font-bold flex items-center gap-2">
            📋 สถานะคิว
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-muted text-xs hidden sm:inline">
              อัพเดทอัตโนมัติใน {refreshCountdown}s
            </span>
            <div className="text-xs text-muted bg-surface-alt px-3 py-1.5 rounded-full border border-border">
              🕐 {currentTime}
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* ─── Currently Serving Hero ─── */}
      <FadeInSection delay={100} direction="up">
        <GlassCard className="p-4 sm:p-8 text-center" glowColor="rgba(124, 58, 237, 0.25)">
          <p className="text-muted text-xs sm:text-sm mb-2 sm:mb-3 uppercase tracking-widest font-medium">
            กำลังให้บริการคิวหมายเลข
          </p>
          <animated.div style={pulseSpring} className="inline-block">
            <div className="
              w-24 h-24 sm:w-40 sm:h-40
              rounded-full mx-auto
              bg-gradient-to-br from-primary to-accent
              flex items-center justify-center
              shadow-xl
            ">
              <span className="text-white text-4xl sm:text-7xl font-black tabular-nums">
                {currentQ > 0 ? currentQ.toString().padStart(2, '0') : '—'}
              </span>
            </div>
          </animated.div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-5">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>⏳</span>
              <span>
                รอคิวอีก <strong className="text-foreground">{waitingItems.length}</strong> คิว
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>⏱</span>
              <span>
                ประมาณ <strong className="text-foreground">{waitTime}</strong> นาที
              </span>
            </div>
          </div>
        </GlassCard>
      </FadeInSection>

      {/* ─── Quick Stats ─── */}
      <FadeInSection delay={200} direction="up">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <GlassCard className="p-2 sm:p-3 text-center" glowColor="rgba(245, 158, 11, 0.15)">
            <AnimatedCounter
              value={stats?.waitingItems || 0}
              label="รอคิว"
              icon={<span>⏳</span>}
              color="text-amber-500"
            />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3 text-center" glowColor="rgba(59, 130, 246, 0.15)">
            <AnimatedCounter
              value={stats?.inProgressItems || 0}
              label="กำลังให้บริการ"
              icon={<span>🔄</span>}
              color="text-blue-500"
            />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3 text-center" glowColor="rgba(16, 185, 129, 0.15)">
            <AnimatedCounter
              value={stats?.completedItems || 0}
              label="เสร็จแล้ว"
              icon={<span>✅</span>}
              color="text-emerald-500"
            />
          </GlassCard>
        </div>
      </FadeInSection>

      {/* ─── Queue Sections ─── */}
      <FadeInSection delay={300} direction="up" className="flex-1 min-h-0">

        {/* ── Mobile: Tab Switcher ── */}
        <div className="lg:hidden flex flex-col h-full">
          {/* Tab Buttons */}
          <div className="flex gap-1 mb-3">
            {([
              { key: 'in_progress' as const, label: 'กำลังบริการ', count: inProgressItems.length, color: 'blue' },
              { key: 'waiting' as const, label: 'รอคิว', count: waitingItems.length, color: 'amber' },
              { key: 'completed' as const, label: 'เสร็จแล้ว', count: completedItems.length, color: 'emerald' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMobileTab(tab.key)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5
                  py-2 rounded-lg text-xs font-semibold
                  border transition-all duration-200
                  ${mobileTab === tab.key
                    ? tab.color === 'blue'
                      ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                      : tab.color === 'amber'
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                        : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-surface-alt border-border text-muted'
                  }
                `}
              >
                {tab.label}
                <span className={`
                  px-1.5 py-0.5 rounded-full text-[10px]
                  ${mobileTab === tab.key
                    ? tab.color === 'blue'
                      ? 'bg-blue-500/20'
                      : tab.color === 'amber'
                        ? 'bg-amber-500/20'
                        : 'bg-emerald-500/20'
                    : 'bg-surface'
                  }
                `}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <GlassCard className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {mobileTab === 'in_progress' && (
                inProgressItems.length === 0
                  ? <div className="text-center text-muted text-xs py-8">ไม่มีคิวที่กำลังให้บริการ</div>
                  : inProgressItems.map((item) => <QueueItemRow key={item.id} item={item} highlight />)
              )}
              {mobileTab === 'waiting' && (
                waitingItems.length === 0
                  ? <div className="text-center text-muted text-xs py-8">ไม่มีคิวที่รออยู่</div>
                  : waitingItems.map((item) => <QueueItemRow key={item.id} item={item} />)
              )}
              {mobileTab === 'completed' && (
                completedItems.length === 0
                  ? <div className="text-center text-muted text-xs py-8">ยังไม่มีคิวที่เสร็จ</div>
                  : completedItems.map((item) => <QueueItemRow key={item.id} item={item} />)
              )}
            </div>
          </GlassCard>
        </div>

        {/* ── Desktop: 3-Column Grid (unchanged) ── */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 h-full">

          {/* In Progress */}
          <GlassCard className="flex flex-col overflow-hidden" glowColor="rgba(59, 130, 246, 0.1)">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <h3 className="text-foreground font-semibold text-sm">กำลังให้บริการ</h3>
              <span className="ml-auto text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-medium">
                {inProgressItems.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {inProgressItems.length === 0 ? (
                <div className="text-center text-muted text-xs py-8">ไม่มีคิวที่กำลังให้บริการ</div>
              ) : (
                inProgressItems.map((item) => (
                  <QueueItemRow key={item.id} item={item} highlight />
                ))
              )}
            </div>
          </GlassCard>

          {/* Waiting */}
          <GlassCard className="flex flex-col overflow-hidden" glowColor="rgba(245, 158, 11, 0.1)">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <span>⏳</span>
              <h3 className="text-foreground font-semibold text-sm">รอคิว</h3>
              <span className="ml-auto text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-medium">
                {waitingItems.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {waitingItems.length === 0 ? (
                <div className="text-center text-muted text-xs py-8">ไม่มีคิวที่รออยู่</div>
              ) : (
                waitingItems.map((item) => (
                  <QueueItemRow key={item.id} item={item} />
                ))
              )}
            </div>
          </GlassCard>

          {/* Completed */}
          <GlassCard className="flex flex-col overflow-hidden" glowColor="rgba(16, 185, 129, 0.1)">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <span>✅</span>
              <h3 className="text-foreground font-semibold text-sm">เสร็จแล้ว</h3>
              <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-medium">
                {completedItems.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {completedItems.length === 0 ? (
                <div className="text-center text-muted text-xs py-8">ยังไม่มีคิวที่เสร็จ</div>
              ) : (
                completedItems.map((item) => (
                  <QueueItemRow key={item.id} item={item} />
                ))
              )}
            </div>
          </GlassCard>

        </div>
      </FadeInSection>
    </div>
  );
}

// ─── Internal sub-component ───

import { QueueItem } from '@/src/domain/types/queue';

function QueueItemRow({ item, highlight = false }: { item: QueueItem; highlight?: boolean }) {
  const statusConfig = QUEUE_STATUS_CONFIG[item.status];
  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];

  return (
    <div className={`
      flex items-center gap-3
      px-3 py-2.5
      rounded-lg
      ${highlight
        ? 'bg-blue-500/5 border border-blue-500/20'
        : 'bg-surface/50 hover:bg-surface-alt border border-transparent'
      }
      transition-all duration-200
    `}>
      <QueueNumberBadge
        number={item.queueNumber}
        size="sm"
        variant={
          item.status === QueueStatus.IN_PROGRESS
            ? 'active'
            : item.status === QueueStatus.COMPLETED
              ? 'completed'
              : 'default'
        }
      />
      <div className="flex-1 min-w-0">
        <span className="text-foreground text-sm font-medium truncate block">
          {item.customerName}
        </span>
        {item.note && (
          <span className="text-muted text-xs truncate block">{item.note}</span>
        )}
      </div>
      <StatusBadge
        label={serviceConfig.label}
        icon={serviceConfig.icon}
        colorClass={serviceConfig.color}
        bgClass={serviceConfig.bgColor}
      />
    </div>
  );
}
