"use client";

import { motion } from "framer-motion";
import { Star, MoreHorizontal, ThumbsUp, MessageCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export function GoogleMockup() {
  return (
    <section id="mockup" className="relative py-28 lg:py-36 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-ink-900)]/40 to-transparent"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[var(--color-gold-400)]/[0.06] blur-3xl"
      />

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Un exemple concret</Eyebrow>
          <h2 className="font-display mt-6 text-balance text-4xl leading-[1.1] text-[var(--color-foreground)] md:text-5xl lg:text-[56px]">
            Voici à quoi ressemble{" "}
            <span className="italic text-[var(--color-gold-300)]">
              une réponse ReplyForge
            </span>
            .
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
            Un vrai avis client, une vraie réponse — écrite par notre IA en
            quelques secondes, publiée automatiquement sur votre fiche Google.
          </p>
        </Reveal>

        <div className="mx-auto mt-20 grid max-w-4xl gap-6 lg:gap-8">
          {/* Avis client */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl lg:p-9"
          >
            <div className="absolute -top-3 left-7 flex items-center gap-2 rounded-full border border-white/15 bg-[var(--color-ink-950)] px-3 py-1">
              <GoogleG size={14} />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-pearl-200)]">
                Avis Google · il y a 2 jours
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5B8DEF] to-[#3B6BCB] font-display text-base font-medium text-white">
                MD
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-medium text-[var(--color-foreground)]">
                      Marine D.
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-pearl-500)]">
                      3 avis · Local Guide
                    </p>
                  </div>
                  <MoreHorizontal size={18} className="text-[var(--color-pearl-500)]" aria-hidden />
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-[#FBBC05] text-[#FBBC05]"
                      aria-hidden
                    />
                  ))}
                  <Star
                    size={16}
                    className="text-[var(--color-pearl-500)]/60"
                    aria-hidden
                  />
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-pearl-100)]">
                  Très joli séjour, l&apos;accueil de l&apos;équipe était au top
                  et la chambre vraiment cosy. Petit bémol côté restaurant : le
                  plat principal manquait un peu de sel à mon goût 😄 Sinon
                  rien à redire, on reviendra avec plaisir !
                </p>
                <div className="mt-5 flex items-center gap-6 text-[var(--color-pearl-400)]">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs hover:text-[var(--color-pearl-200)]"
                  >
                    <ThumbsUp size={14} aria-hidden /> Utile
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs hover:text-[var(--color-pearl-200)]"
                  >
                    <MessageCircle size={14} aria-hidden /> Partager
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Connector */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center"
            style={{ transformOrigin: "top" }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-px bg-gradient-to-b from-transparent to-[var(--color-gold-400)]/60" />
              <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-gold-400)]/40 bg-[var(--color-ink-900)] px-3 py-1">
                <Sparkles size={11} className="text-[var(--color-gold-400)]" aria-hidden />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-gold-300)]">
                  Réponse générée en 4,2s
                </span>
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-[var(--color-gold-400)]/60 to-transparent" />
            </div>
          </motion.div>

          {/* Réponse hôtel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative ml-0 sm:ml-12 lg:ml-16"
          >
            <div className="relative overflow-hidden rounded-2xl border border-[var(--color-gold-400)]/25 bg-gradient-to-br from-[var(--color-gold-400)]/[0.06] to-transparent p-7 backdrop-blur-xl lg:p-9">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(at_top_left,rgba(196,151,58,0.12),transparent_60%)]"
              />
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-gold-400)]/40 bg-[var(--color-ink-900)] text-[var(--color-gold-300)]">
                    <Sparkles size={16} aria-hidden />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="text-[15px] font-medium text-[var(--color-foreground)]">
                        Réponse du propriétaire
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-gold-400)]">
                        Publiée automatiquement
                      </p>
                    </div>
                    <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-pearl-100)]">
                      Bonjour Marine, un grand merci pour ces mots qui font
                      vraiment plaisir à toute l&apos;équipe. Nous sommes ravis
                      que votre séjour vous ait plu et que notre accueil ait
                      été à la hauteur de vos attentes.
                      <br />
                      <br />
                      Bien noté pour le plat principal — nous transmettons
                      tout de suite la remarque à notre chef, qui prend ce
                      genre de retour très au sérieux. C&apos;est avec ce type
                      d&apos;échange que nous progressons.
                      <br />
                      <br />
                      Au plaisir de vous retrouver très bientôt — et la
                      prochaine fois, nous garderons un œil sur la salière !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <Reveal delay={0.3} className="mt-16 text-center">
          <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-[var(--color-pearl-400)]">
            Chaque réponse est unique. Elle reprend le contenu de l&apos;avis,
            adopte le ton de votre établissement, et répond proprement aux
            critiques sans jamais être défensive.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
