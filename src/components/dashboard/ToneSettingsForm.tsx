"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, RefreshCw, Star, X, Plus } from "lucide-react";

const POSITIONING_OPTIONS = [
  { value: "luxe_5_etoiles", label: "Luxe / 5 étoiles" },
  { value: "boutique_hotel", label: "Boutique-hôtel" },
  { value: "charme", label: "Hôtel de charme" },
  { value: "familial", label: "Hôtel familial" },
  { value: "business", label: "Hôtel business" },
  { value: "economique", label: "Hôtel économique" },
  { value: "bed_breakfast", label: "B&B / Maison d'hôtes" },
];

const TONE_LABELS: Record<number, string> = {
  1: "Très formel",
  2: "Formel",
  3: "Professionnel",
  4: "Professionnel chaleureux",
  5: "Équilibré",
  6: "Chaleureux",
  7: "Amical",
  8: "Très amical",
  9: "Détendu",
  10: "Très chaleureux",
};

const STRENGTH_SUGGESTIONS = [
  "Spa",
  "Vue exceptionnelle",
  "Piscine",
  "Restaurant gastronomique",
  "Emplacement central",
  "Petit-déjeuner",
  "Parking gratuit",
  "Animaux acceptés",
  "Jacuzzi privatif",
  "Terrasse",
];

const SENSITIVE_SUGGESTIONS = [
  "Travaux en cours",
  "WiFi instable",
  "Parking limité",
  "Climatisation ancienne",
  "Litiges en cours",
  "Prix du minibar",
];

interface ToneProfile {
  positioning?: string | null;
  tone_level?: number | null;
  response_length?: string | null;
  signature?: string | null;
  strengths?: string[] | null;
  sensitive_topics?: string[] | null;
}

interface Props {
  userId: string;
  hotelName: string;
  initialProfile: ToneProfile | null;
}

interface PreviewState {
  loading: boolean;
  response: string | null;
  review: { rating: number; text: string } | null;
  error: string | null;
}

