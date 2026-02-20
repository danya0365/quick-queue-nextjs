/**
 * QueuePresenter
 * Handles business logic for the public Queue status page (read-only)
 * Receives repository via dependency injection
 */

import { IQueueItemRepository } from '@/src/application/repositories/IQueueItemRepository';
import { QueueItem, QueueStats, QueueStatus } from '@/src/domain/types/queue';
import { Metadata } from 'next';

export interface QueueViewModel {
  allItems: QueueItem[];
  waitingItems: QueueItem[];
  inProgressItems: QueueItem[];
  completedItems: QueueItem[];
  stats: QueueStats;
  currentServingNumber: number;
  estimatedWaitMinutes: number;
}

export class QueuePresenter {
  constructor(private readonly repository: IQueueItemRepository) {}

  /**
   * Get queue status view model (read-only for customers)
   */
  async getViewModel(): Promise<QueueViewModel> {
    try {
      const [allItems, stats] = await Promise.all([
        this.repository.getAll(),
        this.repository.getStats(),
      ]);

      const waitingItems = allItems.filter((i) => i.status === QueueStatus.WAITING);
      const inProgressItems = allItems.filter((i) => i.status === QueueStatus.IN_PROGRESS);
      const completedItems = allItems.filter((i) => i.status === QueueStatus.COMPLETED);

      // Current serving = minimum queue number among in-progress items
      const currentServingNumber = inProgressItems.length > 0
        ? Math.min(...inProgressItems.map((i) => i.queueNumber))
        : 0;

      // Estimate: ~10 min per waiting item
      const estimatedWaitMinutes = waitingItems.length * 10;

      return {
        allItems,
        waitingItems,
        inProgressItems,
        completedItems,
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
      title: 'เช็คสถานะคิว | Quick Queue',
      description: 'ตรวจสอบสถานะคิวของคุณแบบเรียลไทม์',
    };
  }
}
