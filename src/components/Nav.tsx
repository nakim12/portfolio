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
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        // The bar exists at scroll=0 (bg/blur/border are always present),
        // it's just full-width and rectangular. On scroll, width and
        // border-radius animate together over the same duration so the
        // shape morphs continuously from bar to pill — no intermediate
        // "small rectangle" state.
        className={[
          "mx-auto border border-subtle bg-background/70 backdrop-blur-xl",
          "transition-[width,border-radius,margin-top,box-shadow] duration-500 ease-out",
          scrolled
            ? "mt-3 rounded-full shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]"
            : "mt-0 rounded-none shadow-none",
        ].join(" ")}
        style={{
          width: scrolled ? "min(calc(100% - 2rem), 768px)" : "100%",
        }}
      >
        <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
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
