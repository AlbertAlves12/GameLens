/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DollarSign,
  Coffee,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Settings,
  Sparkles,
  Check,
  Copy,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Tag
} from 'lucide-react';
import {
  MonetizationSettings,
  AFFILIATE_PROGRAMS_GUIDE,
  getAffiliateUrls
} from '../monetizationData.ts';

interface MonetizationHubViewProps {
  games: any[];
  settings: MonetizationSettings;
  onOpenSettings: () => void;
  onOpenPixModal: () => void;
  theme?: 'dark' | 'light';
}

export const MonetizationHubView: React.FC<MonetizationHubViewProps> = ({
  games,
  settings,
  onOpenSettings,
  onOpenPixModal,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const bgCard = isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-[#1b2838] border-[#2a475e] text-white';
  const bgSubcard = isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#171a21] border-[#2a475e] text-white';
  const textMuted = isLight ? 'text-slate-600' : 'text-slate-400';
  const headingColor = isLight ? 'text-slate-900' : 'text-white';
  const [visitorsMonthly, setVisitorsMonthly] = useState<number>(3000);
  const [testGameId, setTestGameId] = useState<string>(games[0]?.id || '1086940');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Estimativas do simulador
  // Conversão média de e-commerce gamer: ~1.2% compram jogos, ticket médio R$ 90, comissão 8%
  const affiliateEstimatedSales = Math.round(visitorsMonthly * 0.012);
  const affiliateRevenue = Math.round(affiliateEstimatedSales * 90 * 0.08);

  // Doações Pix: ~0.3% dos visitantes doam uma média de R$ 12
  const pixDonors = Math.max(1, Math.round(visitorsMonthly * 0.003));
  const pixRevenue = Math.round(pixDonors * 12);

  // AdSense: CPM médio gamer Brasil ~ R$ 6,50 por 1.000 visualizações (2 pageviews por visitante)
  const pageviews = visitorsMonthly * 2.2;
  const adsenseRevenue = Math.round((pageviews / 1000) * 6.5);

  const totalMonthlyEstimate = affiliateRevenue + pixRevenue + adsenseRevenue;

  const testGame = games.find((g) => g.id === testGameId) || games[0];
  const testUrls = getAffiliateUrls(testGame, settings);

  const handleCopyLink = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(key);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HERO BANNER DO HUB DE MONETIZAÇÃO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171a21] via-[#1b2838] to-[#121c27] border border-[#2a475e] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Central de Geração de Renda & Afiliados</span>
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Como automatizar e lucrar com seu portal de games
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Estratégia de Monetização 100% Automatizada
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Entenda como obter seus links de parceiro, configurar sua chave Pix e deixar o agente de IA e a plataforma trabalhando para você dia e noite.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={onOpenSettings}
              className="px-4 py-2.5 rounded-xl bg-[#66c0f4] hover:bg-[#38bdf8] text-[#101822] font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-[#66c0f4]/20"
            >
              <Settings className="w-4 h-4" />
              <span>Configurar Meus IDs & Pix</span>
            </button>
            <button
              onClick={onOpenPixModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition flex items-center gap-2"
            >
              <Coffee className="w-4 h-4 text-emerald-400" />
              <span>Testar Modal Pix</span>
            </button>
          </div>
        </div>
      </div>

      {/* OS 3 PILARES DA MONETIZAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
            <Tag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">1. Afiliados de Jogos (Nuuvem & Amazon)</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Você não precisa vender estoque próprio. Quando um visitante clica em qualquer botão de compra do seu site e adquire uma chave para ativar na Steam, a loja parceira deposita de <strong>5% a 12% de comissão</strong> direto na sua conta bancária.
          </p>
          <div className="mt-4 pt-3 border-t border-[#2a475e]/60 text-[11px] text-cyan-300 font-semibold">
            Tag atual: {settings.nuuvemPartnerId}
          </div>
        </div>

        <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <Coffee className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">2. Doações Diretas via Pix</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Muitos leitores que consultam horas de jogos e leem análises de alta qualidade gostam de apoiar criadores independentes. O botão de Pix gera QR Code e chave copia-e-cola sem taxa de plataforma: <strong>100% do valor vai para o seu bolso</strong>.
          </p>
          <div className="mt-4 pt-3 border-t border-[#2a475e]/60 text-[11px] text-emerald-300 font-semibold">
            Chave atual: {settings.pixKey}
          </div>
        </div>

        <div className="bg-[#1b2838] border border-[#2a475e] rounded-xl p-6 relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">3. O Agente de IA Trabalhando</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Em vez de gastar 5 horas escrevendo cada texto, o agente analisa a telemetria do jogo (horas registradas, aprovação, preço e público) e redige resenhas persuasivas com SEO otimizado para o Google, atraindo visitantes de graça.
          </p>
          <div className="mt-4 pt-3 border-t border-[#2a475e]/60 text-[11px] text-purple-300 font-semibold">
            Redação: {settings.editorialName}
          </div>
        </div>

      </div>

      {/* SIMULADOR INTERATIVO DE RECEITA ESTIMADA */}
      <div className="bg-[#1b2838] border border-[#2a475e] rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Simulador Interativo de Receita Mensal</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Arraste a barra para estimar ganhos combinados de Afiliados, Pix e Anúncios com base no tráfego.
            </p>
          </div>

          <div className="bg-[#171a21] border border-[#2a475e] px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimativa Mensal Combinada</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              R$ {totalMonthlyEstimate.toLocaleString('pt-BR')} / mês
            </span>
          </div>
        </div>

        {/* Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span>Volume de Visitantes Mensais no Site:</span>
            <span className="font-mono text-base text-[#66c0f4]">{visitorsMonthly.toLocaleString('pt-BR')} acessos/mês</span>
          </div>
          <input
            type="range"
            min="500"
            max="30000"
            step="500"
            value={visitorsMonthly}
            onChange={(e) => setVisitorsMonthly(Number(e.target.value))}
            className="w-full accent-[#66c0f4] cursor-pointer h-2 bg-[#171a21] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>500 (Início)</span>
            <span>5.000 (Comunidade Ativa)</span>
            <span>15.000 (Portal Médio)</span>
            <span>30.000+ (Mídia Consolidada)</span>
          </div>
        </div>

        {/* Breakdown de Fontes de Lucro */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#171a21] p-4 rounded-xl border border-[#2a475e]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Comissões de Afiliado (Nuuvem/Amazon)
            </span>
            <span className="text-xl font-bold text-white font-mono block">
              R$ {affiliateRevenue.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              ~{affiliateEstimatedSales} vendas/mês com ticket médio de R$ 90 (comissão 8%)
            </span>
          </div>

          <div className="bg-[#171a21] p-4 rounded-xl border border-[#2a475e]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Doações Espontâneas no Pix
            </span>
            <span className="text-xl font-bold text-white font-mono block">
              R$ {pixRevenue.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              ~{pixDonors} apoiadores por mês com média de R$ 12 doados
            </span>
          </div>

          <div className="bg-[#171a21] p-4 rounded-xl border border-[#2a475e]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
              Google AdSense (Visualizações)
            </span>
            <span className="text-xl font-bold text-white font-mono block">
              R$ {adsenseRevenue.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              ~{Math.round(pageviews).toLocaleString('pt-BR')} impressões de banners (CPM ~R$ 6,50)
            </span>
          </div>
        </div>

      </div>

      {/* GUIA PASSO A PASSO DOS PROGRAMAS DE AFILIADOS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">Como Se Cadastrar nos Programas (Guia Definitivo)</h2>
          <p className="text-xs text-slate-400 mt-1">
            Siga os passos de cada plataforma para obter suas tags e começar a receber pagamentos em conta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AFFILIATE_PROGRAMS_GUIDE.map((program, idx) => (
            <div
              key={idx}
              className="bg-[#1b2838] border border-[#2a475e] rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-base font-bold text-white">{program.name}</h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${program.badgeColor}`}>
                    {program.commission}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span>Pagamento: <strong className="text-white">{program.payoutMethod}</strong></span>
                  <span>·</span>
                  <span>Frequência: <strong className="text-white">{program.frequency}</strong></span>
                </div>

                <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed mb-6">
                  {program.steps.map((step, sIdx) => (
                    <li key={sIdx} className="pl-1">
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-4 border-t border-[#2a475e]/60 flex items-center justify-between">
                {program.url.startsWith('#') ? (
                  <button
                    onClick={onOpenSettings}
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Configurar Chave Pix Agora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <a
                    href={program.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#66c0f4] hover:underline flex items-center gap-1"
                  >
                    <span>Abrir Portal de Cadastro</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <span className="text-[11px] text-slate-400">Totalmente Gratuito</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTADOR DE LINKS DE AFILIADO AO VIVO */}
      <div className="bg-[#1b2838] border border-[#2a475e] rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Testador de Links Automáticos por Jogo</span>
            </h3>
            <p className="text-xs text-slate-400">
              Veja a URL exata que é gerada automaticamente quando o leitor clica no botão de compra.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Escolha o jogo:</span>
            <select
              value={testGameId}
              onChange={(e) => setTestGameId(e.target.value)}
              className="bg-[#171a21] border border-[#2a475e] text-xs text-white rounded-lg px-3 py-1.5 focus:border-[#66c0f4] outline-none"
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-[#171a21] p-3 rounded-xl border border-[#2a475e] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">Link Nuuvem (Chave Oficial Steam):</span>
              <span className="text-xs font-mono text-slate-300 break-all">{testUrls.nuuvem}</span>
            </div>
            <button
              onClick={() => handleCopyLink(testUrls.nuuvem, 'nuuvem')}
              className="px-3 py-1.5 rounded-lg text-xs bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#101822] text-white font-semibold transition shrink-0 flex items-center gap-1"
            >
              {copiedUrl === 'nuuvem' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl === 'nuuvem' ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          <div className="bg-[#171a21] p-3 rounded-xl border border-[#2a475e] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Link Amazon Associados (Busca & Jogos PC):</span>
              <span className="text-xs font-mono text-slate-300 break-all">{testUrls.amazon}</span>
            </div>
            <button
              onClick={() => handleCopyLink(testUrls.amazon, 'amazon')}
              className="px-3 py-1.5 rounded-lg text-xs bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#101822] text-white font-semibold transition shrink-0 flex items-center gap-1"
            >
              {copiedUrl === 'amazon' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl === 'amazon' ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
