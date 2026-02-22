/**
 * Queue Domain Types
 * Master Data & Static Data definitions for Quick Queue
 */
import { CheckCircle2, ClipboardList, Crown, Home, Hourglass, ListTodo, RefreshCw, Search, Settings, XCircle, Zap } from 'lucide-react';
import * as React from 'react';


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
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  [QueueStatus.WAITING]: {
    label: 'รอคิว',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    icon: React.createElement(Hourglass, { className: 'w-full h-full' }),
  },
  [QueueStatus.IN_PROGRESS]: {
    label: 'กำลังให้บริการ',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: React.createElement(RefreshCw, { className: 'w-full h-full animate-spin-slow' }),
  },
  [QueueStatus.COMPLETED]: {
    label: 'เสร็จแล้ว',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon: React.createElement(CheckCircle2, { className: 'w-full h-full' }),
  },
  [QueueStatus.CANCELLED]: {
    label: 'ยกเลิก',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: React.createElement(XCircle, { className: 'w-full h-full' }),
  },
};

export const SERVICE_TYPE_CONFIG: Record<
  ServiceType,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  [ServiceType.GENERAL]: {
    label: 'ทั่วไป',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
    icon: React.createElement(ClipboardList, { className: 'w-full h-full' }),
  },
  [ServiceType.EXPRESS]: {
    label: 'ด่วน',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    icon: React.createElement(Zap, { className: 'w-full h-full' }),
  },
  [ServiceType.VIP]: {
    label: 'VIP',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    icon: React.createElement(Crown, { className: 'w-full h-full' }),
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
  generalItems: number;
  expressItems: number;
  vipItems: number;
}

export interface PerformanceInsights {
  averageWaitTimeMinutes: number;
  averageServiceTimeMinutes: number;
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

// ─── Status Enums: Queue Requests ───
export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const REQUEST_STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  [RequestStatus.PENDING]: {
    label: 'รอการอนุมัติ',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    icon: React.createElement(Hourglass, { className: 'w-full h-full' }),
  },
  [RequestStatus.APPROVED]: {
    label: 'อนุมัติแล้ว',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon: React.createElement(CheckCircle2, { className: 'w-full h-full' }),
  },
  [RequestStatus.REJECTED]: {
    label: 'ถูกปฏิเสธ',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: React.createElement(XCircle, { className: 'w-full h-full' }),
  },
};

// ─── Master Data: Queue Request Entity ───
export interface QueueRequest {
  id: string;
  trackingCode: string;
  customerName: string;
  serviceType: ServiceType;
  note?: string;
  status: RequestStatus;
  rejectReason?: string;
  queueItemId?: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── DTOs: Queue Request ───
export interface CreateQueueRequestData {
  customerName: string;
  serviceType: ServiceType;
  note?: string;
}

// ─── Static Data: Navigation Items ───
export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'หน้าแรก',
    href: '/',
    icon: React.createElement(Home, { className: 'w-full h-full' }),
    requiresAuth: false,
  },
  {
    label: 'เช็คคิว',
    href: '/queue',
    icon: React.createElement(ListTodo, { className: 'w-full h-full' }),
    requiresAuth: false,
  },
  {
    label: 'ขอบัตรคิว',
    href: '/track',
    icon: React.createElement(Search, { className: 'w-full h-full' }),
    requiresAuth: false,
  },
  {
    label: 'จัดการคิว',
    href: '/admin',
    icon: React.createElement(Settings, { className: 'w-full h-full' }),
    requiresAuth: true,
  },
];
