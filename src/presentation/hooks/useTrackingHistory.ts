import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TrackingEntry {
  code: string;
  customerName: string;
  createdAt: string; // ISO date string
}

interface TrackingHistoryState {
  entries: TrackingEntry[];
  addEntry: (entry: Omit<TrackingEntry, 'createdAt'>) => void;
  removeEntry: (code: string) => void;
  clearAll: () => void;
}

export const useTrackingHistory = create<TrackingHistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => {
          // Avoid duplicates
          if (state.entries.some((e) => e.code === entry.code)) return state;
          return {
            entries: [
              { ...entry, createdAt: new Date().toISOString() },
              ...state.entries,
            ].slice(0, 50), // Keep max 50 entries
          };
        }),
      removeEntry: (code) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.code !== code),
        })),
      clearAll: () => set({ entries: [] }),
    }),
    {
      name: 'qq-tracking-history', // localStorage key
    }
  )
);
