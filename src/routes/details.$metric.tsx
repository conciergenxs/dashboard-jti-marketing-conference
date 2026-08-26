import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ContourField } from "@/components/dashboard/contour-field";
import { METRICS, METRIC_KEYS, type MetricKey } from "@/lib/detail-data";

const PAGE_SIZE = 12;

export const Route = createFileRoute("/details/$metric")({
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
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return config.rows.filter(
      (r) => (group === "all" || r.group === group) && (!q || r.search.includes(q)),
    );
  }, [config.rows, query, group]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const reset = (fn: () => void) => {
    fn();
    setPage(1);
    setOpen(null);
  };

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <ContourField />
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-label font-semibold tracking-[0.14em] text-primary uppercase transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" /> Back to dashboard
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5"
        >
          <p className="text-label font-semibold tracking-[0.22em] text-primary uppercase">
            {config.eyebrow}
          </p>
          <h1 className="display mt-1.5 text-display font-extrabold uppercase">
            <span className="text-gradient">{config.title}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-body text-muted-foreground">{config.description}</p>
        </motion.header>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {METRIC_KEYS.map((k) => (
            <Link
              key={k}
              to="/details/$metric"
              params={{ metric: k }}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-label font-semibold tracking-[0.1em] uppercase transition-colors ${
                k === metric
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-surface/70 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {METRICS[k].title}
            </Link>
          ))}
        </nav>

        <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
          {config.summary.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card p-3.5 sm:p-4"
            >
              <p className="text-label font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {s.label}
              </p>
              <p className="display mt-1.5 text-title font-bold tabular-nums sm:text-metric">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* controls */}
        <div className="glass-card sticky top-3 z-20 mt-5 flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <label className="relative flex min-w-0 flex-1 items-center">
            <Search className="absolute left-3 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => reset(() => setQuery(e.target.value))}
              placeholder="Search name, function, ID…"
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

          <label className="relative flex items-center">
            <SlidersHorizontal className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
            <select
              value={group}
              onChange={(e) => reset(() => setGroup(e.target.value))}
              aria-label={config.filterLabel}
              className="h-11 w-full appearance-none rounded-xl border border-border bg-surface/70 pr-8 pl-9 text-body outline-none transition-colors focus:border-primary/50 sm:w-64"
            >
              <option value="all">All {config.filterLabel.toLowerCase()}s</option>
              {config.filterOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-3 text-label text-muted-foreground">
          From Infinity Hub app records ({config.rows.length} entries) · demo data
        </p>
        <p className="mt-1.5 text-label tracking-[0.14em] text-muted-foreground uppercase">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
          {group !== "all" || query ? " · filtered" : ""}
        </p>

        {/* table (desktop) */}
        <div className="glass-card mt-3 hidden overflow-hidden p-0 sm:block">
          <table className="w-full text-body">
            <thead>
              <tr className="border-b border-border">
                {config.columns.map((c) => (
                  <th
                    key={c.key}
                    className={`px-4 py-3 text-label font-semibold tracking-[0.14em] text-muted-foreground uppercase ${c.align === "right" ? "text-right" : "text-left"}`}
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
                        className={`px-4 py-3 ${c.align === "right" ? "text-right tabular-nums" : ""} ${c.primary ? "font-semibold" : "text-muted-foreground"}`}
                      >
                        {r.cells[c.key]}
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
                .slice(1)
                .slice(-2)
                .map((c) => `${c.label} ${r.cells[c.key]}`)
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
                              <span className="min-w-0 truncate text-body font-medium tabular-nums">
                                {r.cells[c.key]}
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
