import {
  ACCENT,
  BG,
  CREAM,
  hex,
  layout,
  type Layout,
  type RGB,
  ridgeFill,
  ridgeGeometry,
  ridgeValue,
  STARS,
  TOWARD_LIGHT,
} from "./ridge";

/**
 * The hero's ridgeline landscape, emitted as a standalone SVG document so it
 * can be rendered where there is no canvas — currently the Open Graph card,
 * which Satori rasterises on the server.
 *
 * It is a transcription of the canvas painter rather than a second design: the
 * same layout, the same mixture geometry, the same fill ramps, rim lights and
 * veils. Two deliberate departures, both forced by the target:
 *
 * - The canvas composites the aurora additively ('lighter'). The nearest SVG
 *   equivalent is screen, which over a near-black sky differs from addition by
 *   the product term and so is visually indistinguishable here.
 * - Crest paths are written out once per stroke pass instead of being shared
 *   via <use>, which costs a few tens of kilobytes against the 500KB
 *   ImageResponse budget and removes a silent failure mode.
 */

type Options = {
  width: number;
  height: number;
  /**
   * The frame to freeze the undulation at. 3.4 is the settled frame the hero
   * renders under reduced motion, so the two show the same terrain.
   */
  t?: number;
  /** Samples per crest. 110 is ~11px per segment at card width. */
  steps?: number;
  /**
   * "frame" is the whole composition, vignetted and grounded so it can stand
   * alone as an image. "band" is the same landscape used as a page header:
   * those two overlays exist to stop a frame running off its own edges, and on
   * a slice four times wider than it is tall they stop reading as light and
   * start reading as heavy shading over most of the width.
   */
  mode?: "frame" | "band";
};

const GROUND = { frame: 0.55, band: 0.22 };
const VIGNETTE = { frame: 0.58, band: 0.22 };

const LIGHTEN = `style="mix-blend-mode:screen"`;

/** Headroom below the frame so fills cannot expose the backdrop beneath them. */
const UNDERSCAN = 140;

const HAZE_VEIL = "#22322d";
const SKY = "#16221f";

const n1 = (v: number) => String(Math.round(v * 10) / 10);
const n4 = (v: number) => String(Math.round(v * 10000) / 10000);

type Stop = [offset: number, color: string, opacity: number];

const stops = (list: Stop[]) =>
  list
    .map(
      ([o, c, a]) =>
        `<stop offset="${n4(o)}" stop-color="${c}" stop-opacity="${n4(a)}"/>`,
    )
    .join("");

const linear = (
  id: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  list: Stop[],
) =>
  `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}">${stops(list)}</linearGradient>`;

/** Centred on its shape's bounding box, so it must be painted onto a circle. */
const radial = (id: string, list: Stop[]) =>
  `<radialGradient id="${id}">${stops(list)}</radialGradient>`;

const litGradient = (id: string, L: Layout, color: RGB, peak: number) =>
  linear(
    id,
    0,
    0,
    L.w,
    0,
    TOWARD_LIGHT.map(([stop, k]): Stop => [stop, hex(color), peak * k]),
  );

