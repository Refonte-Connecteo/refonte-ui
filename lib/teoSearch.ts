import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, DPO_EMAIL } from "./contact";
import { secteurs } from "./secteurs";
import { CONSULTING_EXPERTISES, OUTSOURCING_EXPERTISES, offerHref } from "./solutions";

/**
 * Ce que Téo sait chercher : les pages du site, des réponses pratiques, toutes les offres et les secteurs d'activité.
 * Pour ajouter une réponse, complétez FAQ ; pour une page, complétez PAGES.
 */

export type SearchEntry = {
  title: string;
  href: string;
  /** Mots qui doivent faire remonter l'entrée (synonymes, mots courants des visiteurs). */
  keywords: string;
  /** Texte lu par la recherche (non affiché). */
  text?: string;
  /** Réponse directe que Téo donne quand cette entrée est la meilleure. */
  answer?: string[];
};

const PAGES: SearchEntry[] = [
  { title: "Accueil", href: "/", keywords: "accueil home connecteo partenaire experience client chiffres collaborateurs" },
  {
    title: "Qui sommes-nous ? Notre histoire",
    href: "/notre-adn/a-propos",
    keywords: "qui sommes nous histoire a propos entreprise societe creation 2018 antananarivo madagascar axian groupe valeurs adn",
  },
  {
    title: "Impact & Sustainability",
    href: "/impact",
    keywords: "impact rse durable sustainability environnement inclusion communaute formation engagement rapport",
  },
  { title: "Nos solutions CX", href: "/solutions", keywords: "solutions offres services metiers outsourcing consulting comparer cx" },
  { title: "Vos enjeux, nos solutions", href: "/solutions/enjeux", keywords: "enjeux parcours client transformation probleme besoin" },
  {
    title: "Outsourcing (externalisation)",
    href: "/outs",
    keywords: "outsourcing externalisation externaliser centre appels call center relation client sous traitance bpo",
  },
  { title: "Consulting (conseil)", href: "/cons", keywords: "consulting conseil audit strategie transformation accompagnement" },
  {
    title: "Secteurs d'activité",
    href: "/experience-client#secteurs-activite",
    keywords: "secteurs activite domaines industries clients",
  },
  {
    title: "Carrière : postes ouverts",
    href: "/carriere2",
    keywords: "carriere emploi job poste recrutement recrute travailler rejoindre candidature postuler offre emploi stage cdi cdd",
  },
  { title: "Actualités et événements", href: "/actus", keywords: "actualites actus news articles etudes rapports evenements blog" },
  { title: "Nous contacter", href: "/contact", keywords: "contact contacter devis rendez vous message formulaire ecrire projet" },
  {
    title: "Politique de confidentialité",
    href: "/politique-de-confidentialite",
    keywords: "donnees personnelles confidentialite rgpd vie privee dpo droits suppression acces",
  },
  { title: "Politique cookies", href: "/cookies", keywords: "cookies traceurs audience statistiques refuser desactiver" },
  { title: "Mentions légales", href: "/mentions-legales", keywords: "mentions legales editeur hebergeur" },
];

const FAQ: SearchEntry[] = [
  {
    title: "Adresse",
    href: "/contact",
    keywords: "adresse ou situe localisation bureau locaux venir plan tanashore andranomena futura",
    answer: [`Nous sommes à l'${CONTACT_ADDRESS}, Antananarivo (Madagascar).`],
  },
  {
    title: "Visite virtuelle de nos locaux",
    href: "https://my.matterport.com/show/?m=42v2xCu5D9F",
    keywords: "visite virtuelle locaux site 360 matterport plateau voir bureaux",
    answer: ["Vous pouvez visiter nos locaux en 360°, sans vous déplacer."],
  },
  {
    title: "Téléphone",
    href: "/contact",
    keywords: "telephone numero appeler tel joindre",
    answer: [`Téléphone : ${CONTACT_PHONE}`],
  },
  {
    title: "Email",
    href: "/contact",
    keywords: "email mail courriel adresse electronique",
    answer: [`Email : ${CONTACT_EMAIL}`, "Notre équipe répond sous 48 h ouvrées."],
  },
  {
    title: "Délai de réponse",
    href: "/contact",
    keywords: "delai reponse combien temps repondre rappel attente",
    answer: ["Notre équipe répond sous 48 h ouvrées."],
  },
  {
    title: "Format du CV",
    href: "/carriere2",
    keywords: "cv format pdf doc docx taille fichier joindre lettre motivation",
    answer: ["Votre CV doit être au format PDF, DOC ou DOCX, et ne pas dépasser 5 Mo."],
  },
  {
    title: "Candidature spontanée",
    href: "/carriere2",
    keywords: "candidature spontanee aucun poste correspond profil envoyer cv",
    answer: ["Aucun poste ne vous correspond ? Envoyez une candidature spontanée depuis la page Carrière."],
  },
  {
    title: "Conservation des candidatures",
    href: "/politique-de-confidentialite",
    keywords: "conservation cv combien temps garde candidature vivier talents",
    answer: ["Un CV non retenu peut être conservé au maximum deux ans dans notre vivier de talents."],
  },
  {
    title: "Vos données personnelles",
    href: "/politique-de-confidentialite",
    keywords: "donnees personnelles supprimer effacer acces rectification dpo rgpd",
    answer: [`Pour exercer vos droits sur vos données, écrivez à notre DPO : ${DPO_EMAIL}.`],
  },
  {
    title: "Mesure d'audience",
    href: "/cookies#preferences",
    keywords: "cookies refuser statistiques suivi tracking desactiver mesure",
    answer: ["Le site ne dépose aucun cookie publicitaire. Vous pouvez désactiver la mesure d'audience sur la page Cookies."],
  },
  {
    title: "Le Groupe AXIAN",
    href: "https://www.axian.com",
    keywords: "axian groupe maison mere actionnaire",
    answer: ["Connecteo fait partie du Groupe AXIAN."],
  },
  {
    title: "Nos équipes",
    href: "/notre-adn/a-propos",
    keywords: "combien collaborateurs employes salaries effectif taille equipe",
    answer: ["Plus de 850 collaborateurs au service de l'expérience client."],
  },
];

