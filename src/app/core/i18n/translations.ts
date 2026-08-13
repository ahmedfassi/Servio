export type Language = 'en' | 'fr';

const EN_TRANSLATIONS = {
  meta: {
    title: 'Serv.io | Smarter restaurant management',
    description:
      'Serv.io connects menus, orders, staff, tables, payments and analytics for modern restaurants and cafés.',
  },
  nav: {
    home: 'Home',
    services: 'Services',
    about: 'About Us',
    policies: 'Policies',
    homeAria: 'Serv.io home',
    navigationAria: 'Main navigation',
    menuAria: 'Toggle navigation menu',
    languageAria: 'Choose language',
    englishAria: 'Switch to English',
    frenchAria: 'Switch to French',
  },
  home: {
    hero: {
      label: 'Smarter restaurant management',
      title: 'Run your restaurant',
      titleAccent: 'the smarter way.',
      rotatingPrefix: 'Built to',
      rotatingMessages: ['Manage faster', 'Serve smarter', 'Grow effortlessly'],
      rotatingAccessible: 'Manage faster, serve smarter, and grow effortlessly.',
      description:
        'Serv.io brings your menu, staff, tables, orders and payments together in one simple platform built for modern restaurants and cafés.',
      getStarted: 'Get started',
      exploreFeatures: 'Explore features',
      benefitsAria: 'Platform benefits',
      benefits: ['No credit card required', 'Quick setup', '24/7 support'],
    },
    dashboard: {
      previewAria: 'Serv.io dashboard preview',
      overview: 'Today’s overview',
      welcome: 'Welcome back!',
      profileAria: 'Profile for A',
      totalOrders: 'Total orders',
      revenue: 'Revenue',
      floorManagement: 'Floor management',
      tableStatus: 'Table status',
      live: 'Live',
      available: 'Available',
      occupied: 'Occupied',
      reserved: 'Reserved',
      orderCompleted: 'Order completed',
      table: 'Table',
    },
    stats: {
      aria: 'Serv.io results',
      labels: [
        'Faster order processing',
        'Platform availability',
        'Management tools',
        'Customer support',
      ],
    },
    floor: {
      eyebrow: 'Live floor intelligence',
      title: 'See the whole room.',
      titleAccent: 'Feel every moment.',
      legendAria: 'Table status legend',
      statuses: {
        available: 'Available',
        occupied: 'Occupied',
        preparing: 'Preparing',
        reserved: 'Reserved',
        paymentRequested: 'Payment requested',
        payment: 'Payment',
      },
      floorAria: 'Interactive restaurant floor',
      mainDining: 'Main dining',
      tableCount: '8 tables',
      kitchen: 'Kitchen',
      table: 'Table',
      selectedTable: 'Selected table',
      pauseUpdates: 'Pause updates',
      resumeUpdates: 'Resume updates',
      guests: 'Guests',
      currentAmount: 'Current amount',
      elapsed: 'Elapsed',
      synced: 'Synced across floor, kitchen and checkout',
      orderStatuses: {
        readyForGuests: 'Ready for guests',
        mainCoursesServed: 'Main courses served',
        kitchenPlating: 'Kitchen is plating',
        arrivalAt: 'Arrival at 20:00',
        drinksDelivered: 'Drinks delivered',
        billSent: 'Bill sent to table',
        resetComplete: 'Reset complete',
        orderAccepted: 'Order accepted',
        orderServed: 'Order served',
        readyToSettle: 'Ready to settle',
        tableReset: 'Table reset',
        orderDelivered: 'Order delivered',
        guestRequestedBill: 'Guest requested bill',
      },
    },
    flow: {
      eyebrow: 'One seamless guest journey',
      title: 'From first scan to',
      titleAccent: 'final tap.',
      aria: 'Serv.io product flow',
      steps: [
        { title: 'Scan QR', description: 'Instant table recognition' },
        { title: 'Browse menu', description: 'Beautiful, live choices' },
        { title: 'Place order', description: 'Clear, confident ordering' },
        { title: 'Kitchen receives it', description: 'No missed handoffs' },
        { title: 'Pay instantly', description: 'A graceful finish' },
      ],
    },
  },
  services: {
    eyebrow: 'One connected service flow',
    title: 'Everything in orbit.',
    titleAccent: 'Nothing out of reach.',
    intro:
      'Eight focused tools work as one calm operating system, so your team can spend less time managing software and more time creating memorable service.',
    orbitAria: 'Serv.io platform services',
    connectedBy: 'Connected by',
    onePlatform: 'One live platform',
    items: [
      {
        name: 'Digital menu',
        kicker: 'Always current',
        description: 'Update items, prices and availability instantly—without reprinting a thing.',
      },
      {
        name: 'QR ordering',
        kicker: 'Scan to serve',
        description: 'Let guests browse and order from their own device with a frictionless flow.',
      },
      {
        name: 'Staff roles',
        kicker: 'Clear ownership',
        description: 'Give every team member the right tools and permissions for their shift.',
      },
      {
        name: 'Real-time tracking',
        kicker: 'See every move',
        description: 'Follow orders from table to kitchen to checkout as the service unfolds.',
      },
      {
        name: 'Electronic payment',
        kicker: 'Secure by design',
        description: 'Accept modern payment methods through a clear, guest-friendly experience.',
      },
      {
        name: 'Fast checkout',
        kicker: 'Finish beautifully',
        description: 'Split, settle and close tables in seconds when guests are ready to leave.',
      },
      {
        name: 'Table management',
        kicker: 'Own the floor',
        description: 'Coordinate occupancy, reservations and service status from one live view.',
      },
      {
        name: 'Smart analytics',
        kicker: 'Know what works',
        description: 'Turn daily performance into practical insights for sharper decisions.',
      },
    ],
    noteEyebrow: 'Built to move together',
    noteTitle: 'From first scan to final receipt, every moment stays connected.',
    action: 'See Serv.io in action',
  },
  about: {
    heroEyebrow: 'Our story, still in motion',
    heroTitle: 'Hospitality moves fast.',
    heroTitleAccent: 'We help it flow.',
    heroIntro:
      'Serv.io began with a simple belief: restaurant technology should disappear into the rhythm of great service—not interrupt it. We are building the operating layer hospitality deserves.',
    journeyEyebrow: 'From friction to flow',
    journeyTitle: 'The Serv.io journey',
    journey: [
      {
        label: '01 / Problem',
        title: 'Too many tools.',
        titleSecond: 'Not enough clarity.',
        description:
          'Menus, tables, teams, orders and payments lived in separate systems. Staff spent their energy bridging gaps instead of caring for guests.',
        visualWords: ['Orders', 'Tables', 'Payments', 'Staff'],
        visualTitle: '',
        visualCaption: '',
      },
      {
        label: '02 / Idea',
        title: 'What if it all',
        titleSecond: 'spoke one language?',
        description:
          'We imagined one intuitive workspace shaped around how hospitality actually moves—from a guest’s first scan to the team’s final close.',
        visualWords: [],
        visualTitle: 'One',
        visualCaption: 'connected rhythm',
      },
      {
        label: '03 / Solution',
        title: 'A calmer way to',
        titleSecond: 'run every service.',
        description:
          'Serv.io connects the floor, kitchen, staff and guest experience in real time, turning operational noise into useful, timely action.',
        visualWords: [],
        visualTitle: 'Live & connected',
        visualCaption: '',
      },
      {
        label: '04 / Future',
        title: 'Intelligence that feels',
        titleSecond: 'instinctive.',
        description:
          'We are moving toward a future where every restaurant can anticipate demand, empower its people and make better decisions without losing its human touch.',
        visualWords: [],
        visualTitle: 'Next',
        visualCaption: 'is already serving',
      },
    ],
    principlesEyebrow: 'Our north star',
    principlesTitle: 'Built around people.',
    principlesTitleSecond: 'Measured by impact.',
    principles: [
      {
        title: 'Mission',
        description:
          'Give every hospitality team a simpler, smarter way to deliver remarkable service.',
      },
      {
        title: 'Vision',
        description:
          'A world where technology strengthens the human moments that make hospitality matter.',
      },
      {
        title: 'Values',
        description:
          'Clarity over complexity. Progress with purpose. Hospitality in every interaction.',
      },
    ],
    valuesEyebrow: 'Values in alignment',
    valuesTitle: 'Five points.',
    valuesTitleAccent: 'One shared direction.',
    valuesIntro: 'Choose a value to explore the principles behind every Serv.io decision.',
    valuesAria: 'Serv.io values constellation',
    values: [
      { name: 'Simplicity', description: 'Complex operations, made instinctive.' },
      { name: 'Speed', description: 'Every tap respects the pace of service.' },
      { name: 'Reliability', description: 'Steady technology for the busiest hours.' },
      { name: 'Insight', description: 'Clear signals that lead to better decisions.' },
      { name: 'Hospitality', description: 'Technology that keeps people at the center.' },
    ],
    demoEyebrow: 'Let’s shape what comes next',
    demoTitle: 'Your best service',
    demoTitleSecond: 'starts here.',
    demoDescription: 'See how Serv.io can fit the pace, personality and ambition of your venue.',
    demoAction: 'Explore the platform',
  },
  policies: {
    readingProgressAria: 'Reading progress',
    eyebrow: 'Clear by principle',
    title: 'Policies without',
    titleAccent: 'the small print feeling.',
    version: 'Version 1.0',
    updated: 'Last updated August 4, 2026',
    intro: 'Plain-language guidance for using Serv.io with confidence.',
    onPage: 'On this page',
    navigationAria: 'Policy sections',
    needClarity: 'Need clarity?',
    helpText: 'Ask us about any part of these policies.',
    copiedAnnouncement: 'Link copied to clipboard.',
    promiseTitle: 'Our plain-language promise',
    promiseText: 'We write for people first. Expand any section to read the details.',
    copyLink: 'Copy link',
    copied: 'Copied',
    copyAria: 'Copy link to',
    endTitle: 'End of policies',
    endText:
      'We review this page as Serv.io evolves. Material changes will be communicated clearly.',
    sections: [
      {
        id: 'privacy',
        number: '01',
        title: 'Privacy Policy',
        summary: 'How we collect, use and respect information across the Serv.io platform.',
        paragraphs: [
          'Serv.io processes information needed to provide restaurant and café management services. This may include account details, venue information, transaction records, device data and support conversations supplied by users or generated through normal platform use.',
          'We use this information to operate and improve the platform, support account security, deliver assistance, protect users, meet legal obligations and communicate important service updates. We do not sell personal information.',
        ],
        bullets: [
          'Account and business contact information',
          'Operational activity, orders and payment references',
          'Technical, security and support information',
        ],
      },
      {
        id: 'terms',
        number: '02',
        title: 'Terms and Conditions',
        summary: 'The fair-use terms that keep Serv.io reliable for every hospitality team.',
        paragraphs: [
          'By accessing Serv.io, users agree to provide accurate registration information, protect their account information and use the platform only for lawful business activity. Access is granted as a limited, non-transferable right for the subscribed venue or organisation.',
          'Platform availability may occasionally be affected by planned maintenance, urgent security work or circumstances outside reasonable control. We aim to communicate material interruptions and restore service promptly.',
        ],
        bullets: [
          'Do not attempt to bypass platform security or access controls',
          'Keep venue, billing and authorised-user details current',
          'Respect intellectual property and applicable local laws',
        ],
      },
      {
        id: 'cookies',
        number: '03',
        title: 'Cookie Policy',
        summary: 'A clear view of the small files that help Serv.io remain secure and useful.',
        paragraphs: [
          'Serv.io uses essential cookies and similar browser storage to maintain sessions, remember preferences, prevent fraud and understand basic platform performance. Essential cookies are required for secure platform features to work correctly.',
          'Where optional analytics are used, users will be given appropriate choices. Browser settings can also block or remove cookies, although doing so may affect secure sessions and saved preferences.',
        ],
        bullets: [
          'Essential storage for secure platform sessions',
          'Preference storage for a consistent experience',
          'Optional, consent-based performance measurement',
        ],
      },
      {
        id: 'payments',
        number: '04',
        title: 'Payment and Refund Policy',
        summary: 'How subscriptions, payment services and eligible refunds are handled.',
        paragraphs: [
          'Subscription charges are presented before purchase and billed according to the selected plan. Taxes, transaction fees or third-party payment costs may apply where disclosed. Venue operators remain responsible for reviewing guest transactions and payout details.',
          'Refund requests are assessed against the subscribed plan, the reason for the request and applicable consumer law. Approved refunds are returned through the original payment method; bank processing time may vary.',
        ],
        bullets: [
          'Report incorrect charges promptly with the relevant reference',
          'Guest refunds follow the venue’s own published terms',
          'Chargebacks may require supporting transaction records',
        ],
      },
      {
        id: 'protection',
        number: '05',
        title: 'Data Protection',
        summary: 'The safeguards and practices used to protect operational and personal data.',
        paragraphs: [
          'We apply proportionate technical and organisational controls designed to protect data from unauthorised access, alteration, loss or disclosure. These include access controls, role separation, monitored infrastructure and secure transmission practices.',
          'Data is retained only as long as needed for service delivery, legitimate business purposes and legal requirements. Depending on location and applicable law, individuals may have rights to access, correct, export, restrict or delete their personal data.',
        ],
        bullets: [
          'Role-based access for authorised team members',
          'Documented incident response and recovery practices',
          'Vendor assessment for relevant service providers',
        ],
      },
      {
        id: 'responsibilities',
        number: '06',
        title: 'User Responsibilities',
        summary: 'Simple responsibilities that protect guests, teams and the wider platform.',
        paragraphs: [
          'Account owners control who can access their Serv.io workspace and which permissions each person receives. They should review access regularly, remove former staff promptly and make sure shared devices are properly secured.',
          'Users are responsible for the accuracy and legality of menu content, prices, tax settings, customer notices and operational data entered into the platform. Suspected misuse or security incidents should be reported without delay.',
        ],
        bullets: [
          'Protect account details and private access information',
          'Assign only the permissions each staff member needs',
          'Maintain lawful menus, notices and customer communications',
        ],
      },
    ],
  },
  footer: {
    homeAria: 'Serv.io home',
    tagline: 'The calm, connected operating system for modern restaurants and cafés.',
    navigationAria: 'Footer navigation',
    explore: 'Explore',
    ready: 'Ready when you are',
    title: 'Make every service feel effortless.',
    bookDemo: 'Book a demo',
    copyright: 'Serv.io. Built for hospitality.',
    closing: 'Serve better. Know more.',
  },
};

