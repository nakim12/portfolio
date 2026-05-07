import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  const statusLabel =
    project.status === "live"
      ? "Live"
      : project.status === "in-progress"
        ? "In progress"
        : "Archived";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-subtle bg-surface transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm"
    >
      {project.cover ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-subtle bg-subtle/30">
          <Image
            src={project.cover}
            alt={`${project.title} preview`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight group-hover:text-accent">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{project.tagline}</p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted shrink-0">
            {project.year}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/80">
          {project.description}
        </p>

        {project.award ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            ★ {project.award}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            {statusLabel}
          </span>
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-subtle px-2 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 ? (
            <span className="text-xs text-muted">
              +{project.tags.length - 4}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
