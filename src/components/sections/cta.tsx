"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-28 lg:py-36">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--color-gold-400)]/20 noise-overlay">
            <div aria-hidden className="absolute inset-0 mesh-gradient opacity-90" />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-[var(--color-ink-900)] via-[var(--color-ink-800)] to-[var(--color-ink-900)]"
            />
            <div
              aria-hidden
              className="absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--color-gold-400)]/10 blur-3xl"
            />
            <div className="relative grid gap-10 px-8 py-16 sm:px-12 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:px-16 lg:py-24">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
                  Prêt à démarrer
                </p>
                <h2 className="font-display mt-5 text-balance text-4xl leading-[1.05] text-[var(--color-foreground)] md:text-5xl lg:text-[60px]">
                  Vos avis Google,{" "}
                  <span className="italic text-[var(--color-gold-300)]">
                    on s&apos;en occupe
                  </span>{" "}
                  dès demain.
                </h2>
                <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
                  15 minutes de mise en service. Tous vos anciens avis traités
                  sous 7 jours. Puis chaque nouvel avis reçoit une réponse
                  automatiquement, en continu.
                </p>
                <ul className="mt-7 grid gap-2 text-sm text-[var(--color-pearl-200)] sm:grid-cols-2">
                  {[
                    "Connexion fiche Google en 24h",
                    "Réponses dans votre ton",
                    "Sans engagement",
                    "Annulable à tout moment",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-400)]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <Button href="/contact" size="lg" className="w-full">
                  Démarrer à 229€/mois
                  <ArrowRight size={18} />
                </Button>
                <Button
                  href="#pricing"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Voir les tarifs
                </Button>
                <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-pearl-500)]">
                  Sans engagement · résiliable à tout moment
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
