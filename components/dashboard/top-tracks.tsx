"use client";

import { motion } from "framer-motion";
import { Play, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDuration } from "@/lib/utils/format";
import type { SpotifyTrack } from "@/lib/types/spotify";
import { GlassCard } from "./glass-card";

interface TopTracksProps {
  tracks: SpotifyTrack[];
  onPlay?: (track: SpotifyTrack) => void;
}

function handlePlayTrack(track: SpotifyTrack) {
  // Open Spotify web player for the track
  if (track.external_urls?.spotify) {
    window.open(track.external_urls.spotify, '_blank');
  }
}

export function TopTracks({ tracks, onPlay }: TopTracksProps) {
  if (!tracks || tracks.length === 0) {
    return (
      <GlassCard variant="default" className="p-8 text-center">
        <p className="text-text-secondary">No track data available</p>
      </GlassCard>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-neon-pink" />
        <h2 className="text-2xl font-bold">Top Tracks</h2>
      </div>

      <div className="space-y-3">
        {tracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard
              variant={index === 0 ? "accent" : "default"}
              hover
              className="p-4"
              style={{ marginBottom: 0 }}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div
                  className={cn(
                    "text-2xl font-bold w-8 text-center",
                    index === 0
                      ? "text-yellow-400"
                      : index === 1
                      ? "text-gray-400"
                      : index === 2
                      ? "text-orange-400"
                      : "text-text-tertiary"
                  )}
                >
                  {index + 1}
                </div>

                {/* Track Image */}
                <div className="relative shrink-0">
                  <img
                    src={track.album.images[0]?.url || "/default-album.png"}
                    alt={track.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">👑</span>
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{track.name}</p>
                  <p className="text-sm text-text-secondary truncate">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    Popularity: {track.popularity}/100
                  </p>
                </div>

                {/* Duration */}
                <div className="text-sm text-text-tertiary mr-2">
                  {formatDuration(track.duration_ms)}
                </div>

                {/* Play Button */}
                <motion.button
                  onClick={() => onPlay ? onPlay(track) : handlePlayTrack(track)}
                  className="shrink-0 p-2 rounded-full bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink/30 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="w-4 h-4 text-neon-pink" />
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}