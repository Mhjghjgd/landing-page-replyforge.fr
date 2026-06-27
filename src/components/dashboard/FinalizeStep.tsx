"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function FinalizeStep() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function finalize() {
      try {
        const res = await fetch("/api/zernio/finalize-connection");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Erreur lors de la finalisation.");
          setStatus("error");
          return;
        }

        router.replace("/dashboard/avis");
      } catch {
        setError("Impossible de contacter le serveur.");
        setStatus("error");
      }
    }

    finalize();
  }, [router]);

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center space-y-4">
        <p className="text-[14px] text-red-300">{error}</p>
        <button
          onClick={() => (window.location.href = "/onboarding/google")}
          className="text-[13px] font-medium text-[var(--color-gold-400)] hover:text-[var(--color-gold-300)] transition-colors"
        >
          ← Recommencer la connexion
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center space-y-5">
      <div className="flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-[var(--color-gold-400)]" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="text-[15px] font-semibold text-[var(--color-foreground)] mb-1">
          Finalisation de la connexion…
        </p>
        <p className="text-[13px] text-[var(--color-foreground-muted)]">
          Récupération de votre fiche Google et import de vos avis
        </p>
      </div>
    </div>
  );
}
