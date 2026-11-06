import React from 'react';
import { DifficultyLevel } from '../types/game';
import { audioService } from '../services/audioService';
import { X, Volume2, VolumeX, Music, Shield, RotateCcw, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  bgmEnabled: boolean;
  volume: number;
  difficulty: DifficultyLevel;
  onToggleSound: (enabled: boolean) => void;
  onToggleBgm: (enabled: boolean) => void;
  onChangeVolume: (vol: number) => void;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  bgmEnabled,
  volume,
  difficulty,
  onToggleSound,
  onToggleBgm,
  onChangeVolume,
  onChangeDifficulty,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const handleSoundToggle = (val: boolean) => {
    onToggleSound(val);
    audioService.setSoundEnabled(val);
    if (val) audioService.playBuzioChime();
  };

  const handleBgmToggle = (val: boolean) => {
    onToggleBgm(val);
    audioService.setBgmEnabled(val);
    if (val) audioService.playDialogueBlip();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onChangeVolume(val);
    audioService.setVolume(val);
  };

  const difficulties: { id: DifficultyLevel; name: string; desc: string }[] = [
    {
      id: 'iniciante',
      name: 'Iniciante',
      desc: 'Mais tempo para reflexão e dicas generosas nos enigmas.',
    },
    {
      id: 'aventureiro',
      name: 'Aventureiro',
      desc: 'Equilíbrio padrão ideal de desafio, sabedoria e ritmo.',
    },
    {
      id: 'guardiao',
      name: 'Guardião da História',
      desc: 'Perguntas mais desafiadoras com multiplicadores máximos de búzios.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800">
          <h2 className="text-lg font-bold text-amber-300 font-display">
            Configurações do Jogo
          </h2>
          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition cursor-pointer"
            aria-label="Fechar Configurações"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Audio section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-400 font-mono uppercase tracking-wider">
              Áudio & Ritmos Afro-Brasileiros
            </h3>

            <div className="flex items-center justify-between p-3.5 bg-stone-950 rounded-xl border border-stone-800">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-sm font-semibold text-stone-200 block">Efeitos Sonoros</span>
                  <span className="text-xs text-stone-400">Berimbau, atabaque, agogô e chimes</span>
                </div>
              </div>
              <button
                onClick={() => handleSoundToggle(!soundEnabled)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  soundEnabled ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}
              >
                {soundEnabled ? 'LIGADO' : 'MUDO'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-stone-950 rounded-xl border border-stone-800">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-sm font-semibold text-stone-200 block">Trilha de Percussão Afro</span>
                  <span className="text-xs text-stone-400">Toque vivo de Ijexá e Samba sintetizado</span>
                </div>
              </div>
              <button
                onClick={() => handleBgmToggle(!bgmEnabled)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  bgmEnabled ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}
              >
                {bgmEnabled ? 'ATIVO' : 'DESATIVADO'}
              </button>
            </div>

            <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                <span>Volume Geral</span>
                <span className="text-amber-400 font-bold">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Difficulty section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-400 font-mono uppercase tracking-wider">
              Nível de Dificuldade
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => {
                    audioService.playDialogueBlip();
                    onChangeDifficulty(diff.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    difficulty === diff.id
                      ? 'bg-amber-500/20 border-amber-500 text-stone-100'
                      : 'bg-stone-950 hover:bg-stone-800/80 border-stone-800 text-stone-400'
                  }`}
                >
                  <span className="text-xs font-bold block mb-0.5 text-stone-200">
                    {diff.name}
                  </span>
                  <span className="text-[10px] text-stone-400 leading-tight block">
                    {diff.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset progress */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
            <div className="text-xs text-stone-500">
              Deseja recomeçar a jornada do zero?
            </div>
            <button
              onClick={() => {
                if (window.confirm('Tem certeza de que deseja reiniciar todo o progresso do jogo?')) {
                  onResetProgress();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs rounded-lg transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar Progresso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
