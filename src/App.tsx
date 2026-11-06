import React, { useState, useEffect } from 'react';
import { PlayerProgress, Character, PhaseId, DifficultyLevel } from './types/game';
import { storageService } from './services/storageService';
import { audioService } from './services/audioService';
import { PHASES_DATA } from './data/gameData';
import { TitleScreen } from './components/TitleScreen';
import { PhaseMap } from './components/PhaseMap';
import { GamePhaseView } from './components/GamePhaseView';
import { GlossaryModal } from './components/GlossaryModal';
import { TimelineModal } from './components/TimelineModal';
import { StoryPrologueModal } from './components/StoryPrologueModal';
import { CharacterModal } from './components/CharacterModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';

type AppView = 'title' | 'map' | 'phase';

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() =>
    storageService.loadProgress()
  );
  const [currentView, setCurrentView] = useState<AppView>('title');
  const [activePhaseId, setActivePhaseId] = useState<PhaseId>(1);

  // Modals state
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(false);
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);
  const [isCharactersOpen, setIsCharactersOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync audio preferences on mount
  useEffect(() => {
    audioService.setSoundEnabled(progress.soundEnabled);
    audioService.setBgmEnabled(progress.bgmEnabled);
    audioService.setVolume(progress.soundVolume);
  }, [progress.soundEnabled, progress.bgmEnabled, progress.soundVolume]);

  const handleSelectPhase = (phaseId: number) => {
    setActivePhaseId(phaseId as PhaseId);
    setCurrentView('phase');
  };

  const handlePhaseCompleted = (
    phaseId: number,
    score: number,
    stars: number,
    buziosEarned: number
  ) => {
    const updated = storageService.completePhase(
      progress,
      phaseId,
      score,
      stars,
      buziosEarned
    );
    setProgress(updated);
  };

  const handleRecordDialogueChoice = (
    nodeId: string,
    choiceId: string,
    affinity?: { type: any; amount: number }
  ) => {
    const updated = storageService.recordDialogueChoice(
      progress,
      nodeId,
      choiceId,
      affinity
    );
    setProgress(updated);
  };

  const handleSelectCharacter = (char: Character) => {
    const updated = { ...progress, selectedCharacterId: char.id };
    storageService.saveProgress(updated);
    setProgress(updated);
    setIsCharactersOpen(false);
  };

  const handleToggleSound = () => {
    const nextState = !progress.soundEnabled;
    const updated = { ...progress, soundEnabled: nextState };
    storageService.saveProgress(updated);
    setProgress(updated);
    audioService.setSoundEnabled(nextState);
    if (nextState) audioService.playBuzioChime();
  };

  const handleToggleBgm = (enabled: boolean) => {
    const updated = { ...progress, bgmEnabled: enabled };
    storageService.saveProgress(updated);
    setProgress(updated);
    audioService.setBgmEnabled(enabled);
  };

  const handleChangeVolume = (vol: number) => {
    const updated = { ...progress, soundVolume: vol };
    storageService.saveProgress(updated);
    setProgress(updated);
    audioService.setVolume(vol);
  };

  const handleChangeDifficulty = (diff: DifficultyLevel) => {
    const updated = { ...progress, difficulty: diff };
    storageService.saveProgress(updated);
    setProgress(updated);
  };

  const handleResetProgress = () => {
    const fresh = storageService.resetProgress();
    setProgress(fresh);
    setIsSettingsOpen(false);
    setCurrentView('title');
  };

  const handleJumpToPhase = (phaseId: number) => {
    setActivePhaseId(phaseId as PhaseId);
    setCurrentView('phase');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-body">
      {/* View routing */}
      {currentView === 'title' && (
        <TitleScreen
          progress={progress}
          onPlay={() => setCurrentView('map')}
          onOpenStory={() => setIsStoryOpen(true)}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
          onOpenTimeline={() => setIsTimelineOpen(true)}
          onOpenCharacters={() => setIsCharactersOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleSound={handleToggleSound}
        />
      )}

      {currentView === 'map' && (
        <PhaseMap
          progress={progress}
          onSelectPhase={handleSelectPhase}
          onBackToTitle={() => setCurrentView('title')}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
          onOpenTimeline={() => setIsTimelineOpen(true)}
          onOpenCharacters={() => setIsCharactersOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleSound={handleToggleSound}
        />
      )}

      {currentView === 'phase' && (
        <GamePhaseView
          phase={PHASES_DATA[activePhaseId]}
          progress={progress}
          onPhaseCompleted={handlePhaseCompleted}
          onBackToMap={() => setCurrentView('map')}
          onRecordDialogueChoice={handleRecordDialogueChoice}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
        />
      )}

      {/* Persistent Global Modals */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        onJumpToPhase={handleJumpToPhase}
      />

      <TimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        onJumpToPhase={handleJumpToPhase}
      />

      <StoryPrologueModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        onStartGame={() => {
          setIsStoryOpen(false);
          setCurrentView('map');
        }}
      />

      <CharacterModal
        isOpen={isCharactersOpen}
        onClose={() => setIsCharactersOpen(false)}
        selectedId={progress.selectedCharacterId}
        onSelectCharacter={handleSelectCharacter}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        unlockedList={progress.unlockedAchievements}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundEnabled={progress.soundEnabled}
        bgmEnabled={progress.bgmEnabled}
        volume={progress.soundVolume}
        difficulty={progress.difficulty}
        onToggleSound={handleToggleSound}
        onToggleBgm={handleToggleBgm}
        onChangeVolume={handleChangeVolume}
        onChangeDifficulty={handleChangeDifficulty}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
