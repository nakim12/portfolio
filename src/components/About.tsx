import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="about" className="py-24">
      <SectionHeading
        index="/01"
        label="About"
        title="A bit about me"
      />
      <div className="max-w-2xl space-y-5 text-base leading-relaxed text-foreground/90">
        <p>
          I&apos;m a Statistics &amp; Data Science student at UC Santa Barbara,
          graduating in June 2026 with a Technology Management Certification.
          I&apos;m drawn to problems where rigorous statistics meets a real
          product surface — places where the modeling choice and the user
          experience are the same decision.
        </p>
        <p>
          Right now I&apos;m a data science intern at BlueAlpha, building
          synthetic data generators and benchmarking workflows for Marketing
          Mix Modeling. Before that I spent eight months at NCEAS designing
          reproducible R pipelines for biodiversity data. On the side, I build
          agentic AI projects — most recently Romus, a real-time computer-vision
          form coach (BroncoHacks 2026 winner), and Dialed, a multi-agent
          guardrail layer for social media (2x BeachHacks 9.0 winner).
        </p>
        <p>
          Outside of code, I&apos;m drawn to anything where craft compounds —
          clear writing, precise tools, well-designed systems. The best
          software feels inevitable in retrospect, and I&apos;m always trying
          to get a little closer to that bar.
        </p>
      </div>
    </section>
  );
}
