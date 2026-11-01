/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Star,
  Award,
  Sparkles,
  ShoppingCart,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle2,
  Tag,
  Share2,
  ShieldCheck,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { GameReview, MonetizationSettings, getAffiliateUrls, generateProceduralAiReview, FALLBACK_GAME_COVER } from '../monetizationData.ts';

interface ReviewsViewProps {
  games: any[];
  reviews: Record<string, GameReview>;
  selectedGameId: string;
  onSelectGame: (id: string) => void;
  onTriggerAiReview: (gameId: string) => void;
  isGeneratingAi: boolean;
  monetizationSettings: MonetizationSettings;
  onOpenPixModal: () => void;
  theme?: 'dark' | 'light';
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  games,
  reviews,
  selectedGameId,
  onSelectGame,
  onTriggerAiReview,
  isGeneratingAi,
  monetizationSettings,
  onOpenPixModal,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const bgCard = isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-[#1b2838] border-[#2a475e] text-white';
  const bgSubcard = isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#171a21] border-[#2a475e] text-white';
  const textMuted = isLight ? 'text-slate-600' : 'text-slate-400';
  const headingColor = isLight ? 'text-slate-900' : 'text-white';
  const foundGame = games.find((g) => g.id === selectedGameId || g.name?.toLowerCase() === selectedGameId?.toLowerCase());
  const activeGame = foundGame || {
    id: selectedGameId,
    name: selectedGameId.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    color: '#66c0f4',
    hover_color: '#38bdf8',
    hours_played: 140,
    genres: ['Ação', 'RPG'],
    user_rating: 92,
    rating_label: 'Extremamente Positivas',
    peak_24h_players: 45000,
    current_price_brl: 99.99,
    price_formatted: 'R$ 99,99',
    discount_percent: 25,
    developer: 'Estúdio Desenvolvedor',
    release_year: 2024,
    achievements_unlocked: 30,
    total_achievements: 40,
    header_image: FALLBACK_GAME_COVER,
    short_description: 'Análise detalhada e dados editoriais completos para este título.'
  };
  const activeReview = reviews[selectedGameId] || generateProceduralAiReview(activeGame, monetizationSettings.editorialName || 'Redação');
  const affiliateUrls = getAffiliateUrls(activeGame, monetizationSettings);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HERO BANNER DA REVISTA EDITORIAL */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171a21] via-[#1b2838] to-[#121c27] border border-[#2a475e] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Revista & Análises Especializadas</span>
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Transparência editorial e links de compra recomendados
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Críticas de Jogos & Vereditos da Redação
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Análises detalhadas com notas de jogabilidade, narrativa e custo-benefício. Todo link de compra apoia diretamente a produção independente de conteúdo.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTriggerAiReview(activeGame.id)}
              disabled={isGeneratingAi}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAi ? 'Agente IA Redigindo...' : 'Atualizar com Agente IA'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SELETOR DE JOGOS COM CARDS HORIZONTAIS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Selecione um Título para Ler a Crítica:
          </span>
          <span className="text-xs text-[#66c0f4]">
            {games.length} títulos analisados
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {games.slice(0, 6).map((game) => {
            const isSelected = game.id === activeGame.id;
            const review = reviews[game.id];
            const score = review ? review.score : (game.user_rating / 10).toFixed(1);

            return (
              <button
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                className={`p-3 rounded-xl text-left transition flex flex-col justify-between border relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[#1b2838] border-[#66c0f4] shadow-lg shadow-[#66c0f4]/10'
                    : 'bg-[#171a21] hover:bg-[#1b2838] border-[#2a475e]'
                }`}
              >
                <div
                  className="w-1.5 h-full absolute left-0 top-0 bottom-0"
                  style={{ backgroundColor: game.color }}
                ></div>
                <div className="pl-1">
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-emerald-400">
                      ★ {score}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[60px]">
                      {game.genres[0]}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white block line-clamp-1 group-hover:text-[#66c0f4] transition">
                    {game.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CORPO DA ANÁLISE EDITORIAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA PRINCIPAL: TEXTO DA CRÍTICA */}
        <div className="lg:col-span-2 space-y-6">
          <article className="bg-[#1b2838] border border-[#2a475e] rounded-2xl p-6 sm:p-8 shadow-md">
            
            {/* Header do Artigo */}
            <div className="border-b border-[#2a475e] pb-6 mb-6">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white font-mono shadow-sm"
                  style={{ backgroundColor: activeReview.badgeColor || '#a855f7' }}
                >
                  Selo {activeReview.badge}
                </span>
                <span className="text-xs text-slate-400">
                  Por {activeReview.author} · {activeReview.readTime}
                </span>
                <span className="text-xs text-slate-400">· {activeReview.updatedAt}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {activeReview.headline}
              </h2>

              <p className="text-base text-slate-300 font-medium mt-3 italic leading-relaxed border-l-2 border-[#66c0f4] pl-4">
                "{activeReview.verdictLead}"
              </p>
            </div>

            {/* Imagem de Capa do Jogo com Badges */}
            <div className="relative rounded-xl overflow-hidden mb-6 border border-[#2a475e] max-h-72">
              <img
                src={activeGame.header_image || activeGame.image || FALLBACK_GAME_COVER}
                alt={activeGame.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm font-semibold">
                  Desenvolvedora: {activeGame.developer} ({activeGame.release_year})
                </span>
                <span className="bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm text-emerald-400 font-mono font-bold">
                  {activeGame.user_rating}% de aprovação na Steam
                </span>
              </div>
            </div>

            {/* Texto Completo da Análise */}
            <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-normal">
              {activeReview.fullAnalysis.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* PRÓS E CONTRAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#2a475e]">
              <div className="bg-[#171a21]/80 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Pontos Fortes (Prós)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {activeReview.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#171a21]/80 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <ThumbsDown className="w-4 h-4" />
                  <span>Pontos a Considerar (Contras)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {activeReview.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"></span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Veredito Final */}
            <div className="mt-6 p-4 rounded-xl bg-[#171a21] border border-[#2a475e] flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Veredito da Redação:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {activeReview.bottomLine}
                </p>
              </div>
            </div>

            {/* Disclaimer Legal Obrigatório de Afiliados */}
            <div className="mt-6 pt-4 border-t border-[#2a475e]/60 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Transparência: Comprando através dos links parceiros abaixo, nosso portal pode receber uma comissão sem nenhum acréscimo no seu valor.
              </span>
            </div>

          </article>
        </div>

        {/* COLUNA LATERAL: BOX DE NOTAS & OFERTAS DE AFILIADO */}
        <div className="space-y-6">
          
          {/* CARD DE NOTA EDITORIAL */}
          <div className="bg-[#1b2838] border border-[#2a475e] rounded-2xl p-6 text-center shadow-md relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: activeReview.badgeColor || '#a855f7' }}
            ></div>

            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Nota da Redação
            </span>

            <div className="my-4 flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black text-white font-mono tracking-tight">
                {activeReview.score}
              </span>
              <span className="text-lg font-bold text-slate-400 font-mono">/ 10</span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-6 bg-[#171a21] border border-[#2a475e] text-[#66c0f4]">
              {activeReview.badge}
            </div>

            {/* Barras de Desempenho por Categoria */}
            <div className="space-y-3 text-left border-t border-[#2a475e] pt-5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Jogabilidade & Mecânicas</span>
                  <span className="font-mono text-emerald-400">{activeReview.scores.gameplay}/10</span>
                </div>
                <div className="w-full bg-[#101822] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activeReview.scores.gameplay * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Gráficos & Arte Visual</span>
                  <span className="font-mono text-[#66c0f4]">{activeReview.scores.graphics}/10</span>
                </div>
                <div className="w-full bg-[#101822] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#66c0f4] h-full rounded-full transition-all duration-500"
                    style={{ width: `${activeReview.scores.graphics * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Narrativa & Mundo</span>
                  <span className="font-mono text-purple-400">{activeReview.scores.narrative}/10</span>
                </div>
                <div className="w-full bg-[#101822] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activeReview.scores.narrative * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Rejogabilidade</span>
                  <span className="font-mono text-amber-400">{activeReview.scores.replayability}/10</span>
                </div>
                <div className="w-full bg-[#101822] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activeReview.scores.replayability * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Custo-Benefício (R$/Hora)</span>
                  <span className="font-mono text-pink-400">{activeReview.scores.valueForMoney}/10</span>
                </div>
                <div className="w-full bg-[#101822] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activeReview.scores.valueForMoney * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>

          </div>

          {/* BOX DE AFILIADOS / COMPRA RECOMENDADA */}
          <div className="bg-gradient-to-b from-[#1b2838] to-[#171a21] border-2 border-emerald-500/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Onde Comprar Mais Barato</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                Link de Parceiro
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              {activeGame.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ativação direta na sua conta Steam com garantia oficial.
            </p>

            <div className="space-y-2.5">
              {/* Botão Nuuvem */}
              <a
                href={affiliateUrls.nuuvem}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition flex items-center justify-between shadow-md"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Comprar na Nuuvem</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              {/* Botão Amazon */}
              <a
                href={affiliateUrls.amazon}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#233446] hover:bg-[#2a475e] text-white font-bold text-xs transition flex items-center justify-between border border-[#2a475e]"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Buscar Oferta na Amazon Games</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              {/* Botão Steam Direto */}
              <a
                href={affiliateUrls.steam}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-4 rounded-xl bg-[#171a21] hover:bg-[#1b2838] text-slate-300 hover:text-white font-medium text-xs transition flex items-center justify-between border border-[#2a475e]"
              >
                <span>Ver Preço na Loja Steam</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2a475e]/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sua tag ativa: <strong className="text-white font-mono">{monetizationSettings.nuuvemPartnerId}</strong></span>
              <button
                onClick={onOpenPixModal}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Prefere doar via Pix?
              </button>
            </div>
          </div>

          {/* BANNER NATIVO DO ADSENSE (Espaço reservado) */}
          <div className="p-4 rounded-xl bg-[#171a21]/60 border border-dashed border-[#2a475e] text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
              Espaço Reservado para Anúncio (Google AdSense 300x250)
            </span>
            <div className="h-32 bg-[#121c27] rounded-lg flex items-center justify-center text-xs text-slate-500 flex-col gap-1 p-3">
              <span className="font-semibold text-slate-400">Banner de Publicidade Automatizado</span>
              <span className="text-[11px]">ID do Publisher: {monetizationSettings.adsensePublisherId}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
