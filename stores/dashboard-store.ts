import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimeRange, Locale } from '@/lib/types/app';

interface DashboardState {
  timeRange: TimeRange;
  locale: Locale;
  activeFilter: string | null;
  isLoading: boolean;
  error: string | null;
  setTimeRange: (timeRange: TimeRange) => void;
  setLocale: (locale: Locale) => void;
  setActiveFilter: (filter: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      timeRange: 'short_term',
      locale: 'en',
      activeFilter: null,
      isLoading: false,
      error: null,
      setTimeRange: (timeRange) => set({ timeRange }),
      setLocale: (locale) => set({ locale }),
      setActiveFilter: (filter) => set({ activeFilter: filter }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        timeRange: state.timeRange,
        locale: state.locale,
      }),
    }
  )
);
