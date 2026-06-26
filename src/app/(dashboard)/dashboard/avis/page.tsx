import { MessageSquare } from "lucide-react";

export const metadata = { title: "Avis & réponses — ReplyForge" };

export default function AvisPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-2">
          Avis & réponses
        </h1>
        <p className="text-[var(--color-foreground-muted)] text-[15px]">
          Gérez et répondez à tous vos avis Google depuis un seul endroit.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-400/10 flex items-center justify-center mb-5">
            <MessageSquare className="w-8 h-8 text-blue-400 opacity-60" />
          </div>
          <p className="text-[16px] font-semibold text-[var(--color-foreground)] mb-2">
            Aucun avis importé
          </p>
          <p className="text-[13px] text-[var(--color-foreground-muted)] max-w-sm leading-relaxed">
            Vos avis Google apparaîtront ici automatiquement dès que vous aurez connecté votre fiche Google My Business.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium px-4 py-2 rounded-xl bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)]" />
            Connexion Google — Phase 4
          </div>
        </div>
      </div>
    </div>
  );
}
