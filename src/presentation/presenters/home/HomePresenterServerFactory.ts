/**
 * HomePresenterServerFactory
 * Factory for creating HomePresenter instances on the server side
 * ✅ Injects SQLite Repository for real data
 */

import { SqliteQueueItemRepository } from '@/src/infrastructure/repositories/sqlite/SqliteQueueItemRepository';
import { HomePresenter } from './HomePresenter';

export class HomePresenterServerFactory {
  static create(): HomePresenter {
    const repository = new SqliteQueueItemRepository();
    return new HomePresenter(repository);
  }
}

export function createServerHomePresenter(): HomePresenter {
  return HomePresenterServerFactory.create();
}
