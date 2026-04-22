"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "gradient";
  hover?: boolean;
  pulse?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  variant = "default",
  hover = true,
  pulse = false,
  className,
  ...props
}: GlassCardProps) {
  const variantClasses = {
    default: "glass-card",
    accent: "glass-card-accent",
    success: "glass-card-accent border-l-success",
    warning: "glass-card-accent border-l-warning",
    gradient: "glass-card-gradient",
  };

  const baseClasses = cn(
    variantClasses[variant],
    pulse && "pulse-glow",
    className
  );

  return (
    <motion.div
      {...props}
      className={baseClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      whileHover={
        hover
          ? {
              y: -4,
              scale: 1.01,
            }
          : undefined
      }
      whileTap={hover ? { scale: 0.99 } : undefined}
    >
      {children}
    </motion.div>
  );
}
