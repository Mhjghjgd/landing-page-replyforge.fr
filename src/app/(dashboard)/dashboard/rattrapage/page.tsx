import { createClient } from "@/lib/supabase/server";
import { Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Rattrapage express — ReplyForge" };

const benefits = [
  "Tous vos avis sans réponse traités en moins de 48h",
  "Réponses personnalisées selon votre ton configuré",
  "Relecture humaine optionnelle avant publication",
  "Rapport détaillé des réponses générées",
];

export default async function RattrapagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: connection } = await supabase
    .from("zernio_connections")
    .select("zernio_account_id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const isGoogleConnected = !!connection?.zernio_account_id;

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-2">
          Rattrapage express
        </h1>
        <p className="text-[var(--color-foreground-muted)] text-[15px]">
          Des avis qui s'accumulent sans réponse ? On s'en occupe.
        </p>
      </div>

      {/* Main card */}
      <div className="rounded-2xl border border-[var(--color-gold-400)]/30 bg-gradient-to-br from-[var(--color-gold-400)]/5 to-transparent p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          {/* Left: info */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-[12px] font-medium px-3 py-1.5 rounded-full bg-[var(--color-gold-400)]/15 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/25 mb-5">
              <Zap className="w-3 h-3" />
              Service ponctuel — une seule fois
            </div>

            <h2 className="font-display text-2xl text-[var(--color-foreground)] mb-3">
              Répondez à tous vos avis passés
            </h2>
            <p className="text-[14px] text-[var(--color-foreground-muted)] leading-relaxed mb-6 max-w-lg">
              Notre équipe utilise votre profil de ton configuré pour générer des réponses personnalisées à l'ensemble de vos avis Google sans réponse. Un rattrapage complet, livré en 48h.
            </p>

            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-[var(--color-foreground-muted)] leading-relaxed">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: price card */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
              <p className="text-[12px] font-medium text-[var(--color-foreground-muted)] uppercase tracking-wide mb-3">
                Paiement unique
              </p>
              <div className="mb-1">
                <span className="font-display text-5xl text-[var(--color-foreground)]">249</span>
                <span className="text-[18px] text-[var(--color-foreground)] font-medium"> €</span>
              </div>
              <p className="text-[12px] text-[var(--color-foreground-muted)] mb-6">
                Tous avis confondus, sans limite
              </p>

              {isGoogleConnected ? (
                <a
                  href={`mailto:${siteConfig.email}?subject=Rattrapage express ReplyForge&body=Bonjour,%0A%0AJe souhaite commander le service Rattrapage express.%0A%0AMerci.`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-gold-400)] text-[var(--color-ink-950)] font-semibold text-[14px] hover:bg-[var(--color-gold-300)] transition-colors"
                >
                  Commander
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <>
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-gold-400)] text-[var(--color-ink-950)] font-semibold text-[14px] opacity-50 cursor-not-allowed"
                  >
                    Commander
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-[var(--color-foreground-muted)] mt-3 leading-relaxed">
                    Disponible après connexion de votre fiche Google
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Process steps */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h3 className="font-display text-lg text-[var(--color-foreground)] mb-5">Comment ça fonctionne</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Commandez", desc: "Passez commande et connectez votre fiche Google si ce n'est pas déjà fait." },
            { step: "02", title: "On génère", desc: "Notre IA rédige chaque réponse selon votre ton et votre profil d'établissement." },
            { step: "03", title: "Livraison", desc: "Vous recevez toutes les réponses à valider et publier en 48h ouvrées." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-gold-400)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-mono font-bold text-[var(--color-gold-400)]">{step}</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[var(--color-foreground)] mb-1">{title}</p>
                <p className="text-[12px] text-[var(--color-foreground-muted)] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
