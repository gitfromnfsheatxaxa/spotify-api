import axios from 'axios';
import type {
  SpotifyUser,
  SpotifyTrack,
  SpotifyArtist,
  SpotifyRecentlyPlayed,
  SpotifyPaging,
  AccessToken,
} from '@/lib/types/spotify';
import type { TimeRange, GenreStats } from '@/lib/types/app';

const BASE_URL = 'https://api.spotify.com/v1';

class SpotifyAPI {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const response = await axios.get<T>(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return response.data;
  }

  async getCurrentUser(): Promise<SpotifyUser> {
    return this.request<SpotifyUser>('/me');
  }

  async getRecentlyPlayed(limit = 20): Promise<SpotifyRecentlyPlayed[]> {
    const data = await this.request<SpotifyPaging<SpotifyRecentlyPlayed>>(
      '/me/player/recently-played',
      { limit: limit.toString() }
    );
    return data.items;
  }

  async getTopArtists(
    timeRange: TimeRange = 'short_term',
    limit = 10
  ): Promise<SpotifyArtist[]> {
    const data = await this.request<SpotifyPaging<SpotifyArtist>>(
      '/me/top/artists',
      {
        time_range: timeRange,
        limit: limit.toString(),
      }
    );
    return data.items;
  }

  async getTopTracks(
    timeRange: TimeRange = 'short_term',
    limit = 10
  ): Promise<SpotifyTrack[]> {
    const data = await this.request<SpotifyPaging<SpotifyTrack>>(
      '/me/top/tracks',
      {
        time_range: timeRange,
        limit: limit.toString(),
      }
    );
    return data.items;
  }

  calculateGenreStats(tracks: SpotifyTrack[]): GenreStats[] {
    const genreMap = new Map<string, { count: number; artists: Set<string> }>();

    tracks.forEach((track) => {
      track.artists.forEach((artist) => {
        artist.genres.forEach((genre) => {
          const existing = genreMap.get(genre) || { count: 0, artists: new Set() };
          existing.count++;
          existing.artists.add(artist.name);
          genreMap.set(genre, existing);
        });
      });
    });

    const total = tracks.length;
    const stats: GenreStats[] = Array.from(genreMap.entries())
      .map(([genre, data]) => ({
        genre,
        count: data.count,
        percentage: Math.round((data.count / total) * 100),
        top_artists: Array.from(data.artists).slice(0, 3),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }
}

export default new SpotifyAPI();