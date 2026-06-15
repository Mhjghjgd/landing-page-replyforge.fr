import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site replyforge.fr — éditeur, hébergement, propriété intellectuelle.",
  robots: { index: false, follow: true },
};

export default function MentionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Légal"
        title="Mentions légales"
        subtitle="Informations légales conformément à la loi pour la confiance dans l'économie numérique (LCEN)."
      />
      <section className="py-20 lg:py-28">
        <Container size="narrow">
          <Prose>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>

            <h2>Éditeur du site</h2>
            <p>
              Le site <strong>{siteConfig.url}</strong> est édité par{" "}
              <strong>{siteConfig.name}</strong>.
            </p>
            <ul>
              <li>
                <strong>Forme juridique :</strong> [À compléter — SAS, SARL,
                EI…]
              </li>
              <li>
                <strong>Siège social :</strong> [À compléter — adresse postale]
              </li>
              <li>
                <strong>Capital social :</strong> [À compléter]
              </li>
              <li>
                <strong>RCS :</strong> [À compléter — ville et numéro]
              </li>
              <li>
                <strong>SIRET :</strong> [À compléter]
              </li>
              <li>
                <strong>TVA intracommunautaire :</strong> [À compléter]
              </li>
              <li>
                <strong>Directeur de la publication :</strong> [À compléter]
              </li>
              <li>
                <strong>Contact :</strong>{" "}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
            </ul>

            <h2>Hébergeur</h2>
            <p>
              Le site est hébergé par{" "}
              <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA
              91789, USA — <a href="https://vercel.com">vercel.com</a>.
            </p>

            <h2>Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu du site (textes, identité visuelle,
              illustrations, photographies, logos, données et structure) est la
              propriété exclusive de {siteConfig.name}, sauf mentions contraires
              explicites. Toute reproduction, représentation, modification,
              publication ou adaptation, totale ou partielle, par quelque procédé
              que ce soit, est interdite sans autorisation écrite préalable.
            </p>

            <h2>Liens hypertextes</h2>
            <p>
              Les liens hypertextes mis en place dans le cadre du présent site en
              direction d&apos;autres ressources présentes sur le réseau Internet
              ne sauraient engager la responsabilité de {siteConfig.name}.
            </p>

            <h2>Responsabilité</h2>
            <p>
              {siteConfig.name} s&apos;efforce d&apos;assurer au mieux de ses
              possibilités l&apos;exactitude et la mise à jour des informations
              diffusées sur ce site. Toutefois, {siteConfig.name} ne peut
              garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des
              informations mises à disposition.
            </p>

            <h2>Droit applicable</h2>
            <p>
              Le présent site et ses mentions légales sont régis par le droit
              français. En cas de litige, les tribunaux français seront seuls
              compétents.
            </p>

            <p className="text-sm italic text-[var(--color-pearl-400)] mt-10">
              Modèle générique à adapter aux informations légales réelles de la
              société.
            </p>
          </Prose>
        </Container>
      </section>
    </>
  );
}