export type Translations = typeof EN_TRANSLATIONS;

const FR_TRANSLATIONS: Translations = {
  meta: {
    title: 'Serv.io | Gestion de restaurant plus intelligente',
    description:
      'Serv.io réunit menus, commandes, personnel, tables, paiements et analyses pour les restaurants et cafés modernes.',
  },
  nav: {
    home: 'Accueil',
    services: 'Services',
    about: 'À propos',
    policies: 'Politiques',
    homeAria: 'Accueil Serv.io',
    navigationAria: 'Navigation principale',
    menuAria: 'Ouvrir ou fermer le menu de navigation',
    languageAria: 'Choisir la langue',
    englishAria: 'Passer en anglais',
    frenchAria: 'Passer en français',
  },
  home: {
    hero: {
      label: 'Une gestion de restaurant plus intelligente',
      title: 'Gérez votre restaurant',
      titleAccent: 'plus intelligemment.',
      rotatingPrefix: 'Conçu pour',
      rotatingMessages: ['Gérer plus vite', 'Mieux servir', 'Grandir sans effort'],
      rotatingAccessible: 'Gérez plus vite, servez mieux et grandissez sans effort.',
      description:
        'Serv.io réunit votre menu, votre équipe, vos tables, vos commandes et vos paiements sur une plateforme simple, conçue pour les restaurants et cafés modernes.',
      getStarted: 'Commencer',
      exploreFeatures: 'Découvrir les fonctionnalités',
      benefitsAria: 'Avantages de la plateforme',
      benefits: [
        'Aucune carte bancaire requise',
        'Configuration rapide',
        'Assistance 24 h/24, 7 j/7',
      ],
    },
    dashboard: {
      previewAria: 'Aperçu du tableau de bord Serv.io',
      overview: 'Aperçu du jour',
      welcome: 'Bon retour !',
      profileAria: 'Profil de A',
      totalOrders: 'Total des commandes',
      revenue: 'Chiffre d’affaires',
      floorManagement: 'Gestion de la salle',
      tableStatus: 'État des tables',
      live: 'En direct',
      available: 'Disponible',
      occupied: 'Occupée',
      reserved: 'Réservée',
      orderCompleted: 'Commande terminée',
      table: 'Table',
    },
    stats: {
      aria: 'Résultats Serv.io',
      labels: [
        'Traitement des commandes plus rapide',
        'Disponibilité de la plateforme',
        'Outils de gestion',
        'Assistance client',
      ],
    },
    floor: {
      eyebrow: 'Intelligence de salle en temps réel',
      title: 'Voyez toute la salle.',
      titleAccent: 'Maîtrisez chaque instant.',
      legendAria: 'Légende de l’état des tables',
      statuses: {
        available: 'Disponible',
        occupied: 'Occupée',
        preparing: 'En préparation',
        reserved: 'Réservée',
        paymentRequested: 'Paiement demandé',
        payment: 'Paiement',
      },
      floorAria: 'Plan interactif du restaurant',
      mainDining: 'Salle principale',
      tableCount: '8 tables',
      kitchen: 'Cuisine',
      table: 'Table',
      selectedTable: 'Table sélectionnée',
      pauseUpdates: 'Suspendre les mises à jour',
      resumeUpdates: 'Reprendre les mises à jour',
      guests: 'Couverts',
      currentAmount: 'Montant actuel',
      elapsed: 'Temps écoulé',
      synced: 'Synchronisé entre la salle, la cuisine et l’encaissement',
      orderStatuses: {
        readyForGuests: 'Prête à accueillir',
        mainCoursesServed: 'Plats principaux servis',
        kitchenPlating: 'Dressage en cuisine',
        arrivalAt: 'Arrivée à 20 h 00',
        drinksDelivered: 'Boissons servies',
        billSent: 'Addition envoyée à la table',
        resetComplete: 'Remise en place terminée',
        orderAccepted: 'Commande acceptée',
        orderServed: 'Commande servie',
        readyToSettle: 'Prête à être réglée',
        tableReset: 'Table remise en place',
        orderDelivered: 'Commande livrée',
        guestRequestedBill: 'Addition demandée par le client',
      },
    },
    flow: {
      eyebrow: 'Un parcours client parfaitement fluide',
      title: 'Du premier scan au',
      titleAccent: 'dernier geste.',
      aria: 'Parcours produit Serv.io',
      steps: [
        { title: 'Scanner le QR code', description: 'Reconnaissance instantanée de la table' },
        { title: 'Parcourir le menu', description: 'Des choix attrayants et actualisés' },
        { title: 'Passer commande', description: 'Une commande simple et sans hésitation' },
        { title: 'Réception en cuisine', description: 'Aucun relais manqué' },
        { title: 'Payer instantanément', description: 'Une fin de repas tout en douceur' },
      ],
    },
  },
  services: {
    eyebrow: 'Un service entièrement connecté',
    title: 'Tout gravite ensemble.',
    titleAccent: 'Tout reste à portée de main.',
    intro:
      'Huit outils ciblés fonctionnent comme un système d’exploitation serein et unifié, pour que votre équipe consacre moins de temps au logiciel et davantage à créer un service mémorable.',
    orbitAria: 'Services de la plateforme Serv.io',
    connectedBy: 'Connecté par',
    onePlatform: 'Une plateforme en direct',
    items: [
      {
        name: 'Menu numérique',
        kicker: 'Toujours à jour',
        description:
          'Actualisez instantanément les articles, les prix et les disponibilités, sans rien réimprimer.',
      },
      {
        name: 'Commande par QR code',
        kicker: 'Scanner pour servir',
        description:
          'Permettez aux clients de consulter et commander depuis leur appareil grâce à un parcours fluide.',
      },
      {
        name: 'Rôles du personnel',
        kicker: 'Des responsabilités claires',
        description:
          'Donnez à chaque membre de l’équipe les bons outils et droits pour son service.',
      },
      {
        name: 'Suivi en temps réel',
        kicker: 'Suivez chaque étape',
        description:
          'Suivez les commandes de la table à la cuisine, puis à l’encaissement, pendant le service.',
      },
      {
        name: 'Paiement électronique',
        kicker: 'Sécurisé par conception',
        description:
          'Acceptez les moyens de paiement modernes avec une expérience claire et agréable.',
      },
      {
        name: 'Encaissement rapide',
        kicker: 'Terminez en beauté',
        description:
          'Divisez, réglez et clôturez les tables en quelques secondes lorsque les clients sont prêts.',
      },
      {
        name: 'Gestion des tables',
        kicker: 'Maîtrisez la salle',
        description:
          'Coordonnez l’occupation, les réservations et l’état du service depuis une vue en direct.',
      },
      {
        name: 'Analyses intelligentes',
        kicker: 'Comprenez ce qui fonctionne',
        description:
          'Transformez les performances quotidiennes en informations utiles pour mieux décider.',
      },
    ],
    noteEyebrow: 'Conçu pour avancer ensemble',
    noteTitle: 'Du premier scan au reçu final, chaque moment reste connecté.',
    action: 'Voir Serv.io en action',
  },
  about: {
    heroEyebrow: 'Notre histoire continue de s’écrire',
    heroTitle: 'L’hospitalité va vite.',
    heroTitleAccent: 'Nous la rendons fluide.',
    heroIntro:
      'Serv.io est né d’une conviction simple : la technologie de restauration doit se fondre dans le rythme d’un excellent service, sans jamais l’interrompre. Nous construisons la couche opérationnelle que l’hospitalité mérite.',
    journeyEyebrow: 'Des obstacles à la fluidité',
    journeyTitle: 'Le parcours de Serv.io',
    journey: [
      {
        label: '01 / Problème',
        title: 'Trop d’outils.',
        titleSecond: 'Pas assez de clarté.',
        description:
          'Menus, tables, équipes, commandes et paiements vivaient dans des systèmes séparés. Le personnel dépensait son énergie à combler les écarts plutôt qu’à prendre soin des clients.',
        visualWords: ['Commandes', 'Tables', 'Paiements', 'Équipe'],
        visualTitle: '',
        visualCaption: '',
      },
      {
        label: '02 / Idée',
        title: 'Et si tout parlait',
        titleSecond: 'la même langue ?',
        description:
          'Nous avons imaginé un espace de travail intuitif, façonné autour du véritable rythme de l’hospitalité, du premier scan du client à la clôture finale de l’équipe.',
        visualWords: [],
        visualTitle: 'Un',
        visualCaption: 'rythme connecté',
      },
      {
        label: '03 / Solution',
        title: 'Une façon plus sereine',
        titleSecond: 'de gérer chaque service.',
        description:
          'Serv.io relie en temps réel la salle, la cuisine, l’équipe et l’expérience client, transformant le bruit opérationnel en actions utiles au bon moment.',
        visualWords: [],
        visualTitle: 'En direct et connecté',
        visualCaption: '',
      },
      {
        label: '04 / Avenir',
        title: 'Une intelligence',
        titleSecond: 'qui devient instinctive.',
        description:
          'Nous avançons vers un avenir où chaque restaurant peut anticiper la demande, donner plus de moyens à son équipe et mieux décider sans perdre sa touche humaine.',
        visualWords: [],
        visualTitle: 'Demain',
        visualCaption: 'est déjà servi',
      },
    ],
    principlesEyebrow: 'Notre cap',
    principlesTitle: 'Pensé autour des personnes.',
    principlesTitleSecond: 'Mesuré par son impact.',
    principles: [
      {
        title: 'Mission',
        description:
          'Offrir à chaque équipe une façon plus simple et plus intelligente de proposer un service remarquable.',
      },
      {
        title: 'Vision',
        description:
          'Un monde où la technologie renforce les moments humains qui donnent tout son sens à l’hospitalité.',
      },
      {
        title: 'Valeurs',
        description:
          'La clarté plutôt que la complexité. Le progrès avec un but. L’hospitalité dans chaque interaction.',
      },
    ],
    valuesEyebrow: 'Des valeurs alignées',
    valuesTitle: 'Cinq repères.',
    valuesTitleAccent: 'Une direction commune.',
    valuesIntro:
      'Choisissez une valeur pour découvrir les principes qui guident chaque décision de Serv.io.',
    valuesAria: 'Constellation des valeurs Serv.io',
    values: [
      { name: 'Simplicité', description: 'Des opérations complexes rendues instinctives.' },
      { name: 'Rapidité', description: 'Chaque geste respecte le rythme du service.' },
      {
        name: 'Fiabilité',
        description: 'Une technologie stable pendant les heures les plus intenses.',
      },
      { name: 'Clarté', description: 'Des signaux clairs pour prendre de meilleures décisions.' },
      { name: 'Hospitalité', description: 'Une technologie qui garde l’humain au centre.' },
    ],
    demoEyebrow: 'Façonnons ensemble la suite',
    demoTitle: 'Votre meilleur service',
    demoTitleSecond: 'commence ici.',
    demoDescription:
      'Découvrez comment Serv.io s’adapte au rythme, à la personnalité et à l’ambition de votre établissement.',
    demoAction: 'Découvrir la plateforme',
  },
  policies: {
    readingProgressAria: 'Progression de la lecture',
    eyebrow: 'La clarté par principe',
    title: 'Des politiques sans',
    titleAccent: 'l’effet des petites lignes.',
    version: 'Version 1.0',
    updated: 'Dernière mise à jour le 4 août 2026',
    intro: 'Des explications simples pour utiliser Serv.io en toute confiance.',
    onPage: 'Sur cette page',
    navigationAria: 'Sections des politiques',
    needClarity: 'Besoin d’éclaircissements ?',
    helpText: 'Posez-nous vos questions sur l’une de ces politiques.',
    copiedAnnouncement: 'Lien copié dans le presse-papiers.',
    promiseTitle: 'Notre promesse de clarté',
    promiseText:
      'Nous écrivons d’abord pour les personnes. Dépliez une section pour lire les détails.',
    copyLink: 'Copier le lien',
    copied: 'Copié',
    copyAria: 'Copier le lien vers',
    endTitle: 'Fin des politiques',
    endText:
      'Nous révisons cette page au fil de l’évolution de Serv.io. Toute modification importante sera communiquée clairement.',
    sections: [
      {
        id: 'privacy',
        number: '01',
        title: 'Politique de confidentialité',
        summary:
          'Comment nous recueillons, utilisons et respectons les informations sur la plateforme Serv.io.',
        paragraphs: [
          'Serv.io traite les informations nécessaires à la fourniture de services de gestion pour restaurants et cafés. Il peut s’agir des coordonnées du compte, des informations de l’établissement, des historiques de transaction, des données de l’appareil et des échanges avec l’assistance fournis par les utilisateurs ou générés lors de l’utilisation normale de la plateforme.',
          'Nous utilisons ces informations pour exploiter et améliorer la plateforme, sécuriser les comptes, fournir une assistance, protéger les utilisateurs, respecter nos obligations légales et communiquer les mises à jour importantes du service. Nous ne vendons pas les informations personnelles.',
        ],
        bullets: [
          'Coordonnées du compte et de l’entreprise',
          'Activité opérationnelle, commandes et références de paiement',
          'Informations techniques, de sécurité et d’assistance',
        ],
      },
      {
        id: 'terms',
        number: '02',
        title: 'Conditions générales',
        summary:
          'Les règles d’usage équitable qui assurent la fiabilité de Serv.io pour chaque équipe.',
        paragraphs: [
          'En accédant à Serv.io, les utilisateurs s’engagent à fournir des informations d’inscription exactes, à protéger les données de leur compte et à utiliser la plateforme uniquement pour une activité professionnelle légale. L’accès est accordé sous la forme d’un droit limité et non transférable à l’établissement ou à l’organisation abonnée.',
          'La disponibilité de la plateforme peut parfois être affectée par une maintenance planifiée, des travaux de sécurité urgents ou des circonstances hors de notre contrôle raisonnable. Nous nous efforçons de signaler les interruptions importantes et de rétablir rapidement le service.',
        ],
        bullets: [
          'Ne tentez pas de contourner la sécurité ou les contrôles d’accès de la plateforme',
          'Maintenez à jour les informations de l’établissement, de facturation et des utilisateurs autorisés',
          'Respectez la propriété intellectuelle et les lois locales applicables',
        ],
      },
      {
        id: 'cookies',
        number: '03',
        title: 'Politique relative aux cookies',
        summary:
          'Une présentation claire des petits fichiers qui aident Serv.io à rester sûr et utile.',
        paragraphs: [
          'Serv.io utilise des cookies essentiels et des technologies de stockage similaires pour maintenir les sessions, mémoriser les préférences, prévenir la fraude et comprendre les performances de base de la plateforme. Les cookies essentiels sont nécessaires au bon fonctionnement des fonctions sécurisées.',
          'Lorsque des analyses facultatives sont utilisées, les utilisateurs disposent des choix appropriés. Les paramètres du navigateur permettent aussi de bloquer ou supprimer les cookies, mais cela peut affecter les sessions sécurisées et les préférences enregistrées.',
        ],
        bullets: [
          'Stockage essentiel pour les sessions sécurisées de la plateforme',
          'Stockage des préférences pour une expérience cohérente',
          'Mesure facultative des performances fondée sur le consentement',
        ],
      },
      {
        id: 'payments',
        number: '04',
        title: 'Politique de paiement et de remboursement',
        summary:
          'Comment sont gérés les abonnements, les services de paiement et les remboursements admissibles.',
        paragraphs: [
          'Les frais d’abonnement sont présentés avant l’achat et facturés selon la formule choisie. Des taxes, frais de transaction ou coûts de paiement tiers peuvent s’appliquer lorsqu’ils sont indiqués. Les exploitants restent responsables de la vérification des transactions clients et des détails de versement.',
          'Les demandes de remboursement sont évaluées selon la formule souscrite, le motif de la demande et le droit de la consommation applicable. Les remboursements approuvés sont effectués par le moyen de paiement d’origine ; le délai de traitement bancaire peut varier.',
        ],
        bullets: [
          'Signalez rapidement toute facturation incorrecte avec la référence concernée',
          'Les remboursements clients suivent les propres conditions publiées de l’établissement',
          'Les contestations de paiement peuvent nécessiter des justificatifs de transaction',
        ],
      },
      {
        id: 'protection',
        number: '05',
        title: 'Protection des données',
        summary:
          'Les garanties et pratiques utilisées pour protéger les données opérationnelles et personnelles.',
        paragraphs: [
          'Nous appliquons des contrôles techniques et organisationnels proportionnés, conçus pour protéger les données contre les accès non autorisés, les modifications, les pertes ou les divulgations. Ils comprennent des contrôles d’accès, la séparation des rôles, une infrastructure surveillée et des pratiques de transmission sécurisée.',
          'Les données ne sont conservées que le temps nécessaire à la fourniture du service, aux objectifs professionnels légitimes et aux exigences légales. Selon leur lieu de résidence et la loi applicable, les personnes peuvent disposer de droits d’accès, de rectification, d’exportation, de limitation ou de suppression de leurs données personnelles.',
        ],
        bullets: [
          'Accès fondé sur les rôles pour les membres autorisés',
          'Procédures documentées de réponse aux incidents et de reprise',
          'Évaluation des prestataires de services concernés',
        ],
      },
      {
        id: 'responsibilities',
        number: '06',
        title: 'Responsabilités des utilisateurs',
        summary:
          'Des responsabilités simples qui protègent les clients, les équipes et toute la plateforme.',
        paragraphs: [
          'Les propriétaires du compte contrôlent les personnes qui accèdent à leur espace Serv.io et les autorisations attribuées à chacune. Ils doivent vérifier régulièrement les accès, retirer rapidement les anciens membres du personnel et sécuriser correctement les appareils partagés.',
          'Les utilisateurs sont responsables de l’exactitude et de la légalité du contenu des menus, des prix, des paramètres fiscaux, des avis aux clients et des données opérationnelles saisis dans la plateforme. Tout usage abusif ou incident de sécurité présumé doit être signalé sans délai.',
        ],
        bullets: [
          'Protégez les données du compte et les informations d’accès privées',
          'N’attribuez à chaque membre du personnel que les autorisations nécessaires',
          'Maintenez des menus, avis et communications clients conformes à la loi',
        ],
      },
    ],
  },
  footer: {
    homeAria: 'Accueil Serv.io',
    tagline: 'Le système d’exploitation serein et connecté des restaurants et cafés modernes.',
    navigationAria: 'Navigation du pied de page',
    explore: 'Explorer',
    ready: 'Quand vous êtes prêt',
    title: 'Rendez chaque service parfaitement fluide.',
    bookDemo: 'Réserver une démo',
    copyright: 'Serv.io. Conçu pour l’hospitalité.',
    closing: 'Mieux servir. Mieux comprendre.',
  },
};

export const TRANSLATIONS: Readonly<Record<Language, Translations>> = {
  en: EN_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
};
