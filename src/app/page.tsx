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
      <main className="mx-auto w-full max-w-3xl px-6">
        <Hero />
        <div className="h-px w-full bg-subtle" />
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
