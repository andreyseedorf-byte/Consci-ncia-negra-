import React, { useState } from 'react';
import { RespectScenario } from '../types/game';
import { audioService } from '../services/audioService';
import { ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, Award } from 'lucide-react';

interface RespectScenariosGameProps {
  scenarios: RespectScenario[];
  onComplete: (score: number, buzios: number) => void;
  onExit: () => void;
  characterTraitBonus?: boolean;
}

export const RespectScenariosGame: React.FC<RespectScenariosGameProps> = ({
  scenarios,
  onComplete,
  onExit,
  characterTraitBonus = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [buzios, setBuzios] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentScenario = scenarios[currentIndex];

  const handleSelect = (optIndex: number) => {
    if (selectedOptionIndex !== null) return;
    setSelectedOptionIndex(optIndex);

    const opt = currentScenario.options[optIndex];
    if (opt.isAntiRacist) {
      audioService.playCorrect();
      audioService.playBuzioChime();
    } else {
      audioService.playWrong();
    }

    const multiplier = characterTraitBonus ? 1.25 : 1;
    const earned = Math.round(opt.points * multiplier);
    const buz = opt.isAntiRacist ? Math.round(20 * multiplier) : 5;

    setScore((prev) => prev + earned);
    setBuzios((prev) => prev + buz);
  };

  const handleNext = () => {
    setSelectedOptionIndex(null);
    if (currentIndex + 1 < scenarios.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      audioService.playVictory();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-amber-300 font-display flex items-center gap-2">
            <span>⚖️</span> Dilemas da Cidadania & Atitudes Antirracistas
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Analise situações reais de preconceito e escolha intervenções corajosas e educativas
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1 bg-amber-950/80 border border-amber-800/80 rounded text-amber-300">
            PONTOS: <span className="font-bold text-amber-400">{score}</span>
          </div>
          <div className="px-3 py-1 bg-stone-800 rounded text-stone-300">
            SITUAÇÃO {currentIndex + 1}/{scenarios.length}
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-3">
            <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              {currentScenario.title}
            </span>
            <p className="text-sm text-stone-300 leading-relaxed">
              {currentScenario.context}
            </p>
            <h4 className="text-base font-bold text-stone-100 font-display pt-1 border-t border-stone-800/80">
              {currentScenario.problem}
            </h4>
          </div>

          <div className="space-y-3">
            {currentScenario.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;

              return (
                <div key={idx} className="space-y-2">
                  <button
                    onClick={() => handleSelect(idx)}
                    disabled={selectedOptionIndex !== null}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                      selectedOptionIndex === null
                        ? 'bg-stone-800/70 hover:bg-stone-800 border-stone-700/80 text-stone-200'
                        : isSelected
                        ? opt.isAntiRacist
                          ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-100'
                          : 'bg-red-950/40 border-red-500/80 text-red-100'
                        : 'bg-stone-900/40 border-stone-800/60 text-stone-500 opacity-50'
                    }`}
                  >
                    <span className="text-sm font-medium leading-relaxed">{opt.text}</span>
                    <span className="text-xs font-mono font-bold shrink-0 ml-4">
                      +{opt.points} pts
                    </span>
                  </button>

                  {/* Immediate didactic explanation */}
                  {isSelected && (
                    <div
                      className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                        opt.isAntiRacist
                          ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-200'
                          : 'bg-amber-950/60 border border-amber-800/80 text-amber-200'
                      }`}
                    >
                      {opt.isAntiRacist ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong>{opt.isAntiRacist ? 'Atitude Antirracista Exemplar!' : 'Reflexão Crítica:'} </strong>
                        {opt.explanation}
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
              Voltar
            </button>

            {selectedOptionIndex !== null && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                <span>{currentIndex + 1 < scenarios.length ? 'Próximo Dilema' : 'Concluir Cidadania'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20">
            ✨
          </div>
          <h4 className="text-2xl font-bold text-amber-300 font-display">
            Cidadão Antirracista Consciente!
          </h4>
          <p className="text-stone-300 text-sm max-w-md mx-auto leading-relaxed">
            Como ensinou Angela Davis, numa sociedade racista não basta não ser racista, é preciso ser ativamente antirracista!
          </p>
          <div className="p-3.5 max-w-xs mx-auto bg-stone-950 border border-stone-800 rounded-xl font-mono text-xs text-amber-400">
            RECOMPENSA: +{score} PONTOS · +{buzios} BÚZIOS
          </div>
          <button
            onClick={() => onComplete(score, buzios)}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            RECEBER MEDALHA DE IGUALDADE & AVANÇAR
          </button>
        </div>
      )}
    </div>
  );
};
