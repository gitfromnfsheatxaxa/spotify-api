"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Music } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SpotifyArtist } from "@/lib/types/spotify";
import { GlassCard } from "./glass-card";

interface TopArtistsProps {
  artists: SpotifyArtist[];
}

export function TopArtists({ artists }: TopArtistsProps) {
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(null);

  if (!artists || artists.length === 0) {
    return (
      <GlassCard variant="default" className="p-8 text-center">
        <p className="text-text-secondary">No artist data available</p>
      </GlassCard>
    );
  }

  return (
    <>
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Music className="w-6 h-6 text-neon-purple" />
          <h2 className="text-2xl font-bold">Top Artists</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <GlassCard
                variant={index === 0 ? "accent" : "default"}
                hover
                className="p-4 cursor-pointer"
                onClick={() => setSelectedArtist(artist)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <img
                      src={artist.images[0]?.url || "/default-avatar.png"}
                      alt={artist.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-neon-cyan/30"
                    />
                    {index === 0 && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <span className="text-xs">👑</span>
                      </motion.div>
                    )}
                  </div>
                  <p className="font-medium text-white text-sm truncate w-full">
                    {artist.name}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">#{index + 1}</p>
                  <p className="text-xs text-text-secondary mt-2">
                    {artist.followers?.total?.toLocaleString() ?? 'N/A'} followers
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Artist Detail Modal */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedArtist(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard variant="gradient" className="p-6 max-w-md w-full">
                <button
                  onClick={() => setSelectedArtist(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>

                <div className="flex flex-col items-center text-center">
                  <img
                    src={selectedArtist.images[0]?.url || "/default-avatar.png"}
                    alt={selectedArtist.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-neon-cyan/50 mb-4"
                  />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedArtist.name}
                  </h3>
                  <p className="text-text-secondary mb-4">
                    {selectedArtist.followers?.total?.toLocaleString() ?? 'N/A'} followers
                  </p>

                  {/* Genres */}
                  {selectedArtist.genres?.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {selectedArtist.genres.slice(0, 5).map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan text-xs capitalize"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Spotify Link */}
                  <a
                    href={`https://open.spotify.com/artist/${selectedArtist.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan transition-all"
                  >
                    <span>View on Spotify</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}