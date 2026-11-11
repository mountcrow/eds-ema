# Terna Homepage Migration Plan (https://www.terna.it/en)

## Overview
Migrate the Terna English homepage (`https://www.terna.it/en`) to AEM Edge Delivery Services as a **Document Authoring (da)** project. This is a full single-page migration — **including header/navigation and footer** — that will analyze the source page, identify its content structure and reusable blocks, generate the import infrastructure, produce the imported content, and visually verify the result against the original.

## Target
- **Source page:** `https://www.terna.it/en`
- **Project type:** Document Authoring (da) — content lives in da.live and is uploaded via the DA source API
- **Scope:** Full page — header/nav + body content + footer
- **Working repo:** current Edge Delivery project (boilerplate-based)

## Approach
Use the site-migration workflow for a single page. Because this is a rich corporate homepage, expect a header with navigation (likely a megamenu), a hero, multiple content/card sections, and a multi-column footer. Each section maps to an existing block where possible, or a new block variant where needed. Header and footer are instrumented as full navigation and footer blocks.

## Checklist
- [ ] Confirm project properties and the correct Block Library endpoint (project-expert)
- [ ] Scrape `https://www.terna.it/en` — capture cleaned HTML, screenshots, metadata, and download images
- [ ] Analyze page structure — identify sections, content sequences, and authoring decisions (default content vs. blocks)
- [ ] Survey available blocks and map each section to an existing block or a new block variant
- [ ] Create/confirm the page template and block mappings in `page-templates.json`
- [ ] Generate import infrastructure — block parsers and page transformers
- [ ] Generate/refine any new block variants (CSS + JS) needed for the body content
- [ ] Run the bundled import script to produce the imported HTML content
- [ ] Migrate the header / navigation from the source (desktop, mobile, megamenu, validation)
- [ ] Migrate the footer from the source (desktop, mobile, validation)
- [ ] Preview the imported page locally and verify rendering (body + header + footer)
- [ ] Visually critique the migrated page against the original and iterate on styling
- [ ] Upload the page (and nav/footer) to Document Authoring (da.live) via the DA source API
- [ ] Report results and outline follow-ups (remaining pages, publishing)

## Notes & Assumptions
- Scope is the single homepage plus its header and footer; additional Terna pages can be added as a follow-up template-based migration.
- The site is multilingual — only the `/en` page is in scope for now.
- Header/nav migration requires screenshots and per-item hover mapping for any megamenu; footer migration maps sections and per-element behavior.
- New blocks/variants follow boilerplate conventions (mobile-first CSS, scoped selectors, vanilla ES6+, no build step).
- Final upload to da.live relies on injected Adobe credentials; if it fails with an auth error, the DA opt-in in Settings must be enabled (no token needed in chat).

---
*Ready to execute. Execution requires Execute mode. Once approved, I'll begin by confirming project properties, then scrape and analyze the source page, generate infrastructure and content, and finally instrument the header and footer before verifying the full page.*
