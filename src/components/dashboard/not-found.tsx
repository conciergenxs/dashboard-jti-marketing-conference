import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { ContourField } from "@/components/dashboard/contour-field";

/**
 * The dead end, in the deck's own language — the same composition the microsite
 * shows, rendered in this app's type scale: the broken Infinity mark, an
 * eyebrow that names the failure, a heading whose accent carries the gradient,
 * two lines of advice on the button's own measure, and one way out.
 *
 * Rendered by the root route's `notFoundComponent`, so it brings its own
 * `<main>` and its own `<ContourField quiet />` — nothing above it supplies either.
 *
 * The entrance is CSS, not motion. This is the one page whose entire payload is
 * static text, so it has to read even if the script never arrives; a motion
 * `initial={{ opacity: 0 }}` would be inlined into the server HTML and leave it
 * blank.
 */
export function NotFound() {
  // The root's title belongs to the working dashboard. A dead link should not
  // look identical to it in the tab bar, in history, or in a screenshot.
  useEffect(() => {
    document.title = "Page not found — Market Conference 2026";
  }, []);

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-x-clip px-5 py-16">
      <ContourField quiet />

      <div className="relative w-full max-w-md text-center">
        <BrokenInfinity className="h-20 w-auto sm:h-24" />

        <p
          className="nf-rise mt-8 text-label font-semibold tracking-[0.22em] text-muted-foreground uppercase"
          style={{ animationDelay: "0.5s" }}
        >
          404 — page not found
        </p>

        <h1
          className="nf-rise display mt-3 text-metric leading-[1.1] font-semibold text-balance"
          style={{ animationDelay: "0.56s" }}
        >
          This link doesn't{" "}
          {/* Held on one line: `background-clip: text` has nothing to span when
              the accent breaks across two, and the phrase is short enough that
              the line above it takes the break instead. */}
          <span className="text-gradient whitespace-nowrap">lead anywhere</span>
        </h1>

        {/* Two lines at every width, on the same measure as the button. */}
        <p
          className="nf-rise mt-4 text-body text-pretty text-muted-foreground"
          style={{ animationDelay: "0.64s" }}
        >
          The address may have changed, or the link lost a few characters on the way here.
        </p>

        <Link
          to="/"
          className="nf-rise group mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-body font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[0_14px_40px_-14px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] active:scale-[0.98]"
          style={{ animationDelay: "0.72s" }}
        >
          Go to the dashboard
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  );
}

/**
 * The Infinity mark with a bite taken out of it.
 *
 * The path is the brand glyph itself, so the shape is the deck's rather than an
 * approximation. `pathLength={1}` normalises the dash units, so the dasharray
 * cuts the gap at a fixed fraction of the loop however the curve is measured —
 * a break in a complete, recognisable mark, which reads far better than a
 * stroke that simply stops short. The faint copy underneath is where the loop
 * should have continued.
 */
const GLYPH =
  "M2 7c0-2.8 2.4-4.2 4.6-2.4C8.9 6.5 11.1 9.5 13.4 11.3 15.6 13 18 11.7 18 9c0-2.8-2.4-4.2-4.6-2.4C11.1 8.4 8.9 11.4 6.6 13";

function BrokenInfinity({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 14" fill="none" aria-hidden className={`nf-pop mx-auto ${className}`}>
      <defs>
        <linearGradient id="nf-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>

      <path
        d={GLYPH}
        stroke="color-mix(in oklab, var(--color-primary) 16%, transparent)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d={GLYPH}
        pathLength={1}
        strokeDasharray="0.38 0.14 0.48"
        stroke="url(#nf-stroke)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
