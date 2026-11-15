import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalList, type LegalSection } from "../components/legal/LegalPage";
import AnalyticsOptOut from "../components/legal/AnalyticsOptOut";
import { DPO_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Politique de gestion des cookies | Connecteo",
  description:
    "Les cookies et traceurs utilisés sur le site de Connecteo, leur durée de conservation et la gestion de vos préférences.",
};

// Source : back/docs/POLITIQUE DE GESTION DES COOKIES CNTO.docx.
// Écarts volontaires : la section « Gestion de vos préférences » décrit l'interrupteur réel
// (le site n'a pas de bandeau), et la liste des traceurs réellement utilisés est ajoutée.
const UPDATED = "15 novembre 2026";

const BROWSER_HELP = [
  {
    name: "Microsoft Edge",
    href: "https://support.microsoft.com/fr-fr/edge/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use",
  },
  { name: "Google Chrome", href: "https://support.google.com/chrome/answer/95647?hl=fr" },
  { name: "Mozilla Firefox", href: "https://support.mozilla.org/fr/kb/effacer-cookies-donnees-site-firefox" },
  { name: "Safari", href: "https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" },
];

const DURATIONS = [
  ["Cookies de session", "Jusqu'à la fermeture du navigateur"],
  ["Cookies fonctionnels", "13 mois maximum"],
  ["Cookies d'analyse d'audience", "13 mois maximum"],
  ["Consentement aux cookies", "6 à 13 mois"],
];

