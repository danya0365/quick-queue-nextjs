/**
 * IQueueItemRepository
 * Repository interface for QueueItem data access
 * Following Clean Architecture - this is in the Application layer
 */

import {
    CreateQueueItemData,
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
   * Get the next queue number
   */
  getNextQueueNumber(): Promise<number>;

  /**
   * Get the current serving queue number (minimum queue_number with status = 'in_progress')
   */
  getCurrentServingNumber(): Promise<number>;
}
