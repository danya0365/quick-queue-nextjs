/**
 * HomePresenter
 * Handles business logic for the Home page
 * Receives repository via dependency injection
 */

import { IQueueItemRepository } from '@/src/application/repositories/IQueueItemRepository';
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
      const [paginated, stats, currentQueueNumber] = await Promise.all([
        this.repository.getPaginated(1, 10),
        this.repository.getStats(),
        this.repository.getCurrentServingNumber(),
      ]);

      const items = paginated.data;

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
      title: 'Quick Queue — ระบบจัดการคิวอัจฉริยะ',
      description: 'ระบบจดบันทึกคิวแบบ Simple เช็คสถานะคิวได้ง่ายๆ ผ่านหน้าเว็บ',
    };
  }
}
