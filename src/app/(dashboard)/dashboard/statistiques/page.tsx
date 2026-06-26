import { BarChart3, TrendingUp, Star, MessageSquare, Clock, ThumbsUp, Globe } from "lucide-react";

export const metadata = { title: "Statistiques — ReplyForge" };

const upcomingFeatures = [
  {
    icon: TrendingUp,
    title: "Évolution de la note",
    description: "Graphique de votre note moyenne sur 12 mois",
    color: "text-[var(--color-gold-400)]",
    bg: "bg-[var(--color-gold-400)]/10",
  },
  {
    icon: MessageSquare,
    title: "Volume d'avis",
    description: "Nombre d'avis reçus par semaine et par mois",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Star,
    title: "Répartition des notes",
    description: "Distribution des étoiles 1★ à 5★",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Clock,
    title: "Temps de réponse",
    description: "Délai moyen entre l'avis et votre réponse",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: ThumbsUp,
    title: "Taux de réponse",
    description: "Pourcentage d'avis auxquels vous avez répondu",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Globe,
    title: "Langues des avis",
    description: "Répartition des avis par langue (FR, EN, DE…)",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: BarChart3,
    title: "Benchmarking",
    description: "Comparez vos performances à votre catégorie d'hôtel",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
];

export default function StatistiquesPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-2">
          Statistiques
        </h1>
        <p className="text-[var(--color-foreground-muted)] text-[15px]">
          Analysez les performances de votre réputation en ligne.
        </p>
      </div>

      {/* Coming soon banner */}
      <div className="flex items-start gap-4 rounded-2xl border border-[var(--color-gold-400)]/25 bg-[var(--color-gold-400)]/5 p-5">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-gold-400)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <BarChart3 className="w-4 h-4 text-[var(--color-gold-400)]" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[var(--color-foreground)] mb-1">
            Module statistiques en cours de développement
          </p>
          <p className="text-[13px] text-[var(--color-foreground-muted)] leading-relaxed">
            Ces tableaux de bord seront disponibles dès la connexion de votre fiche Google My Business. Voici un aperçu de ce qui vous attend.
          </p>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 opacity-60"
            >
              <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <p className="text-[14px] font-semibold text-[var(--color-foreground)] mb-1">
                {feature.title}
              </p>
              <p className="text-[12px] text-[var(--color-foreground-muted)] leading-relaxed">
                {feature.description}
              </p>
              {/* Lock overlay chip */}
              <div className="absolute top-4 right-4 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-foreground-muted)] border border-[var(--color-border)]">
                Bientôt
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
