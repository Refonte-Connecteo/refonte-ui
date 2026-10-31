export type Offer = {
  slug: string;
  title: string;
  description: string;
  scopeTitle?: string;
  scopeText?: string;
  modalities?: string;
  benefits?: string[];
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

/**
 * Normalise un fragment d'URL (expertise ou offre) afin de pouvoir le
 * comparer à un slug de référence sans se soucier de la casse, des
 * accents, des espaces ou de l'encodage percent.
 */
export function normalizeSlug(value: string): string {
  let decoded = value;
  if (/%[0-9a-f]{2}/i.test(value)) {
    try {
      decoded = decodeURIComponent(value);
    } catch {
      decoded = value;
    }
  }
  return decoded
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** URL canonique d'une page d'offre. */
export function offerHref(expertiseSlug: string, offerSlug: string): string {
  return `/offer/${expertiseSlug}/${offerSlug}`;
}

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
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Prise en charge structurée des demandes entrantes pour assurer une assistance rapide, qualitative et accessible sur l'ensemble des canaux de communication.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Réduction des coûts opérationnels vs. gestion internalisée",
          "Amélioration mesurable du taux de résolution au premier contact (FCR)",
          "Continuité de service sans dépendance aux aléas RH internes",
          "Disponibilité multicanale sans surinvestissement technologique",
        ],
      },
      {
        slug: "campagnes-sortantes-engagement",
        title: "Campagnes Sortantes & Engagement Client / Citoyen",
        description:
          "Le bon contact au bon moment pour informer, accompagner et engager.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Déploiement de campagnes sortantes ciblées pour accompagner, informer et fidéliser les clients tout au long de leur cycle de vie, piloté par la donnée.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Réduction du churn précoce grâce à un accompagnement actif des nouveaux clients",
          "Augmentation du taux d'engagement sur la base installée",
          "Renforcement de la relation client sans mobiliser les équipes internes",
          "Résultats mesurables sur chaque campagne sortante",
        ],
      },
      {
        slug: "coordination-routage-omnicanal",
        title: "Coordination & Routage Omnicanal",
        description:
          "Une orchestration fluide pour une expérience cohérente sur tous les canaux.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Centralisation et orchestration intelligente des interactions clients pour garantir une continuité de service et une expérience homogène sur tous les canaux.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Élimination des doublons et pertes d'information entre canaux",
          "Réduction du temps de traitement global grâce au routage intelligent",
          "Expérience client unifiée sans rupture de contexte",
          "Réduction des transferts inutiles entre agents et services",
        ],
      },
      {
        slug: "reclamations-resolution-client",
        title: "Réclamations & Résolution Client",
        description:
          "Transformer chaque demande en résolution et chaque réclamation en opportunité de confiance.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Traitement structuré et priorisé des réclamations pour réduire l'insatisfaction, accélérer la résolution et renforcer la confiance client.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Réduction du délai de traitement des réclamations",
          "Amélioration de la satisfaction post-réclamation (facteur clé de fidélisation)",
          "Traçabilité complète des dossiers pour les enjeux de conformité",
          "Réduction du risque d'escalade et de bad buzz",
        ],
      },
      {
        slug: "support-dedie-grands-comptes-vip",
        title: "Support Dédié Grands Comptes & VIP",
        description:
          "Un accompagnement premium pour vos clients et partenaires stratégiques.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Dispositif d'accompagnement premium pour les clients stratégiques, avec des équipes dédiées garantissant un service sur mesure et une réactivité prioritaire.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Renforcement de la fidélité des clients à forte valeur",
          "Réduction du risque de perte de comptes stratégiques",
          "Expérience différenciante qui renforce la perception de qualité",
          "Libération des équipes commerciales pour des actions à plus forte valeur",
        ],
      },
      {
        slug: "orchestration-cycle-de-vie-client",
        title: "Orchestration du Cycle de Vie Client",
        description: "Le bon message, au bon moment, sur le bon canal.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Coordination intelligente des interactions et campagnes via l'automatisation et les données comportementales - le bon message, au bon moment, sur le bon canal.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Augmentation de la valeur vie client (LTV)",
          "Réduction du churn par anticipation des comportements à risque",
          "Personnalisation des communications sans investissement RH interne",
          "Optimisation du ROI des actions marketing et relationnelles",
        ],
      },
      {
        slug: "engagement-animation-communautes-digitales",
        title: "Engagement & Animation des Communautés Digitales",
        description:
          "Des communautés animées, modérées et engagées au quotidien.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Gestion et animation des interactions sociales pour renforcer la visibilité de la marque, développer l'engagement communautaire et piloter la réputation digitale en temps réel.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Renforcement de la notoriété et de l'image de marque sur les réseaux",
          "Développement organique de l'audience sans surcoût publicitaire",
          "Modération proactive et gestion des risques de réputation",
          "Veille continue sur les signaux faibles et risques de bad buzz",
        ],
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
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Gestion et sécurisation des opérations de paiement et de facturation pour améliorer la fiabilité des transactions et réduire les anomalies financières.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Réduction des erreurs et anomalies de facturation",
          "Amélioration du taux de recouvrement grâce aux relances préventives",
          "Traçabilité complète des transactions pour les audits",
          "Libération des équipes financières sur des tâches à plus forte valeur",
        ],
      },
      {
        slug: "devis-contrats",
        title: "Devis & Contrats",
        description:
          "Des documents commerciaux traités avec rapidité, précision et rigueur.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Traitement et contrôle rigoureux des documents commerciaux et contractuels pour garantir rapidité, conformité et qualité documentaire.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Réduction des délais de traitement documentaire",
          "Zéro dossier non conforme transmis aux clients",
          "Traçabilité documentaire pour les audits et le contentieux",
          "Réduction des erreurs de saisie et des reprises coûteuses",
        ],
      },
      {
        slug: "resiliations-retention",
        title: "Résiliations & Rétention",
        description:
          "Fluidifier la résiliation tout en identifiant les opportunités de rétention.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Traitement structuré des demandes de résiliation pour fluidifier les processus de clôture, limiter les frictions et activer des stratégies de rétention.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Réduction du taux de résiliation par des processus de sauvegarde actifs",
          "Gestion des frais transparente et sans litige",
          "Préservation de la relation client pour une réactivation future",
          "Conformité des processus de clôture aux obligations contractuelles",
        ],
      },
      {
        slug: "activation-de-services",
        title: "Activation de Services",
        description: "Une mise en service rapide, conforme et sans friction.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Exécution et suivi opérationnel des activations produit / service pour assurer une mise en service rapide, conforme et sans friction.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Réduction du délai de mise en service pour les clients finaux",
          "Zéro erreur d'activation grâce à des contrôles séquentiels rigoureux",
          "Amélioration de la satisfaction client à l'onboarding",
          "Libération des équipes techniques pour des tâches à plus forte valeur",
        ],
      },
      {
        slug: "certification-conformite-client",
        title: "Certification & Conformité Client",
        description:
          "Des contrôles clients rigoureux, traçables et conformes aux exigences réglementaires.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Contrôle et validation des dossiers clients dans le strict respect des exigences réglementaires et légales, avec traçabilité complète et auditabilité garantie.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Réduction du risque de non-conformité réglementaire (KYC, RGPD)",
          "Protection contre les fraudes documentaires",
          "Auditabilité complète des processus de validation",
          "Sécurisation des opérations sensibles sans ressource interne dédiée",
        ],
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
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Assistance technique multicanale pour diagnostiquer, qualifier et résoudre efficacement les incidents utilisateurs et systèmes, avec SLA définis et escalade structurée.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Réduction du temps d'arrêt technique pour les utilisateurs finaux",
          "Amélioration du taux de résolution sans intervention terrain",
          "Réduction des coûts de support vs. équipes internes dédiées",
          "Documentation des incidents pour capitalisation et amélioration continue",
        ],
      },
      {
        slug: "assistance-accompagnement-client-terrain",
        title: "Assistance & Accompagnement Client Terrain",
        description:
          "Prolonger la relation client au plus près des usages et des territoires.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Déploiement d'équipes d'agents terrain formés à la relation client pour assister, accompagner et servir les clients directement sur leur lieu de vie ou d'activité en complément des canaux voix et digitaux, ou en substitution sur les zones non couvertes.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Extension de la couverture de service vers des clients inaccessibles par les canaux distants",
          "Amélioration du taux de résolution des dossiers complexes nécessitant une présence physique",
          "Renforcement de la confiance et de la satisfaction client dans des marchés où le contact humain est déterminant",
          "Collecte structurée d'informations terrain pour alimenter les décisions stratégiques du partenaire",
        ],
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
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Détection d'opportunités, qualification de prospects et vente à distance pour accélérer la croissance commerciale, pilotée sur des objectifs mesurables.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Augmentation directe du CA via des ventes additionnelles",
          "Renforcement du pipeline commercial sans surcoût RH interne",
          "Amélioration du taux de transformation sur les leads existants",
          "Accélération du closing grâce à des équipes formées et pilotées",
        ],
      },
      {
        slug: "activation-reconquete-client",
        title: "Activation & Reconquête Client",
        description: "Réactiver les clients dormants et reconquérir les clients perdus.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Mise en œuvre de campagnes ciblées pour réengager les clients inactifs, récupérer les clients perdus et renforcer la fidélisation sur la base installée.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Augmentation directe du CA sur la base installée",
          "Réduction du coût d'acquisition vs. recrutement de nouveaux clients",
          "Réactivation mesurable de clients dormants avec ROI calculé",
          "Allongement de la durée de vie client (LTV améliorée)",
        ],
      },
      {
        slug: "retention-fidelisation-client",
        title: "Rétention & Fidélisation Client",
        description:
          "Préserver la valeur de votre base installée et réduire l'attrition.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Conception et déploiement de campagnes voix et digitales de rétention et de fidélisation pour renforcer l'engagement de la base installée, prévenir les départs et cultiver un lien émotionnel durable avec la marque.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Réduction mesurable du taux d'attrition sur la base installée",
          "Augmentation de la valeur vie client (LTV) grâce à un engagement renforcé",
          "Préservation du chiffre d'affaires récurrent sans surinvestissement en acquisition",
          "Renforcement du lien émotionnel avec la marque sur des marchés à forte dimension relationnelle",
        ],
      },
      {
        slug: "recouvrement-creances",
        title: "Recouvrement & Créances",
        description:
          "Optimiser le recouvrement tout en préservant la qualité de la relation.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Gestion proactive des créances et des relances pour optimiser le taux de recouvrement tout en préservant la qualité de la relation client.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Amélioration mesurable du taux de recouvrement amiable",
          "Réduction du passage en contentieux et des coûts associés",
          "Préservation de la relation client pendant le recouvrement",
          "Libération des équipes financières pour des activités à plus forte valeur",
        ],
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
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Cadrage fonctionnel puis mise en œuvre opérationnelle complète RH, process, technologie pour un lancement sans mauvaise surprise.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Lancement dans les délais et budgets définis",
          "Risques de création sans expertise évités",
          "Équipes formées et process documentés dès le Day 1",
        ],
      },
      {
        slug: "optimisation-processus-relation-client",
        title: "Optimisation des Processus de Relation Client",
        description: "Des process qui éliminent enfin les irritants.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Diagnostic, redesign et pilotage de la performance de vos processus pour réduire les coûts et fluidifier l'expérience.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Coûts de traitement réduits",
          "Délais et qualité de service mesurablement améliorés",
          "Pratiques standardisées dans toute l'organisation",
        ],
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
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Programmes de formation métier, coaching des managers, acculturation qualité et pilotage de la performance pour ancrer une culture durable.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Performance individuelle et collective améliorée",
          "Turnover réduit",
          "Culture qualité ancrée dans la durée",
        ],
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
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Déploiement d'outils (Hermes 360, Zendesk), intégration de l'IA (bots, analyse prédictive) et maintenance évolutive, adaptés à vos marchés.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Transformation digitale accélérée",
          "Coûts de traitement réduits par l'automatisation",
          "Expérience client améliorée",
        ],
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
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Location flexible de positions équipées, non-équipées ou sur-mesure pour accueillir vos équipes, quel que soit l'horizon du projet.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Investissements immobiliers et technologiques réduits",
          "Démarrage rapide sans délai d'aménagement",
          "Flexibilité selon l'évolution des volumes",
        ],
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
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Simulation du parcours client réel (physique, appel, digital) et évaluation des standards pour alimenter vos plans d'amélioration.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Écarts entre standards définis et réalité terrain identifiés",
          "Plans de formation directement alimentés",
          "Progression mesurée dans le temps",
        ],
      },
      {
        slug: "validation-concept-etudes-impact",
        title: "Validation de Concept & Études d'Impact",
        description: "Validez avant d'investir.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Études quantitatives et qualitatives pour mesurer l'impact d'un projet, produit ou service avant tout déploiement à grande échelle.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Décisions éclairées avant tout déploiement coûteux",
          "Risque d'échec au lancement réduit",
          "Données fiables pour convaincre vos parties prenantes",
        ],
      },
      {
        slug: "etudes-perception-satisfaction-positionnement",
        title: "Études de Perception, Satisfaction & Positionnement",
        description: "Votre image de marque, enfin mesurée.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Dispositifs NPS / CSAT / CES, études d'image et benchmark concurrentiel pour objectiver votre positionnement et vos priorités d'action.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Vision claire et objective de l'image de marque",
          "Scores actionnables suivis dans le temps",
          "Leviers de différenciation identifiés",
        ],
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
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Diagnostic partiel ou intégral du parcours réel, cartographie des points de friction et priorisation des axes de redesign.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Écarts entre parcours conçu et vécu identifiés",
          "Investissements CX mieux ciblés",
          "Légitimité pour engager la transformation",
        ],
      },
      {
        slug: "formalisation-standards-experience-client",
        title: "Formalisation des Standards d'Expérience Client",
        description: "Une expérience homogène, sur tous les canaux.",
        scopeTitle: "Ce que nous prenons en charge",
        scopeText:
          "Conception du parcours cible, formalisation d'un référentiel de standards et accompagnement jusqu'à la mise en œuvre terrain.",
        modalities:
          "Une même offre est accessible depuis son expertise, un enjeu de parcours ou un secteur d'activité.",
        benefits: [
          "Parcours documentés et partagés avec toutes les équipes",
          "Expérience homogène quel que soit le canal",
          "Performance mesurable par point de contact",
        ],
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

function findExpertise(expertises: Expertise[], slug: string): Expertise | undefined {
  const exact = expertises.find((e) => e.slug === slug);
  if (exact) return exact;
  const normalized = normalizeSlug(slug);
  return expertises.find((e) => normalizeSlug(e.slug) === normalized);
}

function findOffer(expertise: Expertise, slug: string): Offer | undefined {
  const exact = expertise.offers.find((o) => o.slug === slug);
  if (exact) return exact;
  const normalized = normalizeSlug(slug);
  // Les anciennes versions des pages listaires utilisaient le titre brut
  // comme slug : on tolère ce format pour ne pas casser les liens déjà diffusés.
  return (
    expertise.offers.find((o) => normalizeSlug(o.slug) === normalized) ??
    expertise.offers.find((o) => normalizeSlug(o.title) === normalized)
  );
}

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
    const expertise = findExpertise(config.expertises, expertiseSlug);
    if (!expertise) continue;
    const offer = findOffer(expertise, offerSlug);
    if (!offer) continue;

    const related = expertise.offers
      .filter((o) => o.slug !== offer.slug)
      .map((o) => ({
        label: o.title,
        href: offerHref(expertise.slug, o.slug),
      }));

    return {
      parent: config.parent,
      parentLabel: expertise.label,
      parentAnchor: `${config.parentAnchor}#${expertise.slug}`,
      title: offer.title,
      tagline: offer.description,
      scopeTitle: offer.scopeTitle ?? "Ce que nous prenons en charge",
      scopeText: offer.scopeText ?? DEFAULT_SCOPE_TEXT,
      modalities: offer.modalities ?? DEFAULT_MODALITIES,
      benefits: offer.benefits ?? DEFAULT_BENEFITS,
      cta: { label: "Parler à un expert", href: "/contact" },
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
