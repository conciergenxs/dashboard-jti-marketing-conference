# Detail page cleanup, KPI polish & Growing Together rework

## Detail pages (`/details/...`)

- Remove the eyebrow overline above the title so "Back to dashboard" no longer visually collides with the heading. Back becomes a small outlined pill button (muted border, icon + label), clearly separated from the title block.
- Remove the metric chips row. Users reach a detail page only through the "Detail" button on the dashboard metric cards.
- Remove the 3 stacked summary cards — those numbers already live on the home dashboard.
- Replace the two source lines with a single row: left = `Last update 08:41, 26/08/2026`, right = `774 results`. Same baseline, small uppercase label styling, wraps safely on mobile.
- Filters must match the data actually shown:
  - Check-ins: keep Function filter, add a Status filter (Checked in / No show).
  - Missions: the Status column is always "Verified", so drop that column and keep the Mission filter only.
  - Talent / Rewards / Points: keep their single relevant filter.
- Font hierarchy in the mobile accordion: the collapsed row title stays the largest (body, semibold); expanded field labels and values step down to the small label size. No expanded text larger than its own header.
- Copy on the page: short, one-line description, full width (no half-width clamp).

## Dashboard

- Active Day filter tab and the 4 KPI progress rings use a blue gradient (primary → accent) instead of flat fill.
- Each KPI card: a thin separator above a plain text "Detail →" link (no pill/button chrome), full card width.
- "See all" buttons sit on the same line as their panel title.
- Live activity pulse: remove the "Live" chip. JTI Got Talent: remove the "Voting open" chip.
- Reward "+250 pts" style badges become a soft blue outline chip so they don't read as buttons.
- Trim the data-source paragraph under the KPIs to one short sentence, full width.
- Move "What is happening now" (activity feed) to the very bottom of the page, after Rewards.
- Freeze the numbers: no auto-drifting values or auto-appending feed items. Everything is computed once per page load, so figures only change on reload. The "Last update" timestamp reflects that load time.


## Growing Together (Photo Wall)

- Rename "Photos shared" to "Stories shared"; remove the Likes stat.
- Remove the "Most liked moment" block (its source is not explainable).
- Show a small grid of moment thumbnails plus a top-contributor leaderboard (who posted the most), matching the reference dashboard's leaderboard treatment.
- Add a "See all" that opens a new `stories` detail page listing each post: contributor, function, moment/session, time — with search, filter and pagination like the other detail pages.

## Technical notes

- `src/routes/details.$metric.tsx`: header restructure, chips + summary removal, status filter support, meta row, accordion type scale.
- `src/lib/detail-data.ts`: add optional `filters` array per metric (multi-filter), drop the constant Verified column for missions, add a `stories` metric config derived from the existing 350-participant simulation (deterministic, no new data source).
- `src/components/dashboard/kpi-strip.tsx`: SVG `linearGradient` ring stroke + separator/text Detail link.
- `src/components/dashboard/primitives.tsx`: add a text-link variant to `SeeAll`.
- `src/components/dashboard/header.tsx`: gradient active tab.
- `src/components/dashboard/gallery-pulse.tsx`: stats rework, thumbnails, contributor leaderboard.
- `pulse-chart.tsx`, `talent-board.tsx`, `rewards.tsx`: chip/badge changes.
- All colors stay on the existing white/blue tokens; no new palette values.
