import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { CheckCircle2, MapPin, ArrowRight, Building2 } from "lucide-react";
import { ConnectGoogleButton } from "@/components/dashboard/ConnectGoogleButton";
import { FinalizeStep } from "@/components/dashboard/FinalizeStep";

export const metadata = { title: "Connexion Google — ReplyForge" };

export default async function OnboardingGooglePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; step?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const params = await searchParams;
  const sessionId = params.session_id;
  const step = params.step;

  let paymentConfirmed = false;

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

  // Check existing connection
  const { data: connection } = await supabase
    .from("zernio_connections")
    .select("zernio_account_id, business_name, business_address, business_city")
    .eq("user_id", user.id)
    .maybeSingle();

  const isAlreadyConnected = Boolean(connection?.zernio_account_id);
  const isFinalizingStep = step === "finalize";

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
      <div className="max-w-lg w-full">

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
            {isAlreadyConnected ? "Fiche connectée" : "Connectez votre fiche Google"}
          </h1>
          <p className="text-[var(--color-foreground-muted)] text-lg leading-relaxed">
            {isAlreadyConnected
              ? "Votre fiche Google est bien reliée à ReplyForge."
              : "Reliez votre fiche Google pour récupérer vos avis et activer les réponses automatiques."}
          </p>
        </div>

        {/* State A — Not connected */}
        {!isAlreadyConnected && !isFinalizingStep && (
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
            <ConnectGoogleButton />
          </div>
        )}

        {/* State B — Finalizing after OAuth */}
        {!isAlreadyConnected && isFinalizingStep && (
          <div className="mb-6">
            <FinalizeStep />
          </div>
        )}

        {/* State C — Already connected */}
        {isAlreadyConnected && (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[var(--color-foreground)]">
                  {connection?.business_name ?? "Fiche Google connectée"}
                </p>
                {(connection?.business_address || connection?.business_city) && (
                  <p className="text-[12px] text-[var(--color-foreground-muted)] mt-0.5">
                    {[connection.business_address, connection.business_city]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-[11px] text-green-400 font-medium">Connectée</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className={isAlreadyConnected ? "space-y-3" : "text-center"}>
          {isAlreadyConnected ? (
            <>
              <Link
                href="/dashboard/avis"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[var(--color-gold-400)] text-[var(--color-ink-950)] text-sm font-semibold hover:bg-[var(--color-gold-300)] transition-colors"
              >
                Continuer vers le dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={undefined}
                data-disconnect
                className="w-full text-center text-[12px] text-[var(--color-foreground-muted)] hover:text-red-400 transition-colors py-2"
              >
                Changer de fiche →
              </button>
            </>
          ) : (
            !isFinalizingStep && (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-gold-400)] transition-colors"
              >
                Passer cette étape pour l'instant
                <ArrowRight className="w-4 h-4" />
              </Link>
            )
          )}
        </div>

      </div>
    </div>
  );
}
