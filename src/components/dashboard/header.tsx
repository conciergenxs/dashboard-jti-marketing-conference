import { motion } from "motion/react";
import { MapPin, RefreshCw } from "lucide-react";
import { DAYS, EVENT, type DayKey } from "@/lib/dashboard-data";
import { LivePill } from "./primitives";

export function DashboardHeader({
  day,
  onDayChange,
  updatedAt,
}: {
  day: DayKey;
  onDayChange: (d: DayKey) => void;
  updatedAt: Date | null;
}) {
  return (
    <header className="pt-8 sm:pt-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <LivePill />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-3 py-1 text-[0.68rem] text-muted-foreground">
            <MapPin className="size-3" /> {EVENT.location}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] text-muted-foreground tabular-nums">
            <RefreshCw className="size-3 animate-spin [animation-duration:6s]" />
            {updatedAt ? `Updated ${updatedAt.toLocaleTimeString("en-GB")}` : "Syncing…"}
          </span>
        </div>

        <div>
          <h1 className="display text-4xl leading-[0.95] font-bold tracking-tight uppercase sm:text-6xl lg:text-7xl">
            <span className="text-gradient">Grow Beyond</span>
            <br />
            Limits
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            {EVENT.subtitle} — one hub, infinite journey. Every check-in, mission and moment from
            350+ JTI Indonesia employees, in real time.
          </p>
        </div>

        <div className="mt-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DAYS.map((d) => {
            const active = d.key === day;
            return (
              <button
                key={d.key}
                onClick={() => onDayChange(d.key)}
                className={`relative shrink-0 rounded-xl border px-4 py-2.5 text-left transition-colors duration-300 ${
                  active
                    ? "border-primary/35 text-primary-foreground"
                    : "border-border bg-surface/60 text-foreground hover:border-primary/30"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="day-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-primary to-accent"
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  />
                )}
                <span className="display block text-sm font-bold uppercase">{d.label}</span>
                <span
                  className={`block text-[0.62rem] tracking-wide uppercase ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {d.caption}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </header>
  );
}

export function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden rounded-full border border-primary/15 bg-surface/70 py-2.5">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase"
          >
            <span className="size-1.5 rounded-full bg-accent" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
