import React from "react";
import Link from "next/link";
import { Container } from "./container";
import { Heading, Text } from "./typography";

export interface SocialLink {
  platform: string;
  href: string;
}

export interface SiteFooterProps {
  brandName?: string;
  tagline?: string;
  addressLines?: string[];
  hoursLines?: string[];
  phone?: string;
  email?: string;
  socialLinks?: SocialLink[];
}

const defaultAddress = [
  "[Restaurant Street Address Placeholder]",
  "[City, Postal Code / State Placeholder]",
];

const defaultHours = [
  "Monday – Thursday: 12:00 PM – 10:30 PM",
  "Friday – Saturday: 12:00 PM – 11:30 PM",
  "Sunday: 12:30 PM – 10:00 PM",
];

const defaultSocials: SocialLink[] = [
  { platform: "Instagram", href: "#" },
  { platform: "Facebook", href: "#" },
  { platform: "TripAdvisor", href: "#" },
];

export function SiteFooter({
  brandName = "[Restaurant Name]",
  tagline = "Authentic Indian heritage dining, crafted with hand-ground spices and charcoal tandoor traditions.",
  addressLines = defaultAddress,
  hoursLines = defaultHours,
  phone = "+1 (555) 000-0000 [Placeholder]",
  email = "reservations@example.com [Placeholder]",
  socialLinks = defaultSocials,
}: SiteFooterProps) {
  return (
    <footer className="w-full bg-surface border-t border-border/60 py-16 text-foreground">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-border/40">
          {/* Brand & Concept */}
          <div className="md:col-span-1 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-serif font-semibold text-foreground tracking-wide hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-primary text-xl font-sans font-bold">✦</span>
              <span>{brandName}</span>
            </Link>
            <Text variant="caption" className="text-muted-foreground leading-relaxed">
              {tagline}
            </Text>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <Heading variant="h3" as="h3" className="text-base uppercase tracking-wider text-primary">
              Location & Contact
            </Heading>
            <div className="space-y-1 text-sm text-foreground/80">
              {addressLines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
              <p className="pt-2 text-muted-foreground">{phone}</p>
              <p className="text-muted-foreground">{email}</p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-3">
            <Heading variant="h3" as="h3" className="text-base uppercase tracking-wider text-primary">
              Dining Hours
            </Heading>
            <div className="space-y-1.5 text-sm text-foreground/80">
              {hoursLines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>

          {/* Social & Connect */}
          <div className="space-y-3">
            <Heading variant="h3" as="h3" className="text-base uppercase tracking-wider text-primary">
              Connect
            </Heading>
            <ul className="space-y-2 text-sm">
              {socialLinks.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    className="text-foreground/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm inline-block"
                  >
                    {social.platform} [Placeholder]
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <p className="text-muted-foreground/80">
            Phase 2 Prototype — Design System & Homepage Skeleton
          </p>
        </div>
      </Container>
    </footer>
  );
}

