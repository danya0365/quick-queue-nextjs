'use client';

import { ApiQueueItemRepository } from '@/src/infrastructure/repositories/api/ApiQueueItemRepository';
import { DisplayPresenter } from './DisplayPresenter';

export class DisplayPresenterClientFactory {
  static create(): DisplayPresenter {
    const repository = new ApiQueueItemRepository();
    return new DisplayPresenter(repository);
  }
}

export function createClientDisplayPresenter(): DisplayPresenter {
  return DisplayPresenterClientFactory.create();
}
