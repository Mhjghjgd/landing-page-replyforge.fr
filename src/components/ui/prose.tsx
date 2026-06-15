import { cn } from "@/lib/utils";

export function Prose({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "prose-replyforge",
        "max-w-none text-[15.5px] leading-[1.75] text-[var(--color-pearl-200)]",
        "[&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-[var(--color-foreground)] [&_h2]:mt-14 [&_h2]:mb-5",
        "[&_h3]:font-display [&_h3]:text-xl [&_h3]:text-[var(--color-foreground)] [&_h3]:mt-10 [&_h3]:mb-3",
        "[&_p]:mb-4 [&_p]:text-pretty",
        "[&_a]:text-[var(--color-gold-300)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[var(--color-gold-400)]/30 hover:[&_a]:decoration-[var(--color-gold-400)]",
        "[&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2",
        "[&_li]:relative [&_li]:pl-3",
        "[&_li::before]:content-[''] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-3 [&_li::before]:h-1 [&_li::before]:w-1 [&_li::before]:rounded-full [&_li::before]:bg-[var(--color-gold-400)]",
        "[&_strong]:text-[var(--color-foreground)] [&_strong]:font-medium",
        className,
      )}
    >
      {children}
    </div>
  );
}
