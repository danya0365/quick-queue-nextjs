/**
 * QueuePresenterServerFactory
 * ✅ Injects SQLite Repository for real data
 */

import { getQueueItemRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { QueuePresenter } from './QueuePresenter';

export class QueuePresenterServerFactory {
  static create(): QueuePresenter {
    const repository = getQueueItemRepository();
    return new QueuePresenter(repository);
  }
}

export function createServerQueuePresenter(): QueuePresenter {
  return QueuePresenterServerFactory.create();
}
