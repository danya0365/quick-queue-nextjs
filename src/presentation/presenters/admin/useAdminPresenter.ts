'use client';

import type { CreateQueueItemData, UpdateQueueItemData } from '@/src/domain/types/queue';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdminPresenter, AdminViewModel } from './AdminPresenter';
import { createClientAdminPresenter } from './AdminPresenterClientFactory';

export interface AdminPresenterState {
  viewModel: AdminViewModel | null;
  loading: boolean;
  error: string | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isClearAllModalOpen: boolean;
  selectedItemId: string | null;
  // Pagination
  currentPage: number;
  statusFilter: string;
  // Queue Request modals
  isRejectModalOpen: boolean;
  selectedRequestId: string | null;
}

export interface AdminPresenterActions {
  loadData: (page?: number, status?: string, isBackground?: boolean) => Promise<void>;
  createQueueItem: (data: CreateQueueItemData) => Promise<void>;
  updateQueueItem: (id: string, data: UpdateQueueItemData) => Promise<void>;
  deleteQueueItem: (id: string) => Promise<void>;
  clearAllQueues: () => Promise<void>;
  markInProgress: (id: string) => Promise<void>;
  markCompleted: (id: string) => Promise<void>;
  markCancelled: (id: string) => Promise<void>;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (itemId: string) => void;
  closeEditModal: () => void;
  openDeleteModal: (itemId: string) => void;
  closeDeleteModal: () => void;
  openClearAllModal: () => void;
  closeClearAllModal: () => void;
  setError: (error: string | null) => void;
  // Pagination
  goToPage: (page: number) => void;
  setStatusFilter: (status: string) => void;
  // Queue Request actions
  approveRequest: (id: string) => Promise<void>;
  openRejectModal: (requestId: string) => void;
  closeRejectModal: () => void;
  rejectRequest: (id: string, reason: string) => Promise<void>;
}

const PER_PAGE = 20;

