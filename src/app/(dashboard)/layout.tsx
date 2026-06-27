import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const [{ data: profile }, { count: unrepliedCount }] = await Promise.all([
    supabase
      .from("profiles")
      .select("hotel_name, full_name, email, role, subscription_status")
      .eq("id", user.id)
      .single(),
    supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("reply_text", null),
  ]);

  if (profile?.subscription_status !== "active") redirect("/paiement-requis");

  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      <Sidebar
        hotelName={profile?.hotel_name ?? ""}
        fullName={profile?.full_name ?? ""}
        email={user.email ?? ""}
        isAdmin={isAdmin}
        unrepliedCount={unrepliedCount ?? 0}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader subscriptionStatus={profile?.subscription_status ?? ""} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[var(--color-background)]">
          {children}
        </main>
      </div>
    </div>
  );
}
