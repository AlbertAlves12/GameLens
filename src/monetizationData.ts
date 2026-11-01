/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GameReview {
  gameId: string;
  gameName: string;
  badge: 'Obra-Prima' | 'Essencial' | 'Excelente' | 'Muito Recomendado';
  badgeColor: string;
  score: number; // Ex: 9.8
  scores: {
    gameplay: number;
    graphics: number;
    narrative: number;
    replayability: number;
    valueForMoney: number;
  };
  headline: string;
  verdictLead: string;
  fullAnalysis: string;
  pros: string[];
  cons: string[];
  bottomLine: string;
  author: string;
  readTime: string;
  updatedAt: string;
  bestDeal: {
    partnerStore: 'Nuuvem' | 'Amazon Games' | 'Green Man Gaming' | 'Steam';
    discountLabel: string;
    suggestedPrice: string;
    couponCode?: string;
  };
  generatedByAi?: boolean;
}

export interface MonetizationSettings {
  pixKey: string;
  pixReceiverName: string;
  pixCity: string;
  rakutenSid?: string;
  hypeMid?: string;
  nuuvemPartnerId: string;
  amazonAssociateId: string;
  gmgAffiliateId: string;
  humblePartnerId: string;
  adsensePublisherId: string;
  adsEnabled: boolean;
  editorialName: string;
}

export interface DealItem {
  id: string;
  name: string;
  platform: 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo';
  platform_label: string;
  store: 'Nuuvem' | 'Hype Games' | 'Amazon';
  regular_price: number;
  deal_price: number;
  discount_percent: number;
  rating: number;
  deal_url: string;
  image: string;
  badge: string;
  review_verdict: string;
}

export const FALLBACK_GAME_COVER = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80";

export const DEALS_DATABASE: DealItem[] = [
  {
    id: "deal-elden-ring",
    name: "Elden Ring",
    platform: "PC",
    platform_label: "PC / Steam",
    store: "Nuuvem",
    regular_price: 229.90,
    deal_price: 151.73,
    discount_percent: 34,
    rating: 93,
    deal_url: "https://www.nuuvem.com/item/elden-ring",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    badge: "Menor Preço em 3 Meses",
    review_verdict: "Obra-prima imperdível do estilo soulslike em mundo aberto. Vale cada centavo."
  },
  {
    id: "deal-cyberpunk",
    name: "Cyberpunk 2077: Ultimate Edition",
    platform: "PC",
    platform_label: "PC / Steam",
    store: "Nuuvem",
    regular_price: 199.90,
    deal_price: 99.95,
    discount_percent: 50,
    rating: 89,
    deal_url: "https://www.nuuvem.com/item/cyberpunk-2077",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    badge: "Sucesso de Vendas",
    review_verdict: "Totalmente reformulado e polido. A expansão Phantom Liberty eleva o jogo a outro patamar."
  },
  {
    id: "deal-witcher3",
    name: "The Witcher 3: Wild Hunt - Complete Edition",
    platform: "PC",
    platform_label: "PC / Steam",
    store: "Hype Games",
    regular_price: 129.99,
    deal_price: 32.49,
    discount_percent: 75,
    rating: 97,
    deal_url: "https://hype.games/br",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg",
    badge: "Desconto Histórico -75%",
    review_verdict: "Um dos maiores RPGs da história. Por esse valor, é compra obrigatória."
  },
  {
    id: "deal-rdr2",
    name: "Red Dead Redemption 2",
    platform: "PC",
    platform_label: "PC / Steam & Epic",
    store: "Hype Games",
    regular_price: 299.90,
    deal_price: 98.96,
    discount_percent: 67,
    rating: 92,
    deal_url: "https://hype.games/br",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
    badge: "Top Avaliado",
    review_verdict: "Narrativa cinematográfica sem paralelo com mundo aberto hiper-realista da Rockstar."
  },
  {
    id: "deal-gow",
    name: "God of War",
    platform: "PC",
    platform_label: "PC / Steam",
    store: "Nuuvem",
    regular_price: 199.90,
    deal_price: 79.96,
    discount_percent: 60,
    rating: 96,
    deal_url: "https://www.nuuvem.com/item/god-of-war",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
    badge: "PlayStation no PC -60%",
    review_verdict: "A jornada nórdica de Kratos e Atreus com combate visceral e excelente port de PC."
  },
  {
    id: "deal-re4",
    name: "Resident Evil 4 Remake",
    platform: "PC",
    platform_label: "PC / Steam",
    store: "Hype Games",
    regular_price: 249.00,
    deal_price: 124.50,
    discount_percent: 50,
    rating: 97,
    deal_url: "https://hype.games/br",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg",
    badge: "Terror Clássico -50%",
    review_verdict: "Um dos melhores remakes já feitos na indústria. Ação intensa e visuais deslumbrantes."
  },
  {
    id: "deal-spiderman2",
    name: "Marvel's Spider-Man 2",
    platform: "PlayStation",
    platform_label: "PlayStation 5",
    store: "Amazon",
    regular_price: 349.90,
    deal_price: 239.90,
    discount_percent: 31,
    rating: 90,
    deal_url: "https://www.amazon.com.br",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    badge: "Exclusivo PS5",
    review_verdict: "Gráficos de tirar o fôlego, exploração ágil por Nova York e combate refinado de Peter e Miles."
  },
  {
    id: "deal-psn-card",
    name: "Cartão Presente PlayStation Store R$ 100",
    platform: "PlayStation",
    platform_label: "PS5 / PS4 Gift Card",
    store: "Hype Games",
    regular_price: 100.00,
    deal_price: 95.00,
    discount_percent: 5,
    rating: 99,
    deal_url: "https://hype.games/br",
    image: "https://images.unsplash.com/photo-1507457379470-08b800bebc67?w=600&auto=format&fit=crop&q=80",
    badge: "Crédito Digital Instantâneo",
    review_verdict: "Ativação oficial de créditos na PSN brasileira com entrega imediata e Pix."
  },
  {
    id: "deal-gamepass",
    name: "Xbox Game Pass Ultimate (3 Meses)",
    platform: "Xbox",
    platform_label: "Xbox & PC Cloud",
    store: "Hype Games",
    regular_price: 179.99,
    deal_price: 149.90,
    discount_percent: 17,
    rating: 98,
    deal_url: "https://hype.games/br",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop&q=80",
    badge: "O Melhor Custo-Benefício Gamer",
    review_verdict: "Centenas de jogos no catálogo, lançamentos Day One, EA Play e nuvem no celular e PC."
  },
  {
    id: "deal-forza5",
    name: "Forza Horizon 5",
    platform: "Xbox",
    platform_label: "Xbox Series & PC",
    store: "Nuuvem",
    regular_price: 249.00,
    deal_price: 124.50,
    discount_percent: 50,
    rating: 88,
    deal_url: "https://www.nuuvem.com",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg",
    badge: "Corrida em Mundo Aberto -50%",
    review_verdict: "O melhor jogo de corrida arcade da atualidade, ambientado no vibrante México."
  },
  {
    id: "deal-zelda-totk",
    name: "The Legend of Zelda: Tears of the Kingdom",
    platform: "Nintendo",
    platform_label: "Nintendo Switch",
    store: "Amazon",
    regular_price: 399.00,
    deal_price: 289.00,
    discount_percent: 28,
    rating: 96,
    deal_url: "https://www.amazon.com.br",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    badge: "Jogo do Ano Switch",
    review_verdict: "Criatividade sem limites com a mecânica de fusão e exploração vertical fantástica."
  },
  {
    id: "deal-nintendo-eshop",
    name: "Cartão Presente Nintendo eShop R$ 100",
    platform: "Nintendo",
    platform_label: "Nintendo Switch eShop",
    store: "Hype Games",
    regular_price: 100.00,
    deal_price: 96.00,
    discount_percent: 4,
    rating: 99,
    deal_url: "https://hype.games/br",
    image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=600&auto=format&fit=crop&q=80",
    badge: "Crédito Oficial Nintendo",
    review_verdict: "Compre jogos digitais e DLCs na eShop brasileira com facilidade e segurança."
  }
];

