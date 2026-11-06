import React from 'react';
import { PlayerProgress, Character } from '../types/game';
import { CHARACTERS } from '../data/gameData';
import { audioService } from '../services/audioService';
import { Play, BookOpen, Calendar, Settings, Award, Users, Volume2, VolumeX, Sparkles, Compass } from 'lucide-react';

interface TitleScreenProps {
  progress: PlayerProgress;
  onPlay: () => void;
  onOpenStory: () => void;
  onOpenGlossary: () => void;
  onOpenTimeline: () => void;
  onOpenCharacters: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  progress,
  onPlay,
  onOpenStory,
  onOpenGlossary,
  onOpenTimeline,
  onOpenCharacters,
  onOpenAchievements,
  onOpenSettings,
  onToggleSound,
}) => {
  const currentCharacter =
    CHARACTERS.find((c) => c.id === progress.selectedCharacterId) || CHARACTERS[0];

  return (
    <div className="relative min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Background Hero Banner Artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/title_screen_cover_1793970318384.jpg"
          alt="Raízes da Liberdade – Uma Jornada pela História"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center brightness-70 scale-100 transition-all duration-700"
        />
        {/* Measured dark gradient overlay for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/30" />
        <div className="absolute inset-0 bg-radial from-transparent via-stone-950/40 to-stone-950/90" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 px-6 sm:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌿</span>
          <span className="text-xs font-mono tracking-widest uppercase text-amber-400 font-bold">
            CONSCIÊNCIA NEGRA · JOGO EDUCATIVO
          </span>
        </div>

        {/* Player Profile Capsule & Sound Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onOpenCharacters();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-800 hover:border-amber-500/50 text-xs font-medium text-stone-200 transition cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full bg-gradient-to-tr ${currentCharacter.avatarColor} flex items-center justify-center text-[10px] text-white font-bold`}
            >
              {currentCharacter.name[0]}
            </div>
            <span>{currentCharacter.name}</span>
          </button>

          <div className="px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-800 text-xs font-mono text-amber-300">
            {progress.buzios} 🐚
          </div>

          <button
            onClick={onToggleSound}
            className="p-2 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-800 hover:bg-stone-800 text-stone-300 transition cursor-pointer"
            title={progress.soundEnabled ? 'Silenciar Áudio' : 'Ativar Som e Toques'}
          >
            {progress.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Centerpiece Hero Title Lockup */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 text-center my-auto py-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          Uma Jornada pela História, Resistência & Cultura
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-stone-100 font-display tracking-tight leading-none mb-4 drop-shadow-2xl">
          Raízes da <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Liberdade</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-300 font-body leading-relaxed mb-8 drop-shadow-md">
          Embarque em uma jornada inesquecível: desde os impérios e a sabedoria da África antiga, passando pelas fortalezas quilombolas de Palmares, até os heróis, os ritmos da capoeira e a cidadania antirracista do Brasil contemporâneo.
        </p>

        {/* Primary Start CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xs mx-auto mb-8">
          <button
            onClick={() => {
              audioService.playBuzioChime();
              onPlay();
            }}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer tracking-wide"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>JOGAR AGORA</span>
          </button>
        </div>

        {/* Secondary Navigation Grid as explicitly requested in Prompt */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onOpenStory();
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/40 backdrop-blur-md text-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>HISTÓRIA</span>
          </button>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onOpenGlossary();
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/40 backdrop-blur-md text-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>APRENDER</span>
          </button>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onOpenTimeline();
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/40 backdrop-blur-md text-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>LINHA DO TEMPO</span>
          </button>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onOpenSettings();
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/40 backdrop-blur-md text-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>CONFIGURAÇÕES</span>
          </button>
        </div>
      </main>

      {/* Bottom Footer Info */}
      <footer className="relative z-10 px-6 py-4 border-t border-stone-800/80 bg-stone-950/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenCharacters}
            className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Personagens</span>
          </button>
          <span>·</span>
          <button
            onClick={onOpenAchievements}
            className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Medalhas & Conquistas</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-stone-500">
          20 de Novembro · Dia Nacional de Zumbi e da Consciência Negra
        </div>
      </footer>
    </div>
  );
};
