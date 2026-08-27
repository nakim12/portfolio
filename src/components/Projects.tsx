import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="wrap wrap-wide scroll-mt-24 py-14 lg:py-16"
    >
      <SectionHeading
        index="III"
        label="Projects"
        title="Things I've built"
        description="A handful of products and experiments. Click any project for the longer story."
      />

      <div className="flex flex-col gap-8">
        {featured.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} featured />
        ))}

        {rest.length ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {rest.map((p, i) => (
              <ProjectCard
                key={p.slug}
                project={p}
                index={featured.length + i}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
