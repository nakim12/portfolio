/**
 * Geometry and palette for the ridgeline motif.
 *
 * This lives outside the hero component because the landscape now appears on
 * two surfaces that cannot share a renderer: the hero animates it on a canvas,
 * and the Open Graph card is rasterised by Satori, which has no canvas and so
 * consumes the same numbers as SVG path data. Keeping the mixture here means
 * the two are one landscape rather than two drawings that resemble each other.
 */

export type RGB = [number, number, number];

export const BG = "#0a0c0b";
export const HAZE: RGB = [43, 62, 56];
export const NEAR: RGB = [3, 4, 3];
export const ACCENT: RGB = [127, 176, 138];
export const CREAM: RGB = [242, 236, 222];

export const N_WIDE = 13;
export const N_NARROW = 9;
/** How much larger near ridges are than far ones. */
export const GROWTH = 1.15;

/** Deterministic, so the composition is identical on every load. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Bump = { mu: number; sg: number; a: number; ph: number; sp: number };
export type Base = { bumps: Bump[]; amp0: number };

export const BASE: Base[] = [...Array(N_WIDE)].map((_, i) => {
  const r = rng(i * 131 + 7);
  const count = 3 + Math.floor(r() * 3);
  const bumps: Bump[] = [];
  for (let b = 0; b < count; b++) {
    bumps.push({
      mu: 0.04 + 0.92 * r(),
      sg: 0.05 + 0.09 * r(),
      a: 0.35 + 0.65 * r(),
      ph: r() * 6.283,
      sp: 0.25 + 0.5 * r(),
    });
  }
  return { bumps, amp0: 0.7 + 0.45 * r() };
});

export const STARS = (() => {
  const r = rng(4242);
  return [...Array(165)].map(() => ({
    x: r(),
    y: r(),
    radius: 0.35 + r() * 0.9,
    seed: r(),
  }));
})();

/** Crest height of ridge `i` at horizontal position `u`, in amplitude units. */
export function ridgeValue(i: number, u: number, t: number) {
  let v = 0;
  for (const b of BASE[i].bumps) {
    const mu = b.mu + 0.012 * Math.sin(t * b.sp + b.ph);
    const a = b.a * (1 + 0.1 * Math.sin(t * b.sp * 0.8 + b.ph * 1.7));
    const d = u - mu;
    v += a * Math.exp(-(d * d) / (2 * b.sg * b.sg));
  }
  return v;
}

/**
 * Horizontal shape of the rim light. The afterglow sits at 0.64 of the width,
 * so a crest facing it catches more light than one at the dark left edge; a
 * uniform stroke is what made earlier versions read as a drawn line rather
 * than a lit edge. The hard falloff to the left is also load-bearing for
 * legibility, since that is where copy sits on both surfaces.
 */
export const TOWARD_LIGHT: [number, number][] = [
  [0, 0.25],
  [0.22, 0.39],
  [0.45, 0.7],
  [0.64, 1],
  [0.84, 0.88],
  [1, 0.62],
];

export const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
export const hex = (c: RGB) =>
  `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
export const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

export type Layout = {
  w: number;
  h: number;
  /** Scales absolute line weights so they stay proportionate to the frame. */
  s: number;
  n: number;
  top: number;
  gap: number;
  ampScale: number;
  ampBasis: number;
  skyBand: number;
  portrait: boolean;
};

export function layout(w: number, h: number): Layout {
  // Keyed on aspect, not width: a portrait tablet has the same problem as a
  // phone, in that the copy spans the full width and so cannot share a row
  // with the ridges.
  const portrait = w / h < 1.25;
  return {
    w,
    h,
    s: Math.max(0.75, Math.min(2, h / 600)),
    n: portrait ? N_NARROW : N_WIDE,
    // In portrait the field is compressed into a band below the copy. Left in
    // place it would run straight through the headline, and no amount of veil
    // makes that look deliberate.
    top: h * (portrait ? 0.62 : 0.22),
    gap: h * (portrait ? 0.045 : 0.06),
    ampScale: portrait ? 0.26 : 0.185,
    /**
     * Amplitude is capped by width, not driven purely by height. Bump widths
     * are a fraction of the frame width, so on a narrow viewport a
     * height-driven amplitude turns every peak into a 40px-wide, 240px-tall
     * spike. Tying the ceiling to width holds the peak aspect roughly constant.
     */
    ampBasis: Math.min(h, w * 0.5625),
    skyBand: portrait ? 0.46 : 1,
    portrait,
  };
}

export function ridgeGeometry(L: Layout, i: number) {
  const f = L.n > 1 ? i / (L.n - 1) : 1;
  return {
    f,
    baseline: L.top + i * L.gap,
    // Nearer ridges are larger. After haze this is the strongest depth cue;
    // without it the field reads flat.
    amp: L.ampBasis * L.ampScale * BASE[i].amp0 * (0.62 + GROWTH * f),
  };
}

/**
 * Fill colour endpoints for ridge `i`. Foreground ridges are a flat near-black
 * silhouette; everything behind them ramps from haze toward that silhouette,
 * which carries most of the depth read.
 */
export function ridgeFill(f: number) {
  const d = Math.pow(f, 0.55);
  return {
    /** Non-null for foreground ridges, which take no vertical ramp at all. */
    flat: f > 0.7 ? hex(NEAR) : null,
    from: hex(mix(HAZE, NEAR, d)),
    to: hex(mix(HAZE, NEAR, Math.min(1, d + 0.3))),
  };
}