const OFFERS: SearchEntry[] = [...OUTSOURCING_EXPERTISES, ...CONSULTING_EXPERTISES].flatMap((expertise) =>
  expertise.offers.map((offer) => ({
    title: offer.title,
    href: offerHref(expertise.slug, offer.slug),
    keywords: `${offer.title} ${expertise.label} offre service`,
    text: [offer.description, offer.scopeText, ...(offer.benefits ?? [])].filter(Boolean).join(" "),
  })),
);

const SECTORS: SearchEntry[] = secteurs.map((secteur) => ({
  title: `Secteur ${secteur.name}`,
  href: "/experience-client#secteurs-activite",
  keywords: `${secteur.name} secteur ${secteur.subSectors.map((sub) => `${sub.name} ${sub.tags.join(" ")}`).join(" ")}`,
  text: `${secteur.tagline} ${secteur.intro}`,
}));

export const SEARCH_INDEX: SearchEntry[] = [...FAQ, ...PAGES, ...OFFERS, ...SECTORS];

/** Exemples proposés sous le champ de recherche. */
export const SEARCH_EXAMPLES = ["CV", "Adresse", "Recouvrement", "Facturation"];

const STOPWORDS = new Set(
  "les des une un le la de du et en au aux pour par sur avec dans est sont que qui quoi quel quelle quels quelles comment vous votre vos nous notre nos mon ma mes je tu il elle ce cet cette ces pas plus ou a l d j n s y t c qu peut faire avez bonjour salut merci svp".split(" "),
);

/** Minuscules, sans accents ni ponctuation. */
export const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const tokens = (value: string) => normalize(value).split(" ").filter((t) => t.length >= 2 && !STOPWORDS.has(t));

/**
 * Même mot, mot qui en prolonge un autre (situé / situés), ou même racine d'au moins 6 lettres couvrant
 * presque tout le mot le plus court (externaliser / externalisation, mais pas emploi / employés).
 */
function sameWord(q: string, w: string): boolean {
  if (q === w) return true;
  const n = Math.min(q.length, w.length);
  if (n < 4) return false;
  if (w.startsWith(q) || q.startsWith(w)) return true;
  let common = 0;
  while (common < n && q[common] === w[common]) common++;
  return common >= Math.max(6, n - 2);
}

const has = (words: string[], q: string) => words.some((w) => sameWord(q, w));

/** Les réponses pratiques et les pages passent devant les offres à pertinence égale. */
const BOOST = new Map<SearchEntry, number>([...FAQ.map((e) => [e, 1.4] as const), ...PAGES.map((e) => [e, 1.2] as const)]);

const prepared = SEARCH_INDEX.map((entry) => ({
  entry,
  boost: BOOST.get(entry) ?? 1,
  title: tokens(entry.title),
  keywords: tokens(entry.keywords),
  text: tokens(entry.text ?? ""),
}));

/** Poids d'un mot : un mot rare (« recouvrement ») compte plus qu'un mot présent partout (« client »). */
function rarity(q: string): number {
  const found = prepared.filter((p) => has(p.title, q) || has(p.keywords, q) || has(p.text, q)).length;
  return Math.log((prepared.length + 1) / (found + 1)) + 0.1;
}

/** Les meilleures réponses à une question libre, de la plus pertinente à la moins pertinente. */
export function searchSite(query: string, limit = 4): SearchEntry[] {
  const q = [...new Set(tokens(query))];
  if (q.length === 0) return [];
  const weights = new Map(q.map((t) => [t, rarity(t)]));
  return prepared
    .map((p) => ({
      entry: p.entry,
      score:
        p.boost *
        q.reduce((sum, t) => {
          const field = has(p.title, t) ? 3 : has(p.keywords, t) ? 2.5 : has(p.text, t) ? 1 : 0;
          return sum + field * weights.get(t)!;
        }, 0),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry);
}
