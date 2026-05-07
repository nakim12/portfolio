"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

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
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        // The bar is rendered with a background, blur, and border at all
        // times. On scroll we sequence the transition so width shrinks
        // first, then border-radius rounds the corners with a delay,
        // mirroring the romus.vercel.app pattern for a smoother handoff
        // from full-width bar to pill.
        className="mx-auto border border-subtle bg-background/70 backdrop-blur-xl"
        style={{
          transitionProperty:
            "width, border-radius, margin-top, box-shadow, border-color",
          transitionDuration: "700ms, 180ms, 700ms, 700ms, 700ms",
          // Asymmetric delays: scrolling DOWN, the corners round only after
          // the bar has mostly shrunk (520ms delay). Scrolling UP, the
          // corners flatten immediately while the bar expands in parallel,
          // so we don't see a fully-expanded-but-still-rounded mid state.
          transitionDelay: scrolled
            ? "0ms, 520ms, 0ms, 0ms, 0ms"
            : "0ms, 0ms, 0ms, 0ms, 0ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          width: scrolled ? "min(calc(100% - 2rem), 768px)" : "100%",
          borderRadius: scrolled ? "9999px" : "0",
          marginTop: scrolled ? "0.75rem" : "0",
          boxShadow: scrolled
            ? "0 8px 24px -12px rgba(0,0,0,0.18)"
            : "none",
        }}
      >
        <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
          <a
            href="#top"
            className="font-mono text-sm tracking-tight transition-colors hover:text-accent"
          >
            nakim<span className="text-accent">.</span>
          </a>
          <div className="flex items-center gap-3 sm:gap-5">
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
            <ThemeToggle className="hidden sm:inline-flex" />
          </div>
        </nav>
      </div>
    </header>
  );
}
