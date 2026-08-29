"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#connect", label: "Connect" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);
    if (sections.length === 0) return;

    // The band starts below the nav pill and ends above the fold so a section
    // only claims the indicator once it is genuinely the one being read.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        // The bar exists at scroll=0 (bg/blur/border are always present),
        // it's just full-width and rectangular. On scroll, width and
        // border-radius animate together over the same duration so the
        // shape morphs continuously from bar to pill — no intermediate
        // "small rectangle" state.
        className={[
          "mx-auto border border-hairline bg-bg/70 backdrop-blur-xl",
          "transition-[width,border-radius,margin-top,border-color] duration-500 ease-out",
          // Elevation comes from the border stepping up, not a shadow.
          scrolled ? "mt-3 rounded-full border-hairline-hi" : "mt-0 rounded-none",
        ].join(" ")}
        style={{
          width: scrolled ? "min(calc(100% - 2rem), 75rem)" : "100%",
        }}
      >
        <nav className="wrap wrap-wide flex h-14 items-center justify-between gap-3">
          <a
            href="#top"
            className="font-mono text-sm tracking-tight transition-colors hover:text-accent"
          >
            nakim<span className="text-accent">.</span>
          </a>
          <ul className="flex items-center gap-4 text-xs text-muted sm:gap-7 sm:text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active === l.href ? "true" : undefined}
                  // The accent underline carries both hover and the active
                  // state, so the label itself never changes colour.
                  className={[
                    "relative block py-1 outline-none",
                    "after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:bg-accent",
                    "after:transition-transform after:duration-[180ms] after:ease-out",
                    "hover:after:scale-x-100 focus-visible:after:scale-x-100",
                    active === l.href
                      ? "text-foreground after:scale-x-100"
                      : "after:scale-x-0",
                  ].join(" ")}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
