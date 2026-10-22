import { motion, useReducedMotion } from "motion/react";
import { Panel, Counter, useEntrance } from "./primitives";
import type { Slice } from "@/lib/dashboard-data";

export function FunctionBars({ functions }: { functions: Slice[] }) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const max = Math.max(...functions.map((f) => f.value));
  const total = functions.reduce((s, f) => s + f.value, 0);

  return (
    <Panel
      eyebrow="Departments"
      title="Who Is In The Room"
      meta={
        <p className="text-label text-muted-foreground">
          <b className="display mr-1 text-title font-bold text-foreground tabular-nums">
            <Counter value={total} />
          </b>
          checked in
        </p>
      }
    >
      <ul className="space-y-3.5">
        {functions.map((f, i) => (
          <li key={f.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-body">
              <span className="min-w-0 truncate font-medium text-foreground/85">{f.label}</span>
              <span className="shrink-0 text-muted-foreground tabular-nums">
                <Counter value={f.value} /> · {Math.round((f.value / total) * 100)}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-primary/8">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary/85 to-accent"
                initial={{ width: 0 }}
                {...entrance({ width: `${(f.value / max) * 100}%` })}
                transition={{
                  duration: reduce ? 0 : 1,
                  delay: reduce ? 0 : i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
