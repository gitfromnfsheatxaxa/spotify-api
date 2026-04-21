'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useCurrentUser, useTopArtists, useTopTracks, useGenreStats } from '@/lib/hooks/use-spotify-data';
import { Music, TrendingUp, Palette, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDuration } from '@/lib/utils/format';
import type { TimeRange } from '@/lib/types/app';
import Link from 'next/link';

export default function DashboardPage() {
  const { isAuthenticated, login } = useAuthStore();
  const { locale } = useDashboardStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('short_term');
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const translations: Record<string, Record<string, string>> = {
    en: {
      welcome: 'Welcome back!',
      loading: 'Loading your stats...',
      topArtists: 'Top Artists',
      topTracks: 'Top Tracks',
      genreDistribution: 'Genre Distribution',
      shortTerm: 'Last 4 Weeks',
      mediumTerm: 'Last 6 Months',
      longTerm: 'All Time',
      noData: 'No data available',
      back: 'Back to Home',
    },
    ru: {
      welcome: 'С возвращением!',
      loading: 'Загрузка статистики...',
      topArtists: 'Топ исполнителей',
      topTracks: 'Топ треков',
      genreDistribution: 'Распределение жанров',
      shortTerm: 'Последние 4 недели',
      mediumTerm: 'Последние 6 месяцев',
      longTerm: 'За всё время',
      noData: 'Нет данных',
      back: 'На главную',
    },
    uz: {
      welcome: 'Xush kelibsiz!',
      loading: 'Statistika yuklanmoqda...',
      topArtists: 'Eng yaxshi ijrochilar',
      topTracks: 'Eng yaxshi treklar',
      genreDistribution: 'Janrlar taqsimoti',
      shortTerm: 'Oxirgi 4 hafta',
      mediumTerm: 'Oxirgi 6 oy',
      longTerm: 'Barcha vaqt',
      noData: 'Ma\'lumot yo\'q',
      back: 'Bosh sahifaga',
    },
  };

  const t = translations[locale] || translations.en;

  // Check auth status via API
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (data.isAuthenticated && data.user) {
          // Update auth store with user data
          login(data.user, {
            access_token: '',
            token_type: 'Bearer',
            scope: '',
            expires_in: 3600,
          });
          setIsAuthInitialized(true);
        } else {
          // Not authenticated - redirect to login
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Failed to check auth session:', error);
        window.location.href = '/login';
      }
    };

    checkAuth();
  }, [login]);

  // Call data hooks - only run after auth is confirmed
  const { data: user, isLoading: userLoading } = useCurrentUser({
    enabled: isAuthInitialized,
  });
  const { data: artists, isLoading: artistsLoading } = useTopArtists(timeRange, 10, {
    enabled: isAuthInitialized,
  });
  const { data: tracks, isLoading: tracksLoading } = useTopTracks(timeRange, 10, {
    enabled: isAuthInitialized,
  });
  const { data: genres } = useGenreStats(timeRange, {
    enabled: isAuthInitialized,
  });

  // Show loading while initializing auth
  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (userLoading || artistsLoading || tracksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text">{t.welcome}</h1>
            <p className="text-text-secondary mt-1">{user?.display_name}</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Link>
        </motion.div>

        {/* Time Range Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8"
        >
          {[
            { value: 'short_term', label: t.shortTerm },
            { value: 'medium_term', label: t.mediumTerm },
            { value: 'long_term', label: t.longTerm },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as TimeRange)}
              className={cn(
                'px-6 py-2 rounded-full glass-card transition-all',
                timeRange === range.value
                  ? 'bg-neon-cyan/20 ring-2 ring-neon-cyan'
                  : 'hover:bg-white/10'
              )}
            >
              {range.label}
            </button>
          ))}
        </motion.div>

        {/* Top Artists */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Music className="w-6 h-6 text-neon-purple" />
            <h2 className="text-2xl font-bold">{t.topArtists}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {artists?.map((artist, i) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="glass-card p-4 text-center group cursor-pointer"
              >
                <img
                  src={artist.images[0]?.url || '/default-avatar.png'}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover group-hover:scale-110 transition-transform"
                />
                <p className="text-sm font-medium truncate">{artist.name}</p>
                <p className="text-xs text-text-tertiary mt-1">#{i + 1}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Top Tracks */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-neon-pink" />
            <h2 className="text-2xl font-bold">{t.topTracks}</h2>
          </div>
          <div className="space-y-3">
            {tracks?.map((track, i) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="glass-card p-4 flex items-center gap-4 group"
              >
                <span className="text-2xl font-bold text-text-tertiary w-8">
                  {i + 1}
                </span>
                <img
                  src={track.album.images[0]?.url || '/default-album.png'}
                  alt={track.name}
                  className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.name}</p>
                  <p className="text-sm text-text-secondary truncate">
                    {track.artists.map((a) => a.name).join(', ')}
                  </p>
                </div>
                <div className="text-sm text-text-tertiary">
                  {formatDuration(track.duration_ms)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Genre Distribution */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-6 h-6 text-neon-green" />
            <h2 className="text-2xl font-bold">{t.genreDistribution}</h2>
          </div>
          <div className="glass-card p-6">
            {genres?.map((genre, i) => (
              <motion.div
                key={genre.genre}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="mb-4 last:mb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium capitalize">{genre.genre}</span>
                  <span className="text-sm text-text-secondary">{genre.percentage}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${genre.percentage}%` }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                    className={cn(
                      'h-full rounded-full',
                      i === 0 ? 'bg-neon-cyan' :
                      i === 1 ? 'bg-neon-purple' :
                      i === 2 ? 'bg-neon-pink' : 'bg-neon-green'
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}





