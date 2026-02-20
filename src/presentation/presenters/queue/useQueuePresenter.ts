'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QueuePresenter, QueueViewModel } from './QueuePresenter';
import { createClientQueuePresenter } from './QueuePresenterClientFactory';

export interface QueuePresenterState {
  viewModel: QueueViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface QueuePresenterActions {
  loadData: () => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Queue status page (read-only)
 * Auto-refreshes every 15 seconds for "live" feel
 */
export function useQueuePresenter(
  initialViewModel?: QueueViewModel,
  presenterOverride?: QueuePresenter
): [QueuePresenterState, QueuePresenterActions] {
  const presenter = useMemo(
    () => presenterOverride ?? createClientQueuePresenter(),
    [presenterOverride]
  );

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [viewModel, setViewModel] = useState<QueueViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    // Don't show loading spinner on auto-refresh
    if (!viewModel) setLoading(true);
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
        console.error('Error loading queue data:', err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [presenter, viewModel]);

  // Initial load
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return [
    { viewModel, loading, error },
    { loadData, setError },
  ];
}
