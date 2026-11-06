import React, { useState } from 'react';
import { QuilomboPathNode } from '../types/game';
import { audioService } from '../services/audioService';
import { Shield, Compass, CheckCircle2, AlertTriangle, ArrowRight, Award } from 'lucide-react';

interface QuilomboTrailGameProps {
  nodes: QuilomboPathNode[];
  onComplete: (score: number, buzios: number) => void;
  onExit: () => void;
}

export const QuilomboTrailGame: React.FC<QuilomboTrailGameProps> = ({
  nodes,
  onComplete,
  onExit,
}) => {
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [buzios, setBuzios] = useState<number>(0);
  const [completedTrail, setCompletedTrail] = useState<boolean>(false);

  const currentNode = nodes[currentNodeIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOptionIndex !== null) return;
    setSelectedOptionIndex(idx);

    const opt = currentNode.options[idx];
    if (opt.isSafe) {
      audioService.playCorrect();
      audioService.playBuzioChime();
    } else {
      audioService.playWrong();
    }

    setScore((prev) => prev + opt.points);
    setBuzios((prev) => prev + opt.buzios);
  };

  const handleNextStep = () => {
    setSelectedOptionIndex(null);
    if (currentNodeIndex + 1 < nodes.length) {
      setCurrentNodeIndex((prev) => prev + 1);
    } else {
      setCompletedTrail(true);
      audioService.playVictory();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-amber-300 font-display flex items-center gap-2">
            <span>🌿</span> Trilha da Liberdade · Rumo à Serra da Barriga
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Tome decisões táticas para guiar irmãos fugitivos em segurança até o Quilombo dos Palmares
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1 bg-amber-950/80 border border-amber-800/80 rounded text-amber-300">
            PONTOS: <span className="font-bold text-amber-400">{score}</span>
          </div>
          <div className="px-3 py-1 bg-stone-800 rounded text-stone-300">
            ETAPA {currentNodeIndex + 1}/{nodes.length}
          </div>
        </div>
      </div>

      {!completedTrail ? (
        <div className="space-y-6">
          <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-3">
            <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              {currentNode.title}
            </span>
            <h4 className="text-lg font-bold text-stone-100 font-display">
              {currentNode.situation}
            </h4>
            <p className="text-sm text-stone-300 leading-relaxed">
              {currentNode.description}
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">
              Escolha a Estratégia de Navegação:
            </span>

            {currentNode.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              return (
                <div key={idx} className="space-y-2">
                  <button
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedOptionIndex !== null}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                      selectedOptionIndex === null
                        ? 'bg-stone-800/70 hover:bg-stone-800 border-stone-700/80 text-stone-200'
                        : isSelected
                        ? opt.isSafe
                          ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-100'
                          : 'bg-red-950/40 border-red-500/80 text-red-100'
                        : 'bg-stone-900/40 border-stone-800/60 text-stone-500 opacity-50'
                    }`}
                  >
                    <span className="text-sm font-medium">{opt.text}</span>
                    <span className="text-xs font-mono font-bold shrink-0 ml-4">
                      +{opt.points} pts
                    </span>
                  </button>

                  {/* Immediate historical feedback */}
                  {isSelected && (
                    <div
                      className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                        opt.isSafe
                          ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-200'
                          : 'bg-amber-950/60 border border-amber-800/80 text-amber-200'
                      }`}
                    >
                      {opt.isSafe ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong>{opt.isSafe ? 'Estratégia Triunfante!' : 'Alerta Tático:'} </strong>
                        {opt.feedback}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-800">
            <button
              onClick={onExit}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition"
            >
              Voltar à Fase
            </button>

            {selectedOptionIndex !== null && (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <span>{currentNodeIndex + 1 < nodes.length ? 'Avançar na Trilha' : 'Chegar a Palmares'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20">
            ⛰️
          </div>
          <h4 className="text-2xl font-bold text-amber-300 font-display">
            Você Chegou à Serra da Barriga!
          </h4>
          <p className="text-stone-300 text-sm max-w-md mx-auto leading-relaxed">
            As palissadas de Palmares se abriram para acolher seus irmãos. Sob o comando de Zumbi e Dandara, a liberdade se tornou realidade vivida!
          </p>
          <div className="p-4 max-w-sm mx-auto bg-stone-950 border border-stone-800 rounded-xl font-mono text-xs text-amber-400">
            RECOMPENSA: +{score} PONTOS · +{buzios} BÚZIOS DE OURO
          </div>
          <button
            onClick={() => onComplete(score, buzios)}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            RECEBER MEDALHA DE RESISTÊNCIA & AVANÇAR
          </button>
        </div>
      )}
    </div>
  );
};
