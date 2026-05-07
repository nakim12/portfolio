import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-32">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          404 — not found
        </p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
          Lost in the data.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back to something familiar.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            ← Back home
          </Link>
          <Link
            href="/#projects"
            className="inline-flex h-10 items-center justify-center rounded-full border border-subtle px-5 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
          >
            See my projects
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
