"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, ExternalLink, AlertTriangle } from "lucide-react";

interface Props {
  userId: string;
  email: string;
  initialFullName: string;
  initialHotelName: string;
  stripeCustomerId: string | null;
  subscriptionStatus: string;
  periodEnd: string | null;
}

export function AccountForm({
  userId,
  email,
  initialFullName,
  initialHotelName,
  stripeCustomerId,
  subscriptionStatus,
  periodEnd,
}: Props) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const [fullName, setFullName] = useState(initialFullName);
  const [hotelName, setHotelName] = useState(initialHotelName);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSaved(false);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, hotel_name: hotelName })
      .eq("id", userId);

    setProfileSaving(false);
    if (error) {
      setProfileError("Impossible de sauvegarder. Réessayez.");
    } else {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    }
  };

  const openPortal = async () => {
    setPortalLoading(true);
    setPortalError(null);

    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      window.location.href = data.url;
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : "Erreur inconnue");
      setPortalLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirm !== "SUPPRIMER") return;
    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erreur lors de la suppression");
      }
      // Sign out and redirect
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Erreur inconnue");
      setDeleting(false);
    }
  };

  const formattedPeriodEnd = periodEnd
    ? new Date(periodEnd).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="space-y-6">
      {/* Profile info */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="text-[15px] font-semibold text-[var(--color-foreground)] mb-5">
          Informations personnelles
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-foreground-muted)] mb-1.5">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[13px] text-[var(--color-foreground-muted)] opacity-60 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-foreground-muted)] mb-1.5">
              Nom complet
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[13px] text-[var(--color-foreground)] outline-none focus:border-[var(--color-gold-400)]/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-foreground-muted)] mb-1.5">
              Nom de l&apos;établissement
            </label>
            <input
              type="text"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[13px] text-[var(--color-foreground)] outline-none focus:border-[var(--color-gold-400)]/40 transition-colors"
            />
          </div>

          {profileError && (
            <p className="text-[12px] text-red-400">{profileError}</p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={saveProfile}
              disabled={profileSaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-gold-400)] text-[var(--color-ink-950)] text-[13px] font-semibold hover:bg-[var(--color-gold-300)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {profileSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Sauvegarder
            </button>
            {profileSaved && (
              <span className="text-[12px] text-green-400 font-medium">✓ Sauvegardé</span>
            )}
          </div>
        </div>
      </div>

      {/* Billing */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="text-[15px] font-semibold text-[var(--color-foreground)] mb-5">
          Abonnement & facturation
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]/50">
            <span className="text-[13px] text-[var(--color-foreground-muted)]">Statut</span>
            <span
              className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full ${
                subscriptionStatus === "active"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${subscriptionStatus === "active" ? "bg-green-400" : "bg-yellow-400"}`}
              />
              {subscriptionStatus === "active" ? "Actif" : "Inactif"}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]/50">
            <span className="text-[13px] text-[var(--color-foreground-muted)]">Plan</span>
            <span className="text-[13px] text-[var(--color-foreground)] font-medium">ReplyForge — 89 €/mois</span>
          </div>
          {formattedPeriodEnd && (
            <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]/50">
              <span className="text-[13px] text-[var(--color-foreground-muted)]">Prochain renouvellement</span>
              <span className="text-[13px] text-[var(--color-foreground)]">{formattedPeriodEnd}</span>
            </div>
          )}
        </div>

        {portalError && (
          <p className="mt-4 text-[12px] text-red-400">{portalError}</p>
        )}

        <div className="mt-5">
          <button
            type="button"
            onClick={openPortal}
            disabled={portalLoading || !stripeCustomerId}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-foreground)] text-[13px] font-medium hover:border-[var(--color-gold-400)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {portalLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ExternalLink className="w-3.5 h-3.5" />
            )}
            Gérer mon abonnement
          </button>
          <p className="mt-2 text-[11px] text-[var(--color-foreground-muted)]">
            Factures, changement de carte, résiliation — géré via le portail Stripe.
          </p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-[15px] font-semibold text-red-400 mb-2">Zone dangereuse</h2>
        <p className="text-[13px] text-[var(--color-foreground-muted)] mb-5 leading-relaxed">
          La suppression de votre compte est irréversible. Votre abonnement sera immédiatement résilié et toutes vos données effacées.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-[13px] font-medium hover:bg-red-500/10 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Supprimer mon compte
        </button>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--color-foreground)]">
                  Supprimer le compte
                </h3>
                <p className="text-[12px] text-[var(--color-foreground-muted)]">Cette action est irréversible</p>
              </div>
            </div>

            <p className="text-[13px] text-[var(--color-foreground-muted)] leading-relaxed mb-5">
              Pour confirmer, saisissez <span className="font-mono font-bold text-red-400">SUPPRIMER</span> ci-dessous.
            </p>

            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[13px] text-[var(--color-foreground)] outline-none focus:border-red-500/40 transition-colors font-mono mb-4"
            />

            {deleteError && (
              <p className="text-[12px] text-red-400 mb-4">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                  setDeleteError(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-foreground-muted)] text-[13px] font-medium hover:text-[var(--color-foreground)] transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={deleteAccount}
                disabled={deleteConfirm !== "SUPPRIMER" || deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
