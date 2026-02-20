/**
 * AdminPresenterClientFactory
 * ✅ Injects API Repository for production-ready client-side data
 */

'use client';

import { ApiQueueItemRepository } from '@/src/infrastructure/repositories/api/ApiQueueItemRepository';
import { AdminPresenter } from './AdminPresenter';

export class AdminPresenterClientFactory {
  static create(): AdminPresenter {
    const repository = new ApiQueueItemRepository();
    return new AdminPresenter(repository);
  }
}

export function createClientAdminPresenter(): AdminPresenter {
  return AdminPresenterClientFactory.create();
}
