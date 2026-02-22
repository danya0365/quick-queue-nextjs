import { ApiAuthRepository } from '@/src/infrastructure/repositories/api/ApiAuthRepository';
import { useAdminLayoutStore } from '@/src/presentation/hooks/useAdminLayoutStore';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useEffect, useMemo, useState } from 'react';
import { AdminLayoutPresenter } from './AdminLayoutPresenter';

export interface AdminLayoutState {
  template: string;
  isAuthenticated: boolean;
  authChecking: boolean;
}

export interface AdminLayoutActions {
  handleLogin: () => void;
  handleLogout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export function useAdminLayoutPresenter(): [AdminLayoutState, AdminLayoutActions] {
  const { template } = useTemplate();

  const presenter = useMemo(() => {
    return new AdminLayoutPresenter(new ApiAuthRepository());
  }, []);

  const [viewModel, setViewModel] = useState(presenter.getInitialViewModel());

  useEffect(() => {
    presenter.bind((newState) => {
      setViewModel(newState);
    });
  }, [presenter]);

  const actions: AdminLayoutActions = {
    checkSession: async () => {
      await presenter.checkSession();
    },
    handleLogout: async () => {
      await presenter.logout();
      useAdminLayoutStore.getState().setIsLogoutModalOpen(false);
    },
    handleLogin: () => {
      presenter.setAuthenticated(true);
    },
  };

  useEffect(() => {
    actions.checkSession();
  }, [presenter]);

  const state: AdminLayoutState = {
    template,
    isAuthenticated: viewModel.isAuthenticated,
    authChecking: viewModel.authChecking,
  };

  return [state, actions];
}
