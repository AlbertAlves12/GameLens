/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Save, Settings, DollarSign, ShieldCheck, Check, HelpCircle, ExternalLink } from 'lucide-react';
import { MonetizationSettings } from '../monetizationData.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MonetizationSettings;
  onSave: (newSettings: MonetizationSettings) => void;
}

export const MonetizationSettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [formData, setFormData] = useState<MonetizationSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#1b2838] border border-[#2a475e] rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#66c0f4]/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#233446] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-5 border-b border-[#2a475e] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#171a21] border border-[#66c0f4]/40 flex items-center justify-center text-[#66c0f4]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Configuração de Afiliados & Pix</span>
            </h3>
            <p className="text-xs text-slate-400">
              Personalize suas credenciais para que todos os links do site gerem comissões diretamente para você.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SEÇÃO 1: DOAÇÃO PIX */}
          <div className="bg-[#171a21] p-4 rounded-xl border border-[#2a475e]">
            <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <DollarSign className="w-4 h-4" />
              <span>Recebimento Direto via Pix</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Sua Chave Pix:
                </label>
                <input
                  type="text"
                  value={formData.pixKey}
                  onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                  placeholder="Seu e-mail, CPF, celular ou aleatória"
                  className="w-full bg-[#101822] border border-[#2a475e] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Ex: albertalves1205@gmail.com</span>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Nome do Titular da Conta:
                </label>
                <input
                  type="text"
                  value={formData.pixReceiverName}
                  onChange={(e) => setFormData({ ...formData, pixReceiverName: e.target.value })}
                  placeholder="Nome exibido no comprovante"
                  className="w-full bg-[#101822] border border-[#2a475e] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Para confirmação do leitor</span>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: PROGRAMAS DE AFILIADOS */}
          <div className="bg-[#171a21] p-4 rounded-xl border border-[#2a475e]">
            <div className="flex items-center justify-between mb-3 text-[#66c0f4] font-bold text-xs uppercase tracking-wider">
              <span>Tags de Afiliado (Lojas de Jogos)</span>
              <span className="text-[10px] font-normal text-slate-400 lowercase">injetadas automaticamente nos botões</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">Nuuvem (Tag de Parceiro):</span>
                  <a href="https://www.nuuvem.com" target="_blank" rel="noreferrer" className="text-[11px] text-[#66c0f4] hover:underline flex items-center gap-1">
                    <span>Criar conta Nuuvem</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="text"
                  value={formData.nuuvemPartnerId}
                  onChange={(e) => setFormData({ ...formData, nuuvemPartnerId: e.target.value })}
                  placeholder="ex: albertgamer ou seu código Awin"
                  className="w-full bg-[#101822] border border-[#2a475e] focus:border-[#66c0f4] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">Amazon Associados (Tag de Rastreamento):</span>
                  <a href="https://associados.amazon.com.br" target="_blank" rel="noreferrer" className="text-[11px] text-[#66c0f4] hover:underline flex items-center gap-1">
                    <span>Criar conta Amazon</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="text"
                  value={formData.amazonAssociateId}
                  onChange={(e) => setFormData({ ...formData, amazonAssociateId: e.target.value })}
                  placeholder="ex: albertgames-20"
                  className="w-full bg-[#101822] border border-[#2a475e] focus:border-[#66c0f4] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">Green Man Gaming (Affiliate ID / Tap Tag):</span>
                  <span className="text-[10px] text-slate-400">Opcional para público internacional</span>
                </div>
                <input
                  type="text"
                  value={formData.gmgAffiliateId}
                  onChange={(e) => setFormData({ ...formData, gmgAffiliateId: e.target.value })}
                  placeholder="ex: albertgmg"
                  className="w-full bg-[#101822] border border-[#2a475e] focus:border-[#66c0f4] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: IDENTIDADE EDITORIAL & ADSENSE */}
          <div className="bg-[#171a21] p-4 rounded-xl border border-[#2a475e]">
            <div className="flex items-center gap-2 mb-3 text-purple-400 font-bold text-xs uppercase tracking-wider">
              <span>Identidade Editorial & Google AdSense</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Nome da Revista / Redação:
                </label>
                <input
                  type="text"
                  value={formData.editorialName}
                  onChange={(e) => setFormData({ ...formData, editorialName: e.target.value })}
                  placeholder="ex: Steam Lens Editorial"
                  className="w-full bg-[#101822] border border-[#2a475e] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Publisher ID AdSense:
                </label>
                <input
                  type="text"
                  value={formData.adsensePublisherId}
                  onChange={(e) => setFormData({ ...formData, adsensePublisherId: e.target.value })}
                  placeholder="ca-pub-XXXXXXXXXXXXX"
                  className="w-full bg-[#101822] border border-[#2a475e] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Dica de Segurança */}
          <div className="p-3 bg-blue-950/30 border border-blue-500/20 rounded-xl flex items-start gap-2.5 text-xs text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Suas configurações ficam salvas no navegador (armazenamento local) e injetam suas tags em todos os links de afiliados e botões de compra do site de forma 100% automatizada.
            </p>
          </div>

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2a475e]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#171a21] rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-[#101822] bg-[#66c0f4] hover:bg-[#38bdf8] rounded-lg transition flex items-center gap-1.5 shadow-md"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Configurações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
