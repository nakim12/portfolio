"use client";

import { RefObject, useEffect, useRef } from "react";
import {
  ACCENT,
  BG,
  CREAM,
  Layout,
  layout,
  RGB,
  rgba,
  ridgeFill,
  ridgeGeometry,
  ridgeValue,
  STARS,
  TOWARD_LIGHT,
} from "@/lib/ridge";

/**
 * Animated atmospheric ridgeline: overlapping Gaussian-mixture density curves
 * rendered as a landscape at dusk. Distant ridges are hazy and desaturated,
 * near ridges are near-black silhouettes with rim-lit crests, over an aurora
 * field, a warm afterglow and a star field that fades toward the horizon.
 *
 * Canvas rather than SVG because the geometry itself animates every frame —
 * bump centres drift and amplitudes breathe — which would mean rebuilding path
 * strings 30 times a second.
 *
 * Three layers, only one of which redraws: the backdrop and the overlays are
 * cached to offscreen canvases and only rebuilt on resize. They are the large
 * radial-gradient fills, and caching them is what makes this cheap. No
 * shadowBlur anywhere; every glow is layered translucent strokes and gradients.
 *
 * All lengths are fractions of the container rather than of a fixed 1180x600
 * space. A fixed logical space would have to be cropped to cover the hero, and
 * the crop varies with aspect ratio, which would slide the copy-readability
 * mask off the copy it exists to protect.
 */

const STEPS = 240;

/** How many of the rearmost ridges belong to the frozen, softened far field. */
function farCount(n: number) {
  let k = 0;
  while (k < n - 1 && k / Math.max(1, n - 1) < FAR_F) k++;
  return k;
}

