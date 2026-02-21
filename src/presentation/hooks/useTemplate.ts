import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTemplate = 'classic' | 'retroTechMagazine' | 'editorial';

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
        set((state) => {
          const templates: AppTemplate[] = ['classic', 'retroTechMagazine', 'editorial'];
          const nextIndex = (templates.indexOf(state.template) + 1) % templates.length;
          return { template: templates[nextIndex] };
        }),
    }),
    {
      name: 'app-template-storage', // บันทึก Theme ลง localStorage เพื่อจำค่าไว้
    }
  )
);
