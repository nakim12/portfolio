import { experience } from "@/data/experience";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="py-24">
      <SectionHeading
        index="/02"
        label="Experience"
        title="Where I've worked"
      />
      <ol className="relative space-y-10 border-l border-subtle pl-8">
        {experience.map((job) => (
          <li key={`${job.company}-${job.start}`} className="relative">
            <span
              aria-hidden
              className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-accent"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  {job.role}{" "}
                  <span className="text-muted">@ {job.company}</span>
                </h3>
                <p className="text-sm text-muted">{job.location}</p>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                {job.start} — {job.end}
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-foreground/85">
              {job.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-muted" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
