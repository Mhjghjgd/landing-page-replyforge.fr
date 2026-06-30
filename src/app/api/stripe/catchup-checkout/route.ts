import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://replyforge.fr";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: process.env.STRIPE_PRICE_CATCHUP!,
        quantity: 1,
      },
    ],
    customer_email: profile?.stripe_customer_id ? undefined : user.email!,
    customer: profile?.stripe_customer_id ?? undefined,
    metadata: {
      user_id: user.id,
      order_type: "catchup",
    },
    success_url: `${appUrl}/dashboard/rattrapage/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/dashboard/rattrapage`,
  });

  return NextResponse.json({ url: session.url });
}
