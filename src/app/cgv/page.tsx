import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description:
    "Conditions Générales de Vente du service ReplyForge — abonnement, tarifs, résiliation, données personnelles et RGPD.",
  robots: { index: false, follow: true },
};

export default function CGVPage() {
  return (
    <>
      <PageHeader
        eyebrow="Légal"
        title="Conditions Générales de Vente"
        subtitle="CGV applicables à l'abonnement au service ReplyForge."
      />
      <section className="py-20 lg:py-28">
        <Container size="narrow">
          <Prose>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-pearl-500)]">
              Date d&apos;entrée en vigueur :{" "}
              {new Date().toLocaleDateString("fr-FR")}
            </p>

            <h2>1. Préambule et définitions</h2>
            <p>
              Les présentes Conditions Générales de Vente (ci-après «{" "}
              <strong>CGV</strong> ») régissent les relations contractuelles
              entre :
            </p>
            <ul>
              <li>
                <strong>L&apos;Éditeur :</strong> ReplyForge, nom commercial
                exploité par Mohamed Dekoumi, entrepreneur individuel —{" "}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> (
                ci-après « <strong>ReplyForge</strong> » ou «{" "}
                <strong>l&apos;Éditeur</strong> »).
              </li>
              <li>
                <strong>Le Client :</strong> toute personne morale ou physique
                agissant à titre professionnel qui souscrit un abonnement au
                Service (ci-après « <strong>le Client</strong> »).
              </li>
            </ul>
            <p>
              Les présentes CGV sont réservées à un usage{" "}
              <strong>professionnel exclusivement (B2B)</strong>. Elles ne
              s&apos;appliquent pas aux consommateurs au sens du Code de la
              consommation.
            </p>
            <p>Définitions complémentaires :</p>
            <ul>
              <li>
                <strong>Service :</strong> la plateforme ReplyForge accessible
                sur <em>app.replyforge.fr</em>, permettant la génération et la
                publication automatisées de réponses aux avis Google du Client.
              </li>
              <li>
                <strong>Abonnement :</strong> l&apos;accès mensuel récurrent au
                Service, souscrit via la page de paiement sécurisée.
              </li>
              <li>
                <strong>Fiche Google :</strong> le profil Google Business
                Profile du Client sur lequel le Service opère.
              </li>
            </ul>

            <h2>2. Objet</h2>
            <p>
              Les présentes CGV ont pour objet de définir les conditions dans
              lesquelles le Client accède et utilise le Service ReplyForge, ainsi
              que les droits et obligations respectifs des parties.
            </p>

            <h2>3. Description du Service</h2>
            <p>Le Service ReplyForge comprend :</p>
            <ul>
              <li>
                <strong>Réponse automatisée aux avis Google :</strong> détection
                des nouveaux avis publiés sur la Fiche Google du Client,
                génération d&apos;une réponse personnalisée par outil de
                rédaction assisté, et publication automatique ou soumission à
                validation selon la configuration choisie.
              </li>
              <li>
                <strong>Calibration sur-mesure du ton :</strong> paramétrage
                initial du style éditorial, du vocabulaire et de la signature
                propres à l&apos;établissement du Client.
              </li>
              <li>
                <strong>Dashboard de suivi :</strong> accès à un tableau de bord
                récapitulant les avis traités, les réponses publiées et
                l&apos;évolution de la note Google.
              </li>
              <li>
                <strong>Rattrapage initial des avis historiques :</strong> à la
                souscription, traitement des avis Google déjà publiés et sans
                réponse, inclus dans l&apos;abonnement.
              </li>
              <li>
                <strong>Support par email :</strong> assistance par email à{" "}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>,
                avec un délai de réponse cible de 48 heures ouvrées.
              </li>
            </ul>
            <p>
              Le Service est fourni sur la base de la plateforme ReviewBounce
              (marque blanche). L&apos;Éditeur se réserve le droit de faire
              évoluer les fonctionnalités du Service.
            </p>

            <h2>4. Souscription et accès au Service</h2>
            <p>
              La souscription s&apos;effectue en ligne via la page de commande
              sécurisée du site. Elle implique l&apos;acceptation pleine et
              entière des présentes CGV. L&apos;accès au Service est activé dans
              les 24 heures ouvrées suivant la confirmation du premier paiement.
            </p>
            <p>
              Le Client s&apos;engage à fournir des informations exactes lors de
              la souscription et à maintenir leur exactitude pendant toute la
              durée de l&apos;abonnement.
            </p>

            <h2>5. Tarifs</h2>
            <p>
              L&apos;abonnement au Service est facturé{" "}
              <strong>89 € TTC par mois</strong>.
            </p>
            <p>
              TVA : en application de l&apos;article 293 B du Code général des
              impôts, l&apos;Éditeur bénéficie du régime de franchise en base de
              TVA — la TVA n&apos;est donc pas applicable et n&apos;est pas
              facturée tant que ce régime est en vigueur. Dans le cas où
              l&apos;Éditeur deviendrait assujetti à la TVA, le prix sera ajusté
              en conséquence et le Client en sera informé dans les conditions
              prévues à l&apos;article 13 des présentes.
            </p>
            <p>
              Les tarifs sont susceptibles d&apos;évoluer. Toute modification
              tarifaire sera notifiée au Client conformément à l&apos;article 13.
            </p>

            <h2>6. Modalités de paiement</h2>
            <p>
              Le paiement est effectué par prélèvement mensuel automatique via{" "}
              <strong>Stripe</strong>, prestataire de paiement sécurisé. Le
              premier prélèvement intervient à la date de souscription. Les
              prélèvements suivants interviennent chaque mois à la même date.
            </p>
            <p>
              En cas d&apos;échec de prélèvement, ReplyForge se réserve le droit
              de suspendre l&apos;accès au Service jusqu&apos;à régularisation.
            </p>

            <h2>7. Durée et résiliation</h2>
            <p>
              L&apos;abonnement est conclu pour une durée mensuelle renouvelée
              automatiquement par tacite reconduction, sans engagement de durée
              minimale.
            </p>
            <p>
              Le Client peut résilier son abonnement à tout moment depuis son
              tableau de bord client ou par email à{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. La
              résiliation prend effet à la fin du mois en cours ; le Client
              conserve l&apos;accès au Service jusqu&apos;à cette date.
            </p>
            <p>
              Aucun remboursement au prorata ne sera effectué pour la période
              restante du mois en cours.
            </p>
            <p>
              ReplyForge se réserve le droit de résilier l&apos;abonnement en
              cas de manquement grave du Client à ses obligations, après mise en
              demeure restée sans effet sous 7 jours.
            </p>

            <h2>8. Obligations du Client</h2>
            <p>Le Client s&apos;engage à :</p>
            <ul>
              <li>
                Fournir un accès valide à son Google Business Profile et
                maintenir cet accès pendant toute la durée de
                l&apos;abonnement ;
              </li>
              <li>
                Garantir l&apos;exactitude des informations transmises à
                ReplyForge ;
              </li>
              <li>
                Utiliser le Service conformément à la loi applicable et aux
                présentes CGV ;
              </li>
              <li>
                Ne pas tenter de contourner, perturber ou altérer le
                fonctionnement du Service ;
              </li>
              <li>
                S&apos;assurer que les réponses publiées via le Service
                respectent les règles d&apos;utilisation de Google Business
                Profile.
              </li>
            </ul>

            <h2>9. Obligations de l&apos;Éditeur</h2>
            <p>ReplyForge s&apos;engage à :</p>
            <ul>
              <li>
                Mettre le Service à disposition avec une disponibilité
                raisonnable (<em>best effort</em>) — aucun engagement de niveau
                de service (SLA) contractuel n&apos;est garanti à ce stade ;
              </li>
              <li>
                Traiter avec confidentialité les données et informations du
                Client ;
              </li>
              <li>
                Répondre aux demandes de support par email sous 48 heures
                ouvrées ;
              </li>
              <li>
                Notifier le Client de toute interruption planifiée significative
                du Service avec un préavis raisonnable.
              </li>
            </ul>

            <h2>10. Propriété intellectuelle</h2>
            <p>
              Le Client conserve la pleine propriété de ses données (avis Google
              reçus, réponses publiées, informations de sa Fiche Google). Ces
              données ne sont utilisées par ReplyForge que pour les finalités
              décrites aux présentes CGV.
            </p>
            <p>
              ReplyForge conserve la propriété exclusive de l&apos;outil, de son
              algorithme, de son interface et de tous les éléments constitutifs
              du Service. Aucune licence autre que celle strictement nécessaire à
              l&apos;utilisation du Service n&apos;est concédée au Client.
            </p>

            <h2>11. Données personnelles et RGPD</h2>
            <p>
              Dans le cadre de l&apos;exécution du Service, ReplyForge agit en
              qualité de <strong>sous-traitant</strong> au sens de l&apos;article
              28 du Règlement (UE) 2016/679 (RGPD), pour le compte du Client qui
              agit en qualité de responsable de traitement.
            </p>
            <p>
              <strong>Finalité du traitement :</strong> génération et publication
              de réponses aux avis Google du Client.
            </p>
            <p>
              <strong>Données traitées :</strong> contenu des avis Google
              (données publiques), accès technique à la Fiche Google Business
              Profile du Client, informations de compte Client (nom, email,
              établissement).
            </p>
            <p>
              <strong>Durée de conservation :</strong> pendant toute la durée de
              l&apos;abonnement, puis 30 jours après la résiliation (délai de
              grâce pour export éventuel). Les données de facturation sont
              conservées 10 ans conformément aux obligations comptables légales.
            </p>
            <p>
              <strong>Droits :</strong> le Client et ses utilisateurs finaux
              disposent d&apos;un droit d&apos;accès, de rectification,
              d&apos;effacement, de limitation et de portabilité de leurs données
              personnelles. Ces droits peuvent être exercés à l&apos;adresse :{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
            <p>
              <strong>Sous-traitants ultérieurs :</strong> ReplyForge fait appel
              aux sous-traitants suivants pour l&apos;exécution du Service :
            </p>
            <ul>
              <li>
                <strong>Stripe</strong> — traitement des paiements (États-Unis,
                avec garanties contractuelles adéquates) ;
              </li>
              <li>
                <strong>Google</strong> — accès à l&apos;API Google Business
                Profile pour la publication des réponses.
              </li>
            </ul>
            <p>
              En cas de violation de données personnelles, ReplyForge s&apos;engage
              à notifier le Client dans les meilleurs délais afin de lui
              permettre de satisfaire à ses propres obligations de notification.
            </p>

            <h2>12. Responsabilité et garanties</h2>
            <p>
              La responsabilité de ReplyForge ne pourra être engagée qu&apos;en
              cas de faute prouvée. En tout état de cause, elle est limitée au
              montant total des sommes effectivement versées par le Client au
              titre du Service au cours des 12 mois précédant le fait
              générateur.
            </p>
            <p>ReplyForge ne saurait être tenu responsable :</p>
            <ul>
              <li>
                Des dommages indirects, incluant notamment la perte de chiffre
                d&apos;affaires, perte de clientèle ou atteinte à l&apos;image ;
              </li>
              <li>
                De l&apos;évolution des algorithmes de classement Google ou de
                toute modification des règles de Google Business Profile
                indépendante de sa volonté ;
              </li>
              <li>
                De l&apos;indisponibilité ou des modifications de
                l&apos;API Google Business Profile ;
              </li>
              <li>
                Des conséquences d&apos;une utilisation non conforme du Service
                par le Client.
              </li>
            </ul>

            <h2>13. Force majeure</h2>
            <p>
              Aucune des parties ne pourra être tenue responsable de
              l&apos;inexécution de ses obligations en cas de force majeure au
              sens de l&apos;article 1218 du Code civil. La partie empêchée
              devra notifier l&apos;autre partie dans les meilleurs délais.
            </p>

            <h2>14. Modifications des CGV</h2>
            <p>
              ReplyForge se réserve le droit de modifier les présentes CGV à
              tout moment. Toute modification substantielle sera notifiée au
              Client par email au moins <strong>30 jours</strong> avant son
              entrée en vigueur. En l&apos;absence d&apos;opposition du Client
              dans ce délai, les nouvelles CGV seront réputées acceptées.
            </p>
            <p>
              En cas d&apos;opposition, le Client pourra résilier son abonnement
              sans frais avant la date d&apos;entrée en vigueur des nouvelles
              CGV.
            </p>

            <h2>15. Droit applicable et litiges</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de
              litige relatif à leur interprétation ou à leur exécution, les
              parties s&apos;engagent à rechercher une solution amiable avant
              tout recours judiciaire.
            </p>
            <p>
              À défaut de résolution amiable dans un délai de 30 jours à compter
              de la notification du différend par l&apos;une des parties, les
              tribunaux compétents du ressort du domicile de l&apos;Éditeur
              seront seuls compétents.
            </p>
            <p>
              <strong>Médiation :</strong> les présentes CGV étant réservées à
              des clients professionnels (B2B), les dispositions relatives à la
              médiation de la consommation ne sont pas applicables.
            </p>
          </Prose>
        </Container>
      </section>
    </>
  );
}