function TagInput({
  tags,
  onChange,
  suggestions,
  placeholder,
  maxTags,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
  placeholder: string;
  maxTags: number;
}) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed) || tags.length >= maxTags) return;
    onChange([...tags, trimmed]);
    setInputValue("");
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[36px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-xl bg-[var(--color-gold-400)]/10 text-[var(--color-gold-300)] border border-[var(--color-gold-400)]/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-[var(--color-gold-400)]/60 hover:text-[var(--color-gold-400)] transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length < maxTags && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(inputValue);
              }
            }}
            placeholder={tags.length === 0 ? placeholder : "Ajouter…"}
            className="flex-1 min-w-[140px] bg-transparent text-[13px] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)]/50 outline-none"
          />
        )}
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions
            .filter((s) => !tags.includes(s))
            .slice(0, 6)
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addTag(s)}
                disabled={tags.length >= maxTags}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] hover:border-[var(--color-gold-400)]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-2.5 h-2.5" />
                {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "fill-[var(--color-gold-400)] text-[var(--color-gold-400)]" : "text-[var(--color-border)]"}`}
        />
      ))}
    </div>
  );
}

export function ToneSettingsForm({ userId, hotelName, initialProfile }: Props) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const [positioning, setPositioning] = useState(initialProfile?.positioning ?? "charme");
  const [toneLevel, setToneLevel] = useState(initialProfile?.tone_level ?? 6);
  const [responseLength, setResponseLength] = useState(initialProfile?.response_length ?? "medium");
  const [signature, setSignature] = useState(initialProfile?.signature ?? "");
  const [strengths, setStrengths] = useState<string[]>(initialProfile?.strengths ?? []);
  const [sensitiveTopics, setSensitiveTopics] = useState<string[]>(initialProfile?.sensitive_topics ?? []);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"5" | "3" | "1">("5");
  const [previews, setPreviews] = useState<Record<string, PreviewState>>({
    "5": { loading: false, response: null, review: null, error: null },
    "3": { loading: false, response: null, review: null, error: null },
    "1": { loading: false, response: null, review: null, error: null },
  });

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistProfile = useCallback(
    async (data: {
      positioning: string;
      toneLevel: number;
      responseLength: string;
      signature: string;
      strengths: string[];
      sensitiveTopics: string[];
    }) => {
      setSaving(true);
      setSaved(false);
      await supabase.from("tone_profiles").upsert(
        {
          user_id: userId,
          positioning: data.positioning,
          tone_level: data.toneLevel,
          response_length: data.responseLength,
          signature: data.signature,
          strengths: data.strengths,
          sensitive_topics: data.sensitiveTopics,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [supabase, userId]
  );

  const scheduleSave = useCallback(
    (data: Parameters<typeof persistProfile>[0]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => persistProfile(data), 2000);
    },
    [persistProfile]
  );

  const currentData = useCallback(
    () => ({ positioning, toneLevel, responseLength, signature, strengths, sensitiveTopics }),
    [positioning, toneLevel, responseLength, signature, strengths, sensitiveTopics]
  );

  useEffect(() => {
    scheduleSave(currentData());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positioning, toneLevel, responseLength, signature, strengths, sensitiveTopics]);

  const generatePreview = async (rating: "5" | "3" | "1") => {
    setPreviews((p) => ({
      ...p,
      [rating]: { loading: true, response: null, review: null, error: null },
    }));

    try {
      const res = await fetch("/api/test-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelName,
          positioning,
          toneLevel,
          responseLength,
          signature,
          strengths,
          sensitiveTopics,
          reviewRating: Number(rating),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur serveur");
      setPreviews((p) => ({
        ...p,
        [rating]: { loading: false, response: data.response, review: data.review, error: null },
      }));
    } catch (err) {
      setPreviews((p) => ({
        ...p,
        [rating]: {
          loading: false,
          response: null,
          review: null,
          error: err instanceof Error ? err.message : "Erreur inconnue",
        },
      }));
    }
  };

  const currentPreview = previews[activePreviewTab];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Form */}
      <div className="flex-1 space-y-6">
        {/* Save indicator */}
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-[var(--color-foreground-muted)]">
            Les modifications sont sauvegardées automatiquement
          </p>
          {saving && (
            <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-foreground-muted)]">
              <Loader2 className="w-3 h-3 animate-spin" />
              Sauvegarde…
            </span>
          )}
          {saved && (
            <span className="text-[12px] text-green-400 font-medium">✓ Sauvegardé</span>
          )}
        </div>

        {/* Positioning */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-[14px] font-semibold text-[var(--color-foreground)] mb-4">
            Positionnement de votre établissement
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {POSITIONING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPositioning(opt.value)}
                className={`px-3 py-2.5 rounded-xl text-[13px] font-medium text-left transition-all border ${
                  positioning === opt.value
                    ? "bg-[var(--color-gold-400)]/10 border-[var(--color-gold-400)]/40 text-[var(--color-gold-300)]"
                    : "bg-transparent border-[var(--color-border)] text-[var(--color-foreground-muted)] hover:border-[var(--color-gold-400)]/20 hover:text-[var(--color-foreground)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone level */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[var(--color-foreground)]">
              Niveau de ton
            </h3>
            <span className="text-[12px] font-medium px-3 py-1.5 rounded-xl bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20">
              {toneLevel}/10 — {TONE_LABELS[toneLevel]}
            </span>
          </div>
          <div className="px-1">
            <input
              type="range"
              min={1}
              max={10}
              value={toneLevel}
              onChange={(e) => setToneLevel(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[var(--color-gold-400)] bg-[var(--color-border)]"
            />
            <div className="flex justify-between mt-2">
              <span className="text-[11px] text-[var(--color-foreground-muted)]">Formel</span>
              <span className="text-[11px] text-[var(--color-foreground-muted)]">Chaleureux</span>
            </div>
          </div>
        </div>

        {/* Response length */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-[14px] font-semibold text-[var(--color-foreground)] mb-4">
            Longueur des réponses
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "short", label: "Courte", desc: "2-3 phrases" },
              { value: "medium", label: "Moyenne", desc: "3-4 phrases" },
              { value: "long", label: "Longue", desc: "4-6 phrases" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setResponseLength(opt.value)}
                className={`flex flex-col items-center gap-1 p-4 rounded-xl border text-center transition-all ${
                  responseLength === opt.value
                    ? "bg-[var(--color-gold-400)]/10 border-[var(--color-gold-400)]/40 text-[var(--color-gold-300)]"
                    : "border-[var(--color-border)] text-[var(--color-foreground-muted)] hover:border-[var(--color-gold-400)]/20 hover:text-[var(--color-foreground)]"
                }`}
              >
                <span className="text-[13px] font-semibold">{opt.label}</span>
                <span className="text-[11px] opacity-70">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Signature */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-[14px] font-semibold text-[var(--color-foreground)] mb-1">
            Signature
          </h3>
          <p className="text-[12px] text-[var(--color-foreground-muted)] mb-4">
            Texte qui termine chaque réponse (ex: « Marie, Directrice du Grand Hôtel »)
          </p>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="L'équipe de réception"
            maxLength={120}
            className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[13px] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)]/50 outline-none focus:border-[var(--color-gold-400)]/40 transition-colors"
          />
        </div>

        {/* Strengths */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-[14px] font-semibold text-[var(--color-foreground)] mb-1">
            Points forts à valoriser
          </h3>
          <p className="text-[12px] text-[var(--color-foreground-muted)] mb-4">
            L'IA mettra ces atouts en avant dans les réponses positives (max 8)
          </p>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3">
            <TagInput
              tags={strengths}
              onChange={setStrengths}
              suggestions={STRENGTH_SUGGESTIONS}
              placeholder="Tapez un point fort et appuyez sur Entrée…"
              maxTags={8}
            />
          </div>
        </div>

        {/* Sensitive topics */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-[14px] font-semibold text-[var(--color-foreground)] mb-1">
            Sujets à esquiver
          </h3>
          <p className="text-[12px] text-[var(--color-foreground-muted)] mb-4">
            L'IA évitera de mentionner ces sujets dans les réponses (max 8)
          </p>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3">
            <TagInput
              tags={sensitiveTopics}
              onChange={setSensitiveTopics}
              suggestions={SENSITIVE_SUGGESTIONS}
              placeholder="Tapez un sujet et appuyez sur Entrée…"
              maxTags={8}
            />
          </div>
        </div>
      </div>

      {/* Right: Preview (sticky) */}
      <div className="lg:w-[360px] flex-shrink-0">
        <div className="lg:sticky lg:top-6 space-y-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <h3 className="text-[14px] font-semibold text-[var(--color-foreground)]">
                Aperçu en direct
              </h3>
              <p className="text-[11px] text-[var(--color-foreground-muted)] mt-0.5">
                Testez le rendu de votre configuration
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)]">
              {(["5", "3", "1"] as const).map((rating) => (
                <button
                  key={rating}
                  onClick={() => setActivePreviewTab(rating)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-medium transition-colors border-b-2 ${
                    activePreviewTab === rating
                      ? "border-[var(--color-gold-400)] text-[var(--color-gold-300)]"
                      : "border-transparent text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  <Star
                    className={`w-3 h-3 ${activePreviewTab === rating ? "fill-[var(--color-gold-400)] text-[var(--color-gold-400)]" : ""}`}
                  />
                  {rating}★
                </button>
              ))}
            </div>

            <div className="p-5 space-y-4">
              {/* Sample review */}
              {currentPreview.review && (
                <div className="rounded-xl bg-[var(--color-surface-elevated)] p-3.5 border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={currentPreview.review.rating} />
                    <span className="text-[11px] text-[var(--color-foreground-muted)]">Avis client</span>
                  </div>
                  <p className="text-[12px] text-[var(--color-foreground-muted)] leading-relaxed italic">
                    &quot;{currentPreview.review.text}&quot;
                  </p>
                </div>
              )}

              {/* Response */}
              {currentPreview.loading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Loader2 className="w-6 h-6 text-[var(--color-gold-400)] animate-spin" />
                  <p className="text-[12px] text-[var(--color-foreground-muted)]">Génération en cours…</p>
                </div>
              )}

              {currentPreview.response && !currentPreview.loading && (
                <div className="rounded-xl bg-[var(--color-gold-400)]/5 border border-[var(--color-gold-400)]/15 p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-1 rounded-full bg-[var(--color-gold-400)]" />
                    <span className="text-[11px] font-medium text-[var(--color-gold-400)]">Réponse générée</span>
                  </div>
                  <p className="text-[12px] text-[var(--color-foreground)] leading-relaxed whitespace-pre-wrap">
                    {currentPreview.response}
                  </p>
                </div>
              )}

              {currentPreview.error && (
                <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3.5">
                  <p className="text-[12px] text-red-400">{currentPreview.error}</p>
                </div>
              )}

              {!currentPreview.loading && !currentPreview.response && !currentPreview.error && (
                <div className="text-center py-8">
                  <p className="text-[12px] text-[var(--color-foreground-muted)] mb-3">
                    Cliquez sur Régénérer pour voir un aperçu avec votre configuration actuelle
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => generatePreview(activePreviewTab)}
                disabled={currentPreview.loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] text-[13px] font-medium border border-[var(--color-gold-400)]/20 hover:bg-[var(--color-gold-400)]/15 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${currentPreview.loading ? "animate-spin" : ""}`} />
                Régénérer
              </button>
            </div>
          </div>

          {/* Tip */}
          <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-4">
            <p className="text-[11px] text-[var(--color-foreground-muted)] leading-relaxed">
              <span className="font-semibold text-[var(--color-foreground)]">Conseil :</span>{" "}
              Testez les 3 types d'avis (5★, 3★, 1★) pour vous assurer que le ton convient à toutes les situations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
