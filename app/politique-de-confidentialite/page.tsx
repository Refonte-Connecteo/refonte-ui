import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalList, type LegalSection } from "../components/legal/LegalPage";
import { CONTACT_EMAIL, DPO_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Connecteo",
  description:
    "Comment Connecteo collecte, utilise, conserve et protège vos données personnelles, et comment exercer vos droits.",
};

// Source : back/docs/mention légale_site web Connecteo_VComm.docx (texte repris fidèlement ;
// seules les adresses email ont été harmonisées).
const UPDATED = "15 novembre 2026";

const dpoLink = <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>;

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <p>
        CONNECTEO est une société spécialisée dans les services de relation client, spécifiquement
        sur l&apos;externalisation des processus métiers (BPO), du support commercial, du traitement
        de données et des services digitaux. De ce fait, la protection de ces informations, des
        informations clients et le respect de la vie privée sont fondamentales pour ses opérations
        quotidiennes et le succès des opérations.
      </p>
    ),
  },
  {
    id: "objectif",
    title: "Objectif et périmètre de la politique",
    content: (
      <>
        <p>
          La présente Politique de protection des données personnelles détaille la façon dont
          CONNECTEO collecte, utilise et protège les informations liées au site Internet et aux
          services numériques.
        </p>
        <p>
          Elle s&apos;applique à toutes les données personnelles que CONNECTEO traite notamment
          lorsque les internautes et utilisateurs utilisent les services mis à leur disposition,
          visitent notre site internet ou lorsqu&apos;ils interagissent avec nous par les différents
          canaux mis à leur disposition. Il est important que les utilisateurs prennent connaissance
          de cette Politique, ainsi que toute autre politique relative à la confidentialité que
          CONNECTEO pourrait être amenés à publier afin d&apos;être pleinement informé des
          traitements de données à caractère personnel les concernant, des moyens mis en œuvre pour
          les protéger ainsi que des modalités selon lesquelles ils peuvent exercer leurs droits.
        </p>
        <p>
          Veuillez lire attentivement cette Politique de confidentialité qui nous engage. En
          fournissant vos données personnelles sur le site web CONNECTEO et par le biais des canaux
          de contact, vous déclarez que vous avez pris connaissance de la présente politique et que
          vous y consentez expressément, ainsi qu&apos;au traitement lui-même.
        </p>
      </>
    ),
  },
  {
    id: "engagement",
    title: "Notre engagement",
    content: (
      <>
        <p>
          Connecteo accorde une importance particulière à la protection de vos données à caractère
          personnel et au respect de votre vie privée.
        </p>
        <p>
          La présente Politique de confidentialité a pour objet de vous informer sur la manière dont
          vos données personnelles sont collectées, utilisées, conservées et protégées lorsque vous
          utilisez notre site internet, consultez nos offres d&apos;emploi ou déposez une candidature
          en ligne.
        </p>
        <p>
          Le site internet de CONNECTEO contient des liens vers d&apos;autres sites internet. Si vous
          suivez ces liens, vous sortez de notre site internet. CONNECTEO n&apos;est pas responsable
          des traitements qui sont réalisés sur les sites internet de ces tiers. La présente
          politique n&apos;est pas applicable à ces sites internet.
        </p>
        <p>
          Pour en savoir plus sur la façon dont ces tiers traitent vos données personnelles, vous
          pouvez consulter leurs politiques de protection des données personnelles.
        </p>
      </>
    ),
  },
  {
    id: "responsable",
    title: "Responsable de traitement",
    content: (
      <>
        <p>
          <strong>Le responsable du traitement est CONNECTEO.</strong>
          <br />
          Adresse : Immeuble TANASHORE – Zone Futura Andranomena 101 Antananarivo – Madagascar
          <br />
          Email : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p>
          Pour toute question relative à la protection des données personnelles :
          <br />
          <strong>Délégué à la Protection des Données (DPO)</strong>
          <br />
          Email : {dpoLink}
        </p>
        <p>
          Les responsables du traitement prennent toutes les mesures nécessaires pour assurer la
          sécurité de vos données et respecter les obligations légales en la matière. Ils
          s&apos;engagent fermement à respecter un ensemble de règles afin de garantir le respect de
          la confidentialité de l&apos;ensemble des données vous concernant.
        </p>
        <LegalList
          items={[
            <>
              <strong>Engagement de transparence</strong> : nous détaillons tout le long de ce
              document, la manière dont sont obtenues, stockées et traitées les différentes données
              vous concernant.
            </>,
            <>
              <strong>Engagement de sécurisation</strong> : des mesures techniques et
              organisationnelles de sécurisation répondant aux standards du secteur sont appliquées
              à tous les niveaux de traitement de l&apos;information, qu&apos;il s&apos;agisse de la
              collecte, du stockage, ou des sauvegardes.
            </>,
            <>
              <strong>Engagement de non-diffusion</strong> : aucune donnée ne fait l&apos;objet de
              diffusion automatisée auprès de prestataires ou de tiers. Certaines informations
              pourront néanmoins être publiées et diffusées dans la stricte limite des exigences de
              la règlementation ou des besoins indispensables des activités de notre société pour
              vous offrir le meilleur de nos services et produits.
            </>,
            <>
              <strong>Engagement de respect des droits des personnes concernées</strong> : les
              droits permettant l&apos;accès en consultation, rectification et suppression de
              certaines de vos données personnelles et export de leur ensemble sont assurés.
            </>,
            <>
              <strong>Engagement de respect des législations</strong> : le système
              d&apos;information est en conformité avec les législations en matière de protection
              des données.
            </>,
          ]}
        />
        <p>
          Par ailleurs, nous avons mis en place des mesures de sécurité technique et
          organisationnelle appropriées, pour éviter la destruction, la perte, la falsification, la
          modification, l&apos;accès non autorisé ou la notification erronée à des tiers des données
          personnelles collectées ainsi que tout autre traitement non autorisé de ces données.
        </p>
        <p>
          Nous garantissons un niveau de protection suffisant en rendant les obligations applicables
          à nos employés et consultants.
        </p>
        <p>
          Vous êtes donc seul responsable de l&apos;utilisation faite à partir du site Web de votre
          ordinateur, de votre adresse IP, de vos données d&apos;identification et de connexion,
          ainsi que de leur confidentialité. Vous devez à tout moment respecter les règles de
          sécurité, notamment en empêchant tout accès non autorisé à votre login, code et
          informations de connexion.
        </p>
      </>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles traitées",
    content: (
      <>
        <p>Nous pouvons être amenés à collecter les catégories de données suivantes :</p>
        <h3>Données d&apos;identification</h3>
        <LegalList
          items={[
            "Nom et prénom",
            "Adresse e-mail",
            "Numéro de téléphone",
            "Fonction ou société représentée",
          ]}
        />
        <h3>Données relatives au recrutement</h3>
        <LegalList
          items={[
            "Curriculum Vitae (CV)",
            "Lettre de motivation",
            "Parcours académique",
            "Expériences professionnelles",
            "Compétences et certifications",
            "Références professionnelles le cas échéant",
          ]}
        />
        <h3>Données de navigation</h3>
        <LegalList
          items={[
            "Adresse IP",
            "Type de navigateur",
            "Système d'exploitation",
            "Pages consultées",
            "Cookies et données techniques de connexion",
          ]}
        />
        <p>
          Dans l&apos;hypothèse où les données personnelles sont collectées par le biais d&apos;un
          formulaire, un astérisque (*) à côté des champs concernés informera du caractère
          obligatoire des informations à compléter. L&apos;absence d&apos;astérisque signifie que les
          informations demandées ne sont pas obligatoires.
        </p>
        <p>
          Seules les données personnelles qui sont strictement nécessaires au regard des finalités
          décrites ci-dessous sont collectées.
        </p>
      </>
    ),
  },
  {
    id: "bases-legales",
    title: "Bases légales des traitements et collecte des données personnelles",
    content: (
      <>
        <p>Nous utilisons vos données personnelles pour :</p>
        <LegalList
          items={[
            "Répondre à vos demandes de contact ;",
            "Vous fournir les informations sollicitées ;",
            "Gérer les candidatures et les processus de recrutement ;",
            "Administrer et sécuriser notre site internet ;",
            "Mesurer l'audience et améliorer nos services ;",
            "Respecter nos obligations légales et réglementaires.",
          ]}
        />
        <p>Les traitements réalisés reposent sur :</p>
        <LegalList
          items={[
            "Votre consentement ;",
            "L'exécution de mesures précontractuelles (recrutement) ;",
            "Le respect de nos obligations légales ;",
            "Notre intérêt légitime à assurer le bon fonctionnement et la sécurité du site.",
          ]}
        />
      </>
    ),
  },
  {
    id: "finalites",
    title: "Finalités des traitements",
    content: (
      <>
        <p>Vos données personnelles sont traitées pour les finalités suivantes :</p>
        <LegalList
          items={[
            "Identification des abonnés ;",
            "La gestion des plaintes et réclamations des abonnés ;",
            "La gestion des opérations de recrutement ;",
            "La constitution d'un réseau de talents ;",
            "La gestion de vos demandes d'exercice de droits sur vos données personnelles ;",
            "La communication (réponses aux questions, plaintes, ou demandes au sujet des métiers, des marques, de la stratégie et des valeurs CONNECTEO).",
          ]}
        />
        <p>Connecteo ne vend ni ne commercialise vos données personnelles.</p>
      </>
    ),
  },
  {
    id: "conservation",
    title: "Durée de conservation des données personnelles",
    content: (
      <>
        <p>
          Les données personnelles collectées sont conservées pendant les délais légaux et
          règlementaires en vigueur y afférents.
        </p>
        <p>
          Néanmoins, vos données personnelles ne sont conservées que pour la durée strictement
          nécessaire à l&apos;accomplissement des finalités pour lesquelles elles sont collectées et
          traitées lorsqu&apos;elles ne sont soumises à aucun délai de conservation légal, ni
          réglementaire spécifique.
        </p>
        <p>
          Par ailleurs, dans le cas d&apos;un recrutement, si votre candidature n&apos;a pas été
          retenue pour un ou plusieurs emplois auxquels vous avez postulé, CONNECTEO se réserve le
          droit de conserver votre CV dans la CV-thèque (ou « vivier de talents ») pendant une durée
          maximale de deux ans après réception de votre candidature, ceci afin d&apos;évaluer si
          votre profil peut correspondre à une offre d&apos;emploi ultérieure, et prendre contact
          avec vous le cas échéant.
        </p>
        <p>
          Par défaut, vos données de connexion, de navigation et de trafic ne sont pas conservées
          au-delà d&apos;un (01) an.
        </p>
        <p>
          Néanmoins, vos données personnelles sont conservées pour une durée plus importante lorsque
          les obligations légales et réglementaires nous l&apos;imposent.
        </p>
        <p>
          À l&apos;issue de ces délais, les données sont supprimées, anonymisées ou archivées
          conformément à la réglementation.
        </p>
      </>
    ),
  },
  {
    id: "securite",
    title: "Sécurité des données personnelles",
    content: (
      <>
        <p>Connecteo met en œuvre des mesures de sécurité adaptées afin de garantir :</p>
        <LegalList
          items={[
            "La confidentialité des informations ;",
            "L'intégrité des données ;",
            "La disponibilité des systèmes ;",
            "La protection contre tout accès non autorisé, perte, divulgation ou altération.",
          ]}
        />
      </>
    ),
  },
  {
    id: "droits",
    title: "Nature et exercice des droits relatifs aux données personnelles",
    content: (
      <>
        <p>
          Conformément à la réglementation applicable en matière de protection des données
          personnelles, vous disposez des droits suivants :
        </p>
        <LegalList
          items={[
            "Droit d'accès ;",
            "Droit de rectification ;",
            "Droit d'effacement ;",
            "Droit d'opposition ;",
            "Droit à la limitation du traitement ;",
            "Droit à la portabilité lorsque applicable ;",
            "Droit de retirer votre consentement à tout moment.",
          ]}
        />
        <p>
          Pour exercer vos droits, contactez : <strong>{dpoLink}</strong>
        </p>
        <p>
          Une vérification de votre identité pourra être demandée avant le traitement de votre
          demande.
        </p>
      </>
    ),
  },
  {
    id: "transfert",
    title: "Transfert de données",
    content: (
      <>
        <p>
          Dans le cadre de l&apos;utilisation de solutions d&apos;hébergement ou d&apos;outils de
          CONNECTEO et de ses partenaires, certaines données peuvent être traitées en dehors de
          Madagascar.
        </p>
        <p>
          Connecteo veille à ce que des garanties appropriées soient mises en œuvre afin
          d&apos;assurer un niveau de protection adéquat des données personnelles.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <p>Notre site utilise des cookies afin de :</p>
        <LegalList
          items={[
            "Garantir son bon fonctionnement ;",
            "Assurer sa sécurité ;",
            "Mesurer l'audience ;",
            "Améliorer la navigation et l'expérience utilisateur.",
          ]}
        />
        <p>
          Vous pouvez gérer vos préférences à tout moment via notre{" "}
          <Link href="/cookies#preferences">module de gestion des cookies</Link>.
        </p>
        <p>
          <strong>
            Consultez également notre <Link href="/cookies">Politique Cookies</Link>.
          </strong>
        </p>
      </>
    ),
  },
  {
    id: "reclamation",
    title: "Réclamation",
    content: (
      <>
        <p>
          Si vous considérez que le traitement de vos données personnelles ne respecte pas la
          réglementation applicable, vous pouvez contacter notre DPO à l&apos;adresse suivante :{" "}
          {dpoLink}
        </p>
        <p>
          Vous avez également la possibilité de saisir la{" "}
          <strong>Commission Malgache de l&apos;Informatique et des Libertés (CMIL)</strong>.
        </p>
      </>
    ),
  },
  {
    id: "modification",
    title: "Modification de la politique",
    content: (
      <>
        <p>
          Connecteo se réserve le droit de modifier la présente Politique de confidentialité afin de
          tenir compte des évolutions légales, réglementaires ou techniques.
        </p>
        <p>Toute mise à jour sera publiée sur cette page.</p>
      </>
    ),
  },
];

export default function PolitiqueConfidentialitePage() {
  return <LegalPage title="Politique de confidentialité" updated={UPDATED} sections={sections} />;
}
