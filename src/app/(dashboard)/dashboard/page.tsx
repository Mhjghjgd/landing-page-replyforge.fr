import { createClient } from "@/lib/supabase/server";
import { Star, MessageSquare, CheckCircle2, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Vue d'ensemble — ReplyForge" };

const kpiCards = [
  {
    label: "Note moyenne",
    icon: Star,
    color: "text-[var(--color-gold-400)]",
    bg: "bg-[var(--color-gold-400)]/10",
  },
  {
    label: "Avis ce mois",
    icon: MessageSquare,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    label: "Taux de réponse",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    label: "Temps moyen",
    icon: Clock,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: googleConnection }] = await Promise.all([
    supabase
      .from("profiles")
      .select("hotel_name, full_name")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("google_connections")
      .select("id")
      .eq("user_id", user!.id)
      .maybeSingle(),
  ]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "vous";
  const hasGoogle = Boolean(googleConnection);

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
          Voici un aperçu de votre activité ReplyForge
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
              <p className="text-3xl font-display text-[var(--color-foreground-muted)]">—</p>
              <p className="text-[11px] text-[var(--color-foreground-muted)]/60 mt-2 leading-snug">
                Connectez votre fiche Google pour voir vos stats
              </p>
            </div>
          );
        })}
      </div>

      {/* Last reviews */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="font-display text-xl text-[var(--color-foreground)]">Vos derniers avis</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-5 opacity-30" aria-hidden>
            <rect x="8" y="12" width="48" height="36" rx="6" stroke="currentColor" strokeWidth="2" className="text-[var(--color-foreground-muted)]" />
            <path d="M20 28h24M20 36h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--color-foreground-muted)]" />
            <path d="M14 12L8 6M50 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--color-foreground-muted)]" />
            <circle cx="32" cy="55" r="3" fill="currentColor" className="text-[var(--color-foreground-muted)]" />
          </svg>
          <p className="text-[15px] font-medium text-[var(--color-foreground)] mb-2">Aucun avis pour l'instant</p>
          <p className="text-[13px] text-[var(--color-foreground-muted)] max-w-sm leading-relaxed">
            Vos nouveaux avis Google apparaîtront ici dès que vous aurez connecté votre fiche.
          </p>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="font-display text-xl text-[var(--color-foreground)]">Évolution de votre note</h2>
        </div>
        <div className="relative p-6">
          {/* Ghost chart */}
          <div className="h-40 flex items-end gap-2 opacity-15">
            {[40, 55, 45, 70, 60, 80, 65, 85, 75, 90, 80, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-[var(--color-gold-400)]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          {/* Overlay message */}
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
