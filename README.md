# ReplyForge — Landing Page

Site officiel de **ReplyForge**, agence SEO spécialisée hôtellerie.
Domaine de production : [replyforge.fr](https://replyforge.fr)

> Plus de réservations directes. Moins de Booking.

---

## Stack

- **Next.js 16** (App Router, React Server Components)
- **Tailwind CSS v4** avec design tokens custom
- **Framer Motion** pour les animations d'entrée et l'accordéon FAQ
- **TypeScript** strict
- **Lucide React** pour les icônes
- Optimisé pour **Vercel** (build statique, ISR ready)

---

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Copier les variables d'environnement
cp .env.example .env.local

# 3. Lancer le serveur de dev
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

| Variable                   | Description                                                | Exemple                                                |
| -------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_CALENDLY_URL` | URL Calendly de la prise de RDV (page `/contact`)          | `https://calendly.com/replyforge/audit-seo-hotelier`   |

Ces variables sont publiques (préfixe `NEXT_PUBLIC_`), donc visibles côté client : ne mettre que des liens publics, jamais de secrets.

---

## Structure du repo

```
src/
├── app/                       # Routes Next.js (App Router)
│   ├── page.tsx               # Landing (Home)
│   ├── methode/page.tsx       # Méthode SEO en 6 phases
│   ├── resultats/page.tsx     # Cas clients (placeholders)
│   ├── contact/page.tsx       # Calendly embedded
│   ├── mentions-legales/      # Légal
│   ├── confidentialite/       # Légal RGPD
│   ├── layout.tsx             # Layout racine (fonts, SEO, schema.org)
│   ├── globals.css            # Design tokens & utilities
│   ├── sitemap.ts             # Sitemap dynamique
│   ├── robots.ts              # robots.txt
│   ├── opengraph-image.tsx    # OG image générée
│   └── not-found.tsx          # Page 404
├── components/
│   ├── layout/                # Navbar, Footer, Logo
│   ├── sections/              # Sections de la home (Hero, Problem, …)
│   └── ui/                    # Primitives (Button, Container, Reveal, …)
├── config/
│   └── site.ts                # Config globale (nav, liens, emails)
└── lib/
    └── utils.ts               # cn() helper
```

---

## Design system

Les tokens vivent dans `src/app/globals.css` sous `@theme`. Trois familles :

- **`--color-ink-*`** — surfaces sombres (navy)
- **`--color-gold-*`** — accent or hôtelier
- **`--color-pearl-*`** — typographie

Typographie :

- **Playfair Display** pour les titres (`font-display`)
- **Inter** pour le corps de texte (`font-sans`)
- **JetBrains Mono** pour les chiffres et eyebrows (`font-mono`)

---

## Personnalisation rapide

| Quoi                  | Où                                                       |
| --------------------- | -------------------------------------------------------- |
| Email, URLs sociales  | `src/config/site.ts`                                     |
| Couleurs / typo       | `src/app/globals.css` (`@theme`)                         |
| Cas clients           | `src/app/resultats/page.tsx` — array `cases`             |
| Témoignages           | `src/components/sections/proof.tsx` — `testimonials`     |
| Stats moyennes        | `src/components/sections/proof.tsx` — `stats`            |
| FAQ                   | `src/components/sections/faq.tsx` — array `faqs`         |
| Phases méthode        | `src/app/methode/page.tsx` — array `phases`              |
| Lien Calendly         | `.env.local` → `NEXT_PUBLIC_CALENDLY_URL`                |

---

## Déploiement Vercel

1. Connectez ce repo GitHub à Vercel.
2. Dans **Project Settings → Environment Variables**, ajoutez :
   - `NEXT_PUBLIC_CALENDLY_URL` = votre lien Calendly réel
3. Déployez. Le `next.config.ts` n'a besoin d'aucune adaptation supplémentaire.
4. Pointez le domaine `replyforge.fr` (et son `www`) vers Vercel.

---

## Performance & SEO

- Toutes les pages sont **statiques (SSG)** — chargement instantané
- **Open Graph image** générée dynamiquement (`/opengraph-image`)
- **JSON-LD** `ProfessionalService` injecté dans le layout
- **Sitemap** et **robots.txt** générés par Next.js
- Animations désactivées si `prefers-reduced-motion`
- Polices chargées avec `next/font` (zero CLS, swap fallback)

Lighthouse cible : **95+** sur tous les axes.

---

## Build & vérifications

```bash
npm run build          # Build de production
npx tsc --noEmit       # Vérification TypeScript
```

---

## TODO côté contenu (à remplir)

- [ ] Remplacer les **placeholders** des cas clients dans `src/app/resultats/page.tsx` par les vrais hôtels (avec autorisation).
- [ ] Remplir les blocs `[À compléter]` des `mentions-legales` avec les vraies informations de la société.
- [ ] Créer et publier le lien **Calendly** réel, puis le mettre dans `.env.local` et dans Vercel.
- [ ] Compléter le LinkedIn de l'agence dans `src/config/site.ts`.
- [ ] Optionnel : remplacer le favicon par défaut par celui de la marque (`src/app/favicon.ico`).

---

## Licence

Propriétaire — © ReplyForge.
