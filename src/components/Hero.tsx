"use client";

import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/data/profile";
import { FlowField } from "./FlowField";
import { staggerContainer, staggerItem } from "./Reveal";

const NAME = "Nathan Kim";
const ease = [0.22, 1, 0.36, 1] as const;

const charContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};
const charItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="fixed inset-0 z-0 flex flex-col justify-center overflow-hidden pt-16 pb-24"
    >
      <FlowField className="pointer-events-none absolute inset-0 h-full w-full" />

      <motion.div
        variants={reduce ? undefined : staggerContainer}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-3xl px-6"
      >
        <motion.p
          variants={reduce ? undefined : staggerItem}
          className="font-mono text-xs uppercase tracking-[0.22em] text-muted"
        >
          Hi, I&apos;m
        </motion.p>

        <motion.h1
          variants={reduce ? undefined : charContainer}
          className="mt-4 text-[clamp(3rem,12vw,6.5rem)] font-bold tracking-[-0.04em] leading-[0.95]"
          aria-label={NAME}
        >
          {NAME.split("").map((c, i) => (
            <motion.span
              key={i}
              variants={reduce ? undefined : charItem}
              className="inline-block"
              aria-hidden
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
          <motion.span
            variants={reduce ? undefined : charItem}
            className="inline-block text-accent"
            aria-hidden
          >
            .
          </motion.span>
        </motion.h1>

        <motion.p
          variants={reduce ? undefined : staggerItem}
          className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
        >
          {profile.intro}
        </motion.p>

        <motion.div
          variants={reduce ? undefined : staggerItem}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href="#projects"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            See my work
          </a>
          <a
            href="#connect"
            className="inline-flex h-11 items-center justify-center rounded-full border border-subtle px-6 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
          >
            Get in touch →
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
