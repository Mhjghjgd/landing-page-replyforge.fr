import Stripe from "stripe";

// Lazily instantiated to avoid throwing at build time when STRIPE_SECRET_KEY is absent
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  if (typeof window === "undefined") {
    if (key.startsWith("sk_live_")) {
      console.warn(
        "⚠️  STRIPE MODE LIVE DÉTECTÉ — Les paiements seront réels ! (carte test 4242 ne fonctionnera PAS)"
      );
    } else if (key.startsWith("sk_test_")) {
      console.log("✅ Stripe Mode TEST — Cartes test acceptées (4242 4242 4242 4242)");
    } else {
      console.warn("⚠️  Clé Stripe non reconnue (ni sk_live_ ni sk_test_)");
    }
  }
  _stripe = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  return _stripe;
}

// Keep the named export for backwards compat — behaves identically but lazy
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

export function isStripeTestMode() {
  return process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? false;
}
