# AGENTS.md

Instructions for any coding agent (Claude Code, Codex, Cursor, …) working in this repo.
`CLAUDE.md` has the same project facts. Keep the two in sync when either changes.

## Project

Static portfolio site: HTML, one CSS file and one JS file. No build step, no package manager.
Serve with `python -m http.server 5500`.

## Where things live

- Personal content: `assets/js/config.js` (`window.SITE`). Edit content here, not in the HTML.
- Rendering and behaviour: `assets/js/main.js`. Render functions run first, then the behaviour blocks.
- Styles: `assets/css/styles.css`, one banner-commented block per section.
- Static `<head>` meta (title, description, og tags) in each `.html` file must be edited by hand.

## Rules

1. Placeholders look like `[ALL_CAPS]`. Don't invent personal details to fill them; leave them for the owner.
2. Don't copy content, projects, logos or images from the reference site. Only the structure was reconstructed.
3. HTML built from config must go through `esc()`.
4. Behaviour code must tolerate missing elements, because the subpages load the same `main.js`.
5. An empty list in config hides its section. Preserve that.
6. New sections need `data-header-color` plus a matching background/`--accent`/`--cursor-tag` rule.
7. Respect `prefers-reduced-motion`.
8. Don't add frameworks, bundlers or new CDN libraries without the owner's approval.

## Working with multiple agents

- Split work by file or section so no two agents edit the same block of `styles.css` or `main.js` at once.
- Give each agent its own git worktree and branch. Merge only after the pages load with a clean console.

## Done means

- All four pages (`/`, `/agents.html`, `/agents-md.html`, `/archive.html`) load with no console errors.
- The layout holds at 375px, 768px and desktop widths.
- No placeholder was replaced with made-up data.
