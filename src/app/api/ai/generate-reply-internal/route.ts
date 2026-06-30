import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { anthropic, SONNET_MODEL } from "@/lib/anthropic";
import { buildReplyPrompt } from "@/lib/ai/build-reply-prompt";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const internalKey = req.headers.get("x-internal-key");
  if (!internalKey || internalKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let reviewId: string;
  let userId: string;
  try {
    const body = await req.json();
    reviewId = body.reviewId;
    userId = body.userId;
    if (!reviewId || !userId) {
      return NextResponse.json({ error: "reviewId et userId requis" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const service = createServiceClient();

  const { data: review, error: reviewError } = await service
    .from("reviews")
    .select("id, review_text, rating, author_name, review_language")
    .eq("id", reviewId)
    .eq("user_id", userId)
    .single();

  if (reviewError || !review) {
    console.error("[generate-reply-internal] Review not found:", reviewError);
    return NextResponse.json({ error: "Avis introuvable" }, { status: 404 });
  }

  const { data: toneProfile } = await service
    .from("tone_profiles")
    .select("positioning, tone_level, response_length, signature")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: connection } = await service
    .from("zernio_connections")
    .select("business_name")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: profile } = await service
    .from("profiles")
    .select("hotel_name")
    .eq("id", userId)
    .single();

  const businessName =
    connection?.business_name ?? profile?.hotel_name ?? "Notre établissement";

  const lengthMap: Record<string, "courte" | "moyenne" | "longue"> = {
    short: "courte",
    medium: "moyenne",
    long: "longue",
  };

  const { system, user: userMsg } = buildReplyPrompt({
    reviewText: review.review_text,
    rating: review.rating ?? 3,
    authorName: review.author_name,
    reviewLanguage: review.review_language,
    tone: {
      positioning: toneProfile?.positioning ?? "charme",
      toneLevel: toneProfile?.tone_level ?? 6,
      length: lengthMap[toneProfile?.response_length ?? "medium"] ?? "moyenne",
      signature: toneProfile?.signature ?? null,
    },
    businessName,
  });

  console.log("[generate-reply-internal] Calling Anthropic for review", reviewId, "model:", SONNET_MODEL);

  try {
    const message = await anthropic.messages.create({
      model: SONNET_MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: userMsg }],
    });

    const content = message.content[0];
    const replyText = content.type === "text" ? content.text.trim() : "";

    console.log("[generate-reply-internal] Generated reply for review", reviewId, "length:", replyText.length);

    await service
      .from("reviews")
      .update({
        ai_generated_reply: replyText,
        ai_generated_at: new Date().toISOString(),
        ai_model_used: SONNET_MODEL,
        reply_state: "generated",
      })
      .eq("id", reviewId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[generate-reply-internal] Anthropic error for review", reviewId, ":", err);

    await service
      .from("reviews")
      .update({ reply_state: "failed" })
      .eq("id", reviewId);

    return NextResponse.json({ error: "Erreur génération IA" }, { status: 500 });
  }
}
