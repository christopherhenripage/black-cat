You are Claude Code acting as a senior product designer + front-end engineer. Your job is to keep the new site's clarity/UX, but adjust visual design to feel more like the original Black Cat site (editorial, airy, confident, minimal, slightly artful). Do NOT rebuild pages or change routing. Do NOT touch the admin system except to ensure styling tokens don't break it. Focus on public-facing UI only.

Primary goal:
- "Old site's soul + new site's structure."
- More editorial / gallery-like, less generic ecommerce template.

Constraints:
- Next.js + Tailwind (do not introduce heavy UI libraries).
- Keep performance fast.
- Avoid gimmicky animations; use subtle micro-interactions only.
- Keep ordering flow clear; do not hide the "Request to Order" CTA, just style it more tastefully.

========================
A) TYPOGRAPHY (biggest lever)
========================
1) Introduce a more expressive display font for headings (H1/H2/H3) while keeping a clean sans for body.
- Use next/font with Google fonts (no external paid assets).
- Pick a pairing that feels editorial and boutique:
  - Option examples (choose one and implement): 
    - Display: "Fraunces" or "Playfair Display" (soft serif)
    - Body: "Inter" or "DM Sans" (clean sans)
  - Ensure headings have slightly tighter tracking and strong hierarchy.
2) Body text:
- Use slightly lighter weight where appropriate.
- Increase line-height for long text blocks.
3) Define consistent type scale tokens:
- Create a small set of Tailwind utility classes or CSS variables for:
  - page title
  - section title
  - body
  - small/meta
Apply them consistently across Home, Shop, Product, Order, About, FAQ, Contact.

========================
B) SPACING / BREATHING ROOM (second biggest lever)
========================
1) Increase vertical whitespace between major sections, especially on the homepage.
2) Reduce "stacked card" feeling:
- Prefer open layouts, fewer boxes/borders.
- Use subtle dividers or hairlines sparingly.
3) Max-width:
- Use a slightly narrower reading width for text sections (more editorial).
- Let imagery run larger/wider where appropriate.

========================
C) HOMEPAGE: LESS INSTRUCTIONAL, MORE EVOCATIVE
========================
1) Above the fold:
- Make the hero feel like a lookbook/editorial intro.
- Keep ONE primary CTA ("Shop") and ONE secondary CTA ("Request to Order"), but style them with tasteful hierarchy:
  - Primary: solid
  - Secondary: outline or ghost
2) Move process-heavy language lower.
- Keep the "how ordering works" info, but place it below featured products and story, or compress it.
3) Add a short, specific brand line that is uniquely you:
- Mention Bangkok-crafted + New Orleans context in a concise, poetic way (no generic luxury copy).
- Keep it short. Avoid "for the discerning individual" type phrasing.

========================
D) SHOP GRID: GALLERY-LIKE
========================
Goal: feel like an editorial gallery, not a boxed catalog.
1) Reduce card framing:
- Prefer minimal hover states (slight lift, subtle border, gentle opacity).
- Let images be the dominant element.
2) Improve scannability without clutter:
- Add subtle availability indicators (text or small dot/badge) but keep them minimal.
3) Maintain or improve filter UX, but keep visual weight low.

========================
E) PRODUCT PAGE: CLARITY + HUMAN TONE
========================
1) Keep ordering CTA clear but style it more boutique:
- Less "big app button," more refined.
2) Size guide:
- Ensure the "Size guide" link goes to the correct section/page/modal.
- If currently linking to FAQ generally, create either:
  - a dedicated /size-guide page, OR
  - a modal section on the product page, OR
  - an anchor jump to the sizing section in FAQ.
Choose the simplest that fits the current structure.
3) Add a gentle reassurance near the order form:
- "We'll reply within 24–48 hours to confirm availability and coordinate pickup/shipping and payment offline."
(Do not mention any payment links.)

========================
F) NAV / CTA CLEANUP
========================
1) If multiple "Request to Order" CTAs appear redundantly in the same viewport, consolidate.
2) Mobile:
- Add a tasteful sticky bottom CTA ("Request to Order") only on mobile, if it improves conversion.
- Keep it subtle: small height, hairline border, not loud.

========================
G) MICRO-INTERACTIONS (SUBTLE ONLY)
========================
1) Add gentle transitions:
- Buttons: hover/active states
- Product cards: hover emphasis
- Section reveals: only if you already have animation infrastructure; otherwise skip.
2) No parallax, no heavy motion libraries unless already present.

========================
H) COPY TONE (LIGHT TOUCH)
========================
1) Replace any generic luxury/templated phrases with more human, specific phrasing.
2) Keep instructions concise and friendly.
3) Do not re-architect content; only adjust wording where it improves vibe without reducing clarity.

========================
I) DELIVERABLES
========================
1) Implement changes directly in code.
2) Run:
- npm run lint (if present)
- npm run build
3) Provide a summary:
- What typography pairing you chose
- Which components/pages you changed
- Where the size guide points now
- Any new classes/tokens introduced and where they live

Proceed now. Do not ask questions; make sensible defaults.
