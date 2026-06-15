import type { Metadata } from "next";
import {
  Search,
  FileText,
  Wrench,
  LineChart,
  Link2,
  Shield,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Méthode SEO hôtelière",
  description:
    "Notre méthodologie complète pour faire grimper votre hôtel dans Google : audit, technique, contenu, autorité, conversion. Transparente et chiffrée.",
};

const phases = [
  {
    icon: Search,
    n: "Phase 01",
    title: "Diagnostic & cartographie",
    body: "Tout part d'une analyse honnête de votre situation. Nous auditons votre site, votre fiche Google Business Profile, vos OTA, vos concurrents directs, et la demande réelle sur vos requêtes-clés.",
    deliverables: [
      "Audit SEO technique (200+ points de contrôle)",
      "Cartographie sémantique du marché local",
      "Analyse concurrentielle des 10 hôtels proches",
      "Benchmark Booking : ce que vous payez vs ce que ça vous rapporte",
      "Plan d'action priorisé sur 12 mois",
    ],
  },
  {
    icon: Wrench,
    n: "Phase 02",
    title: "Refonte technique",
    body: "Un site rapide, structuré, accessible. C'est la base non-négociable : Google ne classera jamais bien un site lent ou mal structuré, et un visiteur n'attendra pas qu'il charge.",
    deliverables: [
      "Optimisation Core Web Vitals (LCP < 2,5s)",
      "Implémentation des schemas Hotel + Room + LocalBusiness",
      "Restructuration de l'architecture de l'information",
      "Optimisation des images (WebP/AVIF, lazy load)",
      "Configuration du moteur de réservation",
    ],
  },
  {
    icon: FileText,
    n: "Phase 03",
    title: "Contenu éditorial",
    body: "Ce qu'on écrit sur votre site est ce qui vous distingue. Pages chambres, expériences, restaurant, guide local — chaque mot est pensé pour Google et pour faire rêver le voyageur.",
    deliverables: [
      "Réécriture des pages chambres (signature éditoriale)",
      "Création des pages destination & expériences",
      "Guide local SEO (10–30 articles par an)",
      "Optimisation des pages tarifs et offres",
      "Cohérence ton de voix sur tout le site",
    ],
  },
  {
    icon: Link2,
    n: "Phase 04",
    title: "Autorité & backlinks",
    body: "Google fait confiance aux sites vers qui d'autres sites pointent. Nous travaillons votre autorité avec des liens de presse, guides de voyage, partenaires locaux et institutionnels.",
    deliverables: [
      "Stratégie netlinking éditorial",
      "Relations presse hôtellerie / tourisme",
      "Partenariats locaux (OT, guides, médias)",
      "Optimisation Google Business Profile",
      "Gestion des avis et signaux d'engagement",
    ],
  },
  {
    icon: LineChart,
    n: "Phase 05",
    title: "Pilotage & croissance",
    body: "Chaque mois, vous voyez ce qui progresse, ce qui ne progresse pas, et ce qu'on fait pour corriger. Pas de rapport opaque — des indicateurs business clairs.",
    deliverables: [
      "Dashboard mensuel personnalisé",
      "KPIs business : revenus directs, part OTA, RevPAR direct",
      "Point mensuel de 45 min avec votre direction",
      "Itérations continues sur le contenu et la technique",
      "Veille concurrentielle permanente",
    ],
  },
  {
    icon: Shield,
    n: "Phase 06",
    title: "Anti-dépendance OTA",
    body: "Notre objectif final : que votre canal direct devienne suffisamment puissant pour vous donner du pouvoir de négociation face à Booking — et idéalement, pour vous en passer largement.",
    deliverables: [
      "Stratégie d'incitation à la réservation directe",
      "Best Rate Guarantee intelligent",
      "Récupération d'emails et fidélisation",
      "Programme de récompenses direct booker",
      "Conseil sur la renégociation des contrats OTA",
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
            Six phases.{" "}
            <span className="italic text-[var(--color-gold-300)]">
              Aucune approximation
            </span>
            .
          </>
        }
        subtitle="Voici exactement comment nous transformons votre canal direct en machine à réservations. Pas de promesses creuses, pas de jargon — la méthode complète."
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
                      <Eyebrow>Livrables</Eyebrow>
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
