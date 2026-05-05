import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { projects } from "@/data/projects";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Nathan Kim`,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return notFound();

  const statusLabel =
    project.status === "live"
      ? "Live"
      : project.status === "in-progress"
        ? "In progress"
        : "Archived";

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <Link
          href="/#projects"
          className="font-mono text-xs uppercase tracking-[0.18em] text-muted hover:text-foreground"
        >
          ← back to projects
        </Link>

        <header className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            {project.year} · {statusLabel}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            {project.tagline}
          </p>
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-subtle px-2 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Visit live ↗
            </a>
          ) : null}
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-full border border-subtle px-4 text-sm font-medium transition-colors hover:border-foreground/40"
            >
              Source ↗
            </a>
          ) : null}
        </div>

        <article className="mt-10 text-base leading-relaxed text-foreground/90">
          <p>{project.longDescription ?? project.description}</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
