import React from 'react';
import { CHARACTERS } from '../data/gameData';
import { Character } from '../types/game';
import { audioService } from '../services/audioService';
import { X, Check, Sparkles, User } from 'lucide-react';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string;
  onSelectCharacter: (char: Character) => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  onClose,
  selectedId,
  onSelectCharacter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-300 font-display">
                Escolha seu Protagonista
              </h2>
              <p className="text-xs text-stone-400">
                Personagens inspirados na rica diversidade do povo brasileiro
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition cursor-pointer"
            aria-label="Fechar Personagens"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Character cards grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CHARACTERS.map((char) => {
            const isSelected = selectedId === char.id;

            return (
              <div
                key={char.id}
                onClick={() => {
                  audioService.playBuzioChime();
                  onSelectCharacter(char);
                }}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-400/50 shadow-lg'
                    : 'bg-stone-950/70 hover:bg-stone-800/60 border-stone-800 text-stone-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] font-mono flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3" />
                    ATIVO
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${char.avatarColor} border border-amber-300/30 flex items-center justify-center text-xl font-bold text-white shadow-md`}
                    >
                      {char.name[0]}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-100 font-display">
                        {char.name}
                      </h3>
                      <span className="text-xs text-amber-400 font-mono">
                        {char.title}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed mb-4">
                    {char.description}
                  </p>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Habilidade: {char.trait}
                  </span>
                  <p className="text-[11px] text-stone-400 leading-normal">
                    {char.traitDescription}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-stone-950 border-t border-stone-800 text-center text-xs text-stone-400 shrink-0">
          Você pode trocar de personagem a qualquer momento para aproveitar diferentes bônus.
        </div>
      </div>
    </div>
  );
};
