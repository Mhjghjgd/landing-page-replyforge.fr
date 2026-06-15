export const siteConfig = {
  name: "ReplyForge",
  url: "https://replyforge.fr",
  description:
    "Agence SEO spécialisée hôtellerie. Nous aidons les hôtels indépendants à grimper dans Google, capter plus de réservations directes et réduire leur dépendance aux OTA.",
  tagline: "Plus de réservations directes. Moins de Booking.",
  email: "contact@replyforge.fr",
  // Lien Calendly : à remplacer par votre vrai lien
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/replyforge/audit-seo-hotelier",
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
