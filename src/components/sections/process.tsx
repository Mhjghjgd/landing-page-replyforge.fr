"use client";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    n: "01",
    title: "Audit stratégique",
    duration: "Semaines 1–2",
    body: "Nous décortiquons votre présence Google, votre positionnement face aux OTA, vos concurrents directs et votre potentiel de trafic local. Vous repartez avec un plan d'action chiffré — qu'on travaille ensemble ou non.",
  },
  {
    n: "02",
    title: "Refonte SEO & technique",
    duration: "Mois 1–3",
    body: "Réécriture des pages clés, structuration Hotel/Room schema, optimisation Core Web Vitals, intégration moteur de réservation, Google Business Profile retravaillé chambre par chambre.",
  },
  {
    n: "03",
    title: "Contenu & autorité",
    duration: "Mois 2–6",
    body: "Publication d'un contenu éditorial qui parle aux voyageurs cherchant votre destination. Acquisition de backlinks qualifiés (presse, guides, partenaires locaux). Construction d'une autorité durable.",
  },
  {
    n: "04",
    title: "Pilotage & croissance",
    duration: "Continu",
    body: "Reporting mensuel transparent : trafic, positions, conversions, revenus directs récupérés. Optimisation continue avec votre directeur de la distribution. Vous voyez l'argent revenir.",
  },
];

export function Process() {
  return (
    <section className="relative py-28 lg:py-36 bg-[var(--color-ink-900)]">
      <div aria-hidden className="absolute inset-x-0 top-0 gold-divider" />
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Notre processus</Eyebrow>
          <h2 className="font-display mt-6 text-balance text-4xl leading-[1.1] text-[var(--color-foreground)] md:text-5xl lg:text-[56px]">
            Une méthode{" "}
            <span className="italic text-[var(--color-gold-300)]">
              en quatre temps
            </span>
            .
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
            Pas de boîte noire. Vous savez à chaque étape ce qu&apos;on fait, ce
            qu&apos;on a livré, ce que ça produit.
          </p>
        </Reveal>

        <ol className="relative mx-auto mt-20 max-w-4xl">
          <div
            aria-hidden
            className="absolute left-5 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[var(--color-gold-400)]/30 to-transparent md:left-1/2 md:-translate-x-px"
          />
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.05}>
              <li
                className={`relative grid gap-6 pb-14 md:grid-cols-2 md:gap-12 ${
                  i % 2 === 0 ? "" : "md:[direction:rtl]"
                }`}
              >
                <div className="relative pl-16 md:pl-0 md:[direction:ltr]">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gold-400)]/40 bg-[var(--color-ink-950)] font-mono text-xs text-[var(--color-gold-300)] md:left-1/2 md:-translate-x-1/2">
                    {step.n}
                  </div>
                  <div
                    className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-ink-800)]/70 p-7 backdrop-blur-sm ${
                      i % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-2xl text-[var(--color-foreground)]">
                        {step.title}
                      </h3>
                      <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-gold-400)] sm:inline">
                        {step.duration}
                      </span>
                    </div>
                    <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-pearl-300)]">
                      {step.body}
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-gold-400)] sm:hidden">
                      {step.duration}
                    </p>
                  </div>
                </div>
                <div aria-hidden className="hidden md:block" />
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
