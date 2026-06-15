import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className ?? ""}`}
      aria-label="ReplyForge — accueil"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500 group-hover:rotate-[8deg]"
        aria-hidden
      >
        <defs>
          <linearGradient id="rf-grad" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#DCBC5C" />
            <stop offset="100%" stopColor="#A77E25" />
          </linearGradient>
        </defs>
        <path
          d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
          stroke="url(#rf-grad)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M11 11H18.5C20.4 11 22 12.6 22 14.5C22 16.4 20.4 18 18.5 18H11V11Z M11 18L17 24"
          stroke="url(#rf-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="font-display text-[19px] font-semibold tracking-tight text-[var(--color-foreground)]">
        ReplyForge
      </span>
    </Link>
  );
}