export interface MultiplatformGame {
  id: string;
  name: string;
  platform: 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo';
  platform_label: string;
  category: string;
  genres: string[];
  regular_price: number;
  deal_price: number;
  discount_percent: number;
  rating: number; // 0-100
  rating_label: string;
  image: string;
  developer: string;
  release_year: number;
  store: 'Nuuvem' | 'Hype Games' | 'Amazon' | 'Steam';
  store_url?: string;
  description: string;
  review_verdict: string;
  headline: string;
  pros: string[];
  cons: string[];
  specs?: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
}

export const MULTIPLATFORM_GAMES: MultiplatformGame[] = [
  // --- PC (Steam & Epic) ---
  {
    id: "mp-witcher3",
    name: "The Witcher 3: Wild Hunt - Complete Edition",
    platform: "PC",
    platform_label: "PC / Steam",
    category: "RPG",
    genres: ["RPG", "Aventura", "Mundo Aberto"],
    regular_price: 129.99,
    deal_price: 32.49,
    discount_percent: 75,
    rating: 97,
    rating_label: "Extremamente Positivas",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg",
    developer: "CD PROJEKT RED",
    release_year: 2015,
    store: "Hype Games",
    store_url: "https://hype.games/br",
    description: "Encarne Geralt de Rívia em um dos mundos de fantasia sombria mais ricos da história dos jogos. Inclui as aclamadas expansões Hearts of Stone e Blood and Wine.",
    review_verdict: "O padrão-ouro das missões secundárias e narrativa madura nos RPGs modernos. Com 75% OFF, é item indispensável em qualquer biblioteca.",
    headline: "O RPG definitivo da década passada ainda supera a maioria dos lançamentos atuais",
    pros: ["Missões secundárias com narrativas excepcionais", "Expansões gigantescas inclusas", "Trilha sonora memorável"],
    cons: ["Combate corpo a corpo pode parecer um pouco datado"],
    specs: { os: "Windows 10/11 64-bit", processor: "Intel Core i5-2500K / AMD Phenom II X4 940", memory: "8 GB RAM", graphics: "Nvidia GeForce GTX 660 / AMD Radeon HD 7870", storage: "50 GB livre" }
  },
  {
    id: "mp-rdr2",
    name: "Red Dead Redemption 2",
    platform: "PC",
    platform_label: "PC / Steam & Epic",
    category: "Ação",
    genres: ["Ação", "Aventura", "Mundo Aberto"],
    regular_price: 299.90,
    deal_price: 98.96,
    discount_percent: 67,
    rating: 92,
    rating_label: "Muito Positivas",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
    developer: "Rockstar Games",
    release_year: 2019,
    store: "Hype Games",
    store_url: "https://hype.games/br",
    description: "América, 1899. Arthur Morgan e a gangue Van der Linde são forçados a fugir pelo interior selvagem dos Estados Unidos em um conto épico sobre o fim da era dos foras da lei.",
    review_verdict: "O auge técnico do mundo aberto. Nível de detalhe, física e atuação dramática sem concorrente no mercado.",
    headline: "Um marco da ficção ocidental interativa e realismo cinematográfico",
    pros: ["Física e animações hiper-realistas", "Atuação estelar de Arthur Morgan", "Mundo vivo com ecossistemas dinâmicos"],
    cons: ["Ritmo lento no primeiro capítulo em Colter", "Download massivo superior a 120 GB"],
    specs: { os: "Windows 10 64-bit", processor: "Intel Core i7-4770K / AMD Ryzen 5 1500X", memory: "12 GB RAM", graphics: "Nvidia GeForce GTX 1060 6GB / AMD RX 480 4GB", storage: "150 GB SSD" }
  },
  {
    id: "mp-gow",
    name: "God of War",
    platform: "PC",
    platform_label: "PC / Steam",
    category: "Ação",
    genres: ["Ação", "Aventura", "Mitologia"],
    regular_price: 199.90,
    deal_price: 79.96,
    discount_percent: 60,
    rating: 96,
    rating_label: "Extremamente Positivas",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
    developer: "Santa Monica Studio",
    release_year: 2022,
    store: "Nuuvem",
    store_url: "https://www.nuuvem.com/item/god-of-war",
    description: "Vivendo como um homem longe da sombra dos deuses, Kratos deve se adaptar a terras nórdicas desconhecidas e guiar seu filho Atreus em uma jornada visceral.",
    review_verdict: "Port primoroso para PC com suporte a DLSS, FSR e taxas de quadro desbloqueadas. Combate de peso ímpar.",
    headline: "A redenção nórdica do Fantasma de Esparta brilha com maestria nos computadores",
    pros: ["Plano-sequência ininterrupto do início ao fim", "Machado Leviatã tem o melhor arremesso dos games", "Excelente otimização no PC"],
    cons: ["Pouca variedade de chefes menores (trolls repetidos)"],
    specs: { os: "Windows 10 64-bit", processor: "Intel Core i5-6600k / AMD Ryzen 5 2400 G", memory: "8 GB RAM", graphics: "Nvidia GTX 1060 (6 GB) / AMD RX 570 (4 GB)", storage: "70 GB SSD" }
  },
  {
    id: "mp-cyberpunk",
    name: "Cyberpunk 2077: Ultimate Edition",
    platform: "PC",
    platform_label: "PC / Steam",
    category: "RPG",
    genres: ["RPG", "Cyberpunk", "Primeira Pessoa"],
    regular_price: 199.90,
    deal_price: 99.95,
    discount_percent: 50,
    rating: 89,
    rating_label: "Muito Positivas",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    developer: "CD PROJEKT RED",
    release_year: 2020,
    store: "Nuuvem",
    store_url: "https://www.nuuvem.com/item/cyberpunk-2077",
    description: "Um RPG de ação e aventura em mundo aberto ambientado em Night City, uma megalópole obcecada por poder, glamour e bio-modificações.",
    review_verdict: "A redenção completa. Com o patch 2.0 e a expansão Phantom Liberty com Idris Elba, tornou-se um dos melhores RPGs futuristas já feitos.",
    headline: "Night City ressurge como o ápice do visual ray tracing e narrativa cyberpunk",
    pros: ["Construção visual e atmosfera incomparável de Night City", "Trilha sonora sintética eletrizante", "Expansão Phantom Liberty de altíssimo nível"],
    cons: ["Exige placa de vídeo moderna para efeitos de iluminação plena"],
    specs: { os: "Windows 10 64-bit", processor: "Core i7-6700 ou Ryzen 5 3600", memory: "16 GB RAM", graphics: "Geforce GTX 1060 6GB ou Radeon RX 580 8GB", storage: "70 GB SSD" }
  },
  {
    id: "mp-re4",
    name: "Resident Evil 4 Remake",
    platform: "PC",
    platform_label: "PC / Steam",
    category: "Ação",
    genres: ["Ação", "Survival Horror", "Tiro"],
    regular_price: 249.00,
    deal_price: 124.50,
    discount_percent: 50,
    rating: 97,
    rating_label: "Extremamente Positivas",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg",
    developer: "CAPCOM Co., Ltd.",
    release_year: 2023,
    store: "Hype Games",
    store_url: "https://hype.games/br",
    description: "Seis anos se passaram desde o desastre em Raccoon City. Leon S. Kennedy rastreia a filha sequestrada do presidente até um vilarejo europeu aterrorizante.",
    review_verdict: "Remake exemplar que honra o clássico de 2005 e adiciona parry de faca cirúrgico, atmosfera densa e gráficos de cair o queixo na RE Engine.",
    headline: "Ação de sobrevivência em sua forma mais refinada, tensa e viciante",
    pros: ["Mecânica de parry e combate corpo a corpo recompensadores", "Excelente ritmo de campanha sem momentos mortos", "Áudio 3D assustador"],
    cons: ["Gestão restrita de munição em dificuldades elevadas"],
    specs: { os: "Windows 10 64-bit", processor: "AMD Ryzen 5 3600 / Intel Core i7 8700", memory: "16 GB RAM", graphics: "AMD Radeon RX 5700 / NVIDIA GeForce GTX 1070", storage: "60 GB livre" }
  },
  {
    id: "mp-elden-ring",
    name: "Elden Ring",
    platform: "PC",
    platform_label: "PC / Steam",
    category: "RPG",
    genres: ["RPG", "Soulslike", "Mundo Aberto"],
    regular_price: 229.90,
    deal_price: 151.73,
    discount_percent: 34,
    rating: 94,
    rating_label: "Muito Positivas",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    developer: "FromSoftware Inc.",
    release_year: 2022,
    store: "Nuuvem",
    store_url: "https://www.nuuvem.com/item/elden-ring",
    description: "Levante-se, Maculado, e seja guiado pela graça para portar o poder do Anel Prístino e se tornar um Lorde Prístino nas Terras Intermédias.",
    review_verdict: "Vencedor incontestável de Jogo do Ano. A liberdade de desbravar castelos e catacumbas em qualquer ordem redefine a exploração gamer.",
    headline: "A apoteose do design de mundos abertos e combate desafiador",
    pros: ["Mundo aberto que recompensa cada centímetro explorado", "Variedade colossal de armas, magias e builds", "Chefes memoráveis"],
    cons: ["Dificuldade brutal para quem não explora ou usa recursos do jogo"],
    specs: { os: "Windows 10/11", processor: "INTEL CORE I7-8700K ou AMD RYZEN 5 3600X", memory: "16 GB RAM", graphics: "NVIDIA GEFORCE GTX 1070 8 GB ou AMD RADEON RX VEGA 56 8 GB", storage: "60 GB SSD" }
  },
  {
    id: "mp-bg3",
    name: "Baldur's Gate 3",
    platform: "PC",
    platform_label: "PC / Steam",
    category: "RPG",
    genres: ["RPG", "Turnos", "D&D"],
    regular_price: 199.99,
    deal_price: 199.99,
    discount_percent: 0,
    rating: 98,
    rating_label: "Extremamente Positivas",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
    developer: "Larian Studios",
    release_year: 2023,
    store: "Nuuvem",
    store_url: "https://www.nuuvem.com",
    description: "Reúna seu grupo e retorne aos Reinos Esquecidos em uma história de companheirismo, traição, sacrifício e o apelo do poder supremo.",
    review_verdict: "O RPG definitivo dos tempos modernos. Liberdade absoluta de decisões, combate tático tridimensional e centenas de horas sem qualquer microtransação.",
    headline: "O novo marco histórico dos RPGs: liberdade absoluta que redefine os videogames",
    pros: ["Liberdade criativa sem precedentes", "História e companheiros inesquecíveis", "Combate tático vertical rico"],
    cons: ["Curva de aprendizado para novatos em regras de D&D"],
    specs: { os: "Windows 10 64-bit", processor: "Intel Core i7 8700K / AMD Ryzen 5 3600", memory: "16 GB RAM", graphics: "Nvidia 2060 Super / RX 5700 XT (8GB+)", storage: "150 GB SSD" }
  },
  {
    id: "mp-gta5",
    name: "Grand Theft Auto V: Premium Edition",
    platform: "PC",
    platform_label: "PC / Steam",
    category: "Ação",
    genres: ["Ação", "Mundo Aberto", "Crime"],
    regular_price: 109.89,
    deal_price: 39.99,
    discount_percent: 63,
    rating: 90,
    rating_label: "Muito Positivas",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
    developer: "Rockstar North",
    release_year: 2015,
    store: "Nuuvem",
    store_url: "https://www.nuuvem.com",
    description: "Quando um jovem malandro de rua, um ladrão de bancos aposentado e um psicopata aterrorizante se veem envolvidos com criminosos e o submundo do governo, eles precisam realizar uma série de golpes arriscados.",
    review_verdict: "Um dos jogos mais vendidos de toda a história humana. A campanha de Michael, Trevor e Franklin é pura sátira social de alto calibre com multiplayer vivo.",
    headline: "O titã do entretenimento continua relevante e divertido mesmo após mais de uma década",
    pros: ["Los Santos vibrante e repleta de atividades", "Três protagonistas carismáticos com estilos de jogo complementares", "GTA Online infinito"],
    cons: ["Tempo de carregamento no modo online"],
    specs: { os: "Windows 10 64-bit", processor: "Intel Core i5 3470 @ 3.2GHz / AMD X8 FX-8350 @ 4GHz", memory: "8 GB RAM", graphics: "NVIDIA GTX 660 2GB / AMD HD 7870 2GB", storage: "100 GB livre" }
  },

  // --- PLAYSTATION (PS5 & PS4) ---
  {
    id: "mp-forza-horizon-5",
    name: "Forza Horizon 5",
    platform: "Xbox",
    platform_label: "Xbox Series & PC",
    category: "Corrida",
    genres: ["Corrida", "Mundo Aberto", "Simulador Arcade"],
    regular_price: 249.00,
    deal_price: 124.50,
    discount_percent: 50,
    rating: 88,
    rating_label: "Muito Positivas",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg",
    developer: "Playground Games",
    release_year: 2021,
    store: "Nuuvem",
    store_url: "https://www.nuuvem.com",
    description: "Sua derradeira Aventura Horizon espera por você! Explore as paisagens dinâmicas e em constante evolução do México em centenas dos melhores carros do mundo.",
    review_verdict: "O rei incontestável dos jogos de corrida arcade. Cenários deslumbrantes, centenas de veículos licenciados e jogabilidade impecável no controle ou volante.",
    headline: "A celebração máxima da cultura automotiva em um México colorido e cheio de vida",
    pros: ["Gráficos inacreditáveis com clima dinâmico e tempestades de areia", "Pilotagem acessível e prazerosa", "Dezenas de modalidades de corrida"],
    cons: ["Progressão quase generosa demais com prêmios a cada minuto"],
    specs: { os: "Windows 10/11", processor: "Intel i5-8400 ou AMD Ryzen 5 2600X", memory: "16 GB RAM", graphics: "NVidia GTX 1070 ou AMD RX 590", storage: "110 GB livre" }
  },
  {
    id: "mp-spiderman2",
    name: "Marvel's Spider-Man 2",
    platform: "PlayStation",
    platform_label: "PlayStation 5",
    category: "Ação",
    genres: ["Ação", "Super-Herói", "Mundo Aberto"],
    regular_price: 349.90,
    deal_price: 239.90,
    discount_percent: 31,
    rating: 90,
    rating_label: "Aclamação Universal",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    developer: "Insomniac Games",
    release_year: 2023,
    store: "Amazon",
    store_url: "https://www.amazon.com.br",
    description: "Os Spiders Peter Parker e Miles Morales retornam para uma nova e emocionante aventura na aclamada franquia Marvel's Spider-Man para PS5. Enfrente Venom, Kraven e outros vilões.",
    review_verdict: "Aproveitamento exemplar do poder do SSD do PS5 com transição instantânea entre Peter e Miles e balanço de teias ultra-veloz com asas de teia.",
    headline: "A experiência definitiva de ser o Amigão da Vizinhança com gráficos de ponta",
    pros: ["Navegação de teias veloz e empolgante", "Aproveitamento magistral do DualSense", "História comovente com Peter e Miles"],
    cons: ["Campanha principal relativamente curta (15-20h)"],
    specs: { os: "PlayStation 5 Nativo", processor: "AMD Zen 2 Customizado", memory: "16 GB GDDR6", graphics: "AMD RDNA 2 com Ray Tracing", storage: "98 GB SSD NVMe" }
  },
  {
    id: "mp-gow-ragnarok",
    name: "God of War Ragnarök",
    platform: "PlayStation",
    platform_label: "PlayStation 5 & PS4",
    category: "Ação",
    genres: ["Ação", "Aventura", "Mitologia"],
    regular_price: 349.90,
    deal_price: 269.90,
    discount_percent: 23,
    rating: 94,
    rating_label: "Aclamação Universal",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    developer: "Santa Monica Studio",
    release_year: 2022,
    store: "Amazon",
    store_url: "https://www.amazon.com.br",
    description: "Junte-se a Kratos e Atreus em uma jornada mítica por respostas antes que o Ragnarök comece. Visite todos os Nove Reinos e enfrente deuses nórdicos.",
    review_verdict: "Conclusão triunfal da saga nórdica. Combate expandido com a Lança Draupnir e atuações dramáticas inesquecíveis.",
    headline: "Uma obra-prima narrativa e técnica que encerra com chave de ouro a era nórdica",
    pros: ["História emocionante e profunda", "Combate ainda mais variado com três armas simultâneas", "DLC Valhalla gratuito excelente"],
    cons: ["Pacing desacelera um pouco em algumas seções de Atreus em Jotunheim"],
    specs: { os: "PlayStation 5 / PS4", processor: "Console Dedicado", memory: "16 GB", graphics: "4K 60FPS / VRR", storage: "84 GB SSD" }
  },
  {
    id: "mp-tlou1",
    name: "The Last of Us Part I",
    platform: "PlayStation",
    platform_label: "PlayStation 5 & PC",
    category: "Ação",
    genres: ["Ação", "Sobrevivência", "Drama"],
    regular_price: 349.90,
    deal_price: 219.90,
    discount_percent: 37,
    rating: 93,
    rating_label: "Obra-Prima",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    developer: "Naughty Dog",
    release_year: 2022,
    store: "Amazon",
    store_url: "https://www.amazon.com.br",
    description: "Em uma civilização devastada, onde infectados e sobreviventes veteranos estão à solta, Joel, um protagonista abatido, é contratado para contrabandear Ellie, de 14 anos.",
    review_verdict: "Reconstruído do zero com visuais hiper-realistas, IA moderna dos inimigos e acessibilidade pioneira. Uma das narrativas mais impactantes da história.",
    headline: "A história comovente de Joel e Ellie reinventada para o hardware de nova geração",
    pros: ["Fidelidade gráfica e expressões faciais inacreditáveis", "Áudio 3D e resposta nos gatilhos adaptativos", "Narrativa que transcendeu para a TV"],
    cons: ["Estrutura de gameplay fiel ao clássico original"],
    specs: { os: "PlayStation 5 / PC", processor: "PlayStation 5 APU", memory: "16 GB", graphics: "Fidelidade 4K ou Desempenho 60FPS", storage: "79 GB SSD" }
  },
  {
    id: "mp-psn-card-100",
    name: "Gift Card PlayStation Store R$ 100",
    platform: "PlayStation",
    platform_label: "PS5 / PS4 Créditos",
    category: "Gift Card",
    genres: ["Crédito Digital", "Assinaturas", "DLCs"],
    regular_price: 100.00,
    deal_price: 95.00,
    discount_percent: 5,
    rating: 99,
    rating_label: "Muito Recomendado",
    image: "https://images.unsplash.com/photo-1507457379470-08b800bebc67?w=600&auto=format&fit=crop&q=80",
    developer: "Sony Interactive Entertainment",
    release_year: 2026,
    store: "Hype Games",
    store_url: "https://hype.games/br",
    description: "Adicione R$ 100 em créditos oficiais na sua carteira PlayStation Network. Use para comprar jogos completos, assinaturas PlayStation Plus Essential/Extra/Deluxe ou moedas virtuais.",
    review_verdict: "A melhor e mais segura maneira de comprar na PSN brasileira, evitando IOF de cartão internacional e podendo pagar com Pix em segundos.",
    headline: "Crédito oficial com ativação digital instantânea e menor preço com desconto",
    pros: ["Sem taxas bancárias adicionais ou IOF", "Pagamento fácil por Pix com aprovação imediata", "Serve para jogos digitais e assinaturas PS Plus"],
    cons: ["Não reembolsável após o resgate do código digital"],
    specs: { os: "Todas as plataformas PlayStation", processor: "N/A", memory: "N/A", graphics: "N/A", storage: "Digital" }
  },

  // --- XBOX & GAME PASS ---
  {
    id: "mp-gamepass-ultimate",
    name: "Xbox Game Pass Ultimate (3 Meses)",
    platform: "Xbox",
    platform_label: "Xbox & PC Cloud",
    category: "Assinatura",
    genres: ["Assinatura", "Multiplataforma", "Nuvem"],
    regular_price: 179.99,
    deal_price: 149.90,
    discount_percent: 17,
    rating: 98,
    rating_label: "Melhor Custo-Benefício",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop&q=80",
    developer: "Microsoft Xbox",
    release_year: 2026,
    store: "Hype Games",
    store_url: "https://hype.games/br",
    description: "Acesso ilimitado a centenas de jogos de alta qualidade para consoles Xbox Series X|S, Xbox One, PC e jogos via nuvem (Cloud Gaming) no celular, TV ou navegador.",
    review_verdict: "O melhor investimento da indústria gamer hoje. Todos os lançamentos dos estúdios Xbox e Bethesda chegam no Day One, mais catálogo EA Play incluído.",
    headline: "O serviço por assinatura mais completo e vantajoso para jogadores de PC e Console",
    pros: ["Lançamentos first-party no dia do lançamento sem custo extra", "Catálogo EA Play incluso", "Jogue na nuvem sem precisar de console potente"],
    cons: ["Jogos de terceiros entram e saem do catálogo periodicamente"],
    specs: { os: "Xbox Series, Xbox One, Windows 10/11, Android, iOS Cloud", processor: "Qualquer dispositivo com suporte a xCloud", memory: "2 GB+", graphics: "Navegador ou App Xbox", storage: "Jogos em Nuvem ou Local" }
  },
  {
    id: "mp-halo-infinite",
    name: "Halo Infinite (Campanha + Multiplayer)",
    platform: "Xbox",
    platform_label: "Xbox Series & PC",
    category: "Ação",
    genres: ["FPS", "Ficção Científica", "Competitivo"],
    regular_price: 249.00,
    deal_price: 99.60,
    discount_percent: 60,
    rating: 87,
    rating_label: "Muito Positivas",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1240440/header.jpg",
    developer: "343 Industries",
    release_year: 2021,
    store: "Nuuvem",
    store_url: "https://www.nuuvem.com",
    description: "Quando toda a esperança foi perdida e o destino da humanidade está em jogo, Master Chief está pronto para enfrentar o inimigo mais impiedoso que já enfrentou.",
    review_verdict: "O gancho retrátil revoluciona o movimento de Master Chief. Multiplayer gratuito e campanha em mundo semiaberto muito envolvente.",
    headline: "O retorno do Master Chief com gunplay tático dinâmico e mapa aberto no anel Zeta Halo",
    pros: ["Gancho de escalada proporciona verticalidade e dinamismo", "Gunplay de altíssimo nível", "Multiplayer gratuito e polido"],
    cons: ["Variedade de biomas limitada no Zeta Halo"],
    specs: { os: "Windows 10 RS5 x64", processor: "AMD Ryzen 5 2600 ou Intel i5-9600k", memory: "16 GB RAM", graphics: "Radeon RX 5700 XT ou GeForce RTX 2070", storage: "50 GB livre" }
  },
  {
    id: "mp-starfield",
    name: "Starfield",
    platform: "Xbox",
    platform_label: "Xbox Series & PC",
    category: "RPG",
    genres: ["RPG", "Espaço", "Ficção Científica"],
    regular_price: 299.00,
    deal_price: 179.40,
    discount_percent: 40,
    rating: 83,
    rating_label: "Recomendado",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1716740/header.jpg",
    developer: "Bethesda Game Studios",
    release_year: 2023,
    store: "Nuuvem",
    store_url: "https://www.nuuvem.com",
    description: "Starfield é o primeiro universo novo em mais de 25 anos da Bethesda Game Studios. Crie qualquer personagem que desejar e explore com liberdade inigualável mais de 1.000 planetas.",
    review_verdict: "Combate espacial envolvente, construção minuciosa de naves e facções ricas com assinatura clássica de RPGs da Bethesda.",
    headline: "A grande odisseia espacial da Bethesda com construção detalhada de naves e exploração",
    pros: ["Sistema profundo de customização e combate de espaçonaves", "Linhas de missões de facções fascinantes", "Música orquestral sublime de Inon Zur"],
    cons: ["Muitas telas de carregamento para pousos e viagens espaciais"],
    specs: { os: "Windows 10/11", processor: "AMD Ryzen 5 3600X, Intel i5-10600K", memory: "16 GB RAM", graphics: "AMD Radeon RX 6800 XT, NVIDIA GeForce RTX 2080", storage: "125 GB SSD obrigatório" }
  },

  // --- NINTENDO SWITCH ---
  {
    id: "mp-zelda-totk",
    name: "The Legend of Zelda: Tears of the Kingdom",
    platform: "Nintendo",
    platform_label: "Nintendo Switch",
    category: "Aventura",
    genres: ["Aventura", "Exploração", "Física Dinâmica"],
    regular_price: 399.00,
    deal_price: 289.00,
    discount_percent: 28,
    rating: 96,
    rating_label: "Obra-Prima",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    developer: "Nintendo",
    release_year: 2023,
    store: "Amazon",
    store_url: "https://www.amazon.com.br",
    description: "Uma jornada épica pelas terras e pelos céus de Hyrule aguarda por você. Crie suas próprias máquinas, armas e soluções com as novas habilidades Ultrahand e Fuse.",
    review_verdict: "Um triunfo inacreditável de física e liberdade criativa em um console portátil. O sistema de fusão de itens e construção redefine o gênero.",
    headline: "O jogo que desafia os limites do design mecânico e imaginação do jogador",
    pros: ["Motor de física sem falhas e sem restrições arbitrárias", "Três camadas de exploração: Céus, Superfície e Profundezas", "Dezenas de quebra-cabeças engenhosos"],
    cons: ["Quedas esporádicas de taxa de quadros em construções muito complexas"],
    specs: { os: "Nintendo Switch OS", processor: "NVIDIA Custom Tegra", memory: "4 GB LPDDR4", graphics: "720p Portátil / 1080p Dock", storage: "16.3 GB memória interna ou microSD" }
  },
  {
    id: "mp-mario-wonder",
    name: "Super Mario Bros. Wonder",
    platform: "Nintendo",
    platform_label: "Nintendo Switch",
    category: "Plataforma",
    genres: ["Plataforma", "Família", "Multiplayer"],
    regular_price: 349.00,
    deal_price: 279.00,
    discount_percent: 20,
    rating: 92,
    rating_label: "Aclamação Universal",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=80",
    developer: "Nintendo EPD",
    release_year: 2023,
    store: "Amazon",
    store_url: "https://www.amazon.com.br",
    description: "A clássica jogabilidade de rolagem lateral de Mario é virada de cabeça para baixo com a introdução das Wonder Flowers, efeitos hilários que mudam as fases.",
    review_verdict: "O Mario 2D mais criativo em quase 30 anos. Cada fase traz uma surpresa visual e mecânica nova que coloca um sorriso no rosto de qualquer jogador.",
    headline: "Criatividade sem amarras e animações espetaculares no Reino Flor",
    pros: ["Animações expressivas e charmosas de cada personagem", "Efeitos Wonder transformam cada estágio em uma surpresa", "Multiplayer local super divertido"],
    cons: ["Chefes de mundo poderiam ter maior variedade de desafios"],
    specs: { os: "Nintendo Switch", processor: "NVIDIA Tegra", memory: "4 GB", graphics: "60 FPS cravados em 1080p", storage: "4.5 GB" }
  },
  {
    id: "mp-metroid-dread",
    name: "Metroid Dread",
    platform: "Nintendo",
    platform_label: "Nintendo Switch",
    category: "Ação",
    genres: ["Metroidvania", "Ação", "Ficção Científica"],
    regular_price: 349.00,
    deal_price: 229.00,
    discount_percent: 34,
    rating: 88,
    rating_label: "Muito Recomendado",
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=80",
    developer: "MercurySteam / Nintendo",
    release_year: 2021,
    store: "Amazon",
    store_url: "https://www.amazon.com.br",
    description: "Junte-se a Samus Aran enquanto ela escapa de um planeta alienígena hostil infestado por uma ameaça mecânica sinistra conhecida como os robôs E.M.M.I.",
    review_verdict: "Controle ultra-fluido de Samus a 60 FPS com perseguições tensas que aceleram o coração e chefes desafiadores e justos.",
    headline: "O retorno triunfal da caçadora de recompensas ao estilo clássico 2D",
    pros: ["Movimentação mais ágil e responsiva de toda a série Metroid", "Batalhas contra chefes épicas e coreografadas", "Excelente atmosfera sci-fi"],
    cons: ["Trilha sonora é mais ambiental e menos melódica que títulos antigos"],
    specs: { os: "Nintendo Switch", processor: "NVIDIA Tegra", memory: "4 GB", graphics: "60 FPS fluídos", storage: "4.1 GB" }
  },
  {
    id: "mp-nintendo-card-100",
    name: "Gift Card Nintendo eShop R$ 100",
    platform: "Nintendo",
    platform_label: "Nintendo Switch eShop",
    category: "Gift Card",
    genres: ["Crédito Digital", "eShop BR", "Indies"],
    regular_price: 100.00,
    deal_price: 96.00,
    discount_percent: 4,
    rating: 99,
    rating_label: "Crédito Oficial",
    image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=600&auto=format&fit=crop&q=80",
    developer: "Nintendo of America",
    release_year: 2026,
    store: "Hype Games",
    store_url: "https://hype.games/br",
    description: "Código digital oficial para adicionar R$ 100 à sua conta da Nintendo eShop brasileira. Compre lançamentos digitais, DLCs de Pokémon e Smash Bros, ou assine o Nintendo Switch Online.",
    review_verdict: "O meio mais cômodo de carregar fundos na eShop brasileira, com cashback de moedas de ouro da Nintendo mantido integralmente.",
    headline: "Ativação instantânea de créditos para a loja oficial do Nintendo Switch",
    pros: ["Entrega imediata do código por e-mail", "Aceita Pix e parcelamento", "Acumula Pontos de Ouro na sua conta Nintendo"],
    cons: ["Válido exclusivamente para contas da região brasileira"],
    specs: { os: "Nintendo Switch / Nintendo Switch Lite / OLED", processor: "N/A", memory: "N/A", graphics: "N/A", storage: "Digital" }
  }
];

