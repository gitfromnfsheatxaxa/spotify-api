"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Palette } from "lucide-react";
import type { GenreStats } from "@/lib/types/app";
import { GlassCard } from "./glass-card";

const COLORS = [
  "#06b6d4", // cyan
  "#a855f7", // purple
  "#ec4899", // pink
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#3b82f6", // blue
  "#8b5cf6", // violet
];

interface GenreChartProps {
  genres: GenreStats[];
}

export function GenreChart({ genres }: GenreChartProps) {
  if (!genres || genres.length === 0) {
    return (
      <GlassCard variant="default" className="p-8 text-center">
        <p className="text-text-secondary">No genre data available</p>
      </GlassCard>
    );
  }

  const chartData = genres.slice(0, 8).map((genre, index) => ({
    name: genre.genre,
    value: genre.percentage,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-6 h-6 text-neon-green" />
        <h2 className="text-2xl font-bold">Genre Distribution</h2>
      </div>

      <GlassCard variant="default" className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke="rgba(0,0,0,0.5)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(10, 10, 15, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats List */}
          <div className="space-y-3">
            {genres.slice(0, 5).map((genre, index) => (
              <motion.div
                key={genre.genre}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-white">
                      {genre.genre}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {genre.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${genre.percentage}%` }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </section>
  );
}