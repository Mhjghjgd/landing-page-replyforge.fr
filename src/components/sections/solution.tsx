"use client";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, MapPin, Heart, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: TrendingUp,
    title: "Google récompense ceux qui répondent",
    body: "C'est officiel : la fréquence et la qualité des réponses aux avis sont un signal de classement local. Plus vous répondez, plus vous remontez.",
    points: [
      "Signal de classement confirmé par Google",
      "Effet visible en 4 à 8 semaines",
      "Impact direct sur les recherches « hôtel + ville »",
    ],
  },
  {
    icon: MapPin,
    title: "Vous dominez la carte locale",
    body: "Les hôtels qui apparaissent en haut de Google Maps sont presque toujours ceux qui répondent à 100% de leurs avis. Pas de hasard.",
    points: [
      "Top 3 du pack local Maps",
      "Plus de clics vers votre fiche",
      "Plus de réservations directes",
    ],
  },
  {
    icon: Heart,
    title: "Vos clients se sentent écoutés",
    body: "Un client qui voit sa critique prise en compte revient. Un futur client qui lit une réponse soignée réserve avec confiance.",
    points: [
      "Taux de retour client en hausse",
      "Image de marque renforcée",
      "Bouche-à-oreille décuplé",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Vos concurrents ne le font pas",
    body: "8 hôtels sur 10 ne répondent pas à leurs avis Google. C'est exactement pour ça que vous allez les dépasser.",
    points: [
      "Avantage concurrentiel net",
      "Différenciation immédiate",
      "Position défendue dans le temps",
    ],
  },
];

export function Solution() {
  return (
    <section className="relative py-28 lg:py-36">
      <div aria-hidden className="absolute inset-x-0 top-0 gold-divider" />
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Pourquoi ça marche</Eyebrow>
            <h2 className="font-display mt-6 text-balance text-4xl leading-[1.1] text-[var(--color-foreground)] md:text-5xl lg:text-[56px]">
              Google favorise les hôtels{" "}
              <span className="italic text-[var(--color-gold-300)]">
                qui répondent
              </span>
              .
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
              Ce n&apos;est pas une astuce. C&apos;est documenté noir sur blanc
              par Google : répondre à ses avis fait remonter la fiche dans les
              résultats locaux. La plupart des hôtels l&apos;ignorent.
              C&apos;est votre avantage.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#pricing" size="md">
                Voir les tarifs
                <ArrowRight size={16} />
              </Button>
              <Button href="/methode" variant="ghost" size="md">
                Notre méthode
              </Button>
            </div>
          </Reveal>

          <div className="lg:col-span-7 grid gap-5 sm:grid-cols-2">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08}>
                <article className="group relative flex h-full flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-ink-800)]/60 p-7 backdrop-blur-sm transition-all duration-500 hover:border-[var(--color-gold-400)]/30 hover:-translate-y-1 hover:shadow-[var(--shadow-gold-sm)]">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-gold-400)]/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/20 text-[var(--color-gold-300)]">
                      <r.icon size={18} aria-hidden />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
                      0{reasons.indexOf(r) + 1}
                    </span>
                  </div>
                  <h3 className="relative font-display text-xl text-[var(--color-foreground)]">
                    {r.title}
                  </h3>
                  <p className="relative text-sm leading-relaxed text-[var(--color-pearl-300)]">
                    {r.body}
                  </p>
                  <ul className="relative mt-auto space-y-1.5 pt-2">
                    {r.points.map((p) => (
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
