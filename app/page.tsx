'use client';

import { motion } from 'framer-motion';
import { Music, BarChart3, Zap, Share2, Sparkles, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useDashboardStore } from '@/stores/dashboard-store';

const features = [
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Comprehensive stats on your listening habits across all time ranges',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Sparkles,
    title: 'Insane Visuals',
    description: 'Obscurity Iceberg, Festival Posters, Receiptify - share-worthy creations',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Top Rankings',
    description: 'Your top artists, tracks, and genres with interactive breakdowns',
    gradient: 'from-green-400 to-cyan-500',
  },
  {
    icon: Share2,
    title: 'One-Tap Sharing',
    description: 'Generate Instagram Stories and download stunning visuals instantly',
    gradient: 'from-orange-400 to-red-500',
  },
];

export default function LandingPage() {
  const { locale } = useDashboardStore();
  const { isAuthenticated } = useAuthStore();
  
  const translations: Record<string, Record<string, string>> = {
    en: {
      login: 'Login with Spotify',
      description: 'Connect your Spotify account to unlock your personalized stats and insights',
      explore: 'Explore Features',
      getStarted: 'Get Started Free',
      readyTitle: 'Ready to Dive In?',
      readyDesc: 'Connect your Spotify account and discover the hidden stories in your listening history',
    },
    ru: {
      login: 'Войти через Spotify',
      description: 'Подключите свой аккаунт Spotify, чтобы получить персональную статистику и аналитику',
      explore: 'Изучить функции',
      getStarted: 'Начать бесплатно',
      readyTitle: 'Готовы погрузиться?',
      readyDesc: 'Подключите свой аккаунт Spotify и откройте для себя скрытые истории в вашей музыкальной истории',
    },
    uz: {
      login: 'Spotify orqali kirish',
      description: 'Shaxsiy statistika va tahlillarni ochish uchun Spotify hisobingizni ulang',
      explore: 'Imkoniyatlarni o\'rganish',
      getStarted: 'Bepul boshlash',
      readyTitle: 'Cho\'kishga tayyormisiz?',
      readyDesc: 'Spotify hisobingizni ulang va tinglash tarixingizdagi yashirin hikoyalarni kashf eting',
    },
  };
  
  const t = translations[locale] || translations.en;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-5xl sm:text-7xl font-bold mb-6">
              <span className="gradient-text">Your Spotify</span>
              <br />
              <span className="text-4xl sm:text-6xl text-white">Stats Universe</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
              {t.description}
            </p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <a
                href="/login"
                className="neon-button px-8 py-4 text-lg"
              >
                {t.login}
              </a>
              <a
                href="#features"
                className="px-8 py-4 rounded-full glass-card hover:bg-white/10 transition-colors"
              >
                {t.explore}
              </a>
            </motion.div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </div>
      </section>

      {/* Stats Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: '10K+', label: 'Users' },
              { value: '50M+', label: 'Tracks Analyzed' },
              { value: '100+', label: 'Countries' },
              { value: '∞', label: 'Vibes' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center"
              >
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">Features That Pop</h2>
            <p className="text-text-secondary">Everything you need to understand your music taste</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-6 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold gradient-text mb-4">{t.readyTitle}</h2>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                {t.readyDesc}
              </p>
              <a
                href="/login"
                className="neon-button px-10 py-4 text-lg inline-block"
              >
                {t.getStarted}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-text-tertiary text-sm">
          <p>© 2026 Spotify Stats Universe. Not affiliated with Spotify AB.</p>
        </div>
      </footer>
    </div>
  );
}