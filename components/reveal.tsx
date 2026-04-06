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
 * Staggered scroll reveal. Direct children should be `StaggerItem` / `MotionRevealItem`
 * (each is a `motion.div` with `fadeUp` variants) so `staggerChildren` from `staggerContainer` applies.
 * Plain `Reveal` here will not stagger — use `StaggerItem` for each row/card.
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
