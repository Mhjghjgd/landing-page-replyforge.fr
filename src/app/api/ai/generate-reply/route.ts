import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { anthropic, SONNET_MODEL } from "@/lib/anthropic";
import { buildReplyPrompt } from "@/lib/ai/build-reply-prompt";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let reviewId: string;
  try {
    const body = await req.json();
    reviewId = body.reviewId;
    if (!reviewId || typeof reviewId !== "string") {
      return NextResponse.json({ error: "reviewId requis" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  // Fetch review (RLS ensures it belongs to the user)
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("id, review_text, rating, author_name, review_language, user_id")
    .eq("id", reviewId)
    .single();

  if (reviewError || !review) {
    console.error("[generate-reply] Review not found:", reviewError);
    return NextResponse.json({ error: "Avis introuvable" }, { status: 404 });
  }

  const service = createServiceClient();

  // Fetch tone profile
  const { data: toneProfile } = await service
    .from("tone_profiles")
    .select("positioning, tone_level, response_length, signature")
    .eq("user_id", user.id)
    .maybeSingle();

  // Fetch business name
  const { data: connection } = await service
    .from("zernio_connections")
    .select("business_name")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: profile } = await service
    .from("profiles")
    .select("hotel_name")
    .eq("id", user.id)
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

  console.log("[generate-reply] Calling Anthropic for review", reviewId, "model:", SONNET_MODEL);

  try {
    const message = await anthropic.messages.create({
      model: SONNET_MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: userMsg }],
    });

    const content = message.content[0];
    const replyText = content.type === "text" ? content.text.trim() : "";

    console.log("[generate-reply] Generated reply for review", reviewId, "length:", replyText.length);

    await service
      .from("reviews")
      .update({
        ai_generated_reply: replyText,
        ai_generated_at: new Date().toISOString(),
        ai_model_used: SONNET_MODEL,
        reply_state: "generated",
      })
      .eq("id", reviewId);

    return NextResponse.json({ success: true, reply: replyText });
  } catch (err) {
    console.error("[generate-reply] Anthropic error for review", reviewId, ":", err);

    await service
      .from("reviews")
      .update({ reply_state: "failed" })
      .eq("id", reviewId);

    return NextResponse.json({ error: "Erreur lors de la génération IA" }, { status: 500 });
  }
}
