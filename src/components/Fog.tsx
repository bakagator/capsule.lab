"use client";

import { useEffect, useRef } from "react";

/** バナーにかかる霧。level（0〜1）に向かって、ゆっくり濃く・薄くなる */
export default function Fog({ level }: { level: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef(level);

  useEffect(() => {
    targetRef.current = level;
  }, [level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const puffs = Array.from({ length: 14 }, (_, i) => ({
      x: Math.random(),
      y: 0.15 + Math.random() * 0.85,
      r: 0.25 + Math.random() * 0.3,
      v: (0.004 + Math.random() * 0.008) * (i % 2 ? 1 : -1),
      a: 0.5 + Math.random() * 0.5,
    }));
    const readColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--fog").trim() || "236,240,246";
    let rgb = readColor();
    const scheme = matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => { rgb = readColor(); };
    scheme.addEventListener("change", onScheme);

    let current = reduce ? targetRef.current : 0.9;
    let raf = 0;
    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      current += (targetRef.current - current) * (reduce ? 1 : 0.03);
      if (current > 0.01) {
        const time = reduce ? 0 : t / 1000;
        ctx.fillStyle = `rgba(${rgb}, ${0.55 * current})`;
        ctx.fillRect(0, 0, w, h);
        for (const p of puffs) {
          const x = ((((p.x + p.v * time) % 1.4) + 1.4) % 1.4) - 0.2;
          const cx = x * w, cy = p.y * h, r = p.r * w;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          g.addColorStop(0, `rgba(${rgb}, ${0.75 * p.a * current})`);
          g.addColorStop(1, `rgba(${rgb}, 0)`);
          ctx.fillStyle = g;
          ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      scheme.removeEventListener("change", onScheme);
    };
  }, []);

  return <canvas ref={canvasRef} className="fog" aria-hidden="true" />;
}
