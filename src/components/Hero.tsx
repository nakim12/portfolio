"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { HeroFacts } from "./HeroFacts";
import { staggerContainer, staggerItem } from "./Reveal";

const wins = projects.filter((p) => p.award);

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[70vh] flex-col justify-center pt-20 pb-24"
    >
      <motion.div
        variants={reduce ? undefined : staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={reduce ? undefined : staggerItem}
          className="font-mono text-xs uppercase tracking-[0.18em] text-muted"
        >
          Hi, I&apos;m
        </motion.p>
        <motion.h1
          variants={reduce ? undefined : staggerItem}
          className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl"
        >
          {profile.name}.
        </motion.h1>
        <motion.p
          variants={reduce ? undefined : staggerItem}
          className="mt-4 max-w-xl text-lg leading-relaxed text-muted"
        >
          {profile.intro}
        </motion.p>
        {wins.length ? (
          <motion.div
            variants={reduce ? undefined : staggerItem}
            className="mt-6 flex flex-wrap items-center gap-2"
          >
            {wins.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent transition-opacity hover:opacity-80"
              >
                <span aria-hidden>★</span>
                {p.award}
              </Link>
            ))}
          </motion.div>
        ) : null}
        <motion.div
          variants={reduce ? undefined : staggerItem}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href="#projects"
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            See my work
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-full border border-subtle px-5 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
          >
            View resume ↗
          </a>
          <a
            href="#connect"
            className="inline-flex h-10 items-center justify-center rounded-full px-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Get in touch →
          </a>
        </motion.div>
      </motion.div>

      <HeroFacts />
    </section>
  );
}
