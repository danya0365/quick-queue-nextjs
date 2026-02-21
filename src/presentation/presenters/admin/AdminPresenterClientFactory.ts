/**
 * AdminPresenterClientFactory
 * ✅ Injects API Repository for production-ready client-side data
 */

'use client';

import { ApiQueueItemRepository } from '@/src/infrastructure/repositories/api/ApiQueueItemRepository';
import { ApiQueueRequestRepository } from '@/src/infrastructure/repositories/api/ApiQueueRequestRepository';
import { AdminPresenter } from './AdminPresenter';

export class AdminPresenterClientFactory {
  static create(): AdminPresenter {
    const repository = new ApiQueueItemRepository();
    const requestRepository = new ApiQueueRequestRepository();
    return new AdminPresenter(repository, requestRepository);
  }
}

export function createClientAdminPresenter(): AdminPresenter {
  return AdminPresenterClientFactory.create();
}
