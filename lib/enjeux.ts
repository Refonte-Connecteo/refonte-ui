// Contenu de la frise « Vos enjeux, nos solutions CX », repris de la maquette.
// Les noms de solutions doivent correspondre exactement aux titres des offres de lib/solutions.ts.

export type Etape = {
  title: string;
  quote: string;
  description: string;
  solutions: string[];
};

export type Parcours = {
  id: "client" | "transformation";
  label: string;
  pole: "Outsourcing" | "Consulting";
  intro: string;
  etapes: Etape[];
};

export const parcours: Parcours[] = [
  {
    id: "client",
    label: "Parcours client final",
    pole: "Outsourcing",
    intro: "Suivez votre client final, de la découverte jusqu'au départ, et les solutions qui l'accompagnent à chaque étape.",
    etapes: [
      {
        title: "Attirer & Acquérir",
        quote: "Je découvre, je m'informe, je décide",
        description:
          "Nous aidons les entreprises à attirer de nouveaux clients grâce à des campagnes de prospection ciblées, puis à transformer ces contacts en opportunités commerciales concrètes.",
        solutions: ["Télévente & Développement Commercial", "Campagnes Sortantes & Engagement Client / Citoyen"],
      },
      {
        title: "Onboarder & Activer",
        quote: "Je viens de souscrire, j'ai besoin d'être guidé",
        description:
          "Nous simplifions l'arrivée de chaque nouveau client en assurant un parcours fluide : gestion administrative, activation des services, conformité et accompagnement personnalisé.",
        solutions: [
          "Devis & Contrats",
          "Activation de Services",
          "Certification & Conformité Client",
          "Assistance & Accompagnement Client Terrain",
        ],
      },
      {
        title: "Servir & Assister",
        quote: "Je suis client actif, j'ai besoin d'aide au quotidien",
        description:
          "Nous prenons en charge l'ensemble de la relation client au quotidien : assistance omnicanale, support technique, gestion des demandes et accompagnement des clients stratégiques.",
        solutions: [
          "Accueil & Assistance Client / Citoyenne",
          "Coordination & Routage Omnicanal",
          "Réclamations & Résolution Client",
          "Support Technique à Distance",
          "Support Dédié Grands Comptes & VIP",
        ],
      },
      {
        title: "Facturer & Encaisser",
        quote: "Je paye, je gère mes factures",
        description:
          "Nous sécurisons le processus de facturation et facilitons les encaissements afin d'offrir une expérience simple, fiable et transparente.",
        solutions: ["Facturation & Encaissement"],
      },
      {
        title: "Retenir & Développer",
        quote: "Je suis actif dans la durée, on prend soin de moi",
        description:
          "Nous renforçons la fidélité de vos clients grâce à des actions personnalisées de rétention, de réactivation et d'animation tout au long de leur parcours.",
        solutions: [
          "Orchestration du Cycle de Vie Client",
          "Rétention & Fidélisation Client",
          "Activation & Reconquête Client",
          "Engagement & Animation des Communautés Digitales",
        ],
      },
      {
        title: "Recouvrer & Résilier",
        quote: "J'ai un litige, un impayé ou je veux partir",
        description:
          "Nous gérons avec professionnalisme les situations sensibles : impayés, litiges et résiliations, tout en préservant autant que possible la relation client.",
        solutions: ["Recouvrement & Créances", "Résiliations & Rétention"],
      },
    ],
  },
  {
    id: "transformation",
    label: "Parcours de transformation",
    pole: "Consulting",
    intro: "Faites évoluer votre relation client, du diagnostic jusqu'à l'ancrage durable des nouvelles pratiques.",
    etapes: [
      {
        title: "Diagnostiquer",
        quote: "Je veux comprendre où j'en suis",
        description:
          "Analyse structurelle du parcours, des processus et de la perception client, production d'un diagnostic factuel qui alimente les décisions de transformation.",
        solutions: [
          "Étude & Analyse du Parcours Client",
          "Optimisation des Processus de Relation Client",
          "Enquêtes Mystères & Retail Check",
          "Études de Perception, Satisfaction & Positionnement",
        ],
      },
      {
        title: "Concevoir",
        quote: "Je veux définir ce qui doit changer",
        description:
          "Formalisation de la cible : validation des nouveaux concepts, conception des standards d'expérience et cadrage fonctionnel des dispositifs à déployer.",
        solutions: [
          "Validation de Concept & Études d'Impact",
          "Formalisation des Standards d'Expérience Client",
          "Accompagnement à la Création d'un Centre de Contact",
        ],
      },
      {
        title: "Déployer",
        quote: "Je veux mettre en œuvre",
        description:
          "Passage à l'action : intégration des solutions technologiques et digitales, déploiement d'infrastructure et accompagnement opérationnel de la mise en service.",
        solutions: ["Innovation & Digitalisation de la Relation Client", "Location de Positions & Espaces de Travail"],
      },
      {
        title: "Ancrer & Développer",
        quote: "Je veux professionnaliser et pérenniser",
        description:
          "Consolidation dans la durée : renforcement des compétences, ancrage de la culture qualité et pilotage continu de la performance.",
        solutions: ["Formation & Coaching"],
      },
    ],
  },
];
