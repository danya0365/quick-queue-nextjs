/**
 * QueuePresenterClientFactory
 * ✅ Injects Mock Repository for development
 */

'use client';

import { MockQueueItemRepository } from '@/src/infrastructure/repositories/mock/MockQueueItemRepository';
import { QueuePresenter } from './QueuePresenter';

export class QueuePresenterClientFactory {
  static create(): QueuePresenter {
    const repository = new MockQueueItemRepository();
    return new QueuePresenter(repository);
  }
}

export function createClientQueuePresenter(): QueuePresenter {
  return QueuePresenterClientFactory.create();
}
