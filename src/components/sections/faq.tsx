"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

const faqs = [
  {
    q: "En combien de temps voit-on les premiers résultats ?",
    a: "Les premiers gains techniques (vitesse, Core Web Vitals, fiches Google) sont visibles dès le 1er mois. Les remontées de positions arrivent entre le mois 3 et le mois 6 selon votre marché. Les vraies hausses de réservations directes s'installent à partir du mois 4–6 et se consolident sur 12 mois.",
  },
  {
    q: "Travaillez-vous avec mon agence digitale actuelle ?",
    a: "Oui, fréquemment. Nous prenons en charge la stratégie SEO et le contenu pendant que votre agence ou freelance gère le reste. Nous fournissons des spécifications précises et des comptes-rendus mensuels que vos équipes peuvent exploiter directement.",
  },
  {
    q: "Quel est l'investissement attendu ?",
    a: "Nos accompagnements démarrent à partir d'un budget équivalent à 1–2 nuitées vendues par jour. La logique : ce que vous payez en SEO est largement compensé par la baisse des commissions OTA et la hausse du panier moyen sur le canal direct. L'audit initial est offert pour vous donner une projection honnête.",
  },
  {
    q: "Garantissez-vous des positions sur Google ?",
    a: "Personne ne peut garantir une position précise — et qui le fait vous ment. Ce que nous garantissons : une transparence totale sur les actions menées, un reporting de progression mensuel, et une révision du plan d'action si les KPIs ne progressent pas comme prévu après 6 mois.",
  },
  {
    q: "Et si on est déjà bien classé sur Booking ?",
    a: "C'est précisément ce qui doit vous inquiéter. Tant que votre visibilité dépend d'un acteur tiers, vous ne possédez ni vos clients, ni votre marge. Notre rôle est de construire votre propre canal — qui devient un actif de l'hôtel, pas un loyer perpétuel.",
  },
  {
    q: "Travaillez-vous partout en France ?",
    a: "Oui. Notre méthode est nationale, nos équipes sont basées à Paris mais nous accompagnons des établissements partout en France métropolitaine, en Corse et dans les DOM-TOM. Pour les hôtels parisiens, nous proposons des rendez-vous sur place.",
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
