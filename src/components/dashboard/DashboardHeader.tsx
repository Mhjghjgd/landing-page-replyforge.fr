"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const breadcrumbs: Record<string, string> = {
  "/dashboard": "Vue d'ensemble",
  "/dashboard/avis": "Avis & réponses",
  "/dashboard/reglages": "Réglages de ton",
  "/dashboard/statistiques": "Statistiques",
  "/dashboard/rattrapage": "Rattrapage express",
  "/dashboard/compte": "Compte & facturation",
  "/admin": "Administration",
};

export function DashboardHeader({ subscriptionStatus }: { subscriptionStatus: string }) {
  const pathname = usePathname();
  const section = breadcrumbs[pathname] ?? "Dashboard";
  const isActive = subscriptionStatus === "active";

  return (
    <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6 md:px-8 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm pl-10 md:pl-0">
        <span className="text-[var(--color-foreground-muted)]">ReplyForge</span>
        <span className="text-[var(--color-border)]">/</span>
        <span className="text-[var(--color-foreground)] font-medium">{section}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${
            isActive
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-400" : "bg-yellow-400"}`} />
          {isActive ? "Abonnement actif" : "Inactif"}
        </span>

        <button
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--color-foreground-muted)] hover:bg-white/[0.04] hover:text-[var(--color-foreground)] transition-colors relative"
          title="Notifications (bientôt disponible)"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
