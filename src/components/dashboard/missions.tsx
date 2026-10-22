import { motion, useReducedMotion } from "motion/react";
import { Panel, Counter, SeeAll, useEntrance } from "./primitives";
import { EVENT, type Mission } from "@/lib/dashboard-data";

export function Missions({ missions, preEvent }: { missions: Mission[]; preEvent: number }) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();

  return (
    <Panel
      eyebrow="Infinity Missions"
      title="Mission Progress"
      action={<SeeAll metric="missions" />}
    >
      <p className="-mt-3 mb-4 text-label text-muted-foreground">
        <b className="font-semibold text-foreground tabular-nums">
          <Counter value={preEvent} />
        </b>{" "}
        ticked Pre-event · re-sends allowed until 17 Nov
      </p>

      <div className="space-y-4">
        {missions.map((m, i) => {
          const pct = Math.min(100, (m.sent / EVENT.target) * 100);
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -16 }}
              {...entrance({ opacity: 1, x: 0 })}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.1 }}
              className="hover-warm rounded-xl border border-border/70 bg-surface/60 p-4"
            >
              <div className="flex items-baseline gap-3">
                <span className="display text-title font-semibold text-primary/35">{m.index}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="display text-body leading-tight font-semibold uppercase">
                    {m.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-2 text-label text-muted-foreground">
                    {m.promise}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-primary/25 px-2.5 py-1 text-label font-medium text-primary/90 tabular-nums">
                  +<Counter value={m.resends} /> re-sends
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-primary/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    {...entrance({ width: `${pct}%` })}
                    transition={{
                      duration: reduce ? 0 : 1.2,
                      delay: reduce ? 0 : 0.2 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
                <span className="w-24 shrink-0 text-right text-label text-muted-foreground tabular-nums">
                  <b className="font-semibold text-foreground">
                    <Counter value={m.sent} />
                  </b>{" "}
                  sent
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Panel>
  );
}
