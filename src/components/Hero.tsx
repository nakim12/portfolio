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
import { staggerVariants } from "./Reveal";

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
  const variants = staggerVariants(reduce);
  const shownChar = { opacity: 1, y: 0 };
  const charC = reduce ? { hidden: {}, show: {} } : charContainer;
  const charI = reduce
    ? { hidden: shownChar, show: shownChar }
    : charItem;
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
      className="fixed inset-x-0 top-0 z-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16 pb-24"
    >
      <TopoField className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Drifting mist along the treeline — WebGL fragment shader. Sits
          between the topo grid and the pine silhouettes so fog reads as
          rolling through/behind the trees. */}
      <MistField className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Pine silhouette ridge at the bottom of the hero. */}
      <PineRidge className="pointer-events-none absolute inset-x-0 bottom-0 h-[28svh] w-full" />

      <motion.div
        variants={variants.container}
        initial="hidden"
        animate="show"
        className="wrap wrap-wide relative"
      >
        <motion.p
          variants={variants.item}
          className="font-mono text-xs uppercase tracking-[0.22em] text-muted"
        >
          Hi, I&apos;m
        </motion.p>

        <motion.h1
          variants={charC}
          className="mt-4 text-[clamp(3rem,12vw,6.5rem)] font-bold tracking-[-0.04em] leading-[0.95]"
          aria-label={`${FIRST} ${LAST}`}
        >
          {FIRST.split("").map((c, i) => (
            <motion.span
              key={`f-${i}`}
              variants={charI}
              className="inline-block"
              aria-hidden
            >
              {c}
            </motion.span>
          ))}
          <motion.span
            variants={charI}
            className="inline-block"
            aria-hidden
          >
            {"\u00A0"}
          </motion.span>
          {LAST.split("").map((c, i) => (
            <motion.span
              key={`l-${i}`}
              variants={charI}
              className="inline-block font-[family-name:var(--font-serif)] font-medium italic text-display"
              aria-hidden
            >
              {c}
            </motion.span>
          ))}
          <motion.span
            variants={charI}
            className="inline-block text-accent"
            aria-hidden
          >
            .
          </motion.span>
        </motion.h1>

        <motion.p
          variants={variants.item}
          className="mt-6 max-w-2xl text-xl leading-snug text-foreground/90 sm:text-2xl"
        >
          {profile.headline}
        </motion.p>

        <motion.p
          variants={variants.item}
          className="mt-3 max-w-xl text-sm leading-relaxed text-muted"
        >
          {profile.intro}
        </motion.p>

        <motion.div
          variants={variants.item}
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

      {/* Scroll affordance. The hero fills the viewport, so without this there
          is nothing at rest to signal the page continues. */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.6, delay: 1.1, ease }
        }
        className="group absolute inset-x-0 bottom-10 z-10 mx-auto flex w-fit flex-col items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <span>Scroll</span>
        <motion.span
          aria-hidden
          animate={reduce ? undefined : { y: [0, 5, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 1.9, repeat: Infinity, ease: "easeInOut" }
          }
          className="block text-sm leading-none"
        >
          ↓
        </motion.span>
      </motion.a>
    </motion.section>
  );
}
