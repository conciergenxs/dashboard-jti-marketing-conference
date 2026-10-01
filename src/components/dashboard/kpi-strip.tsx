import { motion, useReducedMotion } from "motion/react";
import { ScanLine, Infinity as InfinityIcon, CheckCircle2 } from "lucide-react";
import { Counter, SeeAll } from "./primitives";
import { AGGREGATES, type MetricKey } from "@/lib/detail-data";
import { formatCompact, type DayData, type Kpis } from "@/lib/dashboard-data";

function Ring({ progress, id }: { progress: number; id: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const reduce = useReducedMotion();
  return (
    <svg aria-hidden viewBox="0 0 64 64" className="size-14 -rotate-90">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r={r} className="stroke-primary/12" strokeWidth="6" fill="none" />
      <motion.circle
        cx="32"
        cy="32"
        r={r}
        stroke={`url(#${id})`}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - c * Math.min(1, progress) }}
        transition={{ duration: reduce ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

const MAX_POINTS = AGGREGATES.maxPoints;

export function KpiStrip({ kpis, missions }: { kpis: Kpis; missions: DayData["missions"] }) {
  const reduce = useReducedMotion();
  const submissions = missions.reduce((s, m) => s + m.submissions, 0);
  const submissionCap = Math.max(1, kpis.checkedIn * missions.length);
  const avgPoints = Math.round(kpis.points / Math.max(1, kpis.checkedIn));
  const cards = [
    {
      key: "checked",
      label: "Checked in",
      hint: "scanned at the door",
      value: kpis.checkedIn,
      icon: ScanLine,
      ring: kpis.checkedIn / kpis.registered,
      metric: "checkins" as MetricKey,
    },
    {
      key: "points",
      label: "Points / person",
      hint: `of ${MAX_POINTS.toLocaleString("en-US")} · ${formatCompact(kpis.points)} total`,
      value: avgPoints,
      icon: InfinityIcon,
      ring: avgPoints / MAX_POINTS,
      metric: "points" as MetricKey,
    },
    {
      key: "missions",
      label: "Missions done",
      hint: `of ${submissionCap.toLocaleString("en-US")} possible`,
      value: submissions,
      icon: CheckCircle2,
      ring: submissions / submissionCap,
      metric: "missions" as MetricKey,
    },
  ];

  return (
    // `lg:grid` wins over the unprefixed `flex` at >=1024px and `flex-col` goes
    // inert under grid, so the approved stacked mobile layout is untouched while
    // desktop gets a proper three-up KPI row instead of three near-empty bands.
    <div className="flex flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-3 lg:gap-6 xl:col-span-12 xl:row-start-1">
      {cards.map((c, i) => (
        <motion.article
          key={c.key}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.6,
            delay: reduce ? 0 : i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="glass-card relative flex w-full items-center overflow-hidden p-4 sm:p-5"
        >
          <div className="absolute -top-16 -right-12 size-32 rounded-full bg-accent/15 blur-2xl sm:opacity-60" />
          <div className="relative flex flex-1 items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                {c.label}
              </p>
              <p className="display mt-2 text-metric font-bold text-foreground tabular-nums">
                <Counter value={c.value} />
              </p>
              <p className="mt-2 text-label text-muted-foreground">{c.hint}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <SeeAll metric={c.metric} label="Detail" variant="text" />
              <div className="relative shrink-0">
                <Ring progress={c.ring} id={`ring-${c.key}`} />
                <c.icon className="absolute inset-0 m-auto size-5 text-primary" strokeWidth={1.8} />
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
