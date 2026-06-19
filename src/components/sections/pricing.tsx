"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

const plans = [
  {
    label: "Continu",
    price: "89€",
    cadence: "par mois",
    description: "On reste là. Chaque nouvel avis reçoit une réponse automatique dans les heures qui suivent sa publication.",
    features: [
      "Réponses automatiques 24/7",
      "Notifications par email à chaque réponse",
      "Récap mensuel des performances",
      "Mode validation manuelle possible",
      "Sans engagement, résiliable à tout moment",
    ],
    cta: "Démarrer maintenant",
    href: "/contact",
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28 lg:py-36">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Tarifs</Eyebrow>
          <h2 className="font-display mt-6 text-balance text-4xl leading-[1.1] text-[var(--color-foreground)] md:text-5xl lg:text-[56px]">
            Une offre.{" "}
            <span className="italic text-[var(--color-gold-300)]">
              Zéro surprise
            </span>
            .
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
            Un abonnement mensuel, sans engagement. Vous arrêtez quand vous voulez.
          </p>
        </Reveal>

        <div className="mx-auto mt-16 max-w-xl">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative flex flex-col rounded-3xl border p-8 backdrop-blur-sm lg:p-10 ${
                plan.featured
                  ? "border-[var(--color-gold-400)]/40 bg-gradient-to-br from-[var(--color-gold-400)]/[0.06] via-[var(--color-ink-800)]/60 to-[var(--color-ink-900)]/60 shadow-[var(--shadow-gold-md)]"
                  : "border-[var(--color-border)] bg-[var(--color-ink-900)]/60"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-[var(--color-gold-400)]/40 bg-[var(--color-ink-950)] px-3 py-1">
                  <Sparkles size={11} className="text-[var(--color-gold-400)]" aria-hidden />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-gold-300)]">
                    Le plus choisi
                  </span>
                </div>
              )}

              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
                  Offre {plan.label}
                </p>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-6xl text-[var(--color-foreground)] tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-[var(--color-pearl-400)]">
                    {plan.cadence}
                  </span>
                </div>
                <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-pearl-300)]">
                  {plan.description}
                </p>
              </div>

              <ul className="mt-8 flex flex-col gap-3 border-t border-[var(--color-border)]/60 pt-7">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-[14px] leading-relaxed text-[var(--color-pearl-200)]"
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        plan.featured
                          ? "bg-[var(--color-gold-400)]/15 text-[var(--color-gold-300)]"
                          : "bg-[var(--color-ink-700)] text-[var(--color-pearl-300)]"
                      }`}
                      aria-hidden
                    >
                      <Check size={11} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button
                  href={plan.href}
                  size="lg"
                  variant={plan.featured ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                  <ArrowRight size={18} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
            Sans engagement · Paiement sécurisé · Mise en service en 24h
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
