"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  /** When true, acts as a stagger child (`fadeUp` only) — use inside `StaggerReveal` instead of standalone scroll reveal. */
  item?: boolean;
}

export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  item = false,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  if (item) {
    return (
      <motion.div className={className} variants={fadeUp}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Staggered scroll reveal. Direct children should be `StaggerItem`.
 *
 * On long product grids, `whileInView` alone has left children stuck at
 * opacity 0 on mobile. `animate` on mount covers the common case; `whileInView`
 * still covers sections that start far below the fold.
 */
export function StaggerReveal({ children, className }: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

/** Use inside `StaggerReveal` only — inherits stagger from parent (no own `whileInView`). */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

/** Alias for `StaggerItem` — use as direct children of `StaggerReveal` for staggered `fadeUp` motion. */
export const MotionRevealItem = StaggerItem;
