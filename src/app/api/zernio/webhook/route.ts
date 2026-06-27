import { NextResponse, type NextRequest } from "next/server";
import { createHmac } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

interface WebhookReview {
  id: string;
  rating: number;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  author?: { name?: string; photoUrl?: string };
  reply?: { comment: string; updateTime?: string } | null;
}

interface WebhookEvent {
  id: string;
  event: string;
  review?: WebhookReview;
  account?: { id: string; platform: string };
  timestamp?: string;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const secret = process.env.ZERNIO_WEBHOOK_SECRET;
  if (secret) {
    const sig = req.headers.get("x-zernio-signature");
    if (!sig) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    if (sig !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: WebhookEvent;
  try {
    payload = JSON.parse(rawBody) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    (payload.event === "review.new" || payload.event === "review.updated") &&
    payload.review &&
    payload.account
  ) {
    const service = createServiceClient();
    const r = payload.review;
    const accountId = payload.account.id;

    // Find which user owns this account
    const { data: connection } = await service
      .from("zernio_connections")
      .select("user_id")
      .eq("zernio_account_id", accountId)
      .maybeSingle();

    if (connection?.user_id) {
      await service.from("reviews").upsert(
        {
          user_id: connection.user_id,
          zernio_review_id: r.id,
          author_name: r.author?.name ?? null,
          author_photo_url: r.author?.photoUrl ?? null,
          rating: r.rating ?? null,
          review_text: r.comment ?? null,
          review_created_at: r.createTime ?? null,
          review_updated_at: r.updateTime ?? null,
          reply_text: r.reply?.comment ?? null,
          reply_published_at: r.reply?.updateTime ?? null,
          reply_state: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "zernio_review_id" }
      );

      // Update review_count on connection
      const { count } = await service
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", connection.user_id);

      await service
        .from("zernio_connections")
        .update({ review_count: count ?? 0, last_sync_at: new Date().toISOString() })
        .eq("user_id", connection.user_id);
    }
  }

  return NextResponse.json({ received: true });
}
