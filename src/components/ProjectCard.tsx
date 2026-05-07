"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: Props) {
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
        reduce ? false : { opacity: 0, x: fromRight ? 32 : -32 }
      }
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-subtle bg-surface transition-colors hover:border-foreground/25 focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/30 focus-within:ring-offset-2 focus-within:ring-offset-background"
    >
      {/* Stretched link overlay: makes the entire card clickable while still
          allowing the in-card external anchors below to intercept their own
          clicks via z-index layering. */}
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`Read more about ${project.title}`}
        className="absolute inset-0 z-10 outline-none"
      />

      {project.cover ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-subtle bg-subtle/30">
          <Image
            src={project.cover}
            alt={`${project.title} preview`}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
      ) : null}

      <div className="px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="text-2xl font-bold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
            {project.title}
            <span className="text-accent">.</span>
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {project.year}
          </span>
        </div>

        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {project.tagline}
        </p>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/80">
          {project.description}
        </p>

        {project.award ? (
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            ★ {project.award}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            {statusLabel}
          </span>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-subtle px-2.5 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
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
      </div>
    </motion.article>
  );
}
