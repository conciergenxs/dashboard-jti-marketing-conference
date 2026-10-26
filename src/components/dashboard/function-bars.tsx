import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Counter, FilterSelect, Panel, SeeAll, useEntrance } from "./primitives";
import type { RoomView } from "@/lib/dashboard-data";

/**
 * Who is in the room, by division — and which room. There are three doors and
 * no average of them, so the filter always names one, and the line under the
 * title follows it.
 */
export function FunctionBars({ room }: { room: RoomView[] }) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const [choice, setChoice] = useState(room[0]!.label);

  const current = room.find((r) => r.label === choice) ?? room[0]!;
  const max = Math.max(1, ...current.divisions.map((d) => d.value));
  const total = Math.max(1, current.present);

  return (
    <Panel eyebrow="Departments" title="Who Is In The Room" action={<SeeAll metric="checkins" />}>
      <p className="-mt-3 mb-4 border-b border-border/70 pb-3 text-label text-muted-foreground">
        <b className="font-semibold text-foreground tabular-nums">
          <Counter value={current.present} />
        </b>{" "}
        checked in at {current.label}
      </p>

      <FilterSelect
        label="Check-in"
        value={choice}
        options={room.map((r) => r.label)}
        onChange={setChoice}
        className="mb-4 h-10 w-full"
      />

      <ul className="space-y-3.5">
        {current.divisions.map((f, i) => (
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
