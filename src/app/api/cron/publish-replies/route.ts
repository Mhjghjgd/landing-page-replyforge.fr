import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { zernio } from "@/lib/zernio";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const now = new Date().toISOString();

  const { data: dueReviews, error } = await service
    .from("reviews")
    .select("id, user_id, zernio_review_id, ai_generated_reply")
    .eq("reply_state", "scheduled")
    .lte("scheduled_publish_at", now);

  if (error) {
    console.error("[cron/publish-replies] DB query failed:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  let published = 0;
  let failed = 0;

  for (const review of dueReviews ?? []) {
    if (!review.ai_generated_reply || !review.zernio_review_id) {
      failed++;
      continue;
    }

    const { data: connection } = await service
      .from("zernio_connections")
      .select("zernio_account_id")
      .eq("user_id", review.user_id)
      .maybeSingle();

    if (!connection?.zernio_account_id) {
      failed++;
      continue;
    }

    try {
      await zernio.publishReviewReply(
        connection.zernio_account_id,
        review.zernio_review_id,
        review.ai_generated_reply
      );

      await service
        .from("reviews")
        .update({
          reply_text: review.ai_generated_reply,
          reply_state: "published",
          reply_published_at: now,
          scheduled_publish_at: null,
          updated_at: now,
        })
        .eq("id", review.id);

      published++;
    } catch (err) {
      console.error("[cron/publish-replies] Failed to publish review", review.id, err);
      failed++;
    }
  }

  console.log(`[cron/publish-replies] processed=${dueReviews?.length ?? 0} published=${published} failed=${failed}`);

  return NextResponse.json({
    processed: dueReviews?.length ?? 0,
    published,
    failed,
  });
}
