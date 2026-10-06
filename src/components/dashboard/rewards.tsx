import { motion, useReducedMotion } from "motion/react";
import { Counter, Panel, SeeAll, useEntrance } from "./primitives";
import type { DayData } from "@/lib/dashboard-data";

export function Rewards({ rewards }: { rewards: DayData["rewards"] }) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const total = rewards.reduce((s, r) => s + r.redeemed, 0);
  return (
    <Panel eyebrow="Redemption Corner" title="Prizes Claimed" action={<SeeAll metric="rewards" />}>
      <p className="-mt-3 mb-4 text-label text-muted-foreground">
        <b className="font-semibold text-foreground tabular-nums">{total}</b> prizes handed out ·
        missions or a dinner game → sunglasses, both → the bag too
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {rewards.map((r, i) => (
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
    </Panel>
  );
}
