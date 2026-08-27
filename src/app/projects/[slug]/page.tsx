import Image from "next/image";
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
          {project.award ? (
            <p className="mt-4 inline-flex rounded-full bg-accent-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              ★ {project.award}
            </p>
          ) : null}
        </header>

        {project.cover ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-xl border border-surface-border bg-subtle/30">
            <Image
              src={project.cover}
              alt={`${project.title} preview`}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-2">
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

        {project.demoNote ? (
          <p className="mt-3 text-xs text-muted">{project.demoNote}</p>
        ) : null}

        <article className="mt-10 text-base leading-relaxed text-foreground/90">
          <p>{project.longDescription ?? project.description}</p>
        </article>

        {project.metrics ? (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Benchmark results
            </h2>
            <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-surface-border bg-subtle/60 sm:grid-cols-3">
              {project.metrics.items.map((m) => (
                <div key={m.label} className="bg-background px-4 py-5">
                  <dt className="text-xs leading-snug text-muted">{m.label}</dt>
                  <dd className="mt-1.5 font-mono text-2xl tracking-tight text-foreground">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
            {project.metrics.caption ? (
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {project.metrics.caption}
              </p>
            ) : null}
          </section>
        ) : null}

        {project.stories?.length ? (
          <section className="mt-12 space-y-8">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              What I learned
            </h2>
            {project.stories.map((s) => (
              <div key={s.title}>
                <h3 className="text-lg font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-foreground/90">
                  {s.body}
                </p>
              </div>
            ))}
          </section>
        ) : null}

        {project.demoCaveat ? (
          <p className="mt-12 border-t border-subtle pt-6 text-sm leading-relaxed text-muted">
            {project.demoCaveat}
          </p>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
