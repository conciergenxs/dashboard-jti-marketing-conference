import { motion } from "motion/react";
import { DAYS, EVENT, type DayKey } from "@/lib/dashboard-data";
import { LivePill } from "./primitives";

export function DashboardHeader({
  day,
  onDayChange,
}: {
  day: DayKey;
  onDayChange: (d: DayKey) => void;
}) {
  return (
    <header className="pt-5 sm:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:gap-5"
      >
        <div className="flex items-center">
          <LivePill />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h1 className="display text-display font-extrabold uppercase">
              <span className="text-gradient">Grow Beyond</span>
              <br />
              Limits
            </h1>
            <p className="mt-2.5 max-w-none text-body text-muted-foreground">
              {EVENT.subtitle}. See how our {EVENT.target} colleagues check in, finish missions and
              vote across the three event days.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Choose event day"
            className="grid w-full shrink-0 grid-cols-3 gap-1 rounded-xl border border-border bg-surface/70 p-1 sm:w-auto"
          >
            {DAYS.map((d) => {
              const active = d.key === day;
              return (
                <button
                  key={d.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => onDayChange(d.key)}
                  className={`relative min-w-0 rounded-lg px-2 py-1.5 text-center transition-colors duration-300 sm:px-3 sm:py-2 ${
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
                  <span className="relative display block truncate text-[10px] font-semibold uppercase">
                    {d.label}
                  </span>
                  <span
                    className={`relative block truncate text-[10px] ${active ? "text-primary-foreground" : "text-muted-foreground"}`}
                  >
                    {d.caption}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </header>
  );
}
