# Portfolio

Static personal portfolio site with no build step. It is a structural reconstruction of a reference
portfolio; see `docs/reverse-engineering-notes.md` for what was observed and what was a design choice.

## Run

```bash
python -m http.server 5500   # then open http://localhost:5500
```

`.claude/launch.json` defines the same server as `portfolio` for the preview pane.
Opening `index.html` from `file://` mostly works, but the GitHub fetch and `sessionStorage` behave better over http.

## Layout

```
index.html            all home sections (structure only, content comes from config.js)
agents.html           long-form write-up of the process section (placeholder text in HTML)
agents-md.html        copyable AGENTS.md page (placeholder text in HTML)
archive.html          project table, rows rendered from SITE.archive
assets/js/config.js   window.SITE: every personal detail; the ONLY file to edit for content
assets/js/main.js     renders config into the page, then wires behaviour
assets/css/styles.css single stylesheet, grouped by section with /*=== NAME ===*/ banners
assets/img/           logo + placeholder SVGs
assets/pdf/           put resume.pdf here
docs/                 reverse-engineering notes
```

## Rules

- **Content goes in `config.js`, not HTML.** Exceptions: `<head>` meta tags (title, description,
  canonical, og:*), which are static and must be edited by hand, and the prose on `agents.html` / `agents-md.html`.
- Placeholders are written as `[ALL_CAPS]` in square brackets. Search for `\[[A-Z_]+` to find what's left to fill.
- **Don't add the reference site's projects or personal details.** The projects list starts empty on purpose.
- Escape user strings with `esc()` when building HTML in `main.js`. The only raw-HTML field is
  `SITE.process.sideNote`, which allows `<br>`.
- Every behaviour block in `main.js` must no-op when its elements are missing, because the subpages share the script.
- Empty list in config → the render function hides that section (`hideSection(id)`). Keep that contract when adding sections.
- Adding a section: give it `class="<name> section"`, an `id`, and `data-header-color="#HEX"` (the header
  matches it), then add `.<name>.section { background; --accent; --cursor-tag }` in the SECTION BACKGROUNDS block.
- Keep motion behind `prefers-reduced-motion` (the loader, Lenis and reveals already check it).
- No frameworks or bundlers. The only CDN dependencies are Lenis, Boxicons and Google Fonts.

## Verify a change

Serve locally, load `/`, `/agents.html`, `/agents-md.html` and `/archive.html`, and check the browser console is clean.
Clear `sessionStorage` (or use a new tab) to see the loading intro again.
