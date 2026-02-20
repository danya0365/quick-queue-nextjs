/**
 * HomePresenterServerFactory
 * Factory for creating HomePresenter instances on the server side
 * ✅ Injects Mock Repository for development
 */

import { MockQueueItemRepository } from '@/src/infrastructure/repositories/mock/MockQueueItemRepository';
import { HomePresenter } from './HomePresenter';

export class HomePresenterServerFactory {
  static create(): HomePresenter {
    // ✅ Use Mock Repository for development
    const repository = new MockQueueItemRepository();

    // ⏳ TODO: Switch to SQLite Repository when backend is ready
    // const repository = new SqliteQueueItemRepository();

    return new HomePresenter(repository);
  }
}

export function createServerHomePresenter(): HomePresenter {
  return HomePresenterServerFactory.create();
}
