import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Search,
  X,
} from "lucide-react";
import { ContourField } from "@/components/dashboard/contour-field";
import { FilterSelect } from "@/components/dashboard/primitives";
import {
  CHECKED_IN,
  METRICS,
  METRIC_KEYS,
  SUBMITTED,
  type Column,
  type MetricKey,
} from "@/lib/detail-data";

/** The microsite's status badge: Submitted / Not Submitted, Checked in / Not yet. */
function SubmissionBadge({ value }: { value: string }) {
  const on = value === SUBMITTED || value === CHECKED_IN;
  const Icon = on ? Check : CircleDashed;
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-label font-semibold tracking-[0.06em] uppercase ${
        on ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
      }`}
    >
      <Icon className="size-3" />
      {value}
    </span>
  );
}

const cell = (c: Column, value: string | number) =>
  c.badge ? <SubmissionBadge value={String(value)} /> : value;

const PAGE_SIZE = 12;

/**
 * A panel can link straight to its own slice of a table: `?facet=mission&
 * value=01 · Connect to Win` opens this page with that filter already set.
 * The pair only seeds the controls — changing a filter afterwards does not
 * rewrite the address, so a link someone shares keeps opening the view it was
 * made for.
 */
export const Route = createFileRoute("/details/$metric")({
  validateSearch: (search: Record<string, unknown>): { facet?: string; value?: string } => {
    const facet = typeof search["facet"] === "string" ? search["facet"] : "";
    const value = typeof search["value"] === "string" ? search["value"] : "";
    return facet && value ? { facet, value } : {};
  },
  loader: ({ params }) => {
    if (!METRIC_KEYS.includes(params.metric as MetricKey)) throw notFound();
    const m = METRICS[params.metric as MetricKey];
    return { title: m.title, description: m.description };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — Grow Beyond Limits Analytics` : "Unavailable";
    const description =
      loaderData?.description ?? "Detailed metric breakdown for Market Conference 2026.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: MetricDetail,
});

