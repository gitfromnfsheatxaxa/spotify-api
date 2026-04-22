import { NextResponse } from 'next/server';
import SpotifyAPI from '@/lib/services/spotify-api';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('[Recently Played API] Starting request...');
    const cookieStore = await cookies();
    const token = cookieStore.get('spotify_access_token');
    
    console.log('[Recently Played API] Token present:', !!token);
    
    if (!token) {
      console.log('[Recently Played API] No token found, returning 401');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    SpotifyAPI.setAccessToken(token.value);
    console.log('[Recently Played API] Fetching from Spotify...');
    const recentlyPlayed = await SpotifyAPI.getRecentlyPlayed();
    
    console.log('[Recently Played API] Received:', recentlyPlayed?.length, 'tracks');
    return NextResponse.json(recentlyPlayed);
  } catch (error) {
    console.error('[Recently Played API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recently played tracks', details: String(error) },
      { status: 500 }
    );
  }
}
