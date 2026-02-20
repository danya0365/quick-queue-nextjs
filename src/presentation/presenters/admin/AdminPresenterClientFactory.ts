/**
 * AdminPresenterClientFactory
 */

'use client';

import { MockQueueItemRepository } from '@/src/infrastructure/repositories/mock/MockQueueItemRepository';
import { AdminPresenter } from './AdminPresenter';

export class AdminPresenterClientFactory {
  static create(): AdminPresenter {
    const repository = new MockQueueItemRepository();
    return new AdminPresenter(repository);
  }
}

export function createClientAdminPresenter(): AdminPresenter {
  return AdminPresenterClientFactory.create();
}
