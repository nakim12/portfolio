type Props = {
  index: string;
  label: string;
  title: string;
  description?: string;
};

export function SectionHeading({ index, label, title, description }: Props) {
  return (
    <div className="mb-12">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
        <span className="text-accent">{index}</span> &nbsp;·&nbsp; {label}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
