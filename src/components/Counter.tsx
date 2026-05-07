"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

type Props = {
  to: number;
  /** Number of decimal places to keep (e.g. 1 for `3.6`). */
  decimals?: number;
  /** Suffix appended after the formatted number (e.g. `K+`, ` / 4.0`). */
  suffix?: string;
  /** Animation duration, in seconds. */
  duration?: number;
  className?: string;
};

export function Counter({
  to,
  decimals = 0,
  suffix = "",
  duration = 1.2,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  const motionValue = useMotionValue(reduce ? to : 0);
  const formatted = useTransform(motionValue, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(motionValue, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, reduce, motionValue, to, duration]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{formatted}</motion.span>
      {suffix ? <span>{suffix}</span> : null}
    </span>
  );
}
