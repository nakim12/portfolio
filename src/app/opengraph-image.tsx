import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/data/profile";
import { ACCENT, BG, hex } from "@/lib/ridge";
import { ridgeSceneDataUri } from "@/lib/ridge-svg";

export const alt = `Nathan Kim — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const accent = hex(ACCENT);
/** Warm cream, reserved for serif display type. */
const DISPLAY = "#efe9dd";

/**
 * Satori has no access to the page's webfonts, so the faces the wordmark is
 * built from are vendored as latin-subset woffs. Without them the card falls
 * back to a single bundled sans and loses the whole point of the exercise:
 * "Nathan Kim." is a two-face, two-temperature lockup, and rendering it in one
 * face makes the preview look like a different site's.
 */
const faces = [
  { file: "inter-400.woff", name: "Inter", weight: 400 as const, style: "normal" as const },
  { file: "inter-700.woff", name: "Inter", weight: 700 as const, style: "normal" as const },
  {
    file: "newsreader-500-italic.woff",
    name: "Newsreader",
    weight: 500 as const,
    style: "italic" as const,
  },
  {
    file: "jetbrains-mono-400.woff",
    name: "JetBrains Mono",
    weight: 400 as const,
    style: "normal" as const,
  },
];

/**
 * The card a link preview shows is the only surface a reader meets before the
 * site itself, so it runs the hero's landscape rather than a flat panel: same
 * ridgeline, same afterglow on the right, copy held to a darkened left column
 * exactly as the hero holds it.
 */
export default async function OpenGraphImage() {
  const fonts = await Promise.all(
    faces.map(async ({ file, ...rest }) => ({
      ...rest,
      data: await readFile(join(process.cwd(), "src/assets/fonts", file)),
    })),
  );

  const scene = ridgeSceneDataUri({ width: size.width, height: size.height });

  // Copy column. The scene's afterglow sits at 0.64 of the width, so holding
  // the text inside this leaves the lit half of the landscape uncovered.
  const column = 640;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          color: "#e8edeb",
          padding: "72px 80px",
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        <img
          src={scene}
          alt=""
          width={size.width}
          height={size.height}
          style={{ position: "absolute", left: 0, top: 0 }}
        />

        {/* Two veils rather than one flat panel. The scene is already dark
            enough on the left that copy clears AA unaided; what these are for
            is subduing the cream rim lights where a hairline would otherwise
            cross a glyph. Heavier than this and the landscape stops reading —
            the card goes back to being the flat slab it used to be. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: size.width,
            height: size.height,
            display: "flex",
            backgroundImage: `linear-gradient(to right, rgba(10,12,11,0.62) 0%, rgba(10,12,11,0.56) 40%, rgba(10,12,11,0.24) 64%, rgba(10,12,11,0) 86%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: size.width,
            height: size.height,
            display: "flex",
            backgroundImage: `linear-gradient(to top, rgba(10,12,11,0.5) 0%, rgba(10,12,11,0.16) 24%, rgba(10,12,11,0) 46%)`,
          }}
        />

        <div
          style={{
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 22,
            color: "#a3ada9",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          nakim
          <span style={{ color: accent }}>.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: column }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 96,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            <span style={{ fontWeight: 700 }}>Nathan</span>
            <span
              style={{
                fontFamily: "Newsreader",
                fontStyle: "italic",
                fontWeight: 500,
                color: DISPLAY,
                marginLeft: 22,
              }}
            >
              Kim
            </span>
            <span style={{ color: accent }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#d5dcd9",
              marginTop: 26,
              lineHeight: 1.25,
            }}
          >
            {profile.headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 25,
            color: accent,
            letterSpacing: "0.01em",
          }}
        >
          Open to roles — Data Science · ML · AI · Analytics
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
