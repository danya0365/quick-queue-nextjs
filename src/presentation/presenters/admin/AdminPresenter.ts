/**
 * AdminPresenter
 * Handles business logic for the Admin page (CRUD + Auth gate + Queue Requests)
 * Receives repository via dependency injection
 */

import { IQueueItemRepository } from '@/src/application/repositories/IQueueItemRepository';
import { IQueueRequestRepository } from '@/src/application/repositories/IQueueRequestRepository';
import { ShopConfig } from '@/src/config/shop.config';
import {
  CreateQueueItemData,
  PerformanceInsights,
  QueueItem,
  QueueRequest,
  QueueStats,
  QueueStatus,
  UpdateQueueItemData,
} from '@/src/domain/types/queue';
import { Metadata } from 'next';

export interface AdminViewModel {
  items: QueueItem[];
  /** Waiting items sorted by queueNumber ASC (for kiosk/focus views) */
  waitingItems: QueueItem[];
  /** In-progress items sorted by updatedAt DESC (for kiosk/focus views) */
  inProgressItems: QueueItem[];
  /** Completed items sorted by updatedAt DESC */
  completedItems: QueueItem[];
  stats: QueueStats;
  nextQueueNumber: number;
  totalItems: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  shopConfig: ShopConfig;
  isLoading: boolean;
  error: string | null;
  pendingRequests: QueueRequest[];
  pendingCount: number;
  recentActivity?: QueueItem[];
  performance?: PerformanceInsights;
  currentQueueNumber?: number;
}

export class AdminPresenter {
  constructor(
    private readonly repository: IQueueItemRepository,
    private readonly requestRepository?: IQueueRequestRepository,
  ) {}

  /**
   * Get dashboard overview data (Stats + Pending Requests only)
   */
  async loadDashboardData(): Promise<Omit<AdminViewModel, 'items' | 'totalItems' | 'currentPage' | 'perPage' | 'totalPages'>> {
    try {
      const [stats, pendingRequests, pendingCount, recentActivity, performance, currentQueueNumber] = await Promise.all([
        this.repository.getStats(),
        this.requestRepository ? this.requestRepository.getPending(5) : Promise.resolve([]),
        this.requestRepository ? this.requestRepository.getPendingCount() : Promise.resolve(0),
        this.repository.getRecentActivity(5),
        this.repository.getPerformanceInsights(),
        this.repository.getCurrentServingNumber(),
      ]);

      return {
        stats,
        // Empty defaults for pagination since it's not used in dashboard
        nextQueueNumber: stats.totalItems + 1, // Approximation, not critical for dashboard
        shopConfig: this.getDefaultShopConfig(),
        isLoading: false,
        error: null,
        pendingRequests,
        pendingCount,
        recentActivity,
        performance,
        currentQueueNumber,
        waitingItems: [],
        inProgressItems: [],
        completedItems: [],
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  /**
   * Get dedicated queues page data (Paginated table + Stats)
   */
  async loadQueuesData(
    page: number = 1,
    perPage: number = 20,
    status?: string
  ): Promise<AdminViewModel> {
    try {
      const SORTED_LIMIT = 20;
      const [paginated, waitingItems, inProgressItems, completedItems, stats, nextQueueNumber, currentQueueNumber] = await Promise.all([
        this.repository.getPaginated(page, perPage, status),
        this.repository.getWaitingItems(SORTED_LIMIT),
        this.repository.getInProgressItems(SORTED_LIMIT),
        this.repository.getCompletedItems(SORTED_LIMIT),
        this.repository.getStats(),
        this.repository.getNextQueueNumber(),
        this.repository.getCurrentServingNumber(),
      ]);

      return {
        items: paginated.data,
        waitingItems,
        inProgressItems,
        completedItems,
        stats,
        nextQueueNumber,
        totalItems: paginated.total,
        currentPage: paginated.page,
        perPage: paginated.perPage,
        totalPages: Math.ceil(paginated.total / paginated.perPage),
        shopConfig: this.getDefaultShopConfig(),
        isLoading: false,
        error: null,
        pendingRequests: [], // Not needed on queues list page
        pendingCount: 0,
        currentQueueNumber,
      };
    } catch (error) {
      console.error('Error getting queues listing data:', error);
      throw error;
    }
  }

  private getDefaultShopConfig(): ShopConfig {
    return {
      shopName: 'Quick Queue',
      shopDescription: 'ระบบจัดการคิวอัจฉริยะ',
      maxQueuePerDay: 100,
      operatingHours: {
        open: '09:00',
        close: '18:00',
      }
    };
  }

  /**
   * Generate metadata
   */
  generateMetadata(): Metadata {
    return {
      title: 'จัดการคิว | Quick Queue',
      description: 'หน้าจัดการคิวสำหรับเจ้าของร้าน',
    };
  }

  /**
   * Create a new queue item
   */
  async createQueueItem(data: CreateQueueItemData): Promise<QueueItem> {
    return await this.repository.create(data);
  }

  /**
   * Update status of a queue item
   */
  async updateQueueItem(id: string, data: UpdateQueueItemData): Promise<QueueItem> {
    return await this.repository.update(id, data);
  }

  /**
   * Delete a queue item
   */
  async deleteQueueItem(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }

  /**
   * Delete all queue items (Clear all queues)
   */
  async clearAllQueues(): Promise<boolean> {
    return await this.repository.deleteAll();
  }

  /**
   * Mark queue item as in-progress
   */
  async markInProgress(id: string): Promise<QueueItem> {
    return await this.repository.update(id, { status: QueueStatus.IN_PROGRESS });
  }

  /**
   * Mark queue item as completed
   */
  async markCompleted(id: string): Promise<QueueItem> {
    return await this.repository.update(id, { status: QueueStatus.COMPLETED });
  }

  /**
   * Mark queue item as cancelled
   */
  async markCancelled(id: string): Promise<QueueItem> {
    return await this.repository.update(id, { status: QueueStatus.CANCELLED });
  }

  /**
   * Approve a queue request
   */
  async approveRequest(id: string): Promise<QueueRequest> {
    if (!this.requestRepository) throw new Error('Request repository not configured');
    return await this.requestRepository.approve(id);
  }

  /**
   * Reject a queue request
   */
  async rejectRequest(id: string, reason: string): Promise<QueueRequest> {
    if (!this.requestRepository) throw new Error('Request repository not configured');
    return await this.requestRepository.reject(id, reason);
  }
}
