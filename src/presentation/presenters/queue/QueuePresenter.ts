/**
 * QueuePresenter
 * Handles business logic for the public Queue status page (read-only)
 * Receives repository via dependency injection
 */

import { IQueueItemRepository } from '@/src/application/repositories/IQueueItemRepository';
import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';
import { QueueItem, QueueStats } from '@/src/domain/types/queue';
import { Metadata } from 'next';

export interface QueueViewModel {
  allItems: QueueItem[];
  waitingItems: QueueItem[];
  inProgressItems: QueueItem[];
  completedItems: QueueItem[];
  /** The current serving item (first inProgressItem, most recently updated) */
  currentServingItem: QueueItem | null;
  stats: QueueStats;
  currentServingNumber: number;
  estimatedWaitMinutes: number;
}

export class QueuePresenter {
  constructor(private readonly repository: IQueueItemRepository) {}

  /**
   * Get queue status view model (read-only for customers)
   * All items are pre-sorted by the repository:
   *  - waiting: queue_number ASC
   *  - in_progress: updated_at DESC
   *  - completed: updated_at DESC
   */
  async getViewModel(): Promise<QueueViewModel> {
    try {
      const LIMIT = 20;
      const [waitingItems, inProgressItems, completedItems, stats, currentServingNumber] = await Promise.all([
        this.repository.getWaitingItems(LIMIT),
        this.repository.getInProgressItems(LIMIT),
        this.repository.getCompletedItems(LIMIT),
        this.repository.getStats(),
        this.repository.getCurrentServingNumber(),
      ]);

      const allItems = [...inProgressItems, ...waitingItems, ...completedItems];

      // Estimate: ~10 min per waiting item
      const estimatedWaitMinutes = stats.waitingItems * 10;

      return {
        allItems,
        waitingItems,
        inProgressItems,
        completedItems,
        currentServingItem: inProgressItems.length > 0 ? inProgressItems[0] : null,
        stats,
        currentServingNumber,
        estimatedWaitMinutes,
      };
    } catch (error) {
      console.error('Error getting queue view model:', error);
      throw error;
    }
  }


  /**
   * Generate metadata for the queue page
   */
  generateMetadata(): Metadata {
    return {
      title: `เช็คสถานะคิว | ${DEFAULT_SHOP_CONFIG.shopName}`,
      description: 'ตรวจสอบสถานะคิวของคุณแบบเรียลไทม์',
    };
  }
}
