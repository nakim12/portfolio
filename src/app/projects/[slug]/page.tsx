import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
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

      {/* The page opens on the same landscape the home page does, so arriving
          here reads as moving through one site rather than following a link
          out of it. Full-bleed, and holding its copy to the wide tier so the
          title lines up with the cover below it. */}
      <header className="relative isolate overflow-hidden bg-bg pt-28 pb-16">
        <div
          aria-hidden
          className="ridge-band-scene pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden
          className="ridge-band-veil pointer-events-none absolute inset-0"
        />

        <div className="wrap wrap-wide relative">
          <Link
            href="/#projects"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-3 outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
          >
            ← back to projects
          </Link>

          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            {project.year} · {statusLabel}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] leading-[1.05] sm:text-5xl">
            {project.title}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-foreground/90 sm:text-xl">
            {project.tagline}
          </p>
          {project.award ? (
            <p className="mt-5 inline-flex rounded-full bg-accent-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              ★ {project.award}
            </p>
          ) : null}
        </div>
      </header>

      <main className="pb-24">
        {/* The screenshot runs at the wide tier rather than the text measure.
            It is the most informative thing on the page and was previously
            held to 768px for no reason but sharing a container with prose. */}
        {project.cover ? (
          <Reveal className="wrap wrap-wide">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[14px] border border-hairline bg-surface-1">
              <Image
                src={project.cover}
                alt={`${project.title} preview`}
                fill
                sizes="(min-width: 1024px) 1136px, 100vw"
                priority
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg to-transparent"
              />
            </div>
          </Reveal>
        ) : null}

        {/* Wide tier so the left edge lines up with the header and the cover,
            with the prose capped to a readable measure inside it — the same
            arrangement every section on the home page uses. */}
        <div className="wrap wrap-wide pt-12">
          <div className="max-w-[45rem]">
            <div className="flex flex-wrap items-center gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-surface-border px-2.5 py-0.5 text-xs text-muted"
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
                  className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  Visit live ↗
                </a>
              ) : null}
              {project.repo ? (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-subtle px-5 text-sm font-medium transition-colors hover:border-foreground/40"
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
              <Reveal className="mt-14">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  Benchmark results
                </h2>
                {/* Elevated cells on a hairline grid, with the figures in accent
                  and the labels demoted — the same treatment the stat rows on
                  the project cards get, so a number means the same thing
                  wherever it appears. */}
                <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-hairline bg-hairline sm:grid-cols-3">
                  {project.metrics.items.map((m) => (
                    <div key={m.label} className="bg-surface-2 px-5 py-6">
                      <dt className="text-xs leading-snug text-text-3">
                        {m.label}
                      </dt>
                      <dd className="mt-2 font-mono text-2xl tracking-tight text-accent">
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
              </Reveal>
            ) : null}

            {project.stories?.length ? (
              <Reveal className="mt-14">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  What I learned
                </h2>
                <div className="mt-6 space-y-8">
                  {project.stories.map((s) => (
                    <div key={s.title}>
                      <h3 className="text-xl font-semibold tracking-[-0.01em]">
                        {s.title}
                      </h3>
                      <p className="mt-2.5 text-base leading-relaxed text-foreground/90">
                        {s.body}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            ) : null}

            {project.demoCaveat ? (
              <p className="mt-14 border-t border-subtle pt-6 text-sm leading-relaxed text-muted">
                {project.demoCaveat}
              </p>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
