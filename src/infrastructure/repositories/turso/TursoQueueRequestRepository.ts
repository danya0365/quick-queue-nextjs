/**
 * TursoQueueRequestRepository
 * @libsql/client implementation of IQueueRequestRepository
 * Infrastructure layer — handles queue request CRUD + approval workflow
 */

import { IQueueRequestRepository } from '@/src/application/repositories/IQueueRequestRepository';
import {
    CreateQueueRequestData,
    QueueRequest,
    RequestStatus,
    ServiceType,
} from '@/src/domain/types/queue';
import { getTursoDatabase } from '@/src/infrastructure/database/turso';
import { Row } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid';

function generateTrackingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars (0/O, 1/I)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function mapRowToQueueRequest(row: Row): QueueRequest {
  return {
    id: row.id as string,
    trackingCode: row.tracking_code as string,
    customerName: row.customer_name as string,
    serviceType: row.service_type as ServiceType,
    note: (row.note as string) || undefined,
    status: row.status as RequestStatus,
    rejectReason: (row.reject_reason as string) || undefined,
    queueItemId: (row.queue_item_id as string) || undefined,
    ipAddress: (row.ip_address as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export class TursoQueueRequestRepository implements IQueueRequestRepository {
  private get db() {
    return getTursoDatabase();
  }

  async create(data: CreateQueueRequestData, ipAddress?: string): Promise<QueueRequest> {
    const id = uuidv4();
    const trackingCode = generateTrackingCode();
    const now = new Date().toISOString();

    await this.db.execute({
      sql: `INSERT INTO queue_requests (id, tracking_code, customer_name, service_type, status, note, ip_address, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
      args: [id, trackingCode, data.customerName, data.serviceType, data.note || '', ipAddress || '', now, now],
    });

    const created = await this.getById(id);
    if (!created) throw new Error('Failed to create queue request');
    return created;
  }

  async getById(id: string): Promise<QueueRequest | null> {
    const result = await this.db.execute({
      sql: 'SELECT * FROM queue_requests WHERE id = ?',
      args: [id],
    });
    return result.rows.length > 0 ? mapRowToQueueRequest(result.rows[0]) : null;
  }

  async getByTrackingCode(code: string): Promise<QueueRequest | null> {
    const result = await this.db.execute({
      sql: 'SELECT * FROM queue_requests WHERE tracking_code = ?',
      args: [code.toUpperCase()],
    });
    return result.rows.length > 0 ? mapRowToQueueRequest(result.rows[0]) : null;
  }

  async getPending(): Promise<QueueRequest[]> {
    const result = await this.db.execute(
      "SELECT * FROM queue_requests WHERE status = 'pending' ORDER BY created_at ASC"
    );
    return result.rows.map(mapRowToQueueRequest);
  }

  async approve(id: string): Promise<QueueRequest> {
    const request = await this.getById(id);
    if (!request) throw new Error('Queue request not found');
    if (request.status !== RequestStatus.PENDING) {
      throw new Error('Only pending requests can be approved');
    }

    // Create a new queue item
    const queueItemId = uuidv4();
    const now = new Date().toISOString();

    // Get next queue number
    const numResult = await this.db.execute('SELECT MAX(queue_number) as maxNum FROM queue_items');
    const maxNum = numResult.rows[0].maxNum as number | null;
    const nextNumber = (maxNum || 0) + 1;

    // Insert queue item
    await this.db.execute({
      sql: `INSERT INTO queue_items (id, queue_number, customer_name, service_type, status, note, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'waiting', ?, ?, ?)`,
      args: [queueItemId, nextNumber, request.customerName, request.serviceType, request.note || '', now, now],
    });

    // Update request status
    await this.db.execute({
      sql: `UPDATE queue_requests SET status = 'approved', queue_item_id = ?, updated_at = ? WHERE id = ?`,
      args: [queueItemId, now, id],
    });

    const updated = await this.getById(id);
    if (!updated) throw new Error('Failed to update queue request');
    return updated;
  }

  async reject(id: string, reason: string): Promise<QueueRequest> {
    const request = await this.getById(id);
    if (!request) throw new Error('Queue request not found');
    if (request.status !== RequestStatus.PENDING) {
      throw new Error('Only pending requests can be rejected');
    }

    const now = new Date().toISOString();

    await this.db.execute({
      sql: `UPDATE queue_requests SET status = 'rejected', reject_reason = ?, updated_at = ? WHERE id = ?`,
      args: [reason, now, id],
    });

    const updated = await this.getById(id);
    if (!updated) throw new Error('Failed to update queue request');
    return updated;
  }

  async countByIpRecent(ip: string, minutes: number): Promise<number> {
    const result = await this.db.execute({
      sql: `SELECT COUNT(*) as count FROM queue_requests WHERE ip_address = ? AND created_at > datetime('now', ? || ' minutes')`,
      args: [ip, `-${minutes}`],
    });
    return (result.rows[0].count as number) || 0;
  }
}
