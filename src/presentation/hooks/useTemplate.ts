import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTemplate = 'classic' | 'retroTechMagazine';

interface AppTemplateState {
  template: AppTemplate;
  setTemplate: (template: AppTemplate) => void;
  toggleTemplate: () => void;
}

export const useTemplate = create<AppTemplateState>()(
  persist(
    (set) => ({
      template: 'classic', // โทนค่าเริ่มต้น
      setTemplate: (template) => set({ template }),
      toggleTemplate: () =>
        set((state) => ({ template: state.template === 'classic' ? 'retroTechMagazine' : 'classic' })),
    }),
    {
      name: 'app-template-storage', // บันทึก Theme ลง localStorage เพื่อจำค่าไว้
    }
  )
);
