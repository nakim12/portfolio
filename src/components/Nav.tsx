"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#education", label: "Education" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
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
    <header
      className={[
        "sticky top-0 z-40 w-full transition-all",
        scrolled
          ? "border-b border-subtle/70 bg-background/80 backdrop-blur"
          : "border-b border-transparent",
      ].join(" ")}
    >
      <nav className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
        <a
          href="#top"
          className="font-mono text-sm tracking-tight hover:text-accent"
        >
          nakim<span className="text-accent">.dev</span>
        </a>
        <ul className="hidden items-center gap-7 text-sm text-muted sm:flex">
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
    </header>
  );
}
