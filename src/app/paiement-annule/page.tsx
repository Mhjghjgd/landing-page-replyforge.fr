import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { XCircle } from "lucide-react";
import { ResumePaymentButton } from "@/components/billing/ResumePaymentButton";

export const metadata = {
  title: "Paiement annulé — ReplyForge",
};

export default async function PaiementAnnulePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-8">
          <XCircle className="w-8 h-8 text-[var(--color-foreground-muted)]" />
        </div>

        <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-4">
          Pas de souci
        </h1>
        <p className="text-[var(--color-foreground-muted)] text-lg leading-relaxed mb-10">
          Vous pouvez reprendre votre abonnement quand vous voulez. Vos informations ont été sauvegardées.
        </p>

        <div className="flex flex-col gap-3">
          <ResumePaymentButton />
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full h-12 rounded-xl text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
