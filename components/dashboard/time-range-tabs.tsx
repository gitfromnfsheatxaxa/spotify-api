"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { TimeRange } from "@/lib/types/app";
import { useDashboardStore } from "@/stores/dashboard-store";

interface TimeRangeTabsProps {
  onTimeRangeChange?: (range: TimeRange) => void;
}

const translations: Record<string, Record<TimeRange, string>> = {
  en: {
    short_term: "Last 4 Weeks",
    medium_term: "Last 6 Months",
    long_term: "All Time",
  },
  ru: {
    short_term: "Последние 4 недели",
    medium_term: "Последние 6 месяцев",
    long_term: "За всё время",
  },
  uz: {
    short_term: "Oxirgi 4 hafta",
    medium_term: "Oxirgi 6 oy",
    long_term: "Barcha vaqt",
  },
};

export function TimeRangeTabs({ onTimeRangeChange }: TimeRangeTabsProps) {
  const { locale, timeRange, setTimeRange } = useDashboardStore();

  const tLang = translations[locale] || translations.en;

  const tabs: { value: TimeRange; label: string }[] = [
    { value: "short_term", label: tLang.short_term },
    { value: "medium_term", label: tLang.medium_term },
    { value: "long_term", label: tLang.long_term },
  ];

  const handleTabClick = (range: TimeRange) => {
    setTimeRange(range);
    onTimeRangeChange?.(range);
  };

  return (
    <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
      {tabs.map((tab) => {
        const isActive = timeRange === tab.value;
        return (
          <motion.button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              isActive
                ? "bg-neon-cyan/20 text-neon-cyan ring-2 ring-neon-cyan"
                : "text-text-secondary hover:text-white hover:bg-white/5"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.label}
          </motion.button>
        );
      })}
    </div>
  );
}
