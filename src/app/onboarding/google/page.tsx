import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Connexion Google — ReplyForge",
};

export default async function OnboardingGooglePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const params = await searchParams;
  const sessionId = params.session_id;
  let paymentConfirmed = false;

  // If coming from Stripe, verify and update profile inline (in case webhook is delayed)
  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid" || session.status === "complete") {
        paymentConfirmed = true;
        const serviceSupabase = createServiceClient();
        await serviceSupabase
          .from("profiles")
          .update({
            subscription_status: "active",
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", user.id);
      }
    } catch (err) {
      console.error("[Onboarding] Stripe session verification failed:", err);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
      <div className="max-w-lg w-full">

        {/* Success banner (only if coming from Stripe) */}
        {paymentConfirmed && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-300 font-medium">
              Bienvenue ! Votre paiement a été confirmé. Votre abonnement ReplyForge est actif.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-6">
            <MapPin className="w-8 h-8 text-[var(--color-gold-400)]" />
          </div>
          <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-3">
            Connectez votre fiche Google
          </h1>
          <p className="text-[var(--color-foreground-muted)] text-lg leading-relaxed">
            Étape suivante : reliez votre fiche Google pour récupérer vos avis et générer des réponses automatiques.
          </p>
        </div>

        {/* Action card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--color-gold-400)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[var(--color-gold-400)] font-bold text-sm">G</span>
            </div>
            <div>
              <h2 className="text-[var(--color-foreground)] font-medium mb-1">Google My Business</h2>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Autorisez ReplyForge à accéder à vos avis Google pour automatiser les réponses.
              </p>
            </div>
          </div>

          <button
            disabled
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[var(--color-border)] text-[var(--color-foreground-muted)] text-sm font-medium cursor-not-allowed opacity-60"
            title="Disponible en Phase 4"
          >
            Connecter ma fiche Google
            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-[var(--color-gold-400)]/20 text-[var(--color-gold-400)] font-mono">
              Phase 4
            </span>
          </button>
        </div>

        {/* Skip */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-gold-400)] transition-colors"
          >
            Passer cette étape pour l'instant
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
