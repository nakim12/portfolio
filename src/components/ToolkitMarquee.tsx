import { Fragment } from "react";
import { profile } from "@/data/profile";

export function ToolkitMarquee() {
  const items = profile.snapshot.toolkit;
  // We render two identical copies side-by-side so a -50% translateX
  // produces a seamless loop. For that loop to look gap-free at any
  // viewport width, each copy needs to be wider than the viewport, so we
  // pre-pad each copy by repeating the item list a few times.
  const oneCopy = [...items, ...items, ...items];

  const renderCopy = (keyPrefix: string) =>
    oneCopy.map((item, i) => (
      <Fragment key={`${keyPrefix}-${i}`}>
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
          {item}
        </span>
        <span aria-hidden className="font-mono text-xs text-accent">
          ·
        </span>
      </Fragment>
    ));

  return (
    <div
      aria-hidden
      className="relative -mx-6 overflow-hidden border-y border-subtle py-5"
    >
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap pl-8">
        {renderCopy("a")}
        {renderCopy("b")}
      </div>
    </div>
  );
}
