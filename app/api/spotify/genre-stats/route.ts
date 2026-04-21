import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { TimeRange, GenreStats } from '@/lib/types/app';
import type { SpotifyTrack, SpotifyArtist } from '@/lib/types/spotify';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token');

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const timeRange = (searchParams.get('time_range') as TimeRange) || 'short_term';

  try {
    // Fetch top tracks with artists (need 50 for good genre stats)
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    const tracks: SpotifyTrack[] = data.items;

    // Calculate genre stats from tracks
    const genreMap = new Map<string, { count: number; artists: Set<string> }>();

    tracks.forEach((track) => {
      track.artists.forEach((artist: SpotifyArtist) => {
        if (artist.genres) {
          artist.genres.forEach((genre: string) => {
            const existing = genreMap.get(genre) || { count: 0, artists: new Set() };
            existing.count++;
            existing.artists.add(artist.name);
            genreMap.set(genre, existing);
          });
        }
      });
    });

    const total = tracks.length;
    const stats: GenreStats[] = Array.from(genreMap.entries())
      .map(([genre, data]) => ({
        genre,
        count: data.count,
        percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
        top_artists: Array.from(data.artists).slice(0, 3),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching genre stats:', error);
    return NextResponse.json({ error: 'Failed to fetch genre stats' }, { status: 500 });
  }
}
