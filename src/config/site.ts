export const siteConfig = {
  name: "ReplyForge",
  url: "https://replyforge.fr",
  description:
    "ReplyForge répond automatiquement à chaque avis Google de votre hôtel. Notre IA personnalise chaque réponse pour fidéliser vos clients et faire remonter votre fiche dans les résultats locaux.",
  tagline: "Répondez à 100% de vos avis Google — automatiquement.",
  email: "contact@replyforge.fr",
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/replyforge/demo",
  pricing: {
    oneShot: {
      label: "Démarrage",
      price: "150€",
      cadence: "une seule fois",
      promise: "Nous répondons à tous vos avis Google déjà publiés.",
    },
    subscription: {
      label: "Continu",
      price: "69€",
      cadence: "par mois",
      promise: "Réponses automatiques à chaque nouvel avis, en continu.",
    },
  },
  social: {
    linkedin: "https://www.linkedin.com/company/replyforge",
  },
  nav: [
    { label: "Accueil", href: "/" },
    { label: "Méthode", href: "/methode" },
    { label: "Résultats", href: "/resultats" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Confidentialité", href: "/confidentialite" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