export const DEFAULT_MONETIZATION_SETTINGS: MonetizationSettings = {
  pixKey: 'albertalves1205@gmail.com',
  pixReceiverName: 'Albert Alves',
  pixCity: 'SAO PAULO',
  rakutenSid: '4770537',
  hypeMid: '53304',
  nuuvemPartnerId: 'albertgamer',
  amazonAssociateId: 'albertgames-20',
  gmgAffiliateId: 'albertgmg',
  humblePartnerId: 'albertgames',
  adsensePublisherId: 'ca-pub-7421185206250000',
  adsEnabled: true,
  editorialName: 'GameLens Editorial & Reviews'
};

export const INITIAL_REVIEWS: Record<string, GameReview> = {
  '1086940': {
    gameId: '1086940',
    gameName: "Baldur's Gate 3",
    badge: 'Obra-Prima',
    badgeColor: '#a855f7',
    score: 9.9,
    scores: {
      gameplay: 10,
      graphics: 9.6,
      narrative: 10,
      replayability: 10,
      valueForMoney: 10
    },
    headline: "O novo marco histórico dos RPGs: liberdade absoluta que redefine os videogames",
    verdictLead: "Uma aula magistral de design, narrativa reativa e respeito inegociável à inteligência e criatividade do jogador.",
    fullAnalysis: `Baldur's Gate 3 é mais do que um grande RPG; é um ponto de inflexão na indústria. A Larian Studios conseguiu transpor para o meio digital a sensação tátil de uma mesa de D&D de alto nível com mestres e amigos inspirados. Cada combate se transforma em um quebra-cabeça tático tridimensional onde empurrar um inimigo de um penhasco, eletrificar uma poça d'água ou conjurar trevas são soluções tão viáveis quanto um ataque de espada.\n\nO elenco de companheiros (como Astarion, Shadowheart e Gale) possui camadas emocionais e conflitos morais raramente vistos com tanta maturidade. O jogo não tem medo de deixar você cometer erros grotescos e abraçar as consequências dramáticas disso. É uma compra obrigatória e o investimento com o maior retorno de horas por real gasto de toda a década.`,
    pros: [
      "Liberdade de escolha e improvisação sem precedentes",
      "Combate por turnos rico, vertical e profundamente estratégico",
      "Companheiros inesquecíveis e dublagem impecável",
      "Centenas de horas de conteúdo sem microtransações predatórias"
    ],
    cons: [
      "Curva de aprendizado das regras da 5ª edição de D&D para novatos",
      "Ato 3 pode exigir CPUs potentes em áreas densas de cidade"
    ],
    bottomLine: "Um jogo que será lembrado e jogado pelas próximas duas décadas. Vale cada centavo do valor cheio.",
    author: "Redação Steam Analytics",
    readTime: "4 min de leitura",
    updatedAt: "Atualizado recentemente",
    bestDeal: {
      partnerStore: "Nuuvem",
      discountLabel: "Melhor Preço Ativado",
      suggestedPrice: "R$ 199,99",
      couponCode: "PARCEIRO10"
    }
  },
  '730': {
    gameId: '730',
    gameName: "Counter-Strike 2",
    badge: 'Essencial',
    badgeColor: '#f97316',
    score: 9.3,
    scores: {
      gameplay: 9.8,
      graphics: 9.2,
      narrative: 7.0,
      replayability: 10,
      valueForMoney: 10
    },
    headline: "O soberano dos FPS táticos entra em sua era gráfica mais refinada na Source 2",
    verdictLead: "Com fumaças volumétricas interativas e gunplay incomparável, CS2 continua sendo o teste de precisão definitivo.",
    fullAnalysis: `A transição de CS:GO para Counter-Strike 2 trouxe o motor Source 2 com iluminação impecável, materiais reativos e a mecânica revolucionária de fumaças responsivas a disparos e granadas HE. Para quem busca maestria mecânica, posicionamento e comunicação sob pressão, nenhum outro título no mercado entrega tanta adrenalina por rodada.\n\nEmbora o sistema de sub-tick e o anti-cheat continuem sendo alvos de constante aprimoramento por parte da Valve, a base do jogo permanece intocável: uma fórmula limpa, puramente competitiva e gratuita para jogar.`,
    pros: [
      "Gunplay e resposta de tiro mais precisos da história dos videogames",
      "Novas fumaças volumétricas que mudam totalmente o metagame",
      "Gratuito para começar e mercado econômico de skins vibrante",
      "Comunidade gigantesca com servidores ativos 24 horas por dia"
    ],
    cons: [
      "Curva de aprendizado impiedosa contra jogadores veteranos",
      "Necessita do Status Prime (pago) para partidas ranqueadas limpas"
    ],
    bottomLine: "Indispensável na biblioteca de qualquer fã de FPS. O Prime se paga sozinho com os drops semanais de caixas.",
    author: "Redação Steam Analytics",
    readTime: "3 min de leitura",
    updatedAt: "Temporada 2026",
    bestDeal: {
      partnerStore: "Steam",
      discountLabel: "Free-to-Play com Prime",
      suggestedPrice: "R$ 74,99 (Status Prime)",
    }
  },
  '1245620': {
    gameId: '1245620',
    gameName: "Elden Ring",
    badge: 'Obra-Prima',
    badgeColor: '#eab308',
    score: 9.8,
    scores: {
      gameplay: 9.9,
      graphics: 9.7,
      narrative: 9.5,
      replayability: 10,
      valueForMoney: 9.9
    },
    headline: "A apoteose do design de mundo aberto com a brutalidade poética de Hidetaka Miyazaki",
    verdictLead: "As Terras Intermédias recompensam a curiosidade como nenhum outro mapa aberto já fez antes.",
    fullAnalysis: `Elden Ring pega a fórmula refinada dos Soulslike e a transporta para um mundo colossal onde nenhum ponto de interrogação precisa ser marcado no minimapa: o próprio horizonte seduz o jogador a cavalgar até castelos flutuantes, catacumbas secretas e florestas enevoadas.\n\nA variedade de arquétipos, armas, magias e invocações de cinzas democratiza a dificuldade sem jamais diminuir o senso de conquista. Vencer um semideus após dezenas de tentativas continua sendo um dos momentos mais eufóricos que um videogame pode proporcionar.`,
    pros: [
      "Direção de arte monumental que compensa qualquer limitação técnica",
      "Liberdade de rota que elimina a frustração de ficar travado em um chefe",
      "Centenas de armas, magias e builds radicalmente diferentes",
      "Trilha sonora épica com coros e orquestrações inesquecíveis"
    ],
    cons: [
      "Narrativa fragmentada que exige atenção a descrições de itens",
      "Alguns chefes do final do jogo têm janelas de ataque implacáveis"
    ],
    bottomLine: "Um dos jogos mais aclamados de todos os tempos. Se ainda não jogou, aproveite a primeira promoção disponível.",
    author: "Redação Steam Analytics",
    readTime: "4 min de leitura",
    updatedAt: "Edição Atualizada",
    bestDeal: {
      partnerStore: "Nuuvem",
      discountLabel: "Oferta de Chave Oficial",
      suggestedPrice: "R$ 139,90 (-40%)",
      couponCode: "SOULS10"
    }
  },
  '570': {
    gameId: '570',
    gameName: "Dota 2",
    badge: 'Essencial',
    badgeColor: '#dc2626',
    score: 9.1,
    scores: {
      gameplay: 9.8,
      graphics: 9.0,
      narrative: 7.5,
      replayability: 10,
      valueForMoney: 10
    },
    headline: "O jogo de estratégia em tempo real mais complexo e recompensador já concebido",
    verdictLead: "124 heróis completamente gratuitos desde o minuto zero e profundidade tática infinita.",
    fullAnalysis: `Dota 2 não é apenas um MOBA; é um xadrez de alta velocidade em cinco dimensões. Ao contrário de concorrentes que bloqueiam heróis atrás de paywalls ou moedas de jogo, a Valve entrega o catálogo completo desbloqueado desde o primeiro login.\n\nCada partida é um jogo de posicionamento, gerenciamento de visão com wards, controle de ritmo e sinergia de habilidades. Quando seu time encaixa um 'Black Hole' perfeito e vira uma partida de 60 minutos, a sensação de êxtase é incomparável.`,
    pros: [
      "100% gratuito com todos os heróis liberados",
      "Profundidade estratégica que recompensa centenas de horas de estudo",
      "Cena competitiva lendária com o torneio The International",
      "Atualizações constantes que reformulam o mapa e o equilíbrio"
    ],
    cons: [
      "Comunidade competitiva exigente com novatos",
      "Partidas longas que demandam até 45 a 60 minutos de atenção contínua"
    ],
    bottomLine: "O ápice do gênero MOBA. Custo zero e jogabilidade que pode durar uma vida inteira.",
    author: "Redação Steam Analytics",
    readTime: "3 min de leitura",
    updatedAt: "Patch Atual",
    bestDeal: {
      partnerStore: "Steam",
      discountLabel: "100% Gratuito",
      suggestedPrice: "Grátis para Jogar"
    }
  },
  '105600': {
    gameId: '105600',
    gameName: "Terraria",
    badge: 'Obra-Prima',
    badgeColor: '#10b981',
    score: 9.7,
    scores: {
      gameplay: 9.9,
      graphics: 9.2,
      narrative: 8.0,
      replayability: 10,
      valueForMoney: 10
    },
    headline: "O maior tesouro de exploração 2D, combate a chefes e progressão de itens",
    verdictLead: "Mais de 13 anos de suporte carinhoso transformaram Terraria em um gigante de conteúdo.",
    fullAnalysis: `Reduzir Terraria a um 'Minecraft 2D' é um erro crasso. Terraria é, antes de tudo, um RPG de ação focado em progressão brutal de equipamentos, criação de arenas, mineração perigosa nas profundezas do inferno e batalhas contra chefes titânicos que disparam projéteis em padrões de bullet hell.\n\nCom suporte completo a mods através do tModLoader e modo cooperativo impecável, Terraria por menos de R$ 35,00 é um dos maiores absurdos de custo-benefício de toda a história dos games.`,
    pros: [
      "Quantidade astronômica de armas, armaduras, acessórios e magias",
      "Progressão Hardmode que dobra o tamanho e desafio do jogo",
      "Suporte oficial nativo a mods com o tModLoader",
      "Preço extremamente acessível em qualquer promoção"
    ],
    cons: [
      "Exige consulta frequente à wiki oficial para entender receitas",
      "Interface de inventário densa para quem joga em controle"
    ],
    bottomLine: "Qualquer pessoa que goste de videogames precisa ter Terraria instalado. Compra indispensável.",
    author: "Redação Steam Analytics",
    readTime: "3 min de leitura",
    updatedAt: "Versão Definitiva",
    bestDeal: {
      partnerStore: "Steam",
      discountLabel: "Super Custo-Benefício",
      suggestedPrice: "R$ 32,99 (Promoção ~R$ 16,49)"
    }
  },
  '292030': {
    gameId: '292030',
    gameName: "The Witcher 3: Wild Hunt",
    badge: 'Obra-Prima',
    badgeColor: '#f43f5e',
    score: 9.8,
    scores: {
      gameplay: 9.5,
      graphics: 9.8,
      narrative: 10,
      replayability: 9.6,
      valueForMoney: 10
    },
    headline: "O épico maduro de Geralt de Rívia que estabeleceu a régua narrativa dos mundos abertos",
    verdictLead: "Mesmo anos após o lançamento, as missões secundárias de The Witcher 3 humilham histórias principais de rivais.",
    fullAnalysis: `The Witcher 3: Wild Hunt não trata o jogador como uma criança. Em Velen, Novigrad e Skellige, suas escolhas não são entre 'bem absoluto' ou 'mal cartunesco', mas sim entre o mal menor e as consequências imprevisíveis da guerra e do preconceito.\n\nCom a atualização Next-Gen gratuita trazendo Ray Tracing, texturas em 4K e melhorias de câmera, e as expansões Hearts of Stone e Blood and Wine (esta última com o tamanho de um jogo inteiro à parte), este pacote é uma das maiores experiências culturais da nossa era.`,
    pros: [
      "Roteiro impecável até mesmo nas menores missões secundárias",
      "Mundo vivo, melancólico e deslumbrante com Ray Tracing",
      "Duas das melhores expansões de DLC já lançadas",
      "O minigame Gwent é tão bom que mereceu jogo próprio"
    ],
    cons: [
      "Combate corpo a corpo pode parecer levemente escorregadio",
      "Excesso de pontos de interrogação no mapa de Skellige"
    ],
    bottomLine: "Uma obra indispensável que transcende o gênero. Em promoção com todas as expansões, é imperdível.",
    author: "Redação Steam Analytics",
    readTime: "4 min de leitura",
    updatedAt: "Edição Completa Next-Gen",
    bestDeal: {
      partnerStore: "Nuuvem",
      discountLabel: "Edição Completa (-75%)",
      suggestedPrice: "R$ 39,99",
      couponCode: "BRUXO10"
    }
  }
};

