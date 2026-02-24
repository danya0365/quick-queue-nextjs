/**
 * IQueueItemRepository
 * Repository interface for QueueItem data access
 * Following Clean Architecture - this is in the Application layer
 */

import {
    CreateQueueItemData,
    PerformanceInsights,
    QueueItem,
    QueueStats,
    UpdateQueueItemData,
} from '@/src/domain/types/queue';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface IQueueItemRepository {
  /**
   * Get queue item by ID
   */
  getById(id: string): Promise<QueueItem | null>;

  /**
   * Get all queue items
   */
  getAll(): Promise<QueueItem[]>;

  /**
   * Get paginated queue items
   */
  getPaginated(page: number, perPage: number, status?: string): Promise<PaginatedResult<QueueItem>>;

  /**
   * Create a new queue item
   */
  create(data: CreateQueueItemData): Promise<QueueItem>;

  /**
   * Update an existing queue item
   */
  update(id: string, data: UpdateQueueItemData): Promise<QueueItem>;

  /**
   * Delete a queue item
   */
  delete(id: string): Promise<boolean>;

  /**
   * Get queue statistics
   */
  getStats(): Promise<QueueStats>;

  /**
   * Get recent activity
   */
  getRecentActivity(limit: number): Promise<QueueItem[]>;

  /**
   * Get performance insights
   */
  getPerformanceInsights(): Promise<PerformanceInsights>;

  /**
   * Get the next queue number
   */
  getNextQueueNumber(): Promise<number>;

  /**
   * Get the current serving queue number (minimum queue_number with status = 'in_progress')
   */
  getCurrentServingNumber(): Promise<number>;

  /**
   * Get waiting items sorted by queue_number ASC (first in line at top)
   */
  getWaitingItems(limit: number): Promise<QueueItem[]>;

  /**
   * Get in-progress items sorted by updated_at DESC (most recently called at top)
   */
  getInProgressItems(limit: number): Promise<QueueItem[]>;

  /**
   * Get completed items sorted by updated_at DESC (most recently completed at top)
   */
  getCompletedItems(limit: number): Promise<QueueItem[]>;

  /**
   * Delete all queue items (Clear all queues)
   */
  deleteAll(): Promise<boolean>;
}
