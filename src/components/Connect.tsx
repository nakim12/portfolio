import { profile } from "@/data/profile";
import { SectionHeading } from "./SectionHeading";

const linkClass =
  "group flex items-center justify-between rounded-xl border border-subtle bg-surface px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-foreground/20";

export function Connect() {
  return (
    <section id="connect" className="py-24">
      <SectionHeading
        index="/05"
        label="Connect"
        title="Let's get in touch"
        description="Best way to reach me is over email. I'm also active on GitHub and the usual places."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={`mailto:${profile.email}`}
          className={linkClass}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Email
            </p>
            <p className="mt-1 text-sm">{profile.email}</p>
          </div>
          <span aria-hidden className="text-muted group-hover:text-accent">
            →
          </span>
        </a>
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              GitHub
            </p>
            <p className="mt-1 text-sm">@{profile.handle}</p>
          </div>
          <span aria-hidden className="text-muted group-hover:text-accent">
            ↗
          </span>
        </a>
        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              LinkedIn
            </p>
            <p className="mt-1 text-sm">in/{profile.handle}</p>
          </div>
          <span aria-hidden className="text-muted group-hover:text-accent">
            ↗
          </span>
        </a>
        <a
          href={profile.links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Twitter / X
            </p>
            <p className="mt-1 text-sm">@{profile.handle}</p>
          </div>
          <span aria-hidden className="text-muted group-hover:text-accent">
            ↗
          </span>
        </a>
      </div>
    </section>
  );
}
