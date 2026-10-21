export type Offer = {
  slug: string;
  title: string;
  description: string;
};

export type Expertise = {
  slug: string;
  label: string;
  offers: Offer[];
};

export type OfferDetail = {
  parent: string;
  parentLabel: string;
  parentAnchor: string;
  title: string;
  tagline: string;
  scopeTitle: string;
  scopeText: string;
  modalities: string;
  benefits: string[];
  cta: { label: string; href: string };
  related: { label: string; href: string }[];
};

export const OUTSOURCING_EXPERTISES: Expertise[] = [
  {
    slug: "experience-client-omnicanale-externalisee",
    label: "Expérience Client Omnicanale Externalisée",
    offers: [
      {
        slug: "accueil-assistance-client-citoyenne",
        title: "Accueil & Assistance Client / Citoyenne",
        description:
          "Une assistance accessible, réactive et cohérente sur chaque canal.",
      },
      {
        slug: "campagnes-sortantes-engagement",
        title: "Campagnes Sortantes & Engagement Client / Citoyen",
        description:
          "Le bon contact au bon moment pour informer, accompagner et engager.",
      },
      {
        slug: "coordination-routage-omnicanal",
        title: "Coordination & Routage Omnicanal",
        description:
          "Une orchestration fluide pour une expérience cohérente sur tous les canaux.",
      },
      {
        slug: "reclamations-resolution-client",
        title: "Réclamations & Résolution Client",
        description:
          "Transformer chaque demande en résolution et chaque réclamation en opportunité de confiance.",
      },
      {
        slug: "support-dedie-grands-comptes-vip",
        title: "Support Dédié Grands Comptes & VIP",
        description:
          "Un accompagnement premium pour vos clients et partenaires stratégiques.",
      },
      {
        slug: "orchestration-cycle-de-vie-client",
        title: "Orchestration du Cycle de Vie Client",
        description: "Le bon message, au bon moment, sur le bon canal.",
      },
      {
        slug: "engagement-animation-communautes-digitales",
        title: "Engagement & Animation des Communautés Digitales",
        description:
          "Des communautés animées, modérées et engagées au quotidien.",
      },
    ],
  },
  {
    slug: "back-office-client-gestion-administrative",
    label: "Back-Office Client & Gestion Administrative",
    offers: [
      {
        slug: "facturation-encaissement",
        title: "Facturation & Encaissement",
        description:
          "Des opérations de facturation et d'encaissement fiables, traçables et fluides.",
      },
      {
        slug: "devis-contrats",
        title: "Devis & Contrats",
        description:
          "Des documents commerciaux traités avec rapidité, précision et rigueur.",
      },
      {
        slug: "resiliations-retention",
        title: "Résiliations & Rétention",
        description:
          "Fluidifier la résiliation tout en identifiant les opportunités de rétention.",
      },
      {
        slug: "activation-de-services",
        title: "Activation de Services",
        description: "Une mise en service rapide, conforme et sans friction.",
      },
      {
        slug: "certification-conformite-client",
        title: "Certification & Conformité Client",
        description:
          "Des contrôles clients rigoureux, traçables et conformes aux exigences réglementaires.",
      },
    ],
  },
  {
    slug: "support-technique-continuite-de-service",
    label: "Support Technique & Continuité de Service",
    offers: [
      {
        slug: "support-technique-a-distance",
        title: "Support Technique à Distance",
        description: "Un incident, une réponse experte et une résolution structurée.",
      },
      {
        slug: "assistance-accompagnement-client-terrain",
        title: "Assistance & Accompagnement Client Terrain",
        description:
          "Prolonger la relation client au plus près des usages et des territoires.",
      },
    ],
  },
  {
    slug: "activation-commerciale-croissance-client",
    label: "Activation Commerciale & Croissance Client",
    offers: [
      {
        slug: "televente-developpement-commercial",
        title: "Télévente & Développement Commercial",
        description:
          "Transformer les opportunités qualifiées en croissance mesurable.",
      },
      {
        slug: "activation-reconquete-client",
        title: "Activation & Reconquête Client",
        description: "Réactiver les clients dormants et reconquérir les clients perdus.",
      },
      {
        slug: "retention-fidelisation-client",
        title: "Rétention & Fidélisation Client",
        description:
          "Préserver la valeur de votre base installée et réduire l'attrition.",
      },
      {
        slug: "recouvrement-creances",
        title: "Recouvrement & Créances",
        description:
          "Optimiser le recouvrement tout en préservant la qualité de la relation.",
      },
    ],
  },
];