export function useAdminPresenter(
  initialViewModel?: AdminViewModel,
  mode: 'dashboard' | 'queues' = 'queues',
  presenterOverride?: AdminPresenter
): [AdminPresenterState, AdminPresenterActions] {
  const presenter = useMemo(
    () => presenterOverride ?? createClientAdminPresenter(),
    [presenterOverride]
  );

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [viewModel, setViewModel] = useState<AdminViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilterState] = useState<string>('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Queue request modal states
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Use refs to avoid stale closures
  const currentPageRef = useRef(currentPage);
  const statusFilterRef = useRef(statusFilter);
  currentPageRef.current = currentPage;
  statusFilterRef.current = statusFilter;

  const loadData = useCallback(async (page?: number, status?: string, isBackground: boolean = false) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    if (!isBackground) setLoading(true);
    setError(null);

    const p = page ?? currentPageRef.current;
    const s = status ?? statusFilterRef.current;

    try {
      let newViewModel: AdminViewModel;
      if (mode === 'dashboard') {
        newViewModel = await presenter.loadDashboardData() as AdminViewModel;
      } else {
        newViewModel = await presenter.loadQueuesData(p, PER_PAGE, s === 'all' ? undefined : s);
      }
      
      if (isMountedRef.current) {
        setViewModel(newViewModel);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      }
    } finally {
      if (isMountedRef.current && !isBackground) setLoading(false);
    }
  }, [presenter]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    loadData(page, statusFilterRef.current);
  }, [loadData]);

  const setStatusFilter = useCallback((status: string) => {
    setStatusFilterState(status);
    setCurrentPage(1); // Reset to page 1 on filter change
    loadData(1, status);
  }, [loadData]);

  const createQueueItem = useCallback(async (data: CreateQueueItemData) => {
    setError(null);
    try {
      await presenter.createQueueItem(data);
      if (isMountedRef.current) setIsCreateModalOpen(false);
      await loadData();
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error creating queue item');
      }
    }
  }, [loadData, presenter]);

  const updateQueueItem = useCallback(async (id: string, data: UpdateQueueItemData) => {
    setError(null);
    try {
      await presenter.updateQueueItem(id, data);
      if (isMountedRef.current) {
        setIsEditModalOpen(false);
        setSelectedItemId(null);
      }
      await loadData();
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error updating queue item');
      }
    }
  }, [loadData, presenter]);

  const deleteQueueItem = useCallback(async (id: string) => {
    setError(null);
    try {
      await presenter.deleteQueueItem(id);
      if (isMountedRef.current) {
        setIsDeleteModalOpen(false);
        setSelectedItemId(null);
      }
      await loadData();
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error deleting queue item');
      }
    }
  }, [loadData, presenter]);

  const clearAllQueues = useCallback(async () => {
    setError(null);
    try {
      await presenter.clearAllQueues();
      if (isMountedRef.current) {
        setIsClearAllModalOpen(false);
      }
      await loadData();
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error clearing all queues');
      }
    }
  }, [loadData, presenter]);

  const markInProgress = useCallback(async (id: string) => {
    setError(null);
    try {
      await presenter.markInProgress(id);
      await loadData();
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error updating status');
      }
    }
  }, [loadData, presenter]);

  const markCompleted = useCallback(async (id: string) => {
    setError(null);
    try {
      await presenter.markCompleted(id);
      await loadData();
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error updating status');
      }
    }
  }, [loadData, presenter]);

  const markCancelled = useCallback(async (id: string) => {
    setError(null);
    try {
      await presenter.markCancelled(id);
      await loadData();
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error updating status');
      }
    }
  }, [loadData, presenter]);

  // Modal actions
  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
    setError(null);
  }, []);
  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setError(null);
  }, []);
  const openEditModal = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setIsEditModalOpen(true);
    setError(null);
  }, []);
  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedItemId(null);
    setError(null);
  }, []);
  const openDeleteModal = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setIsDeleteModalOpen(true);
    setError(null);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedItemId(null);
    setError(null);
  }, []);
  const openClearAllModal = useCallback(() => {
    setIsClearAllModalOpen(true);
    setError(null);
  }, []);
  const closeClearAllModal = useCallback(() => {
    setIsClearAllModalOpen(false);
    setError(null);
  }, []);

  // Queue request actions
  const approveRequest = useCallback(async (id: string) => {
    setError(null);
    try {
      await presenter.approveRequest(id);
      await loadData(undefined, undefined, true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ไม่สามารถอนุมัติคำขอได้';
      setError(message);
    }
  }, [presenter, loadData]);

  const openRejectModal = useCallback((requestId: string) => {
    setSelectedRequestId(requestId);
    setIsRejectModalOpen(true);
    setError(null);
  }, []);

  const closeRejectModal = useCallback(() => {
    setSelectedRequestId(null);
    setIsRejectModalOpen(false);
    setError(null);
  }, []);

  const rejectRequest = useCallback(async (id: string, reason: string) => {
    setError(null);
    try {
      await presenter.rejectRequest(id, reason);
      setSelectedRequestId(null);
      setIsRejectModalOpen(false);
      await loadData(undefined, undefined, true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ไม่สามารถปฏิเสธคำขอได้';
      setError(message);
    }
  }, [presenter, loadData]);

  // Initial load
  useEffect(() => {
    loadData(1, 'all', false);
  }, [loadData]);

  // Real-time polling
  useEffect(() => {
    const interval = setInterval(() => {
      // Auto refresh in background every 5 seconds
      loadData(undefined, undefined, true);
    }, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return [
    {
      viewModel,
      loading,
      error,
      isCreateModalOpen,
      isEditModalOpen,
      isDeleteModalOpen,
      isClearAllModalOpen,
      selectedItemId,
      currentPage,
      statusFilter,
      isRejectModalOpen,
      selectedRequestId,
    },
    {
      loadData,
      createQueueItem,
      updateQueueItem,
      deleteQueueItem,
      clearAllQueues,
      markInProgress,
      markCompleted,
      markCancelled,
      openCreateModal,
      closeCreateModal,
      openEditModal,
      closeEditModal,
      openDeleteModal,
      closeDeleteModal,
      openClearAllModal,
      closeClearAllModal,
      setError,
      goToPage,
      setStatusFilter,
      approveRequest,
      openRejectModal,
      closeRejectModal,
      rejectRequest,
    },
  ];
}