function MetricDetail() {
  const { metric } = Route.useParams();
  const config = METRICS[metric as MetricKey]!;
  const seed = Route.useSearch();
  const [query, setQuery] = useState("");
  const [facets, setFacets] = useState<Record<string, string>>(() =>
    seed.facet && seed.value && config.filters.some((f) => f.key === seed.facet)
      ? { [seed.facet]: seed.value }
      : {},
  );
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => setUpdatedAt(new Date()), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return config.rows.filter(
      (r) =>
        config.filters.every((f) => {
          const v = facets[f.key];
          return !v || v === "all" || r.facets[f.key] === v;
        }) &&
        (!q || r.search.includes(q)),
    );
  }, [config, query, facets]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const isFiltered =
    !!query.trim() || config.filters.some((f) => facets[f.key] && facets[f.key] !== "all");

  const reset = (fn: () => void) => {
    fn();
    setPage(1);
    setOpen(null);
  };

  const stamp = updatedAt
    ? `${updatedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}, ${updatedAt.toLocaleDateString("en-GB")}`
    : "—";

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <ContourField />
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10 xl:max-w-7xl xl:px-10 2xl:max-w-[88rem]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-2 text-label font-semibold text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
        >
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6"
        >
          <h1 className="display text-display font-extrabold uppercase">
            <span className="text-gradient">{config.title}</span>
          </h1>
          <p className="mt-2.5 max-w-2xl text-body text-muted-foreground">{config.description}</p>
        </motion.header>

        {/* controls */}
        <div className="glass-card sticky top-3 z-20 mt-5 flex flex-col gap-2.5 p-3 sm:flex-row sm:items-center">
          {/* The search leads at a quarter of the row once there is room for
              its whole placeholder; below that it takes the space it needs. */}
          <label className="relative flex min-w-0 flex-1 items-center xl:w-1/4 xl:flex-none">
            <Search className="absolute left-3 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => reset(() => setQuery(e.target.value))}
              placeholder="Search name or division…"
              className="h-11 w-full rounded-xl border border-border bg-surface/70 pr-9 pl-9 text-body outline-none transition-colors focus:border-primary/50"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => reset(() => setQuery(""))}
                className="absolute right-2 grid size-7 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </label>

          {/* The filters follow, matched in width and set to the right. */}
          {/* One per row on a phone: two to a row leaves ~135px, and a filter
              that now carries its own name reads "Activity: A…" in that. */}
          <div className="grid grid-cols-1 gap-2.5 sm:flex sm:shrink-0 xl:ml-auto">
            {config.filters.map((f) => (
              <FilterSelect
                key={f.key}
                label={f.label}
                value={facets[f.key] ?? "all"}
                options={f.options}
                allLabel="All"
                onChange={(v) => reset(() => setFacets((st) => ({ ...st, [f.key]: v })))}
                className="sm:w-64"
              />
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-label text-muted-foreground">
          <span className="tabular-nums">Last update {stamp}</span>
          <span className="shrink-0 font-semibold text-foreground tabular-nums">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
            {isFiltered ? " · filtered" : ""}
          </span>
        </div>

        {/* table (desktop) */}
        <div className="glass-card mt-3 hidden overflow-hidden p-0 sm:block">
          <table className="w-full text-body">
            <thead>
              <tr className="border-b border-border">
                {config.columns.map((c) => (
                  <th
                    key={c.key}
                    className={`px-4 py-3 text-left text-label font-semibold tracking-[0.14em] text-muted-foreground uppercase ${c.total ? "w-36 pr-6 text-primary lg:w-44" : ""}`}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false} mode="popLayout">
                {slice.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.015 }}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-primary/5"
                  >
                    {config.columns.map((c) => (
                      <td
                        key={c.key}
                        className={`px-4 py-3 text-left ${c.nowrap ? "whitespace-nowrap" : ""} ${c.numeric ? "tabular-nums" : ""} ${c.primary || c.total ? "font-semibold" : "text-muted-foreground"} ${c.total ? "pr-6 text-foreground" : ""}`}
                      >
                        {cell(c, r.cells[c.key]!)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {slice.length === 0 && (
            <p className="p-8 text-center text-body text-muted-foreground">No matching records.</p>
          )}
        </div>

        {/* accordion (mobile) */}
        <div className="mt-3 space-y-2 sm:hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {slice.map((r) => {
              const first = config.columns[0]!;
              const meta = config.columns
                .slice(1, 3)
                .map((c) => String(r.cells[c.key]))
                .join(" · ");
              const isOpen = open === r.id;
              return (
                <motion.div key={r.id} layout className="glass-card overflow-hidden p-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : r.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="display block truncate text-body font-semibold">
                        {r.cells[first.key]}
                      </span>
                      <span className="block truncate text-label text-muted-foreground">
                        {meta}
                      </span>
                    </span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border/60 px-4 py-3">
                          {config.columns.slice(1).map((c) => (
                            <div
                              key={c.key}
                              className="flex items-baseline justify-between gap-3 py-1"
                            >
                              <span className="text-label tracking-[0.12em] text-muted-foreground uppercase">
                                {c.label}
                              </span>
                              <span className="min-w-0 truncate text-label font-semibold text-foreground tabular-nums">
                                {cell(c, r.cells[c.key]!)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {slice.length === 0 && (
            <p className="glass-card p-8 text-center text-body text-muted-foreground">
              No matching records.
            </p>
          )}
        </div>

        {/* pagination */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-border bg-surface/70 px-4 text-body font-semibold transition-colors hover:border-primary/40 disabled:opacity-40"
          >
            <ChevronLeft className="size-4" /> Prev
          </button>
          <span className="text-label tracking-[0.14em] text-muted-foreground uppercase tabular-nums">
            Page {current} / {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={current === pages}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-border bg-surface/70 px-4 text-body font-semibold transition-colors hover:border-primary/40 disabled:opacity-40"
          >
            Next <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
