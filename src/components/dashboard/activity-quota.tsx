import { motion, useReducedMotion } from "motion/react";
import { Counter, Panel, SeeAll, useEntrance } from "./primitives";
import type { ActivityStamps } from "@/lib/dashboard-data";
import { ACTIVITIES, ACTIVITY_DAYS } from "@/lib/detail-data";

/**
 * Who is in the room, activity by activity: the passport's Activity Quota as
 * head counts, against everyone checked in. The Infinite Race is one stamp.
 */
export function ActivityQuota({
  stamps,
  checkedIn,
}: {
  stamps: ActivityStamps;
  checkedIn: number;
}) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const total = stamps.reduce((s, n) => s + n, 0);
  return (
    <Panel
      eyebrow="Infinity Passport"
      title="Activity Quota"
      meta={
        <p className="text-label text-muted-foreground">
          <b className="display mr-1 text-title font-bold text-foreground tabular-nums">
            <Counter value={total} />
          </b>
          stamps
        </p>
      }
      action={<SeeAll metric="activities" />}
    >
      <div className="grid lg:grid-cols-2">
        {ACTIVITY_DAYS.map((group, g) => {
          const rows = ACTIVITIES.map((a, i) => ({ ...a, value: stamps[i] ?? 0 })).filter(
            (a) => a.day === group.day,
          );
          const open = rows.some((r) => r.value > 0);
          return (
            // The two days are separate counts, so they get a rule between
            // them: horizontal while they stack, vertical once they sit side
            // by side.
            <section
              key={group.day}
              className={
                g === 0
                  ? "lg:pr-8"
                  : "mt-6 border-t border-border/70 pt-6 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
              }
            >
              <p className="flex items-baseline justify-between gap-3 border-b border-border/70 pb-2">
                <span className="display text-body font-semibold uppercase">{group.label}</span>
                <span className="text-label text-muted-foreground">{group.caption}</span>
              </p>
              <ul className="mt-1">
                {rows.map((r, i) => {
                  const pct = Math.min(100, (r.value / Math.max(1, checkedIn)) * 100);
                  return (
                    <motion.li
                      key={r.id}
                      initial={{ opacity: 0, x: -12 }}
                      {...entrance({ opacity: 1, x: 0 })}
                      transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : i * 0.06 }}
                      className="border-b border-border/50 py-2.5 last:border-0"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0 truncate text-body font-semibold text-foreground">
                          {r.name}
                        </span>
                        <span className="shrink-0 text-body font-semibold tabular-nums">
                          {open ? (
                            <Counter value={r.value} />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="w-[6rem] shrink-0 whitespace-nowrap text-label tracking-[0.08em] text-muted-foreground uppercase">
                          {r.scan}
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/10">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                            initial={{ width: 0 }}
                            {...entrance({ width: `${pct}%` })}
                            transition={{
                              duration: reduce ? 0 : 1.1,
                              delay: reduce ? 0 : 0.15 + i * 0.06,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
              {!open && (
                <p className="mt-2 text-label text-muted-foreground">Stamps open on 18 Nov.</p>
              )}
            </section>
          );
        })}
      </div>
    </Panel>
  );
}
