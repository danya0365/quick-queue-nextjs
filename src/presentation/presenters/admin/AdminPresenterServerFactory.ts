/**
 * AdminPresenterServerFactory
 * ✅ Injects SQLite Repository for real data
 */

import { getQueueItemRepository, getQueueRequestRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { AdminPresenter } from './AdminPresenter';

export class AdminPresenterServerFactory {
  static create(): AdminPresenter {
    const repository = getQueueItemRepository();
    const requestRepository = getQueueRequestRepository();
    return new AdminPresenter(repository, requestRepository);
  }
}

export function createServerAdminPresenter(): AdminPresenter {
  return AdminPresenterServerFactory.create();
}
