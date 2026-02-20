/**
 * TursoQueueItemRepository
 * Real @libsql/client implementation of IQueueItemRepository
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
import { getTursoDatabase } from '@/src/infrastructure/database/turso';
import { Row } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Maps a raw libsql Row → QueueItem domain object
 */
function mapRowToQueueItem(row: Row): QueueItem {
  return {
    id: row.id as string,
    queueNumber: row.queue_number as number,
    customerName: row.customer_name as string,
    serviceType: row.service_type as ServiceType,
    status: row.status as QueueStatus,
    note: (row.note as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export class TursoQueueItemRepository implements IQueueItemRepository {
  private get db() {
    return getTursoDatabase();
  }

  async getById(id: string): Promise<QueueItem | null> {
    const result = await this.db.execute({
      sql: 'SELECT * FROM queue_items WHERE id = ?',
      args: [id]
    });

    return result.rows.length > 0 ? mapRowToQueueItem(result.rows[0]) : null;
  }

  async getAll(): Promise<QueueItem[]> {
    const result = await this.db.execute('SELECT * FROM queue_items ORDER BY queue_number ASC');
    return result.rows.map(mapRowToQueueItem);
  }

  async getPaginated(
    page: number,
    perPage: number,
    status?: string
  ): Promise<PaginatedResult<QueueItem>> {
    const offset = (page - 1) * perPage;

    let dataQuery = 'SELECT * FROM queue_items';
    let countQuery = 'SELECT COUNT(*) as count FROM queue_items';
    const params: (string | number)[] = [];
    const countParams: (string | number)[] = [];

    if (status && status !== 'all') {
      dataQuery += ' WHERE status = ?';
      countQuery += ' WHERE status = ?';
      params.push(status);
      countParams.push(status);
    }

    dataQuery += ' ORDER BY queue_number DESC LIMIT ? OFFSET ?';
    params.push(perPage, offset);

    const [dataResult, countResult] = await Promise.all([
      this.db.execute({ sql: dataQuery, args: params }),
      this.db.execute({ sql: countQuery, args: countParams })
    ]);

    return {
      data: dataResult.rows.map(mapRowToQueueItem),
      total: countResult.rows[0].count as number,
      page,
      perPage,
    };
  }

  async getByStatusLimited(status: string, limit: number): Promise<QueueItem[]> {
    const result = await this.db.execute({
      sql: 'SELECT * FROM queue_items WHERE status = ? ORDER BY queue_number ASC LIMIT ?',
      args: [status, limit]
    });
    return result.rows.map(mapRowToQueueItem);
  }

  async create(data: CreateQueueItemData): Promise<QueueItem> {
    const id = data.id || uuidv4();
    const nextNumber = await this.getNextQueueNumber();
    const now = new Date().toISOString();

    await this.db.execute({
      sql: `INSERT INTO queue_items (id, queue_number, customer_name, service_type, status, note, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'waiting', ?, ?, ?)`,
      args: [id, nextNumber, data.customerName, data.serviceType, data.note || '', now, now]
    });

    const created = await this.getById(id);
    if (!created) throw new Error('Failed to create queue item');
    return created;
  }

  async update(id: string, data: UpdateQueueItemData): Promise<QueueItem> {
    const existing = await this.getById(id);
    if (!existing) throw new Error('QueueItem not found');

    const now = new Date().toISOString();

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

    await this.db.execute({
      sql: `UPDATE queue_items SET ${updates.join(', ')} WHERE id = ?`,
      args: values
    });

    const updated = await this.getById(id);
    if (!updated) throw new Error('Failed to update queue item');
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.execute({
      sql: 'DELETE FROM queue_items WHERE id = ?',
      args: [id]
    });
    return result.rowsAffected > 0;
  }

  async deleteAll(): Promise<boolean> {
    const result = await this.db.execute('DELETE FROM queue_items');
    return result.rowsAffected >= 0;
  }

  async getStats(): Promise<QueueStats> {
    const result = await this.db.execute(`
      SELECT
        COUNT(*) as totalItems,
        SUM(CASE WHEN status = 'waiting' THEN 1 ELSE 0 END) as waitingItems,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as inProgressItems,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedItems,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledItems
      FROM queue_items
    `);

    const row = result.rows[0];

    return {
      totalItems: (row.totalItems as number) || 0,
      waitingItems: (row.waitingItems as number) || 0,
      inProgressItems: (row.inProgressItems as number) || 0,
      completedItems: (row.completedItems as number) || 0,
      cancelledItems: (row.cancelledItems as number) || 0,
    };
  }

  async getNextQueueNumber(): Promise<number> {
    const result = await this.db.execute('SELECT MAX(queue_number) as maxNum FROM queue_items');
    const maxNum = result.rows[0].maxNum as number | null;
    return (maxNum || 0) + 1;
  }

  async getCurrentServingNumber(): Promise<number> {
    const result = await this.db.execute({
      sql: 'SELECT MIN(queue_number) as minNum FROM queue_items WHERE status = ?',
      args: ['in_progress']
    });
    const minNum = result.rows[0].minNum as number | null;
    return minNum || 0;
  }
}
