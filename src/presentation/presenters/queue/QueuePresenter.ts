/**
 * QueuePresenter
 * Handles business logic for the public Queue status page (read-only)
 * Receives repository via dependency injection
 */

import { IQueueItemRepository } from '@/src/application/repositories/IQueueItemRepository';
import { QueueItem, QueueStats } from '@/src/domain/types/queue';
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
      const LIMIT = 20;
      const [waitingResult, inProgressResult, completedResult, stats, currentServingNumber] = await Promise.all([
        this.repository.getPaginated(1, LIMIT, 'waiting'),
        this.repository.getPaginated(1, LIMIT, 'in_progress'),
        this.repository.getPaginated(1, LIMIT, 'completed'),
        this.repository.getStats(),
        this.repository.getCurrentServingNumber(),
      ]);

      const waitingItems = waitingResult.data;
      const inProgressItems = inProgressResult.data;
      const completedItems = completedResult.data;
      const allItems = [...inProgressItems, ...waitingItems, ...completedItems];

      // Estimate: ~10 min per waiting item
      const estimatedWaitMinutes = stats.waitingItems * 10;

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
