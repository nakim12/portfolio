import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="about" className="py-24">
      <SectionHeading
        index="I"
        label="About"
        title="About me"
      />
      <Reveal>
        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-foreground/90">
          <p className="drop-cap">
            I&apos;m a recent Statistics &amp; Data Science graduate from UC
            Santa Barbara, with a Technology Management Certification. I&apos;m
            drawn to transforming complex systems into interpretable insights,
            revealing patterns that inform meaningful decisions.
          </p>
          <p>
            Most recently I was a data science intern at BlueAlpha, building
            synthetic data generators and benchmarking workflows for Marketing
            Mix Modeling. Before that I spent nine months at NCEAS designing
            reproducible pipelines for biodiversity data. On the side, I build
            agentic AI projects, most recently Romus, a real-time computer
            vision form coach, and Dialed, a multi-agent guardrail layer for
            social media.
          </p>
          <p>
            Outside of code, you will find me reading books, going on runs,
            exploring nature, or spending time with family and friends.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
