import { motion } from "motion/react";
import { Users } from "lucide-react";
import { DAYS, EVENT, type DayKey, type Kpis } from "@/lib/dashboard-data";
import { Counter, LivePill } from "./primitives";

export function DashboardHeader({
  day,
  onDayChange,
  kpis,
}: {
  day: DayKey;
  onDayChange: (d: DayKey) => void;
  kpis: Kpis;
}) {
  // Roving focus for the day switcher: role="tab" promises arrow-key movement,
  // so it has to actually deliver it.
  const move = (i: number) => {
    const next = DAYS[(i + DAYS.length) % DAYS.length]!;
    onDayChange(next.key);
    document.getElementById(`day-tab-${next.key}`)?.focus();
  };

  return (
    <header className="pt-5 sm:pt-10">
      {/*
        Below 1024px this stays the approved single column. At >=1024px it
        becomes a two-column masthead — identity left, live state and controls
        right — which drops the header from ~430px to ~270px so the KPI row and
        the top of the chart land inside the fold on a 1440x900 laptop.
      */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-12 lg:gap-y-4"
      >
        <div className="flex items-center justify-between gap-4 lg:col-span-2 lg:row-start-1">
          <LivePill />
          <img src="/jti-logo.svg" alt="JTI" className="h-6 w-auto shrink-0 sm:h-8 lg:h-9" />
        </div>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2 lg:row-span-2 lg:self-end">
          <h1 className="display text-display font-extrabold uppercase">
            <span className="text-gradient">Grow Beyond</span>
            <br />
            Limits
          </h1>
          <p className="mt-2.5 max-w-none text-body text-muted-foreground lg:max-w-[34rem]">
            {EVENT.subtitle}. See how our {EVENT.target} colleagues check in, finish missions and
            vote across the three event days.
          </p>
        </div>

        <div className="glass-card flex w-full items-center gap-4 px-4 py-3.5 sm:px-5 lg:col-start-2 lg:row-start-3 lg:w-[20rem] lg:justify-self-end">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Users className="size-5 text-primary" strokeWidth={1.8} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Registered
            </p>
            <p className="display text-metric font-bold text-foreground tabular-nums">
              <Counter value={kpis.registered} />
              <span className="ml-2 text-label font-normal tracking-normal text-muted-foreground normal-case">
                of {EVENT.target} invited
              </span>
            </p>
          </div>
        </div>

        <div className="border-t border-border/70 lg:col-span-2 lg:row-start-4" />

        <div
          role="tablist"
          aria-label="Choose event day"
          className="grid w-full grid-cols-3 gap-1 rounded-xl border border-border bg-surface/70 p-1 lg:col-start-2 lg:row-start-2 lg:w-[20rem] lg:justify-self-end"
        >
          {DAYS.map((d, i) => {
            const active = d.key === day;
            return (
              <button
                key={d.key}
                id={`day-tab-${d.key}`}
                role="tab"
                aria-selected={active}
                aria-controls="day-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => onDayChange(d.key)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    move(i + 1);
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    move(i - 1);
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    move(0);
                  } else if (e.key === "End") {
                    e.preventDefault();
                    move(DAYS.length - 1);
                  }
                }}
                className={`relative min-w-0 rounded-lg px-2 py-1.5 text-center transition-colors duration-300 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 ${
                  active ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="day-pill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent shadow-[0_6px_18px_-8px_var(--color-primary)]"
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  />
                )}
                <span className="relative display block truncate text-[12px] font-bold uppercase lg:text-[14px]">
                  {d.label}
                </span>
                <span
                  className={`relative block truncate text-[10px] lg:text-[12px] ${active ? "text-primary-foreground" : "text-muted-foreground"}`}
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
