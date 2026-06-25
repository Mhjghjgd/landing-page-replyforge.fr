"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    console.debug("[SignIn] Attempting signInWithPassword for", email);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      console.debug("[SignIn] Error:", signInError.message);
      if (
        signInError.message.includes("Invalid login credentials") ||
        signInError.message.includes("invalid_credentials")
      ) {
        setError("Email ou mot de passe incorrect.");
      } else if (
        signInError.message.includes("Email not confirmed") ||
        signInError.message.includes("email_not_confirmed")
      ) {
        setError(
          "Votre adresse email n'est pas encore confirmée. Vérifiez votre boîte de réception et cliquez sur le lien de confirmation."
        );
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    console.debug("[SignIn] Success, user id:", data.user?.id, "— redirecting to /dashboard");
    // Hard navigation: forces a full round-trip so the middleware sees the new session cookies.
    window.location.href = "/dashboard";
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 pb-8">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <CardTitle className="text-center text-3xl">Connectez-vous</CardTitle>
        <CardDescription className="text-center">
          Accédez à votre espace de gestion des avis Google.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="vous@hotel.fr"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <span className="text-xs text-[var(--color-foreground-muted)] cursor-not-allowed">
                Mot de passe oublié ?
              </span>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="md" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-foreground-muted)]">
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="text-[var(--color-gold-400)] hover:text-[var(--color-gold-300)] underline underline-offset-4 transition-colors"
          >
            S'inscrire
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
