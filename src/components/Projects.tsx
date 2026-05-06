"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { allTags, projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { staggerContainer, staggerItem } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const ALL = "All";

export function Projects() {
  const [active, setActive] = useState<string>(ALL);
  const reduce = useReducedMotion();

  const filters = useMemo(() => [ALL, ...allTags], []);

  const filtered = useMemo(() => {
    if (active === ALL) return projects;
    return projects.filter((p) => p.tags.includes(active));
  }, [active]);

  return (
    <section id="projects" className="py-24">
      <SectionHeading
        index="/03"
        label="Projects"
        title="Things I've built"
        description="A handful of products and experiments. Click any card for the longer story."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((tag) => {
          const isActive = active === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag)}
              className={[
                "rounded-full px-3 py-1 text-xs font-mono uppercase tracking-[0.14em] transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "border border-subtle text-muted hover:text-foreground hover:border-foreground/30",
              ].join(" ")}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <motion.div
        layout
        variants={reduce ? undefined : staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        className="grid gap-5 sm:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.slug}
              layout
              variants={reduce ? undefined : staggerItem}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          No projects with this tag yet.
        </p>
      ) : null}
    </section>
  );
}
