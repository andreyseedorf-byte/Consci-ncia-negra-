import React from 'react';
import { ACHIEVEMENTS } from '../data/gameData';
import { audioService } from '../services/audioService';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedList: string[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  unlockedList,
}) => {
  if (!isOpen) return null;

  const total = ACHIEVEMENTS.length;
  const countUnlocked = ACHIEVEMENTS.filter((a) =>
    a.unlocked || unlockedList.includes(a.id)
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-300 font-display">
                Galeria de Conquistas & Medalhas
              </h2>
              <p className="text-xs text-stone-400">
                {countUnlocked} de {total} medalhas históricas conquistadas
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition cursor-pointer"
            aria-label="Fechar Conquistas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="p-4 bg-stone-950/60 border-b border-stone-800">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-1.5">
            <span>PROGRESSO TOTAL</span>
            <span className="text-amber-400 font-bold">{Math.round((countUnlocked / total) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
              style={{ width: `${(countUnlocked / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Achievements grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = ach.unlocked || unlockedList.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/40 text-stone-200'
                    : 'bg-stone-950/50 border-stone-800/80 text-stone-500 opacity-70'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                    isUnlocked
                      ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10'
                      : 'bg-stone-900 border-stone-800'
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-stone-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h3 className={`text-sm font-bold truncate ${isUnlocked ? 'text-amber-300' : 'text-stone-400'}`}>
                      {ach.title}
                    </h3>
                    {isUnlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-stone-400">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
