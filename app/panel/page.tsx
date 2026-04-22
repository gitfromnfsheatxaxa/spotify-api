'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useCurrentUser, useTopArtists, useTopTracks, useGenreStats, useRecentlyPlayed } from '@/lib/hooks/use-spotify-data';
import { Loader2, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TimeRangeTabs } from '@/components/dashboard/time-range-tabs';
import { UserInfo } from '@/components/dashboard/user-info';
import { RecentlyPlayed } from '@/components/dashboard/recently-played';
import { TopArtists } from '@/components/dashboard/top-artists';
import { TopTracks } from '@/components/dashboard/top-tracks';
import { GenreChart } from '@/components/dashboard/genre-chart';
import { ObsessionScore } from '@/components/dashboard/obsession-score';
import { AIRoast } from '@/components/dashboard/ai-roast';

export default function DashboardPage() {
  const { login } = useAuthStore();
  const { locale, timeRange, setTimeRange } = useDashboardStore();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const router = useRouter();

  const translations: Record<string, Record<string, string>> = {
    en: {
      welcome: 'Welcome back!',
      loading: 'Loading your stats...',
      topArtists: 'Top Artists',
      topTracks: 'Top Tracks',
      genreDistribution: 'Genre Distribution',
      noData: 'No data available',
      back: 'Back to Home',
    },
    ru: {
      welcome: 'С возвращением!',
      loading: 'Загрузка статистики...',
      topArtists: 'Топ исполнителей',
      topTracks: 'Топ треков',
      genreDistribution: 'Распределение жанров',
      noData: 'Нет данных',
      back: 'На главную',
    },
    uz: {
      welcome: 'Xush kelibsiz!',
      loading: 'Statistika yuklanmoqda...',
      topArtists: 'Eng yaxshi ijrochilar',
      topTracks: 'Eng yaxshi treklar',
      genreDistribution: 'Janrlar taqsimoti',
      noData: 'Ma\'lumot yo\'q',
      back: 'Bosh sahifaga',
    },
  };

  const t = translations[locale] || translations.en;

  // Check auth status via API
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[Panel Page] Checking auth session...');
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        console.log('[Panel Page] Auth session response:', data);

        if (data.isAuthenticated && data.user) {
          // Update auth store with user data
          login(data.user, {
            access_token: '',
            token_type: 'Bearer',
            scope: '',
            expires_in: 3600,
          });
          setIsAuthInitialized(true);
          console.log('[Panel Page] User authenticated:', data.user.display_name);
        } else {
          // Not authenticated - redirect to login
          console.log('[Panel Page] User not authenticated, would redirect to /login');
          // window.location.href = '/login'; // Commented for debugging
        }
      } catch (error) {
        console.error('[Panel Page] Failed to check auth session:', error);
        // window.location.href = '/login'; // Commented for debugging
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
  const { data: recentlyPlayed } = useRecentlyPlayed({
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const shareData = {
                  topArtist: artists?.[0]?.name || 'Unknown',
                  topGenre: genres?.[0]?.genre || 'Unknown',
                  totalArtists: artists?.length || 0,
                  obsessionScore: 75,
                };
                const encodedData = encodeURIComponent(JSON.stringify(shareData));
                router.push(`/share/1?data=${encodedData}`);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full btn-glass-accent"
            >
              <Share2 className="w-4 h-4" />
              Share Stats
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </Link>
          </div>
        </motion.div>

        {/* Time Range Tabs */}
        <TimeRangeTabs />

        {/* Recently Played */}
        <RecentlyPlayed tracks={recentlyPlayed || []} />

        {/* Top Artists */}
        <TopArtists artists={artists || []} />

        {/* Top Tracks */}
        <TopTracks tracks={tracks || []} />

        {/* Genre Distribution */}
        <GenreChart genres={genres || []} />

        {/* Obsession Score */}
        <ObsessionScore
          score={{
            overall: 75,
            diversity: 68,
            popularity: 82,
            loyalty: 71,
            labels: ['Eclectic', 'Weekend Warrior', 'Deep Diver'],
          }}
        />

        {/* AI Roast */}
        <AIRoast userName={user?.display_name} />
      </div>
    </div>
  );
}





