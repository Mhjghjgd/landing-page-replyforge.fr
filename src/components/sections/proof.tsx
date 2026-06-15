"use client";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const stats = [
  {
    value: 147,
    suffix: "%",
    label: "Hausse moyenne du trafic organique",
    sub: "12 mois après le lancement",
  },
  {
    value: 38,
    suffix: "%",
    label: "Part des réservations directes",
    sub: "Vs 12% à l'arrivée du client",
  },
  {
    value: 4.2,
    suffix: "×",
    label: "ROI moyen sur 18 mois",
    sub: "Versus les commissions OTA évitées",
    decimals: 1,
  },
  {
    value: 1.3,
    suffix: "s",
    label: "Temps de chargement médian",
    sub: "Sur tous les sites livrés",
    decimals: 1,
  },
];

const testimonials = [
  {
    quote:
      "En 9 mois, on est passé de 8% à 31% de réservations directes. Cette année, on a renégocié à la baisse notre contrat Booking — c'est ReplyForge qui nous a donné cette marge de manœuvre.",
    author: "Placeholder — Directeur·rice général·e",
    hotel: "Hôtel 4★ · Centre-ville historique",
  },
  {
    quote:
      "On nous avait promis du SEO partout. ReplyForge est la première équipe qui a vraiment compris la saisonnalité hôtelière, le yield, et qui parle business — pas jargon technique.",
    author: "Placeholder — Propriétaire",
    hotel: "Maison d'hôtes 5★ · Provence",
  },
];

export function Proof() {
  return (
    <section className="relative py-28 lg:py-36">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Résultats mesurés</Eyebrow>
          <h2 className="font-display mt-6 text-balance text-4xl leading-[1.1] text-[var(--color-foreground)] md:text-5xl lg:text-[56px]">
            Des chiffres,{" "}
            <span className="italic text-[var(--color-gold-300)]">
              pas des promesses
            </span>
            .
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
            Moyennes observées sur l&apos;ensemble des hôtels accompagnés. Chaque
            chiffre est traçable dans Google Search Console et votre PMS.
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <RevealItem key={stat.label}>
              <li className="group relative flex h-full flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-ink-900)]/60 p-7 transition-all duration-500 hover:border-[var(--color-gold-400)]/40">
                <div
                  aria-hidden
                  className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-400)]/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <p className="font-display font-medium text-5xl text-[var(--color-foreground)] tracking-tight">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                  />
                </p>
                <p className="text-sm leading-snug text-[var(--color-pearl-200)]">
                  {stat.label}
                </p>
                <p className="mt-auto font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-pearl-500)]">
                  {stat.sub}
                </p>
              </li>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-20 grid gap-6 lg:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.1}>
              <figure className="relative flex h-full flex-col gap-6 rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-ink-900)] to-[var(--color-ink-800)] p-8 lg:p-10">
                <svg
                  aria-hidden
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  className="text-[var(--color-gold-400)]/30"
                  fill="currentColor"
                >
                  <path d="M0 32V20.8C0 9.6 6.4 1.6 17.6 0v8c-4.8 1.6-7.2 4.8-7.2 9.6h7.2V32H0zm22.4 0V20.8C22.4 9.6 28.8 1.6 40 0v8c-4.8 1.6-7.2 4.8-7.2 9.6H40V32H22.4z" />
                </svg>
                <blockquote className="font-display text-xl leading-relaxed text-[var(--color-foreground)] lg:text-2xl">
                  « {t.quote} »
                </blockquote>
                <figcaption className="mt-auto flex flex-col gap-0.5 border-t border-[var(--color-border)]/60 pt-5">
                  <span className="text-sm font-medium text-[var(--color-pearl-200)]">
                    {t.author}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-gold-400)]">
                    {t.hotel}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
