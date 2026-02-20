/**
 * QueuePresenterClientFactory
 * ✅ Injects API Repository for production-ready client-side data
 */

'use client';

import { ApiQueueItemRepository } from '@/src/infrastructure/repositories/api/ApiQueueItemRepository';
import { QueuePresenter } from './QueuePresenter';

export class QueuePresenterClientFactory {
  static create(): QueuePresenter {
    const repository = new ApiQueueItemRepository();
    return new QueuePresenter(repository);
  }
}

export function createClientQueuePresenter(): QueuePresenter {
  return QueuePresenterClientFactory.create();
}
