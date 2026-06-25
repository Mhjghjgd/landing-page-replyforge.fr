import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogOut, LayoutDashboard, Settings, Shield } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("hotel_name, full_name, role, subscription_status")
    .eq("id", user.id)
    .single();

  // Require active subscription to access the dashboard
  if (profile?.subscription_status !== "active") {
    redirect("/paiement-requis");
  }

  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <Link href="/dashboard" className="font-display text-xl text-[var(--color-gold-400)] tracking-wide">
            ReplyForge
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <SidebarLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/dashboard/parametres" icon={<Settings className="w-4 h-4" />}>
            Paramètres
          </SidebarLink>
          {isAdmin && (
            <SidebarLink href="/admin" icon={<Shield className="w-4 h-4" />}>
              Admin
            </SidebarLink>
          )}
        </nav>

        {/* Déconnexion */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="mb-3 px-3">
            <p className="text-xs font-medium text-[var(--color-foreground)] truncate">
              {profile?.hotel_name}
            </p>
            <p className="text-xs text-[var(--color-foreground-muted)] truncate">{user.email}</p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-[var(--color-foreground-muted)] hover:bg-white/[0.04] hover:text-[var(--color-foreground)] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-[var(--color-border)] flex items-center justify-between px-8 bg-[var(--color-surface)]">
          <span className="text-sm text-[var(--color-foreground-muted)]">
            {profile?.hotel_name ?? "Chargement…"}
          </span>
          <div className="w-8 h-8 rounded-full bg-[var(--color-gold-400)] flex items-center justify-center text-[var(--color-ink-950)] text-sm font-bold">
            {profile?.full_name?.[0]?.toUpperCase() ?? "?"}
          </div>
        </header>

        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-foreground-muted)] hover:bg-white/[0.04] hover:text-[var(--color-foreground)] transition-colors"
    >
      <span className="text-[var(--color-gold-400)]">{icon}</span>
      {children}
    </Link>
  );
}
