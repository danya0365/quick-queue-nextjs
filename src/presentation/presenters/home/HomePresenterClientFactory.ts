/**
 * HomePresenterClientFactory
 * Factory for creating HomePresenter instances on the client side
 * ✅ Injects Mock Repository for development
 */

'use client';

import { MockQueueItemRepository } from '@/src/infrastructure/repositories/mock/MockQueueItemRepository';
import { HomePresenter } from './HomePresenter';

export class HomePresenterClientFactory {
  static create(): HomePresenter {
    // ✅ Use Mock Repository for development
    const repository = new MockQueueItemRepository();

    // ⏳ TODO: Switch to SQLite Repository when backend is ready
    // const repository = new SqliteQueueItemRepository();

    return new HomePresenter(repository);
  }
}

export function createClientHomePresenter(): HomePresenter {
  return HomePresenterClientFactory.create();
}
