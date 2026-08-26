import { AnimatePresence, motion } from "motion/react";
import { Panel, Counter, LivePill } from "./primitives";
import type { Talent } from "@/lib/dashboard-data";

export function TalentBoard({ talents }: { talents: Talent[] }) {
  const ranked = [...talents].sort((a, b) => b.votes - a.votes);
  const max = ranked[0]?.votes ?? 1;

  return (
    <Panel eyebrow="JTI Got Talent" title="Employee Voting" action={<LivePill label="Voting" />}>
      <ul className="space-y-2.5">
        <AnimatePresence initial={false}>
          {ranked.map((t, i) => (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="relative overflow-hidden rounded-xl border border-border/70 bg-surface/60 p-3 transition-colors duration-300 hover:border-accent/45"
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/12 to-accent/10"
                initial={{ width: 0 }}
                animate={{ width: `${(t.votes / max) * 100}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="relative flex items-center gap-3">
                <span
                  className={`display flex size-8 shrink-0 items-center justify-center rounded-lg text-body font-semibold tabular-nums ${
                    i === 0
                      ? "bg-gold/25 text-gold-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="display truncate text-body font-semibold uppercase">{t.name}</p>
                  <p className="truncate text-label text-muted-foreground">{t.act}</p>
                </div>
                <span className="shrink-0 text-body font-semibold text-foreground tabular-nums">
                  <Counter value={t.votes} />
                </span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Panel>
  );
}
