import { create } from 'zustand';
import type { VisualFeature } from '@/lib/types/app';

interface VisualState {
  activeFeature: string | null;
  features: VisualFeature[];
  setActiveFeature: (id: string | null) => void;
  toggleFeature: (id: string) => void;
}

const defaultFeatures: VisualFeature[] = [
  { id: 'obscurity-iceberg', name: 'Obscurity Iceberg', description: 'Discover your hidden gems', icon: '🧊', enabled: true },
  { id: 'festival-poster', name: 'Festival Poster', description: 'Create your festival lineup', icon: '🎪', enabled: true },
  { id: 'receiptify', name: 'Receiptify', description: 'Your listening receipt', icon: '🧾', enabled: true },
  { id: 'mood-radar', name: 'Mood Radar', description: 'Analyze your listening mood', icon: '📡', enabled: true },
  { id: 'genre-globe', name: 'Genre Globe', description: 'Explore your genre universe', icon: '🌍', enabled: true },
];

export const useVisualStore = create<VisualState>((set) => ({
  activeFeature: null,
  features: defaultFeatures,
  setActiveFeature: (id) => set({ activeFeature: id }),
  toggleFeature: (id) =>
    set((state) => ({
      features: state.features.map((f) =>
        f.id === id ? { ...f, enabled: !f.enabled } : f
      ),
    })),
}));