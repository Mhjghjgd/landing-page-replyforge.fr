"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative overflow-hidden noise-overlay">
      <div
        aria-hidden
        className="absolute inset-0 mesh-gradient opacity-90"
      />
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
          <Sparkles
            size={14}
            className="text-[var(--color-gold-400)]"
            aria-hidden
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-pearl-200)]">
            Agence SEO · 100% hôtellerie
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mx-auto mt-8 max-w-5xl text-center text-balance text-[44px] leading-[1.05] tracking-tight text-[var(--color-foreground)] sm:text-[56px] md:text-[72px] lg:text-[86px]"
        >
          Plus de réservations{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-[var(--color-gold-200)] via-[var(--color-gold-400)] to-[var(--color-gold-300)] bg-clip-text italic text-transparent">
              directes
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
          </span>
          .
          <br />
          Moins de Booking.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-8 max-w-2xl text-center text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)] md:text-xl"
        >
          Nous aidons les hôteliers indépendants à dominer Google, capter les
          clients <em className="text-[var(--color-foreground)] not-italic font-medium">avant</em> les OTA, et reconstruire une marge
          qu&apos;aucune commission ne grignote.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button href="/contact" size="lg">
            Réserver un audit SEO offert
            <ArrowRight size={18} />
          </Button>
          <Button href="/methode" variant="ghost" size="lg">
            Découvrir notre méthode
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-14 flex flex-col items-center gap-4"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
            Pensé pour
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--color-pearl-300)]">
            <li>Hôtels indépendants 3–5 étoiles</li>
            <li className="hidden sm:inline-block h-1 w-1 rounded-full bg-[var(--color-gold-400)]/60" />
            <li>Maisons d&apos;hôtes premium</li>
            <li className="hidden sm:inline-block h-1 w-1 rounded-full bg-[var(--color-gold-400)]/60" />
            <li>Petites chaînes hôtelières</li>
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
