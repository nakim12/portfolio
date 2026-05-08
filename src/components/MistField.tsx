"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Drifting fog/mist concentrated as a band along the treeline. Pure
 * WebGL fragment shader — no three.js, no library. The shader runs
 * a fullscreen quad and computes layered FBM noise per pixel for
 * volumetric fog. Theme-aware via JS-driven color uniform.
 */

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Two layers of FBM at different scales/speeds, masked by an asymmetric
// Gaussian centered on the pine treeline (~28% from bottom). The mask
// falls off sharply downward (where trees occlude) and gently upward
// (where mist rises into the sky).
const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = u_time * 0.04;

  float layer1 = fbm(p * 1.8 + vec2(t, 0.0));
  float layer2 = fbm(p * 3.4 - vec2(t * 0.5, 0.0) + layer1 * 0.6);
  float fog = layer1 * 0.6 + layer2 * 0.4;
  // Soft contrast curve — wisps still read as formations but the
  // overall haze is light, not smoggy.
  fog = smoothstep(0.32, 0.72, fog);
  fog = pow(fog, 1.1);

  // Band centered just above the pine tops so it isn't occluded.
  float h = uv.y - 0.34;
  float sigma = h > 0.0 ? 0.22 : 0.10;
  float band = exp(-(h * h) / (sigma * sigma));

  float density = fog * band * 0.55;

  gl_FragColor = vec4(u_color, density);
}
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("MistField shader compile:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function MistField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("MistField link:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Fullscreen quad as two triangles in clip space.
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uColor = gl.getUniformLocation(program, "u_color");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Render at 1.5x DPR max — fog is low-frequency so full retina
    // resolution would be wasted shader cycles.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const setSize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    setSize();
    window.addEventListener("resize", setSize);

    // In light mode the fog is *darker* than the off-white background —
    // a warm gray haze. (Lighter fog over a near-white bg is invisible.)
    // In dark mode it's a lighter sage that glows over near-black.
    const lightFog: [number, number, number] = [0.85, 0.81, 0.74];
    const darkFog: [number, number, number] = [0.7, 0.78, 0.72];
    const detectDark = () => {
      const explicit = document.documentElement.getAttribute("data-theme");
      if (explicit === "dark") return true;
      if (explicit === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };
    let fog = detectDark() ? darkFog : lightFog;

    const themeObserver = new MutationObserver(() => {
      fog = detectDark() ? darkFog : lightFog;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onMqlChange = () => {
      fog = detectDark() ? darkFog : lightFog;
    };
    mql.addEventListener("change", onMqlChange);

    let raf = 0;
    let running = true;
    const start = performance.now();

    const render = (now: number) => {
      const t = (now - start) / 1000;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform3f(uColor, fog[0], fog[1], fog[2]);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    // Pause loop when hero is scrolled past — covered by content panel.
    const onScroll = () => {
      const shouldRun = window.scrollY < window.innerHeight;
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(render);
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
      mql.removeEventListener("change", onMqlChange);
      themeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
