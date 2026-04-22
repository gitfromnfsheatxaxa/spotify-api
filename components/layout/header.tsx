'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils/cn';
import { Languages, LogOut, Music } from 'lucide-react';
import type { Locale } from '@/lib/types/app';

const locales: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'uz', label: 'O\'zbekcha', flag: '🇺🇿' },
];

// Translation dictionary for header
const translations: Record<Locale, { login: string; logout: string }> = {
  en: { login: 'Login with Spotify', logout: 'Logout' },
  ru: { login: 'Войти через Spotify', logout: 'Выйти' },
  uz: { login: 'Spotify orqali kirish', logout: 'Chiqish' },
};

export function Header() {
  const { locale, setLocale } = useDashboardStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = translations[locale] || translations.en;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 rounded-b-2xl rounded-t-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Spotify Stats</span>
          </motion.div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <motion.button
                onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-full btn-glass hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Languages className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm">{locales.find((l) => l.code === locale)?.flag}</span>
              </motion.button>

              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 glass-card rounded-xl overflow-hidden shadow-2xl"
                >
                  {locales.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => {
                        setLocale(loc.code);
                        setShowLangMenu(false);
                      }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors',
                    locale === loc.code && 'bg-white/10'
                  )}
                    >
                      <span className="text-xl">{loc.flag}</span>
                      <span className="text-sm">{loc.label}</span>
                      {locale === loc.code && (
                        <motion.div
                          layoutId="activeLocale"
                          className="ml-auto w-2 h-2 rounded-full bg-neon-cyan"
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* User Info / Login */}
            {isAuthenticated && user ? (
              <motion.div
                className="flex items-center gap-3 px-4 py-2 rounded-full glass"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <img
                  src={user.images[0]?.url || '/default-avatar.png'}
                  alt={user.display_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {user.display_name}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4 text-text-secondary" />
                </button>
              </motion.div>
            ) : (
              <motion.a
                href="/login"
                className="btn-glass-accent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.login}
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}