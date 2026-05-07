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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <nav
          className={[
            "flex items-center justify-between gap-3 transition-all duration-300 ease-out",
            scrolled
              ? "mt-3 h-12 rounded-full border border-subtle/70 bg-background/80 px-4 shadow-sm backdrop-blur sm:px-5"
              : "h-16 px-0",
          ].join(" ")}
        >
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
                  className="transition-colors hover:text-foreground"
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
