import { Fragment } from "react";

/**
 * A field of stacked Gaussian-mixture density curves, offset vertically and
 * drawn back-to-front so nearer ridges occlude farther ones. Reads as a
 * mountain ridgeline and as a joyplot at the same time.
 *
 * Depth comes entirely from occlusion, so every fill paints the page
 * background: if the hero sits on anything other than a flat --bg, the fills
 * will cut a visible seam along the rearmost crest.
 */

const H = 600;
const STEPS = 200;

/** Deterministic so server and client render identical paths. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Ridge = { stroke: string; fill: string };
type Field = {
  ridges: Ridge[];
  crest: { x: number; y: number };
  width: number;
};

type Spec = { n: number; gap: number; ampScale: number; width: number };

function buildField({ n, gap, ampScale, width }: Spec): Field {
  const top = H * 0.36;
  // Curves run past the viewBox on both sides so the drift can never pull a
  // stroke terminus into frame.
  const pad = width * 0.08;
  const ridges: Ridge[] = [];
  let crest = { x: width / 2, y: top };

  for (let i = 0; i < n; i++) {
    const r = rng(i * 131 + 7);
    const bumpCount = 3 + Math.floor(r() * 3);
    const bumps: { mu: number; sg: number; a: number }[] = [];
    for (let b = 0; b < bumpCount; b++) {
      bumps.push({
        mu: 0.06 + 0.88 * r(),
        sg: 0.045 + 0.085 * r(),
        a: 0.35 + 0.65 * r(),
      });
    }

    const baseline = top + i * gap;
    const amp = H * ampScale * (0.72 + 0.42 * r());

    const yAt = (t: number) => {
      let f = 0;
      for (const b of bumps)
        f += b.a * Math.exp(-((t - b.mu) ** 2) / (2 * b.sg * b.sg));
      return baseline - amp * f;
    };

    let minY = Infinity;
    let minX = width / 2;
    let d = `M${(-pad).toFixed(1)},${yAt(0).toFixed(1)} `;
    for (let s = 0; s <= STEPS; s++) {
      const t = s / STEPS;
      const y = yAt(t);
      if (y < minY) {
        minY = y;
        minX = t * width;
      }
      d += `L${(t * width).toFixed(1)},${y.toFixed(1)} `;
    }
    d += `L${(width + pad).toFixed(1)},${yAt(1).toFixed(1)} `;

    if (i === n - 1) crest = { x: minX, y: minY };

    ridges.push({
      stroke: d,
      fill: `${d}L${(width + pad).toFixed(1)},${H} L${(-pad).toFixed(1)},${H} Z`,
    });
  }

  return { ridges, crest, width };
}

// Wide field for landscape viewports, cropped to cover.
const WIDE = buildField({ n: 11, gap: H * 0.052, ampScale: 0.2, width: 1180 });
// Narrower field for portrait viewports, shown whole in a band at the bottom.
const BAND = buildField({ n: 7, gap: H * 0.062, ampScale: 0.16, width: 760 });

function Ridges({
  field,
  id,
  fit,
  edgeFade = false,
}: {
  field: Field;
  id: string;
  fit: string;
  /**
   * For the "meet" variant only. Because the whole viewBox is shown, the flat
   * tails of each mixture would otherwise terminate on a hard line at its
   * edges. These fades live in viewBox units rather than element units, since
   * "meet" letterboxes the content and element percentages would not land on
   * the content's actual edges.
   */
  edgeFade?: boolean;
}) {
  const { ridges, crest, width } = field;
  const last = ridges.length - 1;

  const body = ridges.map((ridge, i) => {
        const f = i / last;
        return (
          <Fragment key={i}>
            {/* Atmosphere seated at the front crest. Drawn under the frontmost
                ridge so only the halo above the crest survives. */}
            {i === last ? (
              <ellipse
                cx={crest.x}
                cy={crest.y}
                rx={width * 0.178}
                ry={90}
                fill={`url(#${id}-glow)`}
              />
            ) : null}
            <g
              className="ridge-drift"
              style={
                {
                  "--ridge-dx": `-${(10 + 3.5 * i).toFixed(1)}px`,
                  "--ridge-dur": `${34 + 4 * i}s`,
                } as React.CSSProperties
              }
            >
              <path d={ridge.fill} fill="var(--bg)" />
              <path
                d={ridge.stroke}
                fill="none"
                stroke="var(--accent)"
                strokeOpacity={(0.1 + 0.65 * f).toFixed(3)}
                strokeWidth={(0.9 + 0.9 * f).toFixed(2)}
                strokeLinejoin="round"
              />
            </g>
          </Fragment>
        );
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${H}`}
      preserveAspectRatio={fit}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="#7fb08a" stopOpacity="0.1" />
          <stop offset="70%" stopColor="#7fb08a" stopOpacity="0" />
        </radialGradient>

        {edgeFade ? (
          <>
            <linearGradient
              id={`${id}-fx`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2={width}
              y2="0"
            >
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="11%" stopColor="#fff" stopOpacity="1" />
              <stop offset="89%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={`${id}-fy`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2={H}
            >
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="26%" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
            {/* Nested masks multiply, which gives the intersection of the two
                fades without relying on mask-composite. */}
            <mask id={`${id}-mx`} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={H}>
              <rect width={width} height={H} fill={`url(#${id}-fx)`} />
            </mask>
            <mask id={`${id}-my`} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={H}>
              <rect width={width} height={H} fill={`url(#${id}-fy)`} />
            </mask>
          </>
        ) : null}
      </defs>

      {edgeFade ? (
        <g mask={`url(#${id}-mx)`}>
          <g mask={`url(#${id}-my)`}>{body}</g>
        </g>
      ) : (
        body
      )}
    </svg>
  );
}

export function RidgeField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Portrait: the whole field sits in a band below the stacked copy.
          "meet" shows it complete, and the letterbox above is invisible
          because the fills already match the background. */}
      <div className="absolute inset-x-0 bottom-0 h-[44%] lg:hidden">
        <Ridges
          field={BAND}
          id="ridge-band"
          fit="xMidYMax meet"
          edgeFade
        />
      </div>

      {/* Landscape: full-bleed, cropped to cover, with the copy column punched
          out of the mask. The mask is in element space rather than viewBox
          space so it tracks the copy at every aspect ratio. */}
      <div className="ridge-wide absolute inset-0 hidden lg:block">
        <Ridges field={WIDE} id="ridge-wide" fit="xMidYMid slice" />
      </div>
    </div>
  );
}
