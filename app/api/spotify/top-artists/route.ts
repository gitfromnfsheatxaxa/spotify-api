import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { TimeRange } from '@/lib/types/app';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token');

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const timeRange = (searchParams.get('time_range') as TimeRange) || 'short_term';
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
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
    return NextResponse.json(data.items);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: 500 });
  }
}
