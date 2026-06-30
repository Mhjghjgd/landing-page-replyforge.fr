import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { zernio, ZernioError, type ZernioReview } from "@/lib/zernio";

export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  if (profile?.subscription_status !== "active") {
    return NextResponse.json({ error: "Subscription not active" }, { status: 403 });
  }

  const service = createServiceClient();

  const { data: connection } = await service
    .from("zernio_connections")
    .select("zernio_account_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!connection?.zernio_account_id) {
    return NextResponse.json(
      { error: "Fiche Google non connectée. Terminez l'étape de connexion d'abord." },
      { status: 400 }
    );
  }

  await service
    .from("zernio_connections")
    .update({ sync_status: "syncing", sync_error: null })
    .eq("user_id", user.id);

  try {
    let reviews: ZernioReview[] = [];
    try {
      const result = await zernio.getReviews(connection.zernio_account_id);
      reviews = result.reviews ?? [];
    } catch (err) {
      console.error("[sync] getReviews failed:", err);
      reviews = [];
    }
    console.log("[sync] Processing", reviews.length, "reviews");

    let synced = 0;
    if (reviews.length > 0) {
      const rows = reviews.map((r) => ({
        user_id: user.id,
        zernio_review_id: r.id,
        author_name: r.author?.name ?? null,
        author_photo_url: r.author?.photoUrl ?? null,
        rating: r.rating ?? null,
        review_text: r.comment ?? null,
        review_language: r.language ?? null,
        review_created_at: r.createTime ?? null,
        review_updated_at: r.updateTime ?? null,
        reply_text: r.reply?.comment ?? null,
        reply_published_at: r.reply?.updateTime ?? null,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await service
        .from("reviews")
        .upsert(rows, { onConflict: "zernio_review_id", ignoreDuplicates: false });

      if (!error) synced = rows.length;
    }

    // Auto-generate AI replies for reviews without any reply or pending AI generation
    const { data: reviewsToGenerate } = await service
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .is("reply_text", null)
      .is("ai_generated_reply", null);

    if (reviewsToGenerate && reviewsToGenerate.length > 0) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://replyforge.fr";
      console.log(`[sync] Triggering AI generation for ${reviewsToGenerate.length} reviews`);
      Promise.all(
        reviewsToGenerate.map((r) =>
          fetch(`${appUrl}/api/ai/generate-reply-internal`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-key": process.env.INTERNAL_API_KEY ?? "",
            },
            body: JSON.stringify({ reviewId: r.id, userId: user.id }),
          }).catch((e) => console.error("[sync] AI gen failed for review", r.id, e))
        )
      ).catch(() => {});
    }

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length
        : null;

    await service
      .from("zernio_connections")
      .update({
        sync_status: "idle",
        sync_error: null,
        last_sync_at: new Date().toISOString(),
        review_count: reviews.length,
        rating: avgRating ? Math.round(avgRating * 100) / 100 : null,
      })
      .eq("user_id", user.id);

    return NextResponse.json({ synced });
  } catch (err) {
    const message =
      err instanceof ZernioError ? err.message : "Erreur lors de la synchronisation.";
    console.error("[zernio/sync]", err);

    await service
      .from("zernio_connections")
      .update({ sync_status: "error", sync_error: message })
      .eq("user_id", user.id);

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
