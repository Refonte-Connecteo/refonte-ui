import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalList, ToComplete, type LegalSection } from "../components/legal/LegalPage";
import { CONTACT_EMAIL, CONTACT_PHONE, DPO_EMAIL } from "@/lib/contact";

// Aucun document source : les informations marquées « à compléter » doivent être fournies par
// Connecteo. Retirer `robots` une fois la page complète.
export const metadata: Metadata = {
  title: "Mentions légales | Connecteo",
  description: "Éditeur, directeur de la publication et hébergeur du site de Connecteo.",
  robots: { index: false, follow: true },
};

const UPDATED = "15 novembre 2026";

const sections: LegalSection[] = [
  {
    id: "editeur",
    title: "Éditeur du site",
    content: (
      <LegalList
        items={[
          <>
            <strong>Raison sociale :</strong> CONNECTEO
          </>,
          <>
            <strong>Forme juridique :</strong> <ToComplete>SA, SARL…</ToComplete>
          </>,
          <>
            <strong>Capital social :</strong> <ToComplete>montant en Ariary</ToComplete>
          </>,
          <>
            <strong>Siège social :</strong> Immeuble TANASHORE – Zone Futura Andranomena 101
            Antananarivo – Madagascar
          </>,
          <>
            <strong>RCS :</strong> <ToComplete>numéro</ToComplete>
          </>,
          <>
            <strong>NIF :</strong> <ToComplete>numéro</ToComplete> · <strong>STAT :</strong>{" "}
            <ToComplete>numéro</ToComplete>
          </>,
          <>
            <strong>Téléphone :</strong> {CONTACT_PHONE}
          </>,
          <>
            <strong>Email :</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </>,
        ]}
      />
    ),
  },
  {
    id: "publication",
    title: "Directeur de la publication",
    content: (
      <p>
        <ToComplete>nom et fonction du directeur de la publication</ToComplete>
      </p>
    ),
  },
  {
    id: "hebergement",
    title: "Hébergement",
    content: (
      <LegalList
        items={[
          <>
            <strong>Site internet :</strong>{" "}
            <ToComplete>nom, adresse et site de l&apos;hébergeur</ToComplete>
          </>,
          <>
            <strong>Serveur et base de données :</strong>{" "}
            <ToComplete>nom, adresse et site de l&apos;hébergeur</ToComplete>
          </>,
        ]}
      />
    ),
  },
  {
    id: "propriete",
    title: "Propriété intellectuelle",
    content: (
      <>
        <p>
          L&apos;ensemble des contenus du site (textes, logos, images, vidéos, éléments graphiques)
          est la propriété de CONNECTEO ou de ses partenaires et est protégé par le droit de la
          propriété intellectuelle. Toute reproduction, représentation ou adaptation, totale ou
          partielle, sans autorisation écrite préalable est interdite.
        </p>
        <p>
          <strong>Crédits photos :</strong> <ToComplete>auteurs ou banques d&apos;images</ToComplete>
        </p>
      </>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles et cookies",
    content: (
      <p>
        Le traitement de vos données personnelles est décrit dans notre{" "}
        <Link href="/politique-de-confidentialite">Politique de confidentialité</Link> et
        l&apos;utilisation des cookies dans notre <Link href="/cookies">Politique cookies</Link>.
        Pour exercer vos droits : <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <p>
        Pour toute question concernant le site, écrivez-nous à{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ou utilisez notre{" "}
        <Link href="/contact">formulaire de contact</Link>.
      </p>
    ),
  },
];

export default function MentionsLegalesPage() {
  return <LegalPage title="Mentions légales" updated={UPDATED} sections={sections} />;
}
