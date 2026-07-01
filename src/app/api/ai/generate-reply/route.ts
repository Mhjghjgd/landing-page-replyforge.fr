import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { zernio } from "@/lib/zernio";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[generate-reply] Unauthorized — no session");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { reviewId, force } = body as { reviewId: string; force?: boolean };

  if (!reviewId) {
    return NextResponse.json({ error: "Missing reviewId" }, { status: 400 });
  }

  const service = createServiceClient();

  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("id, zernio_review_id, rating, review_text, review_language, reply_state, ai_generated_reply")
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .single();

  if (reviewError || !review) {
    console.error("[generate-reply] Review not found:", reviewId, reviewError);
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (review.ai_generated_reply && !force) {
    console.log("[generate-reply] Already generated for", reviewId, "— returning cached");
    return NextResponse.json({
      success: true,
      reply: review.ai_generated_reply,
      published: review.reply_state === "published" || review.reply_state === "edited",
    });
  }

  console.log("[generate-reply] Starting generation for review", reviewId, "force:", !!force);

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const [{ data: profile }, { data: connection }] = await Promise.all([
    supabase
      .from("tone_profiles")
      .select("positioning, tone_level, response_length, signature, strengths, sensitive_topics")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("zernio_connections")
      .select("business_name, zernio_account_id")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

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
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: userMessage }],
      system: systemPrompt,
    });

    const content = message.content[0];
    const generatedReply = content.type === "text" ? content.text.trim() : "";

    // Save the generated reply first
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
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[generate-reply] DB save failed for", reviewId, updateError);
      await service
        .from("reviews")
        .update({ reply_state: "failed", updated_at: new Date().toISOString() })
        .eq("id", reviewId)
        .eq("user_id", user.id);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    console.log("[generate-reply] AI reply saved for review", reviewId);

    // Auto-publish to Google via Zernio
    let published = false;
    const accountId = connection?.zernio_account_id;
    const zernioReviewId = review.zernio_review_id;

    if (accountId && zernioReviewId) {
      try {
        const publishResult = await zernio.publishReviewReply(accountId, zernioReviewId, generatedReply);
        console.log("[generate-reply] Zernio publish result:", JSON.stringify(publishResult));

        await service
          .from("reviews")
          .update({
            reply_text: generatedReply,
            reply_state: "published",
            reply_published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", reviewId)
          .eq("user_id", user.id);

        published = true;
        console.log("[generate-reply] Published to Google for review", reviewId);
      } catch (publishErr) {
        console.error("[generate-reply] Zernio publish failed for", reviewId, publishErr);
        // Keep reply_state = 'generated' — reply saved in DB but not on Google yet
      }
    } else {
      console.warn("[generate-reply] Cannot publish — missing accountId:", accountId, "or zernio_review_id:", zernioReviewId);
    }

    return NextResponse.json({ success: true, reply: generatedReply, published });
  } catch (err) {
    console.error("[generate-reply] Claude API error for review", reviewId, err);
    await service
      .from("reviews")
      .update({ reply_state: "failed", updated_at: new Date().toISOString() })
      .eq("id", reviewId)
      .eq("user_id", user.id);
    return NextResponse.json({ error: "Génération échouée" }, { status: 500 });
  }
}
