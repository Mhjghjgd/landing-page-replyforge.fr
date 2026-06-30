interface BuildPromptInput {
  reviewText: string | null;
  rating: number;
  authorName: string | null;
  reviewLanguage: string | null;
  tone: {
    positioning: string;
    toneLevel: number;
    length: "courte" | "moyenne" | "longue";
    signature: string | null;
  };
  businessName: string;
}

export function buildReplyPrompt(input: BuildPromptInput): { system: string; user: string } {
  const lengthMap = {
    courte: "2 à 3 phrases courtes",
    moyenne: "3 à 4 phrases équilibrées",
    longue: "4 à 6 phrases développées",
  };

  const positioningMap: Record<string, string> = {
    luxe: "un hôtel 5 étoiles haut de gamme",
    boutique: "un boutique-hôtel raffiné",
    charme: "un hôtel de charme",
    familial: "un hôtel familial chaleureux",
    business: "un hôtel business orienté efficacité",
    economique: "un hôtel économique accessible",
    bnb: "un B&B / maison d'hôtes",
  };

  const toneDescription =
    input.tone.toneLevel <= 3
      ? "très formel et institutionnel"
      : input.tone.toneLevel <= 6
        ? "professionnel mais accessible"
        : input.tone.toneLevel <= 8
          ? "chaleureux et humain"
          : "très chaleureux, presque personnel";

  const ratingTone =
    input.rating >= 4
      ? "L'avis est positif. Remercie sincèrement, sans en faire trop. Rebondis sur un élément spécifique mentionné si possible."
      : input.rating === 3
        ? "L'avis est mitigé. Accueille les retours positifs, traite les négatifs avec humilité et propose d'échanger si pertinent."
        : "L'avis est négatif. Reste digne et professionnel. Présente des excuses sincères sans être servile. Propose un contact direct pour résoudre. Ne sois jamais sur la défensive.";

  const language = input.reviewLanguage === "en" ? "anglais" : "français";

  const system = `Tu rédiges la réponse officielle d'un hôtelier à un avis Google. Tu écris au nom de ${input.businessName}, ${positioningMap[input.tone.positioning] ?? "un établissement hôtelier"}.

TON :
- Style ${toneDescription}
- Longueur : ${lengthMap[input.tone.length]}
- Langue : ${language}

RÈGLES ABSOLUES :
- Jamais de formules cliché type "votre avis nous tient à cœur" ou "nous prenons note"
- Jamais de listes ou puces
- Jamais de promesses vagues ("nous allons faire mieux")
- Adresse l'auteur par son prénom si disponible, sinon "Madame, Monsieur"
- Pas d'émojis sauf si l'avis lui-même en contient
- Termine par la signature : "${input.tone.signature ?? ""}" (si non vide, sur une nouvelle ligne séparée)
- Réponse directe, prête à publier. PAS de "Voici une réponse :" ou autre préambule.

${ratingTone}`;

  const user = `Avis Google (${input.rating}/5 étoiles) de ${input.authorName ?? "Anonyme"} :

"${input.reviewText ?? "(L'auteur n'a laissé que la note, pas de texte)"}"

Rédige la réponse maintenant.`;

  return { system, user };
}
