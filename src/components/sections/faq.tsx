"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

const faqs = [
  {
    q: "Est-ce que les réponses sonnent vraiment comme nous ?",
    a: "Oui. Avant le démarrage, on vous pose quelques questions sur votre établissement : ton, valeurs, signature de fin, vocabulaire. Notre IA s'aligne sur votre style. Si une réponse ne vous plaît pas, vous nous le dites, on ajuste — comme avec un employé.",
  },
  {
    q: "Et si un client laisse un avis très négatif ?",
    a: "Les avis sensibles peuvent passer en mode validation manuelle : vous recevez la réponse proposée par mail, vous l'approuvez ou la modifiez en un clic avant publication. C'est paramétrable selon le nombre d'étoiles.",
  },
  {
    q: "Combien de temps pour traiter mes anciens avis ?",
    a: "Dès la mise en service, notre IA commence à répondre à vos nouveaux avis en temps réel. Si vous avez des anciens avis sans réponse, on peut les traiter rapidement — parlez-en lors de votre démo.",
  },
  {
    q: "Comment ça se passe pour se connecter à ma fiche Google ?",
    a: "On vous envoie une demande d'accès gestionnaire sur votre Google Business Profile. Vous validez en un clic. C'est exactement la même chose que d'ajouter un employé à votre fiche. Vous gardez 100% du contrôle et pouvez retirer l'accès à tout moment.",
  },
  {
    q: "Est-ce que vous garantissez de remonter sur Google ?",
    a: "Personne ne peut promettre une position précise. Ce qu'on garantit : 100% de vos avis recevront une réponse de qualité, dans les heures qui suivent leur publication. C'est exactement ce signal que Google récompense — l'effet sur le classement local arrive en général sous 4 à 8 semaines.",
  },
  {
    q: "Je peux arrêter quand je veux ?",
    a: "Oui. L'abonnement à 229€/mois est sans engagement. Vous résiliez en un mail, on coupe à la fin du mois en cours. Aucune pénalité.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative py-28 lg:py-36">
      <Container size="narrow">
        <Reveal className="text-center">
          <Eyebrow className="justify-center">Questions fréquentes</Eyebrow>
          <h2 className="font-display mt-6 text-balance text-4xl leading-[1.1] text-[var(--color-foreground)] md:text-5xl">
            On répond avant{" "}
            <span className="italic text-[var(--color-gold-300)]">
              que vous demandiez
            </span>
            .
          </h2>
        </Reveal>

        <ul className="mt-14 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <button
                  className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span
                    className={`font-display text-lg leading-snug transition-colors duration-300 md:text-xl ${
                      isOpen
                        ? "text-[var(--color-gold-200)]"
                        : "text-[var(--color-foreground)] group-hover:text-[var(--color-gold-200)]"
                    }`}
                  >
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-gold-400)] transition-all duration-300"
                  >
                    <Plus
                      size={14}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 pr-12 text-[15px] leading-relaxed text-[var(--color-pearl-300)]">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
