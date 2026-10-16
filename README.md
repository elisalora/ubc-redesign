# UBC landing page — redesign study

A single self-contained `index.html` (no build step, no framework) plus local assets.
Open it directly in a browser, or `python3 -m http.server` from this folder.

Not affiliated with Universal Ballet Competition. This is a design study built from
their public site for review.

## The direction

**Live inside their navy instead of floating on white.** Every competition photograph
UBC owns is shot against the same lit navy cyclorama with their monogram on it. Make the
page ground that navy and the photographs stop being pictures pasted onto a page — the
page becomes the backdrop they were shot against.

And **their navy is not flat.** Their hero is a radial glow running from `#003D7B` at the
lit corner down to `#001D3C` at the far edge, like a spotlight raking a cyc. That glow is
what reads as shimmer. A flat navy loses it, which is exactly what the first pass did.

| Token | Value | Where it came from |
|---|---|---|
| `--navy` | `#002862` | Measured three ways: their markup, their OG image (`#002863` after JPEG), and the `UBC-Logo-Blue.png` pixels (`rgb(0,40,98)`) |
| `--glow-hi` / `--glow-lo` | `#00407f` / `#001a38` | Sampled off their live hero render (`#003D7B` → `#001D3C`) |
| `--star` | `#59a0ef` | **Theirs.** The exact blue of the type in their tour graphic |
| `--star-hi` | `#9cc6f5` | Lifted, for type that has to hold on navy |
| `--silver` / `--slate` | `#c6d2e3` / `#3762a1` | Their ribbon greys; their button blue, measured |
| `--paper` | `#f4f1ea` | One warm light band, at the sponsors |

**Type.** Display is Playfair Display — a Didone with the same thick/thin contrast as the
UBC monogram's own letterforms. UI and body are Jost, wide-tracked uppercase for labels,
matching the `UNIVERSAL BALLET COMPETITION` lockup under their mark.

**There is no gold.** An earlier pass introduced a medal gold as an accent. That was an
import, not an observation — their site does not contain a single gold pixel. The accent
is their own cornflower `#59a0ef` plus real metallic silver.

## Shimmer, and where it comes from

Five effects, all slow and specular rather than glittery. Every one is disabled or stilled
under `prefers-reduced-motion`.

1. **The sky** — a fixed radial glow behind the whole page, so the light stays put while
   the page scrolls past it, the way a spotlight does on a real cyc.
2. **Starfield** — three parallax layers (`assets/stars-*.svg`), each on its own twinkle
   period. Generated deterministically from fixed seeds so the field is identical every
   build and screenshots stay comparable.
3. **Ribbon sweeps** — UBC's signature graphic, layered translucent silver bands raking
   across the frame. Theirs *cross* at different angles; parallel bands read as venetian
   blinds, which the first attempt at this did. Each band breathes on its own delay so
   light appears to travel along the satin rather than the block pulsing as one.
4. **Sheen** — a metallic gradient clipped to text and swept slowly across it, on the
   headline accent and the section numerals. Ramped toward their star blue so it separates
   from the white headline instead of reading as greyed-out.
5. **Polished-silver primary button** with a specular pass on hover.

## Facts on this page

Every claim is either verbatim from UBC's own site or visibly marked `TBC`.

- **The 16-city schedule** was read out of the markup of `/semi-finals/`. A summarising
  fetch of the same page got three dates wrong (San Francisco, Dayton, the April Chicago)
  and invented registration statuses, which is why it was re-read directly.
- **Grand Prix Finals — Iowa City, IA, May 26–30, 2027** came off their own tour graphic.
- **`TBC` chips** mark the two real remaining gaps: dancer count and scholarship total.

## Things that are derived, not typed

- **Past / happening-now / upcoming** per competition, from each row's own `data-start`
  and `data-end`.
- **The "next competition" band** under the hero, read off those same rows. It and the
  table can never disagree.
- **The footer copyright year.**

The live site's banner still advertises a registration date in July and its footer still
reads ©2024. Both are facts a person has to remember to change. Here nobody has to.

## Defects on the live site

Confirmed:

1. Banner reads "Registration for 2026-2027 Season opens **July 15**" (checked 16 Oct 2026).
2. Footer reads **©2024**.
3. Footer "Email us" points to `http://mjn.ndi.mybluehost.me/contact-minimal/` — the
   Bluehost staging hostname, in production, over plain HTTP.
4. Two contact buttons, two URLs: `/CONTACT` and `/contact`.
5. In the tour graphic: **CHICAG0** spelled with a zero, and **FEBUARY** misspelled twice.
6. Registration status is baked into the city *name* string ("Chicago, IL- SOLD OUT")
   rather than held as its own field.
7. The whole season is a flat PNG — invisible to search, to screen readers, and to anyone
   who wants to link to one city.

**Retracted** — two earlier findings here were wrong, and the error is worth keeping
written down:

- I claimed their tour graphic was half-finished with the dates column missing. It is not.
  The dates are **white text in a transparent PNG**, invisible against the white I
  previewed the file on, correct against their navy.
- I therefore claimed no dates appeared on the landing page. They do, in the hero.

Both wrong claims shared a tell: each required a competent person to have shipped
something obviously broken. Cloudflare blocked `curl`, so the page was rebuilt from
archived markup without ever being looked at. Render the thing before calling it broken.

## One bug fixed during the build

The mobile drawer is `position:fixed`, but `backdrop-filter` on the sticky nav makes that
nav a **containing block for fixed descendants** — so the drawer sized itself to the nav
(144px) instead of the viewport (844px). The fix drops `backdrop-filter` below 900px.
`.scratch/shot/drawer.js` measures drawer height against viewport height; it failed before
the fix and passes after, so it has a real discriminator.

## Still open

- Asia Pacific Grand Prix Finals dates.
- Real numbers behind "countless dancers" and "millions of dollars".
- Venue names per city — a parent books a hotel off them.
- Age divisions and entry fees.
- Photography is UBC's own, pulled from their site for this study. Any public deployment
  needs their say-so.
