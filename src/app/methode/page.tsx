import type { Metadata } from "next";
import {
  Link2,
  Mic,
  Sparkles,
  Send,
  LineChart,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Méthode — Comment ça marche",
  description:
    "La méthode ReplyForge en détail : connexion à votre fiche Google, calibrage du ton de votre établissement, réponses générées par IA et publiées automatiquement.",
};

const phases = [
  {
    icon: Link2,
    n: "Étape 01",
    title: "Connexion à votre fiche Google",
    body: "On vous envoie une demande d'accès gestionnaire sur votre Google Business Profile. Vous validez en un clic. C'est exactement le même mécanisme que d'ajouter un employé à votre fiche — vous gardez la propriété et le contrôle complet.",
    deliverables: [
      "Demande d'accès gestionnaire envoyée",
      "Validation en un clic de votre côté",
      "Vérification que tous les avis remontent bien",
      "Aucun changement visible côté client",
      "Mise en service sous 24h",
    ],
  },
  {
    icon: Mic,
    n: "Étape 02",
    title: "Calibrage du ton de votre hôtel",
    body: "Avant qu'une seule réponse soit publiée, on apprend à parler comme vous. Vocabulaire, ton, signature, valeurs : on définit ensemble ce qui doit transparaître dans chaque réponse.",
    deliverables: [
      "Questionnaire de 10 minutes (style, ton)",
      "Validation de la signature de fin",
      "Choix du tutoiement / vouvoiement",
      "Sujets à mettre en avant (gastronomie, calme, terrasse…)",
      "Mots à éviter ou à ne jamais utiliser",
    ],
  },
  {
    icon: Sparkles,
    n: "Étape 03",
    title: "Génération des réponses par IA",
    body: "Dès qu'un nouvel avis tombe sur votre fiche, notre IA le lit, en comprend les nuances, et génère une réponse personnalisée. Chaque réponse reprend les éléments concrets de l'avis : nom du client, point positif mentionné, critique éventuelle.",
    deliverables: [
      "Détection en temps réel des nouveaux avis",
      "Analyse du contenu et du contexte",
      "Génération en moins de 5 secondes",
      "Réponse personnalisée à chaque avis",
      "Traitement des critiques sans défensive",
    ],
  },
  {
    icon: Send,
    n: "Étape 04",
    title: "Publication automatique",
    body: "Pour les avis positifs et neutres, la réponse est publiée automatiquement, dans les heures qui suivent. Pour les avis négatifs (1 ou 2 étoiles), on peut activer la validation manuelle : vous recevez la réponse par mail, vous approuvez ou modifiez en un clic.",
    deliverables: [
      "Publication auto pour 3★, 4★ et 5★",
      "Mode validation pour les 1★ et 2★ (optionnel)",
      "Notification email à chaque réponse publiée",
      "Historique consultable à tout moment",
      "Désactivation possible à tout moment",
    ],
  },
  {
    icon: LineChart,
    n: "Étape 05",
    title: "Suivi & ajustements",
    body: "Chaque mois, vous recevez un récap : nombre d'avis traités, évolution de la note moyenne, évolution des clics sur votre fiche. Si quelque chose doit être ajusté dans le ton, vous nous le dites — on recalibre.",
    deliverables: [
      "Récap mensuel par email",
      "Évolution de la note Google",
      "Évolution des vues et clics sur la fiche",
      "Ajustements de ton à la demande",
      "Conseils sur les sujets qui reviennent dans les avis",
    ],
  },
];

export default function MethodPage() {
  return (
    <>
      <PageHeader
        eyebrow="Notre méthode"
        title={
          <>
            Cinq étapes.{" "}
            <span className="italic text-[var(--color-gold-300)]">
              Aucune complexité
            </span>
            .
          </>
        }
        subtitle="Voici exactement comment on s'occupe de vos avis Google. De la première connexion à la première réponse publiée, en passant par le calibrage du ton de votre hôtel."
      />

      <section className="py-24 lg:py-32">
        <Container>
          <RevealGroup as="div" className="flex flex-col gap-20">
            {phases.map((phase, i) => (
              <RevealItem key={phase.n}>
                <div
                  className={`grid gap-10 lg:grid-cols-12 lg:gap-16 ${
                    i % 2 === 1 ? "lg:[direction:rtl]" : ""
                  }`}
                >
                  <div className="lg:col-span-5 lg:[direction:ltr]">
                    <div className="sticky top-28">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
                        {phase.n}
                      </p>
                      <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-gold-400)]/25 bg-[var(--color-gold-400)]/10 text-[var(--color-gold-300)]">
                        <phase.icon size={22} aria-hidden />
                      </div>
                      <h2 className="font-display mt-6 text-balance text-3xl leading-[1.05] text-[var(--color-foreground)] md:text-4xl lg:text-5xl">
                        {phase.title}
                      </h2>
                      <p className="mt-5 text-pretty text-base leading-relaxed text-[var(--color-pearl-300)]">
                        {phase.body}
                      </p>
                    </div>
                  </div>
                  <div className="lg:col-span-7 lg:[direction:ltr]">
                    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-ink-900)]/60 p-8 lg:p-10">
                      <Eyebrow>Ce qu&apos;on fait concrètement</Eyebrow>
                      <ul className="mt-7 flex flex-col gap-4">
                        {phase.deliverables.map((d, j) => (
                          <li
                            key={d}
                            className="flex items-start gap-4 border-b border-[var(--color-border)]/60 pb-4 last:border-b-0 last:pb-0"
                          >
                            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-gold-400)] mt-1">
                              {String(j + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[15px] leading-relaxed text-[var(--color-pearl-200)]">
                              {d}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <Reveal>
        <CTA />
      </Reveal>
    </>
  );
}
