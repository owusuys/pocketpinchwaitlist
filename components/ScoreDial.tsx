"use client";

import { useEffect, useState } from "react";

/**
 * The brand's signature visual: a radial-tick gauge that mirrors the in-app
 * score screen. 64 ticks sweep across a ~224° arc; the active ticks light up
 * in the verdict color and a needle points to the score.
 *
 * Pure SVG + CSS — no libraries. The needle sweeps up on mount and the number
 * counts up, both disabled under prefers-reduced-motion.
 */

const SCORE = 82; // "Go for it"
const TICK_COUNT = 64;
const ARC_DEGREES = 224; // total sweep
const START_ANGLE = 90 + ARC_DEGREES / 2; // left side, measured clockwise from +x axis going down
const SIZE = 320;
const CENTER = SIZE / 2;
const OUTER_R = 142;
const TICK_LEN = 16;
const NEEDLE_LEN = 104;

function verdictColor(score: number): { color: string; label: string } {
  if (score >= 80) return { color: "var(--verdict-green)", label: "Go for it" };
  if (score >= 55) return { color: "var(--verdict-amber)", label: "Probably fine" };
  if (score >= 30) return { color: "var(--verdict-orange)", label: "Be careful" };
  return { color: "var(--verdict-red)", label: "Not right now" };
}

// Angle (in SVG degrees, clockwise from +x) for a given 0..1 progress along the arc.
function angleFor(progress: number): number {
  // Sweep goes from lower-left, up over the top, to lower-right.
  return START_ANGLE - progress * ARC_DEGREES;
}

// Round to fixed precision so server- and client-rendered SVG coordinates
// serialize to identical strings (avoids React hydration mismatches).
const round = (n: number) => Math.round(n * 1000) / 1000;

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: round(CENTER + radius * Math.cos(rad)),
    // SVG y grows downward; negate so larger angles go up.
    y: round(CENTER - radius * Math.sin(rad)),
  };
}

export default function ScoreDial() {
  const [animated, setAnimated] = useState(false);
  const [display, setDisplay] = useState(0);
  const { color, label } = verdictColor(SCORE);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setAnimated(true);
      setDisplay(SCORE);
      return;
    }

    const start = requestAnimationFrame(() => setAnimated(true));

    // Count-up the number.
    const duration = 900;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(eased * SCORE));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const startCount = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, 150);

    return () => {
      cancelAnimationFrame(start);
      cancelAnimationFrame(raf);
      clearTimeout(startCount);
    };
  }, []);

  const scoreProgress = SCORE / 100;
  const litTicks = Math.round(scoreProgress * TICK_COUNT);

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const p = i / (TICK_COUNT - 1);
    const a = angleFor(p);
    const outer = polar(a, OUTER_R);
    const inner = polar(a, OUTER_R - TICK_LEN);
    const lit = i < litTicks;
    return (
      <line
        key={i}
        x1={inner.x}
        y1={inner.y}
        x2={outer.x}
        y2={outer.y}
        stroke={lit ? color : "var(--ink-hairline)"}
        strokeWidth={lit ? 3 : 2}
        strokeLinecap="round"
        style={{
          opacity: animated ? 1 : lit ? 0 : 0.6,
          transition: `opacity 0.5s ease ${0.15 + p * 0.5}s`,
        }}
      />
    );
  });

  // Needle points to the current score.
  const needleAngle = angleFor(animated ? scoreProgress : 0);
  const needleTip = polar(needleAngle, NEEDLE_LEN);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE * 0.86}`}
        role="img"
        aria-label={`Affordability score ${SCORE} out of 100 — ${label}`}
        className="h-auto w-full"
        style={{ maxWidth: SIZE }}
      >
        {ticks}

        {/* Needle */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          style={{
            transition:
              "x2 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.15s, y2 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.15s",
          }}
        />
        <circle cx={CENTER} cy={CENTER} r={9} fill="var(--ink-tile)" stroke={color} strokeWidth={3} />

        {/* Score readout */}
        <text
          x={CENTER}
          y={CENTER - 6}
          textAnchor="middle"
          fill="var(--ink-text)"
          style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em" }}
        >
          {display}
        </text>
      </svg>

      <div
        className="mt-1 rounded-full px-4 py-1.5 text-sm font-semibold"
        style={{ color, backgroundColor: "color-mix(in srgb, var(--verdict-green) 14%, transparent)" }}
      >
        {label}
      </div>
    </div>
  );
}
