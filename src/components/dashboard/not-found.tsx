import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { ContourField } from "@/components/dashboard/contour-field";

/**
 * The dead end, in the dashboard's own language.
 *
 * Rendered by the root route's `notFoundComponent`, so it brings its own
 * `<main>` and its own `<ContourField />` — nothing above it supplies either.
 *
 * Deliberately undecorated: no card, no entrance animation, no gradient on the
 * type. A card here would be a near-white panel on a near-white field with
 * nothing beside it to group against; an opacity-0 entrance would leave the one
 * page whose entire payload is static text blank if the script never arrives;
 * and `text-gradient` restarts when a span wraps, so the accent word renders in
 * two different colours on a phone. Solid primary says the same thing and
 * survives all three.
 */
export function NotFound() {
  // The root's title belongs to the working dashboard. A dead link should not
  // look identical to it in the tab bar, in history, or in a screenshot.
  useEffect(() => {
    document.title = "Page not found — Market Conference 2026";
  }, []);

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-x-clip px-5 py-16">
      <ContourField />

      <div className="relative w-full max-w-md text-center">
        <p className="text-label font-semibold tracking-[0.22em] text-muted-foreground uppercase">
          404 — page not found
        </p>

        <h1 className="display mt-3 text-display font-extrabold text-balance uppercase">
          This link doesn't <span className="text-primary">lead anywhere</span>
        </h1>

        {/* Two lines at every width, on the same measure as the button. */}
        <p className="mt-4 text-body text-pretty text-muted-foreground">
          The address may have changed, or the link lost a few characters on the way here.
        </p>

        <Link
          to="/"
          className="group mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-body font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
        >
          Go to the dashboard
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  );
}
