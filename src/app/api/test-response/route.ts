import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SAMPLE_REVIEWS: Record<string, { rating: number; text: string }> = {
  "5": {
    rating: 5,
    text: "Séjour absolument parfait ! La chambre était magnifique avec une vue imprenable. Le personnel aux petits soins, le petit-déjeuner copieux et délicieux. On reviendra sans hésiter !",
  },
  "3": {
    rating: 3,
    text: "Hôtel correct dans l'ensemble. La chambre était propre mais un peu bruyante côté rue. Le petit-déjeuner était bien mais le wifi manquait de stabilité. Le personnel était sympa.",
  },
  "1": {
    rating: 1,
    text: "Très déçu de notre séjour. La chambre ne correspondait pas aux photos, la climatisation ne fonctionnait pas et personne à la réception pour nous aider. Je ne recommande pas.",
  },
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    hotelName,
    positioning,
    toneLevel,
    responseLength,
    signature,
    strengths,
    sensitiveTopics,
    reviewRating,
  } = body;

  const review = SAMPLE_REVIEWS[String(reviewRating)] ?? SAMPLE_REVIEWS["5"];

  const lengthInstruction =
    responseLength === "short"
      ? "2-3 phrases courtes"
      : responseLength === "long"
        ? "4-6 phrases détaillées"
        : "3-4 phrases équilibrées";

  const systemPrompt = `Tu es l'assistant de réponse aux avis Google de ${hotelName || "cet hôtel"}, un hôtel ${positioning || "de charme"}.

PROFIL DE RÉPONSE :
- Niveau de ton : ${toneLevel}/10 (1=très formel et professionnel, 10=très chaleureux et familier)
- Longueur cible : ${lengthInstruction}
- Signature : "${signature || "L'équipe"}"
- Points forts à valoriser : ${strengths?.length ? strengths.join(", ") : "aucun spécifié"}
- Sujets à esquiver : ${sensitiveTopics?.length ? sensitiveTopics.join(", ") : "aucun"}

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

  const userMessage = `Avis ${review.rating}★ :\n"${review.text}"\n\nGénère la réponse de l'hôtelier.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 400,
    messages: [{ role: "user", content: userMessage }],
    system: systemPrompt,
  });

  const content = message.content[0];
  const responseText = content.type === "text" ? content.text : "";

  return NextResponse.json({
    response: responseText,
    review: { rating: review.rating, text: review.text },
  });
}
