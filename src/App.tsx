/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Gamepad2,
  Clock,
  Trophy,
  Flame,
  Search,
  ArrowUpDown,
  ExternalLink,
  Code2,
  FileCode,
  Copy,
  Check,
  Download,
  BarChart3,
  TrendingUp,
  Server,
  CheckCircle2,
  X,
  Palette,
  Sparkles,
  DollarSign,
  ShoppingCart,
  Star,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  QrCode,
  Settings,
  Gift,
  Share2,
  HelpCircle,
  Newspaper,
  BookOpen,
  Coffee,
  Award,
  Tag,
  Zap,
  Tv,
  Monitor,
  Sun,
  Moon,
  Mic,
  MicOff,
  RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  GameReview,
  MonetizationSettings,
  DEFAULT_MONETIZATION_SETTINGS,
  INITIAL_REVIEWS,
  getAffiliateUrls,
  generateProceduralAiReview,
  AFFILIATE_PROGRAMS_GUIDE,
  DEALS_DATABASE,
  DealItem,
  MultiplatformGame,
  MULTIPLATFORM_GAMES,
  FALLBACK_GAME_COVER,
  getRealGameSpecs,
  getSteamAppId,
  getNuuvemSearchUrl,
  getHypeSearchUrl
} from './monetizationData.ts';
import {
  fetchLiveDeals,
  fetchLiveGameDetails,
  getDynamicRecommendedOfTheDay,
  getTodayFormattedDate,
  LiveDealData
} from './services/liveStoreService.ts';
import { searchGlobalGamesUnified, searchGlobalGamesUnifiedSync } from './gameSearchRegistry.ts';
import { ReviewsView } from './components/ReviewsView.tsx';
import { MonetizationHubView } from './components/MonetizationHubView.tsx';
import { PixModal } from './components/PixModal.tsx';
import { MonetizationSettingsModal } from './components/MonetizationSettingsModal.tsx';

// Registrar módulos do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mapeamento de Cores por Nicho / Gênero
export const GENRE_COLORS: Record<string, { bg: string; hover: string; border: string; text: string; label: string }> = {
  'Ação': { bg: '#ef4444', hover: '#dc2626', border: '#f87171', text: 'text-red-400', label: 'Ação / Combate' },
  'RPG': { bg: '#a855f7', hover: '#9333ea', border: '#c084fc', text: 'text-purple-400', label: 'RPG / Fantasia' },
  'Estratégia': { bg: '#f59e0b', hover: '#d97706', border: '#fbbf24', text: 'text-amber-400', label: 'Estratégia / Tático' },
  'Indie': { bg: '#10b981', hover: '#059669', border: '#34d399', text: 'text-emerald-400', label: 'Indie / Autoral' },
  'Simulação': { bg: '#06b6d4', hover: '#0891b2', border: '#22d3ee', text: 'text-cyan-400', label: 'Simulação / Gestão' },
  'Aventura': { bg: '#3b82f6', hover: '#2563eb', border: '#60a5fa', text: 'text-blue-400', label: 'Aventura / Exploração' },
  'Soulslike': { bg: '#f97316', hover: '#ea580c', border: '#fb923c', text: 'text-orange-400', label: 'Soulslike / Hardcore' },
  'Competitivo': { bg: '#ec4899', hover: '#db2777', border: '#f472b6', text: 'text-pink-400', label: 'Competitivo / PvP' },
  'Sandbox': { bg: '#14b8a6', hover: '#0d9488', border: '#2dd4bf', text: 'text-teal-400', label: 'Sandbox / Criação' }
};

// Fallback seguro de cor de gênero
export function getGenreColor(genreName: string) {
  return GENRE_COLORS[genreName]?.bg || '#66c0f4';
}

// Tipo de jogo com cor temática individual
interface SteamGame {
  id: string;
  name: string;
  color: string;
  hover_color: string;
  hours_played: number;
  genres: string[];
  user_rating: number;
  rating_label: string;
  peak_24h_players: number;
  current_price_brl: number;
  price_formatted: string;
  discount_percent: number;
  developer: string;
  release_year: number;
  achievements_unlocked: number;
  total_achievements: number;
  header_image: string;
  short_description: string;
}

// Catálogo com paleta de cores característica para cada jogo
const INITIAL_GAMES: SteamGame[] = [
  {
    id: "730",
    name: "Counter-Strike 2",
    color: "#f97316", // Laranja tático CS
    hover_color: "#ea580c",
    hours_played: 845.2,
    genres: ["Ação", "Tiro", "Competitivo"],
    user_rating: 88,
    rating_label: "Muito Positivas",
    peak_24h_players: 1420850,
    current_price_brl: 0.00,
    price_formatted: "Gratuito",
    discount_percent: 0,
    developer: "Valve",
    release_year: 2023,
    achievements_unlocked: 1,
    total_achievements: 1,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
    short_description: "Durante mais de duas décadas, Counter-Strike ofereceu uma experiência competitiva de elite formada por milhões de jogadores em todo o mundo."
  },
  {
    id: "570",
    name: "Dota 2",
    color: "#dc2626", // Vermelho carmesim Dota
    hover_color: "#b91c1c",
    hours_played: 430.7,
    genres: ["Estratégia", "MOBA", "Competitivo"],
    user_rating: 82,
    rating_label: "Muito Positivas",
    peak_24h_players: 710500,
    current_price_brl: 0.00,
    price_formatted: "Gratuito",
    discount_percent: 0,
    developer: "Valve",
    release_year: 2013,
    achievements_unlocked: 0,
    total_achievements: 0,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg",
    short_description: "Todos os dias, milhões de jogadores em todo o mundo entram em batalha como um dos mais de cem heróis do Dota."
  },
  {
    id: "1086940",
    name: "Baldur's Gate 3",
    color: "#a855f7", // Púrpura épico Ilitide
    hover_color: "#9333ea",
    hours_played: 312.4,
    genres: ["RPG", "Estratégia", "Aventura"],
    user_rating: 96,
    rating_label: "Extremamente Positivas",
    peak_24h_players: 98120,
    current_price_brl: 199.99,
    price_formatted: "R$ 199,99",
    discount_percent: 20,
    developer: "Larian Studios",
    release_year: 2023,
    achievements_unlocked: 48,
    total_achievements: 54,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
    short_description: "Reúna seu grupo e retorne aos Reinos Esquecidos em uma história de companheirismo, traição, sacrifício e a atração pelo poder supremo."
  },
  {
    id: "1245620",
    name: "Elden Ring",
    color: "#eab308", // Dourado da Graça da Térvore
    hover_color: "#ca8a04",
    hours_played: 264.8,
    genres: ["RPG", "Ação", "Soulslike"],
    user_rating: 93,
    rating_label: "Extremamente Positivas",
    peak_24h_players: 85400,
    current_price_brl: 229.90,
    price_formatted: "R$ 229,90",
    discount_percent: 0,
    developer: "FromSoftware Inc.",
    release_year: 2022,
    achievements_unlocked: 38,
    total_achievements: 42,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    short_description: "O NOVO RPG DE AÇÃO E FANTASIA. Levante-se, Maculado, e seja guiado pela graça para se tornar o novo Lorde Prístino."
  },
  {
    id: "105600",
    name: "Terraria",
    color: "#22c55e", // Verde esmeralda pixel
    hover_color: "#16a34a",
    hours_played: 210.5,
    genres: ["Ação", "Aventura", "Sandbox"],
    user_rating: 98,
    rating_label: "Extremamente Positivas",
    peak_24h_players: 41200,
    current_price_brl: 32.99,
    price_formatted: "R$ 32,99",
    discount_percent: 50,
    developer: "Re-Logic",
    release_year: 2011,
    achievements_unlocked: 89,
    total_achievements: 115,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg",
    short_description: "Cave, lute, explore, construa! O mundo é a sua tela e o chão é a sua tinta em um clássico sandbox aclamado."
  },
  {
    id: "292030",
    name: "The Witcher 3: Wild Hunt",
    color: "#f43f5e", // Carmesim Lobo Branco
    hover_color: "#e11d48",
    hours_played: 195.0,
    genres: ["RPG", "Aventura", "Mundo Aberto"],
    user_rating: 97,
    rating_label: "Extremamente Positivas",
    peak_24h_players: 27300,
    current_price_brl: 129.99,
    price_formatted: "R$ 129,99",
    discount_percent: 75,
    developer: "CD PROJEKT RED",
    release_year: 2015,
    achievements_unlocked: 68,
    total_achievements: 78,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg",
    short_description: "Você é Geralt de Rívia, mercenário matador de monstros. Seu caminho é um continente devastado pela guerra e repleto de feras."
  },
  {
    id: "1091500",
    name: "Cyberpunk 2077",
    color: "#facc15", // Amarelo Neon Night City
    hover_color: "#eab308",
    hours_played: 182.5,
    genres: ["RPG", "Ação", "Mundo Aberto"],
    user_rating: 89,
    rating_label: "Muito Positivas",
    peak_24h_players: 48200,
    current_price_brl: 199.90,
    price_formatted: "R$ 199,90",
    discount_percent: 50,
    developer: "CD PROJEKT RED",
    release_year: 2020,
    achievements_unlocked: 44,
    total_achievements: 44,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    short_description: "Um RPG de ação em Night City, uma megalópole obcecada por poder, glamour e modificações corporais cibernéticas."
  },
  {
    id: "289070",
    name: "Sid Meier's Civilization® VI",
    color: "#0284c7", // Azul imperial do globo
    hover_color: "#0369a1",
    hours_played: 178.4,
    genres: ["Estratégia", "Turnos", "Simulação"],
    user_rating: 86,
    rating_label: "Muito Positivas",
    peak_24h_players: 32600,
    current_price_brl: 129.00,
    price_formatted: "R$ 129,00",
    discount_percent: 90,
    developer: "Firaxis Games",
    release_year: 2016,
    achievements_unlocked: 62,
    total_achievements: 120,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/289070/header.jpg",
    short_description: "Construa um império que resista ao teste do tempo na lendária franquia de estratégia em turnos."
  },
  {
    id: "413150",
    name: "Stardew Valley",
    color: "#10b981", // Verde vale orgânico
    hover_color: "#059669",
    hours_played: 145.6,
    genres: ["Indie", "Simulação", "RPG"],
    user_rating: 98,
    rating_label: "Extremamente Positivas",
    peak_24h_players: 52100,
    current_price_brl: 24.99,
    price_formatted: "R$ 24,99",
    discount_percent: 0,
    developer: "ConcernedApe",
    release_year: 2016,
    achievements_unlocked: 35,
    total_achievements: 40,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
    short_description: "Herde a antiga fazenda de seu avô e construa a vida dos seus sonhos nesta simulação aconchegante e profunda."
  },
  {
    id: "553850",
    name: "HELLDIVERS™ 2",
    color: "#fb923c", // Laranja/Amarelo Democracia
    hover_color: "#f97316",
    hours_played: 142.1,
    genres: ["Ação", "Tiro", "Cooperativo"],
    user_rating: 83,
    rating_label: "Muito Positivas",
    peak_24h_players: 74800,
    current_price_brl: 199.50,
    price_formatted: "R$ 199,50",
    discount_percent: 0,
    developer: "Arrowhead Game Studios",
    release_year: 2024,
    achievements_unlocked: 31,
    total_achievements: 38,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg",
    short_description: "A última linha de ataque da galáxia. Aliste-se nos Helldivers e lute pela liberdade democrática."
  },
  {
    id: "1145360",
    name: "Hades",
    color: "#e11d48", // Vermelho lava submundo
    hover_color: "#be123c",
    hours_played: 118.0,
    genres: ["Ação", "Roguelike", "Indie"],
    user_rating: 98,
    rating_label: "Extremamente Positivas",
    peak_24h_players: 16400,
    current_price_brl: 73.99,
    price_formatted: "R$ 73,99",
    discount_percent: 60,
    developer: "Supergiant Games",
    release_year: 2020,
    achievements_unlocked: 49,
    total_achievements: 49,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg",
    short_description: "Desafie o deus dos mortos e abra caminho para escapar do Submundo no aclamado rogue-like de ação rápida."
  },
  {
    id: "367520",
    name: "Hollow Knight",
    color: "#38bdf8", // Azul alma etéreo
    hover_color: "#0284c7",
    hours_played: 98.3,
    genres: ["Indie", "Metroidvania", "Ação"],
    user_rating: 97,
    rating_label: "Extremamente Positivas",
    peak_24h_players: 14900,
    current_price_brl: 46.99,
    price_formatted: "R$ 46,99",
    discount_percent: 50,
    developer: "Team Cherry",
    release_year: 2017,
    achievements_unlocked: 53,
    total_achievements: 63,
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg",
    short_description: "Uma aventura épica desenhada à mão através de um reino arruinado de insetos repleto de segredos e chefes desafiadores."
  }
];

// Presets de bibliotecas para testes
const PRESETS: Record<string, { label: string; filter: (g: SteamGame) => boolean }> = {
  all: { label: 'Todos os Jogos (Geral)', filter: () => true },
  rpg: { label: 'Foco RPG & Aventura', filter: (g) => g.genres.includes('RPG') || g.genres.includes('Aventura') },
  competitive: { label: 'Foco Competitivo & FPS', filter: (g) => g.genres.includes('Competitivo') || g.genres.includes('Tiro') },
  indie: { label: 'Foco Indies & Estratégia', filter: (g) => g.genres.includes('Indie') || g.genres.includes('Estratégia') }
};

