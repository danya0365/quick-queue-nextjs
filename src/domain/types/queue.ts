/**
 * Queue Domain Types
 * Master Data & Static Data definitions for Quick Queue
 */

// ─── Status Enums (Static Data) ───
export enum QueueStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ServiceType {
  GENERAL = 'general',
  EXPRESS = 'express',
  VIP = 'vip',
}

// ─── Static Data: Status Labels & Colors ───
export const QUEUE_STATUS_CONFIG: Record<
  QueueStatus,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  [QueueStatus.WAITING]: {
    label: 'รอคิว',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    icon: '⏳',
  },
  [QueueStatus.IN_PROGRESS]: {
    label: 'กำลังให้บริการ',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: '🔄',
  },
  [QueueStatus.COMPLETED]: {
    label: 'เสร็จแล้ว',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon: '✅',
  },
  [QueueStatus.CANCELLED]: {
    label: 'ยกเลิก',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: '❌',
  },
};

export const SERVICE_TYPE_CONFIG: Record<
  ServiceType,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  [ServiceType.GENERAL]: {
    label: 'ทั่วไป',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
    icon: '📋',
  },
  [ServiceType.EXPRESS]: {
    label: 'ด่วน',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    icon: '⚡',
  },
  [ServiceType.VIP]: {
    label: 'VIP',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    icon: '👑',
  },
};

// ─── Master Data: Queue Item Entity ───
export interface QueueItem {
  id: string;
  queueNumber: number;
  customerName: string;
  serviceType: ServiceType;
  status: QueueStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Master Data: Queue Stats ───
export interface QueueStats {
  totalItems: number;
  waitingItems: number;
  inProgressItems: number;
  completedItems: number;
  cancelledItems: number;
}

// ─── DTOs ───
export interface CreateQueueItemData {
  id?: string;
  customerName: string;
  serviceType: ServiceType;
  note?: string;
}

export interface UpdateQueueItemData {
  customerName?: string;
  serviceType?: ServiceType;
  status?: QueueStatus;
  note?: string;
}

// ─── Master Data: Shop Configuration ───
export interface ShopConfig {
  shopName: string;
  shopDescription: string;
  maxQueuePerDay: number;
  operatingHours: {
    open: string;
    close: string;
  };
}

// ─── Static Data: Default Shop Config ───
export const DEFAULT_SHOP_CONFIG: ShopConfig = {
  shopName: 'Quick Queue',
  shopDescription: 'ระบบจัดการคิวอัจฉริยะ',
  maxQueuePerDay: 100,
  operatingHours: {
    open: '09:00',
    close: '18:00',
  },
};

// ─── Static Data: Navigation Items ───
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  requiresAuth: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'หน้าแรก',
    href: '/',
    icon: '🏠',
    requiresAuth: false,
  },
  {
    label: 'เช็คคิว',
    href: '/queue',
    icon: '📋',
    requiresAuth: false,
  },
  {
    label: 'จัดการคิว',
    href: '/admin',
    icon: '⚙️',
    requiresAuth: true,
  },
];
