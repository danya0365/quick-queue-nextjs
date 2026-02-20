/**
 * AdminPresenterServerFactory
 * ✅ Injects SQLite Repository for real data
 */

import { getQueueItemRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { AdminPresenter } from './AdminPresenter';

export class AdminPresenterServerFactory {
  static create(): AdminPresenter {
    const repository = getQueueItemRepository();
    return new AdminPresenter(repository);
  }
}

export function createServerAdminPresenter(): AdminPresenter {
  return AdminPresenterServerFactory.create();
}
