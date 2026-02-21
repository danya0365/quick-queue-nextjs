/**
 * IQueueRequestRepository
 * Repository interface for QueueRequest data access
 * Following Clean Architecture - Application layer
 */

import {
    CreateQueueRequestData,
    QueueRequest,
} from '@/src/domain/types/queue';

export interface IQueueRequestRepository {
  /**
   * Create a new queue request (from public user)
   */
  create(data: CreateQueueRequestData, ipAddress?: string): Promise<QueueRequest>;

  /**
   * Get request by ID
   */
  getById(id: string): Promise<QueueRequest | null>;

  /**
   * Get request by tracking code (public)
   */
  getByTrackingCode(code: string): Promise<QueueRequest | null>;

  /**
   * Get all pending requests (admin)
   */
  getPending(): Promise<QueueRequest[]>;

  /**
   * Approve a request → create queue_item and link
   */
  approve(id: string): Promise<QueueRequest>;

  /**
   * Reject a request with reason
   */
  reject(id: string, reason: string): Promise<QueueRequest>;

  /**
   * Count recent requests by IP (for rate limiting)
   */
  countByIpRecent(ip: string, minutes: number): Promise<number>;
}