export function ridgeSceneSvg({
  width,
  height,
  t = 3.4,
  steps = 110,
  mode = "frame",
}: Options) {
  const L = layout(width, height);
  const { w, h } = L;
  const defs: string[] = [];
  const body: string[] = [];

  defs.push(linear("sky", 0, 0, 0, h * 0.8, [[0, SKY, 0.6], [1, SKY, 0]]));
  body.push(`<rect width="${n1(w)}" height="${n1(h)}" fill="${BG}"/>`);
  body.push(`<rect width="${n1(w)}" height="${n1(h)}" fill="url(#sky)"/>`);

  const boost = 1.55;
  const auroras: [number, number, number, number, RGB, number][] = [
    [0.6, 0.28, 0.39, 0.417, [127, 176, 138], 0.15],
    [0.8, 0.2, 0.305, 0.35, [104, 166, 182], 0.12],
    [0.44, 0.24, 0.271, 0.3, [186, 196, 142], 0.08],
    [0.7, 0.34, 0.254, 0.25, [216, 201, 168], 0.07],
  ];
  auroras.forEach(([cx, cy, rx, ry, color, alpha], i) => {
    const id = `au${i}`;
    defs.push(
      radial(id, [
        [0, hex(color), alpha * boost],
        [1, hex(color), 0],
      ]),
    );
    // Elliptical by squashing a circle, matching how the canvas scales the
    // context before filling a radial gradient.
    const squash = (h * ry * L.skyBand) / (w * rx);
    body.push(
      `<g ${LIGHTEN} transform="translate(${n1(w * cx)} ${n1(h * cy * L.skyBand)}) scale(1 ${n4(squash)})"><circle r="${n1(w * rx)}" fill="url(#${id})"/></g>`,
    );
  });

  const glowR = w * 0.398;
  defs.push(
    radial("afterglow", [
      [0, "#e0d0ac", 0.15 * boost],
      [0.55, hex(ACCENT), 0.055 * boost],
      [1, "#e0d0ac", 0],
    ]),
  );
  body.push(
    `<g ${LIGHTEN} transform="translate(${n1(w * 0.64)} ${n1(h * 0.46 * L.skyBand)}) scale(1 ${n4(L.portrait ? 0.7 : 1)})"><circle r="${n1(glowR)}" fill="url(#afterglow)"/></g>`,
  );

  const starBand = h * 0.58 * L.skyBand;
  for (const star of STARS) {
    const y = star.y * starBand;
    const alpha = (1 - y / starBand) * 0.44 * (0.35 + star.seed * 0.65);
    if (alpha <= 0.002) continue;
    body.push(
      `<circle cx="${n1(star.x * w)}" cy="${n1(y)}" r="${n1(star.radius * Math.min(1.4, L.s))}" fill="#e8edeb" fill-opacity="${n4(alpha)}"/>`,
    );
  }

  const foot = h + UNDERSCAN;
  for (let i = 0; i < L.n; i++) {
    const { f, baseline, amp } = ridgeGeometry(L, i);

    const points: string[] = [];
    for (let k = 0; k <= steps; k++) {
      const u = k / steps;
      points.push(`${n1(u * w)} ${n1(baseline - amp * ridgeValue(i, u, t))}`);
    }
    const crest = `M${points.join("L")}`;

    const paint = ridgeFill(f);
    let fill = paint.flat;
    if (!fill) {
      defs.push(
        linear(`rf${i}`, 0, baseline - amp, 0, baseline + L.gap * 2, [
          [0, paint.from, 1],
          [1, paint.to, 1],
        ]),
      );
      fill = `url(#rf${i})`;
    }
    body.push(
      `<path d="${crest}L${n1(w)} ${n1(foot)}L0 ${n1(foot)}Z" fill="${fill}"/>`,
    );

    // Rim light over the crest only, never the closed path.
    defs.push(litGradient(`rg${i}`, L, ACCENT, 0.05 + 0.15 * f));
    defs.push(
      litGradient(`rr${i}`, L, f > 0.68 ? CREAM : ACCENT, 0.13 + 0.8 * f),
    );
    const cap = `fill="none" stroke-linejoin="round" stroke-linecap="round"`;
    body.push(
      `<path d="${crest}" ${cap} stroke="url(#rg${i})" stroke-width="${n1(6 * L.s)}"/>`,
    );
    body.push(
      `<path d="${crest}" ${cap} stroke="url(#rr${i})" stroke-width="${n1((0.85 + 0.95 * f) * L.s)}"/>`,
    );

    // Veil over everything behind this ridge, concentrated into a band hugging
    // the crest so twelve of them do not accumulate into a wash that buries
    // the aurora. Gradients pad past their endpoints, so filling from y=0
    // gives a solid haze above the crest.
    if (i < L.n - 1) {
      const top = baseline - amp * 1.7;
      const bottom = baseline + L.gap * 3;
      const crestStop = Math.min(
        0.95,
        Math.max(0.05, (amp * 1.1) / (bottom - top)),
      );
      defs.push(
        linear(`rh${i}`, 0, top, 0, bottom, [
          [0, HAZE_VEIL, 0.05 * (1 - f)],
          [crestStop, HAZE_VEIL, 0.22 * (1 - f)],
          [1, HAZE_VEIL, 0],
        ]),
      );
      body.push(
        `<rect width="${n1(w)}" height="${n1(bottom)}" fill="url(#rh${i})"/>`,
      );
    }
  }

  // Anchors the composition to the bottom edge instead of letting the near
  // silhouettes run off the frame.
  defs.push(
    linear("ground", 0, h * 0.82, 0, h, [
      [0, BG, 0],
      [1, BG, GROUND[mode]],
    ]),
  );
  body.push(
    `<rect y="${n1(h * 0.82)}" width="${n1(w)}" height="${n1(h * 0.18)}" fill="url(#ground)"/>`,
  );

  /**
   * Radius from the diagonal rather than from the height. The canvas can key
   * off height because the hero is always near 16:9, but a header band is four
   * times wider than it is tall, and a height-derived radius puts its whole
   * left and right thirds past the outer stop — full shadow across most of the
   * image. The multiplier is set so a 16:9 frame lands where it always did.
   */
  const vigR = Math.hypot(w, h) * 0.49;
  defs.push(
    `<radialGradient id="vignette" gradientUnits="userSpaceOnUse" cx="${n1(w * 0.5)}" cy="${n1(h * 0.5)}" r="${n1(vigR)}">${stops(
      [
        [(h * 0.34) / vigR, "#000000", 0],
        [1, "#000000", VIGNETTE[mode]],
      ],
    )}</radialGradient>`,
  );
  body.push(
    `<rect width="${n1(w)}" height="${n1(h)}" fill="url(#vignette)"/>`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${n1(w)}" height="${n1(h)}" viewBox="0 0 ${n1(w)} ${n1(h)}"><defs>${defs.join("")}</defs>${body.join("")}</svg>`;
}

/** Satori accepts an <img> whose source is a base64 SVG document. */
export function ridgeSceneDataUri(options: Options) {
  const svg = ridgeSceneSvg(options);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
