"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "./container";
import { Button } from "./button";

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteHeaderProps {
  brandName?: string;
  navItems?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Menu", href: "/#menu" },
  { label: "Reservations", href: "/#reservations" },
  { label: "Gallery", href: "/#gallery" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader({
  brandName = "[Restaurant Name]",
  navItems = defaultNavItems,
  ctaLabel = "Reserve a Table",
  ctaHref = "/#reservations",
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/90 border-b border-border/40 transition-colors">
      <Container size="wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name Placeholder */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-wide hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1"
          >
            <span className="text-primary text-2xl font-sans font-bold leading-none">✦</span>
            <span>{brandName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Header Action Button (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="primary" size="sm" href={ctaHref}>
              {ctaLabel}
            </Button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-md text-foreground hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Accessible Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-background/95 backdrop-blur-lg border-b border-border z-40 flex flex-col justify-between p-6 animate-fade-in"
        >
          <nav className="flex flex-col gap-4 text-lg font-serif">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-md text-foreground hover:text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-border/40 pb-8">
            <Button
              variant="primary"
              size="lg"
              href={ctaHref}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              {ctaLabel}
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 bg-surface-elevated border border-border rounded text-foreground">Esc</kbd> to close
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

