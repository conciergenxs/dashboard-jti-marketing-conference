import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Clock } from "lucide-react";
import { Panel, Counter, SeeAll } from "./primitives";
import { VOTING_OPENS_LABEL, type Talent } from "@/lib/dashboard-data";

export function TalentBoard({ talents, votingOpen }: { talents: Talent[]; votingOpen: boolean }) {
  const reduce = useReducedMotion();
  const ranked = [...talents].sort((a, b) => b.votes - a.votes);
  const max = ranked[0]?.votes ?? 1;

  return (
    <Panel eyebrow="JTI Got Talent" title="Vote Leaderboard" action={<SeeAll metric="talent" />}>
      {/* The ballot is hidden on the microsite until its window opens. */}
      {!votingOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-xl border border-dashed border-border bg-surface/60 px-5 py-8 text-center"
        >
          <span className="mx-auto grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
            <Clock className="size-5" />
          </span>
          <p className="display mt-3 text-title font-semibold uppercase">Voting Opens Soon</p>
          <p className="mt-1 text-label text-muted-foreground">
            {VOTING_OPENS_LABEL} · {talents.length} acts in the line-up
          </p>
        </motion.div>
      ) : (
        <ul className="space-y-2.5">
          <AnimatePresence initial={false}>
            {ranked.map((t, i) => (
              <motion.li
                key={t.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }
                }
                className="hover-warm relative overflow-hidden rounded-xl border border-border/70 bg-surface/60 p-3"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/12 to-accent/10"
                  initial={{ width: 0 }}
                  animate={{ width: `${(t.votes / max) * 100}%` }}
                  transition={{ duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="relative flex items-center gap-3">
                  <span
                    className={`display flex size-8 shrink-0 items-center justify-center rounded-lg text-body font-semibold tabular-nums ${
                      i === 0 ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
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
      )}
    </Panel>
  );
}