/**
 * Constrói links de afiliado dinâmicos com as tags do usuário
 */
export function getAffiliateUrls(game: { id: string; name: string }, config: MonetizationSettings) {
  const query = encodeURIComponent(game.name);
  const slug = game.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return {
    nuuvem: `https://www.nuuvem.com/br-pt/item/${slug}?partner=${encodeURIComponent(config.nuuvemPartnerId || 'steamgamer')}`,
    amazon: `https://www.amazon.com.br/s?k=${query}+jogo+pc&tag=${encodeURIComponent(config.amazonAssociateId || 'gamerlens-20')}`,
    gmg: `https://www.greenmangaming.com/search?query=${query}&tap_a=${encodeURIComponent(config.gmgAffiliateId || 'gmgpartner')}`,
    steam: `https://store.steampowered.com/app/${game.id}/`
  };
}

/**
 * Agente IA: Gera e reescreve análises editoriais de alto impacto e conversão
 */
export function generateProceduralAiReview(
  game: { id: string; name: string; hours_played: number; user_rating: number; genres: string[]; current_price_brl: number; price_formatted: string },
  editorialName: string
): GameReview {
  const primaryGenre = game.genres[0] || 'Ação';
  const hours = game.hours_played;
  const rating = game.user_rating;

  let badge: GameReview['badge'] = 'Excelente';
  let badgeColor = '#38bdf8';
  let score = Math.min(9.9, Math.round(((rating / 10) * 0.95 + (hours > 100 ? 0.4 : 0.2)) * 10) / 10);

  if (score >= 9.6) {
    badge = 'Obra-Prima';
    badgeColor = '#a855f7';
  } else if (score >= 9.2) {
    badge = 'Essencial';
    badgeColor = '#eab308';
  } else if (score >= 8.8) {
    badge = 'Excelente';
    badgeColor = '#10b981';
  } else {
    badge = 'Muito Recomendado';
    badgeColor = '#06b6d4';
  }

  return {
    gameId: game.id,
    gameName: game.name,
    badge,
    badgeColor,
    score,
    scores: {
      gameplay: Math.min(10, Math.round((score + (Math.random() * 0.4 - 0.2)) * 10) / 10),
      graphics: Math.min(10, Math.round((score - 0.2 + (Math.random() * 0.4)) * 10) / 10),
      narrative: primaryGenre === 'RPG' ? 9.8 : 8.5,
      replayability: hours > 100 ? 10 : 9.2,
      valueForMoney: game.current_price_brl < 100 ? 9.8 : 9.0
    },
    headline: `Análise Crítica 2026: Por que ${game.name} continua dominando o nicho de ${primaryGenre}`,
    verdictLead: `Com mais de ${hours.toLocaleString('pt-BR')} horas analisadas e uma taxa de aprovação de ${rating}%, este título entrega uma das experiências mais consistentes do mercado.`,
    fullAnalysis: `Após dezenas de horas dedicadas e uma análise detalhada dos sistemas centrais de ${game.name}, fica evidente por que ele conquistou um lugar cativo na biblioteca. O loop de gameplay do nicho de ${primaryGenre} foi lapidado com mecânicas responsivas, curva de progressão viciante e excelente otimização gráfica.\n\nPara o jogador que busca profundidade e horas de entretenimento legítimo, ${game.name} se destaca frente aos lançamentos contemporâneos por evitar práticas abusivas e focar naquilo que realmente importa: uma experiência divertida, imersiva e com alto fator de rejogabilidade.\n\nSeja aproveitando uma promoção na Nuuvem ou ativando a chave na Steam, a relação custo-benefício por hora jogada coloca este título no topo das recomendações da nossa redação.`,
    pros: [
      `Excelente profundidade de gameplay dentro do nicho ${primaryGenre}`,
      `Alta taxa de aprovação de ${rating}% na comunidade Steam`,
      `Excelente retorno de horas jogadas pelo valor investido`,
      `Suporte contínuo e comunidade ativa com milhares de jogadores simultâneos`
    ],
    cons: [
      `Pode exigir algum tempo de adaptação às mecânicas para iniciantes`,
      `Dependendo do hardware, ajustes nas configurações gráficas são recomendados`
    ],
    bottomLine: `Veredito final do Agente IA: Recomendação oficial com selo ${badge}. Uma adição indispensável à sua coleção.`,
    author: `${editorialName} (Agente IA)`,
    readTime: "3 min de leitura",
    updatedAt: "Gerado com Inteligência Artificial",
    bestDeal: {
      partnerStore: "Nuuvem",
      discountLabel: "Parceiro Oficial",
      suggestedPrice: game.price_formatted,
      couponCode: "STREAMER10"
    },
    generatedByAi: true
  };
}

