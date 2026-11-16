import React from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/ui/site-header";
import { SiteFooter } from "@/components/ui/site-footer";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/typography";
import { getPublicMenu } from "@/lib/api/menu";
import { MenuClientView } from "./menu-client-view";

export const metadata: Metadata = {
  title: "Dining Menu | Aura of Awadh",
  description:
    "Explore our authentic Indian dining menu featuring tandoori starters, slow-cooked curries, fragrant handi biryanis, and artisan breads.",
};

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const { categories, error } = await getPublicMenu();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* Navigation Header */}
      <SiteHeader
        brandName="Aura of Awadh [Placeholder]"
        ctaLabel="Reserve a Table"
        ctaHref="/#reservations"
      />

      <main id="main-content" className="flex-1">
        {/* Menu Hero Header */}
        <section className="relative py-16 sm:py-20 bg-surface-subtle border-b border-border/40 text-center">
          <Container size="default" className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Culinary Repertoire [Placeholder]
            </span>
            <Heading variant="display" className="text-foreground">
              Our Dining Menu
            </Heading>
            <Text variant="lead" className="max-w-2xl mx-auto text-muted-foreground text-sm sm:text-base">
              Each dish reflects ancient Awadhi court recipes, handcrafted daily with stone-ground aromatics, pure clarified butter, and charcoal-fired earthenware.
            </Text>
          </Container>
        </section>

        {/* Client Interactive Category Filters & Menu Listing */}
        <MenuClientView
          initialCategories={categories}
          errorMessage={error}
        />
      </main>

      {/* Footer */}
      <SiteFooter brandName="Aura of Awadh [Placeholder]" />
    </div>
  );
}

