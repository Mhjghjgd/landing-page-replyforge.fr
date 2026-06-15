"use client";

import { Link2, Sparkles, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    n: "01",
    icon: Link2,
    title: "On connecte votre fiche Google",
    body: "Vous nous donnez accès à votre fiche Google Business Profile en un clic. Pas de migration, pas de paramétrage technique de votre côté — on s'occupe de tout en moins de 24h.",
    detail: "Mise en place : 24h.",
  },
  {
    n: "02",
    icon: Sparkles,
    title: "Notre IA lit chaque avis et écrit une réponse",
    body: "Pour chaque nouvel avis publié, notre IA analyse le contenu, le ton, le contexte. Elle rédige une réponse personnalisée, professionnelle, alignée avec l'identité de votre hôtel.",
    detail: "Génération en moins de 5 secondes.",
  },
  {
    n: "03",
    icon: Send,
    title: "La réponse est publiée — vous ne faites rien",
    body: "La réponse part automatiquement sur votre fiche Google. Vous recevez un récap mensuel par email. Si vous voulez relire avant publication, c'est possible aussi.",
    detail: "100% automatique ou validation manuelle.",
  },
];

export function Process() {
  return (
    <section className="relative py-28 lg:py-36 bg-[var(--color-ink-900)]">
      <div aria-hidden className="absolute inset-x-0 top-0 gold-divider" />
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Comment ça marche</Eyebrow>
          <h2 className="font-display mt-6 text-balance text-4xl leading-[1.1] text-[var(--color-foreground)] md:text-5xl lg:text-[56px]">
            Trois étapes.{" "}
            <span className="italic text-[var(--color-gold-300)]">
              Vous ne touchez à rien
            </span>
            .
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
            Le but : que vous puissiez retourner gérer votre hôtel pendant que
            vos avis trouvent leurs réponses tout seuls.
          </p>
        </Reveal>

        <ol className="mt-20 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.1}>
              <li className="relative flex h-full flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-ink-800)]/70 p-7 backdrop-blur-sm transition-all duration-500 hover:border-[var(--color-gold-400)]/30 hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-gold-400)]/25 bg-[var(--color-gold-400)]/10 text-[var(--color-gold-300)]">
                    <step.icon size={20} aria-hidden />
                  </div>
                  <span className="font-mono text-3xl text-[var(--color-gold-400)]/30">
                    {step.n}
                  </span>
                </div>
                <h3 className="font-display text-2xl leading-tight text-[var(--color-foreground)]">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[var(--color-pearl-300)]">
                  {step.body}
                </p>
                <p className="mt-auto pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
                  {step.detail}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