/**
 * Guia didático passo a passo de como se cadastrar nos programas de afiliados e monetizar
 */
export const AFFILIATE_PROGRAMS_GUIDE = [
  {
    name: "Nuuvem Afiliados (Recomendado para o Brasil)",
    tag: "Nuuvem",
    commission: "5% a 12% por venda",
    payoutMethod: "Transferência Bancária / Pix em Reais (R$)",
    frequency: "Mensal",
    steps: [
      "Acesse nuuvem.com e role até o rodapé para clicar em 'Programa de Afiliados' (ou pela rede de afiliados Awin).",
      "Cadastre seu site/canal gratuitamente preenchendo seu nome e link da sua página.",
      "Após a aprovação (costuma levar 24-48h), você receberá sua tag de parceiro (ex: 'seunome').",
      "Cole essa tag no painel do nosso site: todos os botões da Nuuvem passarão a pontuar na sua conta!",
      "Quando o leitor compra uma chave de jogo na Nuuvem para ativar na Steam, a comissão cai na sua conta."
    ],
    url: "https://www.nuuvem.com",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
  },
  {
    name: "Amazon Associados (Jogos, Periféricos & Acessórios)",
    tag: "Amazon",
    commission: "8% a 15% por categoria",
    payoutMethod: "Depósito Direto em Conta Corrente",
    frequency: "Mensal (após fechar ciclo)",
    steps: [
      "Acesse associados.amazon.com.br e faça login com sua conta da Amazon.",
      "Cadastre o endereço do seu site ou redes sociais.",
      "Você receberá um ID de Associado (ex: 'seusite-20').",
      "A grande vantagem da Amazon: qualquer produto que a pessoa comprar nas próximas 24h (jogo, mouse, teclado, cadeira gamer) gera comissão para você!",
      "Cole seu ID no painel do site para ativar os links instantaneamente."
    ],
    url: "https://associados.amazon.com.br",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30"
  },
  {
    name: "Doações Diretas via Pix (100% Livre de Taxas)",
    tag: "Pix",
    commission: "100% do valor doado vai direto para você",
    payoutMethod: "Instantâneo (na sua conta)",
    frequency: "Tempo Real",
    steps: [
      "Cadastre qualquer chave Pix sua (E-mail, CPF, Celular ou Chave Aleatória) no painel.",
      "Nosso site gera um QR Code estético e botão de 1 clique 'Copiar Chave Pix'.",
      "Os leitores que gostam das suas análises e do seu dashboard podem doar valores rápidos (R$ 5, R$ 10, R$ 25).",
      "O dinheiro cai no mesmo segundo na sua conta do banco sem nenhuma retenção de plataforma."
    ],
    url: "#pix-settings",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
  },
  {
    name: "Google AdSense (Monetização Passiva com Anúncios)",
    tag: "AdSense",
    commission: "Remuneração por visualizações (CPM) e cliques (CPC)",
    payoutMethod: "Transferência Internacional / Remessa Online em Dólares",
    frequency: "Mensal (acima de $100 USD)",
    steps: [
      "Acesse adsense.google.com e cadastre o domínio do seu site.",
      "O Google analisa seu site para aprovar (ter as abas de Críticas, Políticas e Sobre é exatamente o que ele exige!).",
      "Após aprovação, você recebe seu código Publisher ID (ex: ca-pub-XXXXXXXXXX).",
      "Os espaços de anúncios do site começam a faturar automaticamente sem você precisar fazer nada manual."
    ],
    url: "https://adsense.google.com",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30"
  }
];
