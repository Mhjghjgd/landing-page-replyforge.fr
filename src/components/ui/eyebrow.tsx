import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-gold-400)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--color-gold-400)]"
      />
      {children}
    </div>
  );
}
