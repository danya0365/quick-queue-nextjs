/**
 * ApiQueueRequestRepository
 * Client-side implementation using API routes
 *
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import { IQueueRequestRepository } from '@/src/application/repositories/IQueueRequestRepository';
import {
    CreateQueueRequestData,
    QueueRequest,
} from '@/src/domain/types/queue';

export class ApiQueueRequestRepository implements IQueueRequestRepository {
  private baseUrl = '/api/queue-requests';

  async create(data: CreateQueueRequestData & { challengeToken?: string; challengeAnswer?: number }): Promise<QueueRequest> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถส่งคำขอได้');
    }

    return res.json();
  }

  async getById(id: string): Promise<QueueRequest | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดข้อมูลได้');
    }
    return res.json();
  }

  async getByTrackingCode(code: string): Promise<QueueRequest | null> {
    const res = await fetch(`${this.baseUrl}/track/${code}`);
    if (res.status === 404) return null;
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดข้อมูลได้');
    }
    return res.json();
  }

  async getPending(): Promise<QueueRequest[]> {
    const res = await fetch(`${this.baseUrl}?status=pending`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดข้อมูลได้');
    }
    return res.json();
  }

  async approve(id: string): Promise<QueueRequest> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถอนุมัติได้');
    }

    return res.json();
  }

  async reject(id: string, reason: string): Promise<QueueRequest> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', rejectReason: reason }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถปฏิเสธได้');
    }

    return res.json();
  }

  async countByIpRecent(): Promise<number> {
    // Not needed on client side
    return 0;
  }
}
