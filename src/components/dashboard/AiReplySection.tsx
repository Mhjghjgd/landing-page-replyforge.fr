"use client";

import { useState } from "react";
import { Loader2, Sparkles, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import type { Review } from "@/types/database";

interface Props {
  review: Review;
}

export function AiReplySection({ review: initialReview }: Props) {
  const [review, setReview] = useState(initialReview);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
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

      setReview((prev) => ({
        ...prev,
        ai_generated_reply: data.reply,
        reply_state: "generated",
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setReview((prev) => ({ ...prev, reply_state: "failed" }));
    } finally {
      setLoading(false);
    }
  };

  // Already has a published Google reply
  if (review.reply_text) {
    return (
      <div className="mt-3 pl-3 border-l-2 border-[var(--color-gold-400)]/30">
        <div className="flex items-center gap-1.5 mb-0.5">
          <CheckCircle2 className="w-3 h-3 text-green-400" />
          <p className="text-[11px] font-medium text-green-400">Publié sur Google</p>
        </div>
        <p className="text-[12px] text-[var(--color-foreground-muted)] leading-relaxed">
          {review.reply_text.length > 200
            ? review.reply_text.slice(0, 200) + "…"
            : review.reply_text}
        </p>
      </div>
    );
  }

  // AI reply generated
  if (review.reply_state === "generated" && review.ai_generated_reply) {
    return (
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[var(--color-gold-400)]" />
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20">
            Réponse générée par l'IA
          </span>
        </div>
        <div className="rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-3">
          <p className="text-[12px] text-[var(--color-foreground-muted)] leading-relaxed whitespace-pre-line">
            {review.ai_generated_reply}
          </p>
        </div>
      </div>
    );
  }

  // Generation failed
  if (review.reply_state === "failed") {
    return (
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 text-red-400" />
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            Génération échouée
          </span>
          {error && <span className="text-[11px] text-red-400/70">{error}</span>}
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] disabled:opacity-50 transition-colors"
        >
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          Réessayer
        </button>
      </div>
    );
  }

  // Awaiting generation
  return (
    <div className="mt-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3 text-[var(--color-foreground-muted)]/50" />
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-foreground-muted)] border border-[var(--color-border)]">
          En attente de génération
        </span>
      </div>
      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/20 text-[var(--color-gold-400)] hover:bg-[var(--color-gold-400)]/20 disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Sparkles className="w-3 h-3" />
        )}
        {loading ? "Génération…" : "Générer maintenant"}
      </button>
    </div>
  );
}
