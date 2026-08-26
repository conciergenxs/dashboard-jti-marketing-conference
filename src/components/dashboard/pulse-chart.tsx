import { motion } from "motion/react";
import { useState } from "react";
import { Panel, LivePill } from "./primitives";
import { formatNumber } from "@/lib/dashboard-data";

type Point = { label: string; checkins: number; activity: number };

const W = 720;
const H = 240;
const PAD = 16;

function path(values: number[], max: number, close: boolean) {
  const step = (W - PAD * 2) / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = PAD + i * step;
    const y = H - PAD - (v / max) * (H - PAD * 2);
    return [x, y] as const;
  });
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const cx = (px + x) / 2;
    d += ` C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
  }
  if (close) d += ` L ${pts[pts.length - 1][0]} ${H - PAD} L ${pts[0][0]} ${H - PAD} Z`;
  return { d, pts };
}

export function PulseChart({ points }: { points: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
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

  return (
    <Panel eyebrow="Live activity pulse" title="Hub Activity & Check-ins" action={<LivePill />}>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full bg-accent" /> Hub activity
          <b className="text-foreground tabular-nums">
            {formatNumber(points[active].activity)}
          </b>
        </span>
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full bg-primary" /> Check-ins
          <b className="text-foreground tabular-nums">{formatNumber(points[active].checkins)}</b>
        </span>
        <span className="ml-auto text-muted-foreground tabular-nums">{points[active].label}</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-48 w-full touch-none sm:h-60"
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
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.path
          d={path(
            points.map((p) => p.activity),
            max,
            false,
          ).d}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ duration: 1.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
              cx={activity.pts[i][0]}
              cy={activity.pts[i][1]}
              r={active === i ? 5 : 0}
              className="fill-accent transition-all duration-300"
            />
          </g>
        ))}
        {active !== null && (
          <line
            x1={checkins.pts[active][0]}
            x2={checkins.pts[active][0]}
            y1={PAD}
            y2={H - PAD}
            className="stroke-primary/30"
          />
        )}
      </svg>
      <div className="mt-2 flex justify-between text-[0.62rem] text-muted-foreground tabular-nums">
        {points.map((p, i) => (
          <span key={p.label} className={i % 2 && points.length > 8 ? "hidden sm:inline" : ""}>
            {p.label}
          </span>
        ))}
      </div>
    </Panel>
  );
}
