import { createClient } from "@/lib/supabase/server";
import {
  RatingTrendChart,
  VolumeTrendChart,
  StarDistChart,
  LangDistChart,
  ResponseRateCard,
  type RatingPoint,
  type VolumePoint,
  type StarDist,
  type LangDist,
} from "@/components/dashboard/stats/StatsCharts";

export const metadata = { title: "Statistiques — ReplyForge" };

function getWeekLabel(date: Date): string {
  const y = date.getFullYear();
  const start = new Date(y, 0, 1);
  const week = Math.ceil(((date.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return `S${week} ${y}`;
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

export default async function StatistiquesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating, review_created_at, imported_at, reply_state, reply_published_at, ai_generated_at, review_language")
    .eq("user_id", user!.id)
    .order("imported_at", { ascending: true });

  const total = reviews?.length ?? 0;

  if (total < 3) {
    return (
      <div className="max-w-5xl space-y-8">
        <div>
          <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-2">Statistiques</h1>
          <p className="text-[var(--color-foreground-muted)] text-[15px]">
            Analysez les performances de votre réputation en ligne.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
          <p className="text-[14px] text-[var(--color-foreground-muted)]">
            Pas encore assez de données pour un graphique pertinent — revenez après quelques avis.
          </p>
        </div>
      </div>
    );
  }

  // ── Rating trend (group by month if > 30 reviews, else by week) ──────────
  const useMonths = total > 30;
  const ratingBuckets = new Map<string, number[]>();
  const volumeBuckets = new Map<string, number>();

  for (const r of reviews ?? []) {
    const dateStr = r.review_created_at ?? r.imported_at;
    if (!dateStr) continue;
    const d = new Date(dateStr);
    const label = useMonths ? getMonthLabel(d) : getWeekLabel(d);

    if (r.rating) {
      if (!ratingBuckets.has(label)) ratingBuckets.set(label, []);
      ratingBuckets.get(label)!.push(r.rating);
    }
    volumeBuckets.set(label, (volumeBuckets.get(label) ?? 0) + 1);
  }

  const ratingTrend: RatingPoint[] = Array.from(ratingBuckets.entries()).map(([label, ratings]) => ({
    label,
    avg: Math.round((ratings.reduce((s, v) => s + v, 0) / ratings.length) * 100) / 100,
  }));

  const volumeTrend: VolumePoint[] = Array.from(volumeBuckets.entries()).map(([label, count]) => ({
    label,
    count,
  }));

  // ── Star distribution ─────────────────────────────────────────────────────
  const starMap = new Map<number, number>();
  for (const r of reviews ?? []) {
    if (r.rating) starMap.set(r.rating, (starMap.get(r.rating) ?? 0) + 1);
  }
  const starDist: StarDist[] = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: starMap.get(star) ?? 0,
  }));

  // ── Language distribution ─────────────────────────────────────────────────
  const langMap = new Map<string, number>();
  for (const r of reviews ?? []) {
    const lang = r.review_language?.toLowerCase().slice(0, 2) ?? null;
    const label = !lang ? "Inconnu" : lang === "fr" ? "Français" : lang === "en" ? "English" : lang === "de" ? "Deutsch" : lang === "es" ? "Español" : lang === "it" ? "Italiano" : lang.toUpperCase();
    langMap.set(label, (langMap.get(label) ?? 0) + 1);
  }
  const langDist: LangDist[] = Array.from(langMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => ({ lang, count }));

  // ── Response rate ─────────────────────────────────────────────────────────
  const replied = reviews?.filter((r) => r.reply_state === "published" || r.reply_state === "edited").length ?? 0;
  const responseRate = total > 0 ? Math.round((replied / total) * 100) : 0;

  // ── Average response time ─────────────────────────────────────────────────
  const responseTimes: number[] = [];
  for (const r of reviews ?? []) {
    if (r.review_created_at && r.reply_published_at) {
      const created = new Date(r.review_created_at).getTime();
      const published = new Date(r.reply_published_at).getTime();
      const hours = (published - created) / 3600000;
      if (hours > 0 && hours < 8760) responseTimes.push(hours);
    }
  }
  const avgResponseHours =
    responseTimes.length > 0
      ? responseTimes.reduce((s, v) => s + v, 0) / responseTimes.length
      : null;

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-2">Statistiques</h1>
        <p className="text-[var(--color-foreground-muted)] text-[15px]">
          Analysez les performances de votre réputation en ligne.
        </p>
      </div>

      <ResponseRateCard rate={responseRate} avgHours={avgResponseHours} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingTrendChart data={ratingTrend} />
        <VolumeTrendChart data={volumeTrend} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StarDistChart data={starDist} />
        {langDist.length > 0 ? (
          <LangDistChart data={langDist} />
        ) : (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex items-center justify-center">
            <p className="text-[13px] text-[var(--color-foreground-muted)] text-center">
              Langues des avis — données insuffisantes
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h3 className="font-display text-lg text-[var(--color-foreground)] mb-2">Benchmarking & comparatif sectoriel</h3>
        <p className="text-[13px] text-[var(--color-foreground-muted)]">Bientôt disponible — comparaison avec des établissements similaires.</p>
      </div>
    </div>
  );
}
