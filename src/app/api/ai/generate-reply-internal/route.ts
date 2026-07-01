import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  const internalKey = request.headers.get("x-internal-key");
  if (!internalKey || internalKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { reviewId, userId } = body as { reviewId: string; userId: string };

  if (!reviewId || !userId) {
    return NextResponse.json({ error: "Missing reviewId or userId" }, { status: 400 });
  }

  const service = createServiceClient();

  const { data: review, error: reviewError } = await service
    .from("reviews")
    .select("id, rating, review_text, review_language, reply_state, ai_generated_reply")
    .eq("id", reviewId)
    .eq("user_id", userId)
    .single();

  if (reviewError || !review) {
    console.error("[generate-reply-internal] Review not found:", reviewId, reviewError);
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (review.ai_generated_reply && review.reply_state === "generated") {
    console.log("[generate-reply-internal] Already generated for", reviewId);
    return NextResponse.json({ skipped: true });
  }

  const { data: profile } = await service
    .from("tone_profiles")
    .select("positioning, tone_level, response_length, signature, strengths, sensitive_topics")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: connection } = await service
    .from("zernio_connections")
    .select("business_name")
    .eq("user_id", userId)
    .maybeSingle();

  const hotelName = connection?.business_name ?? "cet établissement";
  const positioning = profile?.positioning ?? "charme";
  const toneLevel = profile?.tone_level ?? 6;
  const responseLength = profile?.response_length ?? "medium";
  const signature = profile?.signature ?? "L'équipe";
  const strengths: string[] = profile?.strengths ?? [];
  const sensitiveTopics: string[] = profile?.sensitive_topics ?? [];

  const lengthInstruction =
    responseLength === "short"
      ? "2-3 phrases courtes"
      : responseLength === "long"
        ? "4-6 phrases détaillées"
        : "3-4 phrases équilibrées";

  const systemPrompt = `Tu es l'assistant de réponse aux avis Google de ${hotelName}, un hôtel ${positioning}.

PROFIL DE RÉPONSE :
- Niveau de ton : ${toneLevel}/10 (1=très formel et professionnel, 10=très chaleureux et familier)
- Longueur cible : ${lengthInstruction}
- Signature : "${signature}"
- Points forts à valoriser : ${strengths.length ? strengths.join(", ") : "aucun spécifié"}
- Sujets à esquiver : ${sensitiveTopics.length ? sensitiveTopics.join(", ") : "aucun"}

RÈGLES STRICTES :
1. Réponds dans la même langue que l'avis
2. Remercie sincèrement, JAMAIS de manière générique
3. Si positif (4-5★) : reprends UN détail spécifique mentionné dans l'avis
4. Si neutre (3★) : reconnais les points positifs ET les axes d'amélioration
5. Si négatif (1-2★) : excuses sincères, propose un contact direct, NE PROMETS RIEN de spécifique
6. MOTS BANNIS : "nous prenons note", "votre retour est précieux", "toute notre équipe", "nous vous invitons à"
7. Termine TOUJOURS par la signature exacte fournie
8. Pas de markdown, pas d'emoji, pas de guillemets autour de la réponse
9. Réponse directe, commence sans formule d'introduction`;

  const reviewText = review.review_text ?? "(Avis sans texte)";
  const userMessage = `Avis ${review.rating ?? "?"}★ :\n"${reviewText}"\n\nGénère la réponse de l'hôtelier.`;

  try {
    console.log(`[generate-reply-internal] Generating reply for review ${reviewId} (user ${userId})`);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: userMessage }],
      system: systemPrompt,
    });

    const content = message.content[0];
    const generatedReply = content.type === "text" ? content.text.trim() : "";

    const { error: updateError } = await service
      .from("reviews")
      .update({
        ai_generated_reply: generatedReply,
        ai_generated_at: new Date().toISOString(),
        ai_model_used: "claude-sonnet-4-6",
        reply_state: "generated",
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("[generate-reply-internal] Update failed:", reviewId, updateError);
      await service
        .from("reviews")
        .update({ reply_state: "failed", updated_at: new Date().toISOString() })
        .eq("id", reviewId)
        .eq("user_id", userId);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    console.log(`[generate-reply-internal] Done for review ${reviewId}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[generate-reply-internal] Claude error for review", reviewId, err);
    await service
      .from("reviews")
      .update({ reply_state: "failed", updated_at: new Date().toISOString() })
      .eq("id", reviewId)
      .eq("user_id", userId);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
