"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const RATING_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "5 ★", value: "5" },
  { label: "4 ★", value: "4" },
  { label: "3 ★", value: "3" },
  { label: "2 ★", value: "2" },
  { label: "1 ★", value: "1" },
];

const STATUS_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "Avec réponse", value: "replied" },
  { label: "Sans réponse", value: "unreplied" },
  { label: "En modération", value: "pending" },
];

export function ReviewFilterChips() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRating = searchParams.get("rating") ?? "all";
  const currentStatus = searchParams.get("status") ?? "all";

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.delete("page"); // reset pagination on filter change
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-wrap gap-1.5">
        {RATING_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter("rating", opt.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150",
              currentRating === opt.value
                ? "bg-[var(--color-gold-400)]/20 text-[var(--color-gold-300)] border border-[var(--color-gold-400)]/30"
                : "bg-[var(--color-surface)] text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] hover:border-[var(--color-foreground-muted)]/30"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter("status", opt.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150",
              currentStatus === opt.value
                ? "bg-blue-400/15 text-blue-300 border border-blue-400/25"
                : "bg-[var(--color-surface)] text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] hover:border-[var(--color-foreground-muted)]/30"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
