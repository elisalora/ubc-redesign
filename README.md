# UBC landing page — redesign study

A single self-contained `index.html` (no build step, no framework) plus local image
assets. Open it directly in a browser, or `python3 -m http.server` from this folder.

Not affiliated with Universal Ballet Competition. This is a design study built from
their public site for review.

## The direction

**Live inside their navy instead of floating on white.** Every competition photograph
UBC owns is shot against the same lit navy cyclorama with their monogram on it. Make the
page ground that exact navy and the photographs stop being pictures pasted onto a page —
the page becomes the backdrop they were shot against.

| Token | Value | Where it came from |
|---|---|---|
| `--navy` | `#002862` | Measured three ways: their markup, their OG image (`#002863` after JPEG), and the `UBC-Logo-Blue.png` pixels (`rgb(0,40,98)`) |
| `--navy-deep` | `#001533` | Derived, for scrims and the footer |
| `--gold` | `#c9a24b` | **Added.** See below |
| `--paper` | `#f4f1ea` | **Added.** One warm light band |

**Type.** Display is Playfair Display — a Didone with the same thick/thin contrast as the
UBC monogram's own letterforms. UI and body are Jost, set in wide-tracked uppercase for
labels, matching the `UNIVERSAL BALLET COMPETITION` lockup under their mark.

**Gold is the one addition.** Navy and white alone give nothing to prioritise with, which
is exactly why the current page has no visual hierarchy — every element shouts at the same
volume. One accent, used only for the register CTA, section numerals, hairlines and "open"
status, buys a hierarchy. It is also the correct accent for an organisation whose entire
purpose is awarding scholarships, and which currently signals that nowhere.

**Paper is the second addition,** used once. Sponsor logos are drawn for light grounds —
UBC's own file is literally named `VB_LogoHorColorLightBkgd` — and eight navy sections in
a row need one breath.

## Facts on this page

Every claim is either verbatim from UBC's own site or visibly marked `TBC`. Nothing is
invented.

- **The 16-city schedule** was read out of the markup of `/semi-finals/`, not out of a
  summariser. A summarising fetch of the same page got three dates wrong (San Francisco,
  Dayton and the April Chicago), which is why it was re-read directly.
- **Registration statuses** (Palm Beach Gardens, Chicago ×2, Houston) are from that same
  markup. These are live values and should be wired to real data, not typed in.
- **`TBC` chips** mark real gaps: dancer count, scholarship total, Grand Prix Finals dates.

## Things that are derived, not typed

Three pieces of state are computed so they cannot rot the way the live site's have:

- **Past / happening-now / upcoming** per competition, from each row's own `data-start`
  and `data-end`.
- **The "next competition" band** under the hero, read off those same rows. It and the
  table can never disagree.
- **The footer copyright year.**

The live site's banner still advertises a registration date in July and its footer still
reads ©2024. Both are the kind of fact a person has to remember to change. Here nobody
has to.

## Defects found on the live site

1. Banner reads "Registration for 2026-2027 Season opens **July 15**" (checked 16 Oct 2026).
2. Footer reads **©2024**.
3. Footer "Email us" points to `http://mjn.ndi.mybluehost.me/contact-minimal/` — the
   Bluehost staging hostname, in production, over plain HTTP.
4. Two contact buttons, two URLs: `/CONTACT` and `/contact`.
5. The season tour graphic (`2025-2026-SEASON-19.png`) is a half-finished image: the dates
   column never rendered, and Chicago is spelled **CHICAG0** with a zero. It is also the
   only place the tour appears on the home page — as a flat image, so it is invisible to
   search and to screen readers.
6. Registration status is baked into the city *name* string ("Chicago, IL- SOLD OUT")
   rather than held as its own field.
7. No date, city, age division, deadline or fee anywhere on the landing page.

## One bug fixed during the build, worth remembering

The mobile drawer is `position:fixed`, but `backdrop-filter` on the sticky nav makes that
nav a **containing block for fixed descendants** — so the drawer sized itself to the nav
(144px) instead of the viewport (844px). The fix drops `backdrop-filter` below 900px.
`.scratch/shot/drawer.js` measures drawer height against viewport height; it failed before
the fix and passes after, so it has a real discriminator.

## Still open

- Grand Prix Finals and Asia Pacific Grand Prix Finals dates.
- Real numbers behind "countless dancers" and "millions of dollars".
- Venue names per city — worth having; a parent books a hotel off them.
- Age divisions and entry fees.
- Photography is UBC's own, pulled from their site for this study. Any public deployment
  needs their say-so.
