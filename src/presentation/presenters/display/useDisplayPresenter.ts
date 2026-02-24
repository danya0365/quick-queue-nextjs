'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DisplayPresenter, DisplayViewModel } from './DisplayPresenter';
import { createClientDisplayPresenter } from './DisplayPresenterClientFactory';

export interface DisplayPresenterState {
  viewModel: DisplayViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface DisplayPresenterActions {
  loadData: () => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Display presenter
 * Provides state management and actions for the Kiosk Display Screen
 */
export function useDisplayPresenter(
  initialViewModel?: DisplayViewModel,
  presenterOverride?: DisplayPresenter
): [DisplayPresenterState, DisplayPresenterActions] {
  const presenter = useMemo(
    () => presenterOverride ?? createClientDisplayPresenter(),
    [presenterOverride]
  );

  const isMountedRef = useRef(true);
  
  const [state, setState] = useState<DisplayPresenterState>({
    viewModel: initialViewModel || null,
    loading: !initialViewModel,
    error: null,
  });

  const loadData = useCallback(async () => {
    if (!isMountedRef.current) return;
    try {
      if (!state.viewModel) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }
      const vm = await presenter.getViewModel();
      if (!isMountedRef.current) return;
      setState((prev) => ({
        ...prev,
        viewModel: vm,
        loading: false,
        error: null,
      }));
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Failed to load Display data:', err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred.',
      }));
    }
  }, [presenter, state.viewModel]);

  // Initial load if no initial data
  useEffect(() => {
    isMountedRef.current = true;
    if (!initialViewModel) {
      loadData();
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [loadData, initialViewModel]);

  // Polling setup optimized for display view (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [loadData]);


  const actions: DisplayPresenterActions = {
    loadData,
    setError: (error) => setState((prev) => ({ ...prev, error })),
  };

  return [state, actions];
}
