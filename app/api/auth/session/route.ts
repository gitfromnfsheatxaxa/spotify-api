import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token');
  const userCookie = cookieStore.get('spotify_user');

  if (!accessToken || !userCookie) {
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
    });
  }

  try {
    const userData = JSON.parse(decodeURIComponent(userCookie.value));
    return NextResponse.json({
      isAuthenticated: true,
      user: userData,
    });
  } catch {
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
    });
  }
}
