import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import Anthropic from "@anthropic-ai/sdk";

function getScheduledPublishTime(): Date {
  const now = new Date();
  // Determine Paris local hour
  const parisHour = parseInt(
    new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }))
      .toLocaleString("en-US", { hour: "numeric", hour12: false }),
    10
  );

  if (parisHour >= 8 && parisHour < 20) {
    // Business hours: random delay 90 min – 4 h
    const minMs = 90 * 60 * 1000;
    const maxMs = 4 * 60 * 60 * 1000;
    return new Date(now.getTime() + minMs + Math.random() * (maxMs - minMs));
  }

  // Off-hours: schedule for tomorrow between 08:30 and 10:00 Paris time
  // Paris is UTC+1 in winter (CET) or UTC+2 in summer (CEST).
  // UTC 06:30-08:00 ≈ Paris 08:30-10:00 (CET); adjust by using a safe UTC window of 07:00-08:30.
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  // Paris 08:30–10:00 in UTC is roughly 06:30–08:00 (CET) or 05:30–07:00 (CEST).
  // Use 07:00–08:30 UTC as a conservative overlap that stays in-range for both offsets.
  const minuteOffset = Math.floor(Math.random() * 90); // 0–89 min within the 90-min window
  tomorrow.setUTCHours(7, minuteOffset, 0, 0);
  return tomorrow;
}

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

    // Schedule the reply for anti-detection delayed publishing
    const scheduledAt = getScheduledPublishTime();

    const { error: updateError } = await service
      .from("reviews")
      .update({
        ai_generated_reply: generatedReply,
        ai_generated_at: new Date().toISOString(),
        ai_model_used: "claude-sonnet-4-6",
        reply_state: "scheduled",
        scheduled_publish_at: scheduledAt.toISOString(),
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

    console.log("[generate-reply] Reply scheduled for review", reviewId, "at", scheduledAt.toISOString());

    return NextResponse.json({ success: true, reply: generatedReply, scheduled: true, scheduledAt: scheduledAt.toISOString() });
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
