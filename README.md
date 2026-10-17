# UBC landing page — redesign study

A single self-contained `index.html` (no build step, no framework) plus local assets.
Open it directly in a browser, or `python3 -m http.server` from this folder.

Not affiliated with Universal Ballet Competition. This is a design study built from
their public site for review.

## Challenge for Buzz: replace the placeholders before UBC sees this

The site has to hold up when someone from UBC reads it closely. Three parts of the landing page still show placeholder or wrong copy. Fix all three, using only facts UBC publishes. **No invented numbers, names, or links.** If something can't be sourced, change the design so the gap doesn't show. Never guess.

Work on a branch, open a PR against `main`, and pull first, since other bots work in this repo too. Keep the "independent design study, not affiliated with UBC" disclaimer exactly as it is.

### 1. Stats band (`pages/index.body.html`, `.stat` blocks)
It shows `16` / "Cities, 2026–27 season", but `TBC` for **Dancers hosted & mentored** and **Awarded in scholarships**.
- Find real figures in UBC's own material: the About page, their podcast, press coverage, or interviews. Record each figure's source URL (and date or quote) in `data/` or in a code comment beside the number.
- If you can't find a sourced figure, replace that stat with a fact you can verify, such as the Grand Prix Finals city and dates, the number of semi-final cities, or the founding year if UBC states it. Don't leave `TBC` showing and don't round a vague claim ("millions of dollars") into a number.
- The `16` should come from `data/season.json` (the count of `semifinals`) rather than being typed in by hand.

### 2. Sponsors (`pages/index.body.html`, `.sponsors` section)
There are 3 title-sponsor logos and 17 scholarship-sponsor logos, all with the same generic alt text ("UBC title sponsor" / "UBC scholarship sponsor").
- Identify every logo by name from [UBC's Scholarships & Sponsors page](https://universalballetcompetition.com/sponsors/). Use what's written in or next to the logo, never a guess from the file name.
- Give each one an alt text of just the sponsor's name (for example `alt="Victoria Ballet"`, not "logo of…"), and link it to the sponsor's site **only if UBC's page links it**.
- Consider moving the sponsors into a data file (`data/sponsors.json`, holding name, image, url, tier, and source) that `build.py` renders, the same way `season.json` drives the schedule.
- Headings: the tier labels "Title Sponsors" and "Scholarship Sponsors" are plain `<p class="tier__label">` text. Make them real headings (`<h3>`) under the section's `<h2>` so screen readers and the outline get a proper structure, and make sure no heading is left empty.
- Note: `assets/img/ensemble.jpg` uses `alt="" aria-hidden="true"` on purpose because it's decorative. That's correct, so leave it alone.

### 3. Closing band (`pages/index.body.html`, "Registration for the 2026–2027 season is open")
Right now 12 of the 16 cities in `data/season.json` are `wait` (waitlist), 3 are `open`, and 1 is `sold`, so "registration is open" overstates it.
- Generate this sentence in `build.py` from `season.json` so it can't go stale. Example: "Registration is open in 3 cities; 12 are waitlist-only." Name the open cities if it reads well.
- Handle the edge cases: all cities open, none open (for example "All cities are on waitlist; join a waitlist…"), and events that are already finished.

### Acceptance criteria
- [ ] No `TBC` anywhere in any built page (`grep -ri tbc *.html` returns nothing).
- [ ] Every number on the page has a source recorded in the repo (a data-file field or a comment with the URL).
- [ ] All 20 sponsor logos have a correct, distinct name as alt text. Links exist only where UBC links them. Tier labels are `<h3>`s with text.
- [ ] The closing-band wording is generated from `data/season.json` and matches the open/wait/sold counts.
- [ ] Edits go in `pages/`, `partials/`, `data/`, or `build.py`. Never hand-edit the built `index.html`, `rules.html`, or `judges.html`.
- [ ] `python3 build.py` runs, and `python3 build.py --check` passes.
- [ ] `node tools/check_pages.js` passes against a local server (`python3 -m http.server 8777`).
- [ ] The disclaimer is unchanged. The PR description lists each sourced fact with its URL, plus anything you couldn't source and how you handled it.

## Repo overview

| Path | What it is |
|---|---|
| `build.py` | Builds `index.html`, `rules.html`, and `judges.html` from `pages/*.body.html` plus the shared `partials/`, and renders the season table from `data/season.json`. `--check` fails if any built page is out of date. |
| `data/season.json` | The single source for the 16 semi-finals: city, slug, dates, label, and `reg` (`open`/`wait`/`sold`), read from each city's own UBC event page. Event state (upcoming, live, or done) is not stored. It's computed from the dates when the page loads. |
| `pages/` | The body of each page. **Edit here**, not in the built HTML. |
| `partials/` | Shared `head.html`, `chrome-top.html` (nav), and `chrome-bottom.html` (footer, scripts), written in exactly once. |
| `tools/check_pages.js` | Loads every built page in headless Chrome (Puppeteer) and checks for failed requests and the computed styles that screenshots miss. Usage: `node tools/check_pages.js [baseURL]`. The Chrome path is hard-coded for macOS, so adjust `CHROME` on other machines. |
| `assets/` | Images, the starfield SVGs, and styles. |

Deployed on Vercel as `ubc-redesign` at https://ubc-redesign.vercel.app.

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
