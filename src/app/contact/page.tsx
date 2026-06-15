import type { Metadata } from "next";
import { CheckCircle2, Clock, MailIcon, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CalendlyEmbed } from "@/components/sections/calendly-embed";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description:
    "Réservez 30 minutes avec ReplyForge. On regarde votre situation, on chiffre les gains, on vous laisse repartir avec un plan — gratuit, sans engagement.",
};

const expectations = [
  "Audit Google Business Profile en direct",
  "Analyse rapide de vos 5 concurrents locaux",
  "Projection chiffrée des gains à 12 mois",
  "Plan d'action priorisé que vous gardez",
];

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden noise-overlay py-24 lg:py-32">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[60%] mesh-gradient opacity-50"
      />
      <Container size="wide" className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Prendre rendez-vous</Eyebrow>
            <h1 className="font-display mt-6 text-balance text-4xl leading-[1.05] text-[var(--color-foreground)] md:text-5xl lg:text-6xl">
              30 minutes pour reprendre{" "}
              <span className="italic text-[var(--color-gold-300)]">
                le contrôle
              </span>
              .
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
              Choisissez directement un créneau qui vous convient. On vous
              appelle à l&apos;heure dite. Aucune préparation requise — on
              s&apos;occupe de tout en amont.
            </p>

            <div className="mt-10 flex flex-col gap-5">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
                Ce qu&apos;on couvre
              </h2>
              <ul className="flex flex-col gap-3">
                {expectations.map((e) => (
                  <li
                    key={e}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--color-pearl-200)]"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-[var(--color-gold-400)]"
                      aria-hidden
                    />
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-ink-900)]/60 p-6">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
                <Sparkles size={12} aria-hidden /> 100% offert
              </p>
              <p className="text-sm leading-relaxed text-[var(--color-pearl-300)]">
                Pas de carte bancaire, pas d&apos;engagement, pas de relance
                commerciale envahissante. Si on ne peut pas vous aider, on vous
                le dira en 10 minutes — vous aurez quand même le plan.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-[var(--color-border)] pt-8">
              <div className="flex items-start gap-3 text-sm text-[var(--color-pearl-300)]">
                <Clock
                  size={16}
                  className="mt-0.5 text-[var(--color-gold-400)]"
                  aria-hidden
                />
                <span>30 minutes · visio Google Meet ou téléphone</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[var(--color-pearl-300)]">
                <MailIcon
                  size={16}
                  className="mt-0.5 text-[var(--color-gold-400)]"
                  aria-hidden
                />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-[var(--color-gold-300)] transition-colors"
                >
                  Préférez l&apos;email ? {siteConfig.email}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.15}>
            <CalendlyEmbed url={siteConfig.calendlyUrl} />
            <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-pearl-500)]">
              Le calendrier ne s&apos;affiche pas ? Écrivez-nous à{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-[var(--color-gold-400)] hover:text-[var(--color-gold-300)]"
              >
                {siteConfig.email}
              </a>
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
