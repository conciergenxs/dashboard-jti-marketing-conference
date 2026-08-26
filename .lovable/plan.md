# Grow Beyond Limits — Live Analytics Dashboard

A public, mobile-first live analytics dashboard for JTI Market Conference 2026 (Yogyakarta, 350+ participants), styled from the Market Conference deck: luminous white/light surfaces, electric blue gradients, infinity motifs, premium and progressive rather than techy.

## Visual direction

- Light "luminous blue" base: near-white background with soft blue radial glows, frosted/translucent cards, subtle reflective gradients and curved infinity linework in the background.
- Palette: deep navy text, electric/cyan blue primary, soft sky blue supports, warm gold accent for rewards/awards, JTI green used sparingly for positive deltas.
- Type: bold condensed-feel display headings (uppercase, tight tracking) for KPI numbers and section titles + clean geometric sans for body — matching the deck's headline style.
- Motion everywhere but tasteful: count-up KPI numbers, staggered card reveals on scroll, animated gradient/progress rings, live "pulse" dot, marquee ticker, hover lift + glow, animated chart draw-in, number flip on live updates, spring page transitions, reduced-motion respected.

## Dashboard content (curated from the deck)

Header: event title, Yogyakarta · 3 days, live status pill, last-updated timestamp, day switcher (Day 1 / Day 2 / Day 3).

1. Hero KPI row (4 cards, count-up + live ticks)
   - Registered participants (of 350+ target) with progress ring
   - Checked-in now (Infinity Pass scans)
   - Infinity Points earned (collective)
   - Engagement rate %
2. Live activity pulse — area/line chart of check-ins and hub activity across the day, animated draw-in.
3. Infinity Missions progress — three mission cards (Connect to Win 100 pts, Make More Possible 250 pts, Win Together 500 pts) with animated completion bars and submission counts.
4. Participation by function/department — animated horizontal bar chart (cross-functional mix).
5. JTI Got Talent voting — top finalists leaderboard with animated vote bars and rank-change motion.
6. Growing Together gallery pulse — photos uploaded, likes, top-liked moment card.
7. Infinity Hub engagement breakdown — donut/radial across Personal Journey, Live Interaction, Engagement Hub, Content & Memories.
8. Live activity feed — streaming ticker of new check-ins, mission submissions, uploads.
9. Rewards redeemed — small tiles (enamel pin, tumbler, sticker, desk lamp) with redemption counts.
10. Footer: "Bersama, Pasti Menang!" / Grow Beyond Limits lockup.

Deliberately excluded: travel logistics, venue layouts, F&B, gate/photobooth renders, vendor detail.

## Data

Simulated live demo data in the front end: a seeded dataset plus a small ticker hook that nudges values every few seconds so charts, counters and the feed feel live. No backend.

## Technical notes

- Single route: rewrite `src/routes/index.tsx` as the dashboard, split into components under `src/components/dashboard/`.
- Tokens (colors, radius, gradients, glow shadows) added to `src/styles.css` via `@theme inline`; no hardcoded color utilities.
- Fonts loaded with `<link>` in `src/routes/__root.tsx`.
- Charts: lightweight custom SVG components (animated paths, bars, rings) for full control of motion; `motion` for React for transitions and scroll reveals.
- Mobile-first: single-column stacking, horizontally scrollable KPI strip, touch-friendly targets, no layout shift; verified at mobile and desktop widths.
- Route `head()` with event-specific title, description, og/twitter tags.
