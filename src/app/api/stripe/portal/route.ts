import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id ?? null;

  // Fallback: find customer in Stripe by email
  if (!customerId && user.email) {
    try {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        // Persist it so future calls skip the search
        const service = createServiceClient();
        await service
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
      }
    } catch (err) {
      console.error("[portal] Stripe customer lookup failed:", err);
    }
  }

  if (!customerId) {
    return NextResponse.json(
      { error: "Aucun abonnement Stripe associé à ce compte" },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://replyforge.fr";

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard/compte`,
    });
    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur Stripe";
    console.error("[portal] Stripe error:", err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
