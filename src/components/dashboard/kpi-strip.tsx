import { motion } from "motion/react";
import { Users, ScanLine, Infinity as InfinityIcon, CheckCircle2 } from "lucide-react";
import { Counter, SeeAll } from "./primitives";
import type { MetricKey } from "@/lib/detail-data";
import { EVENT, formatCompact, type DayData, type Kpis } from "@/lib/dashboard-data";

function Ring({ progress }: { progress: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" className="size-14 -rotate-90">
      <circle cx="32" cy="32" r={r} className="stroke-primary/12" strokeWidth="6" fill="none" />
      <motion.circle
        cx="32"
        cy="32"
        r={r}
        stroke="var(--color-primary)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - c * Math.min(1, progress) }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

export function KpiStrip({ kpis, missions }: { kpis: Kpis; missions: DayData["missions"] }) {
  const submissions = missions.reduce((s, m) => s + m.submissions, 0);
  const submissionCap = Math.max(1, kpis.checkedIn * missions.length);
  const avgPoints = Math.round(kpis.points / Math.max(1, kpis.checkedIn));
  const cards = [
    {
      key: "registered",
      label: "Registered",
      hint: `of ${EVENT.target} participants`,
      value: kpis.registered,
      icon: Users,
      ring: kpis.registered / EVENT.target,
      metric: "checkins" as MetricKey,
    },
    {
      key: "checked",
      label: "Checked in",
      hint: "Infinity Pass scans",
      value: kpis.checkedIn,
      icon: ScanLine,
      ring: kpis.checkedIn / kpis.registered,
      metric: "checkins" as MetricKey,
    },
    {
      key: "points",
      label: "Avg points",
      hint: `of 850 max · ${formatCompact(kpis.points)} pts total`,
      value: avgPoints,
      icon: InfinityIcon,
      ring: avgPoints / 850,
      metric: "points" as MetricKey,
    },
    {
      key: "missions",
      label: "Missions verified",
      hint: `of ${submissionCap.toLocaleString("en-US")} possible proofs`,
      value: submissions,
      icon: CheckCircle2,
      ring: submissions / submissionCap,
      metric: "missions" as MetricKey,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((c, i) => (
        <motion.article
          key={c.key}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -5 }}
          className="glass-card group relative overflow-hidden p-4 sm:p-5"
        >
          <div className="absolute -top-16 -right-12 size-32 rounded-full bg-accent/15 blur-2xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-60" />
          <div className="relative flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-label font-semibold tracking-[0.08em] text-muted-foreground uppercase sm:tracking-[0.14em] ">
                {c.label}
              </p>
              <p className="display mt-2 text-metric font-bold text-foreground tabular-nums">
                <Counter value={c.value} />
              </p>
              <p className="mt-2 text-label text-muted-foreground">
                {c.hint}
              </p>
              {c.metric && (
                <div className="mt-3">
                  <SeeAll metric={c.metric} label="Detail" />
                </div>
              )}
            </div>
            <div className="relative shrink-0">
              <Ring progress={c.ring} />
              <c.icon className="absolute inset-0 m-auto size-5 text-primary" strokeWidth={1.8} />
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
