import { motion } from "motion/react";
import { Users, ScanLine, Infinity as InfinityIcon, Activity } from "lucide-react";
import { Counter } from "./primitives";
import { EVENT, type Kpis } from "@/lib/dashboard-data";

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

export function KpiStrip({ kpis }: { kpis: Kpis }) {
  const cards = [
    {
      key: "registered",
      label: "Registered",
      hint: `of ${EVENT.target}+ target`,
      value: kpis.registered,
      icon: Users,
      ring: kpis.registered / EVENT.target,
    },
    {
      key: "checked",
      label: "Checked in",
      hint: "Infinity Pass scans",
      value: kpis.checkedIn,
      icon: ScanLine,
      ring: kpis.checkedIn / kpis.registered,
    },
    {
      key: "points",
      label: "Infinity Points",
      hint: "collected together",
      value: kpis.points,
      icon: InfinityIcon,
      ring: 0.82,
    },
    {
      key: "engagement",
      label: "Engagement",
      hint: "hub active participants",
      value: kpis.engagement,
      suffix: "%",
      icon: Activity,
      ring: kpis.engagement / 100,
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
              <p className="text-[0.62rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase sm:text-[0.68rem]">
                {c.label}
              </p>
              <p className="display mt-2 text-3xl leading-none font-bold tracking-tight text-foreground tabular-nums sm:text-4xl">
                <Counter value={c.value} suffix={c.suffix ?? ""} />
              </p>
              <p className="mt-2 text-[0.68rem] leading-snug text-muted-foreground sm:text-xs">
                {c.hint}
              </p>
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
