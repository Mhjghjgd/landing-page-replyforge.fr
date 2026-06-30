"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building2, CheckCircle2, Loader2, ArrowRight, AlertCircle } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address?: string;
  city?: string;
  locationId?: string;
  accountId?: string;
}

export default function SelectLocationPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLocations() {
      try {
        const res = await fetch("/api/zernio/list-locations");
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.error ?? "Impossible de récupérer vos établissements.");
          return;
        }
        if (!cancelled) setLocations(data.locations ?? []);
      } catch {
        if (!cancelled) setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLocations();
    return () => { cancelled = true; };
  }, []);

  async function handleSelect(locationId: string, accountId?: string) {
    setSelecting(locationId);
    setError(null);
    try {
      const res = await fetch("/api/zernio/select-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId, accountId: accountId ?? "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Impossible de sélectionner cet établissement.");
        setSelecting(null);
        return;
      }
      setSuccess(data.business_name ?? "Votre établissement");
      setTimeout(() => router.push("/dashboard/avis"), 1800);
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
      setSelecting(null);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/20 mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="font-display text-3xl text-[var(--color-foreground)] mb-3">
            Connexion réussie !
          </h1>
          <p className="text-[var(--color-foreground-muted)] text-[15px] mb-2">
            <span className="font-semibold text-[var(--color-foreground)]">{success}</span>{" "}
            est maintenant connecté à ReplyForge.
          </p>
          <p className="text-[13px] text-[var(--color-foreground-muted)]">
            Vos avis sont en cours d&apos;importation…
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-[13px] text-[var(--color-foreground-muted)]">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirection vers le dashboard…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-6">
            <MapPin className="w-8 h-8 text-[var(--color-gold-400)]" />
          </div>
          <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-3">
            Choisissez votre établissement
          </h1>
          <p className="text-[var(--color-foreground-muted)] text-[15px] leading-relaxed">
            Sélectionnez la fiche Google à connecter à ReplyForge.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-[13px] text-red-300">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--color-gold-400)]" />
            <span className="text-[14px] text-[var(--color-foreground-muted)]">
              Récupération de vos établissements…
            </span>
          </div>
        )}

        {/* Empty state */}
        {!loading && locations.length === 0 && !error && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
            <Building2 className="w-10 h-10 text-[var(--color-foreground-muted)]/30 mx-auto mb-3" />
            <p className="text-[14px] text-[var(--color-foreground-muted)]">
              Aucun établissement trouvé sur ce compte Google.
            </p>
            <p className="text-[12px] text-[var(--color-foreground-muted)]/60 mt-1">
              Assurez-vous d&apos;être connecté au bon compte et d&apos;avoir une fiche Google Business.
            </p>
          </div>
        )}

        {/* Locations list */}
        {!loading && locations.length > 0 && (
          <div className="space-y-3">
            {locations.map((loc) => {
              const isSelecting = selecting === loc.id;
              const isDisabled = selecting !== null;
              return (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc.locationId ?? loc.id, loc.accountId)}
                  disabled={isDisabled}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-left transition-all hover:border-[var(--color-gold-400)]/50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-400)]/15 flex items-center justify-center flex-shrink-0">
                      {isSelecting ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[var(--color-gold-400)]" />
                      ) : (
                        <Building2 className="w-5 h-5 text-[var(--color-gold-400)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[var(--color-foreground)] truncate">
                        {loc.name}
                      </p>
                      {(loc.address || loc.city) && (
                        <p className="text-[12px] text-[var(--color-foreground-muted)] mt-0.5 truncate">
                          {[loc.address, loc.city].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                    {!isSelecting && (
                      <ArrowRight className="w-4 h-4 text-[var(--color-foreground-muted)]/40 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Back link */}
        {!loading && !selecting && (
          <div className="text-center mt-8">
            <a
              href="/onboarding/google"
              className="text-[13px] text-[var(--color-foreground-muted)] hover:text-[var(--color-gold-400)] transition-colors"
            >
              ← Recommencer la connexion
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
