"use client";

import Link from "next/link";
import { useState } from "react";
import { BlackCatIcon } from "./BlackCatLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/order", label: "Order" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with Cat */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg md:text-xl font-bold tracking-tight hover:text-accent transition-colors"
          >
            <BlackCatIcon size="md" />
            <span>Black Cat Button Down</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/order"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors rounded-none"
            >
              Request to Order
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700 hover:text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-black/5 bg-white">
          <nav className="px-4 py-4 space-y-2" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-base font-medium text-gray-700 hover:text-black transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/order"
              className="block w-full mt-4 py-3 text-center text-base font-medium text-white bg-black hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Request to Order
            </Link>
          </nav>
        </div>
      )}

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-black p-4 z-50">
        <Link
          href="/order"
          className="block w-full py-3 text-center text-base font-medium text-white bg-accent hover:bg-accent-dark transition-colors"
        >
          Request to Order
        </Link>
      </div>
    </header>
  );
}
