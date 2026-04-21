import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SpotifyUser, AccessToken } from '@/lib/types/spotify';

interface AuthState {
  user: SpotifyUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: SpotifyUser, tokens: AccessToken) => void;
  logout: () => void;
  updateToken: (accessToken: string, refreshToken?: string) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, tokens) =>
        set({
          user,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? null,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
      initializeAuth: () => {
        // Check for existing auth cookie and restore session
        if (typeof document === 'undefined') return;

        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('spotify_user='));

        if (userCookie) {
          try {
            const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
            set({
              user: userData,
              accessToken: userData.access_token || null,
              refreshToken: userData.refresh_token || null,
              isAuthenticated: true,
            });
          } catch (e) {
            console.error('Failed to restore auth from cookie:', e);
          }
        }
      },
      updateToken: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken: refreshToken ?? null,
        }),
    }),
    {
      name: 'spotify-auth-storage',
    }
  )
);
