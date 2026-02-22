/**
 * MockQueueItemRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    IQueueItemRepository,
    PaginatedResult,
} from '@/src/application/repositories/IQueueItemRepository';
import {
    CreateQueueItemData,
    PerformanceInsights,
    QueueItem,
    QueueStats,
    QueueStatus,
    ServiceType,
    UpdateQueueItemData,
} from '@/src/domain/types/queue';

// Mock data for development
const MOCK_QUEUE_ITEMS: QueueItem[] = [
  {
    id: 'q-001',
    queueNumber: 1,
    customerName: 'คุณสมชาย',
    serviceType: ServiceType.GENERAL,
    status: QueueStatus.COMPLETED,
    note: 'ซักผ้า 2 ถุง',
    createdAt: '2026-02-21T09:00:00.000Z',
    updatedAt: '2026-02-21T09:45:00.000Z',
  },
  {
    id: 'q-002',
    queueNumber: 2,
    customerName: 'คุณสมหญิง',
    serviceType: ServiceType.EXPRESS,
    status: QueueStatus.COMPLETED,
    note: 'รีดผ้า ชุดทำงาน',
    createdAt: '2026-02-21T09:15:00.000Z',
    updatedAt: '2026-02-21T10:00:00.000Z',
  },
  {
    id: 'q-003',
    queueNumber: 3,
    customerName: 'คุณวิชัย',
    serviceType: ServiceType.VIP,
    status: QueueStatus.IN_PROGRESS,
    note: 'ซักแห้ง สูท 3 ตัว',
    createdAt: '2026-02-21T09:30:00.000Z',
    updatedAt: '2026-02-21T10:15:00.000Z',
  },
  {
    id: 'q-004',
    queueNumber: 4,
    customerName: 'คุณนภา',
    serviceType: ServiceType.GENERAL,
    status: QueueStatus.WAITING,
    note: 'ผ้าห่ม + ผ้าปูที่นอน',
    createdAt: '2026-02-21T10:00:00.000Z',
    updatedAt: '2026-02-21T10:00:00.000Z',
  },
  {
    id: 'q-005',
    queueNumber: 5,
    customerName: 'คุณประเสริฐ',
    serviceType: ServiceType.EXPRESS,
    status: QueueStatus.WAITING,
    createdAt: '2026-02-21T10:20:00.000Z',
    updatedAt: '2026-02-21T10:20:00.000Z',
  },
  {
    id: 'q-006',
    queueNumber: 6,
    customerName: 'คุณมาลี',
    serviceType: ServiceType.GENERAL,
    status: QueueStatus.WAITING,
    note: 'ซักผ้า 1 ถุง',
    createdAt: '2026-02-21T10:35:00.000Z',
    updatedAt: '2026-02-21T10:35:00.000Z',
  },
  {
    id: 'q-007',
    queueNumber: 7,
    customerName: 'คุณเจษฎา',
    serviceType: ServiceType.GENERAL,
    status: QueueStatus.CANCELLED,
    note: '',
    createdAt: '2026-02-21T10:50:00.000Z',
    updatedAt: '2026-02-21T11:00:00.000Z',
  },
];

export class MockQueueItemRepository implements IQueueItemRepository {
  private items: QueueItem[] = [...MOCK_QUEUE_ITEMS];

  async getById(id: string): Promise<QueueItem | null> {
    await this.delay(100);
    return this.items.find((item) => item.id === id) || null;
  }

  async getAll(): Promise<QueueItem[]> {
    await this.delay(100);
    return [...this.items];
  }

  async getPaginated(page: number, perPage: number): Promise<PaginatedResult<QueueItem>> {
    await this.delay(100);

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedItems = this.items.slice(start, end);

    return {
      data: paginatedItems,
      total: this.items.length,
      page,
      perPage,
    };
  }

  async create(data: CreateQueueItemData): Promise<QueueItem> {
    await this.delay(200);

    const nextNumber = await this.getNextQueueNumber();
    const newItem: QueueItem = {
      id: `q-${Date.now()}`,
      queueNumber: nextNumber,
      customerName: data.customerName,
      serviceType: data.serviceType,
      status: QueueStatus.WAITING,
      note: data.note || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, data: UpdateQueueItemData): Promise<QueueItem> {
    await this.delay(200);

    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('QueueItem not found');
    }

    const updatedItem: QueueItem = {
      ...this.items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.items[index] = updatedItem;
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay(200);

    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }

  async deleteAll(): Promise<boolean> {
    await this.delay(200);
    this.items = [];
    return true;
  }

  async getStats(): Promise<QueueStats> {
    await this.delay(100);

    const totalItems = this.items.length;
    const waitingItems = this.items.filter((i) => i.status === QueueStatus.WAITING).length;
    const inProgressItems = this.items.filter((i) => i.status === QueueStatus.IN_PROGRESS).length;
    const completedItems = this.items.filter((i) => i.status === QueueStatus.COMPLETED).length;
    const cancelledItems = this.items.filter((i) => i.status === QueueStatus.CANCELLED).length;

    return {
      totalItems,
      waitingItems,
      inProgressItems,
      completedItems,
      cancelledItems,
      generalItems: this.items.filter((i) => i.serviceType === ServiceType.GENERAL).length,
      expressItems: this.items.filter((i) => i.serviceType === ServiceType.EXPRESS).length,
      vipItems: this.items.filter((i) => i.serviceType === ServiceType.VIP).length,
    };
  }

  async getRecentActivity(limit: number): Promise<QueueItem[]> {
    await this.delay(100);
    return [...this.items]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }

  async getPerformanceInsights(): Promise<PerformanceInsights> {
    await this.delay(100);
    return {
      averageWaitTimeMinutes: 12,
      averageServiceTimeMinutes: 25,
    };
  }

  async getNextQueueNumber(): Promise<number> {
    const maxNumber = Math.max(...this.items.map((i) => i.queueNumber), 0);
    return maxNumber + 1;
  }

  async getCurrentServingNumber(): Promise<number> {
    const inProgressItems = this.items.filter((i) => i.status === QueueStatus.IN_PROGRESS);
    if (inProgressItems.length === 0) return 0;
    return Math.min(...inProgressItems.map((i) => i.queueNumber));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockQueueItemRepository = new MockQueueItemRepository();
