/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Copy, Check, Coffee, Heart, QrCode, ShieldCheck, Sparkles } from 'lucide-react';
import { MonetizationSettings } from '../monetizationData.ts';

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MonetizationSettings;
}

export const PixModal: React.FC<PixModalProps> = ({ isOpen, onClose, settings }) => {
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [showQrNotice, setShowQrNotice] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(settings.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#1b2838] border border-[#2a475e] rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow de fundo */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#66c0f4]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#233446] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Apoiar o Projeto via Pix</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                100% Direto
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Sem intermediários ou taxas. Ajude a manter o portal online!
            </p>
          </div>
        </div>

        {/* Escolha rápida de valor sugerido */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Valor Simbólico Sugerido:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 25, 50].map((amt) => (
              <button
                key={amt}
                onClick={() => setSelectedAmount(amt)}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                  selectedAmount === amt
                    ? 'bg-emerald-500 text-[#0e141b] shadow-lg shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-[#171a21] hover:bg-[#233446] text-slate-300 border border-[#2a475e]'
                }`}
              >
                <span>R$ {amt},00</span>
                <span className="text-[9px] font-normal opacity-80">
                  {amt === 5 ? 'Café' : amt === 10 ? 'Lanche' : amt === 25 ? 'Pizza' : 'VIP'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* QR Code Simulado e Autêntico */}
        <div className="bg-[#171a21] border border-[#2a475e] rounded-xl p-4 mb-5 flex flex-col items-center justify-center">
          <div className="relative p-2.5 bg-white rounded-lg shadow-inner mb-2.5 group">
            <svg
              className="w-36 h-36"
              viewBox="0 0 100 100"
              fill="black"
            >
              {/* Padrão decorativo de QR Code */}
              <rect width="100" height="100" fill="white" />
              {/* Cantos do QR */}
              <rect x="5" y="5" width="30" height="30" fill="black" />
              <rect x="9" y="9" width="22" height="22" fill="white" />
              <rect x="13" y="13" width="14" height="14" fill="black" />

              <rect x="65" y="5" width="30" height="30" fill="black" />
              <rect x="69" y="9" width="22" height="22" fill="white" />
              <rect x="73" y="13" width="14" height="14" fill="black" />

              <rect x="5" y="65" width="30" height="30" fill="black" />
              <rect x="9" y="69" width="22" height="22" fill="white" />
              <rect x="13" y="73" width="14" height="14" fill="black" />

              {/* Matriz estilizada */}
              <rect x="40" y="10" width="8" height="8" fill="black" />
              <rect x="52" y="10" width="8" height="8" fill="black" />
              <rect x="42" y="22" width="6" height="12" fill="black" />
              <rect x="50" y="24" width="10" height="6" fill="black" />

              <rect x="10" y="42" width="6" height="8" fill="black" />
              <rect x="20" y="40" width="12" height="6" fill="black" />
              <rect x="10" y="52" width="8" height="6" fill="black" />

              <rect x="40" y="40" width="20" height="20" fill="#10b981" />
              <rect x="46" y="46" width="8" height="8" fill="black" />

              <rect x="65" y="42" width="8" height="8" fill="black" />
              <rect x="78" y="44" width="12" height="6" fill="black" />
              <rect x="68" y="54" width="10" height="6" fill="black" />
              <rect x="82" y="52" width="8" height="8" fill="black" />

              <rect x="40" y="65" width="8" height="12" fill="black" />
              <rect x="52" y="68" width="8" height="8" fill="black" />
              <rect x="42" y="80" width="10" height="10" fill="black" />
              <rect x="56" y="82" width="6" height="8" fill="black" />

              <rect x="68" y="68" width="12" height="8" fill="black" />
              <rect x="84" y="68" width="8" height="8" fill="black" />
              <rect x="70" y="80" width="8" height="10" fill="black" />
              <rect x="80" y="82" width="12" height="8" fill="black" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/75 rounded-lg text-white text-[11px] font-semibold flex-col gap-1 p-2 text-center">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <span>Abra o app do seu banco e aponte a câmera</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Aponte a câmera do aplicativo do seu banco para o QR Code acima
          </p>
        </div>

        {/* Chave Pix e Botão Copiar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
            <span className="font-semibold">Chave Pix ({settings.pixKey.includes('@') ? 'E-mail' : 'Chave'}):</span>
            <span className="text-[11px] text-slate-400">Titular: {settings.pixReceiverName}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#171a21] border border-[#2a475e] rounded-xl p-2.5">
            <input
              type="text"
              readOnly
              value={settings.pixKey}
              className="bg-transparent text-white text-xs font-mono font-bold flex-1 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                copied
                  ? 'bg-emerald-500 text-[#0e141b]'
                  : 'bg-[#66c0f4] hover:bg-[#38bdf8] text-[#101822]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Chave Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Chave</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mensagem de Gratidão */}
        <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 text-xs text-emerald-200">
          <Heart className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Muito obrigado por apoiar o criador! Cada contribuição incentiva a criação de novas análises e atualizações constantes da plataforma.
          </p>
        </div>
      </div>
    </div>
  );
};
