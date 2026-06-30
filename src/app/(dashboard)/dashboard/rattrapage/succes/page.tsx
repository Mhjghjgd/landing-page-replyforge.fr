import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Commande confirmée — ReplyForge" };

export default function RattrapageSuccesPage() {
  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-gold-400)]/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[var(--color-gold-400)]" />
        </div>

        <h1 className="font-display text-3xl text-[var(--color-foreground)] mb-3">
          Commande confirmée
        </h1>

        <p className="text-[14px] text-[var(--color-foreground-muted)] leading-relaxed mb-8 max-w-md mx-auto">
          Votre rattrapage est en cours de traitement. Vous recevrez l'ensemble de vos réponses par email sous 48h ouvrées.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-gold-400)] text-[var(--color-ink-950)] font-semibold text-[14px] hover:bg-[var(--color-gold-300)] transition-colors"
        >
          Retour au dashboard
        </Link>
      </div>
    </div>
  );
}
