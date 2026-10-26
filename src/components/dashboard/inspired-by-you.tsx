import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Search, Trophy, X } from "lucide-react";
import { Counter, Panel, PanelPager, SeeAll, useEntrance } from "./primitives";
import type { Inspired } from "@/lib/dashboard-data";
import type { AwardStanding } from "@/lib/detail-data";
import { INSPIRE_VOTE } from "@/lib/detail-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Names on a page. */
const PER_PAGE = 8;

/**
 * Inspired By You: who the room voted for, one category at a time.
 *
 * The ballot closed before the event, so every day shows the same final
 * numbers. Rank 1 wears the winner's frame wherever it appears, which on an
 * unsearched first page is the top row — the answer the panel exists to give.
 */
export function InspiredByYou({ inspired }: { inspired: Inspired }) {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const group = inspired.standings[tab] ?? inspired.standings[0]!;
  const share = Math.round((inspired.any / Math.max(1, inspired.eligible)) * 100);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return group.nominees;
    return group.nominees.filter((n) => `${n.name} ${n.fn}`.toLowerCase().includes(q));
  }, [group, query]);

  // A page that no longer exists after a search would render empty.
  const pages = Math.max(1, Math.ceil(matches.length / PER_PAGE));
  const current = Math.min(page, pages - 1);
  const shown = matches.slice(current * PER_PAGE, (current + 1) * PER_PAGE);
  const lead = group.nominees[0]?.votes ?? 1;

  // Roving focus: role="tab" promises arrow keys, so it has to deliver them.
  const move = (i: number) => {
    const next = (i + inspired.standings.length) % inspired.standings.length;
    setTab(next);
    setPage(0);
    document.getElementById(`award-tab-${inspired.standings[next]!.id}`)?.focus();
  };

  return (
    <Panel eyebrow="Inspired By You" title="Award Standings" action={<SeeAll metric="inspire" />}>
      <div className="flex h-full flex-col">
        <p className="-mt-3 border-b border-border/70 pb-3 text-label text-muted-foreground">
          <b className="font-semibold text-foreground tabular-nums">
            <Counter value={inspired.any} /> of {inspired.eligible}
          </b>{" "}
          vote ({share}%) · Closed {INSPIRE_VOTE.closes}
        </p>

        <div
          role="tablist"
          aria-label="Award category"
          className="mt-3.5 grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface/70 p-1"
        >
          {inspired.standings.map((g, i) => {
            const active = i === tab;
            return (
              <button
                key={g.id}
                id={`award-tab-${g.id}`}
                role="tab"
                aria-selected={active}
                aria-controls="award-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => {
                  setTab(i);
                  setPage(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    move(i + 1);
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    move(i - 1);
                  }
                }}
                className={`relative min-w-0 rounded-lg px-2 py-1.5 text-center transition-colors duration-300 ${
                  active ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="award-tab-pill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent shadow-[0_6px_18px_-8px_var(--color-primary)]"
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  />
                )}
                {/* "Non-Field Employee" wraps rather than truncating on a
                    320px phone; the grid keeps both tabs the same height. */}
                <span className="relative display block text-[12px] leading-tight font-bold uppercase">
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>

        <label className="relative mt-2.5 flex items-center">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search name or division…"
            aria-label="Search nominees"
            className="h-10 w-full min-w-0 rounded-xl border border-border bg-surface/70 pr-9 pl-9 text-body outline-none transition-colors duration-200 focus:border-primary/50"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setPage(0);
              }}
              className="absolute right-2 grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors duration-200 hover:text-foreground active:scale-95"
            >
              <X className="size-4" />
            </button>
          )}
        </label>

        <div id="award-panel" role="tabpanel" aria-labelledby={`award-tab-${group.id}`}>
          {shown.length ? (
            <>
              {/* Keyed by position, not by id: paging then slides each row's bar
                  and springs its count to the next name, rather than replaying
                  ten entrances from nothing. */}
              <ol className="mt-2.5 space-y-1.5">
                {shown.map((n, i) => (
                  <Nominee key={i} nominee={n} lead={lead} delay={0.06 + i * 0.03} />
                ))}
              </ol>
              <PanelPager
                page={current}
                pageSize={PER_PAGE}
                total={matches.length}
                unit="nominees"
                onChange={setPage}
                className="mt-3 border-t border-border/70 pt-3"
              />
            </>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-border bg-surface/60 px-3 py-6 text-center text-label text-muted-foreground">
              No one in {group.label} matches “{query.trim()}”.
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}

function Nominee({
  nominee,
  lead,
  delay,
}: {
  nominee: AwardStanding;
  /** The category leader's count, so every bar is read against the same top. */
  lead: number;
  delay: number;
}) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const winner = nominee.rank === 1;
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
