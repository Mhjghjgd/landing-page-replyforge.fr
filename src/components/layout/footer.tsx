import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-ink-900)]">
      <div className="absolute inset-x-0 top-0 gold-divider" aria-hidden />
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[var(--color-pearl-400)]">
              {siteConfig.description}
            </p>
            <div className="mt-7 flex flex-col gap-1 text-sm text-[var(--color-pearl-300)]">
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-[var(--color-gold-300)] transition-colors w-fit"
              >
                {siteConfig.email}
              </a>
              <span>Paris — France</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-7">
            <FooterCol title="Navigation">
              {siteConfig.nav.map((n) => (
                <FooterLink key={n.href} href={n.href}>
                  {n.label}
                </FooterLink>
              ))}
            </FooterCol>
            <FooterCol title="Légal">
              {siteConfig.legal.map((n) => (
                <FooterLink key={n.href} href={n.href}>
                  {n.label}
                </FooterLink>
              ))}
            </FooterCol>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border)]/60 pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
            © {new Date().getFullYear()} ReplyForge — Tous droits réservés
          </p>
          <p className="text-xs text-[var(--color-pearl-500)]">
            Forgé avec attention à Paris.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)]">
        {title}
      </h3>
      <ul className="mt-5 flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const className =
    "text-sm text-[var(--color-pearl-300)] hover:text-[var(--color-gold-300)] transition-colors w-fit";
  if (external) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}
