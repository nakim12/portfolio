"use client";

import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/data/profile";
import { staggerContainer, staggerItem } from "./Reveal";

const { snapshot } = profile;

export function HeroFacts() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial="hidden"
      animate="show"
      className="mt-16 grid gap-6 border-t border-subtle pt-8 sm:grid-cols-3"
    >
      <motion.div variants={reduce ? undefined : staggerItem}>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Education
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">
          {snapshot.education.school}
        </p>
        <p className="text-sm text-muted">
          {snapshot.education.degree}
        </p>
        <p className="mt-1 font-mono text-xs text-muted">
          {snapshot.education.grad} · GPA {snapshot.education.gpa}
        </p>
      </motion.div>

      <motion.div variants={reduce ? undefined : staggerItem}>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Toolkit
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {snapshot.toolkit.map((tool) => (
            <li
              key={tool}
              className="rounded-full border border-subtle bg-surface px-2.5 py-0.5 text-xs"
            >
              {tool}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={reduce ? undefined : staggerItem}>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Currently
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">
          {snapshot.currently.role}
        </p>
        <p className="text-sm text-muted">
          @ {snapshot.currently.company}
        </p>
        <p className="mt-1 font-mono text-xs text-accent">
          ● Active
        </p>
      </motion.div>
    </motion.div>
  );
}
