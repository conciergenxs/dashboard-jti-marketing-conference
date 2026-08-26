# Deck-Accurate Refresh: Contour Lines, Real Content, Better Mobile UX

Three fixes: the background line motif, content accuracy against the deck, and a stronger mobile experience with filtering and search.

## 1. The line motif (main visual fix)

Today the background uses three dashed, animated squiggles. The deck uses something different: dense bundles of very fine hairlines that sweep across the white page like contour/topographic ribbons — many parallel strokes at slightly varying offsets, fading in and out at the edges, plus one sharp diagonal accent edge (violet-to-blue) bleeding off the left.

Rebuild it as:
- A layered field of 14-20 hairline strokes (0.5-0.75px) sharing one flowing spine, each offset progressively so they read as a woven ribbon, not separate lines.
- Two ribbon bundles: one large sweep behind the hero, one softer bundle low on the page.
- Colour: soft blue-grey at low opacity on white, brightening to luminous blue where bundles cross.
- One diagonal gradient accent edge at the left margin, echoing the deck's violet-blue slash.
- Motion: extremely slow, continuous phase drift of the bundle (no dashed marching ants), plus a single light beam that travels along the spine periodically — matching the deck's "single beam of light travelling continuously" teaser idea. Motion disabled under `prefers-reduced-motion`.

The same hairline bundle becomes a reusable element for panel headers and section dividers so the motif carries through the page.

## 2. Content and copy audit against the deck

Corrections and additions from the deck:
- Hierarchy copy fixed to the deck's three-layer framing: Campaign Belief "Grow Beyond Limits" / Collective Spirit "Bersama, Pasti Menang!" / Event Experience "Infinite Collaboration".
- Day names and their deck taglines: Day 1 Enter the Infinite ("Connect. Belong. Begin Together."), Day 2 Break Beyond ("Align. Challenge. Win Together."), Day 3 Continue Infinity ("Commit. Carry the Momentum. Go Further.").
- Missions get exact deck names, prompts, and point values: 01 Connect to Win (100, base), 02 Make More Possible (250, higher), 03 Win Together (500, highest), each with its real proof requirement summarized.
- Infinity Hub breakdown replaced with the deck's actual eight modules: Personal Journey, Live Interaction, Event Companion, Team Experience, Engagement Hub, Content & Memories, Points & Rewards, Continue Infinity.
- JTI Got Talent categories corrected to the deck's three: Music/Band, Entertainment/Runway Fashion Group, Contemporary Dance — plus the jingle reinterpretation storyline (Jingle Reveal, Create & Interpret, Perform, Grand Finale) as a small stage-progress strip.
- Rewards use the real prize list: GBL Enamel Pin, Coffee Tumbler, GBL Reflective Sticker, GBL Desk Lamp, with the "complete all missions to unlock" rule and the Infinity Wheel note.
- Growing Together panel reframed with the deck's gallery language ("Moments Shared") and AI Infinite Story / Collective Time Capsule progress.
- Day agenda matched to the deck schedule (Day 1 arrival, check-in, welcome dinner & networking night; Day 2 building activities, gala dinner & awards; Day 3 departure).
- Location detail: Hotel Tentrem, Yogyakarta; welcome dinner at Prambanan.

Anything not in the deck gets dropped rather than invented.

## 3. Filters and search

A sticky control bar under the hero:
- Day switcher (existing, restyled as a segmented pill that slides).
- Segment filter: All / Personal Journey / Live Interaction / Engagement / Memories — filters which panels are shown, with animated enter/exit.
- Search field that filters the live feed, missions, talents, and rewards by name in real time, with a result count and clear button.
- On mobile the bar collapses to a search icon plus a filter sheet; it condenses on scroll.

## 4. Mobile UX

- Sticky compact header on scroll: event mark, live dot, current KPI, filter/search access.
- KPIs become a snap-scrolling carousel with dot indicators on small screens instead of a cramped 2x2.
- Charts get larger touch targets, tap-to-inspect tooltips positioned inside the viewport, and fewer x-axis labels on narrow widths.
- Talent and function lists collapse to a top-3 with "show all" expansion.
- Consistent 44px minimum tap targets, safe-area padding, no horizontal overflow at 320px.

## Technical notes

- New `src/components/dashboard/contour-field.tsx` replaces `infinity-background.tsx`; strokes generated from one parametric spine so the bundle stays coherent, animated with a single transform/opacity loop (GPU-friendly, no per-frame React state).
- Content moves into a fuller `src/lib/dashboard-data.ts` with a `segment` tag per panel driving the filter, plus a `searchIndex` string per record.
- New `useDashboardFilters` hook holds day, segment, and query; panels animate in/out with motion layout transitions.
- Mobile carousel uses CSS scroll-snap, not a JS carousel library.
- No new dependencies.