export const CONSULTING_EXPERTISES: Expertise[] = [
  {
    slug: "strategie-transformation-relation-client",
    label: "Stratégie & Transformation de la Relation Client",
    offers: [
      {
        slug: "accompagnement-creation-centre-de-contact",
        title: "Accompagnement à la Création d'un Centre de Contact",
        description: "Votre centre de contact, pensé et lancé par des experts.",
      },
      {
        slug: "optimisation-processus-relation-client",
        title: "Optimisation des Processus de Relation Client",
        description: "Des process qui éliminent enfin les irritants.",
      },
    ],
  },
  {
    slug: "renforcement-competences-excellence-operationnelle",
    label: "Renforcement des Compétences & Excellence Opérationnelle",
    offers: [
      {
        slug: "formation-coaching",
        title: "Formation & Coaching",
        description: "Des équipes formées, motivées, qui durent.",
      },
    ],
  },
  {
    slug: "innovation-digitalisation-relation-client",
    label: "Innovation & Digitalisation de la Relation Client",
    offers: [
      {
        slug: "innovation-digitalisation-relation-client",
        title: "Innovation & Digitalisation de la Relation Client",
        description: "La technologie au service d'une relation client plus humaine.",
      },
    ],
  },
  {
    slug: "mise-a-disposition-infrastructure-espaces-travail",
    label: "Mise à Disposition d'Infrastructure & Espaces de Travail",
    offers: [
      {
        slug: "location-positions-espaces-travail",
        title: "Location de Positions & Espaces de Travail",
        description:
          "Un centre de contact opérationnel, sans immobiliser votre capital.",
      },
    ],
  },
  {
    slug: "etudes-voix-du-client-voc",
    label: "Études & Voix du Client (VoC)",
    offers: [
      {
        slug: "enquetes-mysteres-retail-check",
        title: "Enquêtes Mystères & Retail Check",
        description: "La vérité sur votre qualité de service, mesurée objectivement.",
      },
      {
        slug: "validation-concept-etudes-impact",
        title: "Validation de Concept & Études d'Impact",
        description: "Validez avant d'investir.",
      },
      {
        slug: "etudes-perception-satisfaction-positionnement",
        title: "Études de Perception, Satisfaction & Positionnement",
        description: "Votre image de marque, enfin mesurée.",
      },
    ],
  },
  {
    slug: "diagnostic-cx-360-optimisation-parcours-client",
    label: "Diagnostic CX 360° & Optimisation des Parcours Client",
    offers: [
      {
        slug: "etude-analyse-parcours-client",
        title: "Étude & Analyse du Parcours Client",
        description: "Voyez votre parcours client comme vos clients le vivent.",
      },
      {
        slug: "formalisation-standards-experience-client",
        title: "Formalisation des Standards d'Expérience Client",
        description: "Une expérience homogène, sur tous les canaux.",
      },
    ],
  },
];

const DEFAULT_SCOPE_TEXT =
  "Prise en charge structurée des demandes entrantes pour assurer une assistance rapide, qualitative et accessible sur l'ensemble des canaux de communication.";

const DEFAULT_MODALITIES =
  "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité";

const DEFAULT_BENEFITS = [
  "Réduction des coûts opérationnels vs. gestion internalisée",
  "Amélioration mesurable du taux de résolution au premier contact (FCR)",
  "Continuité de service sans dépendance aux aléas RH internes",
  "Disponibilité multicanale sans surinvestissement technologique",
];

export function getOfferDetail(
  expertiseSlug: string,
  offerSlug: string
): OfferDetail | null {
  const configs = [
    {
      expertises: OUTSOURCING_EXPERTISES,
      parent: "Outsourcing",
      parentLabel: "Outsourcing",
      parentAnchor: "/outs",
    },
    {
      expertises: CONSULTING_EXPERTISES,
      parent: "Consulting",
      parentLabel: "Consulting",
      parentAnchor: "/cons",
    },
  ];

  for (const config of configs) {
    const expertise = config.expertises.find((e) => e.slug === expertiseSlug);
    if (!expertise) continue;
    const offer = expertise.offers.find((o) => o.slug === offerSlug);
    if (!offer) continue;

    const related = expertise.offers
      .filter((o) => o.slug !== offer.slug)
      .map((o) => ({
        label: o.title,
        href: `/offer/${expertise.slug}/${o.slug}`,
      }));

    return {
      parent: config.parent,
      parentLabel: config.parentLabel,
      parentAnchor: `${config.parentAnchor}#${expertise.slug}`,
      title: offer.title,
      tagline: offer.description,
      scopeTitle: "Ce que nous prenons en charge",
      scopeText: DEFAULT_SCOPE_TEXT,
      modalities: DEFAULT_MODALITIES,
      benefits: DEFAULT_BENEFITS,
      cta: { label: "Parler à un expert", href: "#contact" },
      related,
    };
  }

  return null;
}

export function getAllOfferParams(): { expertise: string; offer: string }[] {
  const params: { expertise: string; offer: string }[] = [];
  for (const expertise of [...OUTSOURCING_EXPERTISES, ...CONSULTING_EXPERTISES]) {
    for (const offer of expertise.offers) {
      params.push({ expertise: expertise.slug, offer: offer.slug });
    }
  }
  return params;
}
