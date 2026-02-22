import { create } from 'zustand';

interface AdminLayoutState {
  isSidebarOpen: boolean;
  isLogoutModalOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setIsLogoutModalOpen: (isOpen: boolean) => void;
}

export const useAdminLayoutStore = create<AdminLayoutState>((set) => ({
  isSidebarOpen: false,
  isLogoutModalOpen: false,
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setIsLogoutModalOpen: (isOpen) => set({ isLogoutModalOpen: isOpen }),
}));
