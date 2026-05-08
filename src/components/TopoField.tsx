"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Animated topographic contour map. Uses marching squares over a
 * pseudo-noise field (sum of sines) to render real iso-curves that
 * slowly evolve over time. No external dependencies.
 */
export function TopoField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const setSize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener("resize", setSize);

    // Theme-aware accent (forest green) — refreshed on data-theme flips.
    const readAccent = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#4a7c59";
    let accent = readAccent();
    const themeObserver = new MutationObserver(() => {
      accent = readAccent();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Sample resolution. Smaller cells = smoother contours, more CPU.
    const CELL = window.innerWidth < 640 ? 18 : 14;

    // Pseudo-noise: a sum of sines at different frequencies. Cheap to
    // evaluate and produces a smoothly evolving height field with
    // believable hills and valleys.
    const noise = (x: number, y: number, time: number) =>
      Math.sin(x * 0.011 + time * 0.4) +
      Math.cos(y * 0.014 + time * 0.32) +
      Math.sin((x + y) * 0.008 - time * 0.27) +
      Math.cos((x - y) * 0.01 + time * 0.5) * 0.6;

    // Iso-thresholds — each value is one contour line, evenly spaced.
    const THRESHOLDS = [-1.6, -1.05, -0.5, 0.05, 0.6, 1.15, 1.7];

    let t = 0;
    let raf = 0;
    let running = true;
    let lastFrame = 0;
    // Throttle to ~30fps. Topo lines evolve slowly — extra frames are
    // mostly imperceptible and just burn battery.
    const FRAME_MS = 33;

    const drawContour = (threshold: number, time: number) => {
      const cellsX = Math.ceil(w / CELL) + 1;
      const cellsY = Math.ceil(h / CELL) + 1;

      ctx.beginPath();

      for (let cy = 0; cy < cellsY - 1; cy++) {
        for (let cx = 0; cx < cellsX - 1; cx++) {
          const x0 = cx * CELL;
          const y0 = cy * CELL;
          const x1 = x0 + CELL;
          const y1 = y0 + CELL;

          const v00 = noise(x0, y0, time);
          const v10 = noise(x1, y0, time);
          const v11 = noise(x1, y1, time);
          const v01 = noise(x0, y1, time);

          const tl = v00 > threshold ? 1 : 0;
          const tr = v10 > threshold ? 1 : 0;
          const br = v11 > threshold ? 1 : 0;
          const bl = v01 > threshold ? 1 : 0;
          const idx = (tl << 3) | (tr << 2) | (br << 1) | bl;

          if (idx === 0 || idx === 15) continue;

          // Linear interpolation along edges to find where the contour
          // crosses each cell side.
          const lerp = (v: number, v2: number, p: number, p2: number) =>
            p + ((threshold - v) / (v2 - v)) * (p2 - p);

          const top = { x: lerp(v00, v10, x0, x1), y: y0 };
          const right = { x: x1, y: lerp(v10, v11, y0, y1) };
          const bottom = { x: lerp(v01, v11, x0, x1), y: y1 };
          const left = { x: x0, y: lerp(v00, v01, y0, y1) };

          // 16 marching-squares cases (some are symmetric pairs).
          switch (idx) {
            case 1:
            case 14:
              ctx.moveTo(left.x, left.y);
              ctx.lineTo(bottom.x, bottom.y);
              break;
            case 2:
            case 13:
              ctx.moveTo(bottom.x, bottom.y);
              ctx.lineTo(right.x, right.y);
              break;
            case 3:
            case 12:
              ctx.moveTo(left.x, left.y);
              ctx.lineTo(right.x, right.y);
              break;
            case 4:
            case 11:
              ctx.moveTo(top.x, top.y);
              ctx.lineTo(right.x, right.y);
              break;
            case 5: // saddle
              ctx.moveTo(top.x, top.y);
              ctx.lineTo(right.x, right.y);
              ctx.moveTo(left.x, left.y);
              ctx.lineTo(bottom.x, bottom.y);
              break;
            case 6:
            case 9:
              ctx.moveTo(top.x, top.y);
              ctx.lineTo(bottom.x, bottom.y);
              break;
            case 7:
            case 8:
              ctx.moveTo(left.x, left.y);
              ctx.lineTo(top.x, top.y);
              break;
            case 10: // saddle
              ctx.moveTo(left.x, left.y);
              ctx.lineTo(top.x, top.y);
              ctx.moveTo(bottom.x, bottom.y);
              ctx.lineTo(right.x, right.y);
              break;
          }
        }
      }

      ctx.stroke();
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 0.55;
      ctx.globalAlpha = 0.4;

      const time = t * 0.0055;
      for (const threshold of THRESHOLDS) {
        drawContour(threshold, time);
      }

      ctx.globalAlpha = 1;
      t += 1;
    };
    raf = requestAnimationFrame(step);

    // Pause loop when the hero has been scrolled past — covered by
    // the content panel anyway.
    const onScroll = () => {
      const shouldRun = window.scrollY < window.innerHeight;
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(step);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("scroll", onScroll);
      themeObserver.disconnect();
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
