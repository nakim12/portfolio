import { profile } from "@/data/profile";
import { SectionHeading } from "./SectionHeading";

const linkClass =
  "group flex items-center justify-between rounded-xl border border-subtle bg-surface px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-foreground/20";

function urlSlug(url: string): string {
  try {
    return new URL(url).pathname.replace(/^\/|\/$/g, "");
  } catch {
    return url;
  }
}

export function Connect() {
  const githubSlug = urlSlug(profile.links.github);
  const linkedinSlug = urlSlug(profile.links.linkedin);

  return (
    <section id="connect" className="py-24">
      <SectionHeading
        index="/06"
        label="Connect"
        title="Let's get in touch"
        description="Best way to reach me is over email. I'm also on GitHub and LinkedIn."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <a href={`mailto:${profile.email}`} className={linkClass}>
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
            <p className="mt-1 text-sm">@{githubSlug}</p>
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
            <p className="mt-1 text-sm">{linkedinSlug}</p>
          </div>
          <span aria-hidden className="text-muted group-hover:text-accent">
            ↗
          </span>
        </a>
        {profile.resumeUrl ? (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Resume
              </p>
              <p className="mt-1 text-sm">resume.pdf</p>
            </div>
            <span aria-hidden className="text-muted group-hover:text-accent">
              ↗
            </span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
