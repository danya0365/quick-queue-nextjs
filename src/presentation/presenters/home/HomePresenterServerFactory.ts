/**
 * HomePresenterServerFactory
 * Factory for creating HomePresenter instances on the server side
 * ✅ Injects SQLite Repository for real data
 */

import { getQueueItemRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { HomePresenter } from './HomePresenter';

export class HomePresenterServerFactory {
  static create(): HomePresenter {
    const repository = getQueueItemRepository();
    return new HomePresenter(repository);
  }
}

export function createServerHomePresenter(): HomePresenter {
  return HomePresenterServerFactory.create();
}
