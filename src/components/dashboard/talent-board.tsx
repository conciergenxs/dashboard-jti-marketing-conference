import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Lock, Trophy } from "lucide-react";
import { Counter, Panel, PanelPager, SeeAll, useEntrance } from "./primitives";
import type { Talent } from "@/lib/dashboard-data";
import { TALENT_VOTE } from "@/lib/detail-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Acts shown below the Top 3 at a time. Today's line-up is six, so the pager
 * stays out of the way; it appears by itself if the line-up ever grows.
 */
const PER_PAGE = 3;

/**
 * JTI Got Talent's final standings. The ballot ran before the event and the
 * Top 3 were announced on 5 Nov, so on every event day this board is closed:
 * the Top 3 sit in their own frame, the rest of the line-up below it.
 */
export function TalentBoard({ talents }: { talents: Talent[] }) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const [page, setPage] = useState(0);
  const ranked = [...talents].sort((a, b) => b.votes - a.votes);
  const max = ranked[0]?.votes || 1;
  const rest = ranked.slice(3);
  const total = ranked.reduce((s, t) => s + t.votes, 0);

  return (
    <Panel eyebrow="JTI Got Talent" title="Final Standings" action={<SeeAll metric="talent" />}>
      <p className="-mt-3 mb-4 flex min-w-0 items-center gap-2 text-label text-muted-foreground">
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-semibold tracking-[0.1em] text-primary uppercase">
          <Lock className="size-3" aria-hidden />
          Final
        </span>
        <span className="min-w-0 truncate">
          <b className="font-semibold text-foreground tabular-nums">
            <Counter value={total} />
          </b>{" "}
          votes · voting closed {TALENT_VOTE.closes}
        </span>
      </p>

      <motion.section
        aria-label="Top 3"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        {...entrance({ opacity: 1, y: 0, scale: 1 })}
        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
        className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] via-surface/50 to-accent/[0.08] p-2 sm:p-2.5"
      >
        <div className="flex items-center justify-between gap-3 px-1.5 pt-0.5 pb-2 text-label">
          <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold tracking-[0.14em] text-primary uppercase">
            <Trophy className="size-3.5" aria-hidden />
            Top 3
          </span>
          <span className="min-w-0 truncate text-muted-foreground">
            Announced {TALENT_VOTE.announced}
          </span>
        </div>
        <ol className="space-y-2">
          {ranked.slice(0, 3).map((t, i) => (
            <Standing key={t.id} talent={t} rank={i + 1} max={max} top />
          ))}
        </ol>
      </motion.section>

      {/* Keyed by position, not by id: paging then slides each row's bar and
          springs its count to the next act, rather than replaying the entrance
          from nothing. */}
      <ol className="mt-2.5 space-y-1.5">
        {rest.slice(page * PER_PAGE, (page + 1) * PER_PAGE).map((t, i) => (
          <Standing key={i} talent={t} rank={page * PER_PAGE + i + 4} max={max} />
        ))}
      </ol>
      <PanelPager
        page={page}
        pageSize={PER_PAGE}
        total={ranked.length}
        offset={3}
        unit="acts"
        onChange={setPage}
        className="mt-2.5"
      />
    </Panel>
  );
}

function Standing({
  talent,
  rank,
  max,
  top = false,
}: {
  talent: Talent;
  rank: number;
  max: number;
  top?: boolean;
}) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const delay = 0.08 + (rank - 1) * 0.06;
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      {...entrance({ opacity: 1, y: 0 })}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28, delay }}
      className={`hover-warm relative overflow-hidden rounded-xl border ${
        top ? "border-primary/15 bg-surface/90 p-3" : "border-border/70 bg-surface/60 px-3 py-2"
      }`}
    >
      <motion.div
        aria-hidden
        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
          top ? "from-primary/14 to-accent/12" : "from-primary/8 to-accent/6"
        }`}
        initial={{ width: 0 }}
        {...entrance({ width: `${(talent.votes / max) * 100}%` })}
        transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : delay + 0.1, ease: EASE }}
      />
      <div className="relative flex items-center gap-3">
        <motion.span
          initial={{ opacity: 0, scale: 0.4 }}
          {...entrance({ opacity: 1, scale: 1 })}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 17, delay: delay + 0.15 }
          }
          className={`display grid shrink-0 place-items-center rounded-lg text-label font-bold tabular-nums ${
            top
              ? "size-8 bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_6px_16px_-8px_var(--color-primary)]"
              : "size-7 bg-secondary text-muted-foreground"
          }`}
        >
          {rank}
        </motion.span>
        <div className="min-w-0 flex-1">
          <p
            className={`display truncate text-body font-semibold uppercase ${
              top ? "" : "text-foreground/75"
            }`}
          >
            {talent.name}
          </p>
        </div>
        <span
          className={`shrink-0 text-body font-semibold tabular-nums ${
            top ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          <Counter value={talent.votes} />
        </span>
      </div>
    </motion.li>
  );
}
