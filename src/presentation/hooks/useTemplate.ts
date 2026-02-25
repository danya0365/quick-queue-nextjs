import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTemplate = 'retroTechMagazine' | 'editorial' | 'classic';

interface AppTemplateState {
  template: AppTemplate;
  setTemplate: (template: AppTemplate) => void;
  toggleTemplate: () => void;
}

export const useTemplate = create<AppTemplateState>()(
  persist(
    (set) => ({
      template: 'retroTechMagazine', // โทนค่าเริ่มต้น
      setTemplate: (template) => set({ template }),
      toggleTemplate: () =>
        set((state) => {
          const templates: AppTemplate[] = ['retroTechMagazine', 'editorial', 'classic'];
          const nextIndex = (templates.indexOf(state.template) + 1) % templates.length;
          return { template: templates[nextIndex] };
        }),
    }),
    {
      name: 'app-template-storage', // บันทึก Theme ลง localStorage เพื่อจำค่าไว้
    }
  )
);
