import React from 'react';
import { PHASES_DATA } from '../data/gameData';
import { PhaseData, PlayerProgress } from '../types/game';
import { audioService } from '../services/audioService';
import { Lock, Star, Play, BookOpen, Calendar, Award, User, Settings, ArrowLeft, Volume2, VolumeX } from 'lucide-react';

interface PhaseMapProps {
  progress: PlayerProgress;
  onSelectPhase: (phaseId: number) => void;
  onBackToTitle: () => void;
  onOpenGlossary: () => void;
  onOpenTimeline: () => void;
  onOpenCharacters: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
}

export const PhaseMap: React.FC<PhaseMapProps> = ({
  progress,
  onSelectPhase,
  onBackToTitle,
  onOpenGlossary,
  onOpenTimeline,
  onOpenCharacters,
  onOpenAchievements,
  onOpenSettings,
  onToggleSound,
}) => {
  const phasesList = [1, 2, 3, 4, 5].map((id) => PHASES_DATA[id]);

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100 flex flex-col overflow-x-hidden">
      {/* Top HUD Bar */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onBackToTitle();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-stone-300 text-xs font-medium transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Menu Principal</span>
          </button>

          <div>
            <h1 className="text-sm sm:text-base font-bold text-amber-300 font-display tracking-wide">
              Mapa da Jornada Histórica
            </h1>
            <p className="text-[11px] text-stone-400 font-mono hidden sm:block">
              Árvore da Ancestralidade · 5 Fases da Liberdade
            </p>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="px-3 py-1 bg-amber-950/70 border border-amber-800/80 rounded-xl text-amber-300 flex items-center gap-1.5">
            <span>Pontos:</span>
            <span className="font-bold text-amber-400">{progress.score}</span>
          </div>

          <div className="px-3 py-1 bg-stone-900 border border-stone-800 rounded-xl text-emerald-400 flex items-center gap-1.5">
            <span>Búzios:</span>
            <span className="font-bold text-emerald-300">{progress.buzios} 🐚</span>
          </div>

          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 transition cursor-pointer"
            title={progress.soundEnabled ? 'Silenciar Áudio' : 'Ativar Áudio'}
          >
            {progress.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Floating Quick Action Nav for Glossary, Timeline, Profile */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 pt-4 flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onOpenGlossary();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold transition cursor-pointer shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Glossário & Termos</span>
          </button>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onOpenTimeline();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-medium transition cursor-pointer shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Linha do Tempo</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onOpenCharacters();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-medium transition cursor-pointer shrink-0"
          >
            <User className="w-3.5 h-3.5" />
            <span>Personagem</span>
          </button>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onOpenAchievements();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-medium transition cursor-pointer shrink-0"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Conquistas</span>
          </button>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 transition cursor-pointer shrink-0"
            title="Configurações"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Phases Vertical/Grid Journey Map */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phasesList.map((phase) => {
            const isUnlocked = progress.unlockedPhases.includes(phase.id);
            const stars = progress.phaseStars[phase.id] || 0;
            const highScore = progress.phaseHighScores[phase.id] || 0;

            return (
              <div
                key={phase.id}
                className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-stone-900/90 border-stone-800 hover:border-amber-500/60 shadow-xl hover:shadow-amber-500/10'
                    : 'bg-stone-950/60 border-stone-900 opacity-60'
                }`}
              >
                {/* Artwork Banner Container */}
                <div className="relative h-44 w-full overflow-hidden bg-stone-950">
                  <img
                    src={phase.image}
                    alt={phase.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isUnlocked ? 'group-hover:scale-105' : 'grayscale brightness-50'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />

                  {/* Phase number badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-800 font-mono text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>FASE {phase.id}</span>
                  </div>

                  {/* Era pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-stone-900/90 backdrop-blur-md border border-stone-700/80 text-[11px] font-mono text-stone-300">
                    {phase.era}
                  </div>

                  {/* Stars in banner bottom */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* High score */}
                  {highScore > 0 && (
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono text-amber-300/90 bg-stone-950/80 px-2 py-0.5 rounded">
                      Recorde: {highScore} pts
                    </div>
                  )}
                </div>

                {/* Phase Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-stone-100 font-display group-hover:text-amber-300 transition-colors">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-amber-400/90 font-mono mb-2">
                      {phase.subtitle}
                    </p>
                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">
                      {phase.description}
                    </p>
                  </div>

                  {/* Action button */}
                  <div>
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          audioService.playBuzioChime();
                          onSelectPhase(phase.id);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-md shadow-amber-500/10"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{stars > 0 ? 'JOGAR NOVAMENTE' : 'INICIAR FASE'}</span>
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-950 border border-stone-800 rounded-xl text-xs font-mono text-stone-500">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Complete a fase {phase.id - 1} para desbloquear</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
