import { motion } from "motion/react";
import { Counter, Panel } from "./primitives";
import type { DayData } from "@/lib/dashboard-data";

export function Rewards({ rewards }: { rewards: DayData["rewards"] }) {
  const total = rewards.reduce((s, r) => s + r.redeemed, 0);
  return (
    <Panel
      eyebrow="Infinity Wheel"
      title="Rewards Redeemed"
      action={
        <span className="rounded-full bg-gold/15 px-3 py-1 text-label font-bold text-gold-foreground tabular-nums">
          {total} total
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {rewards.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={{ y: -4, rotate: i % 2 ? 0.8 : -0.8 }}
            className="rounded-xl border border-border/70 bg-gradient-to-br from-surface to-surface-2 p-3.5"
          >
            <p className="display text-title font-bold text-primary tabular-nums">
              <Counter value={r.redeemed} />
            </p>
            <p className="mt-1 text-label leading-tight text-muted-foreground">{r.name}</p>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}
