import { ImageResponse } from "next/og";

export const alt = "Nathan Kim — Statistics & Data Science · UCSB";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          color: "#fafaf7",
          padding: "80px",
          position: "relative",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: "#4a7c59",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#a1a1aa",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          nakim
          <span style={{ color: "#4a7c59", marginLeft: 2 }}>.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 110,
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            Nathan Kim.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              color: "#a1a1aa",
              marginTop: 28,
              lineHeight: 1.2,
            }}
          >
            Statistics &amp; Data Science · UC Santa Barbara &apos;26
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#4a7c59",
            letterSpacing: "0.02em",
          }}
        >
          Currently — Data Science Intern @ BlueAlpha
        </div>
      </div>
    ),
    { ...size },
  );
}
