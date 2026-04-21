import { useQuery } from '@tanstack/react-query';
import type { SpotifyUser, SpotifyArtist, SpotifyTrack } from '@/lib/types/spotify';
import type { TimeRange, GenreStats } from '@/lib/types/app';

export function useCurrentUser(options?: { enabled?: boolean }) {
  return useQuery<SpotifyUser>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch('/api/spotify/user');
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch user');
      }
      return response.json();
    },
    enabled: options?.enabled ?? true,
  });
}

export function useTopArtists(timeRange: TimeRange = 'short_term', limit = 10, options?: { enabled?: boolean }) {
  return useQuery<SpotifyArtist[]>({
    queryKey: ['topArtists', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/spotify/top-artists?time_range=${timeRange}&limit=${limit}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch top artists');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useTopTracks(timeRange: TimeRange = 'short_term', limit = 10, options?: { enabled?: boolean }) {
  return useQuery<SpotifyTrack[]>({
    queryKey: ['topTracks', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/spotify/top-tracks?time_range=${timeRange}&limit=${limit}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch top tracks');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useGenreStats(timeRange: TimeRange = 'short_term', options?: { enabled?: boolean }) {
  return useQuery<GenreStats[]>({
    queryKey: ['genreStats', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/spotify/genre-stats?time_range=${timeRange}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch genre stats');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}
