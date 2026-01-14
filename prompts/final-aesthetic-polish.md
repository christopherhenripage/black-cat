You are Claude Code acting as a senior creative director + front-end engineer. The public site is already functional. Your task is to do a FINAL polish pass to make the new site feel more aesthetically aligned with the original buyblackcat.com vibe: editorial, airy, confident, minimal, human—without sacrificing clarity.

Important constraints:
- Do NOT change routing or remove key pages.
- Do NOT add checkout or any payment links. Ordering is coordinated offline after request.
- Keep performance fast; avoid heavy animation libraries.
- Keep admin/inventory pages functional; do not invest time in admin aesthetics beyond ensuring tokens/styles don't break it.
- This must be done in ONE pass: make changes directly and then run lint/build at the end.

Primary goals:
1) Reduce any remaining "generic ecommerce template" feeling.
2) Increase editorial personality through typography, spacing, asymmetry, and refined CTAs.
3) Ensure the homepage leads with mood + product, not process.
4) Ensure CTAs remain clear but more boutique/tasteful.
5) Confirm the site feels consistent end-to-end (Home, Shop, Product, Order, FAQ, About, Contact).

Deliverables:
- Implement changes in code.
- Run: npm run lint (if exists) and npm run build.
- Output a concise summary of changes and which files/components were touched.

========================
A) HOMEPAGE HERO: UNIQUE + SPECIFIC
========================
- Rewrite hero headline/subhead to be specific to Black Cat:
  - Mention Bangkok-crafted / New Orleans-based in a short, evocative way.
  - Avoid generic luxury phrasing ("discerning individual", "premium", etc.)
- Ensure ONE primary CTA ("Shop") and ONE secondary CTA ("Request to Order").
- Make the hero feel editorial:
  - More breathing room
  - Slightly more dramatic type scale for H1
  - Optional: subtle divider/hairline or small caption text (tasteful)

========================
B) RHYTHM + ASYMMETRY (EDITORIAL CADENCE)
========================
If the layout is too symmetric, introduce gentle asymmetry WITHOUT making it chaotic:
- Alternate alignment for sections (e.g., story section text block offset; featured products aligned differently).
- Use varied max-widths: narrower for text, wider for images.
- Create "visual rhythm" like an editorial spread.

========================
C) TYPOGRAPHY + SPACING REFINEMENT
========================
- Keep the expressive heading font + clean body font pairing already added, but tune:
  - H1/H2 spacing
  - line-height and tracking
  - paragraph measure (max-width) to feel more like the old site
- Increase vertical whitespace between major sections, especially on Home.
- Reduce excessive card borders/boxes; prefer open layouts with subtle hairlines/dividers.

========================
D) CTA / BUTTON REFINEMENT (LESS "BUTTON-Y")
========================
Goal: keep conversion clarity but make CTAs feel boutique.
- Refine button styles:
  - Slightly softer border weights
  - More elegant hover states (subtle)
  - Secondary button should feel "quiet"
- Ensure no duplicate CTAs compete in the same viewport.
- Mobile: if there's a sticky CTA, ensure it is tasteful (thin bar, minimal border).

========================
E) SHOP GRID: MORE GALLERY, LESS CATALOG
========================
- Make product imagery more dominant.
- Reduce rigid card framing.
- Keep scannability:
  - Add minimal availability indicator (e.g., small dot + "In stock / Sold out")
  - But do not clutter
- Ensure grid spacing feels airy and deliberate.

========================
F) PRODUCT PAGE: HUMAN + CONFIDENT
========================
- Ensure "Size guide" points to the correct place (modal, dedicated page, or anchored FAQ section).
- Add a gentle reassurance near the order form:
  "We reply within 24–48 hours to confirm availability and coordinate pickup/shipping and payment offline."
- Keep the request CTA prominent but styled tastefully.

========================
G) COPY TONE PASS (LIGHT TOUCH)
========================
Across Home/Order/FAQ:
- Remove any remaining templated/generic ecommerce tone.
- Keep instructions concise, friendly, and human.
- Ensure "offline coordination" language is consistent and does not mention links/invoices/PayPal/cards.

========================
H) QUALITY / CONSISTENCY
========================
- Ensure accessibility: focus states, button labels, form labels.
- Ensure mobile layout feels intentional (spacing, typography, CTA placement).
- Ensure performance is not degraded (avoid heavy scripts/images).

========================
I) IMPLEMENTATION RULES
========================
- Do not ask questions.
- Make reasonable defaults.
- Prefer small, high-impact diffs over rewrites.
- Keep changes scoped to public UI components/styles and copy.

Finally:
- Run npm run lint (if present)
- Run npm run build
- Summarize file changes and notable UX improvements.
