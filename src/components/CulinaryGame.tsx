import React, { useState } from 'react';
import { CulinaryIngredient } from '../types/game';
import { audioService } from '../services/audioService';
import { Sparkles, CheckCircle2, RotateCcw, Award, Flame, AlertCircle } from 'lucide-react';

interface CulinaryGameProps {
  ingredients: CulinaryIngredient[];
  onComplete: (score: number, buzios: number) => void;
  onExit: () => void;
  characterTraitBonus?: boolean;
}

export const CulinaryGame: React.FC<CulinaryGameProps> = ({
  ingredients,
  onComplete,
  onExit,
  characterTraitBonus = false,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [dishState, setDishState] = useState<'selecting' | 'cooked'>('selecting');
  const [score, setScore] = useState<number>(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const toggleIngredient = (id: string) => {
    if (dishState === 'cooked') return;
    audioService.playDialogueBlip();
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCook = () => {
    // Check traditional ingredients selected
    const traditionalIds = ingredients.filter((i) => i.isTraditional).map((i) => i.id);
    const nonTraditionalIds = ingredients.filter((i) => !i.isTraditional).map((i) => i.id);

    const pickedTraditional = selectedIngredients.filter((id) => traditionalIds.includes(id));
    const pickedNonTraditional = selectedIngredients.filter((id) => nonTraditionalIds.includes(id));

    if (pickedTraditional.length < 3) {
      setFeedbackMsg('Selecione mais ingredientes fundamentais da tradição baiana para a massa e o dendê!');
      audioService.playWrong();
      return;
    }

    if (pickedNonTraditional.length > 0) {
      setFeedbackMsg('Atenção: Você incluiu itens processados que não pertencem ao sagrado tabuleiro das baianas!');
      audioService.playWrong();
      return;
    }

    // Success
    audioService.playCorrect();
    audioService.playVictory();
    const multiplier = characterTraitBonus ? 1.25 : 1;
    const finalScore = Math.round((pickedTraditional.length * 60 + 100) * multiplier);
    const finalBuzios = Math.round(25 * multiplier);

    setScore(finalScore);
    setDishState('cooked');
    setFeedbackMsg('Perfeito! O dendê ferveu com aroma sagrado e o Acarajé com Vatapá ficou digno de festa de Iansã!');
  };

  const handleReset = () => {
    setSelectedIngredients([]);
    setDishState('selecting');
    setFeedbackMsg('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-amber-300 font-display flex items-center gap-2">
            <span>🏺</span> Tabuleiro Ancestral · Oficina de Acarajé e Vatapá
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Selecione apenas os ingredientes tradicionais afro-brasileiros para fritar no azeite de dendê
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1 bg-amber-950/80 border border-amber-800/80 rounded text-amber-300">
            {selectedIngredients.length} ITENS NO CALDEIRÃO
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs mb-6 flex items-start gap-2.5 ${
            dishState === 'cooked'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
              : 'bg-amber-950/60 border border-amber-800 text-amber-200'
          }`}
        >
          {dishState === 'cooked' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div>{feedbackMsg}</div>
        </div>
      )}

      {dishState === 'selecting' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ingredients.map((ing) => {
              const isSelected = selectedIngredients.includes(ing.id);

              return (
                <button
                  key={ing.id}
                  onClick={() => toggleIngredient(ing.id)}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-between cursor-pointer select-none ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-stone-100 shadow-md ring-1 ring-amber-400'
                      : 'bg-stone-950/70 hover:bg-stone-800/70 border-stone-800 text-stone-400'
                  }`}
                >
                  <span className="text-3xl mb-1.5">{ing.icon}</span>
                  <span className="text-xs font-bold text-stone-200 block mb-1">
                    {ing.name}
                  </span>
                  <span className="text-[10px] text-stone-400 line-clamp-2 leading-tight">
                    {ing.description}
                  </span>
                </button>
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

            <button
              onClick={handleCook}
              disabled={selectedIngredients.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <Flame className="w-4 h-4" />
              FRITAR NO DENDÊ & SERVIR
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 animate-pulse">
            🥟
          </div>
          <h4 className="text-2xl font-bold text-amber-300 font-display">
            Acarajé Dourado e Vatapá Perfeito!
          </h4>
          <p className="text-stone-300 text-sm max-w-md mx-auto leading-relaxed">
            Você honrou o Ofício das Baianas de Acarajé, reconhecido pelo IPHAN como Patrimônio Cultural Imaterial do Brasil!
          </p>
          <div className="p-3.5 max-w-xs mx-auto bg-stone-950 border border-stone-800 rounded-xl font-mono text-xs text-amber-400">
            +{score} PONTOS CONQUISTADOS
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onComplete(score, Math.round(score / 15))}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
            >
              <Award className="w-4 h-4" />
              CONCLUIR OFICINA & AVANÇAR
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Fazer Outra Receita
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
