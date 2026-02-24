import { getQueueItemRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { DisplayPresenter } from './DisplayPresenter';

export class DisplayPresenterServerFactory {
  static create(): DisplayPresenter {
    const repository = getQueueItemRepository();
    return new DisplayPresenter(repository);
  }
}

export function createServerDisplayPresenter(): DisplayPresenter {
  return DisplayPresenterServerFactory.create();
}
