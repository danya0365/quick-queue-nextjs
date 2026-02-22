import { useAdminLayoutStore } from '@/src/presentation/hooks/useAdminLayoutStore';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useEffect, useState } from 'react';

export function useAdminLayoutPresenter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const { template } = useTemplate();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          setIsAuthenticated(true);
        }
      } catch {
        // No session
      } finally {
        setAuthChecking(false);
      }
    }
    checkSession();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    useAdminLayoutStore.getState().setIsLogoutModalOpen(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return {
    template,
    isAuthenticated,
    authChecking,
    handleLogin,
    handleLogout,
  };
}
