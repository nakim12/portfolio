"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

export function FlowField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
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

    // Read the theme's accent color from CSS so we don't have to hardcode
    // light/dark hex values. We re-read whenever data-theme flips.
    const readAccent = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#166534";
    let accent = readAccent();
    const themeObserver = new MutationObserver(() => {
      accent = readAccent();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const NUM = window.innerWidth < 640 ? 100 : 200;
    const particles: Particle[] = [];

    const spawn = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      life: 80 + Math.random() * 220,
    });
    for (let i = 0; i < NUM; i++) particles.push(spawn());

    let t = 0;
    let raf = 0;
    let running = true;

    const step = () => {
      t += 1;

      // Aggressive fade so each particle leaves only a short comet-tail
      // (~10-15px) instead of a long line. Compositing with
      // `destination-out` lets us do this on a transparent canvas
      // without needing to know the page background color.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.14)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.75;

      for (const p of particles) {
        // Pseudo-noise field: two sine waves at different frequencies
        // produce a smoothly evolving angle field — cheaper than a real
        // simplex implementation and visually similar at this scale.
        const angle =
          (Math.sin(p.x * 0.005 + t * 0.0012) +
            Math.cos(p.y * 0.0042 - t * 0.0009)) *
          Math.PI;

        p.vx += Math.cos(angle) * 0.05;
        p.vy += Math.sin(angle) * 0.05;

        // Mouse repulsion within ~120px so particles part around the
        // cursor — gives the same "alive" feeling as the old spotlight.
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          const d = Math.sqrt(d2) || 1;
          const force = (1 - d / 120) * 0.6;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }

        p.vx *= 0.94;
        p.vy *= 0.94;

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (
          p.life < 0 ||
          p.x < -20 ||
          p.x > w + 20 ||
          p.y < -20 ||
          p.y > h + 20
        ) {
          Object.assign(p, spawn());
        }

        // Draw the particle as a small filled circle. Successive frames
        // overlap into a soft, dotted comet-tail because the canvas
        // fade above only removes a fraction of the alpha each frame.
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    // Pause the loop when the hero is fully scrolled past — the canvas
    // is covered by the content panel anyway, so there's no point
    // burning CPU/battery to draw something nobody can see.
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

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      themeObserver.disconnect();
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
