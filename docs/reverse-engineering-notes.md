# Reverse-engineering notes: reference portfolio

What this skeleton is based on, what was observed directly, and what was a design choice.

- Target: the public site at `https://nauqh.github.io/` (static GitHub Pages site, captured 2026-11-27)
- Method: the `reverse-engineer-anything` skill from the REA repo (`morluto/rea`). The REA CLI
  (`npx rea-agents analyze-javascript-application`) refused to run because it needs Node 22.x,
  24.x or 26.12+, and this machine has Node 25.2.1. So the capture was analysed statically by hand
  (HTML, `styles.css`, `main.js`, subpages) and checked against the live page in a browser.

## Observed (from the shipped files)

| Area | Observation |
|---|---|
| Stack | Plain HTML + one CSS file + one JS file. No build step. Lenis (smooth scroll) and Motion load from a CDN. Boxicons. Google Fonts: Poppins + Shantell Sans (handwritten accents). |
| Page order | loading screen → header/nav overlay → home → about (inset card) → skills → agents → education (rounded sheet laid over its neighbours) → experience → building now (inset card) → projects → GitHub → contact (sticky footer revealed under the page) → project drawer |
| Section colours | each section sets `data-header-color`; the header picks it up while that section is under it. Colours: about `#c8f2dc`, agents `#ffe4cc`, education `#fdd5e6`, experience `#fff1b8`, work `#d4e5ff`, github `#e6e0ff`, contact `#0f172a` |
| Loading screen | the nav logo is cloned, stroke-drawn large, a counter runs to 90%, holds until fonts are ready, finishes at 100%, then the logo flies into the nav and fires a `loadingComplete` event that starts the scroll reveals |
| Header | hides when scrolling down. Ink colour comes from the luminance of the active section's colour. Section tops come from summed `offsetTop` because the sticky footer always reports `rect.top = 0` |
| Buttons | "stack buttons": two offset shadow layers that collapse on hover |
| Experience | company tabs with a sliding highlight bar. One role has a two-page note that peels or flips to a second side |
| Building now | feature card. After the card has been in view for 5s, screenshot "notes" fan out around the main image (or straight away if the button is pressed) |
| Projects | cards carry `data-description`/`data-tech`/`data-images` and open a right-hand drawer with an auto-advancing gallery |
| GitHub | stats and recently-pushed repos fetched client-side from `api.github.com/users/<user>/repos` |
| Cursor tag | elements with `data-cursor="..."` show a label that follows the pointer, coloured per section |
| Footer | sticky at the bottom; the page "sheet" (rounded bottom corners) scrolls off it. `--footer-reveal` (0..1) drives a parallax fade |
| Subpages | `agents.html` (long-form write-up), `agents-md.html` (copyable AGENTS.md), `archive.html` (project table) |

## Design choices in this skeleton (not taken from the reference)

- **All personal content lives in `assets/js/config.js`** (`window.SITE`). `main.js` renders lists from it,
  so the HTML holds only structure. The reference hard-codes content in HTML.
- **No projects were recreated.** `SITE.projects` and `SITE.archive` start empty and render a placeholder.
- The logo, portrait and screenshots are generic placeholder SVGs. The reference's hand-drawn logo
  path was not copied.
- The agents section was made generic: a "process" section driven by `SITE.process`.
- The corner-peel animation (polygon clipping) was simplified to a rotate-and-fade flip between the two pages.
- The loading counter is plain text, not the per-digit odometer strips.
- Motion (`motion.min.js`) is not loaded; CSS transitions cover the reveals.
- The CSS and JS were written from scratch to match the observed behaviour. The reference's ~97 KB of CSS
  and ~33 KB of JS were not copied.
- The intro plays once per browser session (`sessionStorage`). In the reference, this check was
  commented out for testing.

## Unknowns

- Exact easing curves and timings beyond the constants visible in the inline loader script.
- Mobile-specific breakpoints in the reference past the main ones (768 / 968 / 992 px) were not checked one by one.
