import React, { useState } from 'react';
import { Question } from '../types/game';
import { audioService } from '../services/audioService';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, ArrowRight, Award } from 'lucide-react';

interface QuizViewProps {
  questions: Question[];
  onComplete: (score: number, buzios: number, correctCount: number) => void;
  onExit: () => void;
  characterTraitBonus?: boolean;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  onComplete,
  onExit,
  characterTraitBonus = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [buzios, setBuzios] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === currentQ.correctAnswer;

    if (isCorrect) {
      audioService.playCorrect();
      audioService.playBuzioChime();

      const multiplier = characterTraitBonus ? 1.25 : 1;
      const pts = Math.round(150 * multiplier);
      const buz = Math.round(20 * multiplier);

      setScore((prev) => prev + pts);
      setBuzios((prev) => prev + buz);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      audioService.playWrong();
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentIndex + 1 < questions.length) {
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
            <span>📚</span> Desafio do Saber Histórico
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Perguntas com respostas verificadas sobre a história e heróis da liberdade
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1 bg-amber-950/80 border border-amber-800/80 rounded text-amber-300">
            PONTOS: <span className="font-bold text-amber-400">{score}</span>
          </div>
          <div className="px-3 py-1 bg-stone-800 rounded text-stone-300">
            QUESTÃO {currentIndex + 1}/{questions.length}
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-3">
            {currentQ.context && (
              <span className="text-xs font-mono text-amber-400/90 block">
                {currentQ.context}
              </span>
            )}
            <h4 className="text-base sm:text-lg font-bold text-stone-100 font-display leading-relaxed">
              {currentQ.question}
            </h4>
          </div>

          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctAnswer;
              const hasAnswered = selectedAnswer !== null;

              let btnStyle = 'bg-stone-800/70 hover:bg-stone-800 border-stone-700/80 text-stone-200';
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-100 font-medium';
                } else if (isSelected) {
                  btnStyle = 'bg-red-950/50 border-red-500 text-red-100';
                } else {
                  btnStyle = 'bg-stone-900/40 border-stone-800/60 text-stone-500 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span className="text-sm">{opt}</span>
                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Historical explanation upon answer */}
          {selectedAnswer !== null && (
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-2 animate-in fade-in">
              <div className="text-xs text-stone-300 leading-relaxed">
                <strong className="text-amber-400 font-mono block uppercase mb-1">
                  Explicação Histórica:
                </strong>
                {currentQ.explanation}
              </div>

              {currentQ.historicalCuriosity && (
                <div className="text-xs text-amber-200/90 italic pt-1 border-t border-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    <strong>Você sabia? </strong> {currentQ.historicalCuriosity}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-stone-800">
            <button
              onClick={onExit}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition"
            >
              Voltar
            </button>

            {selectedAnswer !== null && (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                <span>{currentIndex + 1 < questions.length ? 'Próxima Pergunta' : 'Finalizar Desafio'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20">
            📜
          </div>
          <h4 className="text-2xl font-bold text-amber-300 font-display">
            Desafio Histórico Concluído!
          </h4>
          <p className="text-stone-300 text-sm max-w-md mx-auto leading-relaxed">
            Você acertou {correctAnswersCount} de {questions.length} perguntas e demonstrou domínio sobre nossas raízes ancestrais!
          </p>
          <div className="p-3.5 max-w-xs mx-auto bg-stone-950 border border-stone-800 rounded-xl font-mono text-xs text-amber-400">
            +{score} PONTOS · +{buzios} BÚZIOS CONQUISTADOS
          </div>
          <button
            onClick={() => onComplete(score, buzios, correctAnswersCount)}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            AVANÇAR COM AS RECOMPENSAS
          </button>
        </div>
      )}
    </div>
  );
};
