"use client";

import { motion, useReducedMotion } from "motion/react";
import { Counter } from "./Counter";
import { staggerContainer, staggerItem } from "./Reveal";

type StatItem = {
  /** Pre-rendered display node (use this for non-numeric values like "Jun 2026"). */
  display?: React.ReactNode;
  /** Numeric value to count up to. Used when `display` is not provided. */
  count?: number;
  /** Decimals to keep in the counter. */
  decimals?: number;
  /** Suffix appended after the counter, e.g. "K+" or " / 4.0". */
  suffix?: string;
  label: string;
};

const stats: StatItem[] = [
  { display: "Jun 2026", label: "Graduating UCSB" },
  { count: 3.6, decimals: 1, suffix: " / 4.0", label: "GPA" },
  { count: 2, label: "Hackathon wins" },
  { count: 50, suffix: "K+", label: "Records cleaned" },
];

export function Stats() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="At a glance"
      className="border-t border-subtle py-12"
    >
      <motion.dl
        variants={reduce ? undefined : staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        className="grid grid-cols-2 gap-y-8 sm:grid-cols-4"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={reduce ? undefined : staggerItem}
            className="flex flex-col"
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {s.label}
            </dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
              {s.display ?? (
                <Counter
                  to={s.count ?? 0}
                  decimals={s.decimals}
                  suffix={s.suffix}
                />
              )}
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  );
}
