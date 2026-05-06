import { certifications, education } from "@/data/education";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Education() {
  return (
    <section id="education" className="py-24">
      <SectionHeading
        index="/02"
        label="Education"
        title="Where I'm studying"
      />

      <div className="space-y-10">
        {education.map((e) => (
          <Reveal key={e.school}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  {e.school}
                </h3>
                <p className="text-sm text-muted">
                  {e.degree}
                  {e.details ? ` · ${e.details}` : ""}
                </p>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                {e.dates}
                {e.gpa ? ` · GPA ${e.gpa}` : ""}
              </p>
            </div>

            {e.coursework?.length ? (
              <div className="mt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Relevant coursework
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {e.coursework.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-subtle bg-surface px-3 py-1 text-sm"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Reveal>
        ))}

        {certifications.length ? (
          <Reveal delay={0.05}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Certifications
            </p>
            <ul className="mt-3 space-y-3">
              {certifications.map((c) => (
                <li
                  key={`${c.name}-${c.issuer}`}
                  className="rounded-xl border border-subtle bg-surface px-5 py-4"
                >
                  <p className="text-sm font-medium">
                    {c.name}{" "}
                    <span className="text-muted">— {c.issuer}</span>
                  </p>
                  {c.details ? (
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {c.details}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
