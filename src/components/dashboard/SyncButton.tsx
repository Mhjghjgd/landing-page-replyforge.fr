"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  async function handleSync() {
    setLoading(true);
    setToast(null);
    try {
      const res = await fetch("/api/zernio/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setToast({ type: "error", msg: data.error ?? "Erreur lors de la synchronisation." });
      } else {
        setToast({ type: "success", msg: `${data.synced} avis synchronisés.` });
        router.refresh();
      }
    } catch {
      setToast({ type: "error", msg: "Impossible de contacter le serveur." });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleSync}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200",
          loading
            ? "bg-[var(--color-border)] text-[var(--color-foreground-muted)] cursor-not-allowed"
            : "bg-[var(--color-gold-400)]/10 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20 hover:bg-[var(--color-gold-400)]/20"
        )}
      >
        <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
        {loading ? "Synchronisation…" : "Synchroniser"}
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
