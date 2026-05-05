"use client";

import { useMemo, useState } from "react";
import { projects, allTags } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

const ALL = "All";

export function Projects() {
  const [active, setActive] = useState<string>(ALL);

  const filters = useMemo(() => [ALL, ...allTags], []);

  const filtered = useMemo(() => {
    if (active === ALL) return projects;
    return projects.filter((p) => p.tags.includes(active));
  }, [active]);

  return (
    <section id="projects" className="py-24">
      <SectionHeading
        index="/04"
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

      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          No projects with this tag yet.
        </p>
      ) : null}
    </section>
  );
}
