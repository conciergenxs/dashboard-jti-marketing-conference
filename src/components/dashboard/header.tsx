import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";
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
    <header className="pt-7 sm:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:gap-5"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <span className="min-w-0"><LivePill /></span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-label text-muted-foreground tabular-nums">
            <RefreshCw className="size-3 animate-spin [animation-duration:6s]" />
            {updatedAt ? `Updated ${updatedAt.toLocaleTimeString("en-GB")}` : "Syncing…"}
          </span>
        </div>

        <div className="min-w-0">
          <h1 className="display text-display font-extrabold uppercase">
            <span className="text-gradient">Grow Beyond</span>
            <br />
            Limits
          </h1>
          <p className="mt-3 max-w-xl text-body text-muted-foreground">
            {EVENT.subtitle} — live participation analytics for {EVENT.target} JTI Indonesia
            employees across the Infinity Hub.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Event day"
          className="grid grid-cols-3 gap-1.5 rounded-2xl border border-border bg-surface/70 p-1.5"
        >
          {DAYS.map((d) => {
            const active = d.key === day;
            return (
              <button
                key={d.key}
                role="tab"
                aria-selected={active}
                onClick={() => onDayChange(d.key)}
                className={`relative min-w-0 rounded-xl px-2 py-2 text-center transition-colors duration-300 sm:px-4 sm:py-2.5 ${
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="day-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-primary shadow-[0_6px_18px_-8px_var(--color-primary)]"
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  />
                )}
                <span className="display block truncate text-body font-semibold uppercase">
                  {d.label}
                </span>
                <span
                  className={`block truncate text-label ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}
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
