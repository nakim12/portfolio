/**
 * Procedural pine-tree silhouette band. Renders two parallax-style
 * layers at the bottom of its container: a softer back row and a
 * darker front row. Trees are deterministic (no Math.random) so SSR
 * and client output match.
 *
 * Uses currentColor so opacity layers compose with the accent color
 * inherited from the parent.
 */

type Tree = { cx: number; height: number; width: number };

function generateTrees(count: number, totalWidth: number, jitter: number): Tree[] {
  const out: Tree[] = [];
  const spacing = totalWidth / count;
  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random offsets via trig — keeps SSR/CSR in sync.
    const xOffset = Math.sin(i * 12.9898) * jitter;
    const heightWiggle = Math.abs(Math.sin(i * 78.233)) * 40;
    const cx = (i + 0.5) * spacing + xOffset;
    const height = 80 + heightWiggle;
    const width = height * 0.55;
    out.push({ cx, height, width });
  }
  return out;
}

/**
 * Builds the SVG path for one stylized pine tree. Three stacked
 * triangles (canopy levels) with a tiny trunk hint at the bottom.
 * Origin is at the bottom-center of the tree.
 */
function pinePath(t: Tree): string {
  const { cx, height: h, width: w } = t;
  const baseY = 200;
  const top = baseY - h;
  const halfW = w / 2;

  // Three canopy tiers: top, mid, bottom — each wider than the last.
  const tipY = top;
  const tier1Y = top + h * 0.32;
  const tier2Y = top + h * 0.6;
  const tier3Y = top + h * 0.88;

  const tier1HalfW = halfW * 0.45;
  const tier2HalfW = halfW * 0.7;
  const tier3HalfW = halfW;

  // Single closed path that traces the silhouette in one stroke.
  return [
    `M ${cx} ${tipY}`,
    `L ${cx + tier1HalfW} ${tier1Y}`,
    `L ${cx + tier1HalfW * 0.55} ${tier1Y}`,
    `L ${cx + tier2HalfW} ${tier2Y}`,
    `L ${cx + tier2HalfW * 0.55} ${tier2Y}`,
    `L ${cx + tier3HalfW} ${tier3Y}`,
    `L ${cx + tier3HalfW * 0.65} ${tier3Y}`,
    `L ${cx + tier3HalfW * 0.65} ${baseY}`,
    `L ${cx - tier3HalfW * 0.65} ${baseY}`,
    `L ${cx - tier3HalfW * 0.65} ${tier3Y}`,
    `L ${cx - tier3HalfW} ${tier3Y}`,
    `L ${cx - tier2HalfW * 0.55} ${tier2Y}`,
    `L ${cx - tier2HalfW} ${tier2Y}`,
    `L ${cx - tier1HalfW * 0.55} ${tier1Y}`,
    `L ${cx - tier1HalfW} ${tier1Y}`,
    "Z",
  ].join(" ");
}

const VIEWBOX_WIDTH = 1200;

const backRow = generateTrees(28, VIEWBOX_WIDTH, 14);
const frontRow = generateTrees(20, VIEWBOX_WIDTH, 22).map((t) => ({
  ...t,
  height: t.height + 30,
  cx: t.cx + 15,
}));

export function PineRidge({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VIEWBOX_WIDTH} 200`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
    >
      <g className="text-accent" fill="currentColor">
        <g opacity={0.18}>
          {backRow.map((t, i) => (
            <path key={`b-${i}`} d={pinePath(t)} />
          ))}
        </g>
        <g opacity={0.32}>
          {frontRow.map((t, i) => (
            <path key={`f-${i}`} d={pinePath(t)} />
          ))}
        </g>
      </g>
    </svg>
  );
}
