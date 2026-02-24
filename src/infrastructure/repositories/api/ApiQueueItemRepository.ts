/**
 * ApiQueueItemRepository
 * Implements IQueueItemRepository using API calls
 *
 * ✅ For use in CLIENT-SIDE components only
 * ✅ No direct DB access — calls go through Next.js API routes
 */

'use client';

import {
    IQueueItemRepository,
    PaginatedResult,
} from '@/src/application/repositories/IQueueItemRepository';
import {
    CreateQueueItemData,
    PerformanceInsights,
    QueueItem,
    QueueStats,
    UpdateQueueItemData,
} from '@/src/domain/types/queue';
import { v4 as uuidv4 } from 'uuid';

export class ApiQueueItemRepository implements IQueueItemRepository {
  private baseUrl = '/api/queue-items';

  async getById(id: string): Promise<QueueItem | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);

    if (res.status === 404) return null;
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดข้อมูลได้');
    }

    return res.json();
  }

  async getAll(): Promise<QueueItem[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดข้อมูลคิวได้');
    }

    return res.json();
  }

  async getPaginated(page: number, perPage: number, status?: string): Promise<PaginatedResult<QueueItem>> {
    let url = `${this.baseUrl}?page=${page}&perPage=${perPage}`;
    if (status) url += `&status=${status}`;

    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดข้อมูลได้');
    }

    return res.json();
  }

  async create(data: CreateQueueItemData): Promise<QueueItem> {
    const payload = {
      ...data,
      id: data.id || uuidv4(),
    };

    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถสร้างคิวได้');
    }

    return res.json();
  }

  async update(id: string, data: UpdateQueueItemData): Promise<QueueItem> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถอัปเดตได้');
    }

    return res.json();
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถลบได้');
    }

    return true;
  }

  async deleteAll(): Promise<boolean> {
    const res = await fetch(this.baseUrl, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถล้างคิวได้');
    }

    return true;
  }

  async getStats(): Promise<QueueStats> {
    const res = await fetch(`${this.baseUrl}/stats`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดสถิติได้');
    }

    return res.json();
  }

  async getRecentActivity(limit: number): Promise<QueueItem[]> {
    const res = await fetch(`${this.baseUrl}/recent-activity?limit=${limit}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดความเคลื่อนไหวได้');
    }

    return res.json();
  }

  async getPerformanceInsights(): Promise<PerformanceInsights> {
    const res = await fetch(`${this.baseUrl}/performance`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดสถิติประสิทธิภาพได้');
    }

    return res.json();
  }

  async getNextQueueNumber(): Promise<number> {
    const res = await fetch(`${this.baseUrl}/next-number`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดหมายเลขถัดไปได้');
    }

    const data = await res.json();
    return data.nextNumber;
  }

  async getCurrentServingNumber(): Promise<number> {
    const res = await fetch(`${this.baseUrl}/current-serving`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดคิวปัจจุบันได้');
    }

    const data = await res.json();
    return data.currentServingNumber;
  }
  async getWaitingItems(limit: number): Promise<QueueItem[]> {
    const res = await fetch(`${this.baseUrl}/by-status?status=waiting&limit=${limit}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดข้อมูลคิวได้');
    }
    return res.json();
  }

  async getInProgressItems(limit: number): Promise<QueueItem[]> {
    const res = await fetch(`${this.baseUrl}/by-status?status=in_progress&limit=${limit}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดข้อมูลคิวได้');
    }
    return res.json();
  }

  async getCompletedItems(limit: number): Promise<QueueItem[]> {
    const res = await fetch(`${this.baseUrl}/by-status?status=completed&limit=${limit}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดข้อมูลคิวได้');
    }
    return res.json();
  }
}
