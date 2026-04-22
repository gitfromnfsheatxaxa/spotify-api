"use client";

import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/auth-store";
import { useDashboardStore } from "@/stores/dashboard-store";

interface UserInfoProps {
  userName?: string | null;
  userImage?: string | null;
  onLogout?: () => void;
}

export function UserInfo({ userName, userImage, onLogout }: UserInfoProps) {
  const { locale } = useDashboardStore();
  const { isAuthenticated, logout } = useAuthStore();

  const translations: Record<string, { logout: string; unnamed: string }> = {
    en: { logout: "Logout", unnamed: "User" },
    ru: { logout: "Выйти", unnamed: "Пользователь" },
    uz: { logout: "Chiqish", unnamed: "Foydalanuvchi" },
  };

  const t = translations[locale] || translations.en;

  const handleLogout = () => {
    logout();
    onLogout?.();
    window.location.href = "/login";
  };

  const displayName = userName || t.unnamed;
  const displayImage = userImage || null;

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <div className="relative">
        <div
          className={cn(
            "w-10 h-10 rounded-full overflow-hidden border-2 border-neon-cyan",
            "bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20"
          )}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-5 h-5 text-neon-cyan" />
            </div>
          )}
        </div>
        {/* Online indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green rounded-full border-2 border-[#0a0a0f]" />
      </div>

      {/* Name */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white truncate max-w-[120px]">
          {displayName}
        </span>
        <span className="text-xs text-text-secondary">Premium</span>
      </div>

      {/* Logout Button */}
      {isAuthenticated && (
        <motion.button
          onClick={handleLogout}
          className="ml-2 p-2 rounded-lg bg-white/5 hover:bg-neon-pink/20 border border-white/10 hover:border-neon-pink/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={t.logout}
        >
          <LogOut className="w-4 h-4 text-text-secondary hover:text-neon-pink transition-colors" />
        </motion.button>
      )}
    </motion.div>
  );
}