import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

// Required: raw body for signature verification
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[Webhook] Signature verification failed:", msg);
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        if (!userId) break;

        await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", userId);

        console.log("[Webhook] checkout.session.completed — user", userId, "→ active");
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        const statusMap: Record<string, string> = {
          active: "active",
          past_due: "past_due",
          canceled: "cancelled",
          unpaid: "past_due",
          trialing: "active",
          paused: "past_due",
          incomplete: "pending_payment",
          incomplete_expired: "expired",
        };

        const newStatus = statusMap[sub.status] ?? "expired";
        const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
        const cancelAt = (sub as unknown as { cancel_at: number | null }).cancel_at;

        await supabase
          .from("profiles")
          .update({
            subscription_status: newStatus,
            stripe_subscription_id: sub.id,
            subscription_current_period_end: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
            subscription_cancel_at: cancelAt
              ? new Date(cancelAt * 1000).toISOString()
              : null,
          })
          .eq("stripe_subscription_id", sub.id);

        console.log("[Webhook] subscription.updated — sub", sub.id, "→", newStatus);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("profiles")
          .update({ subscription_status: "cancelled" })
          .eq("stripe_subscription_id", sub.id);

        console.log("[Webhook] subscription.deleted — sub", sub.id, "→ cancelled");
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        await supabase
          .from("profiles")
          .update({ subscription_status: "past_due" })
          .eq("stripe_customer_id", customerId);

        console.log("[Webhook] invoice.payment_failed — customer", customerId, "→ past_due");
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        // Restore active status on successful payment (e.g. after past_due recovery)
        if (invoice.billing_reason === "subscription_cycle" || invoice.billing_reason === "subscription_update") {
          await supabase
            .from("profiles")
            .update({ subscription_status: "active" })
            .eq("stripe_customer_id", customerId);
          console.log("[Webhook] invoice.payment_succeeded — customer", customerId, "→ active");
        }
        break;
      }

      default:
        console.debug("[Webhook] Unhandled event type:", event.type);
    }
  } catch (err) {
    console.error("[Webhook] Handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
