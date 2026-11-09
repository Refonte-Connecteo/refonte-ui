// Contenu des secteurs d'activité, repris de la maquette « Solutions CX › Secteurs ».

export type Kpi = { value: string; label: string };

export type Secteur = {
  id: string;
  name: string;
  tagline: string;
  title: string;
  intro: string;
  challengeTitle: string;
  challenge: string;
  subSectors: { name: string; tags: string[] }[];
  solutions: { name: string; description: string }[];
  caseStudy: {
    title: string;
    defi: string;
    approche: string;
    kpis: Kpi[];
  };
};

export const secteurs: Secteur[] = [
  {
    id: "telecoms",
    name: "Télécoms & Technologies",
    tagline: "Connecter. Résoudre. Fidéliser.",
    title: "Des opérations aussi agiles que les usages qu'elles accompagnent.",
    intro:
      "Dans les télécoms et les technologies, chaque interaction compte : volumes fluctuants, nouveaux usages, incidents techniques, multiplication des canaux et attentes toujours plus fortes en matière de réactivité. La maîtrise des flux, l'excellence opérationnelle et la qualité de l'expérience client deviennent ainsi essentielles pour absorber la complexité tout en préservant la satisfaction et la fidélisation.",
    challengeTitle: "Quand la connectivité accélère, la relation doit suivre",
    challenge:
      "Les usages digitaux évoluent rapidement et les parcours clients deviennent de plus en plus fragmentés.",
    subSectors: [
      { name: "Télécommunications", tags: ["Mobile", "Internet", "Connectivité", "Services télécoms"] },
      { name: "Technologies & services digitaux", tags: ["Solutions digitales", "Plateformes", "Services technologiques"] },
      { name: "Services connectés", tags: ["Services numériques", "Contenus", "Solutions connectées"] },
      { name: "Médias & plateformes", tags: ["Accompagnement utilisateurs", "Support", "Engagement", "Fidélisation"] },
    ],
    solutions: [
      { name: "Accueil & Assistance Client / Citoyenne", description: "Fluidifier les parcours, absorber les volumes et apporter une réponse claire dès le premier contact." },
      { name: "Support Technique à Distance", description: "Qualifier les incidents, guider les utilisateurs et accélérer la résolution à distance." },
      { name: "Activation de Services", description: "Sécuriser l'activation des offres et réduire les frictions dès l'entrée en relation." },
      { name: "Rétention & Fidélisation Client", description: "Prévenir l'attrition et renforcer la valeur de la base installée." },
      { name: "Étude & Analyse du Parcours Client", description: "Identifier les irritants et prioriser les leviers d'amélioration du parcours." },
    ],
    caseStudy: {
      title: "Quand la volumétrie augmente sans compromis sur l'expérience",
      defi: "Accompagner un acteur télécom dans la prise en charge d'un volume important de demandes d'information et d'assistance, tout en maintenant un haut niveau de qualité et de réactivité.",
      approche:
        "Un dispositif structuré autour de la Relation & Expérience Client, du traitement des flux, du pilotage de la qualité et de l'adaptation des ressources aux variations d'activité.",
      kpis: [
        { value: "67 525", label: "appels traités" },
        { value: "79,53 %", label: "pris en charge en moins de 20 secondes" },
        { value: "93 %", label: "de qualité annuelle" },
      ],
    },
  },
  {
    id: "banque",
    name: "Banque, Finance & Assurance",
    tagline: "Sécuriser. Simplifier. Accélérer.",
    title: "Des opérations fiables pour des parcours qui inspirent confiance.",
    intro:
      "Dans les services financiers, chaque donnée compte, chaque dossier doit être fiable et chaque étape du parcours répond à des exigences élevées de conformité, de sécurité et de qualité. La maîtrise des processus, l'excellence opérationnelle et la fluidité des parcours permettent d'industrialiser les opérations tout en préservant la confiance et l'expérience client.",
    challengeTitle: "Quand la confiance se joue dans chaque détail",
    challenge:
      "Digitalisation des parcours, exigences réglementaires, volumes croissants et pression sur les délais : les acteurs financiers doivent conjuguer conformité, productivité et expérience client.",
    subSectors: [
      { name: "Banque & services financiers", tags: ["Comptes", "Services bancaires", "Opérations clients"] },
      { name: "Assurance", tags: ["Gestion des demandes", "Relation assurés", "Traitement documentaire"] },
      { name: "Crédit & financement", tags: ["Dossiers", "Vérification", "Suivi", "Recouvrement"] },
      { name: "Fintech & services financiers digitaux", tags: ["Onboarding", "KYC", "Assistance", "Parcours digitaux"] },
    ],
    solutions: [
      { name: "Certification & Conformité Client", description: "Fiabiliser les contrôles, les vérifications et la conformité des dossiers clients." },
      { name: "Devis & Contrats", description: "Industrialiser le traitement documentaire avec précision, traçabilité et maîtrise des délais." },
      { name: "Activation de Services", description: "Fluidifier les premières étapes de souscription et sécuriser la mise en service." },
      { name: "Facturation & Encaissement", description: "Sécuriser les opérations de paiement, de facturation et de suivi des anomalies." },
      { name: "Études de Perception, Satisfaction & Positionnement", description: "Mesurer la perception, la satisfaction et les attentes pour éclairer les décisions CX." },
    ],
    caseStudy: {
      title: "Industrialiser les flux sans perdre la précision",
      defi: "Absorber une volumétrie importante de dossiers de certification tout en maintenant un haut niveau de conformité, de qualité et de productivité.",
      approche:
        "Une organisation dédiée au traitement et au contrôle des dossiers, soutenue par un pilotage rapproché de la production, de la qualité et des principaux motifs de rejet.",
      kpis: [
        { value: "1 429 102", label: "dossiers traités" },
        { value: "119 574", label: "dossiers certifiés" },
        { value: "1 min 10", label: "de durée moyenne de traitement" },
        { value: "10 046", label: "appels traités" },
        { value: "90 %", label: "de service level < 20 sec" },
        { value: "89 %", label: "de résolution au premier contact" },
        { value: "94 %", label: "de clients satisfaits sur l'enquête NPS/CSAT" },
      ],
    },
  },
  {
    id: "energie",
    name: "Énergie & Services essentiels",
    tagline: "Informer. Accompagner. Résoudre.",
    title: "Des opérations qui restent disponibles quand le service est essentiel.",
    intro:
      "Dans l'énergie et les services essentiels, une interaction peut répondre à une urgence, résoudre un incident ou simplement permettre à un usager de mieux comprendre son service. La performance repose alors sur la capacité à absorber les flux, accélérer la prise en charge et maintenir une relation de proximité, même lorsque la demande est forte.",
    challengeTitle: "Quand l'urgence devient une exigence de service",
    challenge:
      "Incidents, demandes d'information, réclamations, accompagnement à l'usage ou suivi post-intervention : les services essentiels nécessitent une relation disponible et réactive.",
    subSectors: [
      { name: "Énergie", tags: ["Électricité", "Énergie solaire", "Services énergétiques"] },
      { name: "Utilities & services essentiels", tags: ["Services de proximité", "Infrastructures", "Services aux usagers"] },
      { name: "Électrification & accès à l'énergie", tags: ["Solutions énergétiques", "Déploiement territorial", "Impact communautaire"] },
    ],
    solutions: [
      { name: "Accueil & Assistance Client / Citoyenne", description: "Garantir une prise en charge accessible et réactive des demandes et incidents." },
      { name: "Support Technique à Distance", description: "Qualifier les incidents et accélérer leur résolution avec une escalade structurée." },
      { name: "Réclamations & Résolution Client", description: "Prendre en charge les irritants et sécuriser la résolution des demandes." },
      { name: "Assistance & Accompagnement Client Terrain", description: "Compléter les canaux à distance par une présence au plus près des usagers." },
      { name: "Rétention & Fidélisation Client", description: "Préserver la relation avec les clients à risque et renforcer la fidélisation." },
    ],
    caseStudy: {
      title: "Répondre vite. Résoudre dès le premier contact.",
      defi: "Assurer une prise en charge rapide des demandes tout en favorisant leur résolution dès le premier contact.",
      approche:
        "Un dispositif combinant Relation & Expérience Usager, assistance, gestion des demandes, appels de contrôle et écoute de la satisfaction.",
      // Chiffres repris tels quels de la maquette (les trois premiers sont identiques à ceux du secteur Banque).
      kpis: [
        { value: "1 429 102", label: "dossiers traités" },
        { value: "119 574", label: "dossiers certifiés" },
        { value: "1 min 10", label: "de durée moyenne de traitement" },
        { value: "99,49 %", label: "de note qualité" },
      ],
    },
  },
  {
    id: "distribution",
    name: "Grande distribution & Commerce",
    tagline: "Observer. Comprendre. Transformer.",
    title: "Chaque parcours client raconte quelque chose. À nous de le rendre exploitable.",
    intro:
      "Dans le commerce, l'expérience ne se joue plus uniquement au moment de l'achat. Chaque visite, interaction, avis ou réclamation contribue à la perception de la marque. L'enjeu est de capter ces signaux, d'identifier les irritants et de transformer la voix du client en décisions concrètes.",
    challengeTitle: "Quand chaque interaction influence la fidélité",
    challenge: "Les consommateurs comparent, évaluent, recommandent et changent rapidement d'enseigne.",
    subSectors: [
      { name: "Grande distribution", tags: ["Alimentaire", "Hygiène", "Équipement"] },
      { name: "Retail spécialisé", tags: ["Mode", "Électronique", "Maison", "Services"] },
      { name: "Réseaux de points de vente", tags: ["Franchises", "Réseaux intégrés", "Distribution"] },
      { name: "Commerce omnicanal", tags: ["Physique", "Digital", "Parcours hybrides"] },
    ],
    solutions: [
      { name: "Enquêtes Mystères & Retail Check", description: "Observer l'expérience réellement vécue en point de vente et à distance." },
      { name: "Études de Perception, Satisfaction & Positionnement", description: "Mesurer NPS, CSAT et perceptions pour identifier les leviers de fidélisation." },
      { name: "Étude & Analyse du Parcours Client", description: "Relier les points de contact et détecter les irritants qui freinent la conversion." },
      { name: "Formalisation des Standards d'Expérience Client", description: "Harmoniser les standards de service et leur déclinaison opérationnelle." },
      { name: "Campagnes Sortantes & Engagement Client / Citoyen", description: "Activer les clients et accompagner les campagnes commerciales ou relationnelles." },
    ],
    caseStudy: {
      title: "Transformer les perceptions en décisions",
      defi: "Mesurer l'impact réel d'une implantation commerciale et comprendre la perception des populations autour de nouvelles stations.",
      approche:
        "Une étude combinant collecte téléphonique, échantillonnage par quotas, monitoring qualité et analyse par localité, auprès de 3 753 individus répartis sur 9 localités.",
      kpis: [
        { value: "3 753", label: "individus interrogés" },
        { value: "9", label: "localités couvertes" },
        { value: "4", label: "dimensions d'impact analysées" },
        { value: "8,5/10", label: "d'impact global moyen" },
      ],
    },
  },
  {
    id: "industrie",
    name: "Industrie & Services B2B",
    tagline: "Comprendre. Coordonner. Faire avancer.",
    title: "Des opérations qui parlent le langage de votre métier.",
    intro:
      "Dans le B2B, les interactions sont rarement standardisées. Elles impliquent des processus spécifiques, plusieurs interlocuteurs et souvent des enjeux techniques ou contractuels. La performance repose sur une capacité à comprendre les processus métier, fluidifier les flux et apporter le niveau de précision attendu par les clients professionnels.",
    challengeTitle: "Quand la complexité opérationnelle ne doit pas ralentir le business",
    challenge:
      "Demandes techniques, coordination, traitement documentaire, suivi des dossiers ou gestion des réclamations : les opérations B2B nécessitent une approche structurée et une réelle compréhension métier.",
    subSectors: [
      { name: "Industrie", tags: ["Production", "Distribution", "Services industriels"] },
      { name: "Services professionnels", tags: ["Solutions aux entreprises", "Services techniques"] },
      { name: "B2B", tags: ["Opérateurs", "Fournisseurs", "Prestataires"] },
      { name: "Services à forte composante opérationnelle", tags: ["Gestion de dossiers", "Suivi", "Coordination"] },
    ],
    solutions: [
      { name: "Devis & Contrats", description: "Structurer le traitement des dossiers commerciaux et contractuels avec traçabilité." },
      { name: "Support Technique à Distance", description: "Qualifier les demandes techniques et accompagner les utilisateurs sur les problématiques métier." },
      { name: "Coordination & Routage Omnicanal", description: "Fluidifier les flux entre interlocuteurs et garantir la continuité du traitement." },
      { name: "Études de Perception, Satisfaction & Positionnement", description: "Faire remonter les attentes des clients professionnels et éclairer les décisions." },
      { name: "Optimisation des Processus de Relation Client", description: "Réduire les inefficacités et fiabiliser les processus à forte composante opérationnelle." },
    ],
    caseStudy: {
      title: "Faire du back-office un levier de performance",
      defi: "Prendre en charge des opérations documentaires à volumétrie variable, avec des exigences fortes de complétude, de qualité et de délai.",
      approche:
        "Un dispositif de Back-office & Workflow Management associant traitement, contrôle continu, revérification documentaire et coaching de proximité.",
      kpis: [
        { value: "+51 %", label: "de dossiers de recouvrement judiciaire traités en 2025 (de 352 à 530)" },
        { value: "100 %", label: "de traitement des dossiers reçus en décembre" },
      ],
    },
  },
  {
    id: "public",
    name: "Secteur public & Institutions",
    tagline: "Écouter. Informer. Orienter.",
    title: "Des dispositifs de contact qui rapprochent les services de ceux qui en ont besoin.",
    intro:
      "Pour les institutions, chaque interaction est une occasion d'informer, d'orienter et de mieux comprendre les besoins des citoyens. La performance repose sur des dispositifs capables de gérer les volumes, de diffuser une information fiable et de faire remonter la voix du citoyen à grande échelle.",
    challengeTitle: "Quand le service public doit gagner en proximité",
    challenge:
      "Demandes nombreuses, procédures complexes, besoin d'information, campagnes de sensibilisation et suivi des réclamations : les institutions doivent pouvoir répondre à grande échelle sans perdre la dimension humaine de la relation.",
    subSectors: [
      { name: "Administrations publiques", tags: ["Services administratifs", "Information", "Assistance"] },
      { name: "Institutions", tags: ["Programmes", "Dispositifs citoyens", "Information"] },
      { name: "Services publics", tags: ["Accès aux services", "Orientation", "Assistance"] },
      { name: "Programmes de développement public", tags: ["Campagnes", "Sensibilisation", "Collecte"] },
    ],
    solutions: [
      { name: "Accueil & Assistance Client / Citoyenne", description: "Créer une interface accessible entre institutions et populations." },
      { name: "Campagnes Sortantes & Engagement Client / Citoyen", description: "Diffuser l'information et accompagner les citoyens dans leurs démarches." },
      { name: "Coordination & Routage Omnicanal", description: "Orchestrer voix, digital et dispositifs de proximité pour assurer la continuité." },
      { name: "Réclamations & Résolution Client", description: "Structurer la réception, la qualification et le suivi des demandes." },
      { name: "Études de Perception, Satisfaction & Positionnement", description: "Transformer la voix du citoyen en données utiles au pilotage." },
    ],
    caseStudy: {
      title: "Faire passer la relation citoyenne à l'échelle",
      defi: "Mettre à disposition un dispositif capable d'informer et d'accompagner les citoyens sur plusieurs procédures, tout en assurant une couverture multicanale.",
      approche:
        "Un dispositif de Relation & Expérience Citoyen combinant lignes dédiées, appels entrants, campagnes sortantes, SMS et équipes formées aux procédures administratives.",
      kpis: [
        { value: "392 192", label: "appels entrants traités" },
        { value: "117 909", label: "appels sortants" },
        { value: "31 457", label: "SMS envoyés" },
        { value: "96 %", label: "de qualité moyenne" },
        { value: "62", label: "agents formés" },
      ],
    },
  },
  {
    id: "ong",
    name: "ONG, Bailleurs & Développement",
    tagline: "Écouter. Mesurer. Éclairer.",
    title: "Transformer les réalités du terrain en données utiles à la décision.",
    intro:
      "Dans les projets de développement, la qualité d'une décision dépend directement de la qualité des données disponibles. Atteindre les populations, fiabiliser les informations collectées et mesurer les effets d'un programme sont essentiels pour transformer les réalités du terrain en enseignements exploitables.",
    challengeTitle: "Quand la donnée devient un levier d'impact",
    challenge:
      "Populations difficiles à atteindre, dispersion géographique, exigences de représentativité, mesure d'impact et reporting : les projets de développement nécessitent une collecte structurée et une donnée fiable.",
    subSectors: [
      { name: "ONG", tags: ["Programmes communautaires", "Sensibilisation", "Évaluation"] },
      { name: "Bailleurs & partenaires techniques", tags: ["Monitoring", "Reporting", "Évaluation"] },
      { name: "Organisations internationales", tags: ["Collecte", "Études", "Mesure d'impact"] },
      { name: "Programmes de développement", tags: ["Insertion", "Éducation", "Accès aux services"] },
    ],
    solutions: [
      { name: "Campagnes Sortantes & Engagement Client / Citoyen", description: "Déployer des campagnes de collecte, sensibilisation et engagement auprès des populations." },
      { name: "Études de Perception, Satisfaction & Positionnement", description: "Recueillir perceptions, expériences et attentes directement auprès des bénéficiaires." },
      { name: "Validation de Concept & Études d'Impact", description: "Mesurer les effets d'un programme et éclairer les décisions de déploiement." },
      { name: "Enquêtes Mystères & Retail Check", description: "Contrôler la réalité d'un dispositif ou d'un service sur le terrain lorsque pertinent." },
      { name: "Étude & Analyse du Parcours Client", description: "Comprendre les parcours des bénéficiaires et identifier les points de friction." },
    ],
    caseStudy: {
      title: "Mesurer l'impact au plus près des populations",
      defi: "Évaluer l'impact socio-économique et environnemental de nouvelles infrastructures sur les populations riveraines.",
      approche:
        "Une collecte par appels sortants menée auprès de 3 753 individus, répartis dans 9 localités, selon des quotas d'âge, de sexe et de catégorie socioprofessionnelle, avec monitoring qualité et analyse par localité.",
      kpis: [
        { value: "3 753", label: "individus interrogés" },
        { value: "9", label: "localités couvertes" },
        { value: "4", label: "dimensions d'impact mesurées" },
        { value: "8,5/10", label: "d'impact global moyen" },
      ],
    },
  },
  {
    id: "sante",
    name: "Santé",
    tagline: "Écouter. Comprendre. Mieux accompagner.",
    title: "Donner une voix aux populations pour mieux comprendre les besoins et mesurer l'impact.",
    intro:
      "Dans le secteur de la santé, comprendre les perceptions, les comportements et les besoins des populations permet de mieux orienter les actions. Les dispositifs d'écoute et de collecte doivent donc conjuguer accessibilité, qualité des données et capacité d'analyse pour transformer les réalités du terrain en informations utiles à l'action.",
    challengeTitle: "Quand mieux comprendre permet de mieux agir",
    challenge:
      "Évolution des comportements, difficulté à atteindre certaines populations, mesure de la mémorisation des campagnes, perception des actions de prévention ou suivi des programmes : les enjeux de santé nécessitent une écoute fine du terrain.",
    subSectors: [
      { name: "Santé publique", tags: ["Prévention", "Information", "Sensibilisation"] },
      { name: "Programmes communautaires", tags: ["Accès", "Adoption", "Perception"] },
      { name: "Campagnes de sensibilisation", tags: ["Notoriété", "Compréhension", "Mémorisation"] },
      { name: "Études populationnelles", tags: ["Perception", "Comportement", "Impact"] },
    ],
    solutions: [
      { name: "Études de Perception, Satisfaction & Positionnement", description: "Comprendre perceptions, attentes, comportements et freins des populations." },
      { name: "Campagnes Sortantes & Engagement Client / Citoyen", description: "Déployer des campagnes d'information, de sensibilisation et de suivi." },
      { name: "Validation de Concept & Études d'Impact", description: "Mesurer la portée, la compréhension et les effets des dispositifs de santé." },
      { name: "Étude & Analyse du Parcours Client", description: "Identifier les étapes, irritants et moments clés des parcours de prise en charge." },
      { name: "Enquêtes Mystères & Retail Check", description: "Évaluer l'expérience réellement vécue dans les points de contact lorsque le dispositif s'y prête." },
    ],
    caseStudy: {
      title: "Comprendre pour mieux agir",
      defi: "Atteindre les populations, mesurer la perception des campagnes et transformer les retours terrain en enseignements exploitables.",
      approche:
        "Un dispositif combinant enquêtes de perception, collecte de données, études comportementales, sensibilisation et monitoring des résultats.",
      kpis: [],
    },
  },
];
