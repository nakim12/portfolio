import { Reveal } from "./Reveal";

type Props = {
  index: string;
  label: string;
  title: string;
  description?: string;
};

export function SectionHeading({ index, label, title, description }: Props) {
  return (
    <Reveal className="mb-12">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
        <span className="text-accent">{index}</span> &nbsp;·&nbsp; {label}
      </p>
      <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] leading-[1.05] sm:text-5xl">
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
