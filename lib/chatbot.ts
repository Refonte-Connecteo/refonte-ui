import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from "./contact";
import { CONSULTING_EXPERTISES, OUTSOURCING_EXPERTISES, offerHref } from "./solutions";
import type { Expertise } from "./solutions";

/** Modifiez ce fichier pour changer le nom du robot, ses questions ou ses réponses. */
export const BOT_NAME = "Téo";
export const START_NODE = "start";

export type ChatChoice = {
  label: string;
  /** Étape suivante de la conversation. */
  next?: string;
  /** Lien vers une page du site ou une adresse externe. */
  href?: string;
};

export type ChatNode = {
  messages: string[];
  choices: ChatChoice[];
};

const CONTACT_LINK: ChatChoice = { label: "Écrire un message", href: "/contact" };
const BACK_TO_MENU: ChatChoice = { label: "Revenir au menu", next: START_NODE };

/** Réponse finale : des liens utiles, puis la question de satisfaction. */
const answer = (messages: string[], links: ChatChoice[] = []): ChatNode => ({
  messages: [...messages, "Cela répond à votre question ?"],
  choices: [
    ...links,
    { label: "Oui, merci", next: "thanks" },
    { label: "Non, pas vraiment", next: "fallback" },
  ],
});

const expertiseId = (expertise: Expertise) => `expertise:${expertise.slug}`;

function expertiseNodes(expertises: Expertise[]): Record<string, ChatNode> {
  return Object.fromEntries(
    expertises.map((expertise) => [
      expertiseId(expertise),
      expertise.offers.length > 0
        ? answer(
            [`Voici nos offres « ${expertise.label} ».`],
            expertise.offers.map((offer) => ({
              label: offer.title,
              href: offerHref(expertise.slug, offer.slug),
            })),
          )
        : answer(
            ["Les offres de cette expertise seront bientôt disponibles."],
            [CONTACT_LINK],
          ),
    ]),
  );
}

const expertiseChoices = (expertises: Expertise[]): ChatChoice[] =>
  expertises.map((expertise) => ({ label: expertise.label, next: expertiseId(expertise) }));

export const CHAT_NODES: Record<string, ChatNode> = {
  start: {
    messages: [`Bonjour, je suis ${BOT_NAME} !`, "Que cherchez-vous ?"],
    choices: [
      { label: "Découvrir vos solutions", next: "solutions" },
      { label: "Rejoindre l'équipe", next: "careers" },
      { label: "Vous contacter", next: "contact" },
      { label: "Qui est Connecteo ?", next: "about" },
      { label: "Actualités et événements", next: "news" },
      { label: "Autre question", next: "fallback" },
    ],
  },

  solutions: {
    messages: ["Nous avons deux métiers complémentaires. Lequel vous intéresse ?"],
    choices: [
      { label: "Outsourcing : externaliser ma relation client", next: "outsourcing" },
      { label: "Consulting : transformer ma relation client", next: "consulting" },
      { label: "Comparer les deux", href: "/solutions" },
    ],
  },
  outsourcing: {
    messages: ["Très bien ! Quelle expertise vous intéresse ?"],
    choices: [...expertiseChoices(OUTSOURCING_EXPERTISES), { label: "Voir tout l'Outsourcing", href: "/outs" }],
  },
  consulting: {
    messages: ["Très bien ! Quelle expertise vous intéresse ?"],
    choices: [...expertiseChoices(CONSULTING_EXPERTISES), { label: "Voir tout le Consulting", href: "/cons" }],
  },
  ...expertiseNodes(OUTSOURCING_EXPERTISES),
  ...expertiseNodes(CONSULTING_EXPERTISES),

  careers: {
    messages: ["Super ! Que souhaitez-vous faire ?"],
    choices: [
      { label: "Voir les postes ouverts", href: "/carriere2" },
      { label: "Envoyer une candidature spontanée", next: "spontaneous" },
      { label: "Quel format pour mon CV ?", next: "cv" },
    ],
  },
  spontaneous: answer(
    ["Aucun poste ne vous correspond ? Présentez-vous avec le formulaire de la page Carrière, nous reviendrons vers vous."],
    [{ label: "Ouvrir le formulaire", href: "/carriere2" }],
  ),
  cv: answer(
    ["Votre CV doit être au format PDF, DOC ou DOCX, et ne pas dépasser 5 Mo."],
    [{ label: "Déposer ma candidature", href: "/carriere2" }],
  ),

  contact: answer(
    [
      `Adresse : ${CONTACT_ADDRESS}`,
      `Téléphone : ${CONTACT_PHONE}`,
      `Email : ${CONTACT_EMAIL}`,
      "Notre équipe répond sous 48 h ouvrées.",
    ],
    [CONTACT_LINK],
  ),

  about: answer(
    ["Connecteo est spécialisée dans l'expérience et la relation client, au sein du Groupe Axian."],
    [
      { label: "Notre histoire", href: "/notre-adn/a-propos" },
      { label: "Nos engagements", href: "/impact" },
      { label: "Le groupe AXIAN", href: "https://www.axian.com" },
    ],
  ),

  news: answer(
    ["Retrouvez nos articles, nos études et nos événements en images."],
    [{ label: "Voir les actualités", href: "/actus" }],
  ),

  thanks: {
    messages: ["Avec plaisir ! Puis-je vous aider pour autre chose ?"],
    choices: [BACK_TO_MENU],
  },
  fallback: {
    messages: [
      "Je n'ai pas toutes les réponses, mais notre équipe, si !",
      "Écrivez-nous directement, nous répondons sous 48 h ouvrées.",
    ],
    choices: [CONTACT_LINK, BACK_TO_MENU],
  },
};
