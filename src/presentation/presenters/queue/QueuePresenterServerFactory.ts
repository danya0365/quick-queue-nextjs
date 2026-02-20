/**
 * QueuePresenterServerFactory
 * ✅ Injects SQLite Repository for real data
 */

import { SqliteQueueItemRepository } from '@/src/infrastructure/repositories/sqlite/SqliteQueueItemRepository';
import { QueuePresenter } from './QueuePresenter';

export class QueuePresenterServerFactory {
  static create(): QueuePresenter {
    const repository = new SqliteQueueItemRepository();
    return new QueuePresenter(repository);
  }
}

export function createServerQueuePresenter(): QueuePresenter {
  return QueuePresenterServerFactory.create();
}
