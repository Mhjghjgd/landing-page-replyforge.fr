import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY ?? "";

// Log Stripe mode on server startup (server-side only)
if (typeof window === "undefined" && key) {
  if (key.startsWith("sk_live_")) {
    console.warn(
      "⚠️  STRIPE MODE LIVE DÉTECTÉ — Les paiements seront réels ! (carte test 4242 ne fonctionnera PAS)"
    );
  } else if (key.startsWith("sk_test_")) {
    console.log("✅ Stripe Mode TEST — Cartes test acceptées (4242 4242 4242 4242)");
  } else if (key) {
    console.warn("⚠️  Clé Stripe non reconnue (ni sk_live_ ni sk_test_)");
  }
}

export const stripe = new Stripe(key, {
  apiVersion: "2025-02-24.acacia",
});

export function isStripeTestMode() {
  return process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? false;
}
