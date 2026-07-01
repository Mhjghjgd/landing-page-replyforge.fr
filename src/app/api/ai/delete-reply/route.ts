import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { zernio } from "@/lib/zernio";

export const runtime = "nodejs";

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { reviewId } = body as { reviewId: string };

  if (!reviewId) {
    return NextResponse.json({ error: "Missing reviewId" }, { status: 400 });
  }

  const service = createServiceClient();

  const { data: review } = await supabase
    .from("reviews")
    .select("id, zernio_review_id")
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .single();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const { data: connection } = await supabase
    .from("zernio_connections")
    .select("zernio_account_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const accountId = connection?.zernio_account_id;
  const zernioReviewId = review.zernio_review_id;

  if (!accountId || !zernioReviewId) {
    return NextResponse.json({ error: "Missing Zernio identifiers" }, { status: 400 });
  }

  try {
    await zernio.deleteReviewReply(accountId, zernioReviewId);
    console.log("[delete-reply] Deleted Google reply for review", reviewId);

    // Clear reply fields — review returns to clean state for re-generation
    await service
      .from("reviews")
      .update({
        reply_text: null,
        reply_state: null,
        reply_published_at: null,
        ai_generated_reply: null,
        ai_generated_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .eq("user_id", user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[delete-reply] Zernio error for review", reviewId, err);
    const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
