"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { profile } from "@/data/profile";
import { MistField } from "./MistField";
import { PineRidge } from "./PineRidge";
import { TopoField } from "./TopoField";
import { staggerContainer, staggerItem } from "./Reveal";

// Inline SVG noise as a data URI — used as a paper-grain overlay
// across the hero. ~200x200 fractal noise tile, repeated. Avoids
// shipping a binary asset for one decorative texture.
const PAPER_GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.7'/></svg>\")";

// Split so the surname can pick up a literary serif italic — small
// typographic accent that nods to the "reading books" side of things
// without going full bookish.
const FIRST = "Nathan";
const LAST = "Kim";
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
  const { scrollY } = useScroll();
  // Fade the entire hero out as the content panel slides up over it.
  // Fully gone by ~500px scroll (a bit more than half a typical viewport),
  // so the content "lift" feels cleaner instead of having two layers
  // sitting at full opacity at the same time.
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <motion.section
      id="top"
      style={reduce ? undefined : { opacity }}
      className="fixed inset-0 z-0 flex flex-col justify-center overflow-hidden pt-16 pb-24"
    >
      <TopoField className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Drifting mist along the treeline — WebGL fragment shader. Sits
          between the topo grid and the pine silhouettes so fog reads as
          rolling through/behind the trees. */}
      <MistField className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Pine silhouette ridge at the bottom of the hero. */}
      <PineRidge className="pointer-events-none absolute inset-x-0 bottom-0 h-[28vh] w-full" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: PAPER_GRAIN, backgroundRepeat: "repeat" }}
      />

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
          aria-label={`${FIRST} ${LAST}`}
        >
          {FIRST.split("").map((c, i) => (
            <motion.span
              key={`f-${i}`}
              variants={reduce ? undefined : charItem}
              className="inline-block"
              aria-hidden
            >
              {c}
            </motion.span>
          ))}
          <motion.span
            variants={reduce ? undefined : charItem}
            className="inline-block"
            aria-hidden
          >
            {"\u00A0"}
          </motion.span>
          {LAST.split("").map((c, i) => (
            <motion.span
              key={`l-${i}`}
              variants={reduce ? undefined : charItem}
              className="inline-block font-[family-name:var(--font-serif)] font-medium italic"
              aria-hidden
            >
              {c}
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
    </motion.section>
  );
}
