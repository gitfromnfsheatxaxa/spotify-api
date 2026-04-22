import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get('spotify_access_token');
  const userCookie = cookieStore.get('spotify_user');
  
  console.log('[Session API] Access token cookie:', accessToken ? 'FOUND' : 'MISSING');
  console.log('[Session API] User cookie:', userCookie ? 'FOUND' : 'MISSING');
  console.log('[Session API] All cookie names:', cookieStore.getAll().map(c => c.name));

  if (!accessToken || !userCookie) {
    console.log('[Session API] Returning not authenticated due to missing cookies');
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
    });
  }

  try {
    const userData = JSON.parse(decodeURIComponent(userCookie.value));
    console.log('[Session API] User authenticated:', userData.display_name);
    return NextResponse.json({
      isAuthenticated: true,
      user: userData,
    });
  } catch (e) {
    console.error('[Session API] Failed to parse user cookie:', e);
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
    });
  }
}
