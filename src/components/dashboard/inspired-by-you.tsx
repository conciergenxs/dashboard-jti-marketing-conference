import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Building2, EyeOff, MapPinned, Trophy } from "lucide-react";
import { Counter, Panel, PanelPager, SeeAll, useEntrance } from "./primitives";
import type { Inspired } from "@/lib/dashboard-data";
import type { AwardStanding } from "@/lib/detail-data";
import { INSPIRE_VOTE } from "@/lib/detail-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Field is out in the market, Non-Field is Head Office, Verticalized and GSC. */
const ICONS = [MapPinned, Building2];

/** Runners-up shown at a time. The winner is pinned above and never pages away. */
const PER_PAGE = 3;

/**
 * Inspired By You: who the room voted for, and how much of the room voted.
 *
 * The microsite deliberately shows no tally — a running scoreboard of who is
 * ahead in an award about colleagues invites the wrong behaviour on the night
 * — so the counts live in Redis for whoever reads the winners out. This panel
 * is that read, which is why it says so out loud. The ballot closed before the
 * event, so every day shows the same final numbers.
 */
export function InspiredByYou({ inspired }: { inspired: Inspired }) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const share = Math.round((inspired.any / Math.max(1, inspired.eligible)) * 100);

  return (
    <Panel eyebrow="Inspired By You" title="Award Standings" action={<SeeAll metric="inspire" />}>
      <div className="flex h-full flex-col">
        {/* Both halves of this line earn their place — why it is sealed, and
            when it stops being sealed — so it wraps rather than truncates. */}
        <p className="-mt-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-label text-muted-foreground">
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-semibold tracking-[0.1em] text-primary uppercase">
            <EyeOff className="size-3" aria-hidden />
            Not public
          </span>
          <span className="min-w-0">Closed {INSPIRE_VOTE.closes} · announced at the Gala</span>
        </p>

        <div className="mt-4 space-y-4">
          {inspired.standings.map((group, g) => (
            <CategoryBoard key={group.id} group={group} index={g} />
          ))}
        </div>

        {/* The other half of the metric: how much of the room took part. */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-3.5">
          <p className="min-w-0 text-label text-muted-foreground">
            <b className="font-semibold text-foreground tabular-nums">
              <Counter value={inspired.any} /> of {inspired.eligible}
            </b>{" "}
            sent a ballot · {share}%
          </p>
          <SeeAll metric="inspire-ballots" label="Detail" variant="text" />
        </div>
      </div>
    </Panel>
  );
}

function CategoryBoard({ group, index }: { group: Inspired["standings"][number]; index: number }) {
  const [page, setPage] = useState(0);
  const Icon = ICONS[index % ICONS.length]!;
  const [winner, ...runnersUp] = group.nominees;
  const shown = runnersUp.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <section>
      <p className="flex items-baseline justify-between gap-3 border-b border-border/70 pb-2">
        <span className="display flex min-w-0 items-center gap-2 text-body font-semibold uppercase">
          <Icon className="size-3.5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
          {/* "Non-Field Employee" wraps rather than losing its noun on a 320px
              phone, where the count sits beside it. */}
          <span className="min-w-0">{group.label}</span>
        </span>
        <span className="shrink-0 text-label text-muted-foreground tabular-nums">
          {group.named} of {group.onBallot} named
        </span>
      </p>

      {winner ? (
        <>
          <ol className="mt-2.5 space-y-1.5">
            <Nominee nominee={winner} lead={winner.votes} delay={0.1 + index * 0.1} winner />
            {/* Keyed by position, not by id: paging then slides each row's bar
                and springs its count from the last name to the next, rather
                than replaying three entrances from nothing. */}
            {shown.map((n, i) => (
              <Nominee
                key={i}
                nominee={n}
                lead={winner.votes}
                delay={0.16 + index * 0.1 + i * 0.06}
              />
            ))}
          </ol>
          <PanelPager
            page={page}
            pageSize={PER_PAGE}
            total={group.nominees.length}
            offset={1}
            unit="nominees"
            onChange={setPage}
          />
        </>
      ) : (
        <p className="mt-3 rounded-xl border border-dashed border-border bg-surface/60 px-3 py-4 text-center text-label text-muted-foreground">
          No ballot has named anyone in this category yet.
        </p>
      )}
    </section>
  );
}

function Nominee({
  nominee,
  lead,
  delay,
  winner = false,
}: {
  nominee: AwardStanding;
  /** The category leader's count, so every bar is read against the same top. */
  lead: number;
  delay: number;
  winner?: boolean;
}) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      {...entrance({ opacity: 1, y: 0 })}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28, delay }}
      className={`hover-warm relative overflow-hidden rounded-xl border ${
        winner ? "border-primary/25 bg-surface/90 p-3" : "border-border/70 bg-surface/60 px-3 py-2"
      }`}
    >
      <motion.div
        aria-hidden
        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
          winner ? "from-primary/14 to-accent/12" : "from-primary/8 to-accent/6"
        }`}
        initial={{ width: 0 }}
        {...entrance({ width: `${(nominee.votes / Math.max(1, lead)) * 100}%` })}
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
            winner
              ? "size-8 bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_6px_16px_-8px_var(--color-primary)]"
              : "size-7 bg-secondary text-muted-foreground"
          }`}
        >
          {winner ? (
            <Trophy className="size-4" strokeWidth={2.2} aria-label="Winner" />
          ) : (
            nominee.rank
          )}
        </motion.span>
        <div className="min-w-0 flex-1">
          <p
            className={`display truncate text-body font-semibold uppercase ${
              winner ? "" : "text-foreground/75"
            }`}
          >
            {nominee.name}
          </p>
          {winner && <p className="truncate text-label text-muted-foreground">{nominee.fn}</p>}
        </div>
        <span
          className={`shrink-0 text-body font-semibold tabular-nums ${
            winner ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          <Counter value={nominee.votes} />
        </span>
      </div>
    </motion.li>
  );
}
