import { Reveal } from "./Reveal";

type Props = {
  index: string;
  label: string;
  title: string;
  description?: string;
};

export function SectionHeading({ index, label, title, description }: Props) {
  return (
    <Reveal className="mb-8">
      {/* Cream at reduced opacity rather than flat --display: the marker is
          secondary to the heading below it, so it takes the warm cast without
          taking the emphasis. */}
      <p className="font-[family-name:var(--font-serif)] text-base italic tracking-normal text-display/75">
        <span className="text-accent">{index}.</span> {label}
      </p>
      <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] leading-[1.05] sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
