import { About } from "@/components/About";
import { Connect } from "@/components/Connect";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      {/* Pinning the Hero with `fixed inset-0 z-0` means the rest of the page
          needs to start at viewport bottom and sit above the hero so it slides
          up over it on scroll (Romus.vercel.app pattern). */}
      <div className="relative z-30 mt-[100svh] border-t border-subtle bg-background">
        <main className="mx-auto w-full max-w-3xl px-6">
          <About />
          <div className="h-px w-full bg-subtle" />
          <Experience />
          <div className="h-px w-full bg-subtle" />
          <Projects />
          <div className="h-px w-full bg-subtle" />
          <Connect />
        </main>
        <Footer />
      </div>
    </>
  );
}
