import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Résultats & cas clients",
  description:
    "Des hôteliers qui ont repris le contrôle de leur visibilité et de leurs marges. Chiffres réels, méthodologie transparente.",
};

const cases = [
  {
    name: "Hôtel boutique 4★",
    location: "Lyon · centre Presqu'île",
    rooms: "42 chambres",
    challenge:
      "60% du chiffre via Booking. Visibilité Google quasi nulle sur les requêtes locales premium.",
    actions: [
      "Refonte SEO technique complète",
      "30 pages éditoriales locales",
      "GBP optimisée chambre par chambre",
    ],
    metrics: [
      { value: 312, suffix: "%", label: "Trafic organique" },
      { value: 41, suffix: "%", label: "Réservations directes" },
      { value: 87, suffix: "k€", label: "Marge récupérée / an" },
    ],
    duration: "Résultats observés sur 14 mois",
  },
  {
    name: "Maison d'hôtes 5★",
    location: "Aix-en-Provence · Sud",
    rooms: "12 suites",
    challenge:
      "Site lent, aucune visibilité sur « hôtel de charme Aix ». Saisonnalité brutale en hiver.",
    actions: [
      "Repositionnement éditorial luxe",
      "Stratégie de contenu hors-saison",
      "Partenariats presse spécialisée",
    ],
    metrics: [
      { value: 198, suffix: "%", label: "Trafic organique" },
      { value: 54, suffix: "%", label: "Réservations directes" },
      { value: 24, suffix: "%", label: "Hausse RevPAR" },
    ],
    duration: "Résultats observés sur 11 mois",
  },
  {
    name: "Petite chaîne 3★",
    location: "Réseau · 6 hôtels",
    rooms: "180 chambres totales",
    challenge:
      "Stratégie SEO inexistante au niveau groupe. Cannibalisation entre les sites des hôtels.",
    actions: [
      "Architecture SEO mère-fille",
      "Hub & spoke pour le contenu local",
      "Tracking unifié et reporting groupe",
    ],
    metrics: [
      { value: 156, suffix: "%", label: "Trafic organique" },
      { value: 33, suffix: "%", label: "Réservations directes" },
      { value: 312, suffix: "k€", label: "Marge récupérée / an" },
    ],
    duration: "Résultats observés sur 18 mois",
  },
];

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Résultats"
        title={
          <>
            Trois hôteliers,{" "}
            <span className="italic text-[var(--color-gold-300)]">
              trois reprises de pouvoir
            </span>
            .
          </>
        }
        subtitle="Cas clients anonymisés à leur demande, mais chaque chiffre est extrait directement de Google Search Console et du PMS de l'établissement."
      />

      <section className="py-24 lg:py-32">
        <Container>
          <RevealGroup className="flex flex-col gap-12">
            {cases.map((c) => (
              <RevealItem key={c.name}>
                <article className="group grid gap-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-ink-900)]/60 p-8 transition-colors hover:border-[var(--color-gold-400)]/30 lg:grid-cols-12 lg:p-12">
                  <div className="lg:col-span-5">
                    <Eyebrow>Cas client</Eyebrow>
                    <h2 className="font-display mt-5 text-3xl text-[var(--color-foreground)] md:text-4xl">
                      {c.name}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--color-pearl-400)]">
                      <span>{c.location}</span>
                      <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--color-gold-400)]/60" />
                      <span>{c.rooms}</span>
                    </div>
                    <div className="mt-7 flex flex-col gap-5 text-sm text-[var(--color-pearl-200)]">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
                          Situation initiale
                        </p>
                        <p className="mt-2 leading-relaxed text-[var(--color-pearl-300)]">
                          {c.challenge}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
                          Actions clés
                        </p>
                        <ul className="mt-2 flex flex-col gap-1.5">
                          {c.actions.map((a) => (
                            <li
                              key={a}
                              className="flex items-start gap-2 text-[var(--color-pearl-300)]"
                            >
                              <ArrowUpRight
                                size={14}
                                className="mt-1 text-[var(--color-gold-400)] shrink-0"
                                aria-hidden
                              />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-7">
                    <div className="grid h-full grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3">
                      {c.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="flex flex-col justify-end gap-3 bg-[var(--color-ink-800)] p-6 lg:p-8"
                        >
                          <p className="font-display text-4xl text-[var(--color-foreground)] lg:text-5xl">
                            <AnimatedCounter
                              value={m.value}
                              suffix={m.suffix}
                            />
                          </p>
                          <p className="text-sm leading-snug text-[var(--color-pearl-300)]">
                            {m.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-pearl-500)]">
                      {c.duration}
                    </p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-20">
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-ink-900)]/40 p-8 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
                Placeholders
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-pearl-300)]">
                Ces cas clients sont des templates structurels prêts à recevoir
                vos vrais chiffres. Indiquez-nous les données réelles à intégrer
                pour les remplacer.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <CTA />
    </>
  );
}
