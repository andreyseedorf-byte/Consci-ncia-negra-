import React, { useState } from 'react';
import { Relic } from '../types/game';
import { audioService } from '../services/audioService';
import { Sparkles, CheckCircle2, RotateCcw, Award } from 'lucide-react';

interface RelicHuntGameProps {
  relics: Relic[];
  onComplete: (score: number, buzios: number) => void;
  onExit: () => void;
  characterTraitBonus?: boolean;
}

export const RelicHuntGame: React.FC<RelicHuntGameProps> = ({
  relics,
  onComplete,
  onExit,
  characterTraitBonus = false,
}) => {
  const [discoveredRelics, setDiscoveredRelics] = useState<string[]>([]);
  const [selectedRelic, setSelectedRelic] = useState<Relic | null>(null);
  const [restorationStep, setRestorationStep] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [buzios, setBuzios] = useState<number>(0);

  const handleInspectRelic = (relic: Relic) => {
    setSelectedRelic(relic);
    setRestorationStep(0);
    audioService.playDialogueBlip();
  };

  const handleRestoreRelic = () => {
    if (!selectedRelic) return;
    audioService.playCorrect();
    audioService.playBuzioChime();

    const bonusMultiplier = characterTraitBonus ? 1.25 : 1;
    const pts = Math.round(150 * bonusMultiplier);
    const buz = Math.round(20 * bonusMultiplier);

    setScore((prev) => prev + pts);
    setBuzios((prev) => prev + buz);
    setDiscoveredRelics((prev) => [...prev, selectedRelic.id]);
    setRestorationStep(1);
  };

  const allDiscovered = relics.every((r) => discoveredRelics.includes(r.id));

  const handleFinish = () => {
    onComplete(score, buzios);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-amber-300 font-display flex items-center gap-2">
            <span>🏛️</span> Caça aos Artefatos Sagrados da África Antiga
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Examine e restaure relíquias dos reinos de Mali, Benin e tradição Griot
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1 bg-amber-950/80 border border-amber-800/80 rounded text-amber-300">
            PONTOS: <span className="font-bold text-amber-400">{score}</span>
          </div>
          <div className="px-3 py-1 bg-stone-800 rounded text-stone-300">
            {discoveredRelics.length}/{relics.length} RESTAURADOS
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {relics.map((relic) => {
          const isDone = discoveredRelics.includes(relic.id);
          const isSelected = selectedRelic?.id === relic.id;

          return (
            <div
              key={relic.id}
              onClick={() => handleInspectRelic(relic)}
              className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col items-center text-center relative ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500/60 shadow-lg'
                  : isDone
                  ? 'bg-stone-800/50 border-emerald-500/40 text-stone-300'
                  : 'bg-stone-950/60 hover:bg-stone-800/60 border-stone-800 text-stone-300'
              }`}
            >
              {isDone && (
                <div className="absolute top-3 right-3 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              <span className="text-4xl mb-2">{relic.icon}</span>
              <h4 className="text-sm font-bold text-stone-100 font-display mb-1">
                {relic.name}
              </h4>
              <span className="text-[11px] font-mono text-amber-400/90 mb-2">
                {relic.origin} · {relic.period}
              </span>
              <p className="text-xs text-stone-400 line-clamp-2">
                {relic.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Relic Inspection & Restoration detail block */}
      {selectedRelic && (
        <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl mb-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedRelic.icon}</span>
              <div>
                <h4 className="text-lg font-bold text-amber-300 font-display">
                  {selectedRelic.name}
                </h4>
                <p className="text-xs text-stone-400 font-mono">
                  {selectedRelic.origin} ({selectedRelic.period})
                </p>
              </div>
            </div>

            {discoveredRelics.includes(selectedRelic.id) ? (
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Relíquia Preservada no Museu
              </span>
            ) : (
              <button
                onClick={handleRestoreRelic}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Examinar e Restaurar Sabedoria
              </button>
            )}
          </div>

          <p className="text-sm text-stone-300 leading-relaxed">
            {selectedRelic.description}
          </p>

          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-200/90 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-mono uppercase block mb-0.5">
                Importância Histórica:
              </strong>
              {selectedRelic.historicalSignificance}
            </div>
          </div>
        </div>
      )}

      {/* Footer action */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-800">
        <button
          onClick={onExit}
          className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition"
        >
          Voltar
        </button>

        {allDiscovered && (
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            CONCLUIR CAÇA E RECEBER RECOMPENSAS
          </button>
        )}
      </div>
    </div>
  );
};
