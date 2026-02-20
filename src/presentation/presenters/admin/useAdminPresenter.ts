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
  selectedItemId: string | null;
}

export interface AdminPresenterActions {
  loadData: () => Promise<void>;
  createQueueItem: (data: CreateQueueItemData) => Promise<void>;
  updateQueueItem: (id: string, data: UpdateQueueItemData) => Promise<void>;
  deleteQueueItem: (id: string) => Promise<void>;
  markInProgress: (id: string) => Promise<void>;
  markCompleted: (id: string) => Promise<void>;
  markCancelled: (id: string) => Promise<void>;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (itemId: string) => void;
  closeEditModal: () => void;
  openDeleteModal: (itemId: string) => void;
  closeDeleteModal: () => void;
  setError: (error: string | null) => void;
}

export function useAdminPresenter(
  initialViewModel?: AdminViewModel,
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

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel();
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
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter]);

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

  // Initial load
  useEffect(() => {
    if (!initialViewModel) loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      selectedItemId,
    },
    {
      loadData,
      createQueueItem,
      updateQueueItem,
      deleteQueueItem,
      markInProgress,
      markCompleted,
      markCancelled,
      openCreateModal,
      closeCreateModal,
      openEditModal,
      closeEditModal,
      openDeleteModal,
      closeDeleteModal,
      setError,
    },
  ];
}
