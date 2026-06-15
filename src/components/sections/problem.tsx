"use client";

import { MessageSquareOff, TrendingDown, Clock, Frown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

const pains = [
  {
    icon: MessageSquareOff,
    title: "Vos avis Google restent sans réponse",
    body: "Vous recevez des avis chaque semaine. Vous voudriez bien répondre — mais entre le check-in, le service et la compta, il y a toujours plus urgent. Au bout d'un an, des dizaines d'avis sont restés muets.",
  },
  {
    icon: TrendingDown,
    title: "Vous descendez dans les résultats locaux",
    body: "Google le dit clairement : plus un hôtel répond à ses avis, plus il monte dans les résultats. Ne pas répondre, c'est laisser votre concurrent direct prendre la première place.",
  },
  {
    icon: Clock,
    title: "Vous n'avez pas le temps",
    body: "Répondre proprement à un avis prend 5 à 10 minutes. À 30 avis par mois, c'est plusieurs heures perdues. Et ça finit toujours par passer en bas de la liste.",
  },
  {
    icon: Frown,
    title: "Les réponses génériques font fuir les clients",
    body: "« Merci pour votre avis » à chaque commentaire, c'est pire que rien. Les futurs clients lisent les réponses avant de réserver. Ils veulent voir un vrai hôtelier, pas un robot froid.",
  },
];

export function Problem() {
  return (
    <section className="relative py-28 lg:py-36">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Le constat</Eyebrow>
          <h2 className="font-display mt-6 text-balance text-4xl leading-[1.1] text-[var(--color-foreground)] md:text-5xl lg:text-[56px]">
            Chaque avis sans réponse,
            <br />
            <span className="text-[var(--color-pearl-400)] italic">
              c&apos;est un client qui ne reviendra pas.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
            La plupart des hôtels ignorent leurs avis Google. Et le payent
            deux fois : en clients perdus, et en classement qui chute.
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2"
        >
          {pains.map((pain) => (
            <RevealItem key={pain.title}>
              <li className="group relative flex h-full flex-col gap-4 bg-[var(--color-ink-900)] p-8 transition-colors duration-500 hover:bg-[var(--color-ink-800)]">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/20 text-[var(--color-gold-300)]">
                  <pain.icon size={20} aria-hidden />
                </div>
                <h3 className="font-display text-2xl text-[var(--color-foreground)]">
                  {pain.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[var(--color-pearl-300)]">
                  {pain.body}
                </p>
              </li>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
