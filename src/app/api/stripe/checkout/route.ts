import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  let {
    data: { user },
  } = await supabase.auth.getUser();

  // Fallback 1: Bearer token (present when signUp returns a session)
  if (!user) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "").trim();
    if (token) {
      const { data } = await supabase.auth.getUser(token);
      user = data.user ?? null;
    }
  }

  // Fallback 2: userId in body, resolved via admin API (email-confirm flow)
  let rawBody: Record<string, unknown> = {};
  if (!user) {
    try {
      rawBody = await request.json();
    } catch {
      // no body
    }
    const userId = typeof rawBody.userId === "string" ? rawBody.userId : null;
    if (userId) {
      const service = createServiceClient();
      const { data } = await service.auth.admin.getUserById(userId);
      user = data.user ?? null;
    }
  }

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, stripe_customer_id, email")
    .eq("id", user.id)
    .single();

  if (profile?.subscription_status === "active") {
    return NextResponse.json({ url: "/dashboard" });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://replyforge.fr";

  try {
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
      metadata: { user_id: user.id },
      subscription_data: { metadata: { user_id: user.id } },
      success_url: `${appUrl}/onboarding/google?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/paiement-annule`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur Stripe";
    console.error("[checkout] Stripe error:", err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
