import { BarChart3 } from "lucide-react";

export const metadata = { title: "Statistiques — ReplyForge" };

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

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
        <BarChart3 className="w-10 h-10 text-[var(--color-foreground-muted)]/30 mx-auto mb-4" />
        <h2 className="font-display text-xl text-[var(--color-foreground)] mb-2">
          Statistiques en préparation
        </h2>
        <p className="text-[14px] text-[var(--color-foreground-muted)] max-w-md mx-auto">
          Vos données s&apos;accumulent en arrière-plan. Le tableau de bord complet sera disponible dans une prochaine mise à jour.
        </p>
      </div>
    </div>
  );
}
