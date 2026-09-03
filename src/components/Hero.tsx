"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { RidgeScene } from "./RidgeScene";
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
  // The canvas sizes its readability veils from where these actually render,
  // rather than from coordinates guessed per breakpoint.
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);
  const protect = useMemo(() => [copyRef, cueRef], []);
  // The canvas opens by sampling its own frontmost ridge, and holds the copy
  // back until that composition has assembled itself. Waiting on the canvas
  // rather than on a timer here is what keeps the two from drifting apart, and
  // it also means the copy only ever appears once the webfonts have landed —
  // the scene gates on those before it hands over.
  const [revealed, setRevealed] = useState(false);
  const onReveal = useCallback(() => setRevealed(true), []);
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
      // Opaque, and with no ambient-gradient layer: the canvas paints its own
      // sky, aurora and afterglow, so the page-wide ambient light would only
      // wash them out.
      className="fixed inset-x-0 top-0 z-0 flex h-[100svh] flex-col justify-center overflow-hidden bg-bg pt-16 pb-24"
    >
      <RidgeScene protect={protect} onReveal={onReveal} />

      <motion.div
        ref={copyRef}
        variants={variants.container}
        initial="hidden"
        animate={revealed ? "show" : "hidden"}
        aria-busy={!revealed || undefined}
        // Not yet visible means not yet clickable. The copy stays in the DOM
        // throughout so it costs nothing in crawlability, but its two buttons
        // would otherwise be invisible hit targets for the length of the
        // opening.
        className={`wrap wrap-wide relative${revealed ? "" : " pointer-events-none"}`}
      >
        <motion.p
          variants={variants.item}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-3"
        >
          Hi, I&apos;m
        </motion.p>

        <motion.h1
          variants={charC}
          className="mt-4 text-[clamp(3.25rem,13vw,7.5rem)] font-bold tracking-[-0.04em] leading-[0.95]"
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
        ref={cueRef}
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        // Trails the copy rather than the page load: the cue is the last thing
        // to arrive, once there is something worth scrolling away from.
        transition={
          reduce ? { duration: 0 } : { duration: 0.6, delay: 0.45, ease }
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
