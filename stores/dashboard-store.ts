import { create } from 'zustand';
import type { TimeRange, Locale } from '@/lib/types/app';

interface DashboardState {
  timeRange: TimeRange;
  locale: Locale;
  setTimeRange: (timeRange: TimeRange) => void;
  setLocale: (locale: Locale) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  timeRange: 'short_term',
  locale: 'en',
  setTimeRange: (timeRange) => set({ timeRange }),
  setLocale: (locale) => set({ locale }),
}));