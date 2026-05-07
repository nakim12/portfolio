import { About } from "@/components/About";
import { Connect } from "@/components/Connect";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Stats } from "@/components/Stats";
import { ToolkitMarquee } from "@/components/ToolkitMarquee";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-3xl px-6">
        <Hero />
        <Stats />
        <ToolkitMarquee />
        <About />
        <div className="h-px w-full bg-subtle" />
        <Experience />
        <div className="h-px w-full bg-subtle" />
        <Projects />
        <div className="h-px w-full bg-subtle" />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
