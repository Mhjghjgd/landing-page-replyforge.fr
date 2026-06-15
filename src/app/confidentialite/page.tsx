import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment ReplyForge collecte, utilise et protège vos données personnelles dans le respect du RGPD.",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="RGPD"
        title="Politique de confidentialité"
        subtitle="Comment nous traitons vos données. En clair, sans jargon."
      />
      <section className="py-20 lg:py-28">
        <Container size="narrow">
          <Prose>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>

            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données collectées sur{" "}
              <strong>{siteConfig.url}</strong> est {siteConfig.name}. Pour toute
              question :{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>

            <h2>2. Données collectées</h2>
            <p>
              Nous collectons uniquement les données strictement nécessaires :
            </p>
            <ul>
              <li>
                <strong>Formulaire de prise de RDV (Calendly) :</strong> nom,
                email, nom de l&apos;établissement, informations partagées
                volontairement lors de la prise de rendez-vous.
              </li>
              <li>
                <strong>Email direct :</strong> contenu du message,
                coordonnées partagées.
              </li>
              <li>
                <strong>Données techniques :</strong> données de navigation
                anonymisées (pages vues, durée), via un analytics respectueux du
                RGPD.
              </li>
            </ul>

            <h2>3. Finalités</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Organiser et préparer notre rendez-vous</li>
              <li>Répondre à vos demandes</li>
              <li>Vous adresser des informations commerciales si vous y avez consenti</li>
              <li>Améliorer la qualité du site et des services</li>
            </ul>

            <h2>4. Base légale</h2>
            <p>
              Le traitement repose sur votre consentement explicite (prise de
              rendez-vous, contact volontaire) et sur notre intérêt légitime à
              répondre à vos demandes.
            </p>

            <h2>5. Durée de conservation</h2>
            <ul>
              <li>
                <strong>Prospects :</strong> 3 ans à compter du dernier contact.
              </li>
              <li>
                <strong>Clients :</strong> durée de la relation contractuelle +
                10 ans (obligations comptables).
              </li>
              <li>
                <strong>Données de navigation anonymisées :</strong> 13 mois
                maximum.
              </li>
            </ul>

            <h2>6. Destinataires</h2>
            <p>
              Vos données ne sont ni vendues, ni louées, ni transmises à des
              tiers à des fins commerciales. Elles peuvent être partagées avec
              nos sous-traitants techniques (hébergement, emailing, planning)
              dans un cadre strictement nécessaire à la prestation, sous
              contrats encadrés par les exigences RGPD.
            </p>
            <p>Sous-traitants principaux :</p>
            <ul>
              <li>Vercel (hébergement) — États-Unis avec garanties contractuelles</li>
              <li>Calendly (prise de rendez-vous) — États-Unis avec garanties contractuelles</li>
            </ul>

            <h2>7. Vos droits</h2>
            <p>
              Conformément au RGPD et à la loi Informatique et Libertés, vous
              disposez d&apos;un droit d&apos;accès, de rectification,
              d&apos;effacement, de limitation, d&apos;opposition et de
              portabilité de vos données. Vous pouvez exercer ces droits à tout
              moment en écrivant à{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
            <p>
              Vous avez également la possibilité d&apos;introduire une
              réclamation auprès de la CNIL :{" "}
              <a
                href="https://www.cnil.fr/fr/plaintes"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.cnil.fr/fr/plaintes
              </a>
              .
            </p>

            <h2>8. Cookies</h2>
            <p>
              Le site utilise uniquement les cookies strictement nécessaires à
              son fonctionnement. Aucun cookie publicitaire ni de traçage
              cross-site n&apos;est déposé sans votre consentement explicite. Le
              cas échéant, vous pouvez les refuser depuis votre navigateur.
            </p>

            <h2>9. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées (HTTPS, accès restreints, sauvegardes chiffrées) pour
              protéger vos données contre tout accès non autorisé, perte ou
              destruction.
            </p>

            <h2>10. Modifications</h2>
            <p>
              Cette politique peut être mise à jour. La dernière version fait
              foi et est toujours disponible à cette adresse.
            </p>

            <p className="text-sm italic text-[var(--color-pearl-400)] mt-10">
              Modèle conforme RGPD à adapter selon les outils réellement
              utilisés (analytics, CRM, emailing) et l&apos;identité juridique de
              l&apos;éditeur.
            </p>
          </Prose>
        </Container>
      </section>
    </>
  );
}
