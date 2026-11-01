/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
  Monitor
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
  FALLBACK_GAME_COVER
} from './monetizationData.ts';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'deals' | 'search' | 'platforms' | 'reviews' | 'monetization' | 'code' | 'api'>('dashboard');
  const [dealsPlatform, setDealsPlatform] = useState<string>('all');
  const [universalSearchQuery, setUniversalSearchQuery] = useState('');
  const [isSearchingUniversal, setIsSearchingUniversal] = useState(false);
  const [universalSearchResults, setUniversalSearchResults] = useState<any[]>([
    {
      id: "1245620",
      name: "Elden Ring",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
      price: "R$ 151,73",
      discount: 34,
      source: "Nuuvem (MID 46796)"
    },
    {
      id: "1091500",
      name: "Cyberpunk 2077: Ultimate Edition",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
      price: "R$ 99,95",
      discount: 50,
      source: "Nuuvem / Hype Games"
    },
    {
      id: "292030",
      name: "The Witcher 3: Wild Hunt",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg",
      price: "R$ 32,49",
      discount: 75,
      source: "Hype Games (MID 53304)"
    },
    {
      id: "271590",
      name: "Grand Theft Auto V",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
      price: "R$ 39,99",
      discount: 63,
      source: "Steam Store Oficial"
    },
    {
      id: "1593500",
      name: "God of War",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
      price: "R$ 79,96",
      discount: 60,
      source: "Nuuvem / Steam"
    },
    {
      id: "2050650",
      name: "Resident Evil 4",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg",
      price: "R$ 124,50",
      discount: 50,
      source: "Hype Games (MID 53304)"
    }
  ]);
  const [activePreset, setActivePreset] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [colorMode, setColorMode] = useState<'game' | 'genre'>('game'); // 'game' = cor do jogo, 'genre' = cor do nicho
  const [sortBy, setSortBy] = useState<'hours' | 'rating' | 'players' | 'price' | 'name'>('hours');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  
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
    // 1. Se for MultiplatformGame
    if (item.category && item.specs) {
      const mg = item as MultiplatformGame;
      const sid = monetizationSettings.rakutenSid || '4770537';
      const mid = monetizationSettings.hypeMid || '53304';
      const hypeUrl = `https://click.linksynergy.com/deeplink?id=${sid}&mid=${mid}&murl=${encodeURIComponent(`https://hype.games/br/search?q=${encodeURIComponent(mg.name)}`)}`;
      const nuuvemUrl = `https://www.nuuvem.com/item/${mg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}?partner=${encodeURIComponent(monetizationSettings.nuuvemPartnerId)}`;
      const amazonUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(mg.name + ' jogo')}&tag=${encodeURIComponent(monetizationSettings.amazonAssociateId)}`;

      setModalGame({
        id: mg.id,
        name: mg.name,
        developer: mg.developer,
        release_year: mg.release_year,
        image: mg.image,
        user_rating: mg.rating,
        price_formatted: mg.deal_price > 0 ? `R$ ${mg.deal_price.toFixed(2).replace('.', ',')}` : 'Gratuito',
        regular_price: mg.regular_price,
        deal_price: mg.deal_price,
        discount_percent: mg.discount_percent,
        genres: mg.genres,
        platform_label: mg.platform_label,
        store: mg.store,
        short_description: mg.description,
        review_verdict: mg.review_verdict,
        headline: mg.headline,
        pros: mg.pros,
        cons: mg.cons,
        specs: mg.specs,
        buyUrls: {
          nuuvem: nuuvemUrl,
          hype: hypeUrl,
          amazon: amazonUrl,
          steam: mg.platform === 'PC' ? `https://store.steampowered.com/search/?term=${encodeURIComponent(mg.name)}` : undefined
        }
      });
      return;
    }

    // 2. Se for SteamGame
    if (item.achievements_unlocked !== undefined) {
      const sg = item as SteamGame;
      const affiliate = getAffiliateUrls(sg, monetizationSettings);
      const existingReview = reviews[sg.id];
      setModalGame({
        id: sg.id,
        name: sg.name,
        developer: sg.developer,
        release_year: sg.release_year,
        image: sg.header_image,
        color: sg.color,
        hours_played: sg.hours_played,
        user_rating: sg.user_rating,
        price_formatted: sg.price_formatted,
        regular_price: sg.current_price_brl,
        deal_price: sg.current_price_brl,
        discount_percent: sg.discount_percent,
        genres: sg.genres,
        platform_label: 'PC / Steam',
        short_description: sg.short_description,
        review_verdict: existingReview?.verdictLead || `Avaliado em ${sg.user_rating}% pela comunidade gamer global na Steam.`,
        headline: existingReview?.headline || `Análise de Desempenho e Gameplay: ${sg.name}`,
        pros: existingReview?.pros || ["Excelente jogabilidade e resposta", "Comunidade ativa com milhares de jogadores", "Ótima trilha sonora e imersão"],
        cons: existingReview?.cons || ["Pode demandar PC intermediário para taxas de quadro máximas"],
        specs: {
          os: "Windows 10/11 64-bit",
          processor: "Intel Core i5 / AMD Ryzen 5",
          memory: "8 GB a 16 GB RAM",
          graphics: "GTX 1060 / RX 580 ou superior",
          storage: "50 GB livre"
        },
        buyUrls: {
          nuuvem: affiliate.nuuvem,
          hype: affiliate.hypeGames,
          amazon: affiliate.amazon,
          steam: `https://store.steampowered.com/app/${sg.id}`
        }
      });
      return;
    }

    // 3. Se for DealItem
    if (item.store && item.deal_price !== undefined) {
      const d = item as DealItem;
      const sid = monetizationSettings.rakutenSid || '4770537';
      const mid = monetizationSettings.hypeMid || '53304';
      const hypeUrl = `https://click.linksynergy.com/deeplink?id=${sid}&mid=${mid}&murl=${encodeURIComponent(`https://hype.games/br/search?q=${encodeURIComponent(d.name)}`)}`;
      const nuuvemUrl = `https://www.nuuvem.com/item/${d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}?partner=${encodeURIComponent(monetizationSettings.nuuvemPartnerId)}`;
      const amazonUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(d.name + ' jogo')}&tag=${encodeURIComponent(monetizationSettings.amazonAssociateId)}`;

      setModalGame({
        id: d.id,
        name: d.name,
        image: d.image,
        user_rating: d.rating,
        price_formatted: `R$ ${d.deal_price.toFixed(2).replace('.', ',')}`,
        regular_price: d.regular_price,
        deal_price: d.deal_price,
        discount_percent: d.discount_percent,
        genres: [d.platform, "Destaque"],
        platform_label: d.platform_label,
        store: d.store,
        short_description: d.review_verdict,
        review_verdict: d.review_verdict,
        headline: `Oferta Verificada: ${d.name} (${d.badge})`,
        pros: ["Preço promocional verificado em loja parceira oficial", "Chave ou ativação imediata com suporte em português", "Garantia oficial e sem tarifas surpresa"],
        cons: ["Preço promocional sujeito a estoque limitado"],
        specs: {
          os: d.platform === 'PC' ? "Windows 10/11 64-bit" : `${d.platform} Nativo`,
          processor: "Requisitos recomendados da plataforma",
          memory: "8 GB a 16 GB",
          graphics: "Compatível com a geração atual",
          storage: "SSD recomendado"
        },
        buyUrls: {
          nuuvem: nuuvemUrl,
          hype: hypeUrl,
          amazon: amazonUrl,
          steam: d.deal_url.includes('steam') ? d.deal_url : undefined
        }
      });
      return;
    }

    // 4. Se for resultado de busca genérico (Universal Search)
    const sid = monetizationSettings.rakutenSid || '4770537';
    const mid = monetizationSettings.hypeMid || '53304';
    const hypeUrl = `https://click.linksynergy.com/deeplink?id=${sid}&mid=${mid}&murl=${encodeURIComponent(`https://hype.games/br/search?q=${encodeURIComponent(item.name)}`)}`;
    const nuuvemUrl = `https://www.nuuvem.com/item/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}?partner=${encodeURIComponent(monetizationSettings.nuuvemPartnerId)}`;
    const amazonUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(item.name + ' jogo')}&tag=${encodeURIComponent(monetizationSettings.amazonAssociateId)}`;

    setModalGame({
      id: item.id || `search-${Date.now()}`,
      name: item.name,
      developer: "Produtora Oficial",
      release_year: 2024,
      image: item.image,
      user_rating: 92,
      price_formatted: item.price || "Consulte na Loja",
      discount_percent: item.discount || 0,
      genres: ["Ação / Aventura", "Multiplataforma"],
      platform_label: item.source || "Steam & Lojas Parceiras",
      short_description: `Título consagrado no mercado gamer. Consulte disponibilidade em tempo real, análises da crítica especializada e ative sua chave nas lojas oficiais parceiras com menores taxas e entrega rápida.`,
      review_verdict: "Excelente recepção crítica e forte engajamento da comunidade de jogadores.",
      headline: `Análise & Dados de Mercado: ${item.name}`,
      pros: ["Gráficos e jogabilidade de alto nível", "Disponível nas principais lojas digitais parceiras", "Suporte a múltiplos idiomas e controles"],
      cons: ["Verifique os requisitos mínimos do seu sistema antes da instalação"],
      specs: {
        os: "Windows 10/11 64-bit",
        processor: "Intel Core i5 / AMD Ryzen 5",
        memory: "8 GB a 16 GB RAM",
        graphics: "Placa de vídeo compatível com DirectX 12",
        storage: "50 GB livre"
      },
      buyUrls: {
        nuuvem: nuuvemUrl,
        hype: hypeUrl,
        amazon: amazonUrl,
        steam: item.id ? `https://store.steampowered.com/app/${item.id}` : undefined
      }
    });
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
    const game = INITIAL_GAMES.find((g) => g.id === gameId);
    if (!game) return;
    setIsGeneratingAiReview(true);
    setTimeout(() => {
      const newReview = generateProceduralAiReview(game, monetizationSettings.editorialName);
      setReviews((prev) => ({
        ...prev,
        [gameId]: newReview
      }));
      setIsGeneratingAiReview(false);
    }, 700);
  };

  // Jogos ativos filtrados pelo preset atual
  const presetGames = useMemo(() => {
    const filterFn = PRESETS[activePreset].filter;
    return INITIAL_GAMES.filter(filterFn);
  }, [activePreset]);

  // Estatísticas agregadas calculadas
  const stats = useMemo(() => {
    const totalHours = Math.round(presetGames.reduce((acc, g) => acc + g.hours_played, 0) * 10) / 10;
    const avgRating = presetGames.length > 0 ? Math.round((presetGames.reduce((acc, g) => acc + g.user_rating, 0) / presetGames.length) * 10) / 10 : 0;
    const totalValue = Math.round(presetGames.reduce((acc, g) => acc + g.current_price_brl, 0) * 100) / 100;
    const mostPlayed = presetGames.length > 0 ? [...presetGames].sort((a, b) => b.hours_played - a.hours_played)[0] : null;

    // Distribuição de gênero
    const genreMap: Record<string, number> = {};
    presetGames.forEach((g) => {
      const primary = g.genres[0] || 'Outros';
      genreMap[primary] = (genreMap[primary] || 0) + g.hours_played;
    });

    const sortedGenres = Object.fromEntries(
      Object.entries(genreMap).sort(([, a], [, b]) => b - a)
    );

    return {
      total_games: presetGames.length,
      total_hours: totalHours,
      avg_rating: avgRating,
      total_library_value_brl: totalValue,
      most_played_game: mostPlayed,
      genre_distribution: sortedGenres
    };
  }, [presetGames]);

  // Lista de jogos filtrada para a tabela
  const tableGames = useMemo(() => {
    let result = presetGames.filter((game) => {
      const matchesSearch =
        !searchTerm ||
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'Todos' || game.genres.includes(selectedGenre);
      return matchesSearch && matchesGenre;
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
  }, [presetGames, searchTerm, selectedGenre, sortBy, sortAsc]);

  // Top 6 jogos ordenados por horas
  const top6 = useMemo(() => {
    return [...presetGames].sort((a, b) => b.hours_played - a.hours_played).slice(0, 6);
  }, [presetGames]);

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
          label: 'Horas Registradas',
          data: top6.map((g) => g.hours_played),
          backgroundColor: bgColors,
          hoverBackgroundColor: hoverColors,
          borderColor: bgColors,
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    };
  }, [top6, colorMode]);

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

  // Tendência dos últimos 6 meses (Maio a Outubro 2026)
  const monthlyTrend = useMemo(() => {
    const months = ['Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro'];
    const shortMonths = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
    
    // Proporções ponderadas de sazonalidade (férias em julho, pico recente em outubro)
    const monthlyWeights = [0.105, 0.125, 0.205, 0.155, 0.175, 0.235];
    
    const monthlyTopGames = [
      top6[0]?.name || 'Counter-Strike 2',
      top6[1]?.name || 'Dota 2',
      top6[3]?.name || 'Elden Ring',
      top6[2]?.name || "Baldur's Gate 3",
      top6[4]?.name || 'Terraria',
      top6[0]?.name || 'Counter-Strike 2'
    ];

    const totalSemesterHours = stats.total_hours;
    const hours = monthlyWeights.map((w) => Math.round(totalSemesterHours * w * 10) / 10);
    
    let sum = 0;
    const cumulative = hours.map((h) => {
      sum += h;
      return Math.round(sum * 10) / 10;
    });

    const growthRate = hours[0] > 0 ? (((hours[hours.length - 1] - hours[0]) / hours[0]) * 100).toFixed(1) : '0';
    const semesterAverage = Math.round((hours.reduce((a, b) => a + b, 0) / hours.length) * 10) / 10;
    const peakIndex = hours.indexOf(Math.max(...hours));
    const peakMonth = months[peakIndex];
    const peakHours = hours[peakIndex];

    return {
      months,
      shortMonths,
      hours,
      cumulative,
      monthlyTopGames,
      growthRate,
      semesterAverage,
      peakMonth,
      peakHours,
      totalSemesterHours: Math.round(hours.reduce((a, b) => a + b, 0) * 10) / 10
    };
  }, [stats.total_hours, top6]);

  // Dados do gráfico de linha
  const lineChartData = useMemo(() => {
    return {
      labels: monthlyTrend.months.map((m) => `${m}/26`),
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
            top_games: presetGames.slice(0, 5)
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
    'main.py': `# Dashboard de Análise de Biblioteca e Mercado de Jogos (Steam API & Dados)
# Back-end em Python com FastAPI e Cores Distintas por Jogo e Nicho

# Cada jogo possui sua cor temática única e cada gênero/nicho possui sua cor identificadora!
GENRE_COLORS = {
    "Ação": "#ef4444",       # Vermelho
    "RPG": "#a855f7",        # Púrpura
    "Estratégia": "#f59e0b", # Dourado Âmbar
    "Indie": "#10b981",      # Verde Esmeralda
    "Simulação": "#06b6d4",  # Ciano
    "Aventura": "#3b82f6"    # Azul
}

GAMES_DATABASE = {
    "730": { "name": "Counter-Strike 2", "color": "#f97316", "genres": ["Ação", "Tiro"], ... },
    "570": { "name": "Dota 2", "color": "#dc2626", "genres": ["Estratégia", "MOBA"], ... },
    "1086940": { "name": "Baldur's Gate 3", "color": "#a855f7", "genres": ["RPG"], ... },
    "1245620": { "name": "Elden Ring", "color": "#eab308", "genres": ["RPG", "Soulslike"], ... },
    ...
}`,
    'templates/index.html': `<!-- templates/index.html com Cores Distintas para cada Jogo e Nicho -->
<script>
    // Cores específicas por Jogo e por Gênero para evitar monotonia visual:
    const GAME_COLORS = {
        '730': '#f97316',      // CS2 (Laranja)
        '570': '#dc2626',      // Dota 2 (Vermelho)
        '1086940': '#a855f7',  // Baldur's Gate 3 (Púrpura)
        '1245620': '#eab308',  // Elden Ring (Dourado)
        '105600': '#22c55e',   // Terraria (Verde)
        '292030': '#f43f5e'    // The Witcher 3 (Carmesim)
    };
    const GENRE_COLORS = {
        'Ação': '#ef4444',
        'RPG': '#a855f7',
        'Estratégia': '#f59e0b',
        'Indie': '#10b981'
    };
</script>`,
    'requirements.txt': `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
jinja2>=3.1.3
requests>=2.31.0`,
    'README.md': `# Steam Analytics Dashboard - Cores por Jogo e Nicho

- Paleta cromática distinta para cada jogo no Gráfico de Barras.
- Paleta semântica por nicho de gênero (Ação: Vermelho, RPG: Púrpura, Estratégia: Âmbar, Indie: Verde) no Gráfico de Rosca.`,
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
    <div className="min-h-screen bg-[#0e141b] text-slate-100 flex flex-col font-sans">
      {/* TOP HEADER STEAM NAVIGATION */}
      <header className="bg-[#171a21] border-b border-[#2a475e] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#1b2838] to-[#2a475e] border border-[#66c0f4]/50 flex items-center justify-center text-[#66c0f4] shadow-inner shadow-[#66c0f4]/20">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-base sm:text-lg tracking-tight whitespace-nowrap flex items-center">
                Game<span className="text-[#66c0f4]">Lens</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold whitespace-nowrap">
                Portal & Analytics Gamer
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links Públicos */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-[#66c0f4] transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'text-[#66c0f4] font-bold' : ''
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`hover:text-[#66c0f4] transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'deals' ? 'text-[#66c0f4] font-bold' : ''
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Radar de Ofertas</span>
              <span className="text-[10px] bg-red-600/90 text-white font-extrabold px-1.5 py-0.2 rounded font-mono">-75%</span>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`hover:text-[#66c0f4] transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'search' ? 'text-[#66c0f4] font-bold' : ''
              }`}
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Buscar Qualquer Jogo</span>
            </button>
            <button
              onClick={() => setActiveTab('platforms')}
              className={`hover:text-[#66c0f4] transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'platforms' ? 'text-[#66c0f4] font-bold' : ''
              }`}
            >
              <Tv className="w-4 h-4 text-purple-400" />
              <span>Consoles & PC</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`hover:text-[#66c0f4] transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'reviews' ? 'text-[#66c0f4] font-bold' : ''
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Críticas & Análises</span>
            </button>
          </nav>

          {/* Zone 3: Ação Pública (Apoio via Pix) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsPixModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 shadow-sm"
              title="Apoiar este projeto com Pix direto"
            >
              <Coffee className="w-3.5 h-3.5 text-emerald-400" />
              <span>Apoiar via Pix</span>
            </button>
          </div>

        </div>
      </header>

      {/* SUB-BAR / PRESET & NICHOS BAR */}
      <div className="bg-[#121c27] border-b border-[#2a475e]/60 py-2.5 px-4 sm:px-8">
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
          </div>

        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* TAB 1: DASHBOARD INTERATIVO */}
        {activeTab === 'dashboard' && (
          <div>
            
            {/* Header intro & Quick Filters */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Estatísticas da Biblioteca Steam
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Métricas em tempo real com cromatografia distinta por jogo e por nicho de mercado.
                </p>
              </div>

              {/* Genre Filter Buttons with custom colored indicators */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
                {['Todos', 'RPG', 'Ação', 'Estratégia', 'Indie', 'Soulslike'].map((genre) => {
                  const isSelected = selectedGenre === genre;
                  const genreColor = GENRE_COLORS[genre]?.bg;

                  return (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre((prev) => (genre !== 'Todos' && prev === genre ? 'Todos' : genre))}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#66c0f4] text-[#101822] font-semibold shadow-sm'
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

            {/* 3 CARDS DE MÉTRICAS EM DESTAQUE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Card 1: Total de Horas */}
              <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 relative overflow-hidden transition hover:border-[#66c0f4] shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>TEMPO TOTAL REGISTRADO</span>
                  <div className="p-2 rounded-lg bg-[#171a21] text-[#66c0f4]">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white font-mono tabular-nums">
                  {stats.total_hours.toLocaleString('pt-BR')}{' '}
                  <span className="text-lg font-normal text-slate-400 font-sans">horas</span>
                </div>
                <div className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                  <span>Em <strong className="text-white font-mono">{stats.total_games}</strong> jogos na biblioteca</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400">R$ {stats.total_library_value_brl.toFixed(2)} estimado</span>
                </div>
              </div>

              {/* Card 2: Jogo Mais Jogado (com cor tema do jogo!) */}
              <div
                onClick={() => stats.most_played_game && setSelectedGameId(stats.most_played_game.id)}
                className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 relative overflow-hidden transition hover:border-[#66c0f4] cursor-pointer shadow-md group"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>JOGO MAIS JOGADO</span>
                  <div
                    className="p-2 rounded-lg bg-[#171a21] group-hover:scale-110 transition-transform"
                    style={{ color: stats.most_played_game?.color || '#f59e0b' }}
                  >
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white truncate flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: stats.most_played_game?.color || '#f97316' }}
                  ></span>
                  <span className="truncate">{stats.most_played_game?.name || 'Nenhum'}</span>
                </div>
                <div className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                  <span
                    className="font-mono font-bold"
                    style={{ color: stats.most_played_game?.color || '#66c0f4' }}
                  >
                    {stats.most_played_game?.hours_played}h jogadas
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300">
                    {stats.most_played_game?.rating_label || 'Muito Positivas'}
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

            {/* GRÁFICO DE LINHA: TENDÊNCIA E CRESCIMENTO DOS ÚLTIMOS 6 MESES */}
            <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 mb-8 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#66c0f4]" />
                      <span>Evolução de Horas Jogadas (Últimos 6 Meses)</span>
                    </h2>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <span>↑</span>
                      <span>+{monthlyTrend.growthRate}% de crescimento</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Comparativo mensal de dedicação à biblioteca e aceleração de atividade no período recente.
                  </p>
                </div>

                {/* Badges de Métricas do Semestre */}
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
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total no Semestre</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">{monthlyTrend.totalSemesterHours}h</span>
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
                              
                              const gamesInGenre = presetGames.filter(g => g.genres.includes(genre));
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
              
              {/* Barra superior de busca e ordenação */}
              <div className="p-5 border-b border-[#2a475e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                <span>Exibindo {tableGames.length} de {presetGames.length} jogos</span>
                <span className="font-mono">Fonte: Steam Web & Dados Simulados</span>
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
              {DEALS_DATABASE
                .filter((d) => dealsPlatform === 'all' || d.platform.toLowerCase() === dealsPlatform.toLowerCase())
                .map((d) => {
                  let buyUrl = d.deal_url;
                  if (d.store === 'Hype Games') {
                    const sid = monetizationSettings.rakutenSid || '4770537';
                    const mid = monetizationSettings.hypeMid || '53304';
                    buyUrl = `https://click.linksynergy.com/deeplink?id=${sid}&mid=${mid}&murl=${encodeURIComponent(`https://hype.games/br/search?q=${encodeURIComponent(d.name)}`)}`;
                  } else if (d.store === 'Nuuvem') {
                    buyUrl = `https://www.nuuvem.com/item/${d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}?partner=${encodeURIComponent(monetizationSettings.nuuvemPartnerId)}`;
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
                  <input
                    type="text"
                    value={universalSearchQuery}
                    onChange={(e) => setUniversalSearchQuery(e.target.value)}
                    placeholder="Digite o nome do jogo (ex: GTA, God of War, Forza, Resident Evil, FIFA)..."
                    className="w-full bg-[#101822] border-2 border-[#2a475e] text-white text-sm rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:border-[#66c0f4] transition shadow-inner placeholder-slate-400"
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
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
                <span>{universalSearchResults.length} título(s) disponíveis</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {universalSearchResults
                  .filter((item) => !universalSearchQuery || item.name.toLowerCase().includes(universalSearchQuery.toLowerCase()))
                  .map((item) => {
                    const sid = monetizationSettings.rakutenSid || '4770537';
                    const mid = monetizationSettings.hypeMid || '53304';
                    const hypeUrl = `https://click.linksynergy.com/deeplink?id=${sid}&mid=${mid}&murl=${encodeURIComponent(`https://hype.games/br/search?q=${encodeURIComponent(item.name)}`)}`;
                    const nuuvemUrl = `https://www.nuuvem.com/item/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}?partner=${encodeURIComponent(monetizationSettings.nuuvemPartnerId)}`;

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
                              href={`https://store.steampowered.com/app/${item.id}`}
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
                    const sid = monetizationSettings.rakutenSid || '4770537';
                    const mid = monetizationSettings.hypeMid || '53304';
                    let directBuyUrl = game.store_url || 'https://www.nuuvem.com';
                    if (game.store === 'Hype Games') {
                      directBuyUrl = `https://click.linksynergy.com/deeplink?id=${sid}&mid=${mid}&murl=${encodeURIComponent(`https://hype.games/br/search?q=${encodeURIComponent(game.name)}`)}`;
                    } else if (game.store === 'Nuuvem') {
                      directBuyUrl = `https://www.nuuvem.com/item/${game.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}?partner=${encodeURIComponent(monetizationSettings.nuuvemPartnerId)}`;
                    } else if (game.store === 'Amazon') {
                      directBuyUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(game.name + ' jogo')}&tag=${encodeURIComponent(monetizationSettings.amazonAssociateId)}`;
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
            games={INITIAL_GAMES}
            reviews={reviews}
            selectedGameId={selectedReviewGameId}
            onSelectGame={(id) => setSelectedReviewGameId(id)}
            onTriggerAiReview={handleTriggerAiReview}
            isGeneratingAi={isGeneratingAiReview}
            monetizationSettings={monetizationSettings}
            onOpenPixModal={() => setIsPixModalOpen(true)}
          />
        )}

        {/* TAB 3: CENTRAL DE MONETIZAÇÃO, AFILIADOS & PIX */}
        {activeTab === 'monetization' && (
          <MonetizationHubView
            games={INITIAL_GAMES}
            settings={monetizationSettings}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenPixModal={() => setIsPixModalOpen(true)}
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
                src={modalGame.image}
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
                      <span className="text-[10px] text-slate-400 block">Sistema Operacional</span>
                      <strong className="text-slate-200 font-mono text-[11px] truncate block">{modalGame.specs.os}</strong>
                    </div>
                    <div className="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]/60">
                      <span className="text-[10px] text-slate-400 block">Processador (CPU)</span>
                      <strong className="text-slate-200 font-mono text-[11px] truncate block">{modalGame.specs.processor}</strong>
                    </div>
                    <div className="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]/60">
                      <span className="text-[10px] text-slate-400 block">Memória RAM</span>
                      <strong className="text-slate-200 font-mono text-[11px] truncate block">{modalGame.specs.memory}</strong>
                    </div>
                    <div className="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]/60">
                      <span className="text-[10px] text-slate-400 block">Placa de Vídeo (GPU)</span>
                      <strong className="text-slate-200 font-mono text-[11px] truncate block">{modalGame.specs.graphics}</strong>
                    </div>
                    <div className="bg-[#101822] p-2.5 rounded-lg border border-[#2a475e]/60 sm:col-span-2 lg:col-span-2">
                      <span className="text-[10px] text-slate-400 block">Armazenamento Livre</span>
                      <strong className="text-emerald-400 font-mono text-[11px] truncate block">{modalGame.specs.storage}</strong>
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
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">MID 46796</span>
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
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">MID 53304</span>
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
            <div className="p-4 bg-[#171a21] border-t border-[#2a475e] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  if (modalGame.id) setSelectedReviewGameId(modalGame.id);
                  setModalGame(null);
                  setActiveTab('reviews');
                }}
                className="px-3.5 py-2 text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 rounded-lg transition flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ver Análise Editorial Completa</span>
              </button>

              <button
                onClick={() => setModalGame(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#1b2838] hover:bg-[#233446] rounded-lg border border-[#2a475e] transition"
              >
                Fechar Ficha
              </button>
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
