"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/api/menu";

interface AdminItem {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  price_paise: number;
  is_veg: boolean;
  spice_level: "none" | "mild" | "medium" | "hot" | "very_hot";
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
}

interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  items: AdminItem[];
}

export default function AdminMenuPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Item Form Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryId, setNewCategoryId] = useState<number>(0);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriceRupees, setNewPriceRupees] = useState("");
  const [newIsVeg, setNewIsVeg] = useState(true);
  const [newSpiceLevel, setNewSpiceLevel] = useState<"none" | "mild" | "medium" | "hot" | "very_hot">("mild");
  const [newIsFeatured, setNewIsFeatured] = useState(false);
  const [savingItem, setSavingItem] = useState(false);

  // Load menu data via proxy
  const fetchAdminMenu = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/menu/categories");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        setFeedback({ type: "error", text: "Failed to load categories" });
        setLoading(false);
        return;
      }
      const data: AdminCategory[] = await res.json();
      setCategories(data);
      if (data.length > 0) {
        setNewCategoryId((prev) => (prev === 0 ? data[0].id : prev));
      }
      setLoading(false);
    } catch {
      setFeedback({ type: "error", text: "Failed to communicate with admin API" });
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!ignore) {
        await fetchAdminMenu();
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [fetchAdminMenu]);

  // Quick availability toggle
  const toggleAvailability = async (item: AdminItem) => {
    const nextState = !item.is_available;
    try {
      const res = await fetch(`/api/admin/menu/items/${item.id}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: nextState }),
      });

      if (!res.ok) {
        setFeedback({ type: "error", text: `Failed to toggle availability for ${item.name}` });
        return;
      }

      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          items: cat.items.map((i) =>
            i.id === item.id ? { ...i, is_available: nextState } : i
          ),
        }))
      );
      setFeedback({
        type: "success",
        text: `Availability for "${item.name}" updated to ${nextState ? "Available" : "Unavailable"}.`,
      });
    } catch {
      setFeedback({ type: "error", text: "Network error updating availability" });
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/menu/items/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setFeedback({ type: "error", text: `Failed to delete ${name}` });
        return;
      }

      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          items: cat.items.filter((i) => i.id !== itemId),
        }))
      );
      setFeedback({ type: "success", text: `Item "${name}" was deleted.` });
    } catch {
      setFeedback({ type: "error", text: "Network error deleting item" });
    }
  };

  // Create new item
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingItem(true);
    setFeedback(null);

    const pricePaise = Math.round(parseFloat(newPriceRupees) * 100);
    if (isNaN(pricePaise) || pricePaise < 0) {
      setFeedback({ type: "error", text: "Please provide a valid non-negative price in Rupees" });
      setSavingItem(false);
      return;
    }

    const payload = {
      category_id: newCategoryId,
      name: newName,
      slug: newSlug || newName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: newDescription || "[Placeholder description]",
      price_paise: pricePaise,
      is_veg: newIsVeg,
      spice_level: newSpiceLevel,
      is_available: true,
      is_featured: newIsFeatured,
      sort_order: 10,
    };

    try {
      const res = await fetch("/api/admin/menu/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setFeedback({
          type: "error",
          text: errorData.detail || "Failed to create menu item",
        });
        setSavingItem(false);
        return;
      }

      const created: AdminItem = await res.json();
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === created.category_id
            ? { ...cat, items: [...cat.items, created] }
            : cat
        )
      );

      // Reset form
      setNewName("");
      setNewSlug("");
      setNewDescription("");
      setNewPriceRupees("");
      setShowAddModal(false);
      setSavingItem(false);
      setFeedback({ type: "success", text: `Created new item "${created.name}" successfully!` });
    } catch {
      setFeedback({ type: "error", text: "Error creating menu item" });
      setSavingItem(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-surface border-b border-border py-4 px-6 shadow-sm">
        <Container size="wide">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-serif text-xl font-bold text-primary">
                ✦ Aura of Awadh
              </Link>
              <span className="text-muted-foreground text-xs font-mono uppercase tracking-widest bg-surface-elevated px-2 py-0.5 rounded border border-border">
                Admin Panel
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/menu"
                target="_blank"
                className="text-xs text-foreground/80 hover:text-primary transition-colors py-1 px-3 rounded border border-border/50"
              >
                View Public Menu ↗
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Admin Area */}
      <main className="py-10">
        <Container size="wide">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-border/60">
            <div>
              <Heading variant="h1" className="text-2xl sm:text-3xl text-foreground">
                Menu Management
              </Heading>
              <Text variant="caption" className="text-muted-foreground mt-1">
                Toggle live kitchen availability, adjust prices, or introduce new seasonal creations.
              </Text>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setShowAddModal(true)}
              className="gap-1.5 self-start sm:self-auto"
            >
              <span>+</span>
              <span>Add New Dish</span>
            </Button>
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div
              className={`my-6 p-4 rounded-lg text-sm flex items-center justify-between ${
                feedback.type === "success"
                  ? "bg-emerald-950/20 border border-emerald-800/40 text-emerald-300"
                  : "bg-red-950/20 border border-red-800/40 text-red-300"
              }`}
            >
              <span>{feedback.text}</span>
              <button
                onClick={() => setFeedback(null)}
                className="text-xs opacity-60 hover:opacity-100 ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="py-20 text-center text-muted-foreground text-sm">
              Loading menu catalog from database...
            </div>
          )}

          {/* Categories and Items Table */}
          {!loading && (
            <div className="space-y-12 mt-8">
              {categories.map((category) => (
                <section
                  key={category.id}
                  className="rounded-xl bg-surface border border-border overflow-hidden shadow-sm"
                >
                  <div className="bg-surface-elevated/70 px-6 py-4 border-b border-border flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-foreground">
                        {category.name}
                      </h2>
                      <span className="text-xs text-muted-foreground">slug: /{category.slug}</span>
                    </div>
                    <span className="text-xs text-primary font-medium">
                      {category.items.length} items
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface-elevated/30 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/40">
                        <tr>
                          <th className="py-3 px-6">Dish Name & Description</th>
                          <th className="py-3 px-4">Dietary</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Availability</th>
                          <th className="py-3 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {category.items.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 px-6 text-center text-muted-foreground text-xs">
                              No items currently in this category.
                            </td>
                          </tr>
                        ) : (
                          category.items.map((item) => (
                            <tr key={item.id} className="hover:bg-surface-elevated/40 transition-colors">
                              <td className="py-4 px-6 max-w-xs sm:max-w-md">
                                <div className="font-medium text-foreground flex items-center gap-2">
                                  <span>{item.name}</span>
                                  {item.is_featured && (
                                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/30 px-1.5 py-0.2 rounded font-bold">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                  {item.description}
                                </p>
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-xs">
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full ${
                                      item.is_veg ? "bg-emerald-500" : "bg-amber-800"
                                    }`}
                                  />
                                  <span className="text-muted-foreground text-xs capitalize">
                                    {item.is_veg ? "Veg" : "Non-Veg"} ({item.spice_level})
                                  </span>
                                </div>
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap font-serif font-bold text-foreground">
                                {formatPrice(item.price_paise)}
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => toggleAvailability(item)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                    item.is_available ? "bg-emerald-600" : "bg-neutral-700"
                                  }`}
                                  aria-label={`Toggle availability for ${item.name}`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      item.is_available ? "translate-x-6" : "translate-x-1"
                                    }`}
                                  />
                                </button>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {item.is_available ? "Active" : "Hidden"}
                                </span>
                              </td>

                              <td className="py-4 px-6 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(item.id, item.name)}
                                  className="text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          )}
        </Container>
      </main>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif text-xl font-bold text-foreground">
                Add New Menu Dish
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">
                  Category
                </label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-md bg-surface-elevated border border-border text-foreground text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Kakori Kebab Royal"
                  className="w-full px-3 py-2 rounded-md bg-surface-elevated border border-border text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">
                  URL Slug (Optional - auto-generated if left blank)
                </label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="e.g. kakori-kebab-royal"
                  className="w-full px-3 py-2 rounded-md bg-surface-elevated border border-border text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">
                  Price in Rupees (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={newPriceRupees}
                  onChange={(e) => setNewPriceRupees(e.target.value)}
                  placeholder="e.g. 450"
                  className="w-full px-3 py-2 rounded-md bg-surface-elevated border border-border text-foreground text-sm"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  Stored safely in database as integer paise ({newPriceRupees ? Math.round(parseFloat(newPriceRupees) * 100) : 0} paise)
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Tender chargrilled kebabs marinated in cloves and saffron [Placeholder description]"
                  className="w-full px-3 py-2 rounded-md bg-surface-elevated border border-border text-foreground text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">
                    Dietary
                  </label>
                  <select
                    value={newIsVeg ? "veg" : "nonveg"}
                    onChange={(e) => setNewIsVeg(e.target.value === "veg")}
                    className="w-full px-3 py-2 rounded-md bg-surface-elevated border border-border text-foreground text-sm"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">
                    Spice Level
                  </label>
                  <select
                    value={newSpiceLevel}
                    onChange={(e) => setNewSpiceLevel(e.target.value as "none" | "mild" | "medium" | "hot" | "very_hot")}
                    className="w-full px-3 py-2 rounded-md bg-surface-elevated border border-border text-foreground text-sm"
                  >
                    <option value="none">None (Zero spice)</option>
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="hot">Hot</option>
                    <option value="very_hot">Very Hot</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="featured-check"
                  type="checkbox"
                  checked={newIsFeatured}
                  onChange={(e) => setNewIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <label htmlFor="featured-check" className="text-xs text-foreground select-none cursor-pointer">
                  Feature as Chef Pick on Menu
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={savingItem}
                >
                  {savingItem ? "Saving..." : "Create Dish"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
