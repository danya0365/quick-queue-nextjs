/**
 * AdminPresenterServerFactory
 */

import { MockQueueItemRepository } from '@/src/infrastructure/repositories/mock/MockQueueItemRepository';
import { AdminPresenter } from './AdminPresenter';

export class AdminPresenterServerFactory {
  static create(): AdminPresenter {
    const repository = new MockQueueItemRepository();
    return new AdminPresenter(repository);
  }
}

export function createServerAdminPresenter(): AdminPresenter {
  return AdminPresenterServerFactory.create();
}
