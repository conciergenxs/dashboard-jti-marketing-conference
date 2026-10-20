import { motion, useReducedMotion } from "motion/react";
import { Award, Check, Sparkles, Trophy, UtensilsCrossed } from "lucide-react";
import { Counter, Panel, SeeAll, useEntrance } from "./primitives";
import type { Checklist as ChecklistData } from "@/lib/dashboard-data";

/**
 * The passport's checklist as head counts — ticked, not scored: Pre-event
 * (one Infinity Mission sent), Welcome Dinner (took part at a booth),
 * JTI Got Talent (voted), Inspired By You (voted in Field, Non-Field or both).
 */
export function Checklist({
  checklist,
  checkedIn,
}: {
  checklist: ChecklistData;
  checkedIn: number;
}) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const rows = [
    {
      key: "pre",
      label: "Pre-event",
      hint: "an Infinity Mission sent",
      value: checklist.preEvent,
      icon: Sparkles,
    },
    {
      key: "dinner",
      label: "Welcome Dinner",
      hint: "took part at a booth",
      value: checklist.welcomeDinner,
      icon: UtensilsCrossed,
    },
    {
      key: "talent",
      label: "JTI Got Talent",
      hint: "voted for an act",
      value: checklist.talent,
      icon: Trophy,
    },
    {
      key: "award",
      label: "Inspired By You",
      hint: "voted in Field or Non-Field",
      value: checklist.award,
      icon: Award,
    },
  ];
  return (
    <Panel
      eyebrow="Infinity Passport"
      title="Participation Checklist"
      action={<SeeAll metric="checklist" />}
    >
      <p className="-mt-3 mb-4 text-label text-muted-foreground">
        <b className="font-semibold text-foreground tabular-nums">
          <Counter value={checklist.complete} />
        </b>{" "}
        with all four ticked · one tick for taking part
      </p>
      <div className="space-y-3">
        {rows.map((r, i) => {
          const pct = Math.min(100, (r.value / Math.max(1, checkedIn)) * 100);
          return (
            <motion.div
              key={r.key}
              initial={{ opacity: 0, x: -16 }}
              {...entrance({ opacity: 1, x: 0 })}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.1 }}
              className="hover-warm rounded-xl border border-border/70 bg-surface/60 p-3.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full ${
                    r.value > 0
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {r.value > 0 ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : (
                    <r.icon className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="display truncate text-body font-semibold uppercase">{r.label}</p>
                  <p className="truncate text-label text-muted-foreground">{r.hint}</p>
                </div>
                <span className="shrink-0 text-body font-semibold text-foreground tabular-nums">
                  <Counter value={r.value} />
                </span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-primary/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  {...entrance({ width: `${pct}%` })}
                  transition={{
                    duration: reduce ? 0 : 1.1,
                    delay: reduce ? 0 : 0.15 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Panel>
  );
}
