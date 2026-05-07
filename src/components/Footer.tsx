import { profile } from "@/data/profile";

const iconClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-subtle text-muted transition-colors hover:border-foreground/30 hover:text-foreground";

const iconSvgProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function Footer() {
  return (
    <footer className="mt-24 border-t border-subtle py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start justify-between gap-6 px-6 text-xs text-muted sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js,
          Tailwind, and Framer Motion.
        </p>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            title="Email"
            className={iconClass}
          >
            <svg {...iconSvgProps}>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
            className={iconClass}
          >
            <svg {...iconSvgProps}>
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            className={iconClass}
          >
            <svg {...iconSvgProps}>
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 1 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume PDF"
            title="Resume"
            className={iconClass}
          >
            <svg {...iconSvgProps}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          </a>
        </div>

        <p className="font-mono">
          <a href="#top" className="hover:text-foreground">
            back to top ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
