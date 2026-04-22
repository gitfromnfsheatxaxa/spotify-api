'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Loader2, Sparkles } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils/cn';
import type { Locale } from '@/lib/types/app';

const locales: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'uz', label: 'O\'zbekcha', flag: '🇺🇿' },
];

const translations: Record<Locale, {
  title: string;
  subtitle: string;
  login: string;
  loginLoading: string;
  permissions: string[];
  footer: string;
}> = {
  en: {
    title: 'Your Music, Your Stats',
    subtitle: 'Connect Spotify to unlock personalized analytics and stunning visuals',
    login: 'Continue with Spotify',
    loginLoading: 'Connecting...',
    permissions: [
      'View your top artists and tracks',
      'Access your listening history',
      'Generate shareable visuals',
    ],
    footer: 'We respect your privacy. Your data is never shared.',
  },
  ru: {
    title: 'Ваша музыка, ваша статистика',
    subtitle: 'Подключите Spotify для персональной аналитики и визуализации',
    login: 'Продолжить с Spotify',
    loginLoading: 'Подключение...',
    permissions: [
      'Просмотр ваших топ-исполнителей и треков',
      'Доступ к истории прослушиваний',
      'Создание визуализаций для обмена',
    ],
    footer: 'Мы уважаем вашу конфиденциальность. Ваши данные никогда не передаются.',
  },
  uz: {
    title: 'Musiqangiz, statistikingiz',
    subtitle: 'Shaxsiy analitika va vizualizatsiya uchun Spotify ulang',
    login: 'Spotify bilan davom etish',
    loginLoading: 'Ulanmoqda...',
    permissions: [
      'Eng yaxshi ijrochilar va treklarni ko\'rish',
      'Tinglash tarixiga kirish',
      'Ulashish uchun vizualizatsiya yaratish',
    ],
    footer: 'Biz maxfiylikni hurmat qilamiz. Ma\'lumotlaringiz hech qachon oshkor qilinmaydi.',
  },
};

export default function LoginPage() {
  const { locale } = useDashboardStore();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  
  const t = translations[locale] || translations.en;

  useEffect(() => {
    setShowParticles(true);
  }, []);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // window.location.href = '/panel'; // Commented for debugging
      console.log('[Login Page] User is authenticated, would redirect to /panel');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    setIsLoading(true);
    
    const spotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'your-client-id';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spotify-api-flax.vercel.app';
    const redirectUri = `${appUrl}/api/auth/callback`;
    const scopes = [
      'user-top-read',
      'user-read-recently-played',
      'user-read-private',
      'playlist-read-private',
    ].join(' ');
    
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${spotifyClientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        <div className="absolute inset-0 animated-grid" />
        
        {/* Gradient Orbs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showParticles ? 0.4 : 0, scale: showParticles ? 1 : 0.8 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showParticles ? 0.3 : 0, scale: showParticles ? 1 : 0.8 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-neon-cyan to-neon-green rounded-full blur-3xl"
        />
        
        {/* Spotify Green Accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showParticles ? 0.15 : 0 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#1DB954] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Language Switcher */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 right-6 z-50"
      >
        <div className="glass-card p-2 rounded-full flex gap-2">
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => useDashboardStore.getState().setLocale(loc.code)}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all',
                locale === loc.code 
                  ? 'bg-white/20 ring-2 ring-neon-cyan' 
                  : 'hover:bg-white/10'
              )}
              aria-label={`Switch to ${loc.label}`}
            >
              {loc.flag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Login Card */}
          <div className="glass-card p-8 md:p-10 relative overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-pink/5 pointer-events-none" />
            
            {/* Spotify Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#1DB954] to-[#1ed760] flex items-center justify-center shadow-lg shadow-[#1DB954]/30"
            >
              <Music className="w-12 h-12 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold text-center mb-3"
            >
              <span className="gradient-text">{t.title}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-text-secondary text-center mb-8"
            >
              {t.subtitle}
            </motion.p>

            {/* Permissions List */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3 mb-8"
            >
              {t.permissions.map((permission, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm text-text-secondary"
                >
                  <div className="w-5 h-5 rounded-full bg-[#1DB954]/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-[#1DB954]" />
                  </div>
                  {permission}
                </motion.li>
              ))}
            </motion.ul>

            {/* Login Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              onClick={handleLogin}
              disabled={isLoading}
              className={cn(
                'w-full py-4 px-6 rounded-xl font-semibold text-white text-lg transition-all',
                'bg-gradient-to-r from-[#1DB954] to-[#1ed760]',
                'hover:from-[#1ed760] hover:to-[#1DB954]',
                'shadow-lg shadow-[#1DB954]/30',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'relative overflow-hidden group'
              )}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.loginLoading}
                  </>
                ) : (
                  t.login
                )}
              </span>
            </motion.button>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-xs text-text-tertiary text-center mt-6"
            >
              {t.footer}
            </motion.p>
          </div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-text-tertiary">
              Powered by Spotify Web API
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}