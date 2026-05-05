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
          I&apos;m a software engineer who likes building products end-to-end —
          from the database schema up through the pixel-pushing on the front-end.
          My recent work lives at the intersection of AI tooling, developer
          experience, and product design.
        </p>
        <p>
          Outside of code, I&apos;m drawn to anything where craft compounds: clear
          writing, precise tools, well-designed systems. I believe the best
          software feels inevitable in retrospect, and I&apos;m always trying to
          get a little closer to that bar.
        </p>
        <p className="text-muted">
          Replace this copy with your own story — where you&apos;ve worked, what
          you&apos;re into, what you&apos;re looking to do next. Two or three
          short paragraphs is the sweet spot.
        </p>
      </div>
    </section>
  );
}
