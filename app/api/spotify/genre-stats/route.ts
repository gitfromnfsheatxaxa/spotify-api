import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { TimeRange, GenreStats } from '@/lib/types/app';

// Fallback genre mapping for artists that don't return genres from the API
const ARTIST_GENRE_MAP: Record<string, string[]> = {
  'cigarettes after sex': ['dream pop', 'indie', 'ambient'],
  'slipknot': ['nu metal', 'metal', 'alternative metal'],
  'eminem': ['hip hop', 'rap', 'detroit hip hop'],
  'tame impala': ['psychedelic rock', 'psychedelic pop', 'indie'],
  'tv girl': ['indie pop', 'indietronica', 'indie'],
  '50 cent': ['hip hop', 'rap', 'east coast hip hop'],
  'metallica': ['metal', 'thrash metal', 'heavy metal'],
  'lady gaga': ['pop', 'dance pop'],
  'freddie dredd': ['phonk', 'hip hop'],
  'doja cat': ['pop', 'hip hop', 'r&b'],
  'dr. dre': ['hip hop', 'rap', 'g funk'],
  'rammstein': ['industrial metal', 'metal', 'neue deutsche harte'],
  'the marías': ['psychedelic pop', 'indie', 'dream pop'],
  'kali uchis': ['r&b', 'neo soul', 'latin'],
  'artik & asti': ['pop', 'dance', 'russian pop'],
  'red abs': ['pop', 'russian pop'],
  'instasamka': ['pop', 'russian pop', 'dance'],
  'morgenshtern': ['hip hop', 'rap', 'russian hip hop'],
  'shadowraze': ['phonk', 'hip hop'],
  'inna': ['dance', 'pop', 'electronic'],
  'ранетки': ['pop rock', 'russian pop', 'teen pop'],
};

export async function GET(request: Request) {
  console.log('[Genre Stats API] Starting request...');
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token');

  console.log('[Genre Stats API] Token present:', !!accessToken);

  if (!accessToken) {
    console.log('[Genre Stats API] No token, returning 401');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const timeRange = (searchParams.get('time_range') as TimeRange) || 'short_term';
  
  console.log('[Genre Stats API] Time range:', timeRange);

  try {
    // Fetch top artists
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      }
    );

    console.log('[Genre Stats API] Artists response status:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    const artists = data.items || [];
    
    console.log('[Genre Stats API] Artists received:', artists.length);

    // Calculate genre stats from artists
    const genreMap = new Map<string, number>();

    artists.forEach((artist: any) => {
      // Try to get genres from API first, then fall back to our mapping
      let genres = artist.genres;
      
      if (!genres || genres.length === 0) {
        // Use fallback mapping
        const artistNameLower = artist.name.toLowerCase();
        const matchedArtist = Object.keys(ARTIST_GENRE_MAP).find(
          key => artistNameLower.includes(key) || key.includes(artistNameLower)
        );
        if (matchedArtist) {
          genres = ARTIST_GENRE_MAP[matchedArtist];
          console.log('[Genre Stats API] Artist:', artist.name, 'genres (fallback):', genres);
        }
      }
      
      if (genres && genres.length > 0) {
        genres.forEach((genre: string) => {
          genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
        });
      }
    });
    
    console.log('[Genre Stats API] Unique genres found:', genreMap.size);

    const total = artists.length;
    const stats: GenreStats[] = Array.from(genreMap.entries())
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        top_artists: [],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    console.log('[Genre Stats API] Returning stats:', stats.length, 'genres');
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[Genre Stats API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch genre stats', details: String(error) }, { status: 500 });
  }
}