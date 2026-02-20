/**
 * AdminPresenterServerFactory
 * ✅ Injects SQLite Repository for real data
 */

import { SqliteQueueItemRepository } from '@/src/infrastructure/repositories/sqlite/SqliteQueueItemRepository';
import { AdminPresenter } from './AdminPresenter';

export class AdminPresenterServerFactory {
  static create(): AdminPresenter {
    const repository = new SqliteQueueItemRepository();
    return new AdminPresenter(repository);
  }
}

export function createServerAdminPresenter(): AdminPresenter {
  return AdminPresenterServerFactory.create();
}
