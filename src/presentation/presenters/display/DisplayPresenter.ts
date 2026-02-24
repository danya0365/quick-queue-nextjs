import { IQueueItemRepository } from '@/src/application/repositories/IQueueItemRepository';
import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';
import { QueueItem } from '@/src/domain/types/queue';
import { Metadata } from 'next';

export interface DisplayViewModel {
  /** Current serving item (latest by updatedAt) */
  currentServingItem: QueueItem | null;
  /** All in_progress items sorted by updatedAt desc */
  servingItems: QueueItem[];
  /** Next waiting item */
  nextUpItem: QueueItem | null;
  /** All waiting items sorted by queueNumber asc */
  waitingItems: QueueItem[];
  /** Recently completed items (latest 5) */
  recentCompleted: QueueItem[];
  /** Current serving number */
  currentServingNumber: number;
  /** Stats */
  stats: {
    total: number;
    waiting: number;
    serving: number;
    completed: number;
  };
  /** Estimated wait in minutes */
  estimatedWaitMinutes: number;
  /** Shop name */
  shopName: string;
  /** Operating hours */
  operatingHours: { open: string; close: string };
}

/**
 * Presenter for the Display screen
 * Provides pre-computed view models optimized for the kiosk UI
 */
export class DisplayPresenter {
  constructor(private readonly repository: IQueueItemRepository) {}

  /**
   * Get the complete view model for the display page
   */
  async getViewModel(): Promise<DisplayViewModel> {
    try {
      // Execute queries in parallel for better performance
      const [stats, inProgressItems, waitingItems, completedItems, currentServingNumber] = await Promise.all([
        this.repository.getStats(),
        this.repository.getInProgressItems(20),
        this.repository.getWaitingItems(20),
        this.repository.getCompletedItems(20),
        this.repository.getCurrentServingNumber(),
      ]);

      // Note: Repository handles sorting by updatedAt desc (in_progress, completed) 
      // and queueNumber asc (waiting)
      
      const currentServingItem = inProgressItems.length > 0 ? inProgressItems[0] : null;
      const nextUpItem = waitingItems.length > 0 ? waitingItems[0] : null;
      const recentCompleted = completedItems.slice(0, 5);

      // Simple estimated wait time calculation (e.g., 5 mins per waiting person)
      const estimatedWaitMinutes = stats.waitingItems * 5;

      return {
        currentServingItem,
        servingItems: inProgressItems,
        nextUpItem,
        waitingItems,
        recentCompleted,
        currentServingNumber,
        stats: {
          total: stats.totalItems,
          waiting: stats.waitingItems,
          serving: stats.inProgressItems,
          completed: stats.completedItems,
        },
        estimatedWaitMinutes,
        shopName: DEFAULT_SHOP_CONFIG.shopName,
        operatingHours: DEFAULT_SHOP_CONFIG.operatingHours,
      };
    } catch (error) {
      console.error('Error fetching DisplayViewModel:', error);
      throw new Error('Failed to load Display view model');
    }
  }

  /**
   * Generate metadata for the Display page
   */
  generateMetadata(): Metadata {
    return {
      title: `Display Board | ${DEFAULT_SHOP_CONFIG.shopName}`,
      description: 'หน้าจอแสดงสถานะคิวสำหรับลูกค้า',
    };
  }
}
