import { createClient } from "@/lib/supabase/server";
import { MessageSquare, Star, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import type { Review } from "@/types/database";
import { SyncButton } from "@/components/dashboard/SyncButton";
import { ReviewFilterChips } from "@/components/dashboard/ReviewFilterChips";
import { AiReplySection } from "@/components/dashboard/AiReplySection";

export const metadata = { title: "Avis & réponses — ReplyForge" };

const PER_PAGE = 20;

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days}j`;
  const months = Math.floor(days / 30);
  return `il y a ${months} mois`;
}

function Stars({ rating }: { rating: number | null }) {
  const n = rating ?? 0;
  const color =
    n >= 4 ? "text-green-400" : n === 3 ? "text-yellow-400" : "text-red-400";
  return (
    <span className={`inline-flex items-center gap-0.5 ${color}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i < n ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

function ReplyBadge({ review }: { review: Review }) {
  if (review.reply_text && review.reply_state === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
        <CheckCircle2 className="w-3 h-3" /> Répondu
      </span>
    );
  }
  if (review.reply_state === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
        <Clock className="w-3 h-3" /> En modération
      </span>
    );
  }
  if (review.reply_state === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
        Rejeté par Google
      </span>
    );
  }
  if (review.reply_text) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
        <CheckCircle2 className="w-3 h-3" /> Répondu
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-foreground-muted)]">
      Sans réponse
    </span>
  );
}

export default async function AvisPage({
  searchParams,
}: {
  searchParams: Promise<{ rating?: string; status?: string; page?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = await searchParams;
  const ratingFilter = params.rating ?? "all";
  const statusFilter = params.status ?? "all";
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const { data: connection } = await supabase
    .from("zernio_connections")
    .select("zernio_account_id, business_name, last_sync_at, sync_status, sync_error")
    .eq("user_id", user!.id)
    .maybeSingle();

  const isConnected = Boolean(connection?.zernio_account_id);

  if (!isConnected) {
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
            <p className="text-[13px] text-[var(--color-foreground-muted)] max-w-sm leading-relaxed mb-6">
              Connectez votre fiche Google pour récupérer vos avis et activer les réponses automatiques.
            </p>
            <Link
              href="/onboarding/google"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-gold-400)] text-[var(--color-ink-950)] text-[13px] font-semibold hover:bg-[var(--color-gold-300)] transition-colors"
            >
              Connecter ma fiche Google
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Build query
  let query = supabase
    .from("reviews")
    .select(
      "id, zernio_review_id, author_name, author_photo_url, rating, review_text, review_language, review_created_at, ai_generated_reply, ai_generated_at, ai_model_used, reply_state, reply_text",
      { count: "exact" }
    )
    .eq("user_id", user!.id);

  if (ratingFilter !== "all") {
    query = query.eq("rating", parseInt(ratingFilter, 10));
  }
  if (statusFilter === "replied") {
    query = query.not("reply_text", "is", null);
  } else if (statusFilter === "unreplied") {
    query = query.is("reply_text", null);
  } else if (statusFilter === "pending") {
    query = query.eq("reply_state", "PENDING");
  }

  query = query
    .order("review_created_at", { ascending: false })
    .range((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE - 1);

  const { data: reviews, count } = await query;

  // Stats (always from all reviews, no filter)
  const { data: allReviews } = await supabase
    .from("reviews")
    .select("rating, reply_text, review_created_at")
    .eq("user_id", user!.id);

  const totalReviews = allReviews?.length ?? 0;
  const avgRating =
    totalReviews > 0
      ? (allReviews!.reduce((s, r) => s + (r.rating ?? 0), 0) / totalReviews).toFixed(1)
      : null;
  const repliedCount = allReviews?.filter((r) => r.reply_text).length ?? 0;
  const unrepliedCount = totalReviews - repliedCount;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const thisMouth = allReviews?.filter(
    (r) => r.review_created_at && new Date(r.review_created_at) >= startOfMonth
  ).length ?? 0;

  const totalPages = Math.ceil((count ?? 0) / PER_PAGE);

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-1">
            Avis & réponses
          </h1>
          <p className="text-[var(--color-foreground-muted)] text-[13px]">
            {connection?.last_sync_at
              ? `Synchronisé ${timeAgo(connection.last_sync_at)}`
              : "Pas encore synchronisé"}
            {connection?.sync_status === "syncing" && " · synchronisation en cours…"}
            {connection?.sync_status === "error" && (
              <span className="text-red-400"> · {connection.sync_error}</span>
            )}
          </p>
        </div>
        <SyncButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total avis", value: String(totalReviews), color: "text-[var(--color-foreground)]" },
          { label: "Note moyenne", value: avgRating ? `${avgRating} ★` : "—", color: "text-[var(--color-gold-400)]" },
          { label: "Avec réponse", value: String(repliedCount), color: "text-green-400" },
          { label: "Sans réponse", value: String(unrepliedCount), color: unrepliedCount > 0 ? "text-orange-400" : "text-[var(--color-foreground-muted)]" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
          >
            <p className="text-[11px] text-[var(--color-foreground-muted)] uppercase tracking-wide mb-1">
              {s.label}
            </p>
            <p className={`text-xl font-display font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <ReviewFilterChips />

      {/* Ce mois */}
      {thisMouth > 0 && (
        <p className="text-[12px] text-[var(--color-foreground-muted)]">
          {thisMouth} avis ce mois
        </p>
      )}

      {/* Reviews list */}
      {!reviews || reviews.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-center">
          <MessageSquare className="w-10 h-10 text-[var(--color-foreground-muted)]/30 mx-auto mb-3" />
          <p className="text-[14px] text-[var(--color-foreground-muted)]">
            Aucun avis correspondant à ces filtres.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review: Review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {currentPage > 1 && (
            <Link
              href={`?rating=${ratingFilter}&status=${statusFilter}&page=${currentPage - 1}`}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] transition-colors"
            >
              ← Précédent
            </Link>
          )}
          <span className="text-[12px] text-[var(--color-foreground-muted)]">
            Page {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`?rating=${ratingFilter}&status=${statusFilter}&page=${currentPage + 1}`}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] transition-colors"
            >
              Suivant →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initial = review.author_name?.[0]?.toUpperCase() ?? "?";
  const truncated =
    review.review_text && review.review_text.length > 250
      ? review.review_text.slice(0, 250) + "…"
      : review.review_text;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[var(--color-gold-400)]/20 flex items-center justify-center text-[var(--color-gold-400)] text-sm font-bold flex-shrink-0">
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[13px] font-semibold text-[var(--color-foreground)] truncate">
                {review.author_name ?? "Anonyme"}
              </span>
              <Stars rating={review.rating} />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <ReplyBadge review={review} />
              <span className="text-[11px] text-[var(--color-foreground-muted)]/60">
                {timeAgo(review.review_created_at)}
              </span>
            </div>
          </div>

          {/* Review text */}
          {truncated ? (
            <p className="text-[13px] text-[var(--color-foreground-muted)] leading-relaxed">
              {truncated}
            </p>
          ) : (
            <p className="text-[12px] text-[var(--color-foreground-muted)]/50 italic">
              Avis sans texte
            </p>
          )}

        </div>
      </div>
      <AiReplySection review={review} />
    </div>
  );
}
