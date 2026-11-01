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
  nuuvemPartnerId: string;
  amazonAssociateId: string;
  gmgAffiliateId: string;
  humblePartnerId: string;
  adsensePublisherId: string;
  adsEnabled: boolean;
  editorialName: string;
}

export const DEFAULT_MONETIZATION_SETTINGS: MonetizationSettings = {
  pixKey: 'albertalves1205@gmail.com',
  pixReceiverName: 'Albert Alves',
  pixCity: 'SAO PAULO',
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
