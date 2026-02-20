/**
 * AdminPresenter
 * Handles business logic for the Admin page (CRUD + Auth gate)
 * Receives repository via dependency injection
 */

import { IQueueItemRepository } from '@/src/application/repositories/IQueueItemRepository';
import {
  CreateQueueItemData,
  QueueItem,
  QueueStats,
  QueueStatus,
  UpdateQueueItemData,
} from '@/src/domain/types/queue';
import { Metadata } from 'next';

export interface AdminViewModel {
  items: QueueItem[];
  stats: QueueStats;
  nextQueueNumber: number;
  // Pagination info
  totalItems: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}

export class AdminPresenter {
  constructor(private readonly repository: IQueueItemRepository) {}

  /**
   * Get admin view model (paginated)
   */
  async getViewModel(
    page: number = 1,
    perPage: number = 20,
    status?: string
  ): Promise<AdminViewModel> {
    try {
      const [paginated, stats, nextQueueNumber] = await Promise.all([
        this.repository.getPaginated(page, perPage, status),
        this.repository.getStats(),
        this.repository.getNextQueueNumber(),
      ]);

      return {
        items: paginated.data,
        stats,
        nextQueueNumber,
        totalItems: paginated.total,
        currentPage: paginated.page,
        perPage: paginated.perPage,
        totalPages: Math.ceil(paginated.total / paginated.perPage),
      };
    } catch (error) {
      console.error('Error getting admin view model:', error);
      throw error;
    }
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
}
