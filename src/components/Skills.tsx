import { skills } from "@/data/skills";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="py-24">
      <SectionHeading
        index="/03"
        label="Skills & Tools"
        title="Stack I reach for"
        description="What I tend to build with day-to-day. Comfortable picking up new tools as the problem demands."
      />
      <div className="grid gap-8 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.label}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {group.label}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-subtle bg-surface px-3 py-1 text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
