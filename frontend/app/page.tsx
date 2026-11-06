import React from "react";
import { SiteHeader } from "@/components/ui/site-header";
import { SiteFooter } from "@/components/ui/site-footer";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { SIGNATURE_DISHES } from "@/data/dishes";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* 1. Global Navigation Header */}
      <SiteHeader
        brandName="Aura of Awadh [Placeholder]"
        ctaLabel="Reserve a Table"
        ctaHref="/#reservations"
      />

      <main id="main-content" className="flex-1">
        {/* 2. Hero Section */}
        <section
          aria-labelledby="hero-heading"
          className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 overflow-hidden border-b border-border/40"
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40"
          >
            <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary/20 to-secondary/15 blur-3xl transform -translate-y-12" />
          </div>

          <Container size="default" className="relative z-10 text-center space-y-8 animate-fade-in">
            {/* Tag / Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated/80 border border-border/60 text-xs uppercase tracking-widest text-primary font-medium">
              <span>✦</span>
              <span>Authentic Indian Heritage Dining [Placeholder]</span>
              <span>✦</span>
            </div>

            {/* Large Serif Headline Placeholder */}
            <Heading
              id="hero-heading"
              variant="display"
              className="max-w-4xl mx-auto leading-none text-foreground drop-shadow-sm"
            >
              Timeless Aromas, Royal Awadhi Heritage & Handcrafted Flavours
            </Heading>

            {/* One Supporting Line Placeholder */}
            <Text
              variant="lead"
              className="max-w-2xl mx-auto text-muted-foreground font-normal"
            >
              Immerse yourself in centuries of culinary tradition — from slow-sealed dum biryanis to charcoal tandoor masterworks crafted with authentic hand-ground spices.
            </Text>

            {/* Two Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                href="/#menu"
                className="w-full sm:w-auto min-w-[180px]"
              >
                View Menu
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="/#reservations"
                className="w-full sm:w-auto min-w-[180px]"
              >
                Reserve a Table
              </Button>
            </div>
          </Container>
        </section>

        {/* 3. Brand Story Section (2-Column on Desktop, 1-Column on Mobile) */}
        <Section
          id="about"
          variant="subtle"
          spacing="lg"
          aria-labelledby="brand-story-heading"
        >
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column: Story Copy */}
              <div className="space-y-6 animate-fade-in">
                <div className="inline-block text-xs uppercase tracking-widest text-secondary font-semibold">
                  Our Culinary Heritage [Placeholder]
                </div>
                <Heading id="brand-story-heading" variant="h1" className="text-foreground">
                  The Art of Slow Dining & Sacred Spice Traditions
                </Heading>
                <Text variant="body" className="text-muted-foreground leading-relaxed text-base">
                  Every dish in our kitchen honors the Nawabi courts of Awadh, where cooking was perfected as a sublime art form. We grind our garam masalas in small stone batches each morning and simmer our sauces over gentle charcoal embers.
                </Text>
                <Text variant="body" className="text-muted-foreground leading-relaxed text-base">
                  From traditional clay tandoors to unhurried dum cooking, our philosophy is simple: authentic time, honest local ingredients, and heartfelt Indian hospitality.
                </Text>
                <div className="pt-2 flex items-center gap-8 border-t border-border/50 text-sm">
                  <div>
                    <span className="block font-serif text-2xl font-bold text-primary">100%</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Hand-Ground Spices</span>
                  </div>
                  <div>
                    <span className="block font-serif text-2xl font-bold text-primary">24 hr</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Slow Dum Simmer</span>
                  </div>
                  <div>
                    <span className="block font-serif text-2xl font-bold text-primary">Clay</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Tandoor Ovens</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Atmosphere Placeholder */}
              <div className="relative animate-fade-in">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-surface-elevated via-surface to-background border border-border/60 shadow-lg flex flex-col items-center justify-center p-8 text-center relative group">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-2xl mb-4">
                    ✦
                  </div>
                  <Heading variant="h3" as="h3" className="text-xl font-serif text-foreground mb-2">
                    Atmosphere & Kitchen [Visual Placeholder]
                  </Heading>
                  <Text variant="caption" className="max-w-xs text-muted-foreground">
                    High-resolution imagery of the copper tandoor, spice mortar, and candlelit dining room will be integrated in Phase 4.
                  </Text>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* 4. Signature Dishes Section (3 Cards with Placeholders) */}
        <Section
          id="menu"
          variant="default"
          spacing="lg"
          aria-labelledby="dishes-heading"
        >
          <Container size="wide">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 animate-fade-in">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                Culinary Highlights [Placeholder]
              </span>
              <Heading id="dishes-heading" variant="h1">
                Signature Dishes
              </Heading>
              <Text variant="lead" className="text-muted-foreground">
                A preview of our celebrated preparations, curated to showcase rich regional diversity and culinary craftsmanship.
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SIGNATURE_DISHES.map((dish) => (
                <article
                  key={dish.id}
                  className="group relative flex flex-col rounded-xl overflow-hidden bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-fade-in"
                >
                  {/* Photo Gradient Placeholder */}
                  <div
                    aria-label={`Photo placeholder for ${dish.name}`}
                    className={`w-full aspect-[16/10] ${dish.gradientClass} flex flex-col items-center justify-center p-6 text-center relative border-b border-border/40 group-hover:scale-[1.02] transition-transform duration-500`}
                  >
                    <span className="text-3xl opacity-60 mb-2">✦</span>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                      Dish Photography Placeholder
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Heading variant="h3" as="h3" className="text-xl font-serif text-foreground mb-1">
                        {dish.name}
                      </Heading>
                      <p className="text-xs uppercase tracking-wider text-secondary font-medium mb-3">
                        {dish.tagline}
                      </p>
                      <Text variant="body" className="text-muted-foreground text-sm leading-relaxed">
                        {dish.description}
                      </Text>
                    </div>

                    <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Seasonal preparation</span>
                      <Button variant="ghost" size="sm" href="/#menu">
                        Explore
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="ghost" size="md" href="/#menu">
                View Full Seasonal Menu [Placeholder] →
              </Button>
            </div>
          </Container>
        </Section>

        {/* 5. Visit & Hours Section */}
        <Section
          id="contact"
          variant="subtle"
          spacing="lg"
          aria-labelledby="visit-heading"
        >
          <Container size="default">
            <div className="rounded-2xl bg-surface border border-border/80 p-8 sm:p-12 shadow-md animate-fade-in">
              <div className="text-center max-w-xl mx-auto space-y-4 mb-10">
                <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                  Reservations & Hours [Placeholder]
                </span>
                <Heading id="visit-heading" variant="h2">
                  Plan Your Visit
                </Heading>
                <Text variant="body" className="text-muted-foreground">
                  Join us for an unhurried lunch or an intimate evening celebration. Valet parking and private dining suites are available upon reservation.
                </Text>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/40">
                {/* Hours Block */}
                <div className="space-y-3">
                  <Heading variant="h3" as="h3" className="text-base uppercase tracking-wider text-primary">
                    Hours of Dining
                  </Heading>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li className="flex justify-between border-b border-border/30 pb-1.5">
                      <span className="text-muted-foreground">Monday – Thursday</span>
                      <span className="font-medium">12:00 PM – 10:30 PM</span>
                    </li>
                    <li className="flex justify-between border-b border-border/30 pb-1.5">
                      <span className="text-muted-foreground">Friday – Saturday</span>
                      <span className="font-medium">12:00 PM – 11:30 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">12:30 PM – 10:00 PM</span>
                    </li>
                  </ul>
                </div>

                {/* Address & Booking Block */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <Heading variant="h3" as="h3" className="text-base uppercase tracking-wider text-primary mb-2">
                      Location
                    </Heading>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      [124 Heritage Royal Promenade]
                      <br />
                      [Historic District, City, State 10001]
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Tel: +1 (555) 019-2834 [Placeholder]
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button variant="primary" size="md" href="/#reservations" className="w-full">
                      Book a Table Online [Placeholder]
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      {/* 6. Site Footer */}
      <SiteFooter brandName="Aura of Awadh [Placeholder]" />
    </div>
  );
}
