import { IAuthRepository } from '@/src/application/repositories/IAuthRepository';
import { IQueueItemRepository } from '@/src/application/repositories/IQueueItemRepository';
import { TursoAuthRepository } from './turso/TursoAuthRepository';
import { TursoQueueItemRepository } from './turso/TursoQueueItemRepository';

export function getQueueItemRepository(): IQueueItemRepository {
  return new TursoQueueItemRepository();
}

export function getAuthRepository(): IAuthRepository {
  return new TursoAuthRepository();
}
