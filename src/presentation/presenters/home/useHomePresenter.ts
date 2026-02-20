'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HomePresenter, HomeViewModel } from './HomePresenter';
import { createClientHomePresenter } from './HomePresenterClientFactory';

export interface HomePresenterState {
  viewModel: HomeViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface HomePresenterActions {
  loadData: (isBackground?: boolean) => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Home presenter
 * Provides state management and actions for Home page
 */
export function useHomePresenter(
  initialViewModel?: HomeViewModel,
  presenterOverride?: HomePresenter
): [HomePresenterState, HomePresenterActions] {
  const presenter = useMemo(
    () => presenterOverride ?? createClientHomePresenter(),
    [presenterOverride]
  );

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [viewModel, setViewModel] = useState<HomeViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (isBackground: boolean = false) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    if (!isBackground) {
      setLoading(true);
    }
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
        console.error('Error loading home data:', err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [presenter]);

  useEffect(() => {
    if (!initialViewModel) {
      loadData(false);
    }
  }, [loadData, initialViewModel]);

  // Real-time polling
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [loadData]);

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
