"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GlassCard } from "./glass-card";

interface AIRoastProps {
  userName?: string;
}

const roasts = [
  "your listening habits are so predictable, even your smart toaster knows what you'll play next",
  "I've seen more diverse music taste in a elevator playlist",
  "your Discover Weekly must be having an identity crisis",
  "you listen to so much of the same artist, they should probably name an album after you",
  "your music taste is like comfort food - familiar, predictable, and occasionally questionable",
  "Spotify's algorithm thinks you're being held hostage by one artist",
  "your top genre is so dominant, even the recommendations are confused",
];

export function AIRoast({ userName = "Music Lover" }: AIRoastProps) {
  const [currentRoastIndex, setCurrentRoastIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentRoast = `"${userName}, ${roasts[currentRoastIndex]}"`;

  // Typing effect for current roast
  useEffect(() => {
    let charIndex = 0;
    const typeChar = () => {
      if (charIndex < currentRoast.length) {
        setDisplayedText((prev) => currentRoast.substring(0, charIndex + 1));
        charIndex++;
        typingTimeoutRef.current = setTimeout(typeChar, 50);
      } else {
        setIsTyping(false);
        // Wait 3 seconds then switch to next roast
        resetTimeoutRef.current = setTimeout(() => {
          setCurrentRoastIndex((prev) => (prev + 1) % roasts.length);
        }, 3000);
      }
    };

    typeChar();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [currentRoastIndex]); // Only depend on currentRoastIndex

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-neon-pink" />
        <h2 className="text-2xl font-bold">Roast Generator</h2>
      </div>

      <GlassCard variant="gradient" className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            <Sparkles className="w-12 h-12 text-neon-pink" />
          </motion.div>
          <div className="flex-1">
            <p className="text-sm text-text-secondary mb-1">AI-powered music roast</p>
            <div className="flex gap-1">
              {roasts.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentRoastIndex
                      ? "w-8 bg-neon-pink"
                      : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <motion.div
          key={currentRoastIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xl text-white leading-relaxed italic">
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="inline-block w-0.5 h-5 bg-neon-pink ml-1"
              />
            )}
          </p>
        </motion.div>
      </GlassCard>
    </section>
  );
}