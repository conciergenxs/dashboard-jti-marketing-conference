import { motion } from "motion/react";
import { useState } from "react";
import { Panel } from "./primitives";
import type { Slice } from "@/lib/dashboard-data";

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-5)",
];

export function HubDonut({ hub }: { hub: Slice[] }) {
  const [active, setActive] = useState(0);
  const total = hub.reduce((s, h) => s + h.value, 0);
  const r = 54;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <Panel eyebrow="Infinity Hub" title="Where People Spend Time">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative shrink-0">
          <svg viewBox="0 0 140 140" className="size-36 -rotate-90">
            {hub.map((h, i) => {
              const frac = h.value / total;
              const dash = c * frac;
              const el = (
                <motion.circle
                  key={h.label}
                  cx="70"
                  cy="70"
                  r={r}
                  fill="none"
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={active === i ? 20 : 15}
                  strokeDasharray={`${dash - 3} ${c - dash + 3}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: active === i ? 1 : 0.75 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.12 }}
                  onMouseEnter={() => setActive(i)}
                  className="cursor-pointer transition-all duration-300"
                />
              );
              offset += dash;
              return el;
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="display text-metric font-bold tabular-nums">{hub[active]!.value}%</span>
            <span className="max-w-20 text-center text-label leading-tight text-muted-foreground">
              {hub[active]!.label}
            </span>
          </div>
        </div>
        <ul className="w-full space-y-2">
          {hub.map((h, i) => (
            <li
              key={h.label}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-body transition-colors duration-300 ${
                active === i ? "bg-primary/8" : "hover:bg-surface-2"
              }`}
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="flex-1 truncate text-foreground/85">{h.label}</span>
              <span className="font-semibold tabular-nums">{h.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
