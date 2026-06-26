import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

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
    .select("subscription_status, stripe_customer_id, full_name, hotel_name, email")
    .eq("id", user.id)
    .single();

  // If already active, redirect to dashboard directly
  if (profile?.subscription_status === "active") {
    return NextResponse.json({ url: "/dashboard" });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://replyforge.fr";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRICE_SUBSCRIPTION!,
        quantity: 1,
      },
    ],
    customer_email: profile?.stripe_customer_id ? undefined : (user.email ?? undefined),
    customer: profile?.stripe_customer_id ?? undefined,
    allow_promotion_codes: true,
    metadata: {
      user_id: user.id,
      full_name: profile?.full_name ?? "",
      hotel_name: profile?.hotel_name ?? "",
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
      },
    },
    success_url: `${appUrl}/onboarding/google?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/paiement-annule`,
  });

  return NextResponse.json({ url: session.url });
}
