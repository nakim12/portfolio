import { About } from "@/components/About";
import { Connect } from "@/components/Connect";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";

function Divider() {
  return (
    <div className="wrap wrap-wide">
      <div className="h-px w-full bg-subtle" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      {/* The Hero is pinned, so the rest of the page starts below it and sits
          above it, sliding up over the hero on scroll. This offset must stay in
          sync with the Hero's own height. */}
      <div className="relative z-30 mt-[75svh] border-t border-subtle bg-background">
        <main>
          <About />
          <Divider />
          <Experience />
          <Divider />
          <Projects />
          <Divider />
          <Connect />
        </main>
        <Footer />
      </div>
    </>
  );
}
