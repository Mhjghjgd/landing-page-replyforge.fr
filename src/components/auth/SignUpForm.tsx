"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";
import { Loader2 } from "lucide-react";

type Step = "form" | "checkout";

export function SignUpForm() {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const fullName = (form.elements.namedItem("full_name") as HTMLInputElement).value;
    const hotelName = (form.elements.namedItem("hotel_name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, hotel_name: hotelName },
      },
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setError("Cet email est déjà utilisé. Essayez de vous connecter.");
      } else if (signUpError.message.includes("Password should be at least")) {
        setError("Le mot de passe doit contenir au moins 8 caractères.");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    // Account created — now redirect to Stripe Checkout
    setStep("checkout");

    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Impossible de créer la session de paiement");
      }

      // Hard redirect to Stripe (or /dashboard if already active)
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      setStep("form");
      setLoading(false);
    }
  }

  if (step === "checkout") {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-12 pb-12 flex flex-col items-center gap-5">
          <Loader2 className="w-10 h-10 text-[var(--color-gold-400)] animate-spin" />
          <div className="text-center">
            <p className="text-[var(--color-foreground)] font-medium text-lg">
              Préparation de votre abonnement…
            </p>
            <p className="text-[var(--color-foreground-muted)] text-sm mt-1">
              Vous allez être redirigé vers le paiement sécurisé.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 pb-8">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <CardTitle className="text-center text-3xl">Inscrivez-vous</CardTitle>
        <CardDescription className="text-center">
          Créez votre compte et commencez à automatiser vos réponses Google.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Mohamed Dekoumi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotel_name">Établissement</Label>
              <Input
                id="hotel_name"
                name="hotel_name"
                type="text"
                placeholder="Hôtel Le Belvédère"
                required
              />
            </div>
          </div>
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
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 8 caractères"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="md" disabled={loading}>
            {loading ? "Création en cours…" : "Créer mon compte — 229 €/mois"}
          </Button>
          <p className="text-center text-xs text-[var(--color-foreground-muted)]">
            Vous serez redirigé vers le paiement sécurisé Stripe.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-foreground-muted)]">
          Déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="text-[var(--color-gold-400)] hover:text-[var(--color-gold-300)] underline underline-offset-4 transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
