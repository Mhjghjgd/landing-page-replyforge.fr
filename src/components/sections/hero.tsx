"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative overflow-hidden noise-overlay">
      <div aria-hidden className="absolute inset-0 mesh-gradient opacity-90" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-400)]/30 to-transparent"
      />

      <Container size="wide" className="relative z-10 pt-28 pb-32 lg:pt-36 lg:pb-44">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-full border border-[var(--color-gold-400)]/25 bg-[var(--color-ink-900)]/60 px-4 py-1.5 backdrop-blur-sm w-fit"
        >
          <Sparkles size={14} className="text-[var(--color-gold-400)]" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-pearl-200)]">
            IA · Réponses aux avis Google · Hôtellerie
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mx-auto mt-8 max-w-5xl text-center text-balance text-[44px] leading-[1.05] tracking-tight text-[var(--color-foreground)] sm:text-[56px] md:text-[70px] lg:text-[84px]"
        >
          Répondez à{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-[var(--color-gold-200)] via-[var(--color-gold-400)] to-[var(--color-gold-300)] bg-clip-text italic text-transparent">
              100%
            </span>
            <svg
              aria-hidden
              viewBox="0 0 300 12"
              className="absolute -bottom-2 left-0 h-3 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M2 8 Q 75 2 150 6 T 298 4"
                stroke="url(#hero-underline)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <defs>
                <linearGradient id="hero-underline" x1="0" y1="0" x2="300" y2="0">
                  <stop offset="0%" stopColor="#DCBC5C" stopOpacity="0" />
                  <stop offset="50%" stopColor="#C4973A" />
                  <stop offset="100%" stopColor="#DCBC5C" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>{" "}
          de vos avis Google.
          <br />
          Automatiquement.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-8 max-w-2xl text-center text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)] md:text-xl"
        >
          Notre IA lit chaque avis client, écrit une réponse personnalisée, et
          la publie sur votre fiche Google.{" "}
          <em className="not-italic font-medium text-[var(--color-foreground)]">
            Vous remontez dans les résultats locaux
          </em>{" "}
          sans rien faire.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button href="/contact" size="lg">
            Démarrer à 229€/mois
            <ArrowRight size={18} />
          </Button>
          <Button href="#mockup" variant="ghost" size="lg">
            Voir un exemple
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-14 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                size={14}
                className="fill-[var(--color-gold-400)] text-[var(--color-gold-400)]"
                aria-hidden
              />
            ))}
            <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-pearl-300)]">
              Google récompense les hôtels qui répondent
            </span>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--color-pearl-300)]">
            <li>Hôtels indépendants</li>
            <li className="hidden sm:inline-block h-1 w-1 rounded-full bg-[var(--color-gold-400)]/60" />
            <li>Maisons d&apos;hôtes</li>
            <li className="hidden sm:inline-block h-1 w-1 rounded-full bg-[var(--color-gold-400)]/60" />
            <li>Petites chaînes</li>
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
