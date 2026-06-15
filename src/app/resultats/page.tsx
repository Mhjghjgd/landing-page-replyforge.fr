import type { Metadata } from "next";
import { ArrowUpRight, Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Résultats & témoignages",
  description:
    "Des hôteliers qui ont confié leurs avis Google à ReplyForge. Chiffres réels, témoignages vidéo, méthodologie transparente.",
};

const cases = [
  {
    name: "Hôtel boutique 4★",
    location: "Lyon · Presqu'île",
    rooms: "42 chambres",
    challenge:
      "180 avis Google sans réponse depuis 18 mois. Note moyenne 4,1, en perte de vitesse face à 3 hôtels concurrents qui répondaient à 100% de leurs avis.",
    actions: [
      "Rattrapage complet des 180 avis en 7 jours",
      "Mode auto pour les 4★ et 5★",
      "Validation manuelle pour les avis sensibles",
    ],
    metrics: [
      { value: 100, suffix: "%", label: "Taux de réponse atteint" },
      { value: 4.6, suffix: "★", label: "Note moyenne après 5 mois", decimals: 1 },
      { value: 42, suffix: "%", label: "Hausse des clics sur la fiche" },
    ],
    duration: "Résultats observés sur 6 mois",
  },
  {
    name: "Maison d'hôtes 5★",
    location: "Aix-en-Provence",
    rooms: "12 suites",
    challenge:
      "Propriétaire seul à bord, aucun temps pour les avis. 4,3 de note mais des avis nuancés laissés sans réponse — image d'un établissement qui ne se soucie pas de ses clients.",
    actions: [
      "Ton premium calibré (vouvoiement + signature manuscrite)",
      "Réponses qui mentionnent le restaurant et la piscine",
      "Mode 100% automatique activé",
    ],
    metrics: [
      { value: 100, suffix: "%", label: "Avis répondus en moins de 6h" },
      { value: 4.8, suffix: "★", label: "Note moyenne actuelle", decimals: 1 },
      { value: 31, suffix: "%", label: "Hausse réservations directes" },
    ],
    duration: "Résultats observés sur 8 mois",
  },
  {
    name: "Petite chaîne 3★",
    location: "Réseau · 5 établissements",
    rooms: "180 chambres totales",
    challenge:
      "5 hôtels, 5 directeurs, aucune cohérence dans les réponses (quand il y en avait). Image de marque incohérente d'un site à l'autre, dilution du groupe.",
    actions: [
      "Charte de ton unifiée au niveau groupe",
      "Variations par établissement (mer, ville, montagne)",
      "Récap mensuel consolidé pour la direction",
    ],
    metrics: [
      { value: 100, suffix: "%", label: "Couverture sur les 5 hôtels" },
      { value: 4.5, suffix: "★", label: "Note moyenne du groupe", decimals: 1 },
      { value: 156, suffix: "%", label: "Hausse trafic Google Maps" },
    ],
    duration: "Résultats observés sur 12 mois",
  },
];

const videoTestimonials = [
  {
    hotel: "Hôtel 4★ · Lyon",
    name: "Témoignage du directeur",
    duration: "1 min 12",
  },
  {
    hotel: "Maison d'hôtes · Aix",
    name: "Témoignage de la propriétaire",
    duration: "2 min 03",
  },
];

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Résultats"
        title={
          <>
            Trois hôteliers,{" "}
            <span className="italic text-[var(--color-gold-300)]">
              100% de leurs avis répondus
            </span>
            .
          </>
        }
        subtitle="Cas clients anonymisés à leur demande, mais chaque chiffre est extrait directement de Google Business Profile. Les témoignages vidéo arrivent dans les prochaines semaines."
      />

      <section className="py-24 lg:py-32">
        <Container>
          <RevealGroup className="flex flex-col gap-12">
            {cases.map((c) => (
              <RevealItem key={c.name}>
                <article className="group grid gap-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-ink-900)]/60 p-8 transition-colors hover:border-[var(--color-gold-400)]/30 lg:grid-cols-12 lg:p-12">
                  <div className="lg:col-span-5">
                    <Eyebrow>Cas client</Eyebrow>
                    <h2 className="font-display mt-5 text-3xl text-[var(--color-foreground)] md:text-4xl">
                      {c.name}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--color-pearl-400)]">
                      <span>{c.location}</span>
                      <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--color-gold-400)]/60" />
                      <span>{c.rooms}</span>
                    </div>
                    <div className="mt-7 flex flex-col gap-5 text-sm text-[var(--color-pearl-200)]">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
                          Situation initiale
                        </p>
                        <p className="mt-2 leading-relaxed text-[var(--color-pearl-300)]">
                          {c.challenge}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
                          Ce qu&apos;on a fait
                        </p>
                        <ul className="mt-2 flex flex-col gap-1.5">
                          {c.actions.map((a) => (
                            <li
                              key={a}
                              className="flex items-start gap-2 text-[var(--color-pearl-300)]"
                            >
                              <ArrowUpRight
                                size={14}
                                className="mt-1 text-[var(--color-gold-400)] shrink-0"
                                aria-hidden
                              />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-7">
                    <div className="grid h-full grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3">
                      {c.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="flex flex-col justify-end gap-3 bg-[var(--color-ink-800)] p-6 lg:p-8"
                        >
                          <p className="font-display text-4xl text-[var(--color-foreground)] lg:text-5xl">
                            <AnimatedCounter
                              value={m.value}
                              suffix={m.suffix}
                              decimals={m.decimals ?? 0}
                            />
                          </p>
                          <p className="text-sm leading-snug text-[var(--color-pearl-300)]">
                            {m.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-pearl-500)]">
                      {c.duration}
                    </p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-24">
            <div className="text-center">
              <Eyebrow className="justify-center">Témoignages vidéo</Eyebrow>
              <h2 className="font-display mt-6 text-balance text-3xl leading-tight text-[var(--color-foreground)] md:text-4xl lg:text-5xl">
                Bientôt en ligne.{" "}
                <span className="italic text-[var(--color-gold-300)]">
                  Les hôteliers prennent la parole
                </span>
                .
              </h2>
            </div>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2">
            {videoTestimonials.map((t) => (
              <RevealItem key={t.hotel}>
                <article className="group relative aspect-video overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-ink-800)] via-[var(--color-ink-900)] to-[var(--color-ink-950)] transition-colors hover:border-[var(--color-gold-400)]/30">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(at_50%_40%,rgba(196,151,58,0.18),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <div
                      aria-hidden
                      className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-gold-400)]/40 bg-[var(--color-ink-950)]/80 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110"
                    >
                      <Play
                        size={28}
                        className="ml-1 fill-[var(--color-gold-300)] text-[var(--color-gold-300)]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
                        Témoignage vidéo à venir
                      </p>
                      <p className="font-display text-xl text-[var(--color-foreground)]">
                        {t.name}
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-gold-400)]">
                        {t.hotel} · {t.duration}
                      </p>
                    </div>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-16">
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-ink-900)]/40 p-8 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
                Placeholders
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-pearl-300)]">
                Ces cas clients et témoignages vidéo sont des templates prêts à
                recevoir les vrais contenus. Les vidéos YouTube ou Vimeo
                pourront être intégrées en remplaçant chaque carte par un
                composant lecteur.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <CTA />
    </>
  );
}