function ellipseGlow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  stops: [number, string][],
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  for (const [o, c] of stops) g.addColorStop(o, c);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBackdrop(ctx: CanvasRenderingContext2D, L: Layout) {
  const { w, h } = L;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);

  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.8);
  sky.addColorStop(0, "rgba(22,34,31,0.60)");
  sky.addColorStop(1, "rgba(22,34,31,0)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const boost = 1.55;
  const skyBand = L.skyBand;
  ctx.globalCompositeOperation = "lighter";

  const auroras: [number, number, number, number, RGB, number][] = [
    [0.6, 0.28, 0.39, 0.417, [127, 176, 138], 0.15],
    [0.8, 0.2, 0.305, 0.35, [104, 166, 182], 0.12],
    [0.44, 0.24, 0.271, 0.3, [186, 196, 142], 0.08],
    [0.7, 0.34, 0.254, 0.25, [216, 201, 168], 0.07],
  ];
  for (const [cx, cy, rx, ry, color, alpha] of auroras) {
    ellipseGlow(
      ctx,
      w * cx,
      h * cy * skyBand,
      w * rx,
      h * ry * skyBand,
      [
        [0, rgba(color, alpha * boost)],
        [1, rgba(color, 0)],
      ],
    );
  }

  ellipseGlow(
    ctx,
    w * 0.64,
    h * 0.46 * skyBand,
    w * 0.398,
    w * 0.398 * (L.portrait ? 0.7 : 1),
    [
      [0, `rgba(224,208,172,${0.15 * boost})`],
      [0.55, `rgba(127,176,138,${0.055 * boost})`],
      [1, "rgba(224,208,172,0)"],
    ],
  );

  ctx.globalCompositeOperation = "source-over";

  const starBand = h * 0.58 * L.skyBand;
  for (const star of STARS) {
    const y = star.y * starBand;
    const alpha = (1 - y / starBand) * 0.44 * (0.35 + star.seed * 0.65);
    if (alpha <= 0.002) continue;
    ctx.fillStyle = `rgba(232,237,235,${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(star.x * w, y, star.radius * Math.min(1.4, L.s), 0, Math.PI * 2);
    ctx.fill();
  }
}

type Box = { x0: number; y0: number; x1: number; y1: number };

const smoothstep = (v: number) => {
  const t = Math.min(1, Math.max(0, v));
  return t * t * (3 - 2 * t);
};

/**
 * Trapezoidal falloff along one axis: 0 before `a`, full between `b` and `c`,
 * back to 0 by `d`, eased so the shoulders have no visible onset.
 */
function profile(
  ctx: CanvasRenderingContext2D,
  vertical: boolean,
  [a, b, c, d]: [number, number, number, number],
  rgb: string,
) {
  const g = vertical
    ? ctx.createLinearGradient(0, a, 0, d)
    : ctx.createLinearGradient(a, 0, d, 0);
  const span = d - a || 1;
  const at = (v: number) => Math.min(1, Math.max(0, (v - a) / span));
  const steps = 8;

  g.addColorStop(0, `rgba(${rgb},0)`);
  for (let k = 1; k < steps; k++) {
    const p = k / steps;
    g.addColorStop(at(a + (b - a) * p), `rgba(${rgb},${smoothstep(p).toFixed(4)})`);
  }
  g.addColorStop(at(b), `rgba(${rgb},1)`);
  g.addColorStop(at(c), `rgba(${rgb},1)`);
  for (let k = steps - 1; k >= 1; k--) {
    const p = k / steps;
    g.addColorStop(
      at(d - (d - c) * p),
      `rgba(${rgb},${smoothstep(p).toFixed(4)})`,
    );
  }
  g.addColorStop(1, `rgba(${rgb},0)`);
  return g;
}

/**
 * Feathered veil over one region of copy, as the product of a horizontal and a
 * vertical falloff. A radial or elliptical mask cannot do this job: the copy is
 * a rectangle, and an ellipse large enough to reach its corners — the end of
 * the eyebrow, the end of the last line — has to be so large it dims the whole
 * frame. The product is taken via destination-in on a scratch layer rather than
 * by stacking translucent bands, because overlapping band edges double-darken
 * and leave visible horizontal stripes.
 */
function paintVeil(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  dpr: number,
  box: Box,
  alpha: number,
) {
  const { w, h } = L;
  const padX = Math.max(w * 0.02, 14);
  const padY = Math.max(h * 0.03, 16);
  // Feathers scale with the region. A fixed feather sized for the whole copy
  // block would wrap a 34px eyebrow in a pool wider than the headline.
  const fx = Math.min(Math.max((box.x1 - box.x0) * 0.7, 90), w * 0.12);
  const fy = Math.min(Math.max((box.y1 - box.y0) * 1.6, 70), h * 0.15);

  const scratch = document.createElement("canvas");
  scratch.width = Math.max(1, Math.round(w * dpr));
  scratch.height = Math.max(1, Math.round(h * dpr));
  const s = scratch.getContext("2d");
  if (!s) return;
  s.setTransform(dpr, 0, 0, dpr, 0, 0);

  const x0 = box.x0 - padX;
  const x1 = box.x1 + padX;
  s.fillStyle = profile(s, false, [x0 - fx, x0, x1, x1 + fx], "10,12,11");
  s.fillRect(0, 0, w, h);

  const y0 = box.y0 - padY;
  const y1 = box.y1 + padY;
  s.globalCompositeOperation = "destination-in";
  s.fillStyle = profile(s, true, [y0 - fy, y0, y1, y1 + fy], "0,0,0");
  s.fillRect(0, 0, w, h);

  ctx.globalAlpha = alpha;
  ctx.drawImage(scratch, 0, 0, w, h);
  ctx.globalAlpha = 1;
}

/** Light wash over a whole copy block, enough for display type at 3:1. */
const BASE_VEIL = 0.4;
/** Extra, only where small text sits. Stacks with the base to about 0.75. */
const STRONG_VEIL = 0.58;

function drawOverlays(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  dpr: number,
  regions: { base: Box; strong: Box[] }[],
) {
  const { w, h } = L;
  ctx.clearRect(0, 0, w, h);

  for (const r of regions) {
    paintVeil(ctx, L, dpr, r.base, BASE_VEIL);
    for (const box of r.strong) paintVeil(ctx, L, dpr, box, STRONG_VEIL);
  }

  // Ground veil: darkens the near silhouettes toward the bottom edge, which
  // anchors the composition rather than letting it run off the frame.
  const ground = ctx.createLinearGradient(0, h * 0.82, 0, h);
  ground.addColorStop(0, "rgba(10,12,11,0)");
  ground.addColorStop(1, "rgba(10,12,11,0.55)");
  ctx.fillStyle = ground;
  ctx.fillRect(0, h * 0.82, w, h * 0.18);

  const vignette = ctx.createRadialGradient(
    w * 0.5,
    h * 0.44,
    h * 0.34,
    w * 0.5,
    h * 0.5,
    h * 1.05,
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.58)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

/** Sampled slightly past both edges, so parallax cannot shift a ridge far
 *  enough to reveal the frame edge. */
const OVERSCAN = 0.03;
/** Headroom below the frame, so scroll parallax cannot lift a fill off the
 *  bottom edge and expose the backdrop under it. */
const UNDERSCAN = 140;

const INTRO_MS = 1500;
/** Fraction of the intro spent staggering ridge starts, back to front. */
const INTRO_SPREAD = 0.42;
/** How much later the right edge of a ridge starts rising than its left edge.
 *  This is what makes each crest read as tracing rather than simply growing. */
const INTRO_LEAD = 0.55;

/**
 * Ridges at or below this depth are treated as the far field: frozen, and
 * rendered once into a cached layer at reduced resolution.
 */
const FAR_F = 0.45;
/**
 * The far field is drawn at a third of scale and composited back up, so the
 * upscale itself supplies the depth-of-field softness. `ctx.filter = blur()`
 * is the obvious way to do this and it measured at 283ms a frame against
 * 16.8ms without — and even cached it would stall the first paint. Downscaling
 * is cheaper than drawing the group sharp, because it is a ninth of the fill.
 */
const FAR_SCALE = 0.34;
/** Fraction of the intro over which the far field fades up. Distant, hazy
 *  terrain emerging from the haze wants a fade, not a rise. */
const FAR_FADE = 0.3;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

type Frame = {
  t: number;
  pointer: number;
  /** 0..1 intro progress. 1 means fully assembled. */
  reveal: number;
  /** 0..1 hero exit progress, driving vertical parallax. */
  exit: number;
};

type Cache = {
  fills: (string | CanvasGradient)[];
  hazes: CanvasGradient[];
  glows: CanvasGradient[];
  rims: CanvasGradient[];
};

function drawRidges(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  frame: Frame,
  cache: Cache,
  from: number,
  to: number,
) {
  const { w, h, n, gap, s } = L;
  const left = -OVERSCAN * w;
  const right = (1 + OVERSCAN) * w;
  const uSpan = 1 + 2 * OVERSCAN;
  const sweepLen = 1 - INTRO_SPREAD;
  const intro = frame.reveal < 1;

  for (let i = from; i < to; i++) {
    const { f, baseline, amp } = ridgeGeometry(L, i);

    // Back-to-front stagger. Each ridge rises out of its own baseline rather
    // than being clipped in from the side: a clipped fill would drag a hard
    // vertical edge across the frame, whereas modulating amplitude leaves
    // nothing but terrain growing.
    let p = 1;
    let alpha = 1;
    if (intro) {
      p = clamp01(
        (frame.reveal - (i / Math.max(1, n - 1)) * INTRO_SPREAD) / sweepLen,
      );
      if (p <= 0) continue;
      // Opacity tracks the ridge's own progress rather than snapping in early,
      // so the not-yet-risen tail to the right of the sweep stays faint instead
      // of reading as a bright flat gridline.
      alpha = smoothstep(p);
    }

    const xs: number[] = [];
    const ys: number[] = [];
    for (let k = 0; k <= STEPS; k++) {
      const u01 = k / STEPS;
      const u = -OVERSCAN + u01 * uSpan;
      const v = ridgeValue(i, u, frame.t);
      if (intro) {
        // smoothstep rather than an ease-out: the rise has to leave the
        // baseline with zero slope, or the join between risen and unrisen
        // terrain shows as a hard corner travelling across the frame.
        const rise = smoothstep((p - INTRO_LEAD * u01) / (1 - INTRO_LEAD));
        // Unrisen terrain sits collapsed at the foot of the frame rather than
        // flat at its own baseline. Every ridge starts on the same line and
        // fans back to its own depth, which both reads as the field unfolding
        // and hides the flat sections behind one another while they wait.
        ys.push(baseline + (h * 0.99 - baseline) * (1 - rise) - amp * v * rise);
      } else {
        ys.push(baseline - amp * v);
      }
      xs.push(u * w);
    }

    const crest = () => {
      ctx.beginPath();
      ctx.moveTo(xs[0], ys[0]);
      for (let k = 1; k <= STEPS; k++) ctx.lineTo(xs[k], ys[k]);
    };

    // Parallax as a transform rather than a per-point offset, so the cached
    // fill and rim gradients travel with the ridge they belong to.
    ctx.save();
    ctx.translate(
      (frame.pointer - 0.5) * (4 + 1.6 * i),
      -frame.exit * (8 + 5.5 * i),
    );
    if (alpha < 1) ctx.globalAlpha = alpha;

    crest();
    ctx.lineTo(right, h + UNDERSCAN);
    ctx.lineTo(left, h + UNDERSCAN);
    ctx.closePath();
    ctx.fillStyle = cache.fills[i];
    ctx.fill();

    // Rim light over the crest only, never the closed path.
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    crest();
    ctx.strokeStyle = cache.glows[i];
    ctx.lineWidth = 6 * s;
    ctx.stroke();

    crest();
    ctx.strokeStyle = cache.rims[i];
    ctx.lineWidth = (0.85 + 0.95 * f) * s;
    ctx.stroke();

    ctx.restore();

    // Veil over everything behind this ridge. Canvas gradients clamp past
    // their endpoints, so filling from y=0 gives a solid haze above the crest.
    if (i < n - 1) {
      if (alpha < 1) ctx.globalAlpha = alpha;
      ctx.fillStyle = cache.hazes[i];
      ctx.fillRect(left, 0, right - left, baseline + gap * 3);
      ctx.globalAlpha = 1;
    }
  }
  ctx.globalAlpha = 1;
}

/**
 * Rim light shaped along the crest instead of a flat alpha. The afterglow sits
 * at 0.64W, so a crest facing it should catch more light than one at the dark
 * left edge, and a uniform stroke is the main thing that made the earlier
 * version read as a drawn line rather than a lit edge.
 */
function litStroke(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  color: RGB,
  peak: number,
) {
  const g = ctx.createLinearGradient(0, 0, L.w, 0);
  for (const [stop, k] of TOWARD_LIGHT)
    g.addColorStop(stop, rgba(color, peak * k));
  return g;
}

function buildCache(ctx: CanvasRenderingContext2D, L: Layout): Cache {
  const fills: (string | CanvasGradient)[] = [];
  const hazes: CanvasGradient[] = [];
  const glows: CanvasGradient[] = [];
  const rims: CanvasGradient[] = [];
  for (let i = 0; i < L.n; i++) {
    const { f, baseline, amp } = ridgeGeometry(L, i);
    const paint = ridgeFill(f);
    if (paint.flat) {
      fills.push(paint.flat);
    } else {
      const g = ctx.createLinearGradient(
        0,
        baseline - amp,
        0,
        baseline + L.gap * 2,
      );
      g.addColorStop(0, paint.from);
      g.addColorStop(1, paint.to);
      fills.push(g);
    }

    /**
     * Haze veil over everything behind this ridge. Applied at full strength
     * from the top of the canvas it would stack to well over 1.0 across twelve
     * ridges and bury the aurora and star field the backdrop exists to draw, so
     * the strength is concentrated into a band hugging the crest and the
     * sky-side clamp is kept low enough that the accumulated wash stays around
     * a third. Distance still reads: the fill ramp from HAZE to NEAR carries
     * most of it, and the veil is still cumulative, just gently.
     */
    const top = baseline - amp * 1.7;
    const bottom = baseline + L.gap * 3;
    const haze = ctx.createLinearGradient(0, top, 0, bottom);
    const crestStop = Math.min(
      0.95,
      Math.max(0.05, (amp * 1.1) / (bottom - top)),
    );
    haze.addColorStop(0, `rgba(34,50,45,${(0.05 * (1 - f)).toFixed(4)})`);
    haze.addColorStop(
      crestStop,
      `rgba(34,50,45,${(0.22 * (1 - f)).toFixed(4)})`,
    );
    haze.addColorStop(1, "rgba(34,50,45,0)");
    hazes.push(haze);

    glows.push(litStroke(ctx, L, ACCENT, 0.05 + 0.15 * f));
    rims.push(litStroke(ctx, L, f > 0.68 ? CREAM : ACCENT, 0.13 + 0.8 * f));
  }
  return { fills, hazes, glows, rims };
}

/** Does this element, or anything between it and `root`, paint its own opaque
 *  background? Such text needs no protection from the scene behind it. */
function opaqueBacked(el: Element, root: Element) {
  let node: Element | null = el;
  while (node) {
    const bg = getComputedStyle(node).backgroundColor;
    const m = bg.match(/^rgba?\(([^)]+)\)/);
    if (m) {
      const parts = m[1].split(",").map((v) => parseFloat(v));
      if (parts.length < 4 || parts[3] >= 0.85) return true;
    }
    if (node === root) break;
    node = node.parentElement;
  }
  return false;
}

const union = (a: Box, b: Box): Box => ({
  x0: Math.min(a.x0, b.x0),
  y0: Math.min(a.y0, b.y0),
  x1: Math.max(a.x1, b.x1),
  y1: Math.max(a.y1, b.y1),
});

const overlaps = (a: Box, pad: number, b: Box) =>
  a.x0 - pad < b.x1 && b.x0 - pad < a.x1 && a.y0 - pad < b.y1 && b.y0 - pad < a.y1;

/**
 * What actually has to stay legible inside `root`, split by how much
 * protection each part needs. Element boxes are the wrong unit — a block-level
 * paragraph spans its whole container — so this measures glyph rectangles.
 *
 * The split matters: WCAG asks 3:1 of the huge display type and 4.5:1 of the
 * 11px mono, and covering both at the stricter figure means darkening the
 * largest area of the composition to protect its smallest text.
 */
function protectRegions(root: HTMLElement, origin: DOMRect) {
  const perElement = new Map<Element, { box: Box; small: boolean }>();

  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walk.nextNode();
  while (node) {
    const el = node.parentElement;
    if (node.nodeValue?.trim() && el && !opaqueBacked(el, root)) {
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of Array.from(range.getClientRects())) {
        if (r.width < 1 || r.height < 1) continue;
        const box: Box = {
          x0: r.left - origin.left,
          y0: r.top - origin.top,
          x1: r.right - origin.left,
          y1: r.bottom - origin.top,
        };
        const prev = perElement.get(el);
        if (prev) prev.box = union(prev.box, box);
        else {
          const cs = getComputedStyle(el);
          const px = parseFloat(cs.fontSize);
          const bold = parseInt(cs.fontWeight, 10) >= 700;
          perElement.set(el, {
            box,
            small: !(px >= 24 || (px >= 18.66 && bold)),
          });
        }
      }
    }
    node = walk.nextNode();
  }

  const all = [...perElement.values()];
  if (!all.length) return null;

  let base = all[0].box;
  for (const r of all) base = union(base, r.box);

  // Small-text boxes that sit near one another merge, so their feathers do not
  // stack into a darker patch than either needs on its own.
  const strong: Box[] = [];
  for (const r of all) {
    if (!r.small) continue;
    const near = strong.findIndex((s) => overlaps(s, 24, r.box));
    if (near >= 0) strong[near] = union(strong[near], r.box);
    else strong.push({ ...r.box });
  }

  return { base, strong };
}

export function RidgeScene({
  protect = [],
}: {
  /** Elements whose text must stay legible against the rendered canvas. */
  protect?: RefObject<HTMLElement | null>[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let L = layout(1, 1);
    let backdrop: HTMLCanvasElement | null = null;
    let overlays: HTMLCanvasElement | null = null;
    let farField: HTMLCanvasElement | null = null;
    let far = 0;
    let cache: Cache | null = null;
    let raf = 0;
    let running = false;
    let lastFrame = 0;
    let disposed = false;

    // Once per session, not per visit to the route: watching the field assemble
    // is worth 1.5s the first time and an obstacle every time after.
    let introStart = 0;
    let playIntro = false;
    try {
      playIntro = !reduce && sessionStorage.getItem("ridge-intro") !== "done";
    } catch {
      playIntro = !reduce;
    }

    const layerCanvas = (w: number, h: number, dpr: number) => {
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(w * dpr));
      c.height = Math.max(1, Math.round(h * dpr));
      const c2 = c.getContext("2d");
      if (c2) c2.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { c, c2 };
    };

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      L = layout(w, h);

      const b = layerCanvas(w, h, dpr);
      if (b.c2) drawBackdrop(b.c2, L);
      backdrop = b.c;

      const origin = canvas.getBoundingClientRect();
      const regions = protect
        .map((r) => (r.current ? protectRegions(r.current, origin) : null))
        .filter((r): r is { base: Box; strong: Box[] } => r !== null);

      const o = layerCanvas(w, h, dpr);
      if (o.c2) drawOverlays(o.c2, L, dpr, regions);
      overlays = o.c;

      cache = buildCache(ctx, L);

      /**
       * Far field: the rearmost ridges, drawn once at a third of scale and
       * frozen at the settled time. Freezing is invisible because they are the
       * hazy, low-contrast, softened ones, and it buys both the depth of field
       * and most of the per-frame cost back.
       */
      far = farCount(L.n);
      const fl = layerCanvas(w * FAR_SCALE, h * FAR_SCALE, dpr);
      if (fl.c2) {
        fl.c2.setTransform(dpr * FAR_SCALE, 0, 0, dpr * FAR_SCALE, 0, 0);
        drawRidges(
          fl.c2,
          L,
          { t: 3.4, pointer: 0.5, reveal: 1, exit: 0 },
          buildCache(fl.c2, L),
          0,
          far,
        );
      }
      farField = fl.c;
    };

    // Cursor parallax, lerped toward the pointer so it eases rather than snaps.
    let pointerTarget = 0.5;
    let pointer = 0.5;
    let lastScroll = -Infinity;

    const exitAt = (y: number) => clamp01(y / 460);

    const render = (t: number, reveal: number) => {
      const { w, h } = L;
      if (!cache) return;
      ctx.clearRect(0, 0, w, h);
      if (backdrop) ctx.drawImage(backdrop, 0, 0, w, h);

      if (farField) {
        // The far field gets no parallax. Distant things barely move, and
        // holding it still is what makes the near ridges' drift read as depth.
        ctx.globalAlpha = reveal < 1 ? smoothstep(reveal / FAR_FADE) : 1;
        ctx.drawImage(farField, 0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      drawRidges(
        ctx,
        L,
        { t, pointer, reveal, exit: exitAt(window.scrollY) },
        cache,
        far,
        L.n,
      );
      if (overlays) ctx.drawImage(overlays, 0, 0, w, h);
    };

    // Phones settle to one frame: the composition is the point, and a permanent
    // rAF loop is not worth the battery on a device that is mostly scrolled
    // past. They still get the intro, which is 1.5s of work, not a standing cost.
    const staticOnly = () => reduce || L.w < 768;

    const start = performance.now();
    const loop = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);

      const reveal = playIntro ? clamp01((now - introStart) / INTRO_MS) : 1;
      const scrolling = now - lastScroll < 240;
      // ~30fps normally: the undulation is slow enough that 60 buys nothing
      // visible. The intro and the scroll parallax are the two places where a
      // stepped 30fps reads against smooth motion, so they get every frame.
      const budget = reveal < 1 || scrolling ? 0 : 33;
      if (now - lastFrame < budget) return;
      lastFrame = now;

      pointer += (pointerTarget - pointer) * 0.12;
      render(((now - start) / 1000) * 0.35, reveal);

      if (playIntro && reveal >= 1) {
        playIntro = false;
        try {
          sessionStorage.setItem("ridge-intro", "done");
        } catch {}
        if (staticOnly()) stop();
      }
    };

    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const resume = () => {
      if (running || disposed) return;
      if (staticOnly() && !playIntro) return;
      running = true;
      lastFrame = 0;
      raf = requestAnimationFrame(loop);
    };

    const settle = () => {
      rebuild();
      if (playIntro) {
        if (!introStart) introStart = performance.now();
        resume();
      } else if (staticOnly()) {
        stop();
        render(3.4, 1);
      } else if (!running) {
        resume();
      }
    };

    settle();

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(settle, 150);
    };

    // The copy arrives with a staggered y-offset intro and the webfonts swap in
    // after first paint, both of which move the boxes the veils are sized from.
    const settleTimer = window.setTimeout(settle, 1500);
    const ro = new ResizeObserver(onResize);
    for (const r of protect) if (r.current) ro.observe(r.current);
    if (document.fonts) document.fonts.ready.then(onResize).catch(() => {});

    /**
     * The hero is position:fixed and never leaves the viewport, so an
     * IntersectionObserver on it would always report visible. It fades out by
     * ~500px of scroll instead, so that is the real "off-screen" signal.
     */
    const onScroll = () => {
      lastScroll = performance.now();
      if (staticOnly()) return;
      if (window.scrollY > 560) stop();
      else resume();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else onScroll();
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerTarget = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!staticOnly())
      window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      stop();
      ro.disconnect();
      window.clearTimeout(resizeTimer);
      window.clearTimeout(settleTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [protect]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
