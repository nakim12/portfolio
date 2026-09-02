"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  index: number;
  featured?: boolean;
};

export function ProjectCard({ project, index, featured = false }: Props) {
  const reduce = useReducedMotion();
  const fromRight = index % 2 === 1;

  const statusLabel =
    project.status === "live"
      ? "Live"
      : project.status === "in-progress"
        ? "In progress"
        : "Archived";

  return (
    <motion.article
      initial={
        reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: fromRight ? 32 : -32 }
      }
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={
        reduce ? { duration: 0 } : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
      }
      className={[
        // Elevation is surface value plus a hairline, never a shadow, which on
        // a dark base reads as a smudge. The featured card rests one step
        // higher than the rest so the hierarchy holds without a hover.
        "group relative overflow-hidden rounded-[14px] border border-hairline",
        featured ? "bg-surface-3" : "bg-surface-2 hover:bg-surface-3",
        "transition-[background-color,border-color,transform] duration-[180ms] ease-out",
        "hover:border-hairline-hi motion-safe:hover:-translate-y-0.5",
        "focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/30 focus-within:ring-offset-2 focus-within:ring-offset-background",
        // The featured card runs image-beside-content at desktop. Stacking a
        // full-width cover above the copy costs ~500px of page height for no
        // extra legibility once the image is already 550px wide.
        featured ? "lg:grid lg:grid-cols-2 lg:items-stretch" : "flex h-full flex-col",
      ].join(" ")}
    >
      {/* Rim light along the top edge, lit from the same direction as the
          hero's crests. It replaces brightening the whole border uniformly,
          which reads as an outline switching on; a directional edge reads as
          the card turning toward a light. */}
      <div
        aria-hidden
        className="rim-wash pointer-events-none absolute inset-x-0 top-0 z-20 h-6 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
      />
      <div
        aria-hidden
        className="rim-edge pointer-events-none absolute inset-x-0 top-0 z-20 h-px opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
      />

      {/* Stretched link overlay: makes the entire card clickable while still
          allowing the in-card external anchors below to intercept their own
          clicks via z-index layering. */}
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`Read more about ${project.title}`}
        className="absolute inset-0 z-10 outline-none"
      />

      {project.cover ? (
        <div
          className={[
            // The well sits a step below the card so an image with dark edges
            // still resolves as a distinct plane rather than a hole.
            "relative w-full overflow-hidden border-hairline bg-surface-1",
            // At desktop the featured cover fills its column instead of holding
            // an aspect, so it can't letterbox against the taller copy beside
            // it. The source is cut to that column's ratio, so cover has
            // nothing to crop; stacked below lg it center-crops to 1200/630.
            featured
              ? "aspect-[1200/630] border-b lg:aspect-auto lg:h-full lg:border-r lg:border-b-0"
              : "aspect-[16/10] border-b",
          ].join(" ")}
        >
          <Image
            src={project.cover}
            alt={`${project.title} preview`}
            fill
            sizes="(min-width: 1024px) 568px, 100vw"
            priority={featured}
            className="object-cover transition-transform duration-[240ms] ease-out motion-safe:group-hover:scale-[1.02]"
          />

          {/* Scrim on whichever edge meets the copy, so the screenshot
              dissolves into the card instead of stopping on a hard line. */}
          <div
            aria-hidden
            className={[
              "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent",
              featured ? "from-surface-3 lg:hidden" : "from-surface-2",
            ].join(" ")}
          />
          {featured ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-surface-3 to-transparent lg:block"
            />
          ) : null}
        </div>
      ) : null}

      <div
        className={[
          "flex flex-col",
          featured ? "px-6 py-8 sm:px-10" : "flex-1 px-6 py-7 sm:px-8",
        ].join(" ")}
      >
        {featured ? (
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            Featured
          </p>
        ) : null}

        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3
            className={[
              "font-bold tracking-tight transition-colors group-hover:text-accent",
              featured ? "text-3xl sm:text-4xl" : "text-2xl",
            ].join(" ")}
          >
            {project.title}
            <span className="text-accent">.</span>
          </h3>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-3">
            {project.year}
          </span>
        </div>

        {project.stats?.length ? (
          <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text-3">
            {project.stats.map((stat, i) => (
              <Fragment key={stat.label}>
                {i > 0 ? (
                  <span aria-hidden className="opacity-40">
                    ·
                  </span>
                ) : null}
                <span>
                  <span className="text-accent">{stat.value}</span>{" "}
                  {stat.label}
                </span>
              </Fragment>
            ))}
          </div>
        ) : null}

        <p
          className={[
            "mt-3 max-w-2xl leading-relaxed text-muted",
            featured ? "text-lg sm:text-xl" : "text-base",
          ].join(" ")}
        >
          {project.tagline}
        </p>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/80">
          {project.description}
        </p>

        {project.award ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            ★ {project.award}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            {statusLabel}
          </span>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-surface-border px-2.5 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6 text-sm">
          <span className="font-medium text-foreground">Read more →</span>
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 text-muted transition-colors hover:text-foreground"
            >
              Visit live ↗
            </a>
          ) : null}
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 text-muted transition-colors hover:text-foreground"
            >
              Source ↗
            </a>
          ) : null}
        </div>

        {project.demoNote ? (
          <p className="mt-3 text-xs text-muted">{project.demoNote}</p>
        ) : null}
      </div>
    </motion.article>
  );
}