const DEFAULT_POPULAR_SEARCH_GAMES = [
  {
    id: "2358720",
    name: "Black Myth: Wukong",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/2358720/header.jpg",
    price: "R$ 229,90",
    discount: 0,
    source: "Steam / Nuuvem Oficial",
    user_rating: 96,
    developer: "Game Science",
    release_year: 2024,
    short_description: "RPG de ação inspirado na mitologia chinesa e na lenda de Sun Wukong."
  },
  {
    id: "1245620",
    name: "Elden Ring",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    price: "R$ 151,73",
    discount: 34,
    source: "Nuuvem / Steam",
    user_rating: 93,
    developer: "FromSoftware Inc.",
    release_year: 2022,
    short_description: "RPG de ação aclamado em mundo aberto desenvolvido pela FromSoftware."
  },
  {
    id: "1091500",
    name: "Cyberpunk 2077: Ultimate Edition",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    price: "R$ 99,95",
    discount: 50,
    source: "Nuuvem / Hype Games",
    user_rating: 89,
    developer: "CD PROJEKT RED",
    release_year: 2020,
    short_description: "RPG futurista em Night City com a expansão Phantom Liberty inclusa."
  },
  {
    id: "1086940",
    name: "Baldur's Gate 3",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
    price: "R$ 199,99",
    discount: 0,
    source: "Steam Store Oficial",
    user_rating: 96,
    developer: "Larian Studios",
    release_year: 2023,
    short_description: "Jogo do Ano GOTY RPG de estratégia narrativa baseada no universo D&D."
  },
  {
    id: "271590",
    name: "Grand Theft Auto V",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
    price: "R$ 39,99",
    discount: 63,
    source: "Steam Store Oficial",
    user_rating: 91,
    developer: "Rockstar Games",
    release_year: 2015,
    short_description: "Um dos maiores títulos de mundo aberto e ação de todos os tempos."
  },
  {
    id: "1593500",
    name: "God of War",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
    price: "R$ 79,96",
    discount: 60,
    source: "Nuuvem / Steam",
    user_rating: 96,
    developer: "Santa Monica Studio",
    release_year: 2022,
    short_description: "Jornada nórdica visceral de Kratos e Atreus aclamada pelo público."
  },
  {
    id: "2050650",
    name: "Resident Evil 4",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg",
    price: "R$ 124,50",
    discount: 50,
    source: "Hype Games / Nuuvem",
    user_rating: 97,
    developer: "CAPCOM Co., Ltd.",
    release_year: 2023,
    short_description: "Remake do lendário clássico de survival horror completamente reconstruído."
  },
  {
    id: "1174180",
    name: "Red Dead Redemption 2",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
    price: "R$ 98,96",
    discount: 67,
    source: "Hype Games / Steam",
    user_rating: 92,
    developer: "Rockstar Games",
    release_year: 2019,
    short_description: "A saga épica de Arthur Morgan e a gangue Van der Linde no Velho Oeste."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'deals' | 'search' | 'platforms' | 'reviews' | 'monetization' | 'code' | 'api'>('dashboard');
  const [dealsPlatform, setDealsPlatform] = useState<string>('all');
  const [universalSearchQuery, setUniversalSearchQuery] = useState('');
  const [isSearchingUniversal, setIsSearchingUniversal] = useState(false);
  const [universalSearchResults, setUniversalSearchResults] = useState<any[]>(DEFAULT_POPULAR_SEARCH_GAMES);
  const [activePreset, setActivePreset] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [colorMode, setColorMode] = useState<'game' | 'genre'>('game'); // 'game' = cor do jogo, 'genre' = cor do nicho
  const [sortBy, setSortBy] = useState<'hours' | 'rating' | 'players' | 'price' | 'name'>('hours');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  // Filtro de Período do Dashboard Analytics (1m, 3m, 6m, 1y, all)
  const [periodFilter, setPeriodFilter] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('6m');
  // Filtro dos Games Indicados do Dia (all, top, deals, free)
  const [recommendedCategory, setRecommendedCategory] = useState<'all' | 'top' | 'deals' | 'free'>('all');

  // Estado de Promoções e Descontos ao Vivo das Lojas Parceiras
  const [liveDeals, setLiveDeals] = useState<LiveDealData[]>([]);
  const [isSyncingLive, setIsSyncingLive] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  });

  // Catálogo Dinâmico de Games Indicados do Dia com Rotação Diária Automática e Ofertas Reais
  const RECOMMENDED_GAMES_OF_THE_DAY = useMemo(() => {
    return getDynamicRecommendedOfTheDay(liveDeals);
  }, [liveDeals]);

  // Função para sincronizar promoções e preços ao vivo da Steam e Lojas Oficiais
  const syncLiveStoreData = async () => {
    setIsSyncingLive(true);
    try {
      const deals = await fetchLiveDeals();
      if (deals.length > 0) {
        setLiveDeals(deals);
        setLastSyncTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.warn('Erro ao sincronizar lojas:', err);
    } finally {
      setIsSyncingLive(false);
    }
  };

  useEffect(() => {
    syncLiveStoreData();
  }, []);

  // Estado do Histórico de Buscas do Dashboard (Armazena até 5 pesquisas recentes no localStorage)
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('steam_lens_search_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['Elden Ring', 'Counter-Strike 2', 'Cyberpunk 2077', 'Baldur\'s Gate 3', 'The Witcher 3'];
  });

  const addToSearchHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('steam_lens_search_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('steam_lens_search_history');
    } catch {
      // ignore
    }
  };

  const removeFromSearchHistory = (termToRemove: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item.toLowerCase() !== termToRemove.toLowerCase());
      try {
        localStorage.setItem('steam_lens_search_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };
  
  // Estado de Catalog Multiplataforma & Paginação (Consoles & PC)
  const [catalogPlatform, setCatalogPlatform] = useState<'all' | 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo'>('all');
  const [catalogPage, setCatalogPage] = useState<number>(1);
  const [catalogPerPage, setCatalogPerPage] = useState<number>(8);
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  // Estado do Modal Unificado de Dados, Crítica & Requisitos
  const [modalGame, setModalGame] = useState<{
    id: string;
    name: string;
    developer?: string;
    release_year?: number;
    image: string;
    color?: string;
    hours_played?: number;
    user_rating: number;
    price_formatted: string;
    regular_price?: number;
    deal_price?: number;
    discount_percent?: number;
    genres: string[];
    platform_label?: string;
    store?: string;
    short_description: string;
    review_verdict?: string;
    headline?: string;
    pros?: string[];
    cons?: string[];
    specs?: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
    buyUrls: {
      nuuvem: string;
      hype: string;
      amazon?: string;
      steam?: string;
    };
  } | null>(null);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_GAME_COVER;
  };

  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeCodeFile, setActiveCodeFile] = useState<'main.py' | 'templates/index.html' | 'requirements.txt' | 'README.md' | 'vercel.json'>('main.py');
  const [apiEndpoint, setApiEndpoint] = useState<string>('/api/stats');
  const [apiResponse, setApiResponse] = useState<string>('');

  // Tema Claro/Escuro Global com Persistência no localStorage
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('gamelens_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // fallback
    }
    return 'dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('gamelens_theme', next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isLight = theme === 'light';
  const bgMain = isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#0e141b] text-slate-100';
  const bgHeader = isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-[#171a21] border-[#2a475e] text-white';
  const bgCard = isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-[#1b2838] border-[#2a475e] text-white';
  const bgSubcard = isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#171a21] border-[#2a475e] text-white';
  const textMuted = isLight ? 'text-slate-600' : 'text-slate-400';
  const headingColor = isLight ? 'text-slate-900' : 'text-white';
  const subBarBg = isLight ? 'bg-slate-200/90 border-slate-300 text-slate-700' : 'bg-[#121c27] border-[#2a475e]/60 text-slate-300';

  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const handleStartVoiceSearch = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert('O reconhecimento de voz não é suportado neste navegador. Tente usar o Google Chrome ou Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListeningVoice(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setUniversalSearchQuery(transcript);
          addToSearchHistory(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListeningVoice(false);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListeningVoice(false);
    }
  };

  // Efeito Reativo de Pesquisa Universal Instantânea para QUALQUER jogo
  useEffect(() => {
    const query = universalSearchQuery.trim();
    if (!query) {
      setUniversalSearchResults(DEFAULT_POPULAR_SEARCH_GAMES);
      setIsSearchingUniversal(false);
      return;
    }

    // 1. Busca síncrona imediata (0 ms) — Exibe resultados no mesmo frame!
    const instantResults = searchGlobalGamesUnifiedSync(query);
    setUniversalSearchResults(instantResults);
    setIsSearchingUniversal(false);

    // 2. Sincronização assíncrona com a API da Steam (Timeout estrito de 1.2s em segundo plano)
    let active = true;
    const controller = new AbortController();

    searchGlobalGamesUnified(query, controller.signal)
      .then((asyncResults) => {
        if (active && asyncResults.length > 0) {
          setUniversalSearchResults(asyncResults);
        }
      })
      .catch(() => {
        // Ignora erros de rede ou aborts
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [universalSearchQuery]);

  // Sistema de Monetização, Afiliados e Pix
  const [monetizationSettings, setMonetizationSettings] = useState<MonetizationSettings>(() => {
    try {
      const saved = localStorage.getItem('steam_lens_monetization');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_MONETIZATION_SETTINGS;
  });

  const [reviews, setReviews] = useState<Record<string, GameReview>>(INITIAL_REVIEWS);
  const [selectedReviewGameId, setSelectedReviewGameId] = useState<string>('1086940');
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [isGeneratingAiReview, setIsGeneratingAiReview] = useState(false);
  const [revenueSimVisitors, setRevenueSimVisitors] = useState<number>(2000);
  const [pixDonationAmount, setPixDonationAmount] = useState<number>(10);

  // Manipulador Unificado para Abrir Modal com Dados, Crítica e Compra
  const handleOpenGameModal = (item: any) => {
    const gameId = item.id ? String(item.id) : `game-${Date.now()}`;
    const gameName = item.name || 'Jogo';
    const releaseYear = item.release_year;

    // Se a crítica não existir para esse jogo, gera automaticamente com IA em tempo real
    let review = reviews[gameId];
    if (!review) {
      const generated = generateProceduralAiReview({
        id: gameId,
        name: gameName,
        hours_played: item.hours_played || 150,
        user_rating: item.user_rating || item.rating || 90,
        genres: item.genres || ['Ação'],
        current_price_brl: item.current_price_brl || item.deal_price || 99.9,
        price_formatted: item.price_formatted || 'R$ 99,90'
      }, monetizationSettings.editorialName);

      setReviews(prev => ({ ...prev, [gameId]: generated }));
      review = generated;
    }

    // Calcula specs reais específicas para o jogo (Cyberpunk, Elden Ring, BG3, CS2, Witcher 3, RE4, GTA V, etc.)
    const realSpecs = getRealGameSpecs(gameId, gameName, releaseYear);

    // 1. Se for MultiplatformGame
    if (item.category && item.specs) {
      const mg = item as MultiplatformGame;
      const isPc = mg.platform === 'PC';
      const hypeUrl = getHypeSearchUrl(mg.name, monetizationSettings);
      const nuuvemUrl = getNuuvemSearchUrl(mg.name, monetizationSettings);
      const amazonUrl = isPc
        ? undefined
        : `https://www.amazon.com.br/s?k=${encodeURIComponent(mg.name + ' ' + mg.platform + ' midia fisica console')}&tag=${encodeURIComponent(monetizationSettings.amazonAssociateId || 'albertgames-20')}`;

      setModalGame({
        id: mg.id,
        name: mg.name,
        developer: mg.developer,
        release_year: mg.release_year,
        image: mg.image,
        user_rating: review?.score ? Math.round(review.score * 10) : mg.rating,
        price_formatted: mg.deal_price > 0 ? `R$ ${mg.deal_price.toFixed(2).replace('.', ',')}` : 'Gratuito',
        regular_price: mg.regular_price,
        deal_price: mg.deal_price,
        discount_percent: mg.discount_percent,
        genres: mg.genres,
        platform_label: mg.platform_label,
        store: mg.store,
        short_description: mg.description,
        review_verdict: review?.verdictLead || mg.review_verdict,
        headline: review?.headline || mg.headline,
        pros: review?.pros || mg.pros,
        cons: review?.cons || mg.cons,
        specs: realSpecs,
        buyUrls: {
          nuuvem: nuuvemUrl,
          hype: hypeUrl,
          amazon: amazonUrl,
          steam: isPc ? ((mg as any).steam_url || (mg.store_url && mg.store_url.includes('steampowered.com') ? mg.store_url : `https://store.steampowered.com/search/?term=${encodeURIComponent(mg.name)}`)) : undefined
        }
      });
    } else if (item.achievements_unlocked !== undefined) {
      // 2. Se for SteamGame
      const sg = item as SteamGame;
      const affiliate = getAffiliateUrls(sg, monetizationSettings);
      setModalGame({
        id: sg.id,
        name: sg.name,
        developer: sg.developer,
        release_year: sg.release_year,
        image: sg.header_image,
        color: sg.color,
        hours_played: sg.hours_played,
        user_rating: review?.score ? Math.round(review.score * 10) : sg.user_rating,
        price_formatted: sg.price_formatted,
        regular_price: sg.current_price_brl,
        deal_price: sg.current_price_brl,
        discount_percent: sg.discount_percent,
        genres: sg.genres,
        platform_label: 'PC / Steam',
        short_description: sg.short_description,
        review_verdict: review?.verdictLead || `Avaliado em ${sg.user_rating}% pela comunidade gamer global na Steam.`,
        headline: review?.headline || `Análise de Desempenho e Gameplay: ${sg.name}`,
        pros: review?.pros || ["Excelente jogabilidade e resposta", "Comunidade ativa com milhares de jogadores", "Ótima trilha sonora e imersão"],
        cons: review?.cons || ["Pode demandar ajustes no hardware para taxas de quadro máximas"],
        specs: realSpecs,
        buyUrls: {
          nuuvem: affiliate.nuuvem,
          hype: affiliate.hypeGames,
          amazon: undefined,
          steam: (sg as any).steam_url || ((sg as any).is_package || String(sg.id) === '817628' ? `https://store.steampowered.com/sub/${sg.id}` : `https://store.steampowered.com/app/${sg.id}`)
        }
      });
    } else if (item.store && item.deal_price !== undefined) {
      // 3. Se for DealItem
      const d = item as DealItem;
      const isPc = d.platform === 'PC';
      const hypeUrl = getHypeSearchUrl(d.name, monetizationSettings);
      const nuuvemUrl = getNuuvemSearchUrl(d.name, monetizationSettings);
      const amazonUrl = isPc
        ? undefined
        : `https://www.amazon.com.br/s?k=${encodeURIComponent(d.name + ' ' + d.platform + ' midia fisica console')}&tag=${encodeURIComponent(monetizationSettings.amazonAssociateId || 'albertgames-20')}`;

      setModalGame({
        id: d.id,
        name: d.name,
        image: d.image,
        user_rating: review?.score ? Math.round(review.score * 10) : d.rating,
        price_formatted: `R$ ${d.deal_price.toFixed(2).replace('.', ',')}`,
        regular_price: d.regular_price,
        deal_price: d.deal_price,
        discount_percent: d.discount_percent,
        genres: [d.platform, "Destaque"],
        platform_label: d.platform_label,
        store: d.store,
        short_description: d.review_verdict,
        review_verdict: review?.verdictLead || d.review_verdict,
        headline: review?.headline || `Oferta Verificada: ${d.name} (${d.badge})`,
        pros: review?.pros || ["Preço promocional verificado em loja parceira oficial", "Chave ou ativação imediata com suporte em português", "Garantia oficial e sem tarifas surpresa"],
        cons: review?.cons || ["Preço promocional sujeito a estoque limitado"],
        specs: realSpecs,
        buyUrls: {
          nuuvem: nuuvemUrl,
          hype: hypeUrl,
          amazon: amazonUrl,
          steam: isPc ? ((d as any).steam_url || (d.deal_url && d.deal_url.includes('steampowered.com') ? d.deal_url : (d.id && String(d.id).includes('817628') ? 'https://store.steampowered.com/sub/817628' : `https://store.steampowered.com/search/?term=${encodeURIComponent(d.name)}`))) : undefined
        }
      });
    } else {
      // 4. Se for item dos Destaques do Dia ou Busca Universal
      const isPc = !item.platform || item.platform === 'PC' || item.source === 'steam' || String(item.id).match(/^\d+$/);
      const hypeUrl = getHypeSearchUrl(item.name, monetizationSettings);
      const nuuvemUrl = getNuuvemSearchUrl(item.name, monetizationSettings);
      const amazonUrl = isPc
        ? undefined
        : `https://www.amazon.com.br/s?k=${encodeURIComponent(item.name + ' ' + (item.platform || 'console') + ' midia fisica console')}&tag=${encodeURIComponent(monetizationSettings.amazonAssociateId || 'albertgames-20')}`;

      const foundInLibrary = INITIAL_GAMES.find((g) => g.id === item.id || g.name.toLowerCase() === item.name.toLowerCase());
      const resolvedImage = item.header_image || item.image || item.banner || foundInLibrary?.header_image || FALLBACK_GAME_COVER;

      setModalGame({
        id: item.id || `search-${Date.now()}`,
        name: item.name,
        developer: item.developer || foundInLibrary?.developer || "Produtora Oficial",
        release_year: item.release_year || foundInLibrary?.release_year || 2024,
        image: resolvedImage,
        color: item.color || foundInLibrary?.color || "#66c0f4",
        user_rating: review?.score ? Math.round(review.score * 10) : item.user_rating || item.rating || foundInLibrary?.user_rating || 92,
        price_formatted: item.price_formatted || item.price || (foundInLibrary ? foundInLibrary.price_formatted : "Consulte na Loja"),
        regular_price: item.regular_price || foundInLibrary?.current_price_brl || 0,
        deal_price: item.deal_price || (item.discount_percent ? Math.round((item.regular_price || 200) * (1 - item.discount_percent / 100)) : 0),
        discount_percent: item.discount_percent || item.discount || 0,
        genres: item.genres || foundInLibrary?.genres || ["Ação / Aventura", "Multiplataforma"],
        platform_label: item.platform_label || item.source || "Steam & Lojas Parceiras",
        short_description: item.review_summary || item.short_description || foundInLibrary?.short_description || `Título consagrado no mercado gamer. Consulte disponibilidade em tempo real, análises da crítica especializada e ative sua chave nas lojas oficiais parceiras com menores taxas e entrega rápida.`,
        review_verdict: review?.verdictLead || item.review_summary || "Excelente recepção crítica e forte engajamento da comunidade de jogadores.",
        headline: review?.headline || `Análise & Dados de Mercado: ${item.name}`,
        pros: review?.pros || ["Gráficos e jogabilidade de alto nível", "Disponível nas principais lojas digitais parceiras", "Suporte a múltiplos idiomas e controles"],
        cons: review?.cons || ["Verifique os requisitos mínimos do seu sistema antes da instalação"],
        specs: realSpecs,
        buyUrls: {
          nuuvem: nuuvemUrl,
          hype: hypeUrl,
          amazon: amazonUrl,
          steam: (item as any).steam_url || (item.id ? ((item as any).is_package || (item as any).type === 1 || String(item.id) === '817628' ? `https://store.steampowered.com/sub/${item.id}` : `https://store.steampowered.com/app/${item.id}`) : `https://store.steampowered.com/search/?term=${encodeURIComponent(item.name)}`)
        }
      });
    }

    // Consulta os requisitos reais oficiais ao vivo na API da Steam usando o AppID resolvido
    const targetSteamId = getSteamAppId(item.id, item.name);
    if (targetSteamId) {
      fetchLiveGameDetails(targetSteamId).then(live => {
        if (live && live.specs) {
          setModalGame(prev => {
            if (!prev) return prev;
            const currentAppId = getSteamAppId(prev.id, prev.name);
            if (currentAppId !== targetSteamId) return prev;
            return {
              ...prev,
              specs: live.specs,
              developer: live.developer || prev.developer,
              user_rating: live.user_rating || prev.user_rating,
              price_formatted: live.price?.price_formatted || prev.price_formatted,
              buyUrls: {
                ...prev.buyUrls,
                steam: live.steam_url || prev.buyUrls.steam
              }
            };
          });
        }
      });
    }
  };

  // Manipuladores de Monetização
  const handleSaveMonetizationSettings = (newSettings: MonetizationSettings) => {
    setMonetizationSettings(newSettings);
    try {
      localStorage.setItem('steam_lens_monetization', JSON.stringify(newSettings));
    } catch {
      // ignore
    }
    setIsSettingsModalOpen(false);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(monetizationSettings.pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  const handleTriggerAiReview = (gameId: string) => {
    const foundInLibrary = INITIAL_GAMES.find((g) => g.id === gameId);
    const foundInRecommended = RECOMMENDED_GAMES_OF_THE_DAY.find((g) => g.id === gameId);
    const foundInDeals = DEALS_DATABASE.find((d) => d.id === gameId || `live-${d.id}` === gameId);

    const gameTarget = foundInLibrary || (foundInRecommended ? {
      id: foundInRecommended.id,
      name: foundInRecommended.name,
      hours_played: 140,
      user_rating: foundInRecommended.user_rating,
      genres: foundInRecommended.genres,
      current_price_brl: foundInRecommended.regular_price,
      price_formatted: foundInRecommended.price_formatted
    } : null) || (foundInDeals ? {
      id: foundInDeals.id,
      name: foundInDeals.name,
      hours_played: 90,
      user_rating: foundInDeals.rating,
      genres: [foundInDeals.platform],
      current_price_brl: foundInDeals.deal_price,
      price_formatted: `R$ ${foundInDeals.deal_price.toFixed(2).replace('.', ',')}`
    } : null) || {
      id: gameId,
      name: gameId.replace(/[-_]/g, ' '),
      hours_played: 80,
      user_rating: 90,
      genres: ['Ação / RPG'],
      current_price_brl: 99.9,
      price_formatted: 'R$ 99,90'
    };

    setIsGeneratingAiReview(true);
    setTimeout(() => {
      const newReview = generateProceduralAiReview(gameTarget, monetizationSettings.editorialName);
      setReviews((prev) => ({
        ...prev,
        [gameId]: newReview
      }));
      setIsGeneratingAiReview(false);
    }, 600);
  };

  // Catálogo unificado que combina jogos base com dados e preços ao vivo recebidos das APIs
  const activeLibraryGames = useMemo(() => {
    const filterFn = PRESETS[activePreset].filter;

    let baseList = INITIAL_GAMES.map((g) => {
      const liveMatch = liveDeals.find(
        (ld) => ld.id === g.id || ld.name.toLowerCase() === g.name.toLowerCase()
      );
      if (liveMatch) {
        return {
          ...g,
          current_price_brl: liveMatch.deal_price,
          price_formatted: liveMatch.price_formatted,
          discount_percent: liveMatch.discount_percent,
          user_rating: liveMatch.rating || g.user_rating,
        };
      }
      return g;
    });

    // Injeta ofertas ao vivo que não estavam na lista estática inicial (ex: Rise of the Tomb Raider, GTA Trilogy, GTA IV)
    liveDeals.forEach((ld) => {
      const exists = baseList.some(
        (g) => g.id === ld.id || g.name.toLowerCase() === ld.name.toLowerCase()
      );
      if (!exists) {
        baseList.push({
          id: ld.id,
          name: ld.name,
          color: '#38bdf8',
          hover_color: '#0284c7',
          hours_played: Math.round((60 + (parseInt(ld.id, 10) % 150)) * 10) / 10,
          genres: ['Ação', 'Destaque Ao Vivo'],
          user_rating: ld.rating || 90,
          rating_label: 'Muito Positivas',
          peak_24h_players: Math.round(18000 + (parseInt(ld.id, 10) % 50000)),
          current_price_brl: ld.deal_price,
          price_formatted: ld.price_formatted,
          discount_percent: ld.discount_percent,
          developer: 'Produtora Oficial',
          release_year: 2023,
          achievements_unlocked: 24,
          total_achievements: 35,
          header_image: ld.image,
          short_description: ld.review_verdict
        });
      }
    });

    return baseList.filter(filterFn);
  }, [activePreset, liveDeals]);

  // Jogos filtrados dinamicamente pelo Nicho / Gênero selecionado no painel Analytics
  const genreFilteredGames = useMemo(() => {
    if (selectedGenre === 'Todos') return activeLibraryGames;
    return activeLibraryGames.filter((g) => g.genres.includes(selectedGenre));
  }, [activeLibraryGames, selectedGenre]);

  // Estatísticas agregadas calculadas reativamente a partir dos jogos filtrados por nicho
  const stats = useMemo(() => {
    const totalHours = Math.round(genreFilteredGames.reduce((acc, g) => acc + g.hours_played, 0) * 10) / 10;
    const avgRating = genreFilteredGames.length > 0
      ? Math.round((genreFilteredGames.reduce((acc, g) => acc + g.user_rating, 0) / genreFilteredGames.length) * 10) / 10
      : 0;
    const totalValue = Math.round(genreFilteredGames.reduce((acc, g) => acc + g.current_price_brl, 0) * 100) / 100;
    const mostPlayed = genreFilteredGames.length > 0
      ? [...genreFilteredGames].sort((a, b) => b.hours_played - a.hours_played)[0]
      : null;

    // Distribuição por gênero
    const genreMap: Record<string, number> = {};
    genreFilteredGames.forEach((g) => {
      const primary = g.genres[0] || 'Outros';
      genreMap[primary] = (genreMap[primary] || 0) + g.hours_played;
    });

    const sortedGenres = Object.fromEntries(
      Object.entries(genreMap).sort(([, a], [, b]) => b - a)
    );

    return {
      total_games: genreFilteredGames.length,
      total_hours: totalHours,
      avg_rating: avgRating,
      total_library_value_brl: totalValue,
      most_played_game: mostPlayed,
      genre_distribution: sortedGenres
    };
  }, [genreFilteredGames]);

  // Lista de jogos filtrada para a tabela (com busca por texto e ordenação)
  const tableGames = useMemo(() => {
    let result = genreFilteredGames.filter((game) => {
      const matchesSearch =
        !searchTerm ||
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    result.sort((a, b) => {
      let valA: any = a.hours_played;
      let valB: any = b.hours_played;

      if (sortBy === 'rating') {
        valA = a.user_rating;
        valB = b.user_rating;
      } else if (sortBy === 'players') {
        valA = a.peak_24h_players;
        valB = b.peak_24h_players;
      } else if (sortBy === 'price') {
        valA = a.current_price_brl;
        valB = b.current_price_brl;
      } else if (sortBy === 'name') {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }

      return sortAsc ? valA - valB : valB - valA;
    });

    return result;
  }, [genreFilteredGames, searchTerm, sortBy, sortAsc]);

  // Top 6 jogos ordenados por horas
  const top6 = useMemo(() => {
    return [...genreFilteredGames].sort((a, b) => b.hours_played - a.hours_played).slice(0, 6);
  }, [genreFilteredGames]);

  const barPeriodRatio = useMemo(() => {
    if (periodFilter === '1m') return 0.16;
    if (periodFilter === '3m') return 0.42;
    if (periodFilter === '6m') return 1.0;
    if (periodFilter === '1y') return 1.85;
    return 2.8;
  }, [periodFilter]);

  // Dados do gráfico de barras (Top 6 com Cores Distintas por Jogo ou por Nicho!)
  const barChartData = useMemo(() => {
    // Cores específicas para cada barra
    const bgColors = top6.map((g) => {
      if (colorMode === 'genre') {
        const primaryGenre = g.genres[0] || 'Ação';
        return getGenreColor(primaryGenre);
      }
      return g.color;
    });

    const hoverColors = top6.map((g) => {
      if (colorMode === 'genre') {
        const primaryGenre = g.genres[0] || 'Ação';
        return GENRE_COLORS[primaryGenre]?.hover || '#38bdf8';
      }
      return g.hover_color;
    });

    return {
      labels: top6.map((g) => g.name),
      datasets: [
        {
          label: `Horas no Período (${periodFilter.toUpperCase()})`,
          data: top6.map((g) => Math.round(g.hours_played * barPeriodRatio * 10) / 10),
          backgroundColor: bgColors,
          hoverBackgroundColor: hoverColors,
          borderColor: bgColors,
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    };
  }, [top6, colorMode, barPeriodRatio, periodFilter]);

  // Dados do gráfico Doughnut (Cores vibrantes e contrastantes por Nicho de Gênero!)
  const doughnutChartData = useMemo(() => {
    const genres = Object.keys(stats.genre_distribution);
    const data = Object.values(stats.genre_distribution);
    
    // Cada nicho/gênero tem sua cor exata e contrastante
    const sliceColors = genres.map((genre) => getGenreColor(genre));
    const sliceHoverColors = genres.map((genre) => GENRE_COLORS[genre]?.hover || '#38bdf8');

    return {
      labels: genres,
      datasets: [
        {
          data: data,
          backgroundColor: sliceColors,
          hoverBackgroundColor: sliceHoverColors,
          borderColor: '#1b2838',
          borderWidth: 3,
          hoverOffset: 8
        }
      ]
    };
  }, [stats]);

  // Tendência calculada de acordo com o filtro de período selecionado (1m, 3m, 6m, 1y, all)
  const monthlyTrend = useMemo(() => {
    const masterMonths = [
      'Nov/24', 'Dez/24', 'Jan/25', 'Fev/25', 'Mar/25', 'Abr/25',
      'Mai/25', 'Jun/25', 'Jul/25', 'Ago/25', 'Set/25', 'Out/25',
      'Nov/25', 'Dez/25', 'Jan/26', 'Fev/26', 'Mar/26', 'Abr/26',
      'Mai/26', 'Jun/26', 'Jul/26', 'Ago/26', 'Set/26', 'Out/26'
    ];

    const masterTopGames = [
      top6[0]?.name || 'Counter-Strike 2',
      top6[1]?.name || 'Dota 2',
      top6[0]?.name || 'Counter-Strike 2',
      top6[4]?.name || 'Terraria',
      top6[3]?.name || 'Elden Ring',
      top6[1]?.name || 'Dota 2',
      top6[2]?.name || "Baldur's Gate 3",
      top6[0]?.name || 'Counter-Strike 2',
      top6[3]?.name || 'Elden Ring',
      top6[1]?.name || 'Dota 2',
      top6[4]?.name || 'Terraria',
      top6[0]?.name || 'Counter-Strike 2',
      top6[2]?.name || "Baldur's Gate 3",
      top6[0]?.name || 'Counter-Strike 2',
      top6[1]?.name || 'Dota 2',
      top6[4]?.name || 'Terraria',
      top6[3]?.name || 'Elden Ring',
      top6[2]?.name || "Baldur's Gate 3",
      top6[0]?.name || 'Counter-Strike 2',
      top6[1]?.name || 'Dota 2',
      top6[3]?.name || 'Elden Ring',
      top6[2]?.name || "Baldur's Gate 3",
      top6[4]?.name || 'Terraria',
      top6[0]?.name || 'Counter-Strike 2'
    ];

    let count = 6;
    if (periodFilter === '1m') count = 1;
    else if (periodFilter === '3m') count = 3;
    else if (periodFilter === '6m') count = 6;
    else if (periodFilter === '1y') count = 12;
    else if (periodFilter === 'all') count = 24;

    const startIndex = masterMonths.length - count;
    const months = masterMonths.slice(startIndex);
    const monthlyTopGames = masterTopGames.slice(startIndex);

    const totalBaseHours = stats.total_hours;
    let targetTotalHours = totalBaseHours;
    let normWeights: number[] = [];

    if (periodFilter === '1m') {
      targetTotalHours = Math.round(totalBaseHours * 0.16 * 10) / 10;
      normWeights = [1.0];
    } else if (periodFilter === '3m') {
      targetTotalHours = Math.round(totalBaseHours * 0.42 * 10) / 10;
      normWeights = [0.28, 0.32, 0.40];
    } else if (periodFilter === '6m') {
      targetTotalHours = totalBaseHours;
      normWeights = [0.105, 0.125, 0.205, 0.155, 0.175, 0.235];
    } else if (periodFilter === '1y') {
      targetTotalHours = Math.round(totalBaseHours * 1.85 * 10) / 10;
      const raw12 = [0.045, 0.052, 0.058, 0.062, 0.070, 0.078, 0.088, 0.098, 0.115, 0.102, 0.112, 0.120];
      const sum12 = raw12.reduce((a, b) => a + b, 0);
      normWeights = raw12.map(w => w / sum12);
    } else {
      targetTotalHours = Math.round(totalBaseHours * 2.8 * 10) / 10;
      const raw24 = [
        0.020, 0.024, 0.026, 0.028, 0.030, 0.032, 0.035, 0.038, 0.040, 0.042, 0.045, 0.048,
        0.052, 0.056, 0.060, 0.064, 0.070, 0.076, 0.082, 0.088, 0.096, 0.102, 0.110, 0.116
      ];
      const sum24 = raw24.reduce((a, b) => a + b, 0);
      normWeights = raw24.map(w => w / sum24);
    }

    const hours = normWeights.map(w => Math.round(targetTotalHours * w * 10) / 10);

    let sum = 0;
    const cumulative = hours.map((h) => {
      sum += h;
      return Math.round(sum * 10) / 10;
    });

    const growthRate = hours.length > 1 && hours[0] > 0
      ? (((hours[hours.length - 1] - hours[0]) / hours[0]) * 100).toFixed(1)
      : '0.0';

    const semesterAverage = hours.length > 0
      ? Math.round((hours.reduce((a, b) => a + b, 0) / hours.length) * 10) / 10
      : 0;

    const peakIndex = hours.length > 0 ? hours.indexOf(Math.max(...hours)) : 0;
    const peakMonth = months[peakIndex] || 'Out/26';
    const peakHours = hours[peakIndex] || 0;
    const peakTopGame = monthlyTopGames[peakIndex] || (top6[0]?.name || 'Counter-Strike 2');

    return {
      months,
      hours,
      cumulative,
      monthlyTopGames,
      growthRate,
      semesterAverage,
      peakMonth,
      peakHours,
      peakTopGame,
      totalSemesterHours: Math.round(hours.reduce((a, b) => a + b, 0) * 10) / 10
    };
  }, [stats.total_hours, top6, periodFilter]);

  // Métricas reativas que acompanham dinamicamente o filtro de período selecionado
  const periodMetrics = useMemo(() => {
    const totalHours = monthlyTrend.totalSemesterHours;
    let activeGames = stats.total_games;
    let mostPlayedRatio = 0.32;

    if (periodFilter === '1m') {
      activeGames = Math.max(3, Math.round(stats.total_games * 0.4));
      mostPlayedRatio = 0.45;
    } else if (periodFilter === '3m') {
      activeGames = Math.max(5, Math.round(stats.total_games * 0.65));
      mostPlayedRatio = 0.38;
    } else if (periodFilter === '6m') {
      activeGames = Math.max(8, Math.round(stats.total_games * 0.85));
      mostPlayedRatio = 0.32;
    } else if (periodFilter === '1y') {
      activeGames = stats.total_games;
      mostPlayedRatio = 0.30;
    } else {
      activeGames = stats.total_games;
      mostPlayedRatio = 0.30;
    }

    const mostPlayedGameName = monthlyTrend.peakTopGame || stats.most_played_game?.name || 'Counter-Strike 2';
    const matchedGame = top6.find(g => g.name === mostPlayedGameName) || stats.most_played_game;

    return {
      totalHours,
      activeGames,
      mostPlayed: {
        id: matchedGame?.id || '730',
        name: mostPlayedGameName,
        color: matchedGame?.color || '#f97316',
        hours: Math.round(totalHours * mostPlayedRatio * 10) / 10,
        rating_label: matchedGame?.rating_label || 'Muito Positivas'
      }
    };
  }, [monthlyTrend, stats, periodFilter, top6]);

  // Dados do gráfico de linha
  const lineChartData = useMemo(() => {
    return {
      labels: monthlyTrend.months,
      datasets: [
        {
          label: 'Horas Jogadas no Mês',
          data: monthlyTrend.hours,
          borderColor: '#66c0f4',
          backgroundColor: 'rgba(102, 192, 244, 0.18)',
          fill: true,
          tension: 0.38,
          borderWidth: 2.5,
          pointBackgroundColor: '#66c0f4',
          pointBorderColor: '#0e141b',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#38bdf8',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2
        },
        {
          label: 'Média Semestral',
          data: Array(monthlyTrend.months.length).fill(monthlyTrend.semesterAverage),
          borderColor: '#a855f7',
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          tension: 0
        }
      ]
    };
  }, [monthlyTrend]);

  // Jogo selecionado no modal
  const selectedGame = useMemo(() => {
    if (!selectedGameId) return null;
    return INITIAL_GAMES.find((g) => g.id === selectedGameId) || null;
  }, [selectedGameId]);

  // Manipulador de cópia de arquivo
  const handleCopyCode = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Simular chamada da API
  const handleTestApi = (endpoint: string) => {
    setApiEndpoint(endpoint);
    if (endpoint === '/api/stats') {
      setApiResponse(
        JSON.stringify(
          {
            total_games: stats.total_games,
            total_hours: stats.total_hours,
            avg_rating: stats.avg_rating,
            total_library_value_brl: stats.total_library_value_brl,
            most_played_game: stats.most_played_game,
            genre_distribution: stats.genre_distribution,
            genre_colors: Object.fromEntries(
              Object.entries(stats.genre_distribution).map(([genre]) => [genre, getGenreColor(genre)])
            ),
            top_games: activeLibraryGames.slice(0, 5)
          },
          null,
          2
        )
      );
    } else if (endpoint.startsWith('/api/game/')) {
      const id = endpoint.split('/')[3] || '730';
      const game = INITIAL_GAMES.find((g) => g.id === id) || INITIAL_GAMES[0];
      setApiResponse(JSON.stringify(game, null, 2));
    } else if (endpoint === '/api/games') {
      setApiResponse(
        JSON.stringify(
          {
            total: tableGames.length,
            games: tableGames
          },
          null,
          2
        )
      );
    } else if (endpoint === '/api/health') {
      setApiResponse(
        JSON.stringify(
          {
            status: 'ok',
            service: 'steam-analytics-api',
            version: '1.0.0',
            uptime_seconds: 1420
          },
          null,
          2
        )
      );
    }
  };

  // Conteúdo dos arquivos para visualização/download
  const codeFiles: Record<string, string> = {
    'main.py': `"""
==============================================================================
Dashboard de Análise de Biblioteca e Mercado de Jogos (Steam API & Dados)
Back-end construído em Python com FastAPI e Jinja2 Templates.

Autor: Engenheiro Full-Stack
Compatível com: Render, Vercel, Railway, Fly.io, GitHub e execução local.
==============================================================================
"""

import os
import json
import urllib.request
import urllib.parse
from typing import Dict, List, Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

# Inicialização da aplicação FastAPI
app = FastAPI(
    title="Steam Analytics Dashboard API",
    description="API de análise de biblioteca de jogos e métricas de mercado estilo Steam",
    version="1.0.0"
)

# Habilitar CORS para permitir consumo por qualquer front-end ou ferramentas externas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração de diretórios de templates e arquivos estáticos
BASE_DIR = Path(__file__).resolve().parent
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"

# Garante que as pastas existam para evitar exceções
TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# ==============================================================================
# PALETA DE CORES POR NICHO / GÊNERO E POR JOGO
# Proporciona contraste imediato e identidade visual a cada título e categoria
# ==============================================================================
GENRE_COLORS = {
    "Ação": "#ef4444",        # Vermelho carmesim / Combate
    "RPG": "#a855f7",         # Púrpura épico / Fantasia
    "Estratégia": "#f59e0b",  # Âmbar ouro / Tático
    "Indie": "#10b981",       # Verde esmeralda / Autoral
    "Simulação": "#06b6d4",   # Ciano / Gestão
    "Aventura": "#3b82f6",    # Azul safira / Exploração
    "Soulslike": "#f97316",   # Laranja chama / Desafio
    "Competitivo": "#ec4899", # Pink / Precisão
    "Sandbox": "#14b8a6",     # Turquesa / Criação
    "Outros": "#94a3b8"
}

# ==============================================================================
# BASE DE DADOS MOCKADA (SIMULADA) DE ALTA FIDELIDADE
# Cada jogo possui sua cor temática única para diferenciação visual nos gráficos
# ==============================================================================
GAMES_DATABASE: Dict[str, dict] = {
    "730": {
        "id": "730",
        "name": "Counter-Strike 2",
        "color": "#f97316",  # Laranja tático CS
        "hours_played": 845.2,
        "genres": ["Ação", "Tiro", "Competitivo"],
        "user_rating": 88,
        "rating_label": "Muito Positivas",
        "peak_24h_players": 1420850,
        "current_price_brl": 0.00,
        "price_formatted": "Gratuito para Jogar",
        "discount_percent": 0,
        "developer": "Valve",
        "release_year": 2023,
        "achievements_unlocked": 1,
        "total_achievements": 1,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
        "short_description": "Durante mais de duas décadas, Counter-Strike ofereceu uma experiência competitiva de elite formada por milhões de jogadores em todo o mundo."
    },
    "1091500": {
        "id": "1091500",
        "name": "Cyberpunk 2077",
        "color": "#facc15",  # Amarelo Neon Night City
        "hours_played": 182.5,
        "genres": ["RPG", "Ação", "Mundo Aberto"],
        "user_rating": 89,
        "rating_label": "Muito Positivas",
        "peak_24h_players": 48200,
        "current_price_brl": 99.95,
        "regular_price_brl": 199.90,
        "price_formatted": "R$ 99,95",
        "discount_percent": 50,
        "developer": "CD PROJEKT RED",
        "release_year": 2020,
        "achievements_unlocked": 44,
        "total_achievements": 44,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
        "short_description": "Um RPG de ação e aventura em mundo aberto ambientado em Night City, uma megalópole obcecada por poder, glamour e modificações corporais."
    },
    "1245620": {
        "id": "1245620",
        "name": "Elden Ring",
        "color": "#eab308",  # Dourado da Graça da Térvore
        "hours_played": 264.8,
        "genres": ["RPG", "Ação", "Soulslike"],
        "user_rating": 93,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 85400,
        "current_price_brl": 151.73,
        "regular_price_brl": 229.90,
        "price_formatted": "R$ 151,73",
        "discount_percent": 34,
        "developer": "FromSoftware Inc.",
        "release_year": 2022,
        "achievements_unlocked": 38,
        "total_achievements": 42,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
        "short_description": "O NOVO RPG DE AÇÃO E FANTASIA. Levante-se, Maculado, e seja guiado pela graça para portar o poder do Anel Prístino e se tornar um Lorde Prístino."
    },
    "1086940": {
        "id": "1086940",
        "name": "Baldur's Gate 3",
        "color": "#a855f7",  # Púrpura épico Ilitide
        "hours_played": 312.4,
        "genres": ["RPG", "Estratégia", "Aventura"],
        "user_rating": 96,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 98120,
        "current_price_brl": 159.99,
        "regular_price_brl": 199.99,
        "price_formatted": "R$ 159,99",
        "discount_percent": 20,
        "developer": "Larian Studios",
        "release_year": 2023,
        "achievements_unlocked": 48,
        "total_achievements": 54,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
        "short_description": "Reúna seu grupo e retorne aos Reinos Esquecidos em uma história de companheirismo, traição, sacrifício e a atração pelo poder supremo."
    },
    "292030": {
        "id": "292030",
        "name": "The Witcher 3: Wild Hunt",
        "color": "#f43f5e",  # Carmesim Lobo Branco
        "hours_played": 195.0,
        "genres": ["RPG", "Aventura", "Mundo Aberto"],
        "user_rating": 97,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 27300,
        "current_price_brl": 32.49,
        "regular_price_brl": 129.99,
        "price_formatted": "R$ 32,49",
        "discount_percent": 75,
        "developer": "CD PROJEKT RED",
        "release_year": 2015,
        "achievements_unlocked": 68,
        "total_achievements": 78,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg",
        "short_description": "Você é Geralt de Rívia, mercenário matador de monstros. Seu caminho é um continente em guerra, repleto de monstros e intrigas políticas."
    },
    "413150": {
        "id": "413150",
        "name": "Stardew Valley",
        "color": "#10b981",  # Verde Vale da Colheita
        "hours_played": 145.6,
        "genres": ["Indie", "Simulação", "RPG"],
        "user_rating": 98,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 52100,
        "current_price_brl": 24.99,
        "regular_price_brl": 24.99,
        "price_formatted": "R$ 24,99",
        "discount_percent": 0,
        "developer": "ConcernedApe",
        "release_year": 2016,
        "achievements_unlocked": 35,
        "total_achievements": 40,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
        "short_description": "Você herdou a antiga fazenda do seu avô em Stardew Valley. Com ferramentas de segunda mão e algumas moedas, você parte para começar sua nova vida!"
    },
    "367520": {
        "id": "367520",
        "name": "Hollow Knight",
        "color": "#38bdf8",  # Azul Alma Etéreo
        "hours_played": 98.3,
        "genres": ["Indie", "Metroidvania", "Ação"],
        "user_rating": 97,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 14900,
        "current_price_brl": 23.49,
        "regular_price_brl": 46.99,
        "price_formatted": "R$ 23,49",
        "discount_percent": 50,
        "developer": "Team Cherry",
        "release_year": 2017,
        "achievements_unlocked": 53,
        "total_achievements": 63,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg",
        "short_description": "Forje seu próprio caminho em Hollow Knight! Uma aventura épica através de um reino arruinado de insetos e heróis repleto de segredos."
    },
    "570": {
        "id": "570",
        "name": "Dota 2",
        "color": "#dc2626",  # Vermelho Carmesim Dota
        "hours_played": 430.7,
        "genres": ["Estratégia", "MOBA", "Competitivo"],
        "user_rating": 82,
        "rating_label": "Muito Positivas",
        "peak_24h_players": 710500,
        "current_price_brl": 0.00,
        "price_formatted": "Gratuito para Jogar",
        "discount_percent": 0,
        "developer": "Valve",
        "release_year": 2013,
        "achievements_unlocked": 0,
        "total_achievements": 0,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg",
        "short_description": "Todos os dias, milhões de jogadores em todo o mundo entram em batalha como um dos mais de cem heróis do Dota."
    },
    "1145360": {
        "id": "1145360",
        "name": "Hades",
        "color": "#e11d48",  # Vermelho Lava Submundo
        "hours_played": 118.0,
        "genres": ["Ação", "Roguelike", "Indie"],
        "user_rating": 98,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 16400,
        "current_price_brl": 29.59,
        "regular_price_brl": 73.99,
        "price_formatted": "R$ 29,59",
        "discount_percent": 60,
        "developer": "Supergiant Games",
        "release_year": 2020,
        "achievements_unlocked": 49,
        "total_achievements": 49,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg",
        "short_description": "Desafie o deus dos mortos enquanto você corta e batalha para escapar do Submundo neste jogo rogue-like estilo dungeon crawler."
    },
    "553850": {
        "id": "553850",
        "name": "HELLDIVERS™ 2",
        "color": "#fb923c",  # Laranja/Amarelo Democracia
        "hours_played": 142.1,
        "genres": ["Ação", "Tiro", "Cooperativo"],
        "user_rating": 83,
        "rating_label": "Muito Positivas",
        "peak_24h_players": 74800,
        "current_price_brl": 199.50,
        "regular_price_brl": 199.50,
        "price_formatted": "R$ 199,50",
        "discount_percent": 0,
        "developer": "Arrowhead Game Studios",
        "release_year": 2024,
        "achievements_unlocked": 31,
        "total_achievements": 38,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg",
        "short_description": "A última linha de ataque da galáxia. Aliste-se nos Helldivers e junte-se à luta pela liberdade em uma galáxia hostil em um jogo de tiro frenético."
    },
    "105600": {
        "id": "105600",
        "name": "Terraria",
        "color": "#22c55e",  # Verde Pixel Floresta
        "hours_played": 210.5,
        "genres": ["Ação", "Aventura", "Sandbox"],
        "user_rating": 98,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 41200,
        "current_price_brl": 16.49,
        "regular_price_brl": 32.99,
        "price_formatted": "R$ 16,49",
        "discount_percent": 50,
        "developer": "Re-Logic",
        "release_year": 2011,
        "achievements_unlocked": 89,
        "total_achievements": 115,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg",
        "short_description": "Cave, lute, explore, construa! Nada é impossível neste jogo de aventura cheio de ação. O mundo é a sua tela e o chão é a sua tinta."
    },
    "289070": {
        "id": "289070",
        "name": "Sid Meier's Civilization® VI",
        "color": "#0284c7",  # Azul Imperial
        "hours_played": 178.4,
        "genres": ["Estratégia", "Turnos", "Simulação"],
        "user_rating": 86,
        "rating_label": "Muito Positivas",
        "peak_24h_players": 32600,
        "current_price_brl": 12.90,
        "regular_price_brl": 129.00,
        "price_formatted": "R$ 12,90",
        "discount_percent": 90,
        "developer": "Firaxis Games",
        "release_year": 2016,
        "achievements_unlocked": 62,
        "total_achievements": 120,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/289070/header.jpg",
        "short_description": "Civilization VI oferece novas maneiras de interagir com seu mundo: cidades se expandem fisicamente pelo mapa e pesquisas ativas em tecnologia destravam novos potenciais."
    }
}


# ==============================================================================
# FUNÇÃO AUXILIAR DE CÁLCULO DE ESTATÍSTICAS
# ==============================================================================
def calculate_library_stats(games_dict: Dict[str, dict]) -> dict:
    """Calcula estatísticas agregadas a partir do catálogo de jogos incluindo mapa de cores."""
    games_list = list(games_dict.values())
    if not games_list:
        return {
            "total_games": 0,
            "total_hours": 0.0,
            "avg_rating": 0,
            "most_played_game": None,
            "total_library_value_brl": 0.00,
            "genre_distribution": {},
            "genre_colors": {},
            "top_games": []
        }

    total_hours = round(sum(g["hours_played"] for g in games_list), 1)
    avg_rating = round(sum(g["user_rating"] for g in games_list) / len(games_list), 1)
    total_value = round(sum(g["current_price_brl"] for g in games_list), 2)

    # Identificar jogo mais jogado
    most_played = max(games_list, key=lambda g: g["hours_played"])

    # Distribuição de horas por gênero
    genre_hours: Dict[str, float] = {}
    for game in games_list:
        primary_genre = game["genres"][0] if game["genres"] else "Outros"
        genre_hours[primary_genre] = round(genre_hours.get(primary_genre, 0.0) + game["hours_played"], 1)

    # Ordenar gêneros por maior número de horas
    sorted_genres = dict(sorted(genre_hours.items(), key=lambda item: item[1], reverse=True))

    # Mapear cores para cada gênero presente
    genre_colors = {genre: GENRE_COLORS.get(genre, "#66c0f4") for genre in sorted_genres}

    # Top jogos ordenados por horas
    top_games = sorted(games_list, key=lambda g: g["hours_played"], reverse=True)

    # Tendência dos últimos 6 meses (Maio a Outubro de 2026)
    months = ["Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro"]
    monthly_weights = [0.105, 0.125, 0.205, 0.155, 0.175, 0.235]
    monthly_hours = [round(total_hours * w, 1) for w in monthly_weights]
    growth_rate = round(((monthly_hours[-1] - monthly_hours[0]) / monthly_hours[0]) * 100, 1) if monthly_hours[0] > 0 else 0.0
    semester_avg = round(sum(monthly_hours) / len(monthly_hours), 1)

    monthly_trend = {
        "months": months,
        "hours": monthly_hours,
        "growth_rate_pct": growth_rate,
        "semester_average": semester_avg,
        "peak_month": months[monthly_hours.index(max(monthly_hours))],
        "top_games": [
            top_games[0]["name"] if len(top_games) > 0 else "Nenhum",
            top_games[1]["name"] if len(top_games) > 1 else "Nenhum",
            top_games[3]["name"] if len(top_games) > 3 else "Nenhum",
            top_games[2]["name"] if len(top_games) > 2 else "Nenhum",
            top_games[4]["name"] if len(top_games) > 4 else "Nenhum",
            top_games[0]["name"] if len(top_games) > 0 else "Nenhum",
        ]
    }

    return {
        "total_games": len(games_list),
        "total_hours": total_hours,
        "avg_rating": avg_rating,
        "most_played_game": {
            "id": most_played["id"],
            "name": most_played["name"],
            "color": most_played.get("color", "#f97316"),
            "hours_played": most_played["hours_played"],
            "header_image": most_played["header_image"],
            "rating_label": most_played["rating_label"]
        },
        "total_library_value_brl": total_value,
        "genre_distribution": sorted_genres,
        "genre_colors": genre_colors,
        "monthly_trend": monthly_trend,
        "top_games": top_games
    }


# ==============================================================================
# ROTAS DA API
# ==============================================================================

@app.get("/", response_class=HTMLResponse)
async def serve_home(request: Request):
    """
    Renderiza a interface principal HTML com Jinja2.
    """
    stats = calculate_library_stats(GAMES_DATABASE)
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request": request,
            "stats": stats,
            "games": list(GAMES_DATABASE.values()),
            "deals": DEALS_DATABASE
        }
    )


@app.get("/api/stats")
async def get_library_stats():
    """
    Retorna métricas consolidadas da biblioteca com mapeamento cromático:
    - Total de horas jogadas
    - Jogo mais jogado e sua cor tema
    - Avaliação média da biblioteca
    - Distribuição de horas por gênero e suas respectivas cores
    - Top jogos ordenados por horas com cores individuais
    """
    try:
        return calculate_library_stats(GAMES_DATABASE)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar estatísticas da biblioteca: {str(e)}")


@app.get("/api/game/{game_id}")
async def get_game_details(game_id: str):
    """
    Retorna detalhes completos de um jogo específico pelo seu ID (Steam AppID ou DealID):
    - Nome, cor tema e capa
    - Avaliação e percentual de recomendação
    - Pico de jogadores simultâneos nas últimas 24h
    - Preço atual, regular e desconto
    - Conquistas desbloqueadas
    """
    # 1. Procura na base de jogos Steam
    game = GAMES_DATABASE.get(game_id)
    if game:
        return game

    # 2. Procura no banco de ofertas multiplataforma
    deal = next((d for d in DEALS_DATABASE if d["id"] == game_id or d["id"].replace("deal-", "") == game_id.lower()), None)
    if deal:
        reg_price = deal.get("regular_price", deal["deal_price"])
        return {
            "id": deal["id"],
            "name": deal["name"],
            "color": "#66c0f4",
            "hours_played": 0.0,
            "genres": [deal["platform"], "Destaque"],
            "platform": deal["platform"],
            "platform_label": deal.get("platform_label", deal["platform"]),
            "store": deal.get("store", "Loja Oficial"),
            "user_rating": deal.get("rating", 94),
            "rating_label": "Extremamente Positivas",
            "peak_24h_players": 32000,
            "current_price_brl": deal["deal_price"],
            "regular_price_brl": reg_price,
            "price_formatted": f"R$ {deal['deal_price']:.2f}".replace(".", ","),
            "discount_percent": deal.get("discount_percent", 0),
            "developer": deal.get("platform_label", "Console & PC"),
            "release_year": 2024,
            "achievements_unlocked": 0,
            "total_achievements": 0,
            "header_image": deal.get("image", ""),
            "short_description": deal.get("review_verdict", f"{deal['name']} com oferta especial verificada no GameLens."),
            "deal_url": deal.get("deal_url", "")
        }

    # 3. Busca por correspondência no nome
    query_lower = game_id.lower().replace("-", " ")
    for g in GAMES_DATABASE.values():
        if query_lower in g["name"].lower():
            return g
    for d in DEALS_DATABASE:
        if query_lower in d["name"].lower():
            reg_price = d.get("regular_price", d["deal_price"])
            return {
                "id": d["id"],
                "name": d["name"],
                "color": "#66c0f4",
                "hours_played": 0.0,
                "genres": [d["platform"], "Destaque"],
                "platform": d["platform"],
                "platform_label": d.get("platform_label", d["platform"]),
                "store": d.get("store", "Loja Oficial"),
                "user_rating": d.get("rating", 94),
                "rating_label": "Muito Positivas",
                "peak_24h_players": 28000,
                "current_price_brl": d["deal_price"],
                "regular_price_brl": reg_price,
                "price_formatted": f"R$ {d['deal_price']:.2f}".replace(".", ","),
                "discount_percent": d.get("discount_percent", 0),
                "developer": d.get("platform_label", "Console"),
                "release_year": 2024,
                "achievements_unlocked": 0,
                "total_achievements": 0,
                "header_image": d.get("image", ""),
                "short_description": d.get("review_verdict", ""),
                "deal_url": d.get("deal_url", "")
            }

    raise HTTPException(
        status_code=404,
        detail=f"Jogo com ID '{game_id}' não encontrado na base de dados."
    )


@app.get("/api/games")
async def list_games(
    search: Optional[str] = Query(None, description="Filtrar por nome do jogo"),
    genre: Optional[str] = Query(None, description="Filtrar por gênero"),
    sort_by: Optional[str] = Query("hours", description="Ordenar por: hours, rating, price, name, players")
):
    """
    Lista todos os jogos cadastrados com suporte a busca, filtro por gênero e ordenação.
    """
    games = list(GAMES_DATABASE.values())

    if search:
        search_lower = search.lower().strip()
        games = [g for g in games if search_lower in g["name"].lower() or search_lower in g["developer"].lower()]

    if genre and genre != "Todos":
        games = [g for g in games if genre in g["genres"]]

    # Ordenação
    if sort_by == "hours":
        games.sort(key=lambda x: x["hours_played"], reverse=True)
    elif sort_by == "rating":
        games.sort(key=lambda x: x["user_rating"], reverse=True)
    elif sort_by == "price":
        games.sort(key=lambda x: x["current_price_brl"], reverse=True)
    elif sort_by == "name":
        games.sort(key=lambda x: x["name"].lower())
    elif sort_by == "players":
        games.sort(key=lambda x: x["peak_24h_players"], reverse=True)

    return {"total": len(games), "games": games}


# ==============================================================================
# RADAR DE OFERTAS & DESCONTOS MULTIPLATAFORMA (PC, PLAYSTATION, XBOX, NINTENDO)
# ==============================================================================
DEALS_DATABASE = [
    {
        "id": "deal-elden-ring",
        "name": "Elden Ring",
        "platform": "PC",
        "platform_label": "PC / Steam",
        "store": "Nuuvem",
        "regular_price": 229.90,
        "deal_price": 151.73,
        "discount_percent": 34,
        "rating": 93,
        "deal_url": "https://www.nuuvem.com/br-pt/catalog/search?q=Elden%20Ring&partner=albertgamer",
        "image": "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
        "badge": "Menor Preço em 3 Meses",
        "review_verdict": "Obra-prima imperdível do estilo soulslike em mundo aberto. Vale cada centavo."
    },
    {
        "id": "deal-cyberpunk",
        "name": "Cyberpunk 2077: Ultimate Edition",
        "platform": "PC",
        "platform_label": "PC / Steam",
        "store": "Nuuvem",
        "regular_price": 199.90,
        "deal_price": 99.95,
        "discount_percent": 50,
        "rating": 89,
        "deal_url": "https://www.nuuvem.com/br-pt/item/cyberpunk-2077?partner=albertgamer",
        "image": "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
        "badge": "Sucesso de Vendas",
        "review_verdict": "Totalmente reformulado e polido. A expansão Phantom Liberty eleva o jogo a outro patamar."
    },
    {
        "id": "deal-witcher3",
        "name": "The Witcher 3: Wild Hunt - Complete Edition",
        "platform": "PC",
        "platform_label": "PC / Steam",
        "store": "Hype Games",
        "regular_price": 129.99,
        "deal_price": 32.49,
        "discount_percent": 75,
        "rating": 97,
        "deal_url": "https://hype.games/br/search?q=The%20Witcher%203",
        "image": "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg",
        "badge": "Desconto Histórico -75%",
        "review_verdict": "Um dos maiores RPGs da história. Por esse valor, é compra obrigatória."
    },
    {
        "id": "deal-rdr2",
        "name": "Red Dead Redemption 2",
        "platform": "PC",
        "platform_label": "PC / Steam & Epic",
        "store": "Hype Games",
        "regular_price": 299.90,
        "deal_price": 98.96,
        "discount_percent": 67,
        "rating": 92,
        "deal_url": "https://hype.games/br/search?q=Red%20Dead%20Redemption%202",
        "image": "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
        "badge": "Top Avaliado",
        "review_verdict": "Narrativa cinematográfica sem paralelo com mundo aberto hiper-realista da Rockstar."
    },
    {
        "id": "deal-gow",
        "name": "God of War",
        "platform": "PC",
        "platform_label": "PC / Steam",
        "store": "Nuuvem",
        "regular_price": 199.90,
        "deal_price": 79.96,
        "discount_percent": 60,
        "rating": 96,
        "deal_url": "https://www.nuuvem.com/br-pt/catalog/search?q=God%20of%20War&partner=albertgamer",
        "image": "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
        "badge": "PlayStation no PC -60%",
        "review_verdict": "A jornada nórdica de Kratos e Atreus com combate visceral e excelente port de PC."
    },
    {
        "id": "deal-re4",
        "name": "Resident Evil 4 Remake",
        "platform": "PC",
        "platform_label": "PC / Steam",
        "store": "Hype Games",
        "regular_price": 249.00,
        "deal_price": 124.50,
        "discount_percent": 50,
        "rating": 97,
        "deal_url": "https://hype.games/br",
        "image": "https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg",
        "badge": "Terror Clássico -50%",
        "review_verdict": "Um dos melhores remakes já feitos na indústria. Ação intensa e visuais deslumbrantes."
    },
    {
        "id": "deal-spiderman2",
        "name": "Marvel's Spider-Man 2",
        "platform": "PlayStation",
        "platform_label": "PlayStation 5",
        "store": "Amazon",
        "regular_price": 349.90,
        "deal_price": 239.90,
        "discount_percent": 31,
        "rating": 90,
        "deal_url": "https://www.amazon.com.br",
        "image": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
        "badge": "Exclusivo PS5",
        "review_verdict": "Gráficos de tirar o fôlego, exploração ágil por Nova York e combate refinado de Peter e Miles."
    },
    {
        "id": "deal-psn-card",
        "name": "Cartão Presente PlayStation Store R$ 100",
        "platform": "PlayStation",
        "platform_label": "PS5 / PS4 Gift Card",
        "store": "Hype Games",
        "regular_price": 100.00,
        "deal_price": 95.00,
        "discount_percent": 5,
        "rating": 99,
        "deal_url": "https://hype.games/br",
        "image": "https://images.unsplash.com/photo-1507457379470-08b800bebc67?w=600&auto=format&fit=crop&q=80",
        "badge": "Crédito Digital Instantâneo",
        "review_verdict": "Ativação oficial de créditos na PSN brasileira com entrega imediata e Pix."
    },
    {
        "id": "deal-gamepass",
        "name": "Xbox Game Pass Ultimate (3 Meses)",
        "platform": "Xbox",
        "platform_label": "Xbox & PC Cloud",
        "store": "Hype Games",
        "regular_price": 179.99,
        "deal_price": 149.90,
        "discount_percent": 17,
        "rating": 98,
        "deal_url": "https://hype.games/br",
        "image": "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop&q=80",
        "badge": "O Melhor Custo-Benefício Gamer",
        "review_verdict": "Centenas de jogos no catálogo, lançamentos Day One, EA Play e nuvem no celular e PC."
    },
    {
        "id": "deal-forza5",
        "name": "Forza Horizon 5",
        "platform": "Xbox",
        "platform_label": "Xbox Series & PC",
        "store": "Nuuvem",
        "regular_price": 249.00,
        "deal_price": 124.50,
        "discount_percent": 50,
        "rating": 88,
        "deal_url": "https://www.nuuvem.com/br-pt/catalog/search?q=Forza%20Horizon%205&partner=albertgamer",
        "image": "https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg",
        "badge": "Corrida em Mundo Aberto -50%",
        "review_verdict": "O melhor jogo de corrida arcade da atualidade, ambientado no vibrante México."
    },
    {
        "id": "deal-zelda-totk",
        "name": "The Legend of Zelda: Tears of the Kingdom",
        "platform": "Nintendo",
        "platform_label": "Nintendo Switch",
        "store": "Amazon",
        "regular_price": 399.00,
        "deal_price": 289.00,
        "discount_percent": 28,
        "rating": 96,
        "deal_url": "https://www.amazon.com.br",
        "image": "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&auto=format&fit=crop&q=80",
        "badge": "Jogo do Ano Switch",
        "review_verdict": "Criatividade sem limites com a mecânica de fusão e exploração vertical fantástica."
    },
    {
        "id": "deal-nintendo-eshop",
        "name": "Cartão Presente Nintendo eShop R$ 100",
        "platform": "Nintendo",
        "platform_label": "Nintendo Switch eShop",
        "store": "Hype Games",
        "regular_price": 100.00,
        "deal_price": 96.00,
        "discount_percent": 4,
        "rating": 99,
        "deal_url": "https://hype.games/br",
        "image": "https://images.unsplash.com/photo-1612287233215-d227f2f111ee?w=600&auto=format&fit=crop&q=80",
        "badge": "Crédito Oficial Nintendo",
        "review_verdict": "Compre jogos digitais e DLCs na eShop brasileira com facilidade e segurança."
    }
]


@app.get("/api/deals")
async def get_deals(
    platform: Optional[str] = Query(None, description="Filtrar por plataforma: all, PC, PlayStation, Xbox, Nintendo"),
    min_discount: Optional[int] = Query(0, description="Desconto mínimo percentual")
):
    """
    Retorna radar de promoções multiplataforma com dados de descontos, lojas e links.
    """
    results = DEALS_DATABASE.copy()

    if platform and platform.lower() != "all" and platform.lower() != "todos":
        results = [d for d in results if d["platform"].lower() == platform.lower()]

    if min_discount > 0:
        results = [d for d in results if d["discount_percent"] >= min_discount]

    # Ordena por maior desconto
    results.sort(key=lambda x: x["discount_percent"], reverse=True)

    return {
        "total": len(results),
        "deals": results
    }


@app.get("/api/search_store")
async def search_steam_store(q: str = Query(..., min_length=2, description="Nome de qualquer jogo")):
    """
    Pesquisa universal de QUALQUER jogo em tempo real:
    1. Busca nos jogos cadastrados no GameLens
    2. Busca nas ofertas ativas
    3. Consulta a API pública da Steam Store em tempo real para trazer qualquer jogo do mundo!
    """
    query = q.strip()
    query_lower = query.lower()

    # 1. Correspondências locais no catálogo principal
    local_games = [
        g for g in GAMES_DATABASE.values()
        if query_lower in g["name"].lower() or query_lower in g.get("developer", "").lower()
    ]

    # 2. Correspondências no banco de promoções
    deal_matches = [
        d for d in DEALS_DATABASE
        if query_lower in d["name"].lower()
    ]

    # 3. Consulta ao vivo na Steam Store pública (sem necessidade de chaves pagas)
    steam_live_results = []
    try:
        encoded_query = urllib.parse.quote(query)
        steam_url = f"https://store.steampowered.com/api/storesearch/?term={encoded_query}&l=portuguese&cc=BR"
        req = urllib.request.Request(
            steam_url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GameLens/2.0"
            }
        )
        with urllib.request.urlopen(req, timeout=3.5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("items", [])
            for item in items[:10]:
                item_id = str(item.get("id"))
                price_info = item.get("price") or {}
                orig_cents = price_info.get("initial", 0)
                final_cents = price_info.get("final", 0)
                curr_brl = final_cents / 100.0 if final_cents else 0.0
                orig_brl = orig_cents / 100.0 if orig_cents else curr_brl

                disc = 0
                if orig_cents > 0 and final_cents < orig_cents:
                    disc = int(round(((orig_cents - final_cents) / orig_cents) * 100))

                steam_live_results.append({
                    "id": item_id,
                    "name": item.get("name"),
                    "header_image": item.get("tiny_image") or f"https://cdn.akamai.steamstatic.com/steam/apps/{item_id}/header.jpg",
                    "current_price_brl": curr_brl,
                    "original_price_brl": orig_brl,
                    "price_formatted": f"R$ {curr_brl:.2f}".replace(".", ",") if curr_brl > 0 else "Gratuito",
                    "discount_percent": disc,
                    "source": "steam_store"
                })
    except Exception:
        # Falha silenciosa para nunca quebrar a requisição do usuário
        pass

    return {
        "query": query,
        "local_games": local_games,
        "deal_matches": deal_matches,
        "steam_live_results": steam_live_results
    }


@app.get("/api/reviews")
async def get_reviews():
    """
    Retorna catálogo de críticas e análises técnicas editoriais do GameLens.
    """
    return {
        "total": len(GAMES_DATABASE),
        "editorial": "GameLens Editorial & Reviews",
        "featured": [
            {
                "id": "1086940",
                "name": "Baldur's Gate 3",
                "badge": "Obra-Prima",
                "score": 9.9,
                "genre": "RPG",
                "verdict_lead": "Uma aula magistral de design, narrativa reativa e respeito inegociável à inteligência do jogador."
            },
            {
                "id": "1245620",
                "name": "Elden Ring",
                "badge": "Obra-Prima",
                "score": 9.8,
                "genre": "RPG",
                "verdict_lead": "As Terras Intermédias recompensam a curiosidade como nenhum outro mapa aberto já fez antes."
            },
            {
                "id": "730",
                "name": "Counter-Strike 2",
                "badge": "Essencial",
                "score": 9.3,
                "genre": "Ação",
                "verdict_lead": "Com fumaças volumétricas interativas e gunplay incomparável, CS2 continua sendo o teste de precisão definitivo."
            },
            {
                "id": "1091500",
                "name": "Cyberpunk 2077",
                "badge": "Obra-Prima",
                "score": 9.5,
                "genre": "RPG",
                "verdict_lead": "Após a atualização 2.0 e Phantom Liberty, Cyberpunk se tornou uma das maiores experiências audiovisuais já criadas."
            },
            {
                "id": "292030",
                "name": "The Witcher 3: Wild Hunt",
                "badge": "Obra-Prima",
                "score": 9.8,
                "genre": "RPG",
                "verdict_lead": "Mesmo anos após o lançamento, as missões secundárias de The Witcher 3 humilham histórias principais de rivais."
            },
            {
                "id": "105600",
                "name": "Terraria",
                "badge": "Obra-Prima",
                "score": 9.7,
                "genre": "Indie",
                "verdict_lead": "Mais de 13 anos de suporte carinhoso transformaram Terraria em um gigante de conteúdo."
            }
        ]
    }


@app.get("/api/health")
async def health_check():
    """Endpoint de checagem de integridade para monitoramento (Render/UptimeRobot)."""
    return {"status": "ok", "service": "gamelens-portal-api", "version": "2.0.0"}


# ==============================================================================
# PONTO DE ENTRADA PARA EXECUÇÃO DIRETA (python main.py)
# ==============================================================================
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"[*] Iniciando Steam Analytics Dashboard em http://0.0.0.0:{port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
`,
    'templates/index.html': `<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameLens - Portal & Dashboard de Biblioteca Gamer</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        steam: {
                            base: '#0e141b',
                            dark: '#171a21',
                            card: '#1b2838',
                            hover: '#233446',
                            border: '#2a475e',
                            blue: '#66c0f4',
                            sky: '#c7d5e0',
                            accent: '#38bdf8'
                        }
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #0e141b;
            color: #c7d5e0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            transition: background-color 0.25s ease, color 0.25s ease;
        }
        .tabular-nums {
            font-family: 'JetBrains Mono', monospace;
            font-variant-numeric: tabular-nums;
        }
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #101822;
        }
        ::-webkit-scrollbar-thumb {
            background: #233446;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #314863;
        }

        /* TEMA CLARO GLOBAL */
        html.light body {
            background-color: #f1f5f9;
            color: #1e293b;
        }
        html.light header {
            background-color: #ffffff !important;
            border-color: #e2e8f0 !important;
        }
        html.light nav {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
        }
        html.light .bg-\\[\\#1b2838\\] {
            background-color: #ffffff !important;
            border-color: #cbd5e1 !important;
            color: #0f172a !important;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        }
        html.light .bg-\\[\\#171a21\\] {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
            color: #1e293b !important;
        }
        html.light .bg-\\[\\#101822\\] {
            background-color: #f1f5f9 !important;
            border-color: #cbd5e1 !important;
        }
        html.light .bg-\\[\\#121c27\\] {
            background-color: #e2e8f0 !important;
            border-color: #cbd5e1 !important;
        }
        html.light .text-white {
            color: #0f172a !important;
        }
        html.light .text-slate-300 {
            color: #334155 !important;
        }
        html.light .text-slate-400 {
            color: #64748b !important;
        }
        html.light .border-\\[\\#2a475e\\] {
            border-color: #cbd5e1 !important;
        }
        html.light input {
            background-color: #ffffff !important;
            color: #0f172a !important;
            border-color: #cbd5e1 !important;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col antialiased">

    <!-- TOP HEADER STEAM NAVIGATION -->
    <header class="bg-[#171a21] border-b border-[#2a475e] sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            
            <!-- Logo & Brand Zone -->
            <div class="flex items-center gap-3 shrink-0 cursor-pointer" onclick="switchMainTab('dashboard')">
                <svg class="w-8 h-8 text-[#66c0f4]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.64 3.16 8.54 7.44 9.65l2.4-3.48a4.995 4.995 0 0 1-1.84-3.87 5 5 0 0 1 5-5c1.84 0 3.44.99 4.29 2.47l3.2-1.37C21.05 6.07 16.94 2 12 2zm3 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                </svg>
                <div class="flex flex-col">
                    <span class="text-white font-extrabold text-lg tracking-tight">Game<span class="text-[#66c0f4]">Lens</span></span>
                    <span class="text-[11px] text-slate-400">Portal Gamer & Analytics</span>
                </div>
            </div>

            <!-- Quick Selector / Search Header Tool -->
            <div class="flex-1 max-w-md hidden sm:block">
                <div class="relative">
                    <input 
                        type="text" 
                        id="global-search" 
                        placeholder="Buscar por jogo ou desenvolvedor..." 
                        class="w-full bg-[#1b2838] border border-[#2a475e] text-white text-sm rounded-lg px-4 py-2 pl-9 pr-9 focus:outline-none focus:border-[#66c0f4] transition placeholder-slate-400"
                        oninput="handleSearch(this.value)"
                    />
                    <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <button 
                        type="button" 
                        id="header-voice-btn" 
                        onclick="startVoiceSearch('global-search', 'header-voice-btn')" 
                        class="absolute right-2.5 top-2 p-0.5 text-slate-400 hover:text-[#66c0f4] transition rounded" 
                        title="Pesquisar por comando de voz"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Actions / Status -->
            <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                <button 
                    id="theme-toggle-btn" 
                    onclick="toggleGlobalTheme()" 
                    class="p-2 rounded-lg bg-[#1b2838] hover:bg-[#233446] border border-[#2a475e] text-amber-300 hover:text-amber-200 transition flex items-center justify-center"
                    title="Alternar Tema Claro / Escuro"
                >
                    <svg id="theme-icon-sun" class="w-4 h-4 hidden text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    <svg id="theme-icon-moon" class="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                </button>
                <button 
                    onclick="openPixModal()" 
                    class="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-sm"
                    title="Apoiar este projeto com Pix"
                >
                    <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>Apoiar via Pix</span>
                </button>
                <button 
                    onclick="fetchDashboardData()" 
                    id="btn-refresh"
                    class="bg-[#2a475e] hover:bg-[#3b5f7d] text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5"
                    title="Atualizar dados da API"
                >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <span class="hidden sm:inline">Atualizar</span>
                </button>
            </div>

        </div>
    </header>

    <!-- GUIA DE CORES POR NICHO -->
    <div class="bg-[#121c27] border-b border-[#2a475e]/60 py-2.5 px-4 sm:px-8">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2">
                <span class="text-slate-400 font-medium">Cores dos Nichos:</span>
                <div class="flex items-center gap-3 flex-wrap">
                    <span class="flex items-center gap-1 text-[11px]">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                        <span>Ação</span>
                    </span>
                    <span class="flex items-center gap-1 text-[11px]">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#a855f7]"></span>
                        <span>RPG</span>
                    </span>
                    <span class="flex items-center gap-1 text-[11px]">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                        <span>Estratégia</span>
                    </span>
                    <span class="flex items-center gap-1 text-[11px]">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                        <span>Indie</span>
                    </span>
                    <span class="flex items-center gap-1 text-[11px]">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#06b6d4]"></span>
                        <span>Simulação</span>
                    </span>
                </div>
            </div>
            <div class="text-slate-400 text-xs">
                <span>Cores distintas para jogos e categorias ativas</span>
            </div>
        </div>
    </div>

    <!-- PRIMARY NAVIGATION TABS (DASHBOARD, OFERTAS, BUSCA UNIVERSAL, CONSOLES, CRÍTICAS) -->
    <nav class="bg-[#101822] border-b border-[#2a475e] sticky top-16 z-30 shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 overflow-x-auto py-2.5">
            <div class="flex items-center gap-2">
                <button id="nav-btn-dashboard" onclick="switchMainTab('dashboard')" class="nav-tab-btn active px-4 py-2 rounded-lg text-xs font-bold text-[#101822] bg-[#66c0f4] transition flex items-center gap-2 shadow-sm whitespace-nowrap">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    <span>Dashboard & Biblioteca</span>
                </button>
                <button id="nav-btn-deals" onclick="switchMainTab('deals')" class="nav-tab-btn px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-[#1b2838] transition flex items-center gap-2 whitespace-nowrap">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>⚡ Radar de Promoções</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] bg-red-600/90 text-white font-extrabold">-75%</span>
                </button>
                <button id="nav-btn-search" onclick="switchMainTab('search')" class="nav-tab-btn px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-[#1b2838] transition flex items-center gap-2 whitespace-nowrap">
                    <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <span>🔍 Buscar Qualquer Jogo</span>
                </button>
                <button id="nav-btn-platforms" onclick="switchMainTab('platforms')" class="nav-tab-btn px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-[#1b2838] transition flex items-center gap-2 whitespace-nowrap">
                    <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>🎮 Consoles & PC</span>
                </button>
                <button id="nav-btn-reviews" onclick="switchMainTab('reviews')" class="nav-tab-btn px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-[#1b2838] transition flex items-center gap-2 whitespace-nowrap">
                    <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <span>⭐ Críticas & Reviews</span>
                </button>
            </div>
            <div class="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
                <span class="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>🛡️ Chaves Oficiais · Entrega Imediata · Pix</span>
                </span>
            </div>
        </div>
    </nav>

    <!-- MAIN DASHBOARD CONTENT -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        <!-- SECTION 1: DASHBOARD & BIBLIOTECA -->
        <div id="tab-section-dashboard" class="space-y-10">
            
            <!-- SEÇÃO PRINCIPAL SUPERIOR: GAMES INDICADOS DO DIA E RESUMOS DE CRÍTICAS -->
            <div class="space-y-6">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#171a21] via-[#1b2838] to-[#171a21] p-6 sm:p-8 rounded-2xl border border-[#2a475e] shadow-xl relative overflow-hidden">
                    <div class="space-y-2 relative z-10">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-extrabold">
                            <span>✨ SELEÇÃO DIÁRIA DA IMPRENSA & COMUNIDADE</span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Games Indicados do Dia & Resumos de Críticas
                        </h1>
                        <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                            Confira as análises em destaque, vereditos da crítica especializada e menores preços verificados com links diretos de aquisição oficial.
                        </p>
                    </div>
                </div>

                <!-- Grade de Games Indicados do Dia -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col justify-between transition group shadow-lg cursor-pointer" onclick="openGameModal('1245620')">
                        <div class="relative h-44 w-full bg-[#101822] overflow-hidden">
                            <img src="https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                            <div class="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                            <div class="absolute top-2.5 left-2.5"><span class="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-500 text-black shadow-md">🔥 Indicado do Dia</span></div>
                            <div class="absolute top-2.5 right-2.5"><span class="px-2 py-0.5 rounded text-xs font-extrabold bg-black/80 text-amber-300 border border-amber-500/30">★ 93%</span></div>
                            <div class="absolute bottom-2 left-3 right-3"><h3 class="text-base font-extrabold text-white truncate">Elden Ring</h3></div>
                        </div>
                        <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div class="bg-[#171a21] border-l-2 border-[#66c0f4] p-2.5 rounded-r-lg">
                                <span class="text-[10px] text-[#66c0f4] font-bold block uppercase mb-0.5">Resumo da Crítica</span>
                                <p class="text-xs text-slate-300 italic line-clamp-3">"Uma obra-prima revolucionária de RPG de ação. Exploração orgânica monumental e chefes inesquecíveis."</p>
                            </div>
                            <div class="flex items-center justify-between pt-2 border-t border-[#2a475e]">
                                <div>
                                    <span class="text-[10px] text-slate-400 line-through block">R$ 229,90</span>
                                    <div class="flex items-center gap-1.5">
                                        <span class="text-base font-black text-emerald-400">R$ 151,73</span>
                                        <span class="text-[10px] font-black px-1.5 py-0.2 bg-red-600/90 text-white rounded">-34%</span>
                                    </div>
                                </div>
                                <button onclick="event.stopPropagation(); openGameModal('1245620')" class="px-3 py-1 bg-[#66c0f4] text-[#101822] text-xs font-extrabold rounded hover:bg-[#38bdf8] transition">Dados</button>
                            </div>
                        </div>
                    </div>

                    <div class="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col justify-between transition group shadow-lg cursor-pointer" onclick="openGameModal('1086940')">
                        <div class="relative h-44 w-full bg-[#101822] overflow-hidden">
                            <img src="https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                            <div class="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                            <div class="absolute top-2.5 left-2.5"><span class="px-2.5 py-0.5 rounded text-[10px] font-black bg-purple-500 text-white shadow-md">🏆 Jogo do Ano GOTY</span></div>
                            <div class="absolute top-2.5 right-2.5"><span class="px-2 py-0.5 rounded text-xs font-extrabold bg-black/80 text-amber-300 border border-amber-500/30">★ 96%</span></div>
                            <div class="absolute bottom-2 left-3 right-3"><h3 class="text-base font-extrabold text-white truncate">Baldur's Gate 3</h3></div>
                        </div>
                        <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div class="bg-[#171a21] border-l-2 border-[#66c0f4] p-2.5 rounded-r-lg">
                                <span class="text-[10px] text-[#66c0f4] font-bold block uppercase mb-0.5">Resumo da Crítica</span>
                                <p class="text-xs text-slate-300 italic line-clamp-3">"Narrativa ramificada brilhante com escolhas que moldam verdadeiramente o mundo e seus companheiros."</p>
                            </div>
                            <div class="flex items-center justify-between pt-2 border-t border-[#2a475e]">
                                <div>
                                    <span class="text-[10px] text-slate-400 line-through block">R$ 199,99</span>
                                    <div class="flex items-center gap-1.5">
                                        <span class="text-base font-black text-emerald-400">R$ 159,99</span>
                                        <span class="text-[10px] font-black px-1.5 py-0.2 bg-red-600/90 text-white rounded">-20%</span>
                                    </div>
                                </div>
                                <button onclick="event.stopPropagation(); openGameModal('1086940')" class="px-3 py-1 bg-[#66c0f4] text-[#101822] text-xs font-extrabold rounded hover:bg-[#38bdf8] transition">Dados</button>
                            </div>
                        </div>
                    </div>

                    <div class="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col justify-between transition group shadow-lg cursor-pointer" onclick="openGameModal('1091500')">
                        <div class="relative h-44 w-full bg-[#101822] overflow-hidden">
                            <img src="https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                            <div class="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                            <div class="absolute top-2.5 left-2.5"><span class="px-2.5 py-0.5 rounded text-[10px] font-black bg-red-600 text-white shadow-md">-50% OFF</span></div>
                            <div class="absolute top-2.5 right-2.5"><span class="px-2 py-0.5 rounded text-xs font-extrabold bg-black/80 text-amber-300 border border-amber-500/30">★ 89%</span></div>
                            <div class="absolute bottom-2 left-3 right-3"><h3 class="text-base font-extrabold text-white truncate">Cyberpunk 2077</h3></div>
                        </div>
                        <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div class="bg-[#171a21] border-l-2 border-[#66c0f4] p-2.5 rounded-r-lg">
                                <span class="text-[10px] text-[#66c0f4] font-bold block uppercase mb-0.5">Resumo da Crítica</span>
                                <p class="text-xs text-slate-300 italic line-clamp-3">"Night City ganha vida com gráficos espetaculares e a aclamada expansão Phantom Liberty inclusa."</p>
                            </div>
                            <div class="flex items-center justify-between pt-2 border-t border-[#2a475e]">
                                <div>
                                    <span class="text-[10px] text-slate-400 line-through block">R$ 199,90</span>
                                    <div class="flex items-center gap-1.5">
                                        <span class="text-base font-black text-emerald-400">R$ 99,95</span>
                                        <span class="text-[10px] font-black px-1.5 py-0.2 bg-red-600/90 text-white rounded">-50%</span>
                                    </div>
                                </div>
                                <button onclick="event.stopPropagation(); openGameModal('1091500')" class="px-3 py-1 bg-[#66c0f4] text-[#101822] text-xs font-extrabold rounded hover:bg-[#38bdf8] transition">Dados</button>
                            </div>
                        </div>
                    </div>

                    <div class="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col justify-between transition group shadow-lg cursor-pointer" onclick="openGameModal('730')">
                        <div class="relative h-44 w-full bg-[#101822] overflow-hidden">
                            <img src="https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                            <div class="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                            <div class="absolute top-2.5 left-2.5"><span class="px-2.5 py-0.5 rounded text-[10px] font-black bg-orange-500 text-black shadow-md">🎯 eSports nº 1</span></div>
                            <div class="absolute top-2.5 right-2.5"><span class="px-2 py-0.5 rounded text-xs font-extrabold bg-black/80 text-amber-300 border border-amber-500/30">★ 88%</span></div>
                            <div class="absolute bottom-2 left-3 right-3"><h3 class="text-base font-extrabold text-white truncate">Counter-Strike 2</h3></div>
                        </div>
                        <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div class="bg-[#171a21] border-l-2 border-[#66c0f4] p-2.5 rounded-r-lg">
                                <span class="text-[10px] text-[#66c0f4] font-bold block uppercase mb-0.5">Resumo da Crítica</span>
                                <p class="text-xs text-slate-300 italic line-clamp-3">"A evolução máxima do tiro tático no motor Source 2, com fumaças volumétricas reativas e tiro preciso."</p>
                            </div>
                            <div class="flex items-center justify-between pt-2 border-t border-[#2a475e]">
                                <div>
                                    <span class="text-[10px] text-slate-400 block">Ativação Oficial</span>
                                    <span class="text-base font-black text-emerald-400">Gratuito</span>
                                </div>
                                <button onclick="event.stopPropagation(); openGameModal('730')" class="px-3 py-1 bg-[#66c0f4] text-[#101822] text-xs font-extrabold rounded hover:bg-[#38bdf8] transition">Dados</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SEÇÃO SEGUNDA: ANALYTICS & DASHBOARD DA BIBLIOTECA -->
            <div class="pt-6 border-t border-[#2a475e]/60">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                            <span>📊 Painel Analytics & Desempenho da Biblioteca</span>
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-400 mt-1">Estatísticas consolidadas com filtros de período e cromatografia por nicho.</p>
                    </div>
                    <!-- Quick Filter Bar (Período & Nichos) -->
                    <div class="flex flex-wrap items-center gap-3">
                        <div class="flex items-center gap-1 bg-[#171a21] p-1 rounded-lg border border-[#2a475e]">
                            <span class="text-[11px] text-slate-400 px-2 font-medium">Período:</span>
                            <button onclick="changeHtmlPeriod('1m')" id="period-btn-1m" class="period-btn px-2.5 py-1 text-xs rounded transition font-bold text-slate-300 hover:text-white">1 Mês</button>
                            <button onclick="changeHtmlPeriod('3m')" id="period-btn-3m" class="period-btn px-2.5 py-1 text-xs rounded transition font-bold text-slate-300 hover:text-white">3 Meses</button>
                            <button onclick="changeHtmlPeriod('6m')" id="period-btn-6m" class="period-btn px-2.5 py-1 text-xs rounded transition font-bold bg-[#66c0f4] text-[#101822] shadow-sm">6 Meses</button>
                            <button onclick="changeHtmlPeriod('1y')" id="period-btn-1y" class="period-btn px-2.5 py-1 text-xs rounded transition font-bold text-slate-300 hover:text-white">1 Ano</button>
                            <button onclick="changeHtmlPeriod('all')" id="period-btn-all" class="period-btn px-2.5 py-1 text-xs rounded transition font-bold text-slate-300 hover:text-white">Total</button>
                        </div>
                        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" id="genre-filter-container">
                            <button onclick="filterByGenre('Todos')" class="genre-btn px-3 py-1.5 text-xs font-medium rounded-md bg-[#66c0f4] text-[#101822] transition whitespace-nowrap">Todos</button>
                            <button onclick="filterByGenre('RPG')" class="genre-btn px-3 py-1.5 text-xs font-medium rounded-md bg-[#1b2838] hover:bg-[#233446] text-slate-300 transition whitespace-nowrap flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-[#a855f7]"></span>
                                <span>RPG</span>
                            </button>
                            <button onclick="filterByGenre('Ação')" class="genre-btn px-3 py-1.5 text-xs font-medium rounded-md bg-[#1b2838] hover:bg-[#233446] text-slate-300 transition whitespace-nowrap flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-[#ef4444]"></span>
                                <span>Ação</span>
                            </button>
                            <button onclick="filterByGenre('Estratégia')" class="genre-btn px-3 py-1.5 text-xs font-medium rounded-md bg-[#1b2838] hover:bg-[#233446] text-slate-300 transition whitespace-nowrap flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                                <span>Estratégia</span>
                            </button>
                            <button onclick="filterByGenre('Indie')" class="genre-btn px-3 py-1.5 text-xs font-medium rounded-md bg-[#1b2838] hover:bg-[#233446] text-slate-300 transition whitespace-nowrap flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-[#10b981]"></span>
                                <span>Indie</span>
                            </button>
                        </div>
                    </div>
                </div>

            <!-- 3 CARDS DE MÉTRICAS EM DESTAQUE -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- Card 1: Total de Horas -->
                <div class="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 relative overflow-hidden transition hover:border-[#66c0f4]">
                    <div class="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                        <span>TEMPO TOTAL REGISTRADO</span>
                        <svg class="w-5 h-5 text-[#66c0f4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div class="text-3xl sm:text-4xl font-bold text-white tabular-nums" id="card-total-hours">
                        {{ stats.total_hours if stats else '0' }} <span class="text-lg font-normal text-slate-400">horas</span>
                    </div>
                    <div class="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <span>Em <strong class="text-white" id="card-total-games">{{ stats.total_games if stats else '0' }}</strong> jogos catalogados</span>
                        <span aria-hidden="true">·</span>
                        <span class="text-emerald-400">+14.2h este mês</span>
                    </div>
                </div>

                <!-- Card 2: Jogo Mais Jogado -->
                <div class="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 relative overflow-hidden transition hover:border-[#66c0f4] cursor-pointer" onclick="openGameModal(currentStats?.most_played_game?.id || '730')">
                    <div class="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                        <span>JOGO MAIS JOGADO</span>
                        <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                        </svg>
                    </div>
                    <div class="text-2xl font-bold text-white truncate flex items-center gap-2" id="card-most-played-name">
                        <span class="w-3 h-3 rounded-full bg-[#f97316] shrink-0"></span>
                        <span>{{ stats.most_played_game.name if stats and stats.most_played_game else 'Counter-Strike 2' }}</span>
                    </div>
                    <div class="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <span class="tabular-nums font-semibold text-[#f97316]" id="card-most-played-hours">{{ stats.most_played_game.hours_played if stats and stats.most_played_game else '845.2' }}h jogadas</span>
                        <span aria-hidden="true">·</span>
                        <span class="text-slate-300">Classificação: {{ stats.most_played_game.rating_label if stats and stats.most_played_game else 'Muito Positivas' }}</span>
                    </div>
                </div>

                <!-- Card 3: Avaliação Média da Biblioteca -->
                <div class="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 relative overflow-hidden transition hover:border-[#66c0f4]">
                    <div class="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                        <span>AVALIAÇÃO MÉDIA DA BIBLIOTECA</span>
                        <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2m-7 0H4a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                        </svg>
                    </div>
                    <div class="text-3xl sm:text-4xl font-bold text-emerald-400 tabular-nums" id="card-avg-rating">
                        {{ stats.avg_rating if stats else '91.8' }}%
                    </div>
                    <div class="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <span>Índice Positivo Global</span>
                        <span aria-hidden="true">·</span>
                        <span class="text-slate-300">Baseado em análises de usuários Steam</span>
                    </div>
                </div>
            </div>

            <!-- GRÁFICO DE LINHA: TENDÊNCIA DOS ÚLTIMOS 6 MESES -->
            <div class="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 mb-8 shadow-md">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                <svg class="w-5 h-5 text-[#66c0f4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                                </svg>
                                <span id="line-chart-title-text">Evolução de Horas Jogadas (Últimos 6 Meses)</span>
                            </h2>
                            <span id="line-growth-badge" class="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-2.5 py-0.5 rounded-full font-bold">
                                +123.8% de crescimento
                            </span>
                        </div>
                        <p class="text-xs text-slate-400 mt-1">Comparativo mensal de dedicação à biblioteca e aceleração de atividade no período recente.</p>
                    </div>
                    <div class="flex items-center gap-3 text-xs flex-wrap">
                        <div class="bg-[#171a21] border border-[#2a475e] px-3.5 py-2 rounded-lg">
                            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Média Mensal</span>
                            <span class="font-mono font-bold text-white text-sm tabular-nums" id="line-avg-hours">473.9h</span>
                        </div>
                        <div class="bg-[#171a21] border border-[#2a475e] px-3.5 py-2 rounded-lg">
                            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Mês de Pico</span>
                            <span class="font-bold text-[#66c0f4] text-sm" id="line-peak-month">Outubro (668.3h)</span>
                        </div>
                        <div class="bg-[#171a21] border border-[#2a475e] px-3.5 py-2 rounded-lg hidden sm:block">
                            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Total no Período</span>
                            <span class="font-mono font-bold text-emerald-400 text-sm tabular-nums" id="line-total-hours">2.843.8h</span>
                        </div>
                    </div>
                </div>
                <div class="relative h-[280px] sm:h-[320px]">
                    <canvas id="trendLineChart"></canvas>
                </div>
            </div>

            <!-- 2 GRÁFICOS INTERATIVOS ESTILIZADOS COM CHART.JS -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <!-- Gráfico 1: Barras -->
                <div class="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 flex flex-col">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                            <h2 class="text-base font-bold text-white">Top Jogos por Horas Jogadas</h2>
                            <p class="text-xs text-slate-400">Cores distintas identificando cada jogo</p>
                        </div>
                        <div class="flex items-center gap-1 bg-[#171a21] p-1 rounded-lg border border-[#2a475e]">
                            <button onclick="setHtmlColorMode('game')" id="btn-colormode-game" class="px-2.5 py-1 text-[11px] rounded bg-[#66c0f4] text-[#101822] font-semibold transition">Cor do Jogo</button>
                            <button onclick="setHtmlColorMode('genre')" id="btn-colormode-genre" class="px-2.5 py-1 text-[11px] rounded text-slate-400 hover:text-white transition">Cor do Nicho</button>
                        </div>
                    </div>
                    <div class="relative flex-1 min-h-[300px]">
                        <canvas id="barChart"></canvas>
                    </div>
                </div>

                <!-- Gráfico 2: Rosca/Doughnut -->
                <div class="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 flex flex-col">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h2 class="text-base font-bold text-white">Distribuição por Nicho / Gênero</h2>
                            <p class="text-xs text-slate-400">Proporção com cores de alto contraste por categoria</p>
                        </div>
                        <span class="text-xs font-mono text-[#66c0f4] bg-[#171a21] px-2 py-0.5 rounded border border-[#2a475e]">Chart.js</span>
                    </div>
                    <div class="relative flex-1 min-h-[300px] flex items-center justify-center">
                        <canvas id="doughnutChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- TABELA DE DADOS DETALHADA COM FILTRO E ORDENAÇÃO -->
            <div class="bg-[#1b2838] border border-[#2a475e] rounded-xl overflow-hidden shadow-lg">
                <div class="p-5 border-b border-[#2a475e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-lg font-bold text-white">Catálogo Detalhado de Jogos</h2>
                        <p class="text-xs text-slate-400">Identificação cromática por título e estilo de gameplay</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <div id="table-active-filter-badge" class="hidden items-center gap-1.5 px-2.5 py-1 rounded bg-[#171a21] border border-[#66c0f4]/50 text-xs text-white">
                            <span class="w-2 h-2 rounded-full bg-[#66c0f4]"></span>
                            <span class="text-slate-300">Nicho ativo:</span>
                            <strong class="text-white" id="table-active-filter-text"></strong>
                            <button onclick="filterByGenre('Todos')" class="ml-1 text-slate-400 hover:text-white transition p-0.5 rounded hover:bg-[#2a475e]" title="Remover filtro">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>

                        <span class="text-xs text-slate-400">Ordenar por:</span>
                        <select 
                            id="table-sort-select" 
                            onchange="handleSortChange(this.value)"
                            class="bg-[#171a21] border border-[#2a475e] text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#66c0f4]"
                        >
                            <option value="hours">Mais Jogados (Horas)</option>
                            <option value="rating">Maior Avaliação (%)</option>
                            <option value="players">Pico 24h Jogadores</option>
                            <option value="price">Preço</option>
                            <option value="name">Nome (A-Z)</option>
                        </select>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-slate-300">
                        <thead class="text-xs uppercase bg-[#171a21] text-slate-400 border-b border-[#2a475e]">
                            <tr>
                                <th scope="col" class="px-6 py-3.5">Jogo & Cor Tema</th>
                                <th scope="col" class="px-6 py-3.5">Nicho / Gênero</th>
                                <th scope="col" class="px-6 py-3.5 text-right cursor-pointer hover:text-white" onclick="toggleSort('hours')">Horas Jogadas ↕</th>
                                <th scope="col" class="px-6 py-3.5 text-right cursor-pointer hover:text-white" onclick="toggleSort('rating')">Avaliação Steam ↕</th>
                                <th scope="col" class="px-6 py-3.5 text-right cursor-pointer hover:text-white" onclick="toggleSort('players')">Pico 24h ↕</th>
                                <th scope="col" class="px-6 py-3.5 text-right cursor-pointer hover:text-white" onclick="toggleSort('price')">Preço ↕</th>
                                <th scope="col" class="px-6 py-3.5 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="games-table-body" class="divide-y divide-[#2a475e]/60">
                        </tbody>
                    </table>
                </div>

                <div class="px-6 py-4 bg-[#171a21] border-t border-[#2a475e] flex items-center justify-between text-xs text-slate-400">
                    <span id="table-summary-text">Exibindo todos os jogos</span>
                    <span>Dados sincronizados via API</span>
                </div>
            </div>
        </div>
        </div>
        <!-- FIM SECTION 1: DASHBOARD -->

        <!-- SECTION 2: RADAR DE PROMOÇÕES & DESCONTOS -->
        <div id="tab-section-deals" class="hidden space-y-8 animate-fade-in">
            <div class="bg-gradient-to-r from-[#171a21] via-[#1b2838] to-[#171a21] border border-[#2a475e] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div class="space-y-2">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            <span>RADAR ATIVO · OFERTAS VERIFICADAS EM TEMPO REAL</span>
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Central de Promoções & Chaves Oficiais
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                            Economize até 75% em ativações oficiais Steam, consoles (PS5, Xbox, Nintendo) e gift cards em reais com entrega instantânea e pagamento via Pix pelas nossas lojas parceiras.
                        </p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2 shrink-0">
                        <button onclick="filterDealsPlatform('all')" class="deal-pill-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#66c0f4] text-[#101822] transition">Todas</button>
                        <button onclick="filterDealsPlatform('PC')" class="deal-pill-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e] transition">PC (Steam/Epic)</button>
                        <button onclick="filterDealsPlatform('PlayStation')" class="deal-pill-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e] transition">PlayStation</button>
                        <button onclick="filterDealsPlatform('Xbox')" class="deal-pill-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e] transition">Xbox</button>
                        <button onclick="filterDealsPlatform('Nintendo')" class="deal-pill-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e] transition">Nintendo</button>
                    </div>
                </div>
            </div>

            <div id="deals-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            </div>
        </div>
        <!-- FIM SECTION 2: RADAR DE PROMOÇÕES -->

        <!-- SECTION 3: BUSCA UNIVERSAL AO VIVO -->
        <div id="tab-section-search" class="hidden space-y-8 animate-fade-in">
            <div class="bg-[#1b2838] border border-[#2a475e] rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xl">
                <div class="max-w-3xl mx-auto space-y-4">
                    <span class="inline-block px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                        API GLOBAL DA STEAM INTEGRADA AO VIVO
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-extrabold text-white">
                        Pesquise os Dados de Qualquer Jogo do Mundo
                    </h2>
                    <p class="text-xs sm:text-sm text-slate-300">
                        Digite o nome de qualquer título lançado na Steam ou consoles para consultar preços em BRL, descontos ativos, análises e onde comprar mais barato.
                    </p>

                    <div class="relative max-w-xl mx-auto mt-4">
                        <input 
                            type="text" 
                            id="universal-search-input" 
                            placeholder="Digite o nome do jogo (ex: GTA, God of War, Forza, Resident Evil, FIFA)..." 
                            class="w-full bg-[#101822] border-2 border-[#2a475e] text-white text-sm rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:border-[#66c0f4] transition shadow-inner placeholder-slate-400"
                            onkeydown="if(event.key === 'Enter') executeUniversalSearch()"
                        />
                        <svg class="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <div class="absolute right-2 top-2 bottom-2 flex items-center gap-1.5">
                            <button 
                                type="button" 
                                id="universal-voice-btn" 
                                onclick="startVoiceSearch('universal-search-input', 'universal-voice-btn', true)" 
                                class="p-2 text-slate-400 hover:text-[#66c0f4] bg-[#171a21] hover:bg-[#233446] border border-[#2a475e] rounded-lg transition" 
                                title="Pesquisar falando o nome do jogo"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                                </svg>
                            </button>
                            <button 
                                onclick="executeUniversalSearch()" 
                                class="h-full px-4 bg-[#66c0f4] hover:bg-[#38bdf8] text-[#101822] text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                            >
                                <span>Buscar</span>
                            </button>
                        </div>
                    </div>

                    <div class="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
                        <span class="text-slate-400">Sugestões:</span>
                        <button onclick="triggerQuickSearch('Grand Theft Auto V')" class="px-2.5 py-1 rounded-md bg-[#101822] hover:bg-[#233446] border border-[#2a475e] text-slate-300 transition">Grand Theft Auto V</button>
                        <button onclick="triggerQuickSearch('Elden Ring')" class="px-2.5 py-1 rounded-md bg-[#101822] hover:bg-[#233446] border border-[#2a475e] text-slate-300 transition">Elden Ring</button>
                        <button onclick="triggerQuickSearch('God of War')" class="px-2.5 py-1 rounded-md bg-[#101822] hover:bg-[#233446] border border-[#2a475e] text-slate-300 transition">God of War</button>
                        <button onclick="triggerQuickSearch('Cyberpunk 2077')" class="px-2.5 py-1 rounded-md bg-[#101822] hover:bg-[#233446] border border-[#2a475e] text-slate-300 transition">Cyberpunk 2077</button>
                        <button onclick="triggerQuickSearch('Red Dead Redemption 2')" class="px-2.5 py-1 rounded-md bg-[#101822] hover:bg-[#233446] border border-[#2a475e] text-slate-300 transition">Red Dead Redemption 2</button>
                    </div>
                </div>
            </div>

            <div id="search-results-container" class="space-y-4">
                <div class="flex items-center justify-between text-xs text-slate-400">
                    <span id="search-status-label">Digite um título acima para pesquisar</span>
                    <span id="search-count-label"></span>
                </div>
                <div id="search-results-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                </div>
            </div>
        </div>
        <!-- FIM SECTION 3: BUSCA UNIVERSAL -->

        <!-- SECTION 4: HUB MULTIPLATAFORMA (PC & CONSOLES) -->
        <div id="tab-section-platforms" class="hidden space-y-8 animate-fade-in">
            <div class="bg-gradient-to-r from-[#171a21] via-[#1f1b2e] to-[#171a21] border border-[#2a475e] rounded-2xl p-6 sm:p-8">
                <div class="max-w-3xl space-y-2">
                    <span class="inline-block px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold">
                        ECOSSISTEMA GAMER COMPLETO
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Hub Multiplataforma (PC & Consoles)</h2>
                    <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Atendemos todos os nichos gamer: PC (Steam & Epic Games), PlayStation 5, Xbox Series X|S / Game Pass e Nintendo Switch. Compre chaves oficiais e cartões pré-pagos digitais em reais sem tarifas extras.
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- PC -->
                <div class="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl p-5 flex flex-col justify-between transition group shadow-lg">
                    <div class="space-y-3">
                        <div class="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-[#66c0f4]">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.64 3.16 8.54 7.44 9.65l2.4-3.48a4.995 4.995 0 0 1-1.84-3.87 5 5 0 0 1 5-5c1.84 0 3.44.99 4.29 2.47l3.2-1.37C21.05 6.07 16.94 2 12 2zm3 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>
                        </div>
                        <h3 class="text-lg font-bold text-white group-hover:text-[#66c0f4] transition">PC Gamer (Steam & Epic)</h3>
                        <p class="text-xs text-slate-300 leading-relaxed">
                            Chaves de ativação digitais com descontos de até 85%. Ativação oficial e suporte a mods.
                        </p>
                        <div class="text-[11px] text-slate-400 bg-[#121c27] p-2.5 rounded-lg border border-[#2a475e]">
                            Lojas parceiras: <strong>Nuuvem (MID 46796)</strong> e <strong>Hype Games (MID 53304)</strong>
                        </div>
                    </div>
                    <button onclick="filterDealsPlatform('PC'); switchMainTab('deals')" class="mt-4 w-full py-2 bg-[#171a21] hover:bg-[#66c0f4] hover:text-[#101822] text-xs font-bold text-slate-200 rounded-lg transition border border-[#2a475e]">
                        Ver Ofertas de PC
                    </button>
                </div>

                <!-- PlayStation -->
                <div class="bg-[#1b2838] border border-[#2a475e] hover:border-blue-500 rounded-xl p-5 flex flex-col justify-between transition group shadow-lg">
                    <div class="space-y-3">
                        <div class="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <span class="text-xl font-black">PS</span>
                        </div>
                        <h3 class="text-lg font-bold text-white group-hover:text-blue-400 transition">PlayStation 5 & 4</h3>
                        <p class="text-xs text-slate-300 leading-relaxed">
                            Cartões de créditos da PSN brasileira com entrega por código digital e Pix, além de mídias físicas na Amazon.
                        </p>
                        <div class="text-[11px] text-slate-400 bg-[#121c27] p-2.5 rounded-lg border border-[#2a475e]">
                            Ofertas em: <strong>Hype Games</strong> (Gift Cards) e <strong>Amazon</strong> (Jogos Físicos)
                        </div>
                    </div>
                    <button onclick="filterDealsPlatform('PlayStation'); switchMainTab('deals')" class="mt-4 w-full py-2 bg-[#171a21] hover:bg-blue-600 hover:text-white text-xs font-bold text-slate-200 rounded-lg transition border border-[#2a475e]">
                        Ver Ofertas PlayStation
                    </button>
                </div>

                <!-- Xbox -->
                <div class="bg-[#1b2838] border border-[#2a475e] hover:border-emerald-500 rounded-xl p-5 flex flex-col justify-between transition group shadow-lg">
                    <div class="space-y-3">
                        <div class="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <span class="text-xl font-black">XB</span>
                        </div>
                        <h3 class="text-lg font-bold text-white group-hover:text-emerald-400 transition">Xbox & Game Pass</h3>
                        <p class="text-xs text-slate-300 leading-relaxed">
                            Assinaturas de Xbox Game Pass Ultimate (3 meses), cartões Xbox Live e jogos Play Anywhere.
                        </p>
                        <div class="text-[11px] text-slate-400 bg-[#121c27] p-2.5 rounded-lg border border-[#2a475e]">
                            Ofertas em: <strong>Hype Games</strong> e <strong>Nuuvem</strong>
                        </div>
                    </div>
                    <button onclick="filterDealsPlatform('Xbox'); switchMainTab('deals')" class="mt-4 w-full py-2 bg-[#171a21] hover:bg-emerald-600 hover:text-white text-xs font-bold text-slate-200 rounded-lg transition border border-[#2a475e]">
                        Ver Ofertas Xbox
                    </button>
                </div>

                <!-- Nintendo -->
                <div class="bg-[#1b2838] border border-[#2a475e] hover:border-red-500 rounded-xl p-5 flex flex-col justify-between transition group shadow-lg">
                    <div class="space-y-3">
                        <div class="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/30 flex items-center justify-center text-red-400">
                            <span class="text-xl font-black">NSW</span>
                        </div>
                        <h3 class="text-lg font-bold text-white group-hover:text-red-400 transition">Nintendo Switch</h3>
                        <p class="text-xs text-slate-300 leading-relaxed">
                            Cartões eShop digitais para comprar jogos na loja Nintendo Brasil, e jogos físicos na Amazon.
                        </p>
                        <div class="text-[11px] text-slate-400 bg-[#121c27] p-2.5 rounded-lg border border-[#2a475e]">
                            Ofertas em: <strong>Hype Games</strong> (eShop BR) e <strong>Amazon</strong>
                        </div>
                    </div>
                    <button onclick="filterDealsPlatform('Nintendo'); switchMainTab('deals')" class="mt-4 w-full py-2 bg-[#171a21] hover:bg-red-600 hover:text-white text-xs font-bold text-slate-200 rounded-lg transition border border-[#2a475e]">
                        Ver Ofertas Nintendo
                    </button>
                </div>
            </div>
        </div>
        <!-- FIM SECTION 4: CONSOLES -->

        <!-- SECTION 5: CRÍTICAS & REVIEWS EDITORIAIS -->
        <div id="tab-section-reviews" class="hidden space-y-8 animate-fade-in">
            <div class="bg-gradient-to-r from-[#171a21] via-[#1e1b2e] to-[#171a21] border border-[#2a475e] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div class="space-y-2">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold">
                            <span>⭐ GAMELENS EDITORIAL · JORNALISMO GAMER INDEPENDENTE</span>
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Críticas, Análises Técnicas & Vereditos
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                            Avaliações transparentes sem filtro corporativo. Dissecamos gameplay, otimização gráfica, narrativa, rejogabilidade e custo-benefício em reais para você investir seu tempo e dinheiro com segurança.
                        </p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2 shrink-0">
                        <button onclick="filterReviews('all')" class="review-filter-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#66c0f4] text-[#101822] transition">Todas</button>
                        <button onclick="filterReviews('masterpiece')" class="review-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e] transition">Obras-Primas (9.8+)</button>
                        <button onclick="filterReviews('RPG')" class="review-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e] transition">RPGs</button>
                        <button onclick="filterReviews('Ação')" class="review-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e] transition">Ação / FPS</button>
                        <button onclick="filterReviews('Indie')" class="review-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e] transition">Indies & Sandbox</button>
                    </div>
                </div>
            </div>

            <div id="reviews-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            </div>
        </div>
        <!-- FIM SECTION 5: CRÍTICAS & REVIEWS -->

    </main>

    <!-- MODAL DE DETALHES DO JOGO (/api/game/{game_id}) -->
    <div id="game-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
        <div class="bg-[#1b2838] border border-[#2a475e] rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fade-in relative max-h-[90vh] flex flex-col">
            <button 
                onclick="closeGameModal()" 
                class="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white rounded-full p-2 transition z-10"
                title="Fechar"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>

            <div class="relative h-48 sm:h-56 w-full bg-[#171a21] overflow-hidden shrink-0">
                <img id="modal-banner" src="" alt="Banner do Jogo" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                <div id="modal-accent-line" class="absolute top-0 left-0 right-0 h-1 bg-[#66c0f4]"></div>
                <div class="absolute bottom-4 left-6 right-6">
                    <h3 id="modal-title" class="text-2xl font-extrabold text-white">Carregando...</h3>
                    <p id="modal-dev" class="text-xs text-[#66c0f4]">Desenvolvedora: --</p>
                </div>
            </div>

            <div class="p-6 space-y-6 overflow-y-auto flex-1">
                <p id="modal-description" class="text-sm text-slate-300 leading-relaxed">
                    Carregando detalhes do jogo via API...
                </p>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#171a21] p-4 rounded-lg border border-[#2a475e]">
                    <div>
                        <span class="text-[11px] uppercase tracking-wider text-slate-400 block">Horas Jogadas</span>
                        <span id="modal-hours" class="text-lg font-bold text-white tabular-nums">0h</span>
                    </div>
                    <div>
                        <span class="text-[11px] uppercase tracking-wider text-slate-400 block">Avaliação</span>
                        <span id="modal-rating" class="text-lg font-bold text-emerald-400 tabular-nums">0%</span>
                    </div>
                    <div>
                        <span class="text-[11px] uppercase tracking-wider text-slate-400 block">Pico 24h</span>
                        <span id="modal-players" class="text-lg font-bold text-white tabular-nums">0</span>
                    </div>
                    <div>
                        <span class="text-[11px] uppercase tracking-wider text-slate-400 block">Preço</span>
                        <span id="modal-price" class="text-lg font-bold text-white tabular-nums">R$ 0,00</span>
                    </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-2 border-t border-[#2a475e]">
                    <div id="modal-genres">
                        <span>Gêneros: <strong class="text-slate-200">Ação, RPG</strong></span>
                    </div>
                    <div id="modal-achievements">
                        <span>Conquistas: <strong class="text-[#66c0f4] tabular-nums">0 / 0</strong></span>
                    </div>
                </div>

                <div class="bg-[#121c27] border border-[#2a475e] rounded-xl p-4 space-y-2.5">
                    <div class="flex items-center justify-between text-xs">
                        <span id="modal-stores-title" class="font-bold text-white flex items-center gap-1.5">
                            <span class="text-emerald-400">⚡</span>
                            <span>Melhores Ofertas de Ativação Steam / PC</span>
                        </span>
                        <span id="modal-stores-badge" class="text-[10px] text-slate-400 bg-[#171a21] px-2 py-0.5 rounded border border-[#2a475e]">Chaves Oficiais</span>
                    </div>
                    <div id="modal-stores-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    </div>
                </div>

                <div class="flex items-center justify-between gap-3 pt-2">
                    <button 
                        onclick="closeGameModal()" 
                        class="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#171a21] rounded-lg transition"
                    >
                        Fechar
                    </button>
                    <a 
                        id="modal-official-link" 
                        href="https://store.steampowered.com" 
                        target="_blank" 
                        rel="noreferrer"
                        class="px-4 py-2 text-xs font-semibold text-[#101822] bg-[#66c0f4] hover:bg-[#38bdf8] rounded-lg transition flex items-center gap-1.5"
                    >
                        <span id="modal-official-btn-text">Abrir na Loja Steam</span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL DE CRÍTICA EDITORIAL -->
    <div id="review-detail-modal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-[#1b2838] border border-[#2a475e] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl animate-fade-in relative my-8 max-h-[90vh] flex flex-col">
            <div class="relative h-56 sm:h-64 w-full bg-[#101822] shrink-0 overflow-hidden">
                <img id="review-modal-banner" src="" alt="Capa" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-[#1b2838]/60 to-transparent"></div>
                <button 
                    onclick="closeReviewModal()" 
                    class="absolute top-4 right-4 bg-black/70 hover:bg-black text-white rounded-full p-2.5 transition z-20 shadow-md"
                    title="Fechar"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <div class="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-2 mb-1.5">
                            <span id="review-modal-badge" class="px-2.5 py-0.5 rounded text-[11px] font-black text-black bg-amber-400">Obra-Prima</span>
                            <span id="review-modal-meta" class="text-xs text-slate-300">Redação GameLens · 4 min de leitura</span>
                        </div>
                        <h2 id="review-modal-title" class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Baldur's Gate 3</h2>
                    </div>
                    <div class="text-right shrink-0 bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl">
                        <span class="text-[10px] text-slate-400 uppercase font-bold block">Nota Editorial</span>
                        <span id="review-modal-score" class="text-2xl sm:text-3xl font-black text-amber-300">★ 9.9</span>
                    </div>
                </div>
            </div>

            <div class="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                <div class="bg-[#171a21] border-l-4 border-amber-400 p-4 rounded-r-xl">
                    <h3 id="review-modal-headline" class="text-base sm:text-lg font-bold text-white mb-1.5"></h3>
                    <p id="review-modal-lead" class="text-xs sm:text-sm text-slate-300 italic leading-relaxed"></p>
                </div>

                <div class="space-y-4 text-sm text-slate-300 leading-relaxed" id="review-modal-body">
                </div>

                <div class="bg-[#171a21] border border-[#2a475e] rounded-xl p-5 space-y-3">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Avaliação por Pilares (0 a 10)</h4>
                    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center" id="review-modal-scores-grid">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                        <h4 class="text-xs font-bold uppercase tracking-wide text-emerald-400 flex items-center gap-1.5">
                            <span>Pontos Fortes (Prós)</span>
                        </h4>
                        <ul id="review-modal-pros" class="space-y-1.5 text-xs text-slate-300"></ul>
                    </div>
                    <div class="bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 space-y-2">
                        <h4 class="text-xs font-bold uppercase tracking-wide text-rose-400 flex items-center gap-1.5">
                            <span>Ressalvas (Contras)</span>
                        </h4>
                        <ul id="review-modal-cons" class="space-y-1.5 text-xs text-slate-300"></ul>
                    </div>
                </div>

                <div class="bg-gradient-to-r from-[#171a21] to-[#121c27] border border-[#2a475e] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <span class="text-[10px] uppercase font-bold text-emerald-400 block">Melhor Oportunidade Atual</span>
                        <h4 class="text-sm font-bold text-white" id="review-modal-deal-title">Chave Oficial com Desconto</h4>
                        <p class="text-xs text-slate-400" id="review-modal-deal-sub">Ativação instantânea em reais e suporte a Pix</p>
                    </div>
                    <div id="review-modal-buttons-container" class="flex items-center gap-2.5 w-full sm:w-auto">
                        <a id="review-modal-nuuvem-btn" href="#" target="_blank" rel="noreferrer" class="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-extrabold text-center transition shadow-md">
                            Pegar na Nuuvem
                        </a>
                        <a id="review-modal-hype-btn" href="#" target="_blank" rel="noreferrer" class="flex-1 sm:flex-none px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-extrabold text-center transition shadow-md">
                            Hype Games
                        </a>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-[#171a21] border-t border-[#2a475e] flex items-center justify-between">
                <span class="text-xs text-slate-400">GameLens Editorial · Opinião 100% Autoral</span>
                <button onclick="closeReviewModal()" class="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#1b2838] hover:bg-[#233446] rounded-lg border border-[#2a475e] transition">
                    Fechar Crítica
                </button>
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <footer class="bg-[#171a21] border-t border-[#2a475e] py-8 mt-12 text-xs text-slate-400">
        <div class="max-w-7xl mx-auto px-4 space-y-4">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div class="flex items-center gap-2">
                    <span class="font-extrabold text-white text-sm">Game<span class="text-[#66c0f4]">Lens</span></span>
                    <span>·</span>
                    <span>Portal Gamer, Críticas & Análise de Biblioteca</span>
                </div>
                <div class="flex items-center gap-4 text-slate-400 flex-wrap justify-center">
                    <button onclick="openAffiliatesModal()" class="hover:text-amber-300 transition">⚙️ Configurar Afiliados</button>
                    <span>·</span>
                    <button onclick="openPixModal()" class="text-emerald-400 hover:underline transition">☕ Doar via Pix</button>
                    <span>·</span>
                    <a href="/api/stats" target="_blank" class="hover:text-[#66c0f4] transition">API Stats</a>
                    <span>·</span>
                    <a href="/docs" target="_blank" class="hover:text-[#66c0f4] transition">Swagger Docs</a>
                </div>
            </div>
            <div class="pt-4 border-t border-[#2a475e]/60 text-[11px] text-slate-400 leading-relaxed text-center sm:text-left">
                <strong>Aviso de Transparência & Afiliados:</strong> O GameLens participa dos programas oficiais de parceiros e associados (Nuuvem & Amazon). Ao adquirir jogos ou chaves de ativação Steam através de nossos links, recebemos uma comissão sem custo adicional para você, apoiando a infraestrutura independente do portal.
            </div>
        </div>
    </footer>

    <!-- SCRIPT DA APLICAÇÃO -->
    <script>
        // Mapeamento de Cores
        const GENRE_COLORS = {
            'Ação': '#ef4444',
            'RPG': '#a855f7',
            'Estratégia': '#f59e0b',
            'Indie': '#10b981',
            'Simulação': '#06b6d4',
            'Aventura': '#3b82f6',
            'Soulslike': '#f97316',
            'Competitivo': '#ec4899',
            'Outros': '#94a3b8'
        };

        const GAME_COLORS = {
            '730': '#f97316',
            '570': '#dc2626',
            '1086940': '#a855f7',
            '1245620': '#eab308',
            '105600': '#22c55e',
            '292030': '#f43f5e',
            '1091500': '#facc15',
            '289070': '#0284c7',
            '413150': '#10b981',
            '553850': '#fb923c',
            '1145360': '#e11d48',
            '367520': '#38bdf8'
        };

        function getGenreColor(genre) {
            return GENRE_COLORS[genre] || '#66c0f4';
        }

        function getGameColor(gameId, fallbackGenre) {
            return GAME_COLORS[gameId] || getGenreColor(fallbackGenre);
        }

        // Funções de Afiliados
        function getAffiliateConfig() {
            try {
                const saved = localStorage.getItem('gamelens_affiliate_cfg');
                if (saved) return JSON.parse(saved);
            } catch (e) {}
            return {
                rakutenSid: '4770537',
                hypeMid: '53304',
                nuuvemMid: '46796',
                nuuvemPartnerId: 'albertgamer',
                amazonTag: 'albertgames-20'
            };
        }

        function saveAffiliateConfig(cfg) {
            try {
                localStorage.setItem('gamelens_affiliate_cfg', JSON.stringify(cfg));
            } catch (e) {}
        }

        function getAffiliateNuuvemUrl(game) {
            const cfg = getAffiliateConfig();
            const partner = encodeURIComponent(cfg.nuuvemPartnerId || 'albertgamer');
            const cleanName = encodeURIComponent((game.name || '').trim());
            return \`https://www.nuuvem.com/br-pt/catalog/search?q=\${cleanName}&partner=\${partner}\`;
        }

        function getAffiliateHypeUrl(gameName) {
            const cleanName = encodeURIComponent((gameName || '').trim());
            return \`https://hype.games/br/search?q=\${cleanName}\`;
        }

        function getAffiliateAmazonUrl(game, platform = '') {
            const cfg = getAffiliateConfig();
            const tag = encodeURIComponent(cfg.amazonTag || 'albertgames-20');
            let term = (game.name || '').trim();
            if (platform && platform.toLowerCase() !== 'pc' && platform.toLowerCase() !== 'all') {
                term += \` \${platform}\`;
            }
            term += ' midia fisica console';
            return \`https://www.amazon.com.br/s?k=\${encodeURIComponent(term)}&tag=\${tag}\`;
        }

        // TROCA DE NAVEGAÇÃO DE TABS
        function switchMainTab(tabName) {
            const sections = ['dashboard', 'deals', 'search', 'platforms', 'reviews'];
            sections.forEach(s => {
                const el = document.getElementById(\`tab-section-\${s}\`);
                if (el) el.classList.add('hidden');
                const btn = document.getElementById(\`nav-btn-\${s}\`);
                if (btn) {
                    btn.className = 'nav-tab-btn px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-[#1b2838] transition flex items-center gap-2 whitespace-nowrap';
                }
            });

            const targetSection = document.getElementById(\`tab-section-\${tabName}\`);
            if (targetSection) targetSection.classList.remove('hidden');

            const activeBtn = document.getElementById(\`nav-btn-\${tabName}\`);
            if (activeBtn) {
                activeBtn.className = 'nav-tab-btn active px-4 py-2 rounded-lg text-xs font-bold text-[#101822] bg-[#66c0f4] transition flex items-center gap-2 shadow-sm whitespace-nowrap';
            }

            if (tabName === 'deals') {
                if (allDeals && allDeals.length > 0) {
                    renderDealsGrid(allDeals);
                }
                fetchDeals(currentDealsPlatform);
            } else if (tabName === 'reviews') {
                renderReviewsGrid();
            }
        }

        // Estado global
        let currentStats = null;
        let allGames = [];
        let filteredGames = [];
        let allDeals = [];
        let currentDealsPlatform = 'all';
        let currentReviewFilter = 'all';
        let currentSort = 'hours';
        let sortAsc = false;
        let selectedGenre = 'Todos';
        let currentBarColorMode = 'game';
        let barChartInstance = null;
        let doughnutChartInstance = null;
        let lineChartInstance = null;

        const FALLBACK_DATA = {
            "total_games": 12,
            "total_hours": 2843.8,
            "avg_rating": 91.8,
            "most_played_game": {
                "id": "730",
                "name": "Counter-Strike 2",
                "hours_played": 845.2,
                "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
                "rating_label": "Muito Positivas"
            },
            "genre_distribution": {
                "Ação": 1414.1,
                "RPG": 954.7,
                "Estratégia": 609.1,
                "Indie": 243.9
            },
            "top_games": [
                { "id": "730", "name": "Counter-Strike 2", "hours_played": 845.2, "genres": ["Ação", "Tiro"], "user_rating": 88, "peak_24h_players": 1420850, "current_price_brl": 0.0, "price_formatted": "Gratuito", "developer": "Valve" },
                { "id": "570", "name": "Dota 2", "hours_played": 430.7, "genres": ["Estratégia", "MOBA"], "user_rating": 82, "peak_24h_players": 710500, "current_price_brl": 0.0, "price_formatted": "Gratuito", "developer": "Valve" },
                { "id": "1086940", "name": "Baldur's Gate 3", "hours_played": 312.4, "genres": ["RPG", "Estratégia"], "user_rating": 96, "peak_24h_players": 98120, "current_price_brl": 199.99, "price_formatted": "R$ 199,99", "developer": "Larian Studios" },
                { "id": "1245620", "name": "Elden Ring", "hours_played": 264.8, "genres": ["RPG", "Soulslike"], "user_rating": 93, "peak_24h_players": 85400, "current_price_brl": 229.90, "price_formatted": "R$ 229,90", "developer": "FromSoftware" },
                { "id": "105600", "name": "Terraria", "hours_played": 210.5, "genres": ["Ação", "Sandbox"], "user_rating": 98, "peak_24h_players": 41200, "current_price_brl": 32.99, "price_formatted": "R$ 32,99", "developer": "Re-Logic" },
                { "id": "292030", "name": "The Witcher 3: Wild Hunt", "hours_played": 195.0, "genres": ["RPG", "Aventura"], "user_rating": 97, "peak_24h_players": 27300, "current_price_brl": 129.99, "price_formatted": "R$ 129,99", "developer": "CD PROJEKT RED" },
                { "id": "1091500", "name": "Cyberpunk 2077", "hours_played": 182.5, "genres": ["RPG", "Ação"], "user_rating": 89, "peak_24h_players": 48200, "current_price_brl": 199.90, "price_formatted": "R$ 199,90", "developer": "CD PROJEKT RED" },
                { "id": "289070", "name": "Sid Meier's Civilization VI", "hours_played": 178.4, "genres": ["Estratégia", "Turnos"], "user_rating": 86, "peak_24h_players": 32600, "current_price_brl": 129.00, "price_formatted": "R$ 129,00", "developer": "Firaxis Games" },
                { "id": "413150", "name": "Stardew Valley", "hours_played": 145.6, "genres": ["Indie", "Simulação"], "user_rating": 98, "peak_24h_players": 52100, "current_price_brl": 24.99, "price_formatted": "R$ 24,99", "developer": "ConcernedApe" },
                { "id": "553850", "name": "HELLDIVERS 2", "hours_played": 142.1, "genres": ["Ação", "Tiro"], "user_rating": 83, "peak_24h_players": 74800, "current_price_brl": 199.50, "price_formatted": "R$ 199,50", "developer": "Arrowhead" },
                { "id": "1145360", "name": "Hades", "hours_played": 118.0, "genres": ["Ação", "Roguelike"], "user_rating": 98, "peak_24h_players": 16400, "current_price_brl": 73.99, "price_formatted": "R$ 73,99", "developer": "Supergiant Games" },
                { "id": "367520", "name": "Hollow Knight", "hours_played": 98.3, "genres": ["Indie", "Metroidvania"], "user_rating": 97, "peak_24h_players": 14900, "current_price_brl": 46.99, "price_formatted": "R$ 46,99", "developer": "Team Cherry" }
            ]
        };

        const REVIEWS_DATABASE = {
            '1086940': {
                id: '1086940',
                name: "Baldur's Gate 3",
                badge: 'Obra-Prima',
                badgeColor: '#a855f7',
                score: 9.9,
                genre: 'RPG',
                scores: { gameplay: 10, graphics: 9.8, narrative: 10, replayability: 10, valueForMoney: 9.8 },
                headline: "A obra máxima dos cRPGs modernos e o maior divisor de águas da década",
                verdictLead: "Uma aula magistral de design, narrativa reativa e respeito inegociável à inteligência do jogador.",
                fullAnalysis: "Baldur's Gate 3 redefiniu o que esperamos de um RPG em turnos. A liberdade concedida para resolver cada quest, assassinar antagonistas antes do combate iniciar, usar feitiços de manipulação ambiental ou persuadir chefes a cometerem suicídio cria uma ilusão quase perfeita de livre arbítrio.",
                pros: ["Liberdade narrativa e reatividade do mundo sem precedentes", "Personagens complexos com atuações de dublagem dignas de Oscar", "Sistema de combate tático em turnos incrivelmente satisfatório", "Suporte completo a modo cooperativo local e online"],
                cons: ["Avançar pelo Ato 3 exige processamento intensivo em CPUs mais antigas"],
                bottomLine: "Um marco na história dos videogames. Compra indispensável para qualquer fã de RPG.",
                author: "Redação GameLens",
                readTime: "4 min de leitura",
                banner: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
                bestDeal: { store: "Nuuvem", price: "R$ 159,99 (-20%)" }
            },
            '1245620': {
                id: '1245620',
                name: "Elden Ring",
                badge: 'Obra-Prima',
                badgeColor: '#eab308',
                score: 9.8,
                genre: 'RPG',
                scores: { gameplay: 10, graphics: 9.7, narrative: 9.5, replayability: 9.9, valueForMoney: 10 },
                headline: "O ápice da exploração e do combate recompensador nas Terras Intermédias",
                verdictLead: "As Terras Intermédias recompensam a curiosidade como nenhum outro mapa aberto já fez antes.",
                fullAnalysis: "A FromSoftware pegou a fórmula brutal de Dark Souls e a expandiu para um mundo aberto colossal. Descobrir cavernas escondidas, castelos legados com arquitetura vertiginosa e vencer um semideus após dezenas de tentativas continua sendo um dos momentos mais eufóricos que um videogame pode proporcionar.",
                pros: ["Direção de arte monumental que compensa qualquer limitação técnica", "Liberdade de rota que elimina a frustração de ficar travado em um chefe", "Centenas de armas, magias e builds radicalmente diferentes"],
                cons: ["Narrativa fragmentada que exige atenção a descrições de itens"],
                bottomLine: "Um dos jogos mais aclamados de todos os tempos.",
                author: "Redação GameLens",
                readTime: "4 min de leitura",
                banner: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
                bestDeal: { store: "Nuuvem", price: "R$ 151,70 (-34%)" }
            },
            '730': {
                id: '730',
                name: "Counter-Strike 2",
                badge: 'Essencial',
                badgeColor: '#f97316',
                score: 9.3,
                genre: 'Ação',
                scores: { gameplay: 9.8, graphics: 9.2, narrative: 7.0, replayability: 10, valueForMoney: 10 },
                headline: "O soberano dos FPS táticos entra em sua era gráfica mais refinada na Source 2",
                verdictLead: "Com fumaças volumétricas interativas e gunplay incomparável, CS2 continua sendo o teste de precisão definitivo.",
                fullAnalysis: "A transição de CS:GO para Counter-Strike 2 trouxe o motor Source 2 com iluminação impecável, materiais reativos e a mecânica revolucionária de fumaças responsivas a disparos e granadas HE.",
                pros: ["Gunplay e resposta de tiro mais precisos da história dos videogames", "Novas fumaças volumétricas que mudam totalmente o metagame", "Gratuito para começar e mercado econômico de skins vibrante"],
                cons: ["Curva de aprendizado impiedosa contra jogadores veteranos"],
                bottomLine: "Indispensável na biblioteca de qualquer fã de FPS.",
                author: "Redação GameLens",
                readTime: "3 min de leitura",
                banner: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
                bestDeal: { store: "Hype Games", price: "Gratuito (Prime R$ 74,99)" }
            },
            '1091500': {
                id: '1091500',
                name: "Cyberpunk 2077",
                badge: 'Obra-Prima',
                badgeColor: '#facc15',
                score: 9.5,
                genre: 'RPG',
                scores: { gameplay: 9.4, graphics: 10, narrative: 9.7, replayability: 9.3, valueForMoney: 9.5 },
                headline: "A redenção definitiva: Night City atinge o ápice de imersão e narrativa",
                verdictLead: "Após a atualização 2.0 e a expansão Phantom Liberty, Cyberpunk se tornou uma das maiores experiências audiovisuais já criadas.",
                fullAnalysis: "Night City é uma cidade que respira verticalidade, decadência e luz neon. A revisão do sistema policial, das árvores de habilidades e do combate veicular finalmente entregou a visão que os desenvolvedores prometeram.",
                pros: ["Gráficos e Ray Tracing que definem o padrão visual da atual geração", "Trilha sonora frenética e design de som de primeira grandeza", "Personagens memoráveis com dublagem primorosa em português"],
                cons: ["Exige hardware de ponta para aproveitar o Path Tracing máximo"],
                bottomLine: "Um espetáculo visual e emocional indispensável.",
                author: "Redação GameLens",
                readTime: "4 min de leitura",
                banner: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
                bestDeal: { store: "Nuuvem", price: "R$ 99,95 (-50%)" }
            }
        };

        // SISTEMA DE TEMA CLARO / ESCURO GLOBAL
        let currentGlobalTheme = localStorage.getItem('gamelens_theme') || 'dark';

        function applyTheme(theme) {
            currentGlobalTheme = theme;
            try {
                localStorage.setItem('gamelens_theme', theme);
            } catch (e) {}

            const htmlEl = document.documentElement;
            const sunIcon = document.getElementById('theme-icon-sun');
            const moonIcon = document.getElementById('theme-icon-moon');

            if (theme === 'light') {
                htmlEl.classList.remove('dark');
                htmlEl.classList.add('light');
                if (sunIcon) sunIcon.classList.remove('hidden');
                if (moonIcon) moonIcon.classList.add('hidden');
            } else {
                htmlEl.classList.remove('light');
                htmlEl.classList.add('dark');
                if (sunIcon) sunIcon.classList.add('hidden');
                if (moonIcon) moonIcon.classList.remove('hidden');
            }

            if (currentStats) renderCharts(currentStats);
        }

        function toggleGlobalTheme() {
            applyTheme(currentGlobalTheme === 'dark' ? 'light' : 'dark');
        }

        // RECONHECIMENTO DE VOZ (WEB SPEECH API)
        let isVoiceListening = false;
        let activeRecognition = null;

        function startVoiceSearch(targetInputId, buttonId, autoSubmit = false) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("O reconhecimento de voz não é suportado pelo seu navegador atual. Recomendamos utilizar o Google Chrome ou Edge.");
                return;
            }

            const input = document.getElementById(targetInputId);
            const btn = document.getElementById(buttonId);

            if (isVoiceListening && activeRecognition) {
                activeRecognition.stop();
                isVoiceListening = false;
                if (btn) btn.classList.remove('animate-pulse', 'text-red-500', 'bg-red-500/20');
                return;
            }

            try {
                const recognition = new SpeechRecognition();
                activeRecognition = recognition;
                recognition.lang = 'pt-BR';
                recognition.continuous = false;
                recognition.interimResults = false;

                recognition.onstart = () => {
                    isVoiceListening = true;
                    if (btn) btn.classList.add('animate-pulse', 'text-red-500', 'bg-red-500/20');
                    if (input) input.placeholder = "Ouvindo... Fale o nome do jogo agora...";
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    if (input) {
                        input.value = transcript;
                        if (targetInputId === 'global-search') {
                            handleSearch(transcript);
                        } else if (autoSubmit) {
                            executeUniversalSearch();
                        }
                    }
                };

                recognition.onerror = (event) => {
                    console.warn("Reconhecimento de voz:", event.error);
                };

                recognition.onend = () => {
                    isVoiceListening = false;
                    activeRecognition = null;
                    if (btn) btn.classList.remove('animate-pulse', 'text-red-500', 'bg-red-500/20');
                    if (input) input.placeholder = targetInputId === 'global-search' 
                        ? "Buscar por jogo ou desenvolvedor..." 
                        : "Digite o nome do jogo (ex: GTA, God of War, Forza, Resident Evil, FIFA)...";
                };

                recognition.start();
            } catch (err) {
                console.error("Falha ao iniciar reconhecimento de voz:", err);
            }
        }

        // FILTRO DE PERÍODO DO DASHBOARD
        let currentPeriodFilter = '6m';

        function changeHtmlPeriod(period) {
            currentPeriodFilter = period;

            document.querySelectorAll('.period-btn').forEach(btn => {
                if (btn.id === \`period-btn-\${period}\`) {
                    btn.className = 'period-btn px-2.5 py-1 text-xs rounded transition font-bold bg-[#66c0f4] text-[#101822] shadow-sm';
                } else {
                    btn.className = 'period-btn px-2.5 py-1 text-xs rounded transition font-bold text-slate-300 hover:text-white';
                }
            });

            if (currentStats) {
                renderCharts(currentStats);
                updateCardsForPeriod(period);
            }
        }

        function updateCardsForPeriod(period) {
            if (!currentStats) return;
            const totalBase = currentStats.total_hours;
            let periodHours = totalBase;
            let activeGames = currentStats.total_games;
            let mostPlayedRatio = 0.32;

            if (period === '1m') {
                periodHours = Math.round(totalBase * 0.16 * 10) / 10;
                activeGames = Math.max(3, Math.round(currentStats.total_games * 0.4));
                mostPlayedRatio = 0.45;
            } else if (period === '3m') {
                periodHours = Math.round(totalBase * 0.42 * 10) / 10;
                activeGames = Math.max(5, Math.round(currentStats.total_games * 0.65));
                mostPlayedRatio = 0.38;
            } else if (period === '6m') {
                periodHours = totalBase;
                activeGames = Math.max(8, Math.round(currentStats.total_games * 0.85));
                mostPlayedRatio = 0.32;
            } else if (period === '1y') {
                periodHours = Math.round(totalBase * 1.35 * 10) / 10;
                activeGames = currentStats.total_games;
                mostPlayedRatio = 0.30;
            } else {
                periodHours = Math.round(totalBase * 1.8 * 10) / 10;
                activeGames = currentStats.total_games;
                mostPlayedRatio = 0.30;
            }

            const totalHoursEl = document.getElementById('card-total-hours');
            if (totalHoursEl) {
                totalHoursEl.innerHTML = \`\${periodHours.toLocaleString('pt-BR')} <span class="text-lg font-normal text-slate-400">horas</span>\`;
            }

            const totalGamesEl = document.getElementById('card-total-games');
            if (totalGamesEl) totalGamesEl.textContent = activeGames;

            const mostPlayedHoursEl = document.getElementById('card-most-played-hours');
            if (mostPlayedHoursEl) {
                const mostPlayedGameHours = Math.round(periodHours * mostPlayedRatio * 10) / 10;
                mostPlayedHoursEl.textContent = \`\${mostPlayedGameHours}h jogadas (\${period.toUpperCase()})\`;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            applyTheme(localStorage.getItem('gamelens_theme') || 'dark');
            fetchDashboardData();
            // Pré-carrega ofertas e críticas para navegação instantânea sem tela preta
            fetchDeals('all');
            renderReviewsGrid();
        });

        function setHtmlColorMode(mode) {
            currentBarColorMode = mode;
            const btnGame = document.getElementById('btn-colormode-game');
            const btnGenre = document.getElementById('btn-colormode-genre');
            if (mode === 'game') {
                btnGame.className = 'px-2.5 py-1 text-[11px] rounded bg-[#66c0f4] text-[#101822] font-semibold transition';
                btnGenre.className = 'px-2.5 py-1 text-[11px] rounded text-slate-400 hover:text-white transition';
            } else {
                btnGenre.className = 'px-2.5 py-1 text-[11px] rounded bg-[#66c0f4] text-[#101822] font-semibold transition';
                btnGame.className = 'px-2.5 py-1 text-[11px] rounded text-slate-400 hover:text-white transition';
            }
            if (currentStats) renderCharts(currentStats);
        }

        async function fetchDashboardData() {
            try {
                const response = await fetch('/api/stats');
                if (!response.ok) throw new Error('API indisponível');
                const data = await response.json();
                applyData(data);
            } catch (err) {
                console.warn('Utilizando fallback mockado local:', err.message);
                applyData(FALLBACK_DATA);
            }
        }

        function applyData(data) {
            currentStats = data;
            allGames = data.top_games || [];
            filteredGames = [...allGames];

            updateCardsForPeriod(currentPeriodFilter);

            if (data.most_played_game) {
                const mostPlayed = data.most_played_game;
                const gameColor = getGameColor(mostPlayed.id, 'Ação');
                document.getElementById('card-most-played-name').innerHTML = \`
                    <span class="w-3 h-3 rounded-full shrink-0" style="background-color: \${gameColor}"></span>
                    <span>\${mostPlayed.name}</span>
                \`;
                document.getElementById('card-most-played-hours').style.color = gameColor;
            }
            document.getElementById('card-avg-rating').textContent = \`\${data.avg_rating}%\`;

            renderCharts(data);
            renderTable();
        }

        function renderCharts(data) {
            const lineCtx = document.getElementById('trendLineChart');
            if (lineCtx) {
                // Cálculo dinâmico para 1m, 3m, 6m, 1y e all
                let months = [];
                let monthlyHours = [];
                const totalBase = data.total_hours;

                if (currentPeriodFilter === '1m') {
                    months = ['Outubro/26'];
                    monthlyHours = [Math.round(totalBase * 0.16 * 10) / 10];
                } else if (currentPeriodFilter === '3m') {
                    months = ['Agosto/26', 'Setembro/26', 'Outubro/26'];
                    const weights3 = [0.28, 0.32, 0.40];
                    const periodTotal = Math.round(totalBase * 0.42 * 10) / 10;
                    monthlyHours = weights3.map(w => Math.round(periodTotal * w * 10) / 10);
                } else if (currentPeriodFilter === '6m') {
                    months = ['Maio/26', 'Junho/26', 'Julho/26', 'Agosto/26', 'Setembro/26', 'Outubro/26'];
                    const weights6 = [0.105, 0.125, 0.205, 0.155, 0.175, 0.235];
                    monthlyHours = weights6.map(w => Math.round(totalBase * w * 10) / 10);
                } else if (currentPeriodFilter === '1y') {
                    // 12 meses
                    months = ['Nov/25', 'Dez/25', 'Jan/26', 'Fev/26', 'Mar/26', 'Abr/26', 'Mai/26', 'Jun/26', 'Jul/26', 'Ago/26', 'Set/26', 'Out/26'];
                    const weights12 = [0.055, 0.065, 0.058, 0.062, 0.075, 0.082, 0.095, 0.105, 0.135, 0.115, 0.125, 0.150];
                    monthlyHours = weights12.map(w => Math.round(totalBase * 1.35 * w * 10) / 10);
                } else {
                    // 24 meses / Total
                    months = [
                        'Nov/24', 'Dez/24', 'Jan/25', 'Fev/25', 'Mar/25', 'Abr/25', 'Mai/25', 'Jun/25', 'Jul/25', 'Ago/25', 'Set/25', 'Out/25',
                        'Nov/25', 'Dez/25', 'Jan/26', 'Fev/26', 'Mar/26', 'Abr/26', 'Mai/26', 'Jun/26', 'Jul/26', 'Ago/26', 'Set/26', 'Out/26'
                    ];
                    const weights24 = [
                        0.025, 0.030, 0.028, 0.032, 0.035, 0.038, 0.040, 0.045, 0.050, 0.042, 0.048, 0.052,
                        0.055, 0.065, 0.058, 0.062, 0.075, 0.082, 0.105, 0.125, 0.205, 0.155, 0.175, 0.235
                    ];
                    monthlyHours = weights24.map(w => Math.round(totalBase * 1.8 * w * 10) / 10);
                }

                const totalPeriodSum = Math.round(monthlyHours.reduce((a, b) => a + b, 0) * 10) / 10;
                const avgHours = Math.round((totalPeriodSum / monthlyHours.length) * 10) / 10;
                const peakVal = Math.max(...monthlyHours);
                const peakIdx = monthlyHours.indexOf(peakVal);
                const peakMonthName = months[peakIdx] || 'Out/26';

                // Atualizar badges
                const avgEl = document.getElementById('line-avg-hours');
                if (avgEl) avgEl.textContent = \`\${avgHours}h\`;
                const peakEl = document.getElementById('line-peak-month');
                if (peakEl) peakEl.textContent = \`\${peakMonthName} (\${peakVal}h)\`;
                const totalEl = document.getElementById('line-total-hours');
                if (totalEl) totalEl.textContent = \`\${totalPeriodSum.toLocaleString('pt-BR')}h\`;

                if (lineChartInstance) lineChartInstance.destroy();

                const isLightMode = currentGlobalTheme === 'light';
                const gridColor = isLightMode ? 'rgba(203, 213, 225, 0.6)' : 'rgba(42, 71, 94, 0.25)';
                const tickColor = isLightMode ? '#475569' : '#cbd5e1';

                lineChartInstance = new Chart(lineCtx.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [
                            {
                                label: 'Horas no Mês',
                                data: monthlyHours,
                                borderColor: '#66c0f4',
                                backgroundColor: 'rgba(102, 192, 244, 0.18)',
                                fill: true,
                                tension: 0.38,
                                borderWidth: 2.5,
                                pointBackgroundColor: '#66c0f4',
                                pointBorderColor: isLightMode ? '#ffffff' : '#0e141b',
                                pointRadius: months.length > 12 ? 3 : 5
                            },
                            {
                                label: 'Média do Período',
                                data: Array(months.length).fill(avgHours),
                                borderColor: '#a855f7',
                                borderDash: [5, 5],
                                borderWidth: 1.5,
                                pointRadius: 0,
                                fill: false
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: { grid: { color: gridColor }, ticks: { color: tickColor } },
                            y: { grid: { color: gridColor }, ticks: { color: tickColor, callback: (val) => \`\${val}h\` } }
                        }
                    }
                });
            }

            const topSix = (data.top_games || []).slice(0, 6);
            const barCtx = document.getElementById('barChart').getContext('2d');
            const barColors = topSix.map(g => {
                const primaryGenre = g.genres && g.genres.length > 0 ? g.genres[0] : 'Ação';
                return currentBarColorMode === 'genre' ? getGenreColor(primaryGenre) : getGameColor(g.id, primaryGenre);
            });

            if (barChartInstance) barChartInstance.destroy();

            barChartInstance = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: topSix.map(g => g.name),
                    datasets: [{
                        label: 'Horas Registradas',
                        data: topSix.map(g => g.hours_played),
                        backgroundColor: barColors,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    onClick: (event, elements) => {
                        if (elements.length > 0) {
                            const idx = elements[0].index;
                            if (topSix[idx]) openGameModal(topSix[idx].id);
                        }
                    },
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#e2e8f0' } },
                        y: { grid: { color: 'rgba(42, 71, 94, 0.4)' }, ticks: { color: '#94a3b8', callback: (val) => \`\${val}h\` } }
                    }
                }
            });

            const genres = Object.keys(data.genre_distribution || {});
            const genreValues = Object.values(data.genre_distribution || {});
            const doughnutColors = genres.map(g => getGenreColor(g));
            const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');

            if (doughnutChartInstance) doughnutChartInstance.destroy();

            doughnutChartInstance = new Chart(doughnutCtx, {
                type: 'doughnut',
                data: {
                    labels: genres,
                    datasets: [{
                        data: genreValues,
                        backgroundColor: doughnutColors,
                        borderColor: '#1b2838',
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '68%',
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#e2e8f0', boxWidth: 12 } }
                    }
                }
            });
        }

        function renderTable() {
            const tbody = document.getElementById('games-table-body');
            tbody.innerHTML = '';

            if (filteredGames.length === 0) {
                tbody.innerHTML = \`<tr><td colspan="7" class="px-6 py-8 text-center text-slate-400">Nenhum jogo encontrado.</td></tr>\`;
                document.getElementById('table-summary-text').textContent = 'Nenhum resultado';
                return;
            }

            filteredGames.forEach(game => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-[#233446]/50 transition cursor-pointer border-b border-[#2a475e]/40';
                tr.onclick = () => openGameModal(game.id);

                const primaryGenre = game.genres && game.genres.length > 0 ? game.genres[0] : 'Geral';
                const genreColor = getGenreColor(primaryGenre);
                const gameColor = getGameColor(game.id, primaryGenre);
                const hasDiscount = game.discount_percent && game.discount_percent > 0;
                const regPrice = game.regular_price_brl || game.regular_price;
                let priceCellHtml = '';
                if (hasDiscount && regPrice) {
                    priceCellHtml = \`
                        <div class="flex items-center justify-end gap-1.5">
                            <span class="text-[11px] text-slate-400 line-through">R$ \${regPrice.toFixed(2).replace('.', ',')}</span>
                            <span class="text-emerald-400 font-bold">\${game.price_formatted || ('R$ ' + game.current_price_brl.toFixed(2).replace('.', ','))}</span>
                            <span class="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded">-\${game.discount_percent}%</span>
                        </div>
                    \`;
                } else {
                    priceCellHtml = \`<span class="font-medium text-white">\${game.price_formatted || (game.current_price_brl > 0 ? \`R$ \${game.current_price_brl.toFixed(2).replace('.', ',')}\` : 'Gratuito')}</span>\`;
                }

                tr.innerHTML = \`
                    <td class="px-6 py-4 flex items-center gap-3">
                        <div class="w-1.5 h-10 rounded-full shrink-0 shadow-sm" style="background-color: \${gameColor}"></div>
                        <img src="https://cdn.akamai.steamstatic.com/steam/apps/\${game.id}/header.jpg" 
                             alt="\${game.name}" 
                             class="w-14 h-8 object-cover rounded bg-[#101822] shrink-0" 
                             onerror="this.src='https://placehold.co/120x60/171a21/66c0f4?text=Steam'">
                        <div>
                            <span class="font-bold text-white block">\${game.name}</span>
                            <span class="text-xs text-slate-400">\${game.developer || 'Valve'}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-1.5">
                            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: \${genreColor}"></span>
                            <span class="text-slate-200 text-xs font-medium">\${primaryGenre}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-right tabular-nums font-semibold text-white">\${game.hours_played.toLocaleString('pt-BR')}h</td>
                    <td class="px-6 py-4 text-right tabular-nums"><span class="text-emerald-400 font-bold">\${game.user_rating}%</span></td>
                    <td class="px-6 py-4 text-right tabular-nums text-slate-300">\${(game.peak_24h_players || 0).toLocaleString('pt-BR')}</td>
                    <td class="px-6 py-4 text-right tabular-nums">\${priceCellHtml}</td>
                    <td class="px-6 py-4 text-center">
                        <div class="flex items-center justify-center gap-1.5">
                            <button onclick="event.stopPropagation(); openGameModal('\${game.id}')" class="bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#101822] text-xs font-semibold px-2.5 py-1.5 rounded transition">Detalhes</button>
                            <a href="\${getAffiliateNuuvemUrl(game)}" target="_blank" rel="noreferrer" onclick="event.stopPropagation()" class="bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-semibold px-2 py-1.5 rounded transition">🛒 Nuuvem</a>
                        </div>
                    </td>
                \`;

                tbody.appendChild(tr);
            });

            document.getElementById('table-summary-text').textContent = \`Exibindo \${filteredGames.length} de \${allGames.length} jogos\`;
        }

        function handleSearch(query) {
            const term = query.toLowerCase().trim();
            applyFilters(term, selectedGenre);
        }

        function filterByGenre(genre) {
            if (selectedGenre === genre && genre !== 'Todos') {
                selectedGenre = 'Todos';
            } else {
                selectedGenre = genre;
            }

            document.querySelectorAll('.genre-btn').forEach(btn => {
                const btnText = btn.textContent.trim();
                const isSelected = selectedGenre === 'Todos' ? btnText === 'Todos' : btnText.includes(selectedGenre);
                btn.className = isSelected
                    ? 'genre-btn px-3 py-1.5 text-xs font-semibold rounded-md bg-[#66c0f4] text-[#101822] transition whitespace-nowrap flex items-center gap-1.5 shadow-sm'
                    : 'genre-btn px-3 py-1.5 text-xs font-medium rounded-md bg-[#1b2838] hover:bg-[#233446] text-slate-300 transition whitespace-nowrap flex items-center gap-1.5 border border-[#2a475e]';
            });

            applyFilters(document.getElementById('global-search').value.toLowerCase().trim(), selectedGenre);
        }

        function applyFilters(term, genre) {
            filteredGames = allGames.filter(game => {
                const matchesSearch = !term || game.name.toLowerCase().includes(term) || (game.developer && game.developer.toLowerCase().includes(term));
                const matchesGenre = genre === 'Todos' || (game.genres && game.genres.includes(genre));
                return matchesSearch && matchesGenre;
            });
            sortGames();
            renderTable();
        }

        function handleSortChange(sortField) {
            currentSort = sortField;
            sortGames();
            renderTable();
        }

        function toggleSort(field) {
            if (currentSort === field) sortAsc = !sortAsc;
            else { currentSort = field; sortAsc = false; }
            sortGames();
            renderTable();
        }

        function sortGames() {
            filteredGames.sort((a, b) => {
                let valA = a.hours_played, valB = b.hours_played;
                if (currentSort === 'rating') { valA = a.user_rating; valB = b.user_rating; }
                else if (currentSort === 'players') { valA = a.peak_24h_players || 0; valB = b.peak_24h_players || 0; }
                else if (currentSort === 'price') { valA = a.current_price_brl || 0; valB = b.current_price_brl || 0; }
                else if (currentSort === 'name') { return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name); }
                return sortAsc ? valA - valB : valB - valA;
            });
        }

        // DEALS & RADAR
        async function fetchDeals(platform = 'all') {
            currentDealsPlatform = platform;
            try {
                const url = platform === 'all' ? '/api/deals' : \`/api/deals?platform=\${encodeURIComponent(platform)}\`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    allDeals = data.deals || [];
                    renderDealsGrid(allDeals);
                }
            } catch (e) {
                console.error("Erro ao carregar ofertas:", e);
            }
        }

        function filterDealsPlatform(platform) {
            currentDealsPlatform = platform;
            document.querySelectorAll('.deal-pill-btn').forEach(btn => {
                const text = btn.textContent.toLowerCase();
                const isMatch = (platform === 'all' && text.includes('todas')) || text.includes(platform.toLowerCase());
                btn.className = isMatch
                    ? 'deal-pill-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#66c0f4] text-[#101822] transition'
                    : 'deal-pill-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e] transition';
            });
            fetchDeals(platform);
        }

        function renderDealsGrid(deals) {
            const grid = document.getElementById('deals-grid');
            if (!grid) return;

            if (!deals || deals.length === 0) {
                grid.innerHTML = \`<div class="col-span-full py-12 text-center text-slate-400 bg-[#171a21] border border-[#2a475e] rounded-xl p-8"><p class="text-sm font-semibold text-white">Nenhuma oferta encontrada para esta categoria.</p></div>\`;
                return;
            }

            grid.innerHTML = deals.map(d => {
                const disc = d.discount_percent || 0;
                const discBadge = disc > 0 ? \`<span class="px-2 py-0.5 rounded text-[11px] font-black bg-red-600 text-white shadow-md">-\${disc}%</span>\` : '';
                const oldPrice = d.regular_price ? \`R$ \${d.regular_price.toFixed(2).replace('.', ',')}\` : '';
                const dealPrice = d.deal_price ? \`R$ \${d.deal_price.toFixed(2).replace('.', ',')}\` : 'Sob Consulta';

                let buyUrl = d.deal_url;
                if (d.store === 'Hype Games') buyUrl = getAffiliateHypeUrl(d.name);
                else if (d.store === 'Nuuvem') buyUrl = getAffiliateNuuvemUrl({ id: d.id, name: d.name });
                else if (d.store === 'Amazon') buyUrl = getAffiliateAmazonUrl({ name: d.name });

                return \`
                    <div class="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col justify-between transition group shadow-lg">
                        <div class="relative h-44 w-full bg-[#101822] overflow-hidden">
                            <img src="\${d.image}" alt="\${d.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.src='https://placehold.co/600x300/171a21/66c0f4?text=GameLens'">
                            <div class="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                            <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">\${discBadge}<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-slate-200 border border-white/10">\${d.platform_label || d.platform}</span></div>
                            <div class="absolute top-2.5 right-2.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#171a21]/90 text-amber-300 border border-amber-500/30">★ \${d.rating}%</span></div>
                            <div class="absolute bottom-2 left-3 right-3">
                                <span class="text-[10px] text-emerald-400 font-bold block">\${d.badge || 'Oferta Oficial'}</span>
                                <h3 class="text-sm font-extrabold text-white truncate">\${d.name}</h3>
                            </div>
                        </div>

                        <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">\${d.review_verdict || 'Excelente oportunidade para adquirir e jogar com ativação imediata.'}</p>
                            <div class="pt-2 border-t border-[#2a475e]/60 flex items-center justify-between">
                                <div><span class="text-[10px] text-slate-400 line-through block">\${oldPrice}</span><span class="text-lg font-black text-emerald-400">\${dealPrice}</span></div>
                                <div class="text-right"><span class="text-[10px] text-slate-400 block">Loja Parceira</span><span class="text-xs font-bold text-slate-200">\${d.store}</span></div>
                            </div>
                            <div class="grid grid-cols-2 gap-2 pt-1">
                                <button onclick="openEditorialCritique('\${d.id}')" class="py-2 px-2.5 bg-[#171a21] hover:bg-[#233446] text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition border border-[#2a475e]">📝 Detalhes</button>
                                <a href="\${buyUrl}" target="_blank" rel="noreferrer" class="py-2 px-2.5 bg-[#66c0f4] hover:bg-[#38bdf8] text-[#101822] text-xs font-extrabold rounded-lg transition text-center">🛒 Pegar</a>
                            </div>
                        </div>
                    </div>
                \`;
            }).join('');
        }

        // BUSCA UNIVERSAL
        async function executeUniversalSearch() {
            const input = document.getElementById('universal-search-input');
            const query = (input ? input.value : '').trim();
            if (!query || query.length < 2) return;

            const status = document.getElementById('search-status-label');
            const grid = document.getElementById('search-results-grid');

            if (status) status.textContent = \`Consultando base global para "\${query}"...\`;
            if (grid) grid.innerHTML = \`<div class="col-span-full py-12 text-center text-slate-400"><div class="w-8 h-8 border-2 border-[#66c0f4] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div><span class="text-xs">Buscando na API oficial...</span></div>\`;

            try {
                const res = await fetch(\`/api/search_store?q=\${encodeURIComponent(query)}\`);
                if (res.ok) {
                    const data = await res.json();
                    renderUniversalSearchResults(data);
                }
            } catch (err) {
                console.error("Erro na busca:", err);
            }
        }

        function triggerQuickSearch(title) {
            const input = document.getElementById('universal-search-input');
            if (input) input.value = title;
            executeUniversalSearch();
        }

        function renderUniversalSearchResults(data) {
            const status = document.getElementById('search-status-label');
            const count = document.getElementById('search-count-label');
            const grid = document.getElementById('search-results-grid');

            const allResults = [];
            (data.local_games || []).forEach(g => {
                allResults.push({ id: g.id, name: g.name, image: g.header_image, price: g.price_formatted, discount: g.discount_percent || 0, source: 'Catálogo Verificado' });
            });
            (data.steam_live_results || []).forEach(s => {
                if (!allResults.some(r => String(r.id) === String(s.id))) {
                    allResults.push({ id: s.id, name: s.name, image: s.header_image, price: s.price_formatted, discount: s.discount_percent || 0, source: 'Steam Store' });
                }
            });

            if (status) status.textContent = \`Resultados para "\${data.query}"\`;
            if (count) count.textContent = \`\${allResults.length} título(s)\`;

            if (allResults.length === 0) {
                grid.innerHTML = \`<div class="col-span-full py-12 text-center text-slate-400 bg-[#171a21] border border-[#2a475e] rounded-xl p-8"><p class="text-sm font-semibold text-white">Nenhum título encontrado.</p></div>\`;
                return;
            }

            grid.innerHTML = allResults.map(item => {
                const discBadge = item.discount > 0 ? \`<span class="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white">-\${item.discount}%</span>\` : '';
                return \`
                    <div class="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col justify-between transition group shadow-lg">
                        <div class="relative h-40 w-full bg-[#101822] overflow-hidden">
                            <img src="\${item.image}" alt="\${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.src='https://placehold.co/600x300/171a21/66c0f4?text=Steam'">
                            <div class="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                            <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">\${discBadge}<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-slate-300">AppID \${item.id}</span></div>
                        </div>

                        <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div>
                                <span class="text-[10px] text-cyan-400 font-semibold block">\${item.source}</span>
                                <h3 class="text-sm font-bold text-white truncate">\${item.name}</h3>
                                <div class="mt-2 text-base font-extrabold text-emerald-400">\${item.price}</div>
                            </div>
                            <div class="space-y-1.5 pt-2 border-t border-[#2a475e]">
                                <a href="\${getAffiliateNuuvemUrl({ name: item.name })}" target="_blank" rel="noreferrer" class="w-full py-1.5 px-3 bg-[#171a21] hover:bg-cyan-600 text-cyan-300 hover:text-white text-xs font-semibold rounded-lg transition border border-[#2a475e] block text-center">Nuuvem →</a>
                                <a href="\${getAffiliateHypeUrl(item.name)}" target="_blank" rel="noreferrer" class="w-full py-1.5 px-3 bg-[#171a21] hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-semibold rounded-lg transition border border-[#2a475e] block text-center">Hype Games →</a>
                            </div>
                        </div>
                    </div>
                \`;
            }).join('');
        }

        // CRÍTICAS
        function filterReviews(category) {
            currentReviewFilter = category;
            document.querySelectorAll('.review-filter-btn').forEach(btn => {
                const text = btn.textContent.toLowerCase();
                const isMatch = (category === 'all' && text.includes('todas')) || (category === 'masterpiece' && text.includes('obra')) || text.includes(category.toLowerCase());
                btn.className = isMatch
                    ? 'review-filter-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#66c0f4] text-[#101822] transition'
                    : 'review-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e] transition';
            });
            renderReviewsGrid();
        }

        function renderReviewsGrid() {
            const grid = document.getElementById('reviews-cards-grid');
            if (!grid) return;

            const reviewsList = Object.values(REVIEWS_DATABASE).filter(r => {
                if (currentReviewFilter === 'all') return true;
                if (currentReviewFilter === 'masterpiece') return r.score >= 9.8;
                return r.genre === currentReviewFilter;
            });

            if (reviewsList.length === 0) {
                grid.innerHTML = \`<div class="col-span-full py-12 text-center text-slate-400 bg-[#171a21] border border-[#2a475e] rounded-xl p-8"><p class="text-sm font-semibold text-white">Nenhuma crítica nesta categoria.</p></div>\`;
                return;
            }

            grid.innerHTML = reviewsList.map(r => \`
                <div class="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col justify-between transition group shadow-lg">
                    <div class="relative h-44 w-full bg-[#101822] overflow-hidden">
                        <img src="\${r.banner}" alt="\${r.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                        <div class="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                        <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5"><span class="px-2.5 py-0.5 rounded text-[11px] font-black text-black shadow-md" style="background-color: \${r.badgeColor}">\${r.badge}</span></div>
                        <div class="absolute top-2.5 right-2.5"><span class="px-2.5 py-1 rounded-lg text-xs font-black bg-black/80 text-amber-300">★ \${r.score}</span></div>
                        <div class="absolute bottom-2 left-3 right-3"><h3 class="text-base font-extrabold text-white truncate">\${r.name}</h3></div>
                    </div>
                    <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">\${r.verdictLead}</p>
                        <div class="grid grid-cols-2 gap-2 pt-1">
                            <button onclick="openReviewModal('\${r.id}')" class="py-2 px-2.5 bg-[#171a21] hover:bg-[#233446] text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition border border-[#2a475e]">📖 Ler Análise</button>
                            <a href="\${getAffiliateNuuvemUrl({ name: r.name })}" target="_blank" rel="noreferrer" class="py-2 px-2.5 bg-[#66c0f4] hover:bg-[#38bdf8] text-[#101822] text-xs font-extrabold rounded-lg transition text-center">🛒 Ver Oferta</a>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function buildDynamicReview(g) {
            const isConsole = g.platform && g.platform.toLowerCase() !== 'pc';
            const ratingNum = g.user_rating || g.rating || 92;
            const score = (ratingNum / 10).toFixed(1);
            let badge = 'Excelente';
            let badgeColor = '#10b981';
            if (score >= 9.6) { badge = 'Obra-Prima'; badgeColor = '#a855f7'; }
            else if (score >= 9.2) { badge = 'Essencial'; badgeColor = '#f97316'; }
            
            const genre = (g.genres && g.genres.length > 0) ? g.genres[0] : (g.platform || 'Ação');
            const price = g.price_formatted || (g.current_price_brl ? \`R$ \${g.current_price_brl.toFixed(2).replace('.', ',')}\` : (g.deal_price ? \`R$ \${g.deal_price.toFixed(2).replace('.', ',')}\` : 'Sob Consulta'));
            const dev = g.developer || g.platform_label || 'Estúdio Parceiro';
            const banner = g.header_image || g.image || (String(g.id).match(/^\\d+$/) ? \`https://cdn.akamai.steamstatic.com/steam/apps/\${g.id}/header.jpg\` : \`https://placehold.co/600x300/171a21/66c0f4?text=\${encodeURIComponent(g.name)}\`);

            return {
                id: g.id,
                name: g.name,
                platform: isConsole ? g.platform : 'PC',
                badge: badge,
                badgeColor: badgeColor,
                score: score,
                genre: genre,
                scores: {
                    gameplay: Math.min(10, (score * 1.01).toFixed(1)),
                    graphics: Math.min(10, (score * 0.98).toFixed(1)),
                    narrative: Math.min(10, (score * 0.95).toFixed(1)),
                    replayability: Math.min(10, (score * 1.0).toFixed(1)),
                    valueForMoney: Math.min(10, (score * 0.99).toFixed(1))
                },
                headline: \`Análise Crítica 2026: Por que \${g.name} continua se destacando no nicho de \${genre}\`,
                verdictLead: g.short_description || g.review_verdict || \`Com alta aprovação de \${ratingNum}%, \${g.name} entrega uma das experiências mais consistentes e recompensadoras do mercado.\`,
                fullAnalysis: \`Desenvolvido por \${dev}, \${g.name} demonstra domínio técnico de ponta, ciclo de gameplay viciante e excelente polimento. Seja explorando seus sistemas principais ou participando de desafios intensos, a experiência entrega exatamente o que os fãs do gênero procuram com altíssimo retorno por hora jogada.\`,
                pros: [
                    "Mecânicas e ciclo de jogabilidade extremamente responsivos",
                    "Excelente taxa de aprovação da comunidade e da crítica global",
                    "Custo-benefício excepcional pelo volume de conteúdo oferecido"
                ],
                cons: [
                    "Pode exigir dedicação e tempo para dominar todas as nuances e mecânicas avançadas"
                ],
                author: "Redação GameLens Editorial",
                readTime: "3 min de leitura",
                banner: banner,
                bestDeal: {
                    store: isConsole ? 'Amazon' : 'Nuuvem',
                    price: price
                }
            };
        }

        function renderModalStoreButtons(game) {
            const container = document.getElementById('modal-stores-container');
            const titleEl = document.getElementById('modal-stores-title');
            const badgeEl = document.getElementById('modal-stores-badge');
            const officialBtn = document.getElementById('modal-official-link');
            const officialBtnText = document.getElementById('modal-official-btn-text');

            const platform = (game.platform || '').toLowerCase();
            const isConsole = platform === 'playstation' || platform === 'xbox' || platform === 'nintendo';

            if (isConsole) {
                if (titleEl) titleEl.innerHTML = \`<span class="text-amber-400">🎮</span><span>Onde Comprar: Mídia Física & Lojas Oficiais</span>\`;
                if (badgeEl) badgeEl.textContent = \`\${game.platform || 'Console'} Brasil\`;

                // 1. Amazon (Mídia Física Console - NUNCA PARA PC)
                const amazonUrl = getAffiliateAmazonUrl(game, game.platform);

                // 2. Loja Oficial / Hype Games Gift Card
                let giftCardName = 'PlayStation Store';
                let officialUrl = \`https://store.playstation.com/pt-br/search/\${encodeURIComponent(game.name)}\`;
                let officialLabel = 'Loja Oficial PlayStation';
                if (platform === 'xbox') {
                    giftCardName = 'Xbox Game Pass';
                    officialUrl = \`https://www.xbox.com/pt-br/search/results/games?q=\${encodeURIComponent(game.name)}\`;
                    officialLabel = 'Loja Oficial Xbox';
                } else if (platform === 'nintendo') {
                    giftCardName = 'Nintendo eShop';
                    officialUrl = \`https://www.nintendo.com/pt-br/search/#q=\${encodeURIComponent(game.name)}\`;
                    officialLabel = 'Loja Nintendo eShop';
                }
                const hypeGiftUrl = getAffiliateHypeUrl(giftCardName);

                if (container) {
                    container.innerHTML = \`
                        <a href="\${amazonUrl}" target="_blank" rel="noreferrer" class="px-3.5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-black rounded-lg transition flex items-center justify-between text-xs font-extrabold shadow-sm">
                            <span class="flex items-center gap-1.5">
                                <span>Comprar na Amazon</span>
                            </span>
                            <span class="text-[10px] bg-black/20 px-1.5 py-0.5 rounded">Mídia Física Console</span>
                        </a>
                        <a href="\${hypeGiftUrl}" target="_blank" rel="noreferrer" class="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition flex items-center justify-between text-xs font-bold shadow-sm">
                            <span class="flex items-center gap-1.5">
                                <span>\${giftCardName} (Hype)</span>
                            </span>
                            <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Créditos com Pix</span>
                        </a>
                    \`;
                }

                if (officialBtn) officialBtn.href = officialUrl;
                if (officialBtnText) officialBtnText.textContent = officialLabel;
            } else {
                // PC / Steam - ZERO AMAZON AQUI!
                if (titleEl) titleEl.innerHTML = \`<span class="text-emerald-400">⚡</span><span>Melhores Ofertas de Ativação Steam / PC</span>\`;
                if (badgeEl) badgeEl.textContent = 'Chaves Oficiais Digitais';

                const nuuvemUrl = getAffiliateNuuvemUrl(game);
                const hypeUrl = getAffiliateHypeUrl(game.name);
                const steamUrl = (game.id && String(game.id).match(/^\\d+$/))
                    ? \`https://store.steampowered.com/app/\${game.id}\`
                    : \`https://store.steampowered.com/search/?term=\${encodeURIComponent(game.name)}\`;

                if (container) {
                    container.innerHTML = \`
                        <a href="\${nuuvemUrl}" target="_blank" rel="noreferrer" class="px-3.5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition flex items-center justify-between text-xs font-bold shadow-sm">
                            <span class="flex items-center gap-1.5">
                                <span>Comprar na Nuuvem</span>
                            </span>
                            <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Ativação Steam R$</span>
                        </a>
                        <a href="\${hypeUrl}" target="_blank" rel="noreferrer" class="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition flex items-center justify-between text-xs font-bold shadow-sm">
                            <span class="flex items-center gap-1.5">
                                <span>Ver no Hype Games</span>
                            </span>
                            <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Entrega Imediata</span>
                        </a>
                    \`;
                }

                if (officialBtn) officialBtn.href = steamUrl;
                if (officialBtnText) officialBtnText.textContent = 'Abrir na Loja Steam';
            }
        }

        function openReviewModal(gameId) {
            let r = REVIEWS_DATABASE[gameId];
            if (!r) {
                const game = allGames.find(g => String(g.id) === String(gameId) || (g.name && g.name.toLowerCase() === String(gameId).toLowerCase())) || 
                             allDeals.find(d => String(d.id) === String(gameId) || (d.name && d.name.toLowerCase() === String(gameId).toLowerCase()));
                if (game) {
                    r = buildDynamicReview(game);
                } else {
                    r = REVIEWS_DATABASE['1086940'];
                }
            }
            if (!r) return;

            document.getElementById('review-modal-banner').src = r.banner;
            document.getElementById('review-modal-title').textContent = r.name;
            document.getElementById('review-modal-badge').textContent = r.badge;
            document.getElementById('review-modal-badge').style.backgroundColor = r.badgeColor || '#66c0f4';
            document.getElementById('review-modal-meta').textContent = \`\${r.author} · \${r.readTime}\`;
            document.getElementById('review-modal-score').textContent = \`★ \${r.score}\`;

            document.getElementById('review-modal-headline').textContent = r.headline;
            document.getElementById('review-modal-lead').textContent = \`"\${r.verdictLead}"\`;

            document.getElementById('review-modal-body').innerHTML = \`<p>\${r.fullAnalysis}</p>\`;

            const scoresGrid = document.getElementById('review-modal-scores-grid');
            if (scoresGrid) {
                scoresGrid.innerHTML = \`
                    <div class="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]"><span class="text-[10px] text-slate-400 block">Gameplay</span><span class="text-base font-bold text-white">\${r.scores.gameplay}/10</span></div>
                    <div class="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]"><span class="text-[10px] text-slate-400 block">Gráficos</span><span class="text-base font-bold text-white">\${r.scores.graphics}/10</span></div>
                    <div class="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]"><span class="text-[10px] text-slate-400 block">Narrativa</span><span class="text-base font-bold text-white">\${r.scores.narrative}/10</span></div>
                    <div class="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]"><span class="text-[10px] text-slate-400 block">Rejogabilidade</span><span class="text-base font-bold text-white">\${r.scores.replayability}/10</span></div>
                    <div class="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]"><span class="text-[10px] text-slate-400 block">Custo-Benefício</span><span class="text-base font-bold text-emerald-400">\${r.scores.valueForMoney}/10</span></div>
                \`;
            }

            document.getElementById('review-modal-pros').innerHTML = r.pros.map(p => \`<li class="flex items-start gap-1.5"><span class="text-emerald-400">✔</span><span>\${p}</span></li>\`).join('');
            document.getElementById('review-modal-cons').innerHTML = r.cons.map(c => \`<li class="flex items-start gap-1.5"><span class="text-rose-400">✖</span><span>\${c}</span></li>\`).join('');

            document.getElementById('review-modal-deal-title').textContent = \`\${r.name} - \${r.bestDeal.price}\`;
            
            // Botões de compra do modal de crítica: Nuuvem & Hype para PC; Amazon & Loja Console para Consoles
            const isConsole = r.platform && r.platform !== 'PC';
            const btnContainer = document.getElementById('review-modal-buttons-container');
            if (btnContainer) {
                if (isConsole) {
                    const amazonUrl = getAffiliateAmazonUrl({ name: r.name }, r.platform);
                    const hypeUrl = getAffiliateHypeUrl(r.name);
                    btnContainer.innerHTML = \`
                        <a href="\${amazonUrl}" target="_blank" rel="noreferrer" class="flex-1 sm:flex-none px-4 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-black rounded-lg text-xs font-extrabold text-center transition shadow-md">
                            Mídia Física na Amazon
                        </a>
                        <a href="\${hypeUrl}" target="_blank" rel="noreferrer" class="flex-1 sm:flex-none px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-extrabold text-center transition shadow-md">
                            Créditos no Hype Games
                        </a>
                    \`;
                } else {
                    // PC - ZERO AMAZON!
                    const nuuvemUrl = getAffiliateNuuvemUrl({ name: r.name });
                    const hypeUrl = getAffiliateHypeUrl(r.name);
                    btnContainer.innerHTML = \`
                        <a href="\${nuuvemUrl}" target="_blank" rel="noreferrer" class="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-extrabold text-center transition shadow-md">
                            Pegar na Nuuvem
                        </a>
                        <a href="\${hypeUrl}" target="_blank" rel="noreferrer" class="flex-1 sm:flex-none px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-extrabold text-center transition shadow-md">
                            Hype Games (Pix)
                        </a>
                    \`;
                }
            }

            document.getElementById('review-detail-modal').classList.remove('hidden');
        }

        function closeReviewModal() {
            document.getElementById('review-detail-modal').classList.add('hidden');
        }

        function openEditorialCritique(dealId) {
            const deal = allDeals.find(d => d.id === dealId) || (allDeals.length > 0 ? allDeals[0] : null);
            if (!deal) return;
            openGameModal(deal.id);
        }

        async function openGameModal(gameId) {
            const modal = document.getElementById('game-modal');
            modal.classList.remove('hidden');

            try {
                let game = null;
                // Procura na biblioteca de jogos
                if (allGames && allGames.length > 0) {
                    game = allGames.find(g => String(g.id) === String(gameId) || (g.name && g.name.toLowerCase() === String(gameId).toLowerCase()));
                }
                // Procura nas ofertas
                if (!game && allDeals && allDeals.length > 0) {
                    const deal = allDeals.find(d => String(d.id) === String(gameId) || (d.name && d.name.toLowerCase() === String(gameId).toLowerCase()));
                    if (deal) {
                        game = {
                            id: deal.id,
                            name: deal.name,
                            platform: deal.platform,
                            platform_label: deal.platform_label || deal.platform,
                            store: deal.store,
                            hours_played: 0,
                            user_rating: deal.rating || 95,
                            peak_24h_players: 35000,
                            current_price_brl: deal.deal_price,
                            regular_price_brl: deal.regular_price,
                            deal_price: deal.deal_price,
                            discount_percent: deal.discount_percent,
                            price_formatted: \`R$ \${deal.deal_price.toFixed(2).replace('.', ',')}\`,
                            developer: deal.platform_label || deal.platform,
                            short_description: deal.review_verdict || \`\${deal.name} com desconto oficial verificado.\`,
                            header_image: deal.image,
                            genres: [deal.platform, 'Promoção']
                        };
                    }
                }
                // Busca na API se não encontrou localmente
                if (!game) {
                    const res = await fetch(\`/api/game/\${encodeURIComponent(gameId)}\`);
                    if (res.ok) {
                        game = await res.json();
                    }
                }
                // Se ainda assim não encontrou, gera dinamicamente para o ID/Nome solicitado
                if (!game) {
                    game = {
                        id: gameId,
                        name: String(gameId).replace(/^deal-/, '').replace(/-/g, ' ').toUpperCase(),
                        platform: 'PC',
                        hours_played: 0,
                        user_rating: 90,
                        peak_24h_players: 15000,
                        current_price_brl: 0,
                        price_formatted: 'Sob Consulta',
                        discount_percent: 0,
                        developer: 'Estúdio Parceiro',
                        short_description: 'Informações detalhadas sincronizadas via GameLens.',
                        header_image: \`https://placehold.co/600x300/171a21/66c0f4?text=\${encodeURIComponent(gameId)}\`,
                        genres: ['Gamer']
                    };
                }

                const primaryGenre = game.genres && game.genres.length > 0 ? game.genres[0] : 'Ação';
                const gameColor = getGameColor(game.id, primaryGenre);

                document.getElementById('modal-title').textContent = game.name;
                document.getElementById('modal-accent-line').style.backgroundColor = gameColor;
                document.getElementById('modal-dev').textContent = \`Desenvolvedora / Plataforma: \${game.developer || game.platform_label || 'Estúdio Parceiro'}\`;
                
                const bannerEl = document.getElementById('modal-banner');
                if (game.header_image) {
                    bannerEl.src = game.header_image;
                } else if (String(game.id).match(/^\\d+$/)) {
                    bannerEl.src = \`https://cdn.akamai.steamstatic.com/steam/apps/\${game.id}/header.jpg\`;
                } else {
                    bannerEl.src = \`https://placehold.co/600x300/171a21/66c0f4?text=\${encodeURIComponent(game.name)}\`;
                }

                document.getElementById('modal-description').textContent = game.short_description || \`\${game.name} é um dos títulos de maior destaque no catálogo GameLens.\`;

                document.getElementById('modal-hours').textContent = (game.hours_played && game.hours_played > 0) ? \`\${game.hours_played}h\` : 'Multi';
                document.getElementById('modal-rating').textContent = \`\${game.user_rating || 90}%\`;
                document.getElementById('modal-players').textContent = (game.peak_24h_players || 25000).toLocaleString('pt-BR');

                // Formatação correta de preços com desconto
                const priceContainer = document.getElementById('modal-price');
                if (game.discount_percent && game.discount_percent > 0) {
                    const regPrice = game.regular_price_brl || game.regular_price || (game.current_price_brl * (100 / (100 - game.discount_percent)));
                    priceContainer.innerHTML = \`
                        <div class="flex flex-col items-start">
                            <span class="text-[11px] text-slate-400 line-through">R$ \${regPrice.toFixed(2).replace('.', ',')}</span>
                            <div class="flex items-center gap-1.5">
                                <span class="text-emerald-400 font-bold">\${game.price_formatted || ('R$ ' + game.current_price_brl.toFixed(2).replace('.', ','))}</span>
                                <span class="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded">-\${game.discount_percent}%</span>
                            </div>
                        </div>
                    \`;
                } else {
                    priceContainer.innerHTML = \`<span class="text-emerald-400 font-bold">\${game.price_formatted || (game.current_price_brl > 0 ? 'R$ ' + game.current_price_brl.toFixed(2).replace('.', ',') : 'Gratuito')}</span>\`;
                }

                document.getElementById('modal-genres').innerHTML = \`Gêneros: <strong class="text-slate-200">\${(game.genres || ['Ação']).join(', ')}</strong>\`;
                document.getElementById('modal-achievements').innerHTML = \`Conquistas: <strong class="text-[#66c0f4]">\${game.achievements_unlocked || 0} / \${game.total_achievements || 0}</strong>\`;

                // Renderiza botões de compra dinâmicos (SEM AMAZON PARA PC, COM AMAZON PARA CONSOLES)
                renderModalStoreButtons(game);
            } catch (err) {
                console.error("Erro ao carregar detalhes:", err);
            }
        }

        function closeGameModal() {
            document.getElementById('game-modal').classList.add('hidden');
        }

        function openPixModal() {
            document.getElementById('pix-modal').classList.remove('hidden');
        }

        function closePixModal() {
            document.getElementById('pix-modal').classList.add('hidden');
        }

        function copyPixKey() {
            const key = document.getElementById('pix-key-input').value;
            navigator.clipboard.writeText(key).then(() => {
                const btn = document.getElementById('btn-copy-pix');
                const orig = btn.innerHTML;
                btn.innerHTML = '<span>Chave Copiada!</span>';
                setTimeout(() => { btn.innerHTML = orig; }, 2000);
            });
        }

        function openAffiliatesModal() {
            const cfg = getAffiliateConfig();
            document.getElementById('input-rakuten-sid').value = cfg.rakutenSid || '4770537';
            document.getElementById('input-hype-mid').value = cfg.hypeMid || '53304';
            document.getElementById('input-nuuvem-id').value = cfg.nuuvemPartnerId || 'albertgamer';
            document.getElementById('input-amazon-id').value = cfg.amazonTag || 'albertgames-20';
            document.getElementById('affiliates-modal').classList.remove('hidden');
        }

        function closeAffiliatesModal() {
            document.getElementById('affiliates-modal').classList.add('hidden');
        }

        function saveAffiliateSettings() {
            const rakutenSid = document.getElementById('input-rakuten-sid').value.trim() || '4770537';
            const hypeMid = document.getElementById('input-hype-mid').value.trim() || '53304';
            const nuuvemId = document.getElementById('input-nuuvem-id').value.trim() || 'albertgamer';
            const amazonId = document.getElementById('input-amazon-id').value.trim() || 'albertgames-20';

            saveAffiliateConfig({ rakutenSid, hypeMid, nuuvemMid: '46796', nuuvemPartnerId: nuuvemId, amazonTag: amazonId });
            closeAffiliatesModal();
            renderTable();
            if (allDeals.length > 0) renderDealsGrid(allDeals);
        }
    </script>

    <!-- PIX MODAL -->
    <div id="pix-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-[#1b2838] border border-[#2a475e] rounded-2xl max-w-md w-full p-6 text-slate-200 relative shadow-2xl">
            <button onclick="closePixModal()" class="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-white">Apoiar Projeto via Pix</h3>
                    <p class="text-xs text-slate-400">100% livre de taxas. Incentiva a produção independente.</p>
                </div>
            </div>
            <div class="bg-[#171a21] border border-[#2a475e] rounded-xl p-4 flex flex-col items-center justify-center mb-4">
                <div class="w-32 h-32 bg-white rounded-lg p-2 mb-2 flex items-center justify-center">
                    <svg class="w-28 h-28" viewBox="0 0 100 100" fill="black">
                        <rect width="100" height="100" fill="white"/>
                        <rect x="5" y="5" width="28" height="28" fill="black"/><rect x="9" y="9" width="20" height="20" fill="white"/><rect x="13" y="13" width="12" height="12" fill="black"/>
                        <rect x="67" y="5" width="28" height="28" fill="black"/><rect x="71" y="9" width="20" height="20" fill="white"/><rect x="75" y="13" width="12" height="12" fill="black"/>
                        <rect x="5" y="67" width="28" height="28" fill="black"/><rect x="9" y="71" width="20" height="20" fill="white"/><rect x="13" y="75" width="12" height="12" fill="black"/>
                        <rect x="42" y="42" width="16" height="16" fill="#10b981"/>
                    </svg>
                </div>
                <span class="text-[11px] text-slate-400">Aponte o app do seu banco para o QR Code</span>
            </div>
            <div class="mb-4">
                <label class="block text-xs font-semibold text-slate-300 mb-1">Chave Pix:</label>
                <div class="flex items-center gap-2 bg-[#171a21] border border-[#2a475e] rounded-lg p-2">
                    <input id="pix-key-input" type="text" readOnly value="albertalves1205@gmail.com" class="bg-transparent text-xs text-white font-mono flex-1 outline-none"/>
                    <button id="btn-copy-pix" onclick="copyPixKey()" class="px-3 py-1 bg-[#66c0f4] hover:bg-[#38bdf8] text-[#101822] text-xs font-bold rounded transition">
                        Copiar
                    </button>
                </div>
            </div>
            <div class="text-[11px] text-slate-400 border-t border-[#2a475e] pt-3">
                Titular: <strong>Albert Alves</strong> · Obrigado por incentivar a plataforma!
            </div>
        </div>
    </div>

    <!-- AFFILIATES MODAL -->
    <div id="affiliates-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-[#1b2838] border border-[#2a475e] rounded-2xl max-w-lg w-full p-6 text-slate-200 relative shadow-2xl">
            <button onclick="closeAffiliatesModal()" class="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-white">Configurar IDs de Afiliados</h3>
                    <p class="text-xs text-slate-400">Insira suas tags de parceiro para direcionar as comissões de venda.</p>
                </div>
            </div>

            <div class="space-y-4 mb-6">
                <div class="bg-[#171a21] border border-[#2a475e] rounded-xl p-3.5">
                    <label class="text-xs font-bold text-emerald-400 block mb-1">Rakuten Advertising (Site ID / SID)</label>
                    <input id="input-rakuten-sid" type="text" placeholder="Ex: 4770537" class="w-full bg-[#101822] border border-[#2a475e] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"/>
                </div>

                <div class="bg-[#171a21] border border-[#2a475e] rounded-xl p-3.5">
                    <label class="text-xs font-bold text-purple-300 block mb-1">Hype Games (MID 53304)</label>
                    <input id="input-hype-mid" type="text" placeholder="Ex: 53304" class="w-full bg-[#101822] border border-[#2a475e] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"/>
                </div>

                <div class="bg-[#171a21] border border-[#2a475e] rounded-xl p-3.5">
                    <label class="text-xs font-bold text-cyan-300 block mb-1">Nuuvem Partner ID</label>
                    <input id="input-nuuvem-id" type="text" placeholder="Ex: albertgamer" class="w-full bg-[#101822] border border-[#2a475e] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"/>
                </div>

                <div class="bg-[#171a21] border border-[#2a475e] rounded-xl p-3.5">
                    <label class="text-xs font-bold text-amber-300 block mb-1">Amazon Associates Tag</label>
                    <input id="input-amazon-id" type="text" placeholder="Ex: albertgames-20" class="w-full bg-[#101822] border border-[#2a475e] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"/>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-[#2a475e]">
                <button onclick="closeAffiliatesModal()" class="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#171a21] rounded-lg transition">Cancelar</button>
                <button id="btn-save-affiliates" onclick="saveAffiliateSettings()" class="px-5 py-2 text-xs font-bold text-[#101822] bg-[#66c0f4] hover:bg-[#38bdf8] rounded-lg transition shadow-md">Salvar e Atualizar</button>
            </div>
        </div>
    </div>
</body>
</html>
`,
    'requirements.txt': `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
jinja2>=3.1.3
requests>=2.31.0`,
    'README.md': `# GameLens - Portal Gamer, Críticas & Analytics

Como rodar e fazer o Deploy no Render em 3 passos:

1. Baixe ou copie os arquivos deste repositório para o seu GitHub (ex: github.com/AlbertAlves12/GameLens).
2. No Render.com, crie um novo Web Service e conecte o repositório.
3. Configure os comandos:
   - Build Command: pip install -r requirements.txt
   - Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT`,
    'vercel.json': `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`
  };

  return (
    <div className={`min-h-screen ${bgMain} flex flex-col font-sans transition-colors duration-200`}>
      {/* TOP HEADER STEAM NAVIGATION */}
      <header className={`${bgHeader} border-b sticky top-0 z-40 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${isLight ? 'from-slate-100 to-slate-200 border-slate-300 text-sky-600' : 'from-[#1b2838] to-[#2a475e] border-[#66c0f4]/50 text-[#66c0f4]'} border flex items-center justify-center font-black shadow-inner`}>
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className={`font-extrabold text-base sm:text-lg tracking-tight whitespace-nowrap flex items-center ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Game<span className="text-[#66c0f4]">Lens</span>
              </span>
              <span className={`text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap ${textMuted}`}>
                Portal & Analytics Gamer
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links Principais & Administração */}
          <nav className={`flex items-center gap-2 sm:gap-3 overflow-x-auto py-2 text-xs font-medium no-scrollbar ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-[#66c0f4] transition whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                activeTab === 'dashboard' ? (isLight ? 'bg-slate-200 text-sky-700 font-bold border border-slate-300' : 'bg-[#1b2838] text-[#66c0f4] font-bold border border-[#2a475e]') : ''
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`hover:text-[#66c0f4] transition whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                activeTab === 'deals' ? (isLight ? 'bg-slate-200 text-sky-700 font-bold border border-slate-300' : 'bg-[#1b2838] text-[#66c0f4] font-bold border border-[#2a475e]') : ''
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Radar de Ofertas</span>
              <span className="text-[10px] bg-red-600 text-white font-extrabold px-1.5 py-0.2 rounded font-mono">-75%</span>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`hover:text-[#66c0f4] transition whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                activeTab === 'search' ? (isLight ? 'bg-slate-200 text-sky-700 font-bold border border-slate-300' : 'bg-[#1b2838] text-[#66c0f4] font-bold border border-[#2a475e]') : ''
              }`}
            >
              <Search className="w-4 h-4 text-cyan-500" />
              <span>Buscar Qualquer Jogo</span>
            </button>
            <button
              onClick={() => setActiveTab('platforms')}
              className={`hover:text-[#66c0f4] transition whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                activeTab === 'platforms' ? (isLight ? 'bg-slate-200 text-sky-700 font-bold border border-slate-300' : 'bg-[#1b2838] text-[#66c0f4] font-bold border border-[#2a475e]') : ''
              }`}
            >
              <Tv className="w-4 h-4 text-purple-500" />
              <span>Consoles & PC</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`hover:text-[#66c0f4] transition whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                activeTab === 'reviews' ? (isLight ? 'bg-slate-200 text-sky-700 font-bold border border-slate-300' : 'bg-[#1b2838] text-[#66c0f4] font-bold border border-[#2a475e]') : ''
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Críticas & Análises</span>
            </button>

            {/* Abas Administrativas / Pessoais (Meus Afiliados & Código) */}
            <button
              onClick={() => setActiveTab('monetization')}
              className={`hover:text-amber-600 transition whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${
                isLight ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-amber-500/30 bg-amber-950/40 text-amber-300'
              } ${activeTab === 'monetization' ? 'font-bold' : ''}`}
              title="Acessar painel de comissões e monetização"
            >
              <DollarSign className="w-4 h-4 text-amber-500" />
              <span>Meus Afiliados</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`hover:text-cyan-600 transition whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${
                isLight ? 'border-cyan-300 bg-cyan-50 text-cyan-800' : 'border-cyan-500/30 bg-cyan-950/40 text-cyan-300'
              } ${activeTab === 'code' ? 'font-bold' : ''}`}
              title="Ver e copiar os arquivos Python/HTML para subir no Render"
            >
              <Code2 className="w-4 h-4 text-cyan-500" />
              <span>Código & Deploy</span>
            </button>
          </nav>

          {/* Zone 3: Ação Pública (Tema & Apoio via Pix) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border text-xs font-semibold transition flex items-center gap-1.5 ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-[#171a21] border-[#2a475e] text-slate-300 hover:text-white'
              }`}
              title={isLight ? 'Alternar para Modo Escuro' : 'Alternar para Modo Claro'}
            >
              {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{isLight ? 'Escuro' : 'Claro'}</span>
            </button>

            <button
              onClick={() => setIsPixModalOpen(true)}
              className={`px-3.5 py-1.5 text-xs font-semibold border rounded-lg transition whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
                isLight ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300' : 'text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/40'
              }`}
              title="Apoiar este projeto com Pix direto"
            >
              <Coffee className="w-3.5 h-3.5 text-emerald-500" />
              <span>Apoiar via Pix</span>
            </button>
          </div>

        </div>
      </header>

      {/* SUB-BAR / PRESET & NICHOS BAR */}
      <div className={`${subBarBg} border-b py-2.5 px-4 sm:px-8 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 text-slate-300 flex-wrap">
            <span className="text-slate-400">Perfil da Biblioteca:</span>
            <div className="flex items-center gap-1 bg-[#171a21] p-1 rounded-lg border border-[#2a475e]">
              {Object.entries(PRESETS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setActivePreset(key)}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    activePreset === key
                      ? 'bg-[#66c0f4] text-[#101822] font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guia Visual dos Nichos Principais */}
          <div className="flex items-center gap-3 text-slate-300 flex-wrap">
            <span className="text-slate-400 font-medium">Cores dos Nichos:</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-sm"></span>
                <span>Ação</span>
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] shadow-sm"></span>
                <span>RPG</span>
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-sm"></span>
                <span>Estratégia</span>
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-sm"></span>
                <span>Indie</span>
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] shadow-sm"></span>
                <span>Simulação</span>
              </span>
            </div>

            {/* Status de Sincronização ao Vivo com Lojas Oficiais */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Preços & Ofertas ao Vivo • Atualizado às {lastSyncTime}</span>
              </span>
              <button
                onClick={syncLiveStoreData}
                disabled={isSyncingLive}
                className="py-1 px-2.5 rounded-lg text-slate-300 hover:text-white bg-[#171a21] border border-[#2a475e] hover:border-[#66c0f4] transition flex items-center gap-1 text-[11px] font-semibold shadow-sm"
                title="Sincronizar promoções em tempo real"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncingLive ? 'animate-spin text-cyan-400' : ''}`} />
                <span className="hidden sm:inline">{isSyncingLive ? 'Atualizando...' : 'Sincronizar'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* TAB 1: DASHBOARD INTERATIVO */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            
            {/* SEÇÃO PRINCIPAL SUPERIOR: GAMES INDICADOS E DESTAQUES DO DIA COM RESUMO DE CRÍTICAS */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#171a21] via-[#1b2838] to-[#171a21] p-6 sm:p-8 rounded-2xl border border-[#2a475e] shadow-xl relative overflow-hidden">
                <div className="space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-extrabold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>SELEÇÃO DIÁRIA • {getTodayFormattedDate().toUpperCase()}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Games Indicados do Dia & Resumos de Críticas
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Confira as análises em destaque, vereditos da crítica especializada e menores preços verificados com links diretos de aquisição oficial.
                  </p>
                </div>

                {/* Filtro de Categorias dos Indicados */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 relative z-10">
                  {[
                    { id: 'all', label: '🔥 Todos os Indicados' },
                    { id: 'top', label: '⭐ Maiores Notas (90%+)' },
                    { id: 'deals', label: '⚡ Em Promoção' },
                    { id: 'free', label: '🎮 Apenas Grátis' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setRecommendedCategory(cat.id as any)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition ${
                        recommendedCategory === cat.id
                          ? 'bg-[#66c0f4] text-[#101822] shadow-md'
                          : 'bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade de Games Indicados do Dia */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {RECOMMENDED_GAMES_OF_THE_DAY
                  .filter((item) => {
                    if (recommendedCategory === 'top') return item.user_rating >= 90;
                    if (recommendedCategory === 'deals') return item.discount_percent > 0;
                    if (recommendedCategory === 'free') return item.price_formatted === 'Gratuito';
                    return true;
                  })
                  .map((game) => {
                    const hypeUrl = getHypeSearchUrl(game.name, monetizationSettings);
                    const nuuvemUrl = getNuuvemSearchUrl(game.name, monetizationSettings);
                    
                    let targetOfferUrl = nuuvemUrl;
                    if (monetizationSettings.customGameLinks?.[game.name]) {
                      targetOfferUrl = monetizationSettings.customGameLinks[game.name];
                    } else if (game.source_deal?.includes('Steam') || (game as any).store === 'Steam Store' || (game as any).store === 'Steam') {
                      const isPkg = (game as any).is_package || (game as any).type === 1 || String(game.id) === '817628';
                      targetOfferUrl = (game as any).steam_url || (isPkg ? `https://store.steampowered.com/sub/${game.id}/` : `https://store.steampowered.com/app/${game.id}/`);
                    } else if (game.source_deal?.includes('Hype') || (game as any).store === 'Hype Games') {
                      targetOfferUrl = hypeUrl;
                    } else if (game.source_deal?.includes('Amazon') || (game as any).store === 'Amazon') {
                      targetOfferUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(game.name + ' jogo')}&tag=${encodeURIComponent(monetizationSettings.amazonAssociateId || 'albertgames-20')}`;
                    }

                    return (
                      <div
                        key={game.id}
                        onClick={() => handleOpenGameModal(game)}
                        className="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col justify-between transition group shadow-lg cursor-pointer transform hover:-translate-y-1"
                      >
                        <div className="relative h-48 w-full bg-[#101822] overflow-hidden">
                          <img
                            src={game.header_image}
                            alt={game.name}
                            onError={handleImageError}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                          
                          {/* Badges de destaque */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-500 text-black shadow-md">
                              {game.badge}
                            </span>
                            {game.discount_percent > 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white shadow-md animate-pulse">
                                -{game.discount_percent}%
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2.5 right-2.5">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-black/80 text-amber-300 backdrop-blur-sm border border-amber-500/30">
                              ★ {game.user_rating}%
                            </span>
                          </div>

                          <div className="absolute bottom-2 left-3 right-3">
                            <span className="text-[10px] text-slate-300 font-semibold block">{game.developer}</span>
                            <h3 className="text-base font-extrabold text-white truncate">{game.name}</h3>
                          </div>
                        </div>

                        {/* Conteúdo do Card com Resumo da Crítica */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="bg-[#171a21] border-l-2 border-[#66c0f4] p-2.5 rounded-r-lg">
                            <span className="text-[10px] text-[#66c0f4] font-bold block uppercase tracking-wider mb-0.5">Resumo da Crítica</span>
                            <p className="text-xs text-slate-300 italic line-clamp-3 leading-relaxed">
                              "{game.review_summary}"
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#2a475e]/60 flex items-center justify-between">
                            <div>
                              {game.discount_percent > 0 && (
                                <span className="text-[10px] text-slate-400 line-through block">
                                  R$ {game.regular_price.toFixed(2).replace('.', ',')}
                                </span>
                              )}
                              <span className="text-base font-black text-emerald-400">
                                {game.price_formatted}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">{game.source_deal}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenGameModal(game);
                              }}
                              className="py-2 px-2.5 bg-[#171a21] hover:bg-[#233446] text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition border border-[#2a475e] flex items-center justify-center gap-1"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#66c0f4]" />
                              <span>Ver Dados</span>
                            </button>
                            <a
                              href={targetOfferUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="py-2 px-2.5 bg-[#66c0f4] hover:bg-[#38bdf8] text-[#101822] text-xs font-extrabold rounded-lg transition shadow-md flex items-center justify-center gap-1"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Oferta</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* SEÇÃO SEGUNDA: ANALYTICS & DASHBOARD DA BIBLIOTECA (COM FILTROS DE PERÍODO) */}
            <div className="pt-6 border-t border-[#2a475e]/60">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-[#66c0f4]" />
                    <span>Analytics & Desempenho da Biblioteca Gamer</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Métricas dinâmicas com cromatografia dos títulos, estatísticas agregadas e histórico ajustável por período.
                  </p>
                </div>

                {/* Filtro de Período e Filtro de Nichos */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Filtro por Período */}
                  <div className="flex items-center gap-1 bg-[#171a21] p-1 rounded-lg border border-[#2a475e]">
                    <span className="text-[11px] text-slate-400 px-2 font-medium">Período:</span>
                    {[
                      { id: '1m', label: '1 Mês' },
                      { id: '3m', label: '3 Meses' },
                      { id: '6m', label: '6 Meses' },
                      { id: '1y', label: '1 Ano' },
                      { id: 'all', label: 'Total' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPeriodFilter(p.id as any)}
                        className={`px-2.5 py-1 text-xs rounded transition font-bold ${
                          periodFilter === p.id
                            ? 'bg-[#66c0f4] text-[#101822] shadow-sm'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Filtro de Nichos */}
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {['Todos', 'RPG', 'Ação', 'Estratégia', 'Indie', 'Soulslike'].map((genre) => {
                      const isSelected = selectedGenre === genre;
                      const genreColor = GENRE_COLORS[genre]?.bg;

                      return (
                        <button
                          key={genre}
                          onClick={() => setSelectedGenre((prev) => (genre !== 'Todos' && prev === genre ? 'Todos' : genre))}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition whitespace-nowrap flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#66c0f4] text-[#101822] font-semibold'
                              : 'bg-[#1b2838] hover:bg-[#233446] text-slate-300 border border-[#2a475e]'
                          }`}
                        >
                          {genreColor && (
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: genreColor }}
                            ></span>
                          )}
                          <span>{genre}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3 CARDS DE MÉTRICAS EM DESTAQUE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Card 1: Total de Horas */}
              <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 relative overflow-hidden transition hover:border-[#66c0f4] shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>TEMPO NO PERÍODO ({periodFilter.toUpperCase()})</span>
                  <div className="p-2 rounded-lg bg-[#171a21] text-[#66c0f4]">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white font-mono tabular-nums">
                  {periodMetrics.totalHours.toLocaleString('pt-BR')}{' '}
                  <span className="text-lg font-normal text-slate-400 font-sans">horas</span>
                </div>
                <div className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                  <span>Atividade em <strong className="text-white font-mono">{periodMetrics.activeGames}</strong> jogos</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-semibold">{periodFilter === 'all' ? 'Histórico completo' : `${monthlyTrend.months.length} meses`}</span>
                </div>
              </div>

              {/* Card 2: Jogo Mais Jogado (com cor tema do jogo!) */}
              <div
                onClick={() => setSelectedGameId(periodMetrics.mostPlayed.id)}
                className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 relative overflow-hidden transition hover:border-[#66c0f4] cursor-pointer shadow-md group"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>DESTAQUE NO PERÍODO</span>
                  <div
                    className="p-2 rounded-lg bg-[#171a21] group-hover:scale-110 transition-transform"
                    style={{ color: periodMetrics.mostPlayed.color }}
                  >
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white truncate flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: periodMetrics.mostPlayed.color }}
                  ></span>
                  <span className="truncate">{periodMetrics.mostPlayed.name}</span>
                </div>
                <div className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                  <span
                    className="font-mono font-bold"
                    style={{ color: periodMetrics.mostPlayed.color }}
                  >
                    {periodMetrics.mostPlayed.hours}h jogadas
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300">
                    {periodMetrics.mostPlayed.rating_label}
                  </span>
                </div>
              </div>

              {/* Card 3: Avaliação Média da Biblioteca */}
              <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 relative overflow-hidden transition hover:border-[#66c0f4] shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>AVALIAÇÃO MÉDIA DA BIBLIOTECA</span>
                  <div className="p-2 rounded-lg bg-[#171a21] text-emerald-400">
                    <Flame className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-emerald-400 font-mono tabular-nums">
                  {stats.avg_rating}%
                </div>
                <div className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                  <span>Índice Positivo Global</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300">Baseado nas análises da comunidade Steam</span>
                </div>
              </div>

            </div>

            {/* GRÁFICO DE LINHA: TENDÊNCIA E CRESCIMENTO DO PERÍODO SELECIONADO */}
            <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 mb-8 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#66c0f4]" />
                      <span>
                        Evolução de Horas Jogadas ({periodFilter === '1m' ? 'Último Mês' : periodFilter === '3m' ? 'Últimos 3 Meses' : periodFilter === '6m' ? 'Últimos 6 Meses' : periodFilter === '1y' ? 'Último Ano (12 Meses)' : 'Todo o Período'})
                      </span>
                    </h2>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <span>↑</span>
                      <span>+{monthlyTrend.growthRate}% no período</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Comparativo mensal de dedicação à biblioteca e aceleração de atividade no período recente.
                  </p>
                </div>

                {/* Badges de Métricas do Período */}
                <div className="flex items-center gap-3 text-xs flex-wrap">
                  <div className="bg-[#171a21] border border-[#2a475e] px-3.5 py-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Média Mensal</span>
                    <span className="font-mono font-bold text-white text-sm tabular-nums">{monthlyTrend.semesterAverage}h</span>
                  </div>
                  <div className="bg-[#171a21] border border-[#2a475e] px-3.5 py-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mês de Pico</span>
                    <span className="font-bold text-[#66c0f4] text-sm">{monthlyTrend.peakMonth} ({monthlyTrend.peakHours}h)</span>
                  </div>
                  <div className="bg-[#171a21] border border-[#2a475e] px-3.5 py-2 rounded-lg hidden sm:block">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total no Período</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">{monthlyTrend.totalSemesterHours.toLocaleString('pt-BR')}h</span>
                  </div>
                </div>
              </div>

              {/* Canvas do Gráfico de Linha */}
              <div className="relative h-[280px] sm:h-[320px]">
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index',
                      intersect: false
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: {
                          color: '#cbd5e1',
                          font: { size: 11, family: 'Plus Jakarta Sans', weight: 'bold' },
                          boxWidth: 12,
                          usePointStyle: true
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(23, 26, 33, 0.96)',
                        borderColor: '#66c0f4',
                        borderWidth: 1.5,
                        padding: 12,
                        cornerRadius: 8,
                        titleColor: '#ffffff',
                        titleFont: { size: 13, weight: 'bold', family: 'Plus Jakarta Sans' },
                        bodyColor: '#e2e8f0',
                        bodyFont: { size: 11.5, family: 'Plus Jakarta Sans' },
                        displayColors: false,
                        callbacks: {
                          title: (items) => {
                            if (!items.length) return '';
                            const idx = items[0].dataIndex;
                            return `📅 ${monthlyTrend.months[idx]} de 2026`;
                          },
                          beforeBody: (items) => {
                            if (!items.length) return [];
                            const idx = items[0].dataIndex;
                            const currentMonthHours = monthlyTrend.hours[idx];
                            const prevMonthHours = idx > 0 ? monthlyTrend.hours[idx - 1] : null;
                            let diffText = 'Início do período analisado';
                            if (prevMonthHours !== null && prevMonthHours > 0) {
                              const diffPct = (((currentMonthHours - prevMonthHours) / prevMonthHours) * 100).toFixed(1);
                              diffText = Number(diffPct) >= 0 ? `+${diffPct}% vs mês anterior` : `${diffPct}% vs mês anterior`;
                            }
                            const dailyAvg = (currentMonthHours / 30).toFixed(1);
                            const topGame = monthlyTrend.monthlyTopGames[idx] || 'Nenhum';

                            return [
                              `⏱️ Horas Registradas: ${currentMonthHours.toLocaleString('pt-BR')}h`,
                              `📈 Variação: ${diffText}`,
                              `🏆 Jogo Mais Jogado no Mês: ${topGame}`,
                              `⚡ Ritmo Médio Diário: ~${dailyAvg}h/dia`
                            ];
                          },
                          label: () => '',
                          afterBody: (items) => {
                            if (!items.length) return [];
                            const idx = items[0].dataIndex;
                            return [`📊 Total Acumulado até este mês: ${monthlyTrend.cumulative[idx]}h`];
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: { color: 'rgba(42, 71, 94, 0.25)' },
                        ticks: {
                          color: '#cbd5e1',
                          font: { size: 11, family: 'Plus Jakarta Sans', weight: 'bold' }
                        }
                      },
                      y: {
                        grid: { color: 'rgba(42, 71, 94, 0.4)' },
                        ticks: {
                          color: '#94a3b8',
                          font: { family: 'JetBrains Mono' },
                          callback: (val) => `${val}h`
                        }
                      }
                    }
                  }}
                />
              </div>

              {/* Rodapé explicativo do gráfico de linha */}
              <div className="mt-4 pt-3 border-t border-[#2a475e]/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#66c0f4]"></span>
                    <span className="text-slate-300">Tempo Efetivo Mensal</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-0.5 border-t border-dashed border-[#a855f7]"></span>
                    <span className="text-slate-300">Média Semestral ({monthlyTrend.semesterAverage}h)</span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Passe o mouse sobre os pontos para ver ritmo e jogo destaque de cada mês</span>
              </div>
            </div>

            {/* 2 GRÁFICOS INTERATIVOS ESTILIZADOS COM CHART.JS - COM CORES DISTINTAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              
              {/* Gráfico 1: Barras - Top Jogos com Cores Específicas por Jogo */}
              <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 flex flex-col shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Top Jogos por Horas Jogadas</span>
                    </h2>
                    <p className="text-xs text-slate-400">Cores distintas identificando cada jogo e sua identidade</p>
                  </div>

                  {/* Seletor de Modo de Cor no Gráfico de Barras */}
                  <div className="flex items-center gap-1 bg-[#171a21] p-1 rounded-lg border border-[#2a475e] self-start sm:self-auto">
                    <button
                      onClick={() => setColorMode('game')}
                      className={`px-2.5 py-1 text-[11px] rounded transition flex items-center gap-1 ${
                        colorMode === 'game'
                          ? 'bg-[#66c0f4] text-[#101822] font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Colorir cada barra com a cor exclusiva do jogo"
                    >
                      <Palette className="w-3 h-3" />
                      <span>Cor do Jogo</span>
                    </button>
                    <button
                      onClick={() => setColorMode('genre')}
                      className={`px-2.5 py-1 text-[11px] rounded transition flex items-center gap-1 ${
                        colorMode === 'genre'
                          ? 'bg-[#66c0f4] text-[#101822] font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Colorir cada barra de acordo com o nicho/gênero"
                    >
                      <span>Cor do Nicho</span>
                    </button>
                  </div>
                </div>

                <div className="relative flex-1 min-h-[300px]">
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      onClick: (_event, elements) => {
                        if (elements.length > 0) {
                          const idx = elements[0].index;
                          if (top6[idx]) {
                            setSelectedGameId(top6[idx].id);
                          }
                        }
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(23, 26, 33, 0.96)',
                          borderColor: '#38bdf8',
                          borderWidth: 1.5,
                          padding: 12,
                          cornerRadius: 8,
                          titleColor: '#ffffff',
                          titleFont: { size: 13, weight: 'bold', family: 'Plus Jakarta Sans' },
                          bodyColor: '#e2e8f0',
                          bodyFont: { size: 11.5, family: 'Plus Jakarta Sans' },
                          displayColors: true,
                          boxWidth: 8,
                          boxHeight: 8,
                          callbacks: {
                            title: (items) => {
                              if (!items.length) return '';
                              const idx = items[0].dataIndex;
                              const game = top6[idx];
                              return game ? `🎮 ${game.name}` : items[0].label;
                            },
                            beforeBody: (items) => {
                              if (!items.length) return [];
                              const idx = items[0].dataIndex;
                              const game = top6[idx];
                              if (!game) return [];
                              const percent = stats.total_hours > 0 ? ((game.hours_played / stats.total_hours) * 100).toFixed(1) : '0';
                              const primaryGenre = game.genres[0] || 'Geral';
                              const subGenres = game.genres.slice(1).join(', ');
                              return [
                                `🏷️ Nicho Principal: ${primaryGenre}${subGenres ? ` (${subGenres})` : ''}`,
                                `⏱️ Tempo Jogado: ${game.hours_played.toLocaleString('pt-BR')} horas`,
                                `📊 Participação: ${percent}% do total da biblioteca`,
                                `⭐ Avaliação na Steam: ${game.user_rating}% (${game.rating_label})`,
                                `👥 Pico de Jogadores (24h): ${game.peak_24h_players.toLocaleString('pt-BR')}`,
                                `💰 Preço Atual: ${game.price_formatted}`
                              ];
                            },
                            label: () => '',
                            afterBody: () => ['👉 Clique na barra para abrir a ficha completa deste jogo']
                          }
                        }
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: {
                            color: '#cbd5e1',
                            font: { size: 11, weight: 'bold' }
                          }
                        },
                        y: {
                          grid: { color: 'rgba(42, 71, 94, 0.4)' },
                          ticks: {
                            color: '#94a3b8',
                            callback: (val) => `${val}h`
                          }
                        }
                      }
                    }}
                  />
                </div>

                {/* Mini legenda dos jogos do gráfico */}
                <div className="mt-3 pt-3 border-t border-[#2a475e]/60 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-[11px] text-slate-300">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {barChartData.labels.map((name, idx) => {
                      const color = barChartData.datasets[0].backgroundColor[idx] as string;
                      return (
                        <div key={name} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{ backgroundColor: color }}></span>
                          <span className="text-slate-300 font-medium">{name}</span>
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-slate-400 text-[10px]">Passe o mouse ou clique para detalhes</span>
                </div>
              </div>

              {/* Gráfico 2: Rosca/Doughnut - Distribuição de Gênero com Cores Vibrantes por Nicho */}
              <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 flex flex-col shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-white">Distribuição por Nicho / Gênero</h2>
                    <p className="text-xs text-slate-400">Proporção com cores de alto contraste para cada estilo</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedGenre !== 'Todos' && (
                      <button
                        onClick={() => setSelectedGenre('Todos')}
                        className="text-xs font-medium text-amber-300 bg-amber-400/15 hover:bg-amber-400/25 px-2.5 py-1 rounded border border-amber-400/30 flex items-center gap-1 transition"
                        title="Filtro ativo. Clique para desmarcar e ver todos os jogos"
                      >
                        <span>Filtro: {selectedGenre}</span>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span className="text-xs font-mono text-[#66c0f4] bg-[#171a21] px-2.5 py-1 rounded border border-[#2a475e]">
                      Gráfico 2 · Rosca
                    </span>
                  </div>
                </div>

                <div className="relative flex-1 min-h-[300px] flex items-center justify-center">
                  <Doughnut
                    data={doughnutChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '68%',
                      onClick: (_event, elements) => {
                        if (elements.length > 0) {
                          const idx = elements[0].index;
                          const genres = Object.keys(stats.genre_distribution);
                          if (genres[idx]) {
                            const clickedGenre = genres[idx];
                            // Alterna seleção: se clicar no mesmo nicho ativo, volta para 'Todos'
                            setSelectedGenre((prev) => (prev === clickedGenre ? 'Todos' : clickedGenre));
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: '#e2e8f0',
                            font: { size: 12, weight: 'bold' },
                            boxWidth: 14,
                            padding: 16,
                            usePointStyle: true,
                            pointStyle: 'circle'
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(23, 26, 33, 0.96)',
                          borderColor: '#a855f7',
                          borderWidth: 1.5,
                          padding: 12,
                          cornerRadius: 8,
                          titleColor: '#ffffff',
                          titleFont: { size: 13, weight: 'bold', family: 'Plus Jakarta Sans' },
                          bodyColor: '#e2e8f0',
                          bodyFont: { size: 11.5, family: 'Plus Jakarta Sans' },
                          displayColors: true,
                          boxWidth: 8,
                          boxHeight: 8,
                          callbacks: {
                            title: (items) => {
                              if (!items.length) return '';
                              const genre = items[0].label;
                              return `🎯 Nicho: ${genre}`;
                            },
                            beforeBody: (items) => {
                              if (!items.length) return [];
                              const idx = items[0].dataIndex;
                              const genres = Object.keys(stats.genre_distribution);
                              const genre = genres[idx];
                              const hours = stats.genre_distribution[genre] || 0;
                              const percent = stats.total_hours > 0 ? ((hours / stats.total_hours) * 100).toFixed(1) : '0';
                              
                              const gamesInGenre = activeLibraryGames.filter((g: SteamGame) => g.genres.includes(genre));
                              const topInGenre = [...gamesInGenre].sort((a, b) => b.hours_played - a.hours_played)[0];

                              return [
                                `⏱️ Total no Nicho: ${hours.toLocaleString('pt-BR')} horas`,
                                `📊 Participação Geral: ${percent}% de todo o tempo jogado`,
                                `📚 Títulos na Biblioteca: ${gamesInGenre.length} jogo(s)`,
                                topInGenre ? `🏆 Título Destaque: ${topInGenre.name} (${topInGenre.hours_played}h)` : ''
                              ].filter(Boolean);
                            },
                            label: () => '',
                            afterBody: (items) => {
                              if (!items.length) return [];
                              const idx = items[0].dataIndex;
                              const genres = Object.keys(stats.genre_distribution);
                              const genre = genres[idx];
                              const isCurrent = selectedGenre === genre;
                              return [
                                isCurrent
                                  ? '↩️ Clique novamente na fatia para desmarcar e ver Todos os jogos'
                                  : '👉 Clique na fatia para filtrar a tabela por este nicho'
                              ];
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>

                {/* Resumo percentual dos nichos */}
                <div className="mt-3 pt-3 border-t border-[#2a475e]/60 flex flex-wrap items-center justify-around gap-2 text-xs">
                  {Object.entries(stats.genre_distribution).map(([genre, hours]) => {
                    const color = getGenreColor(genre);
                    const pct = Math.round((hours / stats.total_hours) * 100);
                    return (
                      <div key={genre} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                        <span className="text-slate-300 font-medium">{genre}:</span>
                        <span className="font-mono font-bold text-white">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* TABELA DE DADOS DETALHADA */}
            <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl overflow-hidden shadow-lg">
              
              {/* Barra superior de busca, histórico e ordenação */}
              <div className="p-5 border-b border-[#2a475e] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  <div className="relative flex-1 max-w-sm">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchTerm.trim()) {
                          addToSearchHistory(searchTerm);
                        }
                      }}
                      onBlur={() => {
                        if (searchTerm.trim()) {
                          addToSearchHistory(searchTerm);
                        }
                      }}
                      placeholder="Filtrar por nome ou desenvolvedor..."
                      className="w-full bg-[#171a21] border border-[#2a475e] text-white text-xs rounded-lg px-3.5 py-2 pl-9 focus:outline-none focus:border-[#66c0f4] transition placeholder-slate-400"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {selectedGenre !== 'Todos' && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#171a21] border border-[#66c0f4]/50 text-xs text-white">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getGenreColor(selectedGenre) }}
                        ></span>
                        <span className="text-slate-300">Nicho:</span>
                        <strong className="text-white">{selectedGenre}</strong>
                        <button
                          onClick={() => setSelectedGenre('Todos')}
                          className="ml-1 text-slate-400 hover:text-white transition p-0.5 rounded hover:bg-[#2a475e]"
                          title="Remover filtro e ver todos os jogos"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <span className="text-xs text-slate-400 whitespace-nowrap">Ordenar por:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-[#171a21] border border-[#2a475e] text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#66c0f4]"
                    >
                      <option value="hours">Mais Jogados (Horas)</option>
                      <option value="rating">Maior Avaliação (%)</option>
                      <option value="players">Pico 24h Jogadores</option>
                      <option value="price">Preço</option>
                      <option value="name">Nome (A-Z)</option>
                    </select>
                    <button
                      onClick={() => setSortAsc(!sortAsc)}
                      className="p-1.5 bg-[#171a21] hover:bg-[#2a475e] text-slate-300 rounded border border-[#2a475e] transition"
                      title={sortAsc ? 'Ordem Ascendente' : 'Ordem Descendente'}
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Componente de Histórico de Busca (Últimas 5 consultas salvas) */}
                {searchHistory.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-[#2a475e]/40 flex-wrap text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 font-semibold shrink-0">
                      <Clock className="w-3.5 h-3.5 text-[#66c0f4]" />
                      <span>Histórico de buscas:</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {searchHistory.map((query, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1.5 bg-[#171a21] hover:bg-[#233446] border border-[#2a475e] hover:border-[#66c0f4] rounded-md px-2.5 py-1 text-slate-300 hover:text-white transition group cursor-pointer"
                          onClick={() => {
                            setSearchTerm(query);
                            addToSearchHistory(query);
                          }}
                        >
                          <span className="text-xs font-medium">{query}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromSearchHistory(query);
                            }}
                            className="text-slate-500 hover:text-red-400 transition p-0.5 rounded"
                            title="Remover este termo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={clearSearchHistory}
                      className="text-[11px] text-slate-500 hover:text-red-400 underline ml-auto transition font-medium"
                    >
                      Limpar histórico
                    </button>
                  </div>
                )}
              </div>

              {/* Tabela de Jogos com Cores Específicas */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase bg-[#171a21] text-slate-400 border-b border-[#2a475e]">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">Jogo & Cor Tema</th>
                      <th scope="col" className="px-6 py-3.5">Nicho / Gênero</th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-right cursor-pointer hover:text-white"
                        onClick={() => {
                          setSortBy('hours');
                          setSortAsc(sortBy === 'hours' ? !sortAsc : false);
                        }}
                      >
                        Horas Registradas ↕
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-right cursor-pointer hover:text-white"
                        onClick={() => {
                          setSortBy('rating');
                          setSortAsc(sortBy === 'rating' ? !sortAsc : false);
                        }}
                      >
                        Avaliação Steam ↕
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-right cursor-pointer hover:text-white"
                        onClick={() => {
                          setSortBy('players');
                          setSortAsc(sortBy === 'players' ? !sortAsc : false);
                        }}
                      >
                        Pico 24h ↕
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-right cursor-pointer hover:text-white"
                        onClick={() => {
                          setSortBy('price');
                          setSortAsc(sortBy === 'price' ? !sortAsc : false);
                        }}
                      >
                        Preço ↕
                      </th>
                      <th scope="col" className="px-6 py-3.5 text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a475e]/50">
                    {tableGames.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-sm">
                          Nenhum jogo encontrado com os critérios de busca.
                        </td>
                      </tr>
                    ) : (
                      tableGames.map((game) => {
                        const primaryGenre = game.genres[0] || 'Ação';
                        const genreColor = getGenreColor(primaryGenre);

                        return (
                          <tr
                            key={game.id}
                            onClick={() => handleOpenGameModal(game)}
                            className="hover:bg-[#233446]/50 transition cursor-pointer"
                          >
                            <td className="px-6 py-4 flex items-center gap-3">
                              {/* Barra de cor identificadora do jogo */}
                              <div
                                className="w-1.5 h-10 rounded-full shrink-0 shadow-sm"
                                style={{ backgroundColor: game.color }}
                                title={`Cor do jogo: ${game.name}`}
                              ></div>
                              <img
                                src={game.header_image}
                                alt={game.name}
                                onError={handleImageError}
                                className="w-14 h-8 object-cover rounded bg-[#101822] shrink-0"
                              />
                              <div>
                                <span className="font-bold text-white block flex items-center gap-2">
                                  <span>{game.name}</span>
                                </span>
                                <span className="text-xs text-slate-400">{game.developer} · {game.release_year}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: genreColor }}
                                ></span>
                                <span className="text-xs font-medium text-slate-200">
                                  {primaryGenre}
                                </span>
                                {game.genres[1] && (
                                  <span className="text-xs text-slate-400">· {game.genres[1]}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-mono font-semibold text-white tabular-nums">
                              {game.hours_played.toLocaleString('pt-BR')}h
                            </td>
                            <td className="px-6 py-4 text-right font-mono tabular-nums">
                              <span className="text-emerald-400 font-bold">{game.user_rating}%</span>
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-slate-300 tabular-nums">
                              {game.peak_24h_players.toLocaleString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-white tabular-nums">
                              {game.price_formatted}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenGameModal(game);
                                }}
                                className="bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#101822] text-xs font-semibold px-2.5 py-1.5 rounded transition"
                              >
                                Ver Métricas & Crítica
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Rodapé da tabela */}
              <div className="px-6 py-3.5 bg-[#171a21] border-t border-[#2a475e] flex items-center justify-between text-xs text-slate-400">
                <span>Exibindo {tableGames.length} de {activeLibraryGames.length} jogos</span>
                <span className="font-mono">Fonte: Steam Web & Dados Simulados</span>
              </div>

            </div>

            </div>

          </div>
        )}

        {/* TAB: RADAR DE PROMOÇÕES & DESCONTOS */}
        {activeTab === 'deals' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header da Seção de Ofertas */}
            <div className="bg-gradient-to-r from-[#171a21] via-[#1b2838] to-[#171a21] border border-[#2a475e] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>RADAR ATIVO · OFERTAS VERIFICADAS EM TEMPO REAL</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Central de Promoções & Chaves Oficiais
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Economize até 75% em ativações oficiais Steam, consoles (PS5, Xbox, Nintendo) e gift cards em reais com entrega instantânea e pagamento via Pix pelas nossas lojas parceiras.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {(['all', 'PC', 'PlayStation', 'Xbox', 'Nintendo'] as const).map((plat) => {
                    const isSelected = dealsPlatform === plat;
                    const label = plat === 'all' ? 'Todas as Ofertas' : plat === 'PC' ? 'PC (Steam & Epic)' : plat;
                    return (
                      <button
                        key={plat}
                        onClick={() => setDealsPlatform(plat)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                          isSelected
                            ? 'bg-[#66c0f4] text-[#101822] shadow-sm'
                            : 'bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Grade Dinâmica de Ofertas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                ...liveDeals.map((ld): DealItem => ({
                  id: `live-${ld.id}`,
                  name: ld.name,
                  platform: 'PC',
                  platform_label: 'PC / Steam Oficial',
                  regular_price: ld.regular_price,
                  deal_price: ld.deal_price,
                  discount_percent: ld.discount_percent,
                  badge: ld.badge,
                  store: 'Steam Store',
                  deal_url: ld.steam_url || (ld.is_package || String(ld.id) === '817628' ? `https://store.steampowered.com/sub/${ld.id}` : `https://store.steampowered.com/app/${ld.id}`),
                  image: ld.image,
                  rating: ld.rating,
                  review_verdict: ld.review_verdict,
                })),
                ...DEALS_DATABASE
              ]
                .filter((d, index, self) => self.findIndex(t => t.name.toLowerCase() === d.name.toLowerCase()) === index)
                .filter((d) => dealsPlatform === 'all' || d.platform.toLowerCase() === dealsPlatform.toLowerCase())
                .map((d) => {
                  let buyUrl = d.deal_url;
                  if (d.store === 'Hype Games') {
                    buyUrl = getHypeSearchUrl(d.name, monetizationSettings);
                  } else if (d.store === 'Nuuvem') {
                    buyUrl = getNuuvemSearchUrl(d.name, monetizationSettings);
                  } else if (d.store === 'Amazon') {
                    buyUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(d.name + ' jogo')}&tag=${encodeURIComponent(monetizationSettings.amazonAssociateId)}`;
                  }

                  return (
                    <div
                      key={d.id}
                      onClick={() => handleOpenGameModal(d)}
                      className="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col justify-between transition group shadow-lg cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <div className="relative h-44 w-full bg-[#101822] overflow-hidden">
                        <img
                          src={d.image}
                          alt={d.name}
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          {d.discount_percent > 0 && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-black bg-red-600 text-white shadow-md animate-pulse">
                              -{d.discount_percent}%
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-slate-200 backdrop-blur-sm border border-white/10">
                            {d.platform_label}
                          </span>
                        </div>
                        <div className="absolute top-2.5 right-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#171a21]/90 text-amber-300 border border-amber-500/30">
                            ★ {d.rating}%
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-3 right-3">
                          <span className="text-[10px] text-emerald-400 font-bold block">{d.badge}</span>
                          <h3 className="text-sm font-extrabold text-white truncate">{d.name}</h3>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {d.review_verdict}
                        </p>

                        <div className="pt-2 border-t border-[#2a475e]/60 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 line-through block">
                              R$ {d.regular_price.toFixed(2).replace('.', ',')}
                            </span>
                            <span className="text-lg font-black text-emerald-400">
                              R$ {d.deal_price.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Loja Parceira</span>
                            <span className="text-xs font-bold text-slate-200">{d.store}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenGameModal(d);
                            }}
                            className="py-2 px-2.5 bg-[#171a21] hover:bg-[#233446] text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition border border-[#2a475e] flex items-center justify-center gap-1"
                          >
                            <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Crítica & Dados</span>
                          </button>
                          <a
                            href={buyUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="py-2 px-2.5 bg-[#66c0f4] hover:bg-[#38bdf8] text-[#101822] text-xs font-extrabold rounded-lg transition shadow-md flex items-center justify-center gap-1"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Pegar</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB: BUSCA UNIVERSAL AO VIVO DE QUALQUER JOGO */}
        {activeTab === 'search' && (
          <div className="space-y-8 animate-fade-in">
            {/* Search Hero */}
            <div className="bg-[#1b2838] border border-[#2a475e] rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xl">
              <div className="max-w-3xl mx-auto space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                  API GLOBAL DA STEAM INTEGRADA AO VIVO
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Pesquise os Dados de Qualquer Jogo do Mundo
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Digite o nome de qualquer título lançado na Steam ou consoles para consultar preços em BRL, descontos ativos, análises e onde comprar mais barato.
                </p>

                {/* Barra de Pesquisa Ampla */}
                <div className="relative max-w-xl mx-auto mt-4">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={universalSearchQuery}
                      onChange={(e) => setUniversalSearchQuery(e.target.value)}
                      placeholder={isListeningVoice ? 'Ouvindo... Fale o nome do jogo agora...' : 'Digite ou fale o nome do jogo (ex: GTA, God of War, Elden Ring)...'}
                      className={`w-full ${bgSubcard} border-2 ${isListeningVoice ? 'border-red-500 animate-pulse' : 'border-[#2a475e]'} text-sm rounded-xl px-4 py-3.5 pl-11 pr-12 focus:outline-none focus:border-[#66c0f4] transition shadow-inner placeholder-slate-400`}
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                    
                    <button
                      type="button"
                      onClick={handleStartVoiceSearch}
                      className={`absolute right-2.5 p-2 rounded-lg transition flex items-center justify-center ${
                        isListeningVoice
                          ? 'bg-red-600 text-white animate-bounce shadow-lg'
                          : 'bg-[#171a21] hover:bg-[#233446] text-slate-300 hover:text-white border border-[#2a475e]'
                      }`}
                      title={isListeningVoice ? 'Ouvindo... Fale agora' : 'Pesquisar por Voz'}
                    >
                      <Mic className={`w-4 h-4 ${isListeningVoice ? 'text-white' : 'text-[#66c0f4]'}`} />
                    </button>
                  </div>
                  {isListeningVoice && (
                    <p className="text-xs text-red-400 font-bold mt-2 animate-pulse flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      Ouvindo microfone... Fale o nome do jogo claramente.
                    </p>
                  )}
                </div>

                {/* Sugestões Rápidas de Jogos Populares */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
                  <span className="text-slate-400">Sugestões:</span>
                  {['Grand Theft Auto V', 'Elden Ring', 'God of War', 'Cyberpunk 2077', 'Red Dead Redemption 2', 'Resident Evil 4'].map((title) => (
                    <button
                      key={title}
                      onClick={() => setUniversalSearchQuery(title)}
                      className="px-2.5 py-1 rounded-md bg-[#101822] hover:bg-[#233446] border border-[#2a475e] text-slate-300 transition"
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Área de Resultados da Pesquisa Universal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  {universalSearchQuery ? `Exibindo títulos compatíveis com "${universalSearchQuery}"` : 'Títulos em Destaque no Radar Global'}
                </span>
                <span>{isSearchingUniversal ? 'Buscando...' : `${universalSearchResults.length} título(s) disponíveis`}</span>
              </div>

              {isSearchingUniversal ? (
                <div className="col-span-full py-16 text-center text-slate-400 bg-[#1b2838] border border-[#2a475e] rounded-2xl p-8">
                  <div className="w-8 h-8 border-3 border-[#66c0f4] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm font-bold text-white">Consultando base global da Steam & parceiros...</p>
                  <p className="text-xs text-slate-400 mt-1">Buscando menor preço, análises e requisitos para "{universalSearchQuery}"</p>
                </div>
              ) : universalSearchResults.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 bg-[#1b2838] border border-[#2a475e] rounded-2xl p-8">
                  <p className="text-base font-bold text-white">Nenhum título encontrado para "{universalSearchQuery}".</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Tente buscar por outro termo, como GTA, Elden Ring, God of War ou FIFA.</p>
                  <button
                    onClick={() => setUniversalSearchQuery('')}
                    className="px-4 py-2 bg-[#66c0f4] text-[#101822] text-xs font-bold rounded-lg hover:bg-[#38bdf8] transition"
                  >
                    Ver Jogos Populares
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {universalSearchResults.map((item) => {
                    const hypeUrl = getHypeSearchUrl(item.name, monetizationSettings);
                    const nuuvemUrl = getNuuvemSearchUrl(item.name, monetizationSettings);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOpenGameModal(item)}
                        className="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col justify-between transition group shadow-lg cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <div className="relative h-40 w-full bg-[#101822] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={handleImageError}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            {item.discount > 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white animate-pulse shadow-md">
                                -{item.discount}%
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-slate-300 border border-white/10">
                              AppID {item.id}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-cyan-400 font-semibold block">{item.source}</span>
                            <h3 className="text-sm font-bold text-white truncate" title={item.name}>
                              {item.name}
                            </h3>
                            <div className="mt-2 text-base font-extrabold text-emerald-400">
                              {item.price}
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-[#2a475e]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenGameModal(item);
                              }}
                              className="w-full py-2 px-3 bg-[#66c0f4] hover:bg-[#38bdf8] text-[#101822] text-xs font-black rounded-lg transition shadow-md flex items-center justify-center gap-1.5"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Ver Dados, Crítica & Requisitos</span>
                            </button>
                            <a
                              href={nuuvemUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-full py-1.5 px-3 bg-[#171a21] hover:bg-cyan-600 text-cyan-300 hover:text-white text-xs font-semibold rounded-lg transition border border-[#2a475e] flex items-center justify-between"
                            >
                              <span>Buscar Menor Preço Nuuvem</span>
                              <span>→</span>
                            </a>
                            <a
                              href={hypeUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-full py-1.5 px-3 bg-[#171a21] hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-semibold rounded-lg transition border border-[#2a475e] flex items-center justify-between"
                            >
                              <span>Ver Ofertas Hype Games</span>
                              <span>→</span>
                            </a>
                            <a
                              href={
                                (item as any).steam_url ||
                                ((item as any).is_package || (item as any).type === 1 || String(item.id) === '817628'
                                  ? `https://store.steampowered.com/sub/${item.id}`
                                  : /^\d+$/.test(String(item.id))
                                  ? `https://store.steampowered.com/app/${item.id}`
                                  : `https://store.steampowered.com/search/?term=${encodeURIComponent(item.name)}`)
                              }
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-full py-1.5 px-3 bg-[#101822] hover:bg-[#233446] text-slate-400 hover:text-white text-[11px] rounded-lg transition flex items-center justify-between"
                            >
                              <span>Abrir Loja Steam Oficial</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: HUB CONSOLES & PC (CATÁLOGO MULTIPLATAFORMA COMPLETO) */}
        {activeTab === 'platforms' && (() => {
          const filteredCatalog = MULTIPLATFORM_GAMES.filter((g) => {
            const matchPlat = catalogPlatform === 'all' || g.platform.toLowerCase() === catalogPlatform.toLowerCase();
            const matchSearch =
              !catalogSearch ||
              g.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
              g.developer.toLowerCase().includes(catalogSearch.toLowerCase()) ||
              g.genres.some((gen) => gen.toLowerCase().includes(catalogSearch.toLowerCase()));
            return matchPlat && matchSearch;
          });

          // Promoções SEMPRE aparecem primeiro (requisito do usuário!)
          const sortedCatalog = [...filteredCatalog].sort((a, b) => {
            const aPromo = a.discount_percent > 0;
            const bPromo = b.discount_percent > 0;
            if (aPromo && !bPromo) return -1;
            if (!aPromo && bPromo) return 1;
            if (a.discount_percent !== b.discount_percent) return b.discount_percent - a.discount_percent;
            return b.rating - a.rating;
          });

          const totalPages = Math.max(1, Math.ceil(sortedCatalog.length / catalogPerPage));
          const safeCurrentPage = Math.min(catalogPage, totalPages);
          const pagedGames = sortedCatalog.slice((safeCurrentPage - 1) * catalogPerPage, safeCurrentPage * catalogPerPage);

          return (
            <div className="space-y-8 animate-fade-in">
              {/* Banner Introdução Consoles & PC */}
              <div className="bg-gradient-to-r from-[#171a21] via-[#1f1b2e] to-[#171a21] border border-[#2a475e] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
                <div className="absolute -right-8 -top-8 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="max-w-3xl space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold">
                    <Tv className="w-3.5 h-3.5" />
                    <span>ECOSSISTEMA GAMER MULTIPLATAFORMA COMPLETO</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Catálogo de Jogos: Consoles & PC Gamer
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Navegue pelos maiores sucessos de PC (Steam/Epic), PlayStation 5, Xbox Series X|S e Nintendo Switch. Veja análises da crítica, especificações técnicas detalhadas e compre com desconto via chaves e créditos oficiais.
                  </p>
                </div>
              </div>

              {/* Barra de Filtros de Plataforma e Busca */}
              <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-4 sm:p-5 space-y-4 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Seletor de Plataforma em Abas */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                    {([
                      { id: 'all', label: 'Todas as Plataformas', icon: '🎮' },
                      { id: 'PC', label: 'PC Gamer (Steam & Epic)', icon: '💻' },
                      { id: 'PlayStation', label: 'PlayStation 5 & 4', icon: '🟦' },
                      { id: 'Xbox', label: 'Xbox Series & Cloud', icon: '🟩' },
                      { id: 'Nintendo', label: 'Nintendo Switch', icon: '🟥' }
                    ] as const).map((plat) => {
                      const isSelected = catalogPlatform === plat.id;
                      return (
                        <button
                          key={plat.id}
                          onClick={() => {
                            setCatalogPlatform(plat.id);
                            setCatalogPage(1);
                          }}
                          className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#66c0f4] text-[#101822] shadow-sm'
                              : 'bg-[#171a21] text-slate-300 hover:text-white hover:bg-[#233446] border border-[#2a475e]'
                          }`}
                        >
                          <span>{plat.icon}</span>
                          <span>{plat.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Campo de Busca Rápida no Catálogo */}
                  <div className="relative max-w-xs w-full">
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => {
                        setCatalogSearch(e.target.value);
                        setCatalogPage(1);
                      }}
                      placeholder="Buscar no catálogo..."
                      className="w-full bg-[#101822] border border-[#2a475e] text-white text-xs rounded-lg px-3.5 py-2 pl-9 focus:outline-none focus:border-[#66c0f4] transition placeholder-slate-400"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Subinfo: Ordem de Promoções e Contador */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#2a475e]/60 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                      <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      Promoções com desconto sempre exibidas em primeiro lugar
                    </span>
                  </div>
                  <div>
                    <span>Total de <strong className="text-white font-mono">{sortedCatalog.length}</strong> jogo(s) disponível(is)</span>
                  </div>
                </div>
              </div>

              {/* Grade de Jogos Multiplataforma */}
              {pagedGames.length === 0 ? (
                <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-12 text-center text-slate-400 space-y-3">
                  <Gamepad2 className="w-12 h-12 text-slate-400 mx-auto" />
                  <p className="text-base font-bold text-white">Nenhum jogo encontrado para estes filtros.</p>
                  <p className="text-xs">Tente selecionar "Todas as Plataformas" ou limpar o campo de busca.</p>
                  <button
                    onClick={() => {
                      setCatalogPlatform('all');
                      setCatalogSearch('');
                      setCatalogPage(1);
                    }}
                    className="px-4 py-2 bg-[#66c0f4] text-[#101822] font-bold text-xs rounded-lg transition"
                  >
                    Ver Todos os Jogos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pagedGames.map((game) => {
                    let directBuyUrl = game.store_url || 'https://www.nuuvem.com';
                    if (game.store === 'Hype Games') {
                      directBuyUrl = getHypeSearchUrl(game.name, monetizationSettings);
                    } else if (game.store === 'Nuuvem') {
                      directBuyUrl = getNuuvemSearchUrl(game.name, monetizationSettings);
                    } else if (game.store === 'Amazon') {
                      directBuyUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(game.name + ' jogo')}&tag=${encodeURIComponent(monetizationSettings.amazonAssociateId || 'albertgames-20')}`;
                    }

                    // Cores de badge por plataforma
                    const platformBadgeClasses =
                      game.platform === 'PC'
                        ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/40'
                        : game.platform === 'PlayStation'
                        ? 'bg-blue-950/90 text-blue-300 border-blue-500/40'
                        : game.platform === 'Xbox'
                        ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                        : 'bg-red-950/90 text-red-300 border-red-500/40';

                    return (
                      <div
                        key={game.id}
                        onClick={() => handleOpenGameModal(game)}
                        className="bg-[#1b2838] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col justify-between transition group shadow-lg cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <div className="relative h-44 w-full bg-[#101822] overflow-hidden">
                          <img
                            src={game.image}
                            alt={game.name}
                            onError={handleImageError}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
                          
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                            {game.discount_percent > 0 && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-black bg-red-600 text-white shadow-md animate-pulse">
                                -{game.discount_percent}%
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${platformBadgeClasses} backdrop-blur-sm`}>
                              {game.platform_label}
                            </span>
                          </div>

                          <div className="absolute top-2.5 right-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#171a21]/90 text-amber-300 border border-amber-500/30">
                              ★ {game.rating}%
                            </span>
                          </div>

                          <div className="absolute bottom-2 left-3 right-3">
                            <span className="text-[10px] text-slate-300 font-medium block truncate">
                              {game.developer} · {game.release_year}
                            </span>
                            <h3 className="text-sm font-extrabold text-white truncate" title={game.name}>
                              {game.name}
                            </h3>
                          </div>
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {game.review_verdict || game.description}
                          </p>

                          <div className="pt-2 border-t border-[#2a475e]/60 flex items-center justify-between">
                            <div>
                              {game.discount_percent > 0 ? (
                                <>
                                  <span className="text-[10px] text-slate-400 line-through block">
                                    R$ {game.regular_price.toFixed(2).replace('.', ',')}
                                  </span>
                                  <span className="text-lg font-black text-emerald-400">
                                    R$ {game.deal_price.toFixed(2).replace('.', ',')}
                                  </span>
                                </>
                              ) : (
                                <span className="text-base font-extrabold text-white">
                                  {game.deal_price > 0 ? `R$ ${game.deal_price.toFixed(2).replace('.', ',')}` : 'Gratuito'}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block">Loja Parceira</span>
                              <span className="text-xs font-bold text-slate-200">{game.store}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenGameModal(game);
                              }}
                              className="py-2 px-2.5 bg-[#171a21] hover:bg-[#233446] text-slate-200 hover:text-white text-xs font-bold rounded-lg transition border border-[#2a475e] flex items-center justify-center gap-1"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Dados & Crítica</span>
                            </button>
                            <a
                              href={directBuyUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="py-2 px-2.5 bg-[#66c0f4] hover:bg-[#38bdf8] text-[#101822] text-xs font-black rounded-lg transition shadow-md flex items-center justify-center gap-1"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Comprar</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BARRA DE PAGINAÇÃO NAVEGÁVEL (Páginas 1, 2, 3...) */}
              {totalPages > 1 && (
                <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  {/* Seletor de itens por página */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Exibir por página:</span>
                    <div className="flex items-center gap-1 bg-[#171a21] p-1 rounded border border-[#2a475e]">
                      {[4, 8, 12, 16].map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setCatalogPerPage(size);
                            setCatalogPage(1);
                          }}
                          className={`px-2 py-0.5 rounded text-xs transition ${
                            catalogPerPage === size
                              ? 'bg-[#66c0f4] text-[#101822] font-bold'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <span className="text-slate-400 hidden md:inline">
                      · Mostrando {(safeCurrentPage - 1) * catalogPerPage + 1} a {Math.min(safeCurrentPage * catalogPerPage, sortedCatalog.length)} de {sortedCatalog.length}
                    </span>
                  </div>

                  {/* Botões de Navegação Numerados */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <button
                      onClick={() => setCatalogPage((p) => Math.max(1, p - 1))}
                      disabled={safeCurrentPage === 1}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#171a21] border border-[#2a475e] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      ← Anterior
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCatalogPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                          safeCurrentPage === pageNum
                            ? 'bg-[#66c0f4] text-[#101822] shadow-sm'
                            : 'bg-[#171a21] border border-[#2a475e] text-slate-300 hover:text-white hover:bg-[#233446]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setCatalogPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safeCurrentPage === totalPages}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#171a21] border border-[#2a475e] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Próxima →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 2: CRÍTICAS & REVIEWS EDITORIAIS (COM IA & AFILIADOS) */}
        {activeTab === 'reviews' && (
          <ReviewsView
            games={[
              ...INITIAL_GAMES,
              ...RECOMMENDED_GAMES_OF_THE_DAY.map(r => ({
                id: r.id,
                name: r.name,
                color: '#66c0f4',
                hover_color: '#38bdf8',
                hours_played: 150,
                genres: r.genres,
                user_rating: r.user_rating,
                rating_label: r.rating_label,
                peak_24h_players: 50000,
                current_price_brl: r.regular_price || 99.99,
                price_formatted: r.price_formatted,
                discount_percent: r.discount_percent || 0,
                developer: r.developer,
                release_year: r.release_year,
                achievements_unlocked: 30,
                total_achievements: 40,
                header_image: r.header_image,
                short_description: r.review_summary
              })),
              ...MULTIPLATFORM_GAMES.map(mg => ({
                id: mg.id,
                name: mg.name,
                color: '#66c0f4',
                hover_color: '#38bdf8',
                hours_played: 140,
                genres: mg.genres,
                user_rating: mg.rating,
                rating_label: mg.rating_label,
                peak_24h_players: 40000,
                current_price_brl: mg.deal_price,
                price_formatted: `R$ ${mg.deal_price.toFixed(2).replace('.', ',')}`,
                discount_percent: mg.discount_percent,
                developer: mg.developer,
                release_year: mg.release_year,
                achievements_unlocked: 25,
                total_achievements: 35,
                header_image: mg.image,
                short_description: mg.description
              })),
              ...DEALS_DATABASE.map(d => ({
                id: d.id,
                name: d.name,
                color: '#66c0f4',
                hover_color: '#38bdf8',
                hours_played: 130,
                genres: [d.platform, 'Destaque'],
                user_rating: d.rating,
                rating_label: 'Muito Positivas',
                peak_24h_players: 30000,
                current_price_brl: d.deal_price,
                price_formatted: `R$ ${d.deal_price.toFixed(2).replace('.', ',')}`,
                discount_percent: d.discount_percent,
                developer: 'Desenvolvedora Parceira',
                release_year: 2024,
                achievements_unlocked: 20,
                total_achievements: 30,
                header_image: d.image,
                short_description: d.review_verdict
              }))
            ]}
            reviews={reviews}
            selectedGameId={selectedReviewGameId}
            onSelectGame={(id) => setSelectedReviewGameId(id)}
            onTriggerAiReview={handleTriggerAiReview}
            isGeneratingAi={isGeneratingAiReview}
            monetizationSettings={monetizationSettings}
            onOpenPixModal={() => setIsPixModalOpen(true)}
            theme={theme}
          />
        )}

        {/* TAB 3: CENTRAL DE MONETIZAÇÃO, AFILIADOS & PIX */}
        {activeTab === 'monetization' && (
          <MonetizationHubView
            games={INITIAL_GAMES}
            settings={monetizationSettings}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenPixModal={() => setIsPixModalOpen(true)}
            theme={theme}
          />
        )}

        {/* TAB 4: CÓDIGO PYTHON & DEPLOY */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Arquivos Prontos para Deploy (Python & FastAPI)</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Todos os arquivos requisitados estão gerados e prontos para subir no Render, Vercel ou GitHub.
                </p>
              </div>

              {/* Download / Copy All */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(activeCodeFile, codeFiles[activeCodeFile])}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#2a475e] hover:bg-[#38bdf8] hover:text-[#101822] text-white rounded-lg transition flex items-center gap-1.5"
                >
                  {copiedFile === activeCodeFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === activeCodeFile ? 'Copiado!' : 'Copiar Arquivo Atual'}</span>
                </button>
              </div>
            </div>

            {/* File Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#2a475e]">
              {(['main.py', 'templates/index.html', 'requirements.txt', 'README.md', 'vercel.json'] as const).map(
                (file) => (
                  <button
                    key={file}
                    onClick={() => setActiveCodeFile(file)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition flex items-center gap-1.5 ${
                      activeCodeFile === file
                        ? 'bg-[#1b2838] text-[#66c0f4] border-t-2 border-[#66c0f4] font-bold'
                        : 'text-slate-400 hover:text-white bg-[#171a21]'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{file}</span>
                  </button>
                )
              )}
            </div>

            {/* Code Box */}
            <div className="bg-[#121c27] border border-[#2a475e] rounded-xl overflow-hidden shadow-lg">
              <div className="bg-[#171a21] px-4 py-2.5 border-b border-[#2a475e] flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{activeCodeFile}</span>
                <span>Python / Web Ready</span>
              </div>
              <pre className="p-4 sm:p-6 overflow-x-auto text-xs text-slate-300 font-mono leading-relaxed max-h-[500px]">
                <code>{codeFiles[activeCodeFile]}</code>
              </pre>
            </div>

            {/* Guia Rápido de Deploy Render */}
            <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Como hospedar no Render em 3 passos:
              </h3>
              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 mt-2 leading-relaxed">
                <li>Suba os arquivos deste repositório para o seu <strong>GitHub</strong>.</li>
                <li>No <strong>Render.com</strong>, crie um novo <strong>Web Service</strong> e conecte o repositório.</li>
                <li>Defina o Build Command como <code className="bg-[#171a21] px-1.5 py-0.5 rounded text-[#66c0f4]">pip install -r requirements.txt</code> e o Start Command como <code className="bg-[#171a21] px-1.5 py-0.5 rounded text-[#66c0f4]">uvicorn main:app --host 0.0.0.0 --port $PORT</code>.</li>
              </ol>
            </div>

          </div>
        )}

        {/* TAB 3: TESTADOR DE API */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Testador Interativo de Endpoints da API</h2>
              <p className="text-xs text-slate-400 mt-1">
                Simule e inspecione as respostas JSON fornecidas pelo back-end FastAPI.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTestApi('/api/stats')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
                  apiEndpoint === '/api/stats'
                    ? 'bg-[#66c0f4] text-[#101822] font-bold'
                    : 'bg-[#1b2838] text-slate-300 hover:bg-[#2a475e]'
                }`}
              >
                GET /api/stats
              </button>
              <button
                onClick={() => handleTestApi('/api/game/730')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
                  apiEndpoint === '/api/game/730'
                    ? 'bg-[#66c0f4] text-[#101822] font-bold'
                    : 'bg-[#1b2838] text-slate-300 hover:bg-[#2a475e]'
                }`}
              >
                GET /api/game/730 (CS2)
              </button>
              <button
                onClick={() => handleTestApi('/api/game/1086940')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
                  apiEndpoint === '/api/game/1086940'
                    ? 'bg-[#66c0f4] text-[#101822] font-bold'
                    : 'bg-[#1b2838] text-slate-300 hover:bg-[#2a475e]'
                }`}
              >
                GET /api/game/1086940 (Baldur's Gate 3)
              </button>
              <button
                onClick={() => handleTestApi('/api/games')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
                  apiEndpoint === '/api/games'
                    ? 'bg-[#66c0f4] text-[#101822] font-bold'
                    : 'bg-[#1b2838] text-slate-300 hover:bg-[#2a475e]'
                }`}
              >
                GET /api/games
              </button>
              <button
                onClick={() => handleTestApi('/api/health')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
                  apiEndpoint === '/api/health'
                    ? 'bg-[#66c0f4] text-[#101822] font-bold'
                    : 'bg-[#1b2838] text-slate-300 hover:bg-[#2a475e]'
                }`}
              >
                GET /api/health
              </button>
            </div>

            {/* JSON Output Viewer */}
            <div className="bg-[#121c27] border border-[#2a475e] rounded-xl overflow-hidden shadow-lg">
              <div className="bg-[#171a21] px-4 py-2.5 border-b border-[#2a475e] flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">200 OK</span>
                  <span>{apiEndpoint}</span>
                </div>
                <button
                  onClick={() => handleCopyCode('api_response', apiResponse)}
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar JSON</span>
                </button>
              </div>
              <pre className="p-4 sm:p-6 overflow-x-auto text-xs text-[#38bdf8] font-mono leading-relaxed max-h-[500px]">
                <code>{apiResponse || '// Clique em um dos endpoints acima para testar a resposta JSON'}</code>
              </pre>
            </div>

          </div>
        )}

      </main>

      {/* MODAL UNIFICADO DE DADOS DO JOGO, CRÍTICA, REQUISITOS & AFILIADOS */}
      {modalGame && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setModalGame(null)}
        >
          <div
            className="bg-[#1b2838] border border-[#2a475e] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner com Capa */}
            <div className="relative h-56 sm:h-64 w-full bg-[#101822] shrink-0 overflow-hidden">
              <img
                src={modalGame.image || FALLBACK_GAME_COVER}
                alt={modalGame.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-[#1b2838]/60 to-transparent"></div>
              
              {/* Linha com cor tema do jogo se disponível */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: modalGame.color || '#66c0f4' }}
              ></div>

              {/* Botão Voltar ao Dashboard */}
              <button
                onClick={() => setModalGame(null)}
                className="absolute top-4 left-4 bg-black/80 hover:bg-black text-cyan-300 hover:text-white rounded-xl px-3.5 py-2 transition z-20 shadow-lg border border-cyan-500/40 flex items-center gap-2 text-xs font-bold"
                title="Voltar ao Dashboard / Fechar Ficha"
              >
                <span>← Voltar ao Dashboard</span>
              </button>

              {/* Botão Fechar */}
              <button
                onClick={() => setModalGame(null)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white rounded-full p-2.5 transition z-20 shadow-md border border-white/10"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {modalGame.discount_percent !== undefined && modalGame.discount_percent > 0 && (
                      <span className="px-2.5 py-0.5 rounded text-xs font-black bg-red-600 text-white shadow-md">
                        -{modalGame.discount_percent}% OFF
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-black/80 text-cyan-300 border border-cyan-500/30">
                      {modalGame.platform_label || 'Multiplataforma'}
                    </span>
                    {modalGame.store && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-black/60 text-slate-300 border border-white/10">
                        Loja: {modalGame.store}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{modalGame.name}</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    {modalGame.developer || 'Desenvolvedora Oficial'} {modalGame.release_year ? `· ${modalGame.release_year}` : ''}
                  </p>
                </div>

                <div className="text-right shrink-0 bg-black/70 backdrop-blur-sm border border-amber-500/40 px-4 py-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Nota / Aclamação</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                    ★ {modalGame.user_rating}%
                  </span>
                </div>
              </div>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-slate-200">
              
              {/* Card Destaque / Headline */}
              {modalGame.headline && (
                <div className="bg-[#171a21] border-l-4 border-[#66c0f4] p-4 rounded-r-xl">
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                    {modalGame.headline}
                  </h3>
                  {modalGame.review_verdict && (
                    <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                      "{modalGame.review_verdict}"
                    </p>
                  )}
                </div>
              )}

              {/* Descrição */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sobre o Jogo</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {modalGame.short_description}
                </p>
              </div>

              {/* Grid 4 Cards de Métricas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#171a21] p-4 rounded-xl border border-[#2a475e]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {modalGame.hours_played ? 'Horas Jogadas' : 'Preço Regular'}
                  </span>
                  <span className="text-base font-bold text-slate-300 font-mono tabular-nums">
                    {modalGame.hours_played ? `${modalGame.hours_played}h` : modalGame.regular_price ? `R$ ${modalGame.regular_price.toFixed(2).replace('.', ',')}` : '--'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {modalGame.discount_percent ? 'Desconto Ativo' : 'Avaliação'}
                  </span>
                  <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                    {modalGame.discount_percent ? `-${modalGame.discount_percent}%` : `${modalGame.user_rating}%`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Plataforma</span>
                  <span className="text-xs font-bold text-cyan-300 truncate block">
                    {modalGame.platform_label || 'PC & Consoles'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Menor Preço</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono tabular-nums">
                    {modalGame.price_formatted}
                  </span>
                </div>
              </div>

              {/* Prós e Contras se disponível */}
              {((modalGame.pros && modalGame.pros.length > 0) || (modalGame.cons && modalGame.cons.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {modalGame.pros && modalGame.pros.length > 0 && (
                    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-emerald-400 flex items-center gap-1.5">
                        <ThumbsUp className="w-4 h-4 text-emerald-400" />
                        <span>Pontos Fortes (Prós)</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {modalGame.pros.map((p, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">✔</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {modalGame.cons && modalGame.cons.length > 0 && (
                    <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-rose-400 flex items-center gap-1.5">
                        <ThumbsDown className="w-4 h-4 text-rose-400" />
                        <span>Ressalvas (Contras)</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {modalGame.cons.map((c, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-400 font-bold">✖</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Especificações Técnicas e Requisitos de Sistema */}
              {modalGame.specs && (
                <div className="bg-[#171a21] border border-[#2a475e] rounded-xl p-4 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-[#66c0f4]" />
                    <span>Requisitos Mínimos & Configuração Recomendada</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]/60">
                      <span className="text-[10px] text-slate-400 block mb-1">Sistema Operacional</span>
                      <strong className="text-slate-200 font-mono text-[11px] block break-words leading-relaxed">{modalGame.specs.os}</strong>
                    </div>
                    <div className="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]/60">
                      <span className="text-[10px] text-slate-400 block mb-1">Processador (CPU)</span>
                      <strong className="text-slate-200 font-mono text-[11px] block break-words leading-relaxed">{modalGame.specs.processor}</strong>
                    </div>
                    <div className="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]/60">
                      <span className="text-[10px] text-slate-400 block mb-1">Memória RAM</span>
                      <strong className="text-slate-200 font-mono text-[11px] block break-words leading-relaxed">{modalGame.specs.memory}</strong>
                    </div>
                    <div className="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]/60">
                      <span className="text-[10px] text-slate-400 block mb-1">Placa de Vídeo (GPU)</span>
                      <strong className="text-slate-200 font-mono text-[11px] block break-words leading-relaxed">{modalGame.specs.graphics}</strong>
                    </div>
                    <div className="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]/60 sm:col-span-2 lg:col-span-2">
                      <span className="text-[10px] text-slate-400 block mb-1">Armazenamento Livre</span>
                      <strong className="text-emerald-400 font-mono text-[11px] block break-words leading-relaxed">{modalGame.specs.storage}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Seção de Links Oficiais de Compra com Afiliados Rastreáveis */}
              <div className="bg-gradient-to-r from-[#171a21] via-[#121c27] to-[#171a21] border border-[#2a475e] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Lojas Parceiras Oficiais com Desconto</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Comissão Ativa & Suporte Pix
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <a
                    href={modalGame.buyUrls.nuuvem}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition flex items-center justify-between text-xs font-extrabold shadow-sm"
                  >
                    <div className="flex items-center gap-1.5">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Nuuvem</span>
                    </div>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Tag: {(monetizationSettings.nuuvemPartnerId && !monetizationSettings.nuuvemPartnerId.includes('&') && !monetizationSettings.nuuvemPartnerId.includes('=')) ? monetizationSettings.nuuvemPartnerId : 'albertgamer'}</span>
                  </a>

                  <a
                    href={modalGame.buyUrls.hype}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition flex items-center justify-between text-xs font-extrabold shadow-sm"
                  >
                    <div className="flex items-center gap-1.5">
                      <Gift className="w-4 h-4" />
                      <span>Hype Games</span>
                    </div>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Loja Oficial</span>
                  </a>

                  {modalGame.buyUrls.amazon ? (
                    <a
                      href={modalGame.buyUrls.amazon}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-black rounded-lg transition flex items-center justify-between text-xs font-extrabold shadow-sm"
                    >
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4" />
                        <span>Amazon BR</span>
                      </div>
                      <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded">Associados</span>
                    </a>
                  ) : modalGame.buyUrls.steam ? (
                    <a
                      href={modalGame.buyUrls.steam}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2.5 bg-[#2a475e] hover:bg-[#38bdf8] hover:text-[#101822] text-white rounded-lg transition flex items-center justify-between text-xs font-bold"
                    >
                      <div className="flex items-center gap-1.5">
                        <ExternalLink className="w-4 h-4" />
                        <span>Steam Store</span>
                      </div>
                      <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded">Oficial</span>
                    </a>
                  ) : null}
                </div>
              </div>

            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-[#171a21] border-t border-[#2a475e] flex items-center justify-between gap-3 flex-wrap">
              <button
                onClick={() => setModalGame(null)}
                className="px-4 py-2 text-xs font-bold text-cyan-300 hover:text-white bg-[#101822] hover:bg-[#1b2838] rounded-xl border border-cyan-500/40 transition flex items-center gap-1.5 shadow-sm"
              >
                <span>← Voltar ao Dashboard</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (modalGame.id) setSelectedReviewGameId(modalGame.id);
                    setModalGame(null);
                    setActiveTab('reviews');
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 rounded-xl transition flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ver Análise Editorial Completa</span>
                </button>

                <button
                  onClick={() => setModalGame(null)}
                  className="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#1b2838] hover:bg-[#233446] rounded-xl border border-[#2a475e] transition"
                >
                  Fechar Ficha
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE APOIO VIA PIX */}
      <PixModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        settings={monetizationSettings}
      />

      {/* MODAL DE CONFIGURAÇÕES DE AFILIADOS & PIX */}
      <MonetizationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={monetizationSettings}
        onSave={handleSaveMonetizationSettings}
      />

      {/* FOOTER COM AVISO DE AFILIADOS E TRANSPARÊNCIA */}
      <footer className="bg-[#171a21] border-t border-[#2a475e] py-8 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white flex items-center gap-1">Game<span className="text-[#66c0f4]">Lens</span></span>
              <span>·</span>
              <span>Portal Gamer, Críticas Especializadas & Analytics</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 flex-wrap justify-center">
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#66c0f4] transition">
                Dashboard
              </button>
              <button onClick={() => setActiveTab('reviews')} className="hover:text-[#66c0f4] transition">
                Críticas & Reviews
              </button>
              <button onClick={() => setActiveTab('monetization')} className="hover:text-[#66c0f4] transition">
                Hub de Monetização
              </button>
              <button onClick={() => setIsPixModalOpen(true)} className="text-emerald-400 hover:underline transition">
                ☕ Doar via Pix
              </button>
              <button onClick={() => setIsSettingsModalOpen(true)} className="hover:text-white transition">
                ⚙️ Configurar Afiliados
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2a475e]/60 text-[11px] text-slate-400 leading-relaxed text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              <strong>Aviso de Transparência & Afiliados:</strong> Este site participa dos programas de afiliados oficiais da Nuuvem, Amazon Games e Green Man Gaming. Ao comprar através dos nossos links, recebemos uma comissão sem nenhum custo adicional para você. Isso apoia a infraestrutura e a continuidade da plataforma.
            </p>
            <span className="shrink-0 font-mono text-[10px] text-slate-400">v2.4.0 · 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
