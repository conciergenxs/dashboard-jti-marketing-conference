import { motion, useReducedMotion } from "motion/react";
import { Building2, Lock, MapPinned } from "lucide-react";
import { Counter, Panel, SeeAll, useEntrance } from "./primitives";
import type { Inspired } from "@/lib/dashboard-data";
import { INSPIRE_VOTE } from "@/lib/detail-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Field is out in the market, Non-Field is Head Office, Verticalized and GSC. */
const ICONS = [MapPinned, Building2];

/**
 * Inspired By You, reported as participation rather than standings. The
 * microsite keeps the peer award's tally sealed until The Infinity Gala on
 * purpose, so this panel answers how much of the roster sent a ballot in each
 * category — and never who is ahead. The ballot closed before the event, so
 * every day shows the same final numbers.
 */
export function InspiredByYou({ inspired }: { inspired: Inspired }) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const share = (n: number) => Math.round((n / Math.max(1, inspired.eligible)) * 100);

  return (
    <Panel
      eyebrow="Inspired By You"
      title="Ballot Participation"
      action={<SeeAll metric="inspire" />}
    >
      <div className="flex h-full flex-col">
        <p className="-mt-3 flex min-w-0 items-center gap-2 text-label text-muted-foreground">
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-semibold tracking-[0.1em] text-primary uppercase">
            <Lock className="size-3" aria-hidden />
            Final
          </span>
          {/* The close date is what a closed ballot is read for, and it is the
              half that survives a 320px line. The full window is on the
              "See all" page. */}
          <span className="min-w-0 truncate">Voting closed {INSPIRE_VOTE.closes}</span>
        </p>

        {/* The metric itself: ballots sent against everyone on the ballot. */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          {...entrance({ opacity: 1, y: 0, scale: 1 })}
          transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
          className="mt-4 flex items-end justify-between gap-3 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] via-surface/50 to-accent/[0.08] p-4"
        >
          <div className="min-w-0">
            <p className="display text-metric font-bold text-foreground tabular-nums">
              <Counter value={share(inspired.any)} suffix="%" />
            </p>
            <p className="mt-1 text-label text-muted-foreground">sent at least one ballot</p>
          </div>
          <p className="shrink-0 text-right text-label text-muted-foreground">
            <b className="block text-body font-semibold text-foreground tabular-nums">
              <Counter value={inspired.any} /> of {inspired.eligible}
            </b>
            registered
          </p>
        </motion.div>

        <div className="mt-3 space-y-3">
          {inspired.categories.map((c, i) => {
            const Icon = ICONS[i % ICONS.length]!;
            const pct = share(c.voters);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -16 }}
                {...entrance({ opacity: 1, x: 0 })}
                transition={{
                  duration: reduce ? 0 : 0.5,
                  delay: reduce ? 0 : 0.1 + i * 0.1,
                }}
                className="hover-warm rounded-xl border border-border/70 bg-surface/60 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0 flex-1">
                    {/* "Non-Field Employee" is too long to truncate kindly on a
                        320px phone, so it wraps rather than losing its noun. */}
                    <p className="display text-body font-semibold uppercase">{c.label}</p>
                    <p className="truncate text-label text-muted-foreground">
                      {pct}% of {inspired.eligible} registered
                    </p>
                  </div>
                  <span className="shrink-0 text-body font-semibold text-foreground tabular-nums">
                    <Counter value={c.voters} />
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-primary/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    {...entrance({ width: `${pct}%` })}
                    transition={{
                      duration: reduce ? 0 : 1.1,
                      delay: reduce ? 0 : 0.25 + i * 0.1,
                      ease: EASE,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* The four exclusive groups the roster splits into. Four labelled
            counts, not four colours: the brand is one blue family, and a
            colour key here would separate worse than the words do. */}
        <p className="mt-5 text-label tracking-[0.12em] text-muted-foreground uppercase">
          Ballot mix
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          {inspired.mix.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              {...entrance({ opacity: 1, y: 0 })}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.3 + i * 0.07 }}
              className="rounded-xl border border-border/70 bg-gradient-to-br from-surface to-surface-2 p-3.5"
            >
              <p className="display text-title font-semibold text-primary tabular-nums">
                <Counter value={m.value} />
              </p>
              <p className="mt-1 text-label leading-tight text-muted-foreground">{m.label}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-auto pt-4 text-label text-muted-foreground">
          One vote per category, and one is enough to tick the passport.
        </p>
      </div>
    </Panel>
  );
}
