"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "left" | "right";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: Direction;
};

const ease = [0.22, 1, 0.36, 1] as const;

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 12 },
  left: { x: -28, y: 0 },
  right: { x: 28, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  className,
  direction = "up",
}: RevealProps) {
  const reduce = useReducedMotion();
  const { x, y } = offsets[direction];

  return (
    <motion.div
      className={className}
      // The server can't read the motion preference, so it always renders the
      // hidden state. Opting out on the client with `initial={false}` would
      // leave that hidden state stuck; instead land straight on the visible
      // one with a zero-duration transition.
      initial={reduce ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

/**
 * Stagger variants whose "hidden" state is already visible when the user
 * prefers reduced motion. Dropping the variants entirely instead would strand
 * the server-rendered hidden styles, leaving the content invisible.
 */
export function staggerVariants(reduce: boolean | null) {
  if (!reduce) return { container: staggerContainer, item: staggerItem };
  const shown = { opacity: 1, y: 0 };
  return {
    container: { hidden: {}, show: {} },
    item: { hidden: shown, show: shown },
  };
}
