import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTheme = 'classic' | 'retro';

interface AppThemeState {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

export const useAppTheme = create<AppThemeState>()(
  persist(
    (set) => ({
      theme: 'classic', // โทนค่าเริ่มต้น
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'classic' ? 'retro' : 'classic' })),
    }),
    {
      name: 'app-theme-storage', // บันทึก Theme ลง localStorage เพื่อจำค่าไว้
    }
  )
);
