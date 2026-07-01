export const siteConfig = {
  name: "ReplyForge",
  url: "https://replyforge.fr",
  description:
    "ReplyForge répond automatiquement à chaque avis Google de votre hôtel. Notre IA personnalise chaque réponse pour fidéliser vos clients et faire remonter votre fiche dans les résultats locaux.",
  tagline: "Répondez à 100% de vos avis Google — automatiquement.",
  email: "mohamed@replyforge.fr",
  pricing: {
    subscription: {
      label: "Continu",
      price: "229€",
      cadence: "par mois",
      promise: "Réponses automatiques à chaque nouvel avis, en continu.",
    },
  },
  nav: [
    { label: "Accueil", href: "/" },
    { label: "Méthode", href: "/methode" },
    { label: "Résultats", href: "/resultats" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "CGV", href: "/cgv" },
    { label: "Confidentialité", href: "/confidentialite" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
