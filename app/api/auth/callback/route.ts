import { NextResponse } from 'next/server';
import SpotifyAPI from '@/lib/services/spotify-api';

export async function GET(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spotify-api-flax.vercel.app';
  const redirectUri = `${appUrl}/api/auth/callback`;

  const spotifyClientId = process.env.SPOTIFY_CLIENT_ID || '';
  const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
  
  console.log('Auth callback - Client ID:', spotifyClientId ? `${spotifyClientId.substring(0, 8)}...` : 'MISSING');
  console.log('Auth callback - Secret:', spotifyClientSecret ? `${spotifyClientSecret.substring(0, 8)}...` : 'MISSING');
  console.log('Auth callback - Redirect URI:', redirectUri);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    console.log('[Auth Callback] Starting token exchange...');
    console.log('[Auth Callback] Client ID present:', spotifyClientId ? 'YES' : 'NO');
    console.log('[Auth Callback] Secret present:', spotifyClientSecret ? 'YES' : 'NO');
    console.log('[Auth Callback] Redirect URI:', redirectUri);
    console.log('[Auth Callback] Code length:', code?.length);

    // Exchange code for tokens
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    console.log('[Auth Callback] Token response status:', tokenResponse.status);
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[Auth Callback] Spotify token exchange error:', tokenResponse.status, errorText);
      throw new Error(`Failed to exchange code for token: ${errorText}`);
    }

    const tokens = await tokenResponse.json();
    
    console.log('Token exchange successful!');
    console.log('Access token:', tokens.access_token ? tokens.access_token.substring(0, 20) + '...' : 'MISSING');
    console.log('Refresh token:', tokens.refresh_token ? 'PRESENT' : 'MISSING');

    // Get user profile
    console.log('Fetching user profile with token:', tokens.access_token?.substring(0, 20) + '...' || 'NO TOKEN');
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const userError = await userResponse.text();
      console.error('User profile error:', userResponse.status, userError);
      throw new Error(`Failed to get user profile: ${userError}`);
    }

    const user = await userResponse.json();

    // Store tokens in cookies (httpOnly)
    const response = NextResponse.redirect(
      new URL('/panel', request.url)
    );

    const isProduction = process.env.NODE_ENV === 'production';
    
    // Debug: log cookie settings
    console.log('Setting cookies - isProduction:', isProduction);
    console.log('User data:', {
      id: user.id,
      display_name: user.display_name,
    });

    response.cookies.set('spotify_access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    if (tokens.refresh_token) {
      response.cookies.set('spotify_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 31536000, // 1 year
        path: '/',
      });
    }

    // Store user data in a non-httpOnly cookie for client access
    // Only include non-sensitive user info - tokens stay in httpOnly cookies
    const userData = JSON.stringify({
      id: user.id,
      display_name: user.display_name,
      images: user.images,
      country: user.country,
      product: user.product,
    });
    
    console.log('Setting spotify_user cookie with data:', userData.substring(0, 50) + '...');
    
    response.cookies.set('spotify_user', userData, {
      maxAge: 3600,
      path: '/',
      secure: isProduction,
      sameSite: 'lax',
    });

    console.log('Cookies set successfully!');
    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=authentication_failed', request.url)
    );
  }
}