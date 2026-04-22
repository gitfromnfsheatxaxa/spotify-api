"use client";

import { motion } from "framer-motion";
import { Zap, Brain, Heart, Star } from "lucide-react";
import type { ObsessionScore } from "@/lib/types/app";
import { GlassCard } from "./glass-card";

interface ObsessionScoreProps {
  score: ObsessionScore;
}

const icons = {
  overall: Zap,
  diversity: Brain,
  popularity: Star,
  loyalty: Heart,
};

const colors = {
  overall: "from-yellow-400 to-orange-500",
  diversity: "from-neon-cyan to-neon-purple",
  popularity: "from-neon-pink to-red-500",
  loyalty: "from-neon-green to-neon-cyan",
};

export function ObsessionScore({ score }: ObsessionScoreProps) {
  if (!score) {
    return null;
  }

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-neon-green";
    if (value >= 60) return "text-neon-cyan";
    if (value >= 40) return "text-neon-pink";
    return "text-yellow-500";
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-neon-purple" />
        <h2 className="text-2xl font-bold">Spotify Obsession Score</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="gradient" className="p-6 text-center">
            <div className="relative">
              <div className={`text-5xl font-bold bg-gradient-to-r ${colors.overall} bg-clip-text text-transparent`}>
                {score.overall}
              </div>
              <div className="text-sm text-text-secondary mt-1">Overall</div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Diversity Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <Brain className={`w-8 h-8 ${getScoreColor(score.diversity)}`} />
            </div>
            <div className="text-3xl font-bold text-white">{score.diversity}</div>
            <div className="text-sm text-text-secondary mt-1">Diversity</div>
            {/* Progress bar */}
            <div className="h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score.diversity}%` }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Popularity Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <Star className={`w-8 h-8 ${getScoreColor(score.popularity)}`} />
            </div>
            <div className="text-3xl font-bold text-white">{score.popularity}</div>
            <div className="text-sm text-text-secondary mt-1">Popularity</div>
            <div className="h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score.popularity}%` }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-neon-pink to-red-500"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Loyalty Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <Heart className={`w-8 h-8 ${getScoreColor(score.loyalty)}`} />
            </div>
            <div className="text-3xl font-bold text-white">{score.loyalty}</div>
            <div className="text-sm text-text-secondary mt-1">Loyalty</div>
            <div className="h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score.loyalty}%` }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
              />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Labels */}
      {score.labels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <GlassCard variant="default" className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {score.labels.map((label, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-neon-cyan/20 text-neon-cyan text-sm font-medium"
                >
                  {label}
                </span>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </section>
  );
}