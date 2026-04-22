"use client";

import { motion } from "framer-motion";
import { Play, Pause, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDuration } from "@/lib/utils/format";
import type { SpotifyRecentlyPlayed } from "@/lib/types/spotify";
import { GlassCard } from "./glass-card";

interface RecentlyPlayedProps {
  tracks: SpotifyRecentlyPlayed[];
  onPlay?: (track: SpotifyRecentlyPlayed) => void;
}

export function RecentlyPlayed({ tracks, onPlay }: RecentlyPlayedProps) {
  if (!tracks || tracks.length === 0) {
    return (
      <GlassCard variant="default" className="p-8 text-center">
        <p className="text-text-secondary">No recently played tracks available</p>
      </GlassCard>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <SkipForward className="w-6 h-6 text-neon-cyan" />
        <h2 className="text-2xl font-bold">Recently Played</h2>
      </div>

      <div className="space-y-3">
        {tracks.slice(0, 5).map((item, index) => {
          const track = item.track;
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard
                variant="default"
                hover
                className="p-3"
                style={{ marginBottom: 0 }}
              >
                <div className="flex items-center gap-4">
                  {/* Track Image */}
                  <div className="relative shrink-0">
                    <img
                      src={track.album.images[0]?.url || "/default-album.png"}
                      alt={track.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    {/* Play overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
                      whileHover={{ opacity: 1 }}
                    >
                      <Play className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{track.name}</p>
                    <p className="text-sm text-text-secondary truncate">
                      {track.artists.map((a) => a.name).join(", ")}
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      {formatDuration(track.duration_ms)} •{" "}
                      {new Date(item.played_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Play Button */}
                  <motion.button
                    onClick={() => onPlay?.(item)}
                    className="shrink-0 p-3 rounded-full bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/30 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="w-5 h-5 text-neon-cyan" />
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}