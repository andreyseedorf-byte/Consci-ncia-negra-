import React from 'react';
import { audioService } from '../services/audioService';
import { Star, Award, ArrowRight, RotateCcw, Share2, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  phaseId: number;
  phaseTitle: string;
  score: number;
  stars: number;
  buziosEarned: number;
  isAllPhasesComplete?: boolean;
  onNextPhase: () => void;
  onBackToMap: () => void;
  onReplayPhase: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  phaseId,
  phaseTitle,
  score,
  stars,
  buziosEarned,
  isAllPhasesComplete = false,
  onNextPhase,
  onBackToMap,
  onReplayPhase,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 text-center space-y-6">
        {/* Glow backdrop */}
        <div className="w-24 h-24 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/30 animate-pulse">
          {isAllPhasesComplete ? '🏆' : '✨'}
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 block mb-1">
            {isAllPhasesComplete ? 'Consagração Suprema da Liberdade' : `Fase ${phaseId} Concluída!`}
          </span>
          <h2 className="text-2xl font-bold text-stone-100 font-display">
            {isAllPhasesComplete
              ? 'Guardião Eterno da História & Liberdade'
              : phaseTitle}
          </h2>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-8 h-8 transition-all ${
                starIdx <= stars
                  ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-md'
                  : 'text-stone-700'
              }`}
            />
          ))}
        </div>

        {/* Stats breakdown */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-stone-950 border border-stone-800 rounded-2xl">
          <div className="text-center">
            <span className="text-[11px] font-mono text-stone-400 block uppercase">
              Pontuação da Fase
            </span>
            <span className="text-xl font-bold text-amber-400 font-mono">
              +{score}
            </span>
          </div>
          <div className="text-center">
            <span className="text-[11px] font-mono text-stone-400 block uppercase">
              Búzios Coletados
            </span>
            <span className="text-xl font-bold text-emerald-400 font-mono">
              +{buziosEarned} 🐚
            </span>
          </div>
        </div>

        {/* Educational congratulation note */}
        <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-200/90 leading-relaxed text-left">
          <strong className="text-amber-300 font-mono uppercase block mb-1">
            {isAllPhasesComplete ? 'Certificado de Consciência e Honra:' : 'Sabedoria Ancestral Incorporada:'}
          </strong>
          {isAllPhasesComplete
            ? 'Você percorreu toda a trajetória de resistência, honrou os reinos africanos, os heróis de Palmares, a abolição e a cultura vibrante. Você agora é um embaixador do respeito e da igualdade racial!'
            : 'Cada pergunta respondida e cada enigma desvendado fortalece a memória coletiva e o orgulho das raízes do povo brasileiro.'}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {phaseId < 5 && (
            <button
              onClick={() => {
                audioService.playBuzioChime();
                onNextPhase();
              }}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <span>PRÓXIMA FASE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onBackToMap();
            }}
            className="w-full sm:w-auto px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Mapa de Fases
          </button>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onReplayPhase();
            }}
            className="w-full sm:w-auto p-3 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-stone-400 hover:text-stone-200 rounded-xl transition cursor-pointer"
            title="Jogar Esta Fase Novamente"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
