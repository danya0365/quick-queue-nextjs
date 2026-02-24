import { formatQueueNumber } from '@/src/config/queue-display.config';
import { QUEUE_STATUS_CONFIG, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { AnimatedCounter } from '@/src/presentation/components/shared/AnimatedCounter';
import { FadeInSection } from '@/src/presentation/components/shared/FadeInSection';
import { GlassCard } from '@/src/presentation/components/shared/GlassCard';
import { QueueNumberBadge, StatusBadge } from '@/src/presentation/components/shared/StatusBadge';
import { QueueViewModel } from '@/src/presentation/presenters/queue/QueuePresenter';
import { CheckCircle2, ClipboardList, Clock, Hourglass, RefreshCw, Timer, Volume2, VolumeX } from 'lucide-react';
import { animated, SpringValue } from 'react-spring';

export interface QueueClassicTemplateProps {
  viewModel: QueueViewModel;
  currentTime: string;
  refreshCountdown: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  showQR: boolean;
  setShowQR: (show: boolean) => void;
  onItemClick: (item: QueueItem) => void;
  pulseSpring: { opacity: SpringValue<number>; transform: SpringValue<string> };
  mobileTab: 'in_progress' | 'waiting' | 'completed';
  setMobileTab: (tab: 'in_progress' | 'waiting' | 'completed') => void;
}

export function QueueClassicTemplate({
  viewModel,
  currentTime,
  refreshCountdown,
  soundEnabled,
  setSoundEnabled,
  pulseSpring,
  mobileTab,
  setMobileTab,
  showQR,
  setShowQR,
  onItemClick,
}: QueueClassicTemplateProps) {
  const stats = viewModel.stats;
  const currentQ = viewModel.currentServingNumber || 0;
  const waitTime = viewModel.estimatedWaitMinutes || 0;
  const waitingItems = viewModel.waitingItems || [];
  const inProgressItems = viewModel.inProgressItems || [];
  const completedItems = viewModel.completedItems || [];

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 gap-3 sm:gap-4 overflow-y-auto" id="queue-classic-layout">
      {/* ─── Top Bar: Live Status ─── */}
      <FadeInSection delay={0} direction="up">
        <div className="flex items-center justify-between">
          <h1 className="text-foreground text-lg sm:text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" /> สถานะคิว
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`border border-border/40 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center ${
                soundEnabled
                  ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border-blue-500/30'
                  : 'bg-surface-alt hover:bg-surface text-muted hover:text-foreground'
              }`}
              title={soundEnabled ? 'ปิดเสียงประกาศ' : 'เปิดเสียงประกาศ'}
            >
              <span className="mr-1">{soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}</span>
              <span className="hidden sm:inline">{soundEnabled ? 'เสียงเปิด' : 'เสียงปิด'}</span>
            </button>
            <span className="text-muted text-xs hidden sm:inline">
              อัพเดทอัตโนมัติใน {refreshCountdown}s
            </span>
            <div className="text-xs text-muted bg-surface-alt px-3 py-1.5 rounded-full border border-border flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {currentTime}
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
                {currentQ > 0 ? formatQueueNumber(currentQ) : '—'}
              </span>
            </div>
          </animated.div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-5">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span><Hourglass className="w-4 h-4" /></span>
              <span>
                รอคิวอีก <strong className="text-foreground">{waitingItems.length}</strong> คิว
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <span><Timer className="w-4 h-4" /></span>
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
              icon={<Hourglass className="w-5 h-5 sm:w-6 sm:h-6" />}
              color="text-amber-500"
            />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3 text-center" glowColor="rgba(59, 130, 246, 0.15)">
            <AnimatedCounter
              value={stats?.inProgressItems || 0}
              label="กำลังให้บริการ"
              icon={<RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />}
              color="text-blue-500"
            />
          </GlassCard>
          <GlassCard className="p-2 sm:p-3 text-center" glowColor="rgba(16, 185, 129, 0.15)">
            <AnimatedCounter
              value={stats?.completedItems || 0}
              label="เสร็จแล้ว"
              icon={<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />}
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
                  : inProgressItems.map((item) => <QueueItemRow key={item.id} item={item} highlight onClick={() => onItemClick(item)} />)
              )}
              {mobileTab === 'waiting' && (
                waitingItems.length === 0
                  ? <div className="text-center text-muted text-xs py-8">ไม่มีคิวที่รออยู่</div>
                  : waitingItems.map((item) => <QueueItemRow key={item.id} item={item} onClick={() => onItemClick(item)} />)
              )}
              {mobileTab === 'completed' && (
                completedItems.length === 0
                  ? <div className="text-center text-muted text-xs py-8">ยังไม่มีคิวที่เสร็จ</div>
                  : completedItems.map((item) => <QueueItemRow key={item.id} item={item} onClick={() => onItemClick(item)} />)
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
                  <QueueItemRow key={item.id} item={item} highlight onClick={() => onItemClick(item)} />
                ))
              )}
            </div>
          </GlassCard>

          {/* Waiting */}
          <GlassCard className="flex flex-col overflow-hidden" glowColor="rgba(245, 158, 11, 0.1)">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Hourglass className="w-4 h-4" />
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
                  <QueueItemRow key={item.id} item={item} onClick={() => onItemClick(item)} />
                ))
              )}
            </div>
          </GlassCard>

          {/* Completed */}
          <GlassCard className="flex flex-col overflow-hidden" glowColor="rgba(16, 185, 129, 0.1)">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
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
                  <QueueItemRow key={item.id} item={item} onClick={() => onItemClick(item)} />
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

function QueueItemRow({ item, highlight = false, onClick }: { item: QueueItem; highlight?: boolean; onClick?: () => void }) {
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
      transition-all duration-200 cursor-pointer
    `} onClick={onClick}>
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