const TRACKERS = [
  {
    name: "connecteo_vid",
    purpose: "Mesure d'audience interne : compter les visiteurs sans les identifier",
    kind: "Stockage local du navigateur",
    duration: "13 mois, puis renouvelé",
  },
  {
    name: "connecteo_analytics_optout",
    purpose: "Mémoriser votre refus de la mesure d'audience",
    kind: "Stockage local du navigateur",
    duration: "Jusqu'à ce que vous réactiviez la mesure",
  },
  {
    name: "connecteo_chat_hint_dismissed",
    purpose: "Ne plus afficher les bulles de l'assistant Téo après fermeture",
    kind: "Stockage de session",
    duration: "Jusqu'à la fermeture de l'onglet",
  },
];

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#d5e6e8]">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead className="bg-[#f3f9f9] text-[#096475]">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e4eff0]">
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i} className={`px-4 py-3 align-top ${i === 0 ? "font-medium text-[#0B1D20]" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const sections: LegalSection[] = [
  {
    id: "definition",
    title: "Qu'est-ce qu'un cookie ?",
    content: (
      <>
        <p>
          Un cookie est un fichier texte déposé sur votre terminal (ordinateur, tablette ou
          smartphone) lors de la consultation de notre site internet.
        </p>
        <p>
          Les cookies permettent notamment de reconnaître votre navigateur, de mémoriser certaines
          informations relatives à votre navigation et d&apos;améliorer votre expérience
          utilisateur.
        </p>
      </>
    ),
  },
  {
    id: "emetteurs",
    title: "Qui dépose les cookies ?",
    content: (
      <>
        <p>Les cookies utilisés sur le site de Connecteo peuvent être :</p>
        <LegalList
          items={[
            "Des cookies déposés directement par Connecteo ;",
            "Des cookies déposés par des partenaires ou prestataires techniques intervenant dans l'exploitation du site.",
          ]}
        />
      </>
    ),
  },
  {
    id: "finalites",
    title: "Pourquoi utilisons-nous des cookies ?",
    content: (
      <>
        <p>Nous utilisons des cookies afin de :</p>
        <LegalList
          items={[
            "Garantir le bon fonctionnement du site ;",
            "Sécuriser l'accès aux services en ligne ;",
            "Améliorer la navigation et l'expérience utilisateur ;",
            "Mesurer l'audience et les performances du site ;",
            "Produire des statistiques anonymisées de consultation ;",
            "Faciliter le dépôt de candidatures en ligne ;",
            "Conserver vos préférences de navigation.",
          ]}
        />
      </>
    ),
  },
  {
    id: "categories",
    title: "Les catégories de cookies utilisées",
    content: (
      <>
        <h3>Cookies strictement nécessaires</h3>
        <p>
          Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être
          désactivés. Ils permettent notamment :
        </p>
        <LegalList
          items={[
            "La navigation entre les pages ;",
            "La gestion des sessions utilisateurs ;",
            "La sécurisation du site ;",
            "La mémorisation des choix relatifs à la confidentialité ;",
            "L'accès aux formulaires de contact et de candidature.",
          ]}
        />
        <p>
          <strong>Base légale :</strong> intérêt légitime de Connecteo à assurer le fonctionnement
          du site.
        </p>

        <h3>Cookies de mesure d&apos;audience</h3>
        <p>
          Ces cookies permettent de comprendre l&apos;utilisation du site par les visiteurs afin
          d&apos;améliorer son contenu et ses performances. Les informations collectées peuvent
          porter sur :
        </p>
        <LegalList
          items={[
            "Le nombre de visiteurs ;",
            "Les pages consultées ;",
            "La durée des visites ;",
            "Le type d'appareil utilisé ;",
            "Les sources de trafic.",
          ]}
        />
        <p>Les données sont exploitées sous forme agrégée et statistique.</p>
        <p>
          <strong>Base légale :</strong> consentement de l&apos;utilisateur lorsque requis par la
          réglementation applicable.
        </p>

        <h3>Cookies de personnalisation</h3>
        <p>
          Ces cookies permettent de mémoriser certaines préférences de navigation telles que :
        </p>
        <LegalList
          items={[
            "La langue sélectionnée ;",
            "Les paramètres d'affichage ;",
            "Les préférences de consentement aux cookies.",
          ]}
        />
        <p>
          <strong>Base légale :</strong> consentement ou intérêt légitime selon la nature du cookie.
        </p>

        <h3>Cookies liés au recrutement</h3>
        <p>
          Dans le cadre du dépôt de candidature en ligne, certains cookies peuvent être utilisés
          afin :
        </p>
        <LegalList
          items={[
            "D'assurer la continuité de la candidature ;",
            "D'éviter la perte d'informations saisies ;",
            "De sécuriser la transmission des données ;",
            "D'améliorer l'expérience utilisateur du portail recrutement.",
          ]}
        />
        <p>Ces cookies ne sont utilisés que pour faciliter le processus de recrutement.</p>
      </>
    ),
  },
  {
    id: "traceurs",
    title: "Traceurs utilisés actuellement sur ce site",
    content: (
      <>
        <p>
          Le site public ne dépose aucun cookie publicitaire et n&apos;utilise aucun outil de mesure
          d&apos;un tiers. Les seuls traceurs présents sur votre navigateur sont les suivants :
        </p>
        <Table
          head={["Nom", "Finalité", "Type", "Durée"]}
          rows={TRACKERS.map((t) => [t.name, t.purpose, t.kind, t.duration])}
        />
        <p>
          Les données de mesure d&apos;audience (page consultée, site d&apos;origine, type
          d&apos;appareil) sont conservées par Connecteo uniquement, puis supprimées après 13 mois.
          L&apos;espace d&apos;administration, réservé au personnel de Connecteo, utilise en plus un
          cookie de connexion strictement nécessaire.
        </p>
      </>
    ),
  },
  {
    id: "duree",
    title: "Durée de conservation",
    content: (
      <>
        <p>
          Les cookies sont conservés pour une durée limitée adaptée à leur finalité. À titre
          indicatif :
        </p>
        <Table head={["Type de cookie", "Durée maximale"]} rows={DURATIONS} />
        <p>À l&apos;expiration de cette durée, les données sont supprimées ou anonymisées.</p>
      </>
    ),
  },
  {
    id: "preferences",
    title: "Gestion de vos préférences",
    content: (
      <>
        <p>
          Les cookies strictement nécessaires ne peuvent pas être désactivés. La mesure
          d&apos;audience peut être désactivée à tout moment, sur ce navigateur, avec
          l&apos;interrupteur ci-dessous. Ce réglage est accessible depuis le lien
          « Cookies » du pied de page du site.
        </p>
        <AnalyticsOptOut />
      </>
    ),
  },
  {
    id: "navigateur",
    title: "Paramétrage via votre navigateur",
    content: (
      <>
        <p>Vous pouvez également configurer votre navigateur afin de :</p>
        <LegalList
          items={[
            "Refuser certains cookies ;",
            "Supprimer les cookies déjà enregistrés ;",
            "Être informé avant tout dépôt de cookie.",
          ]}
        />
        <p>Les modalités de paramétrage diffèrent selon le navigateur utilisé :</p>
        <LegalList
          items={BROWSER_HELP.map((b) => (
            <a key={b.name} href={b.href} target="_blank" rel="noopener noreferrer">
              {b.name}
            </a>
          ))}
        />
        <p>
          Le refus de certains cookies peut toutefois affecter le fonctionnement ou l&apos;affichage
          de certaines fonctionnalités du site.
        </p>
      </>
    ),
  },
  {
    id: "donnees-personnelles",
    title: "Protection des données personnelles",
    content: (
      <>
        <p>
          <strong>
            Les informations collectées au moyen des cookies sont traitées conformément à notre{" "}
            <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>.
          </strong>
        </p>
        <p>
          Lorsque les cookies permettent de traiter des données à caractère personnel, les
          utilisateurs bénéficient notamment des droits suivants :
        </p>
        <LegalList
          items={[
            "Droit d'accès ;",
            "Droit de rectification ;",
            "Droit d'effacement ;",
            "Droit d'opposition ;",
            "Droit à la limitation du traitement ;",
            "Droit de retrait du consentement.",
          ]}
        />
        <p>
          Pour toute question relative au traitement de vos données personnelles, vous pouvez
          contacter :
          <br />
          <strong>Délégué à la Protection des Données (DPO)</strong>
          <br />
          Email : <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>
        </p>
      </>
    ),
  },
  {
    id: "evolution",
    title: "Évolution de la politique cookies",
    content: (
      <>
        <p>
          Connecteo se réserve le droit de modifier la présente politique afin de tenir compte des
          évolutions légales, réglementaires, techniques ou des services proposés sur le site.
        </p>
        <p>
          Toute mise à jour sera publiée sur cette page avec indication de sa date d&apos;entrée en
          vigueur.
        </p>
      </>
    ),
  },
];

export default function CookiesPage() {
  return <LegalPage title="Politique de gestion des cookies" updated={UPDATED} sections={sections} />;
}
