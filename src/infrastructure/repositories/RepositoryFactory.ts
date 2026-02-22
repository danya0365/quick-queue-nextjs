import { IAuthRepository } from '@/src/application/repositories/IAuthRepository';
import { IQueueItemRepository } from '@/src/application/repositories/IQueueItemRepository';
import { IQueueRequestRepository } from '@/src/application/repositories/IQueueRequestRepository';
import { TursoAuthRepository } from './turso/TursoAuthRepository';
import { TursoQueueItemRepository } from './turso/TursoQueueItemRepository';
import { TursoQueueRequestRepository } from './turso/TursoQueueRequestRepository';

export function getQueueItemRepository(): IQueueItemRepository {
  return new TursoQueueItemRepository();
}

export function getAuthRepository(): IAuthRepository {
  return new TursoAuthRepository();
}

export function getQueueRequestRepository(): IQueueRequestRepository {
  return new TursoQueueRequestRepository();
}
