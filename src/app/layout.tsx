import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { KonamiProvider } from "@/components/KonamiProvider";
import { FloatingCat, PawPrintTrail } from "@/components/PeekingCat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blackcatbuttondown.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Black Cat Button Down | Bangkok Crafted, New Orleans Sold",
    template: "%s | Black Cat Button Down",
  },
  description:
    "Handcrafted button-down shirts created in Bangkok, sold in New Orleans. Premium fabrics, timeless designs, and meticulous craftsmanship.",
  keywords: [
    "button-down shirts",
    "handcrafted shirts",
    "Bangkok shirts",
    "New Orleans fashion",
    "premium menswear",
    "custom shirts",
  ],
  authors: [{ name: "Black Cat Button Down" }],
  creator: "Black Cat Button Down",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Black Cat Button Down",
    title: "Black Cat Button Down | Bangkok Crafted, New Orleans Sold",
    description:
      "Handcrafted button-down shirts created in Bangkok, sold in New Orleans.",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Black Cat Button Down",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Cat Button Down",
    description:
      "Handcrafted button-down shirts created in Bangkok, sold in New Orleans.",
    images: ["/images/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <KonamiProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCat />
          <PawPrintTrail />
          <Analytics />
        </KonamiProvider>
      </body>
    </html>
  );
}
