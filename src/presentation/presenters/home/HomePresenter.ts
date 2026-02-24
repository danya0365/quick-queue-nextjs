/**
 * HomePresenter
 * Handles business logic for the Home page
 * Receives repository via dependency injection
 */

import { IQueueItemRepository } from '@/src/application/repositories/IQueueItemRepository';
import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';
import { QueueItem, QueueStats } from '@/src/domain/types/queue';
import { Metadata } from 'next';

export interface HomeViewModel {
  items: QueueItem[];
  stats: QueueStats;
  currentQueueNumber: number;
  estimatedWaitMinutes: number;
}

export class HomePresenter {
  constructor(private readonly repository: IQueueItemRepository) {}

  /**
   * Get home page view model
   */
  async getViewModel(): Promise<HomeViewModel> {
    try {
      const [inProgressItems, waitingItems, stats, currentQueueNumber] = await Promise.all([
        this.repository.getInProgressItems(5),
        this.repository.getWaitingItems(5),
        this.repository.getStats(),
        this.repository.getCurrentServingNumber(),
      ]);

      // Combine: in_progress first (sorted by updatedAt desc), then waiting (sorted by queueNumber asc)
      const items = [...inProgressItems, ...waitingItems];

      // Estimate wait: ~10 min per waiting item
      const estimatedWaitMinutes = stats.waitingItems * 10;

      return {
        items,
        stats,
        currentQueueNumber,
        estimatedWaitMinutes,
      };
    } catch (error) {
      console.error('Error getting home view model:', error);
      throw error;
    }
  }


  /**
   * Generate metadata for the home page
   */
  generateMetadata(): Metadata {
    return {
      title: `${DEFAULT_SHOP_CONFIG.shopName} — ${DEFAULT_SHOP_CONFIG.shopDescription}`,
      description: 'ระบบจดบันทึกคิวแบบ Simple เช็คสถานะคิวได้ง่ายๆ ผ่านหน้าเว็บ',
    };
  }
}
