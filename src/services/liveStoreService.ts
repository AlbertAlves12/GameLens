/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DealItem, MonetizationSettings, GameReview, REAL_GAME_SPECS, getNuuvemSearchUrl } from '../monetizationData';

export interface LiveDealData {
  id: string;
  name: string;
  discount_percent: number;
  regular_price: number;
  deal_price: number;
  price_formatted: string;
  image: string;
  store: string;
  platform: string;
  platform_label: string;
  badge: string;
  rating: number;
  review_verdict: string;
  type?: number;
  is_package?: boolean;
  steam_url?: string;
}

export interface LiveGameDetails {
  id: string;
  name: string;
  developer: string;
  publisher: string;
  release_date: string;
  short_description: string;
  header_image: string;
  user_rating: number;
  is_package?: boolean;
  steam_url?: string;
  price: {
    regular_price: number;
    deal_price: number;
    discount_percent: number;
    price_formatted: string;
    currency: string;
  };
  specs: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
    rawMinimum?: string;
    rawRecommended?: string;
  };
  genres: string[];
}

/**
 * Busca promoções e descontos em tempo real da Steam Brasil
 */
export async function fetchLiveDeals(): Promise<LiveDealData[]> {
  try {
    const res = await fetch('/api/live-deals');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.items) && json.items.length > 0) {
      return json.items;
    }
  } catch (err) {
    console.warn('[LiveStoreService] Falha ao consultar endpoint local de live-deals:', err);
  }

  // Fallback direto via Steam API se suportado pelo navegador ou proxy
  try {
    const resDirect = await fetch('https://store.steampowered.com/api/featuredcategories?cc=br&l=portuguese', {
      mode: 'cors',
    });
    if (resDirect.ok) {
      const data = await resDirect.json();
      const specials = data.specials?.items || [];
      return specials.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        discount_percent: item.discount_percent || 0,
        regular_price: item.original_price ? item.original_price / 100 : 0,
        deal_price: item.final_price ? item.final_price / 100 : 0,
        price_formatted: item.final_price ? `R$ ${(item.final_price / 100).toFixed(2).replace('.', ',')}` : 'Gratuito',
        image: item.large_capsule_image || item.header_image,
        store: 'Steam Store',
        platform: 'PC',
        platform_label: 'PC / Steam Oficial',
        badge: `⚡ -${item.discount_percent}% OFF`,
        rating: 90,
        review_verdict: `Oferta verificada na Steam com ${item.discount_percent}% de desconto hoje.`,
      }));
    }
  } catch {
    // Ignore CORS fallback
  }

  return [];
}

/**
 * Busca requisitos oficiais e preço atualizado de um jogo por AppID
 */
