import {
  IQueueRequestRepository,
} from '@/src/application/repositories/IQueueRequestRepository';
import { QueueRequest } from '@/src/domain/types/queue';

export interface PendingRequestsViewModel {
  requests: QueueRequest[];
  totalCount: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  search: string;
  serviceType: string;
  isLoading: boolean;
  error: string | null;
}

export class PendingRequestsPresenter {
  private updateState: (state: Partial<PendingRequestsViewModel>) => void = () => {};

  constructor(
    private readonly requestRepository: IQueueRequestRepository,
  ) {}

  /**
   * Bind the state updater function to the presenter.
   * This is called by the custom hook to connect React state.
   */
  bind(updateState: (state: Partial<PendingRequestsViewModel>) => void) {
    this.updateState = updateState;
  }

  /**
   * Get the initial view model state
   */
  getInitialViewModel(): PendingRequestsViewModel {
    return {
      requests: [],
      totalCount: 0,
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      search: '',
      serviceType: 'all',
      isLoading: true,
      error: null,
    };
  }

  /**
   * Load pending requests for a specific page
   */
  async loadRequests(page: number, perPage: number, search?: string, serviceType?: string): Promise<void> {
    try {
      this.updateState({ isLoading: true, error: null });
      
      const offset = (page - 1) * perPage;
      const [requests, totalCount] = await Promise.all([
        this.requestRepository.getPending(perPage, offset, search, serviceType),
        this.requestRepository.getPendingCount(search, serviceType),
      ]);

      const totalPages = Math.ceil(totalCount / perPage) || 1;

      this.updateState({ 
        requests: requests as QueueRequest[], 
        totalCount,
        currentPage: page,
        perPage,
        totalPages,
        search: search || '',
        serviceType: serviceType || 'all',
        isLoading: false 
      });
    } catch (error) {
      console.error('Error loading pending requests:', error);
      this.updateState({ 
        error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลคำขอ',
        isLoading: false 
      });
    }
  }

  /**
   * Approve a request
   */
  async approveRequest(id: string, search?: string, serviceType?: string): Promise<void> {
    try {
      await this.requestRepository.approve(id);
      // Reload current page after approval
      await this.loadRequests(1, 10, search, serviceType); // Simple reload for now
    } catch (error) {
      console.error('Failed to approve request:', error);
      throw error;
    }
  }

  /**
   * Reject a request
   */
  async rejectRequest(id: string, reason: string, search?: string, serviceType?: string): Promise<void> {
    try {
      await this.requestRepository.reject(id, reason);
      // Reload current page after rejection
      await this.loadRequests(1, 10, search, serviceType);
    } catch (error) {
      console.error('Failed to reject request:', error);
      throw error;
    }
  }
}
