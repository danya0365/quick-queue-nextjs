/**
 * QueuePresenterServerFactory
 * ✅ Injects Mock Repository for development
 */

import { MockQueueItemRepository } from '@/src/infrastructure/repositories/mock/MockQueueItemRepository';
import { QueuePresenter } from './QueuePresenter';

export class QueuePresenterServerFactory {
  static create(): QueuePresenter {
    const repository = new MockQueueItemRepository();
    return new QueuePresenter(repository);
  }
}

export function createServerQueuePresenter(): QueuePresenter {
  return QueuePresenterServerFactory.create();
}
