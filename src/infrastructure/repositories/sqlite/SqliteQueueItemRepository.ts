/**
 * SqliteQueueItemRepository
 * Real SQLite implementation of IQueueItemRepository
 * Following Clean Architecture - Infrastructure layer
 */

import {
    IQueueItemRepository,
    PaginatedResult,
} from '@/src/application/repositories/IQueueItemRepository';
import {
    CreateQueueItemData,
    QueueItem,
    QueueStats,
    QueueStatus,
    ServiceType,
    UpdateQueueItemData,
} from '@/src/domain/types/queue';
import { getDatabase } from '@/src/infrastructure/database/database';

// ─── Row type from SQLite ───
interface QueueItemRow {
  id: string;
  queue_number: number;
  customer_name: string;
  service_type: string;
  status: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Maps a raw SQLite row → QueueItem domain object
 */
function mapRowToQueueItem(row: QueueItemRow): QueueItem {
  return {
    id: row.id,
    queueNumber: row.queue_number,
    customerName: row.customer_name,
    serviceType: row.service_type as ServiceType,
    status: row.status as QueueStatus,
    note: row.note || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SqliteQueueItemRepository implements IQueueItemRepository {
  private get db() {
    return getDatabase();
  }

  async getById(id: string): Promise<QueueItem | null> {
    const row = this.db
      .prepare('SELECT * FROM queue_items WHERE id = ?')
      .get(id) as QueueItemRow | undefined;

    return row ? mapRowToQueueItem(row) : null;
  }

  async getAll(): Promise<QueueItem[]> {
    const rows = this.db
      .prepare('SELECT * FROM queue_items ORDER BY queue_number ASC')
      .all() as QueueItemRow[];

    return rows.map(mapRowToQueueItem);
  }

  async getPaginated(
    page: number,
    perPage: number
  ): Promise<PaginatedResult<QueueItem>> {
    const offset = (page - 1) * perPage;

    const rows = this.db
      .prepare('SELECT * FROM queue_items ORDER BY queue_number ASC LIMIT ? OFFSET ?')
      .all(perPage, offset) as QueueItemRow[];

    const countResult = this.db
      .prepare('SELECT COUNT(*) as count FROM queue_items')
      .get() as { count: number };

    return {
      data: rows.map(mapRowToQueueItem),
      total: countResult.count,
      page,
      perPage,
    };
  }

  async create(data: CreateQueueItemData): Promise<QueueItem> {
    const id = `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const nextNumber = await this.getNextQueueNumber();
    const now = new Date().toISOString();

    this.db
      .prepare(
        `INSERT INTO queue_items (id, queue_number, customer_name, service_type, status, note, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'waiting', ?, ?, ?)`
      )
      .run(id, nextNumber, data.customerName, data.serviceType, data.note || '', now, now);

    const created = await this.getById(id);
    if (!created) throw new Error('Failed to create queue item');
    return created;
  }

  async update(id: string, data: UpdateQueueItemData): Promise<QueueItem> {
    const existing = await this.getById(id);
    if (!existing) throw new Error('QueueItem not found');

    const now = new Date().toISOString();

    // Build dynamic SET clause
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (data.customerName !== undefined) {
      updates.push('customer_name = ?');
      values.push(data.customerName);
    }
    if (data.serviceType !== undefined) {
      updates.push('service_type = ?');
      values.push(data.serviceType);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }
    if (data.note !== undefined) {
      updates.push('note = ?');
      values.push(data.note);
    }

    updates.push('updated_at = ?');
    values.push(now);

    values.push(id); // WHERE id = ?

    this.db
      .prepare(`UPDATE queue_items SET ${updates.join(', ')} WHERE id = ?`)
      .run(...values);

    const updated = await this.getById(id);
    if (!updated) throw new Error('Failed to update queue item');
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = this.db
      .prepare('DELETE FROM queue_items WHERE id = ?')
      .run(id);

    return result.changes > 0;
  }

  async getStats(): Promise<QueueStats> {
    const result = this.db
      .prepare(
        `SELECT
          COUNT(*) as totalItems,
          SUM(CASE WHEN status = 'waiting' THEN 1 ELSE 0 END) as waitingItems,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as inProgressItems,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedItems,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledItems
        FROM queue_items`
      )
      .get() as {
      totalItems: number;
      waitingItems: number;
      inProgressItems: number;
      completedItems: number;
      cancelledItems: number;
    };

    return {
      totalItems: result.totalItems || 0,
      waitingItems: result.waitingItems || 0,
      inProgressItems: result.inProgressItems || 0,
      completedItems: result.completedItems || 0,
      cancelledItems: result.cancelledItems || 0,
    };
  }

  async getNextQueueNumber(): Promise<number> {
    const result = this.db
      .prepare('SELECT MAX(queue_number) as maxNum FROM queue_items')
      .get() as { maxNum: number | null };

    return (result.maxNum || 0) + 1;
  }
}
