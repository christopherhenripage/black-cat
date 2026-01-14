# Black Cat Button Down

A production-ready catalog and order request website for Black Cat Button Down—Bangkok-crafted shirts sold in New Orleans.

## Features

- **Product Catalog**: Browse shirts with filtering by type and availability
- **Order Request System**: Request-based ordering (no online payments)
- **Email Notifications**: Automated emails via Resend or Nodemailer (with dev fallback)
- **Mobile-First Design**: Responsive, fast, accessible
- **SEO Optimized**: Metadata, sitemap, robots.txt, OpenGraph
- **Analytics Ready**: Optional Plausible analytics integration

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Inter + Space Grotesk (via next/font)
- **Email**: Resend / Nodemailer
- **Validation**: Zod
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd black-cat

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Configuration (choose one)

# Option 1: Resend (recommended)
RESEND_API_KEY=your_resend_api_key
ORDER_TO_EMAIL=orders@yourdomain.com

# Option 2: SMTP/Nodemailer
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# Analytics (optional)
# NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

**Dev Mode**: If no email provider is configured, order requests are logged to the console.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
black-cat/
├── public/
│   └── images/             # Product images
├── src/
│   ├── app/
│   │   ├── api/order/      # Order API route
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── faq/            # FAQ page
│   │   ├── order/          # Order page
│   │   ├── product/[slug]/ # Product detail page
│   │   ├── shop/           # Shop page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   ├── sitemap.ts      # Sitemap generation
│   │   └── robots.ts       # Robots.txt generation
│   ├── components/         # React components
│   ├── data/
│   │   └── products.json   # Product data
│   ├── lib/                # Utilities
│   └── types/              # TypeScript types
└── .env.example            # Environment template
```

## How to Add a Product

1. **Add product images** to `/public/images/`:
   - Name format: `product-slug-1.jpg`, `product-slug-2.jpg`
   - Recommended size: 600x800px (3:4 aspect ratio)
   - Supported formats: JPG, PNG, WebP, SVG

2. **Edit `/src/data/products.json`**:

```json
{
  "id": "7",
  "name": "Your Product Name",
  "slug": "your-product-slug",
  "price": 150,
  "type": "button-down",
  "description": "Product description here.",
  "details": [
    "100% cotton",
    "Handcrafted in Bangkok"
  ],
  "care": [
    "Machine wash cold",
    "Hang dry"
  ],
  "variants": [
    { "size": "S", "available": true },
    { "size": "M", "available": true },
    { "size": "L", "available": false },
    { "size": "XL", "available": true },
    { "size": "XXL", "available": true }
  ],
  "images": [
    { "src": "/images/your-product-slug-1.jpg", "alt": "Product front view" },
    { "src": "/images/your-product-slug-2.jpg", "alt": "Product detail view" }
  ],
  "featured": false
}
```

3. **Rebuild** (if in production) or refresh the page (in development).

### Product Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| name | string | Yes | Display name |
| slug | string | Yes | URL-friendly name |
| price | number | No | Price in dollars (omit if "price on request") |
| type | string | Yes | Category (e.g., "button-down") |
| description | string | Yes | Full description |
| details | string[] | Yes | Bullet points for details |
| care | string[] | Yes | Care instructions |
| variants | array | Yes | Size/availability options |
| images | array | Yes | Image URLs and alt text |
| featured | boolean | Yes | Show on homepage |

## Deployment to Vercel

### Option 1: CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Configure environment variables in the Vercel dashboard
4. Deploy

### Required Environment Variables on Vercel

Set these in your Vercel project settings:

- `NEXT_PUBLIC_SITE_URL`: Your production URL (e.g., `https://blackcatbuttondown.com`)
- `ORDER_TO_EMAIL`: Email address to receive order requests
- `RESEND_API_KEY`: Your Resend API key (get one at [resend.com](https://resend.com))

### Optional Environment Variables

- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: Your domain for Plausible analytics

## Email Setup

### Using Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add `RESEND_API_KEY` to your environment
4. (Optional) Verify your domain for custom sender addresses

### Using Nodemailer/SMTP

1. Get SMTP credentials from your email provider
2. Add SMTP environment variables:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`

### Dev Mode

When no email provider is configured, orders are logged to the server console. This is useful for local development and testing.

## Customization

### Colors

Edit the accent color in `src/app/globals.css`:

```css
:root {
  --accent: #c9a227;       /* Gold - change this */
  --accent-light: #d4b84a;
  --accent-dark: #a88620;
}
```

### Fonts

Edit fonts in `src/app/layout.tsx`:

```typescript
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-display", subsets: ["latin"] });
```

### Content

- **Brand info**: Edit `src/app/layout.tsx` (metadata), `src/components/Footer.tsx`, `src/app/about/page.tsx`
- **FAQ content**: Edit `src/app/faq/page.tsx`
- **Order process**: Edit `src/app/order/page.tsx`

## Rate Limiting

The order API includes basic in-memory rate limiting (5 requests per minute per IP). Note:

- State is not shared across serverless instances
- Memory clears on cold starts
- For high-traffic sites, consider Redis or Upstash

## Security Features

- Honeypot field for spam protection
- Input validation with Zod
- Rate limiting (best-effort on serverless)
- Secure form handling

## License

Private - All rights reserved.

## Support

For questions or issues, contact [hello@blackcatbuttondown.com](mailto:hello@blackcatbuttondown.com).
