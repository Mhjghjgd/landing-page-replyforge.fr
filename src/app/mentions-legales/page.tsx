import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site replyforge.fr — éditeur, hébergeur, nom de domaine, propriété intellectuelle.",
  robots: { index: false, follow: true },
};

export default function MentionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Légal"
        title="Mentions légales"
        subtitle="Informations légales conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN)."
      />
      <section className="py-20 lg:py-28">
        <Container size="narrow">
          <Prose>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>

            <h2>1. Éditeur du site</h2>
            <p>
              Le site <strong>replyforge.fr</strong> est édité par :
            </p>
            <ul>
              <li>
                <strong>Nom commercial :</strong> ReplyForge
              </li>
              <li>
                <strong>Exploitant :</strong> Mohamed Dekoumi, entrepreneur
                individuel
              </li>
              <li>
                <strong>SIRET :</strong> en cours d&apos;immatriculation
              </li>
              <li>
                <strong>Email :</strong>{" "}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
            </ul>

            <h2>2. Directeur de la publication</h2>
            <p>Mohamed Dekoumi</p>

            <h2>3. Hébergeur du site vitrine</h2>
            <p>
              Le site <strong>replyforge.fr</strong> est hébergé par{" "}
              <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA
              91789, États-Unis —{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                vercel.com
              </a>
              .
            </p>
            <p>
              L&apos;application client <strong>app.replyforge.fr</strong> est
              exploitée sur la plateforme ReviewBounce (marque blanche). Son
              hébergement est assuré par les infrastructures de ce fournisseur.
            </p>

            <h2>4. Nom de domaine</h2>
            <p>
              Le nom de domaine <strong>replyforge.fr</strong> est enregistré
              auprès de <strong>OVH SAS</strong>, 2 rue Kellermann, 59100
              Roubaix, France —{" "}
              <a
                href="https://www.ovh.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                ovh.com
              </a>
              .
            </p>

            <h2>5. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des éléments constituant le site{" "}
              <strong>replyforge.fr</strong> (textes, structure, identité
              visuelle, logotypes, données) est la propriété exclusive de
              ReplyForge, sauf mentions contraires explicites. Toute
              reproduction, représentation, modification, publication ou
              adaptation, totale ou partielle, par quelque procédé que ce soit,
              est interdite sans autorisation écrite préalable de l&apos;éditeur.
            </p>

            <h2>6. Liens hypertextes</h2>
            <p>
              Le site peut contenir des liens vers des sites tiers. ReplyForge
              n&apos;exerce aucun contrôle sur ces sites et décline toute
              responsabilité quant à leur contenu ou leur disponibilité. La
              mise en place d&apos;un lien vers replyforge.fr est soumise à
              l&apos;accord préalable de l&apos;éditeur.
            </p>

            <h2>7. Limitation de responsabilité</h2>
            <p>
              ReplyForge s&apos;efforce d&apos;assurer l&apos;exactitude et la
              mise à jour des informations publiées sur ce site vitrine.
              Toutefois, l&apos;éditeur ne saurait être tenu responsable des
              omissions, inexactitudes ou carences dans la mise à jour, qu&apos;elles
              soient de son fait ou du fait de tiers partenaires. Les
              informations présentes sur ce site sont données à titre indicatif
              et peuvent évoluer à tout moment.
            </p>

            <h2>8. Données personnelles</h2>
            <p>
              Ce site vitrine ne collecte pas de données personnelles par des
              formulaires actifs. Les données transmises volontairement via
              Calendly (prise de rendez-vous) sont traitées conformément à notre{" "}
              <a href="/confidentialite">politique de confidentialité</a>. Les
              conditions de traitement des données dans le cadre de
              l&apos;utilisation du Service ReplyForge sont détaillées dans les{" "}
              <a href="/cgv">Conditions Générales de Vente</a>.
            </p>

            <h2>9. Cookies</h2>
            <p>
              Ce site vitrine n&apos;utilise pas de cookies de tracking,
              publicitaires ou analytiques. Seuls des cookies techniques
              strictement nécessaires au fonctionnement du site peuvent être
              déposés. Aucun consentement préalable n&apos;est requis pour ces
              cookies.
            </p>

            <h2>10. Droit applicable et juridiction</h2>
            <p>
              Les présentes mentions légales sont régies par le droit français.
              En cas de litige relatif à l&apos;interprétation ou à
              l&apos;exécution des présentes, et à défaut de résolution
              amiable, les tribunaux français seront seuls compétents.
            </p>
          </Prose>
        </Container>
      </section>
    </>
  );
}
