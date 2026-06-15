"use client";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, MapPin, Hotel, BarChart3 } from "lucide-react";

const pillars = [
  {
    icon: Search,
    title: "SEO local hôtelier",
    body: "Nous travaillons les requêtes que vos vrais futurs clients tapent — pas les mots-clés génériques.",
    points: [
      "Audit Google Business Profile complet",
      "Optimisation des fiches Maps",
      "Ciblage par localisation et intention",
    ],
  },
  {
    icon: Hotel,
    title: "Contenu signature",
    body: "Pages chambres, expériences, restaurant, guide local — pensées pour Google et pour convertir.",
    points: [
      "Pages d'atterrissage par offre",
      "Storytelling éditorial premium",
      "Maillage interne stratégique",
    ],
  },
  {
    icon: BarChart3,
    title: "Performance technique",
    body: "Un site qui charge en 1,2s, parfaitement structuré, qui transforme le trafic en réservations.",
    points: [
      "Core Web Vitals au vert",
      "Schema.org Hotel + Room",
      "Tunnel de réservation optimisé",
    ],
  },
  {
    icon: MapPin,
    title: "Stratégie anti-OTA",
    body: "Nous reconstruisons votre canal direct pour récupérer chaque réservation que Booking vous prend.",
    points: [
      "Optimisation moteur de réservation",
      "Incitations à la réservation directe",
      "Tracking et attribution clairs",
    ],
  },
];

export function Solution() {
  return (
    <section className="relative py-28 lg:py-36 bg-[var(--color-ink-900)]">
      <div aria-hidden className="absolute inset-x-0 top-0 gold-divider" />
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Notre approche</Eyebrow>
            <h2 className="font-display mt-6 text-balance text-4xl leading-[1.1] text-[var(--color-foreground)] md:text-5xl lg:text-[56px]">
              Un SEO conçu{" "}
              <span className="italic text-[var(--color-gold-300)]">
                pour l&apos;hôtellerie
              </span>
              .
              <br /> Pas un copier-coller SaaS.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
              Le SEO hôtelier ne se joue pas comme un e-commerce. Saisonnalité,
              concurrence OTA, fiscalité du séjour, géolocalisation, expérience
              voyageur — chaque levier compte. Nous en maîtrisons chacun.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/methode" size="md">
                Voir la méthode complète
                <ArrowRight size={16} />
              </Button>
              <Button href="/resultats" variant="ghost" size="md">
                Cas clients
              </Button>
            </div>
          </Reveal>

          <div className="lg:col-span-7 grid gap-5 sm:grid-cols-2">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.08}>
                <article className="group relative flex h-full flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-ink-800)]/60 p-7 backdrop-blur-sm transition-all duration-500 hover:border-[var(--color-gold-400)]/30 hover:-translate-y-1 hover:shadow-[var(--shadow-gold-sm)]">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-gold-400)]/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/20 text-[var(--color-gold-300)]">
                      <pillar.icon size={18} aria-hidden />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
                      0{pillars.indexOf(pillar) + 1}
                    </span>
                  </div>
                  <h3 className="relative font-display text-xl text-[var(--color-foreground)]">
                    {pillar.title}
                  </h3>
                  <p className="relative text-sm leading-relaxed text-[var(--color-pearl-300)]">
                    {pillar.body}
                  </p>
                  <ul className="relative mt-auto space-y-1.5 pt-2">
                    {pillar.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-xs leading-relaxed text-[var(--color-pearl-400)]"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-gold-400)]"
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
