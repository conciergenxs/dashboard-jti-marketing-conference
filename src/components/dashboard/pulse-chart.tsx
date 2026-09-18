import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Panel } from "./primitives";
import { formatNumber } from "@/lib/dashboard-data";

type Point = { label: string; checkins: number; activity: number };

const W = 720;
const H = 240;
const PAD = 16;

function path(values: number[], max: number, close: boolean) {
  const step = (W - PAD * 2) / (values.length - 1);
  const pts: [number, number][] = values.map((v, i) => [
    PAD + i * step,
    H - PAD - (v / max) * (H - PAD * 2),
  ]);
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  let d = `M ${first[0]} ${first[1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1]!;
    const [x, y] = pts[i]!;
    const cx = (px + x) / 2;
    d += ` C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
  }
  if (close) d += ` L ${last[0]} ${H - PAD} L ${first[0]} ${H - PAD} Z`;
  return { d, pts };
}

export function PulseChart({ points }: { points: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const max = Math.max(...points.map((p) => Math.max(p.checkins, p.activity))) * 1.15;
  const activity = path(
    points.map((p) => p.activity),
    max,
    true,
  );
  const checkins = path(
    points.map((p) => p.checkins),
    max,
    false,
  );
  const active = hover ?? points.length - 1;
  const totalActivity = points.reduce((sum, p) => sum + p.activity, 0) || 1;
  const share = hover === null ? 0 : Math.round((points[hover]!.activity / totalActivity) * 100);

  return (
    <Panel eyebrow="Activity pulse" title="Hub Activity & Check-ins">
      <div className="mb-4 flex flex-wrap items-center gap-4 text-label">
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full bg-accent" /> Hub activity
          <b className="font-semibold text-foreground tabular-nums">
            {formatNumber(points[active]!.activity)}
          </b>
        </span>
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full bg-primary" /> Check-ins
          <b className="font-semibold text-foreground tabular-nums">
            {formatNumber(points[active]!.checkins)}
          </b>
        </span>
        <span className="ml-auto text-muted-foreground tabular-nums">{points[active]!.label}</span>
      </div>

      <div className="relative">
        {/*
        The viewBox is 3:1. With a fixed height at desktop width,
        preserveAspectRatio="meet" capped the scale at 1.0, so the chart drew at
        its native 720px centred inside a ~1050px panel — dead gutters either
        side, and both the full-width axis row and the tooltip (positioned as a
        % of the container) drifted off the data. Locking the box to the
        viewBox's own 3:1 ratio at >=1024px makes the plot fill the panel and
        those percentages map 1:1 again.
      */}
        <svg
          role="img"
          aria-label="Hub activity and check-ins across the day"
          viewBox={`0 0 ${W} ${H}`}
          className="h-48 w-full touch-none sm:h-60 lg:aspect-[3/1] lg:h-auto"
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.42" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((g) => (
            <line
              key={g}
              x1={PAD}
              x2={W - PAD}
              y1={H - PAD - g * (H - PAD * 2)}
              y2={H - PAD - g * (H - PAD * 2)}
              className="stroke-border"
              strokeDasharray="3 6"
            />
          ))}
          <motion.path
            d={activity.d}
            fill="url(#areaFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.5 }}
          />
          <motion.path
            d={
              path(
                points.map((p) => p.activity),
                max,
                false,
              ).d
            }
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d={checkins.d}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="0"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: reduce ? 0 : 1.6,
              delay: reduce ? 0 : 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          {checkins.pts.map(([x, y], i) => (
            <g key={i} onMouseEnter={() => setHover(i)} onTouchStart={() => setHover(i)}>
              <rect x={x - 18} y={0} width={36} height={H} fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r={active === i ? 6 : 3}
                className="fill-background stroke-primary transition-all duration-300"
                strokeWidth={2.5}
              />
              <circle
                cx={activity.pts[i]![0]}
                cy={activity.pts[i]![1]}
                r={active === i ? 5 : 0}
                className="fill-accent transition-all duration-300"
              />
            </g>
          ))}
          {active !== null && (
            <line
              x1={checkins.pts[active]![0]}
              x2={checkins.pts[active]![0]}
              y1={PAD}
              y2={H - PAD}
              className="stroke-primary/30"
            />
          )}
        </svg>
        {hover !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute z-20 w-40 -translate-x-1/2 rounded-xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur-md"
            style={{
              left: `${Math.min(85, Math.max(15, (checkins.pts[hover]![0] / W) * 100))}%`,
              top: `${Math.max(0, (Math.min(checkins.pts[hover]![1], activity.pts[hover]![1]) / H) * 100 - 4)}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <p className="text-label font-semibold tracking-[0.14em] text-muted-foreground uppercase tabular-nums">
              {points[hover]!.label}
            </p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-label">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-primary" /> Check-ins
                </span>
                <b className="font-semibold text-foreground tabular-nums">
                  {formatNumber(points[hover]!.checkins)}
                </b>
              </div>
              <div className="flex items-center justify-between gap-3 text-label">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-accent" /> Hub actions
                </span>
                <b className="font-semibold text-foreground tabular-nums">
                  {formatNumber(points[hover]!.activity)}
                </b>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-1.5 text-label">
                <span className="text-muted-foreground">Share of day</span>
                <b className="font-semibold text-primary tabular-nums">{share}%</b>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <div className="mt-2 flex justify-between text-label text-muted-foreground tabular-nums">
        {points.map((p, i) => (
          <span key={p.label} className={i % 2 && points.length > 8 ? "hidden sm:inline" : ""}>
            {p.label}
          </span>
        ))}
      </div>
    </Panel>
  );
}
