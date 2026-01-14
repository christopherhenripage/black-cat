You are Claude Code acting as a senior full-stack engineer. Work in THIS repo and implement BOTH (A) copy/UX changes to remove all payment-link language and (B) an admin inventory tracker with metrics. Do not ask me questions—make sensible defaults and proceed.

========================
A) REMOVE ALL PAYMENT LINKS (PUBLIC SITE)
========================
Goal: We do NOT send payment links, invoices, PayPal links, or accept card payments via links. Purchasing is coordinated manually after an order request.

1) Global copy sweep:
- Search the codebase for any references to:
  "payment link", "secure payment", "invoice", "PayPal", "credit card", "card", "Stripe", "checkout", "pay online", "payment processor"
- Remove/replace with language that reflects: "We confirm availability and then coordinate pickup/shipping and payment offline."

2) Order page (/order):
- Replace any step text that mentions sending a payment link with:
  "We'll confirm availability and total within 24–48 hours, then coordinate pickup/shipping and payment offline."

3) FAQ page (/faq) + any other pages:
- Remove payment method/link claims and replace with:
  "Payment is coordinated after confirmation (offline)."

4) Product pages (/product/[slug]) and request forms:
- Ensure success/confirmation messages contain NO payment-link wording.
- Add a short line near the submit button:
  "We reply within 24–48 hours to confirm availability and coordinate pickup/shipping and payment offline."
- If there is any "price" language that implies online payment, adjust accordingly (price is fine; just no online payment links).

5) UI cleanup:
- If you have any "Checkout" button or cart-checkout language, remove it or rename to "Request to Order".

After completing (A), run formatting/lint if scripts exist.

========================
B) ADD AN ONLINE INVENTORY TRACKER + METRICS (ADMIN)
========================
Goal: Create a simple, secure inventory tracker that lets the vendor manage stock (available/reserved/sold), record sales, and view useful metrics.

Constraints:
- Keep the existing public website working unchanged except for copy changes from (A).
- Add an admin area at /admin with authentication.
- Use a real database. Prefer:
  - Prisma + SQLite for local dev AND for easy Vercel deployment (use a file-based SQLite by default).
  - ALSO support Postgres via DATABASE_URL if provided (so we can upgrade later). Prisma should handle both.
- Authentication:
  - Implement simple password-based auth using an environment variable ADMIN_PASSWORD.
  - Use a session cookie (httpOnly) with a signed token secret INVENTORY_SESSION_SECRET.
  - Block /admin routes unless authenticated.
- No paid services required to run locally.
- Must deploy to Vercel (serverless) cleanly. If SQLite on Vercel is problematic for persistence, implement a clear fallback:
  - If DATABASE_URL is set, use that (recommended for production).
  - If not set, app still runs but warns in /admin that data may not persist reliably on serverless.
- Use TypeScript, Next.js App Router patterns, Tailwind UI consistent with site style.

Data model (Prisma):
1) Product
- id (cuid)
- name
- slug (unique)
- type (e.g., button-down)
- description (optional)
- createdAt, updatedAt

2) Variant
- id (cuid)
- productId (FK)
- size (string: XS/S/M/L/XL etc)
- color (optional)
- sku (optional)
- cost (integer cents, optional)
- price (integer cents, optional)
- createdAt, updatedAt

3) InventoryLot (optional but useful)
- id (cuid)
- variantId (FK)
- quantityOnHand (int)
- quantityReserved (int)
- quantitySold (int)
- lastRestockedAt (datetime nullable)

If you prefer simpler: put quantities directly on Variant. That's fine for MVP.

4) OrderRequest (from website forms, optional integration)
- id (cuid)
- createdAt
- customerName
- email
- phone (optional)
- productSlug
- variantSize
- quantity
- fulfillmentMethod (pickup/delivery/shipping)
- shippingAddress (optional)
- notes (optional)
- status (enum: NEW, CONFIRMED, CLOSED)

5) Sale
- id (cuid)
- createdAt
- channel (enum: WEBSITE, INSTAGRAM, POPUP, OTHER)
- customerName (optional)
- email (optional)
- lineItems (separate table SaleItem)
- total (integer cents, optional)
- notes (optional)

6) SaleItem
- id (cuid)
- saleId (FK)
- variantId (FK)
- quantity (int)
- unitPrice (int cents, optional)

Admin features (/admin):
- Login page (/admin/login)
- Dashboard (/admin):
  - Key metrics:
    - Total on-hand units
    - Total sold units (last 30 days and all-time)
    - Sell-through % (sold / (sold + on-hand)) overall
    - Top 5 products by units sold
    - Inventory aging: items with on-hand for longest (approx via createdAt/restocked date)
- Inventory management pages:
  - /admin/products: list + create/edit product
  - /admin/products/[id]: edit product + manage variants
  - /admin/variants: list variants with stock counts and quick adjust buttons (+/-)
  - Ability to mark quantity reserved (holds) and quantity sold
- Sales entry:
  - /admin/sales: list + create sale
  - Sale form: choose channel, date, add 1+ items (variant + qty + price), notes
  - When a sale is saved, decrement inventory (onHand -= qty; sold += qty)
- Order requests integration (optional but recommended):
  - If the public website already has an order request API route, save submissions into OrderRequest table as well as emailing/logging.
  - Add /admin/requests: list + status update

Implementation notes:
- Use zod validation on all admin mutations and API routes.
- Use server actions or route handlers as appropriate; keep it secure.
- Add a small "About inventory" notice inside /admin/settings explaining recommended production DB setup.

Dev UX:
- Add these scripts if missing:
  - "dev", "build", "start", "lint", and Prisma scripts:
    - "prisma:generate"
    - "prisma:migrate"
- Add a seed script:
  - Creates an admin-ready sample product + variants matching the public products.json (best-effort).
  - If public products.json exists, import products and create variants for each size.

Env:
- Add .env.example with:
  - ADMIN_PASSWORD=
  - INVENTORY_SESSION_SECRET=
  - DATABASE_URL=  (optional; sqlite by default)
  - ORDER_TO_EMAIL= (if relevant)
  - Any existing vars preserved

Finishing steps:
- After implementing, run:
  - npm run lint (if exists)
  - npm run build
- Provide a concise summary of:
  - Files changed for (A)
  - New files for inventory (B)
  - How to run migrations locally
  - How to log into /admin
  - Vercel deploy notes (DB persistence warning + suggestion to set DATABASE_URL for production)

Proceed to implement now, directly modifying the repo.
