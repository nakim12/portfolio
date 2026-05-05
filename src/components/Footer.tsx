import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-subtle py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start justify-between gap-3 px-6 text-xs text-muted sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js & Tailwind.
        </p>
        <p className="font-mono">
          <a href="#top" className="hover:text-foreground">
            back to top ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
