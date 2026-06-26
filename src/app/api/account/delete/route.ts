import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { stripe } from "@/lib/stripe";

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceClient();

  const { data: profile } = await serviceClient
    .from("profiles")
    .select("stripe_subscription_id, stripe_customer_id")
    .eq("id", user.id)
    .single();

  // Cancel Stripe subscription immediately
  if (profile?.stripe_subscription_id) {
    try {
      await stripe.subscriptions.cancel(profile.stripe_subscription_id);
    } catch {
      // Subscription may already be cancelled — continue with deletion
    }
  }

  // Delete user from Supabase Auth (cascades to profiles via FK)
  const { error } = await serviceClient.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: "Suppression échouée" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
