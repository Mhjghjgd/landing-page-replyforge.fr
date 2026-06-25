import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreditCard, ExternalLink } from "lucide-react";
import { ResumePaymentButton } from "@/components/billing/ResumePaymentButton";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";

export const metadata = {
  title: "Abonnement requis — ReplyForge",
};

export default async function PaiementRequisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, stripe_customer_id, hotel_name")
    .eq("id", user.id)
    .single();

  // Already active? Redirect to dashboard
  if (profile?.subscription_status === "active") {
    redirect("/dashboard");
  }

  const hasStripeCustomer = Boolean(profile?.stripe_customer_id);
  const isPastDue = profile?.subscription_status === "past_due";

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-6">
            <CreditCard className="w-8 h-8 text-[var(--color-gold-400)]" />
          </div>
          <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-3">
            {isPastDue ? "Paiement en échec" : "Abonnement requis"}
          </h1>
          <p className="text-[var(--color-foreground-muted)] text-lg leading-relaxed">
            {isPastDue
              ? "Votre dernier paiement n'a pas abouti. Mettez à jour votre moyen de paiement pour continuer."
              : "Votre abonnement n'est pas encore actif. Finalisez votre paiement pour accéder au dashboard."}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[var(--color-foreground-muted)]">Statut</span>
            <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
              isPastDue
                ? "bg-red-500/15 text-red-400"
                : "bg-yellow-500/15 text-yellow-400"
            }`}>
              {isPastDue ? "Paiement échoué" : "En attente de paiement"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-foreground-muted)]">Abonnement</span>
            <span className="text-sm text-[var(--color-foreground)] font-medium">89 €/mois</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {hasStripeCustomer ? (
            <ManageSubscriptionButton label="Mettre à jour le paiement" />
          ) : (
            <ResumePaymentButton />
          )}

          {hasStripeCustomer && (
            <ManageSubscriptionButton
              label="Gérer mon abonnement"
              variant="secondary"
            />
          )}
        </div>

        <div className="mt-6 text-center">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
