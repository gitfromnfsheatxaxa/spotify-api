export interface SpotifyUser {
  id: string;
  display_name: string;
  images: { url: string; height: number; width: number }[];
  country: string;
  product: 'free' | 'individual' | 'family' | 'student' | 'duo';
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  external_urls: { spotify: string };
  preview_url?: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; height: number; width: number }[];
  followers: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  release_date: string;
  external_urls: { spotify: string };
}

export interface SpotifyRecentlyPlayed {
  track: SpotifyTrack;
  played_at: string;
  context?: SpotifyContext;
}

export interface SpotifyContext {
  type: 'artist' | 'album' | 'playlist' | 'track';
  href: string;
  external_urls: { spotify: string };
}

export interface SpotifyPaging<T> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
}

export interface AccessToken {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}