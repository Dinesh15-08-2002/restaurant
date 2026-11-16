"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid administrator credentials");
        setLoading(false);
        return;
      }

      router.push("/admin/menu");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Container size="narrow">
        <div className="w-full max-w-md mx-auto rounded-2xl bg-surface border border-border p-8 sm:p-10 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xl font-serif font-semibold text-primary"
            >
              <span>✦</span>
              <span>Aura of Awadh</span>
            </Link>
            <Heading variant="h2" as="h1" className="text-2xl text-foreground">
              Manager Portal
            </Heading>
            <Text variant="caption" className="text-muted-foreground">
              Sign in to manage categories, menu dishes, and kitchen availability.
            </Text>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-md bg-red-950/20 border border-red-800/40 text-red-300 text-xs text-center font-medium"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="admin-email"
                className="block text-xs uppercase tracking-wider text-muted-foreground font-medium"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@restaurant.com"
                className="w-full px-3.5 py-2.5 rounded-md bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="admin-password"
                className="block text-xs uppercase tracking-wider text-muted-foreground font-medium"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-md bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? "Authenticating..." : "Sign In to Admin"}
            </Button>
          </form>

          <div className="pt-4 border-t border-border/40 text-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              ← Return to Restaurant Homepage
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
