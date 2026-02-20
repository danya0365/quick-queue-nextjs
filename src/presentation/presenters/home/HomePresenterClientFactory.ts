/**
 * HomePresenterClientFactory
 * ✅ Injects API Repository for production-ready client-side data
 */

'use client';

import { ApiQueueItemRepository } from '@/src/infrastructure/repositories/api/ApiQueueItemRepository';
import { HomePresenter } from './HomePresenter';

export class HomePresenterClientFactory {
  static create(): HomePresenter {
    const repository = new ApiQueueItemRepository();
    return new HomePresenter(repository);
  }
}

export function createClientHomePresenter(): HomePresenter {
  return HomePresenterClientFactory.create();
}
