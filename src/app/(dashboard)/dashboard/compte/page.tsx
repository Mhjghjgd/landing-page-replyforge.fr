import { createClient } from "@/lib/supabase/server";
import { AccountForm } from "@/components/dashboard/AccountForm";

export const metadata = { title: "Compte & facturation — ReplyForge" };

export default async function ComptePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, hotel_name, email, stripe_customer_id, subscription_status, subscription_current_period_end, stripe_subscription_id")
    .eq("id", user!.id)
    .single();

  const { data: zernioConnection } = await supabase
    .from("zernio_connections")
    .select("business_name, zernio_account_id")
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-2">
          Compte & facturation
        </h1>
        <p className="text-[var(--color-foreground-muted)] text-[15px]">
          Gérez vos informations personnelles et votre abonnement.
        </p>
      </div>

      <AccountForm
        userId={user!.id}
        email={user!.email ?? ""}
        initialFullName={profile?.full_name ?? ""}
        initialHotelName={profile?.hotel_name ?? ""}
        stripeCustomerId={profile?.stripe_customer_id ?? null}
        subscriptionStatus={profile?.subscription_status ?? ""}
        periodEnd={profile?.subscription_current_period_end ?? null}
        googleBusinessName={zernioConnection?.business_name ?? null}
        googleAccountId={zernioConnection?.zernio_account_id ?? null}
      />
    </div>
  );
}
