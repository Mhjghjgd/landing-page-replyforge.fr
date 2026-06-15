"use client";

import { TrendingDown, Percent, EyeOff, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

const pains = [
  {
    icon: Percent,
    title: "15 à 25% de commissions OTA",
    body: "Chaque nuit vendue via Booking ou Expedia ampute votre marge nette. Sur un hôtel de 30 chambres, c'est plusieurs dizaines de milliers d'euros par an qui s'évaporent.",
  },
  {
    icon: EyeOff,
    title: "Invisible sur Google",
    body: "Quand un voyageur tape « hôtel + votre ville », ce sont les OTA qui apparaissent — pas vous. Vous payez pour acheter des clients qui vous cherchaient déjà.",
  },
  {
    icon: Users,
    title: "Dépendance totale aux plateformes",
    body: "Un changement d'algorithme Booking, une mauvaise note injuste, une politique tarifaire imposée — et vos revenus chutent du jour au lendemain.",
  },
  {
    icon: TrendingDown,
    title: "Pas de relation client",
    body: "Vos vrais clients restent ceux des OTA. Pas d'email, pas de fidélisation, pas de bouche-à-oreille direct. Vous repartez de zéro à chaque saison.",
  },
];

export function Problem() {
  return (
    <section className="relative py-28 lg:py-36">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Le constat</Eyebrow>
          <h2 className="font-display mt-6 text-balance text-4xl leading-[1.1] text-[var(--color-foreground)] md:text-5xl lg:text-[56px]">
            Vous êtes propriétaire de votre hôtel.
            <br />
            <span className="text-[var(--color-pearl-400)] italic">
              Booking est propriétaire de vos clients.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
            Le secteur hôtelier indépendant a délégué sa visibilité aux OTA.
            Résultat : une dépendance silencieuse qui ronge la marge année après
            année.
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2"
        >
          {pains.map((pain) => (
            <RevealItem key={pain.title}>
              <li className="group relative flex h-full flex-col gap-4 bg-[var(--color-ink-900)] p-8 transition-colors duration-500 hover:bg-[var(--color-ink-800)]">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/20 text-[var(--color-gold-300)]">
                  <pain.icon size={20} aria-hidden />
                </div>
                <h3 className="font-display text-2xl text-[var(--color-foreground)]">
                  {pain.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[var(--color-pearl-300)]">
                  {pain.body}
                </p>
              </li>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