export async function fetchLiveGameDetails(appId: string): Promise<LiveGameDetails | null> {
  const cleanId = String(appId).replace(/[^0-9]/g, '');
  if (!cleanId) return null;

  try {
    const res = await fetch(`/api/game-details/${cleanId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn(`[LiveStoreService] Não foi possível obter detalhes ao vivo para ${cleanId}:`, err);
  }

  return null;
}

/**
 * Pool Expandido de Jogos para Rotação Diária
 */
export const DAILY_GAMES_POOL = [
  {
    id: "1091500",
    name: "Cyberpunk 2077: Ultimate Edition",
    developer: "CD PROJEKT RED",
    release_year: 2020,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    user_rating: 90,
    rating_label: "Muito Positivas",
    badge: "⚡ Destaque da Semana",
    price_formatted: "R$ 99,95",
    regular_price: 199.90,
    discount_percent: 50,
    genres: ["RPG", "Ação", "Cyberpunk", "Mundo Aberto"],
    review_summary: "Night City atinge seu ápice com gráficos em ray tracing completo, combate dinâmico e a aclamada expansão Phantom Liberty inclusa.",
    source_deal: "Nuuvem / Steam"
  },
  {
    id: "1245620",
    name: "Elden Ring",
    developer: "FromSoftware Inc.",
    release_year: 2022,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    user_rating: 93,
    rating_label: "Extremamente Positivas",
    badge: "🔥 Escolha do Dia",
    price_formatted: "R$ 151,73",
    regular_price: 229.90,
    discount_percent: 34,
    genres: ["RPG", "Soulslike", "Mundo Aberto", "Fantasia Sombria"],
    review_summary: "Uma obra-prima revolucionária de RPG de ação. Exploração orgânica monumental, chefes inesquecíveis e combate desafiador.",
    source_deal: "Nuuvem / Steam"
  },
  {
    id: "1086940",
    name: "Baldur's Gate 3",
    developer: "Larian Studios",
    release_year: 2023,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
    user_rating: 96,
    rating_label: "Extremamente Positivas",
    badge: "🏆 Jogo do Ano GOTY",
    price_formatted: "R$ 199,99",
    regular_price: 199.99,
    discount_percent: 0,
    genres: ["RPG", "Estratégia", "Fantasia", "Turnos"],
    review_summary: "Narrativa ramificada brilhante com escolhas que moldam verdadeiramente o mundo e companheiros com atuações de voz impecáveis.",
    source_deal: "Nuuvem / Steam"
  },
  {
    id: "730",
    name: "Counter-Strike 2",
    developer: "Valve",
    release_year: 2023,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
    user_rating: 88,
    rating_label: "Muito Positivas",
    badge: "🎯 eSports nº 1",
    price_formatted: "Gratuito",
    regular_price: 0,
    discount_percent: 0,
    genres: ["Ação", "Tiro", "Competitivo", "FPS"],
    review_summary: "A evolução máxima do tiro tático competitivo no motor Source 2, com fumaças volumétricas reativas e simulação física precisa.",
    source_deal: "Steam Store"
  },
  {
    id: "292030",
    name: "The Witcher 3: Wild Hunt - Complete Edition",
    developer: "CD PROJEKT RED",
    release_year: 2015,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg",
    user_rating: 97,
    rating_label: "Extremamente Positivas",
    badge: "💎 Clássico Imbatível -75%",
    price_formatted: "R$ 39,99",
    regular_price: 159.99,
    discount_percent: 75,
    genres: ["RPG", "Mundo Aberto", "Aventura", "Fantasia"],
    review_summary: "Geralt de Rívia em uma das melhores jornadas da história dos videogames. Mais de 150 horas com as expansões Hearts of Stone e Blood and Wine.",
    source_deal: "Nuuvem / Steam"
  },
  {
    id: "2050650",
    name: "Resident Evil 4 Remake",
    developer: "CAPCOM Co., Ltd.",
    release_year: 2023,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg",
    user_rating: 97,
    rating_label: "Extremamente Positivas",
    badge: "🧟 Terror & Sobrevivência -50%",
    price_formatted: "R$ 84,95",
    regular_price: 169.90,
    discount_percent: 50,
    genres: ["Terror", "Ação", "Sobrevivência", "Tiro"],
    review_summary: "A lendária missão de Leon S. Kennedy reinventada no RE Engine com gameplay moderno, visual deslumbrante e tensão constante.",
    source_deal: "Nuuvem / Hype Games"
  },
  {
    id: "553850",
    name: "HELLDIVERS™ 2",
    developer: "Arrowhead Game Studios",
    release_year: 2024,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg",
    user_rating: 85,
    rating_label: "Muito Positivas",
    badge: "🚀 Co-op Galáctico -20%",
    price_formatted: "R$ 159,92",
    regular_price: 199.90,
    discount_percent: 20,
    genres: ["Ação", "Co-op", "Tiro", "Ficção Científica"],
    review_summary: "Ação cooperativa frenética em nome da Liberdade gerenciada. Estratagemas explosivos, hordas alienígenas e caos divertido entre amigos.",
    source_deal: "Nuuvem / Steam"
  },
  {
    id: "271590",
    name: "Grand Theft Auto V",
    developer: "Rockstar North",
    release_year: 2015,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
    user_rating: 86,
    rating_label: "Muito Positivas",
    badge: "🚗 Mais Vendido de Todos os Tempos",
    price_formatted: "R$ 49,90",
    regular_price: 99.90,
    discount_percent: 50,
    genres: ["Ação", "Mundo Aberto", "Crime", "Multiplayer"],
    review_summary: "Los Santos com Michael, Franklin e Trevor em um mundo aberto vibrante com o infinito ecossistema do GTA Online.",
    source_deal: "Nuuvem / Rockstar"
  },
  {
    id: "391220",
    name: "Rise of the Tomb Raider™",
    developer: "Crystal Dynamics",
    release_year: 2016,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/391220/header.jpg",
    user_rating: 94,
    rating_label: "Muito Positivas",
    badge: "💥 Super Promoção -90%",
    price_formatted: "R$ 12,49",
    regular_price: 124.99,
    discount_percent: 90,
    genres: ["Ação", "Aventura", "Exploração"],
    review_summary: "Lara Croft explora as tumbas geladas da Sibéria com gráficos impressionantes, sobrevivência e quebra-cabeças premiados.",
    source_deal: "Steam & Lojas Oficiais"
  },
  {
    id: "12210",
    name: "Grand Theft Auto IV: The Complete Edition",
    developer: "Rockstar North",
    release_year: 2008,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/12210/header.jpg",
    user_rating: 91,
    rating_label: "Muito Positivas",
    badge: "🌆 Desconto Histórico -70%",
    price_formatted: "R$ 23,70",
    regular_price: 79.00,
    discount_percent: 70,
    genres: ["Ação", "Mundo Aberto", "História"],
    review_summary: "O aclamado capítulo de Niko Bellic em Liberty City com física de veículos Euphoria insuperável e as duas expansões de episódios.",
    source_deal: "Steam Oficial"
  }
];

/**
 * Retorna os 4 Indicados do Dia calculados dinamicamente com base no dia do ano
 * Garantindo que os jogos mudem todo santo dia automaticamente e exibam as ofertas ativas!
 */
export function getDynamicRecommendedOfTheDay(liveDeals: LiveDealData[] = []): typeof DAILY_GAMES_POOL {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Se tivermos live deals com descontos ativos, priorizamos as maiores ofertas de hoje!
  if (liveDeals.length >= 4) {
    const topLiveDeals = [...liveDeals]
      .filter(d => d.discount_percent > 0)
      .sort((a, b) => b.discount_percent - a.discount_percent)
      .slice(0, 4);

    if (topLiveDeals.length === 4) {
      return topLiveDeals.map((d, index) => {
        const poolMatch = DAILY_GAMES_POOL.find(p => p.id === d.id || p.name.toLowerCase() === d.name.toLowerCase());
        return {
          id: d.id,
          name: d.name,
          developer: poolMatch?.developer || 'Produtora Parceira',
          release_year: poolMatch?.release_year || 2023,
          header_image: d.image || poolMatch?.header_image || `https://cdn.akamai.steamstatic.com/steam/apps/${d.id}/header.jpg`,
          user_rating: d.rating || 92,
          rating_label: 'Muito Positivas',
          badge: index === 0 ? `🔥 Oferta Máxima do Dia (-${d.discount_percent}%)` : `⚡ Promoção Verificada (-${d.discount_percent}%)`,
          price_formatted: d.price_formatted,
          regular_price: d.regular_price,
          discount_percent: d.discount_percent,
          genres: poolMatch?.genres || ['Ação', 'Destaque'],
          review_summary: poolMatch?.review_summary || `Desconto em tempo real verificado hoje na loja parceira com -${d.discount_percent}% de redução sobre o preço regular.`,
          source_deal: d.store || 'Steam / Nuuvem'
        };
      });
    }
  }

  // Rotação diária determinística baseada na data de hoje
  const poolSize = DAILY_GAMES_POOL.length;
  const picked: typeof DAILY_GAMES_POOL = [];

  for (let i = 0; i < 4; i++) {
    const idx = (dayOfYear * 3 + i * 2) % poolSize;
    const game = DAILY_GAMES_POOL[idx];
    if (!picked.some(p => p.id === game.id)) {
      picked.push(game);
    } else {
      picked.push(DAILY_GAMES_POOL[(idx + 1) % poolSize]);
    }
  }

  return picked;
}

/**
 * Retorna a data formatada de atualização diária (ex: "6 de novembro de 2026")
 */
export function getTodayFormattedDate(): string {
  try {
    return new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return 'Hoje';
  }
}
