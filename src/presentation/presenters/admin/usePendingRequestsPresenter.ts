import { ApiQueueRequestRepository } from '@/src/infrastructure/repositories/api/ApiQueueRequestRepository';
import { useEffect, useMemo, useState } from 'react';
import { PendingRequestsPresenter, PendingRequestsViewModel } from './PendingRequestsPresenter';

export function usePendingRequestsPresenter(initialViewModel?: PendingRequestsViewModel) {
  const [viewModel, setViewModel] = useState<PendingRequestsViewModel | undefined>(initialViewModel);
  
  // Create presenter instance
  const presenter = useMemo(() => {
    return new PendingRequestsPresenter(
      new ApiQueueRequestRepository()
    );
  }, []);

  // Set initial state
  const [state, setState] = useState({
    loading: !initialViewModel,
    error: null as string | null,
    isRejectModalOpen: false,
    selectedRequestId: null as string | null,
    viewModel: initialViewModel || presenter.getInitialViewModel(),
  });

  // Bind presenter to state
  useEffect(() => {
    presenter.bind((newState) => {
      setState(prev => {
        const nextViewModel = { ...prev.viewModel, ...newState };
        setViewModel(nextViewModel);
        return {
          ...prev,
          viewModel: nextViewModel,
          loading: nextViewModel.isLoading,
          error: nextViewModel.error,
        };
      });
    });
  }, [presenter]);

  // Actions
  const actions = {
    loadData: async (page = 1, perPage = 10, search = state.viewModel.search, serviceType = state.viewModel.serviceType) => {
      await presenter.loadRequests(page, perPage, search, serviceType);
    },
    changePage: async (page: number) => {
      await presenter.loadRequests(page, state.viewModel.perPage, state.viewModel.search, state.viewModel.serviceType);
    },
    setSearch: async (search: string) => {
      await presenter.loadRequests(1, state.viewModel.perPage, search, state.viewModel.serviceType);
    },
    setServiceType: async (serviceType: string) => {
      await presenter.loadRequests(1, state.viewModel.perPage, state.viewModel.search, serviceType);
    },
    approveRequest: async (id: string) => {
      await presenter.approveRequest(id, state.viewModel.search, state.viewModel.serviceType);
    },
    openRejectModal: (id: string) => {
      setState(prev => ({ ...prev, isRejectModalOpen: true, selectedRequestId: id }));
    },
    closeRejectModal: () => {
      setState(prev => ({ ...prev, isRejectModalOpen: false, selectedRequestId: null }));
    },
    rejectRequest: async (id: string, reason: string) => {
      await presenter.rejectRequest(id, reason, state.viewModel.search, state.viewModel.serviceType);
      actions.closeRejectModal();
    },
  };

  return [state, actions] as const;
}
