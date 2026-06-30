"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function CatchupCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/catchup-checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-gold-400)] text-[var(--color-ink-950)] font-semibold text-[14px] hover:bg-[var(--color-gold-300)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Commander
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
      {error && (
        <p className="text-[11px] text-red-400 mt-3 leading-relaxed">{error}</p>
      )}
    </>
  );
}
