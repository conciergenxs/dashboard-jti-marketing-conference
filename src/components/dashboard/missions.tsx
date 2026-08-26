import { motion } from "motion/react";
import { Panel, Counter, SeeAll } from "./primitives";
import { EVENT, type Mission } from "@/lib/dashboard-data";

export function Missions({ missions }: { missions: Mission[] }) {
  const proofs = missions.reduce((s, m) => s + m.submissions, 0);

  return (
    <Panel
      eyebrow="Infinity Missions"
      title="Mission Progress"
      action={
        <div className="flex items-center gap-3">
          <SeeAll metric="missions" />
          <div className="text-right">
          <p className="text-label tracking-[0.16em] text-muted-foreground uppercase">
            Verified so far
          </p>
          <p className="display text-title font-semibold text-primary tabular-nums">
            <Counter value={proofs} />
          </p>
          </div>
        </div>
      }
    >

      <div className="space-y-4">
        {missions.map((m, i) => {
          const pct = Math.min(100, (m.submissions / EVENT.target) * 100);
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl border border-border/70 bg-surface/60 p-4 transition-colors duration-300 hover:border-primary/35"
            >
              <div className="flex items-baseline gap-3">
                <span className="display text-title font-semibold text-primary/35 transition-colors duration-300 group-hover:text-primary/70">
                  {m.index}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="display text-title leading-tight font-semibold uppercase">{m.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-label text-muted-foreground">{m.promise}</p>
                </div>
                <span className="shrink-0 rounded-full border border-primary/25 px-2.5 py-1 text-label font-medium text-primary/90 tabular-nums">
                  +{m.points} pts
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-primary/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className="w-24 shrink-0 text-right text-label text-muted-foreground tabular-nums">
                  <b className="font-semibold text-foreground">
                    <Counter value={m.submissions} />
                  </b>{" "}
                  done
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Panel>
  );
}
