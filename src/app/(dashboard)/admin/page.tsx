import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin — ReplyForge",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, hotel_name, email, role, subscription_status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-2">
        Administration
      </h1>
      <p className="text-[var(--color-foreground-muted)] mb-10">
        Vue d'ensemble de tous les comptes ReplyForge.
      </p>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            {users?.length ?? 0} compte{(users?.length ?? 0) > 1 ? "s" : ""} enregistré{(users?.length ?? 0) > 1 ? "s" : ""}
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-6 py-3 text-[var(--color-foreground-muted)] font-medium">Établissement</th>
              <th className="text-left px-6 py-3 text-[var(--color-foreground-muted)] font-medium">Email</th>
              <th className="text-left px-6 py-3 text-[var(--color-foreground-muted)] font-medium">Rôle</th>
              <th className="text-left px-6 py-3 text-[var(--color-foreground-muted)] font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-[var(--color-border)]/50 hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-[var(--color-foreground)]">{u.hotel_name}</td>
                <td className="px-6 py-4 text-[var(--color-foreground-muted)]">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${u.role === "admin" ? "bg-[var(--color-gold-400)]/20 text-[var(--color-gold-300)]" : "bg-white/[0.06] text-[var(--color-foreground-muted)]"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-[var(--color-foreground-muted)]">{u.subscription_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
