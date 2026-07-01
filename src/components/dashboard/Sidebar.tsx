"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  SlidersHorizontal,
  BarChart3,
  Zap,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  showUnreplied?: boolean;
}

interface SidebarProps {
  hotelName: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  unrepliedCount?: number;
}

const navItems: NavItem[] = [
  {
    label: "Vue d'ensemble",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: "Avis & réponses",
    href: "/dashboard/avis",
    icon: <MessageSquare className="w-4 h-4" />,
    showUnreplied: true,
  },
  {
    label: "Réglages de ton",
    href: "/dashboard/reglages",
    icon: <SlidersHorizontal className="w-4 h-4" />,
  },
  {
    label: "Statistiques",
    href: "/dashboard/statistiques",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    label: "Rattrapage express",
    href: "/dashboard/rattrapage",
    icon: <Zap className="w-4 h-4" />,
    badge: "249 €",
  },
  {
    label: "Compte & facturation",
    href: "/dashboard/compte",
    icon: <Settings className="w-4 h-4" />,
  },
];

function SidebarContent({
  pathname,
  hotelName,
  fullName,
  email,
  unrepliedCount,
  onClose,
}: SidebarProps & { pathname: string; onClose?: () => void }) {
  const initial = fullName?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[var(--color-border)]">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5 group"
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden>
            <defs>
              <linearGradient id="rf-sb" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#DCBC5C" />
                <stop offset="100%" stopColor="#A77E25" />
              </linearGradient>
            </defs>
            <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="url(#rf-sb)" strokeWidth="1.5" fill="none" />
            <path d="M11 11H18.5C20.4 11 22 12.6 22 14.5C22 16.4 20.4 18 18.5 18H11V11Z M11 18L17 24" stroke="url(#rf-sb)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="font-display text-[17px] font-semibold tracking-tight text-[var(--color-foreground)]">
            ReplyForge
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Hotel info */}
      <div className="px-4 py-4 border-b border-[var(--color-border)]/50">
        <p className="text-[13px] font-medium text-[var(--color-foreground)] truncate">{hotelName}</p>
        <p className="text-[11px] text-[var(--color-foreground-muted)] truncate mt-0.5">{email}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const showBadge = item.showUnreplied && (unrepliedCount ?? 0) > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200",
                isActive
                  ? "bg-[var(--color-gold-400)]/10 text-[var(--color-gold-300)]"
                  : "text-[var(--color-foreground-muted)] hover:bg-white/[0.04] hover:text-[var(--color-foreground)] hover:translate-x-0.5"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--color-gold-400)] rounded-r-full" />
              )}
              <span
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-[var(--color-gold-400)]"
                    : "text-[var(--color-foreground-muted)] group-hover:text-[var(--color-gold-400)]"
                )}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                  {(unrepliedCount ?? 0) > 99 ? "99+" : unrepliedCount}
                </span>
              )}
              {item.badge && !showBadge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[var(--color-gold-400)]/15 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/20">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

      </nav>

      {/* Footer — avatar + signout */}
      <div className="p-3 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-[var(--color-gold-400)] flex items-center justify-center text-[var(--color-ink-950)] text-xs font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-[var(--color-foreground)] truncate">{fullName}</p>
          </div>
        </div>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[13px] text-[var(--color-foreground-muted)] hover:bg-white/[0.04] hover:text-[var(--color-foreground)] transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}

export function Sidebar({ hotelName, fullName, email, isAdmin, unrepliedCount }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[260px] flex-shrink-0 flex-col bg-[var(--color-ink-900)] border-r border-[var(--color-border)] h-screen sticky top-0">
        <SidebarContent
          pathname={pathname}
          hotelName={hotelName}
          fullName={fullName}
          email={email}
          isAdmin={isAdmin}
          unrepliedCount={unrepliedCount}
        />
      </aside>

      {/* Mobile: hamburger trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] shadow-lg"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-[var(--color-ink-900)] border-r border-[var(--color-border)] flex flex-col md:hidden"
            >
              <SidebarContent
                pathname={pathname}
                hotelName={hotelName}
                fullName={fullName}
                email={email}
                isAdmin={isAdmin}
                unrepliedCount={unrepliedCount}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
