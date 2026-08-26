import { motion } from "motion/react";
import { Panel, Counter } from "./primitives";
import type { Slice } from "@/lib/dashboard-data";

export function FunctionBars({ functions }: { functions: Slice[] }) {
  const max = Math.max(...functions.map((f) => f.value));
  const total = functions.reduce((s, f) => s + f.value, 0);

  return (
    <Panel
      eyebrow="Cross-functional mix"
      title="Participation by Function"
      action={
        <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-label text-muted-foreground tabular-nums">
          {total} present
        </span>
      }
    >
      <ul className="space-y-3.5">
        {functions.map((f, i) => (
          <li key={f.label} className="group">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground/85">{f.label}</span>
              <span className="text-muted-foreground tabular-nums">
                <Counter value={f.value} /> · {Math.round((f.value / total) * 100)}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-primary/8">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary/85 to-accent transition-[filter] duration-300 group-hover:brightness-110"
                initial={{ width: 0 }}
                whileInView={{ width: `${(f.value / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
