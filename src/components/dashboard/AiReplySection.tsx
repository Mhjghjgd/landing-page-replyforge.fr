"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import type { Review } from "@/types/database";

interface Props {
  review: Review;
}

export function AiReplySection({ review }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already published on Google
  if (review.reply_text) {
    return (
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle2 className="w-3 h-3" /> Publié sur Google
          </span>
        </div>
        <p className="text-[12px] text-[var(--color-foreground-muted)] leading-relaxed">
          {review.reply_text}
        </p>
      </div>
    );
  }

  // AI reply generated and ready
  if (review.reply_state === "generated" && review.ai_generated_reply) {
    return (
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20">
            <Sparkles className="w-3 h-3" /> Réponse générée par l'IA
          </span>
        </div>
        <div className="rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-3.5">
          <p className="text-[12px] text-[var(--color-foreground)] leading-relaxed whitespace-pre-wrap">
            {review.ai_generated_reply}
          </p>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: review.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la génération");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Generation failed
  if (review.reply_state === "failed") {
    return (
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle className="w-3 h-3" /> Génération échouée
          </span>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            Réessayer
          </button>
        </div>
        {error && (
          <p className="mt-2 text-[11px] text-red-400">{error}</p>
        )}
      </div>
    );
  }

  // Waiting — no generation yet
  return (
    <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-border)] text-[var(--color-foreground-muted)]">
          En attente de génération IA
        </span>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20 hover:bg-[var(--color-gold-400)]/15 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          Générer maintenant
        </button>
      </div>
      {error && (
        <p className="mt-2 text-[11px] text-red-400">{error}</p>
      )}
    </div>
  );
}
