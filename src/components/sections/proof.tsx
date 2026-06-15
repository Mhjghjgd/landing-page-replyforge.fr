"use client";

import { Play, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const stats = [
  {
    value: 100,
    suffix: "%",
    label: "Taux de réponse atteint",
    sub: "Sur tous les avis Google reçus",
  },
  {
    value: 4.7,
    suffix: "★",
    label: "Note moyenne après 6 mois",
    sub: "Versus 4,2 avant accompagnement",
    decimals: 1,
  },
  {
    value: 38,
    suffix: "%",
    label: "Hausse des clics vers la fiche",
    sub: "Mesurée dans Google Business",
  },
  {
    value: 5,
    suffix: "s",
    label: "Pour générer chaque réponse",
    sub: "Publiée automatiquement",
  },
];

const testimonials = [
  {
    hotel: "Hôtel 4★ · Centre-ville",
    duration: "Témoignage vidéo · 1 min 12",
  },
  {
    hotel: "Maison d'hôtes · Sud-Est",
    duration: "Témoignage vidéo · 2 min 03",
  },
  {
    hotel: "Petite chaîne · 5 établissements",
    duration: "Témoignage vidéo · 1 min 48",
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
            Moyennes observées sur les hôtels accompagnés. Chaque chiffre est
            traçable directement dans votre Google Business Profile.
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

        <div className="mt-24">
          <Reveal className="text-center">
            <div className="flex items-center justify-center gap-3">
              <Quote size={18} className="text-[var(--color-gold-400)]" aria-hidden />
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
                Témoignages clients
              </p>
            </div>
            <h3 className="font-display mt-5 text-balance text-3xl leading-tight text-[var(--color-foreground)] md:text-4xl">
              Ce que disent les hôteliers qui utilisent ReplyForge.
            </h3>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <RevealItem key={t.hotel}>
                <article className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-ink-800)] via-[var(--color-ink-900)] to-[var(--color-ink-950)] transition-colors hover:border-[var(--color-gold-400)]/30">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(at_30%_30%,rgba(196,151,58,0.15),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
                    <div
                      aria-hidden
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-gold-400)]/40 bg-[var(--color-ink-950)]/80 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110"
                    >
                      <Play
                        size={22}
                        className="ml-1 fill-[var(--color-gold-300)] text-[var(--color-gold-300)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
                        Témoignage vidéo à venir
                      </p>
                      <p className="font-display text-lg text-[var(--color-foreground)]">
                        {t.hotel}
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-gold-400)]">
                        {t.duration}
                      </p>
                    </div>
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-400)]/30 to-transparent"
                  />
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.2} className="mt-8 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
              Vidéos YouTube / Vimeo à intégrer dès leur tournage
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
