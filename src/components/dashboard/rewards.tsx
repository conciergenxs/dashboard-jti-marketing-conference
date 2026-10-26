import { motion, useReducedMotion } from "motion/react";
import { Counter, Panel, SeeAll, useEntrance } from "./primitives";
import { PRIZE_TOTALS, REDEEMERS, SHORT } from "@/lib/detail-data";

/** The last five hand-overs, newest first. */
const LATEST = [...REDEEMERS]
  .sort((a, b) => (b.rewardAt ?? "").localeCompare(a.rewardAt ?? ""))
  .slice(0, 5);

/**
 * The Redemption Corner's hand-overs, counted from the same per-person records
 * the "See all" page lists — so the tiles and the table always agree.
 */
export function Rewards() {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const total = PRIZE_TOTALS.reduce((s, r) => s + r.redeemed, 0);
  return (
    <Panel eyebrow="Redemption Corner" title="Prizes Claimed" action={<SeeAll metric="rewards" />}>
      <p className="-mt-3 mb-4 border-b border-border/70 pb-3 text-label text-muted-foreground">
        <b className="font-semibold text-foreground tabular-nums">
          <Counter value={total} />
        </b>{" "}
        prizes to{" "}
        <b className="font-semibold text-foreground tabular-nums">
          <Counter value={REDEEMERS.length} />
        </b>{" "}
        people · see who took what
      </p>

      {/* Two up, not three: the catalogue is four items since 20 Oct, and a
          3 + 1 row leaves a hole where a tile should be. */}
      <div className="grid grid-cols-2 gap-2.5">
        {PRIZE_TOTALS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            {...entrance({ opacity: 1, y: 0 })}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.07 }}
            className="rounded-xl border border-border/70 bg-gradient-to-br from-surface to-surface-2 p-3.5"
          >
            <p className="display text-title font-semibold text-primary tabular-nums">
              <Counter value={r.redeemed} />
            </p>
            <p className="mt-1 text-label leading-tight text-muted-foreground">{r.name}</p>
          </motion.div>
        ))}
      </div>

      <p className="mt-5 text-label tracking-[0.12em] text-muted-foreground uppercase">
        Latest hand-overs
      </p>
      <ul className="mt-2 divide-y divide-border/60">
        {LATEST.map((p, i) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, x: -12 }}
            {...entrance({ opacity: 1, x: 0 })}
            transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.2 + i * 0.06 }}
            className="flex items-baseline justify-between gap-3 py-2"
          >
            <span className="min-w-0">
              <span className="block truncate text-body font-semibold text-foreground">
                {p.name}
              </span>
              <span className="block truncate text-label text-muted-foreground">
                {p.prizes.map((x) => SHORT[x]).join(" · ")}
              </span>
            </span>
            <span className="shrink-0 text-label text-muted-foreground tabular-nums">
              {p.rewardAt?.slice(11, 16)}
            </span>
          </motion.li>
        ))}
      </ul>
    </Panel>
  );
}
