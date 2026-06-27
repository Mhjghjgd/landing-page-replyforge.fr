import { createClient } from "@/lib/supabase/server";
import { Star, MessageSquare, CheckCircle2, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Vue d'ensemble — ReplyForge" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: connection }] = await Promise.all([
    supabase
      .from("profiles")
      .select("hotel_name, full_name")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("zernio_connections")
      .select("zernio_account_id, business_name, review_count, rating")
      .eq("user_id", user!.id)
      .maybeSingle(),
  ]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "vous";
  const hasGoogle = Boolean(connection?.zernio_account_id);

  // Fetch reviews for KPI
  const { data: reviews } = hasGoogle
    ? await supabase
        .from("reviews")
        .select("rating, reply_text, review_created_at")
        .eq("user_id", user!.id)
    : { data: null };

  const totalReviews = reviews?.length ?? 0;

  const avgRating =
    totalReviews > 0
      ? (reviews!.reduce((s, r) => s + (r.rating ?? 0), 0) / totalReviews).toFixed(1)
      : null;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const avisCeMois =
    reviews?.filter(
      (r) => r.review_created_at && new Date(r.review_created_at) >= startOfMonth
    ).length ?? 0;

  const repliedCount = reviews?.filter((r) => r.reply_text).length ?? 0;
  const tauxReponse =
    totalReviews > 0 ? Math.round((repliedCount / totalReviews) * 100) : null;

  const kpiCards = [
    {
      label: "Note moyenne",
      icon: Star,
      color: "text-[var(--color-gold-400)]",
      bg: "bg-[var(--color-gold-400)]/10",
      value: avgRating ? `${avgRating}` : null,
      sub: avgRating ? `Sur ${totalReviews} avis` : "Connectez votre fiche Google",
    },
    {
      label: "Avis ce mois",
      icon: MessageSquare,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      value: hasGoogle ? String(avisCeMois) : null,
      sub: hasGoogle ? "Nouveaux avis" : "Connectez votre fiche Google",
    },
    {
      label: "Taux de réponse",
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-400/10",
      value: tauxReponse !== null ? `${tauxReponse} %` : null,
      sub:
        tauxReponse !== null
          ? `${repliedCount} / ${totalReviews} avis`
          : "Connectez votre fiche Google",
    },
    {
      label: "Temps moyen",
      icon: Clock,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      value: null,
      sub: "Disponible Phase 6",
    },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      {/* Banner — only if no Google connection */}
      {!hasGoogle && (
        <div className="flex items-start gap-4 rounded-2xl border border-[var(--color-gold-400)]/25 bg-[var(--color-gold-400)]/5 p-5">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-gold-400)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-[var(--color-gold-400)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[var(--color-foreground)] mb-1">
              🎯 Connectez votre fiche Google pour activer ReplyForge
            </p>
            <p className="text-[13px] text-[var(--color-foreground-muted)] leading-relaxed">
              Vos avis seront automatiquement importés et notre IA générera des réponses personnalisées selon votre ton.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/onboarding/google"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-gold-400)] hover:text-[var(--color-gold-300)] transition-colors whitespace-nowrap"
            >
              Connecter →
            </Link>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div>
        <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-2">
          Bonjour {firstName} 👋
        </h1>
        <p className="text-[var(--color-foreground-muted)] text-[15px]">
          {hasGoogle && connection?.business_name
            ? `Aperçu de l'activité de ${connection.business_name}`
            : "Voici un aperçu de votre activité ReplyForge"}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-medium text-[var(--color-foreground-muted)] uppercase tracking-wide">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <p
                className={`text-3xl font-display ${
                  card.value ? "text-[var(--color-foreground)]" : "text-[var(--color-foreground-muted)]"
                }`}
              >
                {card.value ?? "—"}
              </p>
              <p className="text-[11px] text-[var(--color-foreground-muted)]/60 mt-2 leading-snug">
                {card.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Last reviews */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="font-display text-xl text-[var(--color-foreground)]">Vos derniers avis</h2>
          {hasGoogle && (
            <Link
              href="/dashboard/avis"
              className="text-[12px] text-[var(--color-gold-400)] hover:text-[var(--color-gold-300)] transition-colors"
            >
              Voir tous →
            </Link>
          )}
        </div>

        {!hasGoogle || !reviews || reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-5 opacity-30" aria-hidden>
              <rect x="8" y="12" width="48" height="36" rx="6" stroke="currentColor" strokeWidth="2" className="text-[var(--color-foreground-muted)]" />
              <path d="M20 28h24M20 36h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--color-foreground-muted)]" />
              <path d="M14 12L8 6M50 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--color-foreground-muted)]" />
              <circle cx="32" cy="55" r="3" fill="currentColor" className="text-[var(--color-foreground-muted)]" />
            </svg>
            <p className="text-[15px] font-medium text-[var(--color-foreground)] mb-2">
              Aucun avis pour l&apos;instant
            </p>
            <p className="text-[13px] text-[var(--color-foreground-muted)] max-w-sm leading-relaxed">
              {hasGoogle
                ? "Synchronisez vos avis depuis la page Avis & réponses."
                : "Vos nouveaux avis Google apparaîtront ici dès que vous aurez connecté votre fiche."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {reviews.slice(0, 5).map((_, i) => (
              <div key={i} className="px-6 py-4">
                <p className="text-[13px] text-[var(--color-foreground-muted)]">
                  {["★★★★★", "★★★★", "★★★★★", "★★★", "★★★★★"][i % 5]} Avis importé
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart placeholder */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="font-display text-xl text-[var(--color-foreground)]">Évolution de votre note</h2>
        </div>
        <div className="relative p-6">
          <div className="h-40 flex items-end gap-2 opacity-15">
            {[40, 55, 45, 70, 60, 80, 65, 85, 75, 90, 80, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-[var(--color-gold-400)]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-[var(--color-border)]">
              <p className="text-[13px] text-[var(--color-foreground-muted)]">
                Disponible après la connexion de votre fiche Google
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
