'use client';

import { QUEUE_STATUS_CONFIG, QueueStatus, SERVICE_TYPE_CONFIG } from '@/src/domain/types/queue';
import { AnimatedButton } from '@/src/presentation/components/shared/AnimatedButton';
import { AnimatedCounter } from '@/src/presentation/components/shared/AnimatedCounter';
import { FadeInSection } from '@/src/presentation/components/shared/FadeInSection';
import { GlassCard } from '@/src/presentation/components/shared/GlassCard';
import { QueueNumberBadge, StatusBadge } from '@/src/presentation/components/shared/StatusBadge';
import { HomeViewModel } from '@/src/presentation/presenters/home/HomePresenter';
import { useHomePresenter } from '@/src/presentation/presenters/home/useHomePresenter';
import { useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface HomeViewProps {
  initialViewModel?: HomeViewModel;
}

export function HomeView({ initialViewModel }: HomeViewProps) {
  const [state] = useHomePresenter(initialViewModel);
  const viewModel = state.viewModel;

  // Animated gradient rotation
  const [gradientAngle, setGradientAngle] = useState(135);
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientAngle((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Current time display
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

  // Big queue number spring
  const bigNumberSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.5)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 100, friction: 12 },
    delay: 200,
  });

  if (state.loading && !viewModel) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted text-sm">กำลังโหลดข้อมูลคิว...</p>
        </div>
      </div>
    );
  }

  if (state.error && !viewModel) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-500 font-medium mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-muted text-sm">{state.error}</p>
        </div>
      </div>
    );
  }

  const stats = viewModel?.stats;
  const currentQ = viewModel?.currentQueueNumber || 0;
  const waitTime = viewModel?.estimatedWaitMinutes || 0;
  const recentItems = viewModel?.items
    .filter((i) => i.status !== QueueStatus.CANCELLED) || [];

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 gap-3 sm:gap-5 overflow-y-auto" id="home-view">
      {/* ─── Hero Section ─── */}
      <FadeInSection delay={0} direction="up">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-8"
          style={{
            background: `linear-gradient(${gradientAngle}deg, var(--color-primary), var(--color-accent), var(--color-gradient-end))`,
          }}
        >
          {/* Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.3'%3E%3Cpath d='M0 0h1v40H0zM39 0h1v40h-1z'/%3E%3Cpath d='M0 0h40v1H0zM0 39h40v1H0z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            {/* Current Queue Number */}
            <animated.div
              style={bigNumberSpring}
              className="flex flex-col items-center"
            >
              <span className="text-white/70 text-[10px] sm:text-xs font-medium uppercase tracking-widest mb-1 sm:mb-2">
                กำลังให้บริการ
              </span>
              <div className="
                w-20 h-20 sm:w-32 sm:h-32
                rounded-full
                bg-white/20 backdrop-blur-sm
                border-2 border-white/40
                flex items-center justify-center
                shadow-xl
              ">
                <span className="text-white text-3xl sm:text-6xl font-black tabular-nums">
                  {currentQ > 0 ? currentQ.toString().padStart(2, '0') : '—'}
                </span>
              </div>
            </animated.div>

            {/* Hero Text */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-white text-lg sm:text-3xl font-bold mb-1 sm:mb-2 tracking-tight">
                Quick Queue
              </h1>
              <p className="text-white/80 text-xs sm:text-base mb-2 sm:mb-4">
                ระบบจัดการคิวอัจฉริยะ — เช็คสถานะคิวแบบเรียลไทม์
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                <div className="bg-white/15 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-white text-xs sm:text-sm border border-white/20">
                  <span className="mr-1.5">⏱</span>
                  รอประมาณ <strong>{waitTime}</strong> นาที
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-white text-xs sm:text-sm border border-white/20">
                  <span className="mr-1.5">🕐</span>
                  {currentTime}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* ─── Stats Grid ─── */}
      <FadeInSection delay={150} direction="up">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <GlassCard className="p-2.5 sm:p-4" glowColor="rgba(124, 58, 237, 0.15)">
            <AnimatedCounter
              value={stats?.totalItems || 0}
              label="คิวทั้งหมด"
              icon={<span>📊</span>}
              color="text-primary"
              id="stat-total"
            />
          </GlassCard>

          <GlassCard className="p-2.5 sm:p-4" glowColor="rgba(245, 158, 11, 0.15)">
            <AnimatedCounter
              value={stats?.waitingItems || 0}
              label="รอคิว"
              icon={<span>⏳</span>}
              color="text-amber-500"
              id="stat-waiting"
            />
          </GlassCard>

          <GlassCard className="p-2.5 sm:p-4" glowColor="rgba(59, 130, 246, 0.15)">
            <AnimatedCounter
              value={stats?.inProgressItems || 0}
              label="กำลังให้บริการ"
              icon={<span>🔄</span>}
              color="text-blue-500"
              id="stat-in-progress"
            />
          </GlassCard>

          <GlassCard className="p-2.5 sm:p-4" glowColor="rgba(16, 185, 129, 0.15)">
            <AnimatedCounter
              value={stats?.completedItems || 0}
              label="เสร็จแล้ว"
              icon={<span>✅</span>}
              color="text-emerald-500"
              id="stat-completed"
            />
          </GlassCard>
        </div>
      </FadeInSection>

      {/* ─── Queue List ─── */}
      <FadeInSection delay={300} direction="up" className="flex-1 min-h-0">
        <GlassCard className="h-full flex flex-col overflow-hidden">
          {/* List Header */}
          <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 border-b border-border">
            <h2 className="text-foreground font-semibold text-sm">
              📋 รายการคิวล่าสุด
            </h2>
            <AnimatedButton variant="ghost" size="sm">
              ดูทั้งหมด
            </AnimatedButton>
          </div>

          {/* Queue Items */}
          <div className="flex-1 overflow-y-auto p-2">
            {recentItems.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted text-sm">
                ยังไม่มีรายการคิว
              </div>
            ) : (
              <div className="space-y-2">
                {recentItems.map((item, index) => {
                  const statusConfig = QUEUE_STATUS_CONFIG[item.status];
                  const serviceConfig = SERVICE_TYPE_CONFIG[item.serviceType];

                  return (
                    <FadeInSection
                      key={item.id}
                      delay={400 + index * 80}
                      direction="left"
                    >
                      <div className="
                        flex items-center gap-2 sm:gap-4
                        px-2.5 sm:px-4 py-2 sm:py-3
                        rounded-xl
                        bg-surface/50 hover:bg-surface-alt
                        border border-transparent hover:border-border
                        transition-all duration-200
                        group
                      ">
                        {/* Queue Number */}
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

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-medium text-sm truncate">
                              {item.customerName}
                            </span>
                            <StatusBadge
                              label={serviceConfig.label}
                              icon={serviceConfig.icon}
                              colorClass={serviceConfig.color}
                              bgClass={serviceConfig.bgColor}
                            />
                          </div>
                          {item.note && (
                            <p className="text-muted text-xs mt-0.5 truncate">
                              {item.note}
                            </p>
                          )}
                        </div>

                        {/* Status */}
                        <StatusBadge
                          label={statusConfig.label}
                          icon={statusConfig.icon}
                          colorClass={statusConfig.color}
                          bgClass={statusConfig.bgColor}
                          pulsing={item.status === QueueStatus.IN_PROGRESS}
                        />
                      </div>
                    </FadeInSection>
                  );
                })}
              </div>
            )}
          </div>
        </GlassCard>
      </FadeInSection>
    </div>
  );
}
