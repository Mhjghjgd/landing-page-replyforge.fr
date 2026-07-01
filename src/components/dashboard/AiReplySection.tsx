"use client";

import { useState } from "react";
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import type { Review } from "@/types/database";

interface Props {
  review: Review;
}

export function AiReplySection({ review: initialReview }: Props) {
  const [review, setReview] = useState(initialReview);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isAiPublished =
    review.reply_state === "published" || review.reply_state === "edited";

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleGenerate = async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: review.id, force }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la génération");
      setReview({
        ...review,
        ai_generated_reply: data.reply,
        reply_text: data.published ? data.reply : review.reply_text,
        reply_state: data.published ? "published" : "generated",
        reply_published_at: data.published ? new Date().toISOString() : review.reply_published_at,
      });
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!editText.trim()) return;
    setEditLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/edit-reply", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: review.id, newText: editText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la modification");
      setReview({
        ...review,
        reply_text: editText.trim(),
        reply_state: "edited",
        reply_published_at: new Date().toISOString(),
      });
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/delete-reply", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: review.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la suppression");
      setReview({
        ...review,
        reply_text: null,
        reply_state: null,
        reply_published_at: null,
        ai_generated_reply: null,
        ai_generated_at: null,
      });
      setConfirmDelete(false);
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  // Native Google reply (ACTIVE / PENDING / REJECTED — not AI-managed)
  if (review.reply_text && !isAiPublished) {
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

  // AI-published reply (published / edited) — show reply with edit/delete/regenerate
  if (isAiPublished && review.reply_text) {
    return (
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        {!editMode && !confirmDelete && (
          <>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                <CheckCircle2 className="w-3 h-3" />
                {review.reply_state === "edited" ? "Modifié sur Google" : "Publié sur Google"}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setEditText(review.reply_text ?? ""); setEditMode(true); setError(null); }}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Modifier
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg text-red-400/70 border border-red-500/20 hover:text-red-400 hover:border-red-500/40 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-3.5 mb-2">
              <p className="text-[12px] text-[var(--color-foreground)] leading-relaxed whitespace-pre-wrap">
                {review.reply_text}
              </p>
            </div>
            <button
              onClick={() => handleGenerate(true)}
              disabled={loading}
              className="inline-flex items-center gap-1 text-[11px] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Régénérer une nouvelle réponse
            </button>
          </>
        )}

        {/* Edit mode */}
        {editMode && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20">
                <Pencil className="w-3 h-3" /> Modifier la réponse
              </span>
            </div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={5}
              className="w-full rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-3 text-[12px] text-[var(--color-foreground)] leading-relaxed resize-y focus:outline-none focus:border-[var(--color-gold-400)]/50 mb-2"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditSave}
                disabled={editLoading || !editText.trim()}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20 hover:bg-[var(--color-gold-400)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Enregistrer et publier
              </button>
              <button
                onClick={() => { setEditMode(false); setError(null); }}
                disabled={editLoading}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] transition-colors"
              >
                <X className="w-3 h-3" /> Annuler
              </button>
            </div>
          </>
        )}

        {/* Delete confirmation */}
        {confirmDelete && (
          <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3.5">
            <p className="text-[12px] text-[var(--color-foreground)] mb-3">
              Supprimer cette réponse de Google ? Cette action est irréversible.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleteLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                Confirmer la suppression
              </button>
              <button
                onClick={() => { setConfirmDelete(false); setError(null); }}
                disabled={deleteLoading}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] transition-colors"
              >
                <X className="w-3 h-3" /> Annuler
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
      </div>
    );
  }

  // Generated but not published (publish failed or missing Zernio IDs)
  if (review.reply_state === "generated" && review.ai_generated_reply) {
    return (
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20">
            <Sparkles className="w-3 h-3" /> Réponse IA (non publiée)
          </span>
          <button
            onClick={() => handleGenerate(true)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Régénérer
          </button>
        </div>
        <div className="rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-3.5 mb-2">
          <p className="text-[12px] text-[var(--color-foreground)] leading-relaxed whitespace-pre-wrap">
            {review.ai_generated_reply}
          </p>
        </div>
        {/* Publish manually using edit-reply with current text */}
        <button
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const res = await fetch("/api/ai/edit-reply", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId: review.id, newText: review.ai_generated_reply }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error ?? "Erreur");
              setReview({ ...review, reply_text: review.ai_generated_reply, reply_state: "published", reply_published_at: new Date().toISOString() });
            } catch (err) {
              setError(err instanceof Error ? err.message : "Erreur inconnue");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
          Publier sur Google
        </button>
        {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
      </div>
    );
  }

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
            onClick={() => handleGenerate(true)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Réessayer
          </button>
        </div>
        {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
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
          onClick={() => handleGenerate(false)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20 hover:bg-[var(--color-gold-400)]/15 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          Générer maintenant
        </button>
      </div>
      {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
