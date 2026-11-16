"use client";

import React, { useState } from "react";
import { MenuCategory, formatPrice, getSpiceIndicator } from "@/lib/api/menu";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

interface MenuClientViewProps {
  initialCategories: MenuCategory[];
  errorMessage: string | null;
}

export function MenuClientView({
  initialCategories,
  errorMessage,
}: MenuClientViewProps) {
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(
    initialCategories[0]?.slug || ""
  );

  // Filter items in each category based on veg-only toggle
  const filteredCategories = initialCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => (vegOnly ? item.is_veg : true)),
    }))
    .filter((cat) => cat.items.length > 0);

  const scrollToCategory = (slug: string) => {
    setActiveCategorySlug(slug);
    const element = document.getElementById(`category-${slug}`);
    if (element) {
      const yOffset = -120; // Header + sticky bar offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      {/* Sticky Category Navigation & Filter Bar */}
      <div className="sticky top-20 z-40 w-full backdrop-blur-md bg-background/95 border-b border-border/60 py-3 shadow-sm">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Navigation Pills */}
            <nav
              aria-label="Menu Category Filter"
              className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none"
            >
              {initialCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeCategorySlug === cat.slug
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "bg-surface-elevated text-foreground/80 hover:text-foreground hover:bg-surface border border-border/40"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>

            {/* Veg Only Toggle Switch */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <label
                htmlFor="veg-toggle"
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-foreground font-medium cursor-pointer select-none"
              >
                <span
                  className={`w-3.5 h-3.5 border flex items-center justify-center rounded-[2px] ${
                    vegOnly ? "border-emerald-600 bg-emerald-500/10" : "border-border"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                </span>
                <span>Vegetarian Only</span>
              </label>
              <input
                id="veg-toggle"
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Main Menu Listing Content */}
      <Container size="wide" className="py-12">
        {/* Error State Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-10 p-6 rounded-xl bg-red-950/20 border border-red-800/40 text-center space-y-3"
          >
            <span className="text-2xl text-red-400">⚠️</span>
            <Heading variant="h3" as="h3" className="text-red-300">
              Menu Service Notice
            </Heading>
            <Text variant="body" className="text-red-200/80 max-w-lg mx-auto text-sm">
              {errorMessage}
            </Text>
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-red-300 border-red-700/50 hover:bg-red-900/30"
              >
                Retry Loading
              </Button>
            </div>
          </div>
        )}

        {/* Empty Filter State */}
        {!errorMessage && filteredCategories.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <span className="text-4xl text-muted-foreground opacity-60">🍃</span>
            <Heading variant="h2">No Dishes Match Your Filter</Heading>
            <Text variant="lead" className="max-w-md mx-auto">
              There are currently no items matching your dietary criteria.
            </Text>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setVegOnly(false)}
            >
              Show All Dishes
            </Button>
          </div>
        )}

        {/* Categories and Cards */}
        <div className="space-y-20">
          {filteredCategories.map((category) => (
            <section
              key={category.id}
              id={`category-${category.slug}`}
              className="scroll-mt-36 space-y-8"
              aria-labelledby={`heading-${category.slug}`}
            >
              {/* Category Header */}
              <div className="border-b border-border/50 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <Heading
                    id={`heading-${category.slug}`}
                    variant="h1"
                    className="text-2xl sm:text-3xl font-serif text-foreground"
                  >
                    {category.name}
                  </Heading>
                  {category.description && (
                    <Text variant="body" className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </Text>
                  )}
                </div>
                <span className="text-xs uppercase tracking-widest text-primary font-medium">
                  {category.items.length} {category.items.length === 1 ? "Dish" : "Dishes"}
                </span>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => {
                  const spice = getSpiceIndicator(item.spice_level);
                  return (
                    <article
                      key={item.id}
                      className="group relative flex flex-col justify-between rounded-xl p-6 bg-surface border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="space-y-3">
                        {/* Badges: Veg indicator & Spice Level & Featured */}
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            {/* Indian Vegetarian / Non-Vegetarian Standard Symbol */}
                            {item.is_veg ? (
                              <span
                                title="Vegetarian"
                                className="w-4 h-4 border border-emerald-600 flex items-center justify-center rounded-[2px]"
                              >
                                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                              </span>
                            ) : (
                              <span
                                title="Non-Vegetarian"
                                className="w-4 h-4 border border-amber-900 flex items-center justify-center rounded-[2px]"
                              >
                                <span className="w-2 h-2 rounded-full bg-amber-900" />
                              </span>
                            )}

                            {/* Spice Level Badge */}
                            {spice.count > 0 && (
                              <span
                                title={spice.label}
                                className="text-[11px] text-orange-400 font-medium tracking-wide flex items-center gap-0.5"
                              >
                                {Array.from({ length: spice.count }).map((_, i) => (
                                  <span key={i}>🌶️</span>
                                ))}
                                <span className="text-muted-foreground ml-1">{spice.label}</span>
                              </span>
                            )}
                          </div>

                          {/* Featured Pill */}
                          {item.is_featured && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] uppercase font-bold tracking-wider">
                              Chef Pick
                            </span>
                          )}
                        </div>

                        {/* Item Title & Price */}
                        <div className="flex items-start justify-between gap-4 pt-1">
                          <Heading variant="h3" as="h3" className="text-lg font-serif text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </Heading>
                          <span className="font-serif text-lg font-bold text-primary whitespace-nowrap">
                            {formatPrice(item.price_paise)}
                          </span>
                        </div>

                        {/* Item Description */}
                        <Text variant="body" className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </Text>
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="pt-4 mt-4 border-t border-border/30 flex items-center justify-between text-xs text-subtle-foreground">
                        <span>Prepared fresh to order</span>
                        <span className="text-primary font-serif">Aura of Awadh</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
