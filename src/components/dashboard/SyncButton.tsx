"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  async function handleSync() {
    setLoading(true);
    setToast(null);
    try {
      const res = await fetch("/api/zernio/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setToast({ type: "error", msg: data.error ?? "Erreur lors de la synchronisation." });
        return;
      }

      const reviewIds: string[] = data.reviewIds ?? [];
      console.log("[SyncButton] sync complete — synced:", data.synced, "to generate:", reviewIds.length, reviewIds);

      setToast({ type: "success", msg: `${data.synced} avis synchronisés.` });

      if (reviewIds.length > 0) {
        setGenerating(true);
        let generated = 0;
        let failed = 0;
        for (const reviewId of reviewIds) {
          try {
            const genRes = await fetch("/api/ai/generate-reply", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reviewId }),
            });
            if (genRes.ok) {
              generated++;
              console.log("[SyncButton] generated reply for", reviewId);
            } else {
              failed++;
              const errBody = await genRes.json().catch(() => ({}));
              console.error("[SyncButton] generate-reply failed for", reviewId, genRes.status, errBody);
            }
          } catch (e) {
            failed++;
            console.error("[SyncButton] network error for", reviewId, e);
          }
        }
        console.log("[SyncButton] generation done — ok:", generated, "failed:", failed);
        setGenerating(false);
        if (generated > 0) {
          setToast({ type: "success", msg: `${data.synced} avis synchronisés · ${generated} réponses IA générées.` });
        }
      }

      router.refresh();
    } catch {
      setToast({ type: "error", msg: "Impossible de contacter le serveur." });
    } finally {
      setLoading(false);
      setGenerating(false);
      setTimeout(() => setToast(null), 4000);
    }
  }

  const isBusy = loading || generating;

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleSync}
        disabled={isBusy}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200",
          isBusy
            ? "bg-[var(--color-border)] text-[var(--color-foreground-muted)] cursor-not-allowed"
            : "bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20 hover:bg-[var(--color-gold-400)]/20"
        )}
      >
        <RefreshCw className={cn("w-3.5 h-3.5", isBusy && "animate-spin")} />
        {generating ? "Génération IA en cours…" : loading ? "Synchronisation…" : "Synchroniser"}
      </button>
      {toast && (
        <p
          className={cn(
            "text-[12px] font-medium",
            toast.type === "success" ? "text-green-400" : "text-red-400"
          )}
        >
          {toast.msg}
        </p>
      )}
    </div>
  );
}
