import { createClient } from "@/lib/supabase/server";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";

export const metadata = {
  title: "Dashboard — ReplyForge",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("hotel_name, stripe_customer_id, subscription_status, subscription_current_period_end")
    .eq("id", user!.id)
    .single();

  const nextBillingDate = profile?.subscription_current_period_end
    ? new Date(profile.subscription_current_period_end).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-3xl space-y-12">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-3">
          Bienvenue,{" "}
          <span className="text-[var(--color-gold-400)]">{profile?.hotel_name ?? "votre hôtel"}</span>
        </h1>
        <p className="text-[var(--color-foreground-muted)] text-lg">
          Les prochaines phases apporteront la connexion Google, la gestion des avis et les réponses automatiques.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Avis en attente", value: "—" },
          { label: "Réponses publiées", value: "—" },
          { label: "Note moyenne", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6"
          >
            <p className="text-sm text-[var(--color-foreground-muted)]">{stat.label}</p>
            <p className="text-3xl font-display text-[var(--color-gold-400)] mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Billing */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="font-display text-xl text-[var(--color-foreground)] mb-5">
          Compte &amp; facturation
        </h2>
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]/60">
            <span className="text-sm text-[var(--color-foreground-muted)]">Statut abonnement</span>
            <span className="text-sm font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
              ✓ Actif
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]/60">
            <span className="text-sm text-[var(--color-foreground-muted)]">Montant</span>
            <span className="text-sm text-[var(--color-foreground)]">89 €/mois</span>
          </div>
          {nextBillingDate && (
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-[var(--color-foreground-muted)]">Prochain renouvellement</span>
              <span className="text-sm text-[var(--color-foreground)]">{nextBillingDate}</span>
            </div>
          )}
        </div>

        {profile?.stripe_customer_id ? (
          <ManageSubscriptionButton label="Gérer mon abonnement" variant="outline" />
        ) : (
          <p className="text-xs text-[var(--color-foreground-muted)]">
            Le portail de facturation sera disponible après votre premier renouvellement.
          </p>
        )}
      </div>
    </div>
  );
}
