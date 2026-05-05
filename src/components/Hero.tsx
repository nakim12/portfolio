import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[70vh] flex-col justify-center pt-20 pb-24"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted reveal">
        Hi, I&apos;m
      </p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl reveal">
        {profile.name}.
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted reveal">
        {profile.intro}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3 reveal">
        <a
          href="#projects"
          className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          See my work
        </a>
        <a
          href="#connect"
          className="inline-flex h-10 items-center justify-center rounded-full border border-subtle px-5 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
