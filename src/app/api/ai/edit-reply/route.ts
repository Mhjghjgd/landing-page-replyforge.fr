import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { zernio } from "@/lib/zernio";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { reviewId, newText } = body as { reviewId: string; newText: string };

  if (!reviewId || !newText?.trim()) {
    return NextResponse.json({ error: "Missing reviewId or newText" }, { status: 400 });
  }

  const service = createServiceClient();

  const { data: review } = await supabase
    .from("reviews")
    .select("id, zernio_review_id, reply_state")
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
    const publishResult = await zernio.publishReviewReply(accountId, zernioReviewId, newText.trim());
    console.log("[edit-reply] Zernio publish result:", JSON.stringify(publishResult));

    await service
      .from("reviews")
      .update({
        reply_text: newText.trim(),
        reply_state: "edited",
        reply_published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .eq("user_id", user.id);

    console.log("[edit-reply] Updated reply for review", reviewId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[edit-reply] Zernio error for review", reviewId, err);
    const message = err instanceof Error ? err.message : "Erreur lors de la modification";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
