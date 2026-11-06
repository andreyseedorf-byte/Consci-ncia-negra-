import { PlayerProgress, CharacterAffinity, DifficultyLevel } from '../types/game';

const STORAGE_KEY = 'raizes_da_liberdade_save_v1';

const DEFAULT_PROGRESS: PlayerProgress = {
  score: 0,
  buzios: 50, // Starting búzios
  selectedCharacterId: 'ayo',
  unlockedPhases: [1], // Phase 1 is unlocked initially
  phaseStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  phaseHighScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  unlockedAchievements: [],
  foundRelics: [],
  dialogueChoicesMade: {},
  affinityScores: {
    sabedoria: 0,
    coragem: 0,
    justica: 0,
    cultura: 0,
    empatia: 0,
  },
  difficulty: 'aventureiro',
  soundEnabled: true,
  bgmEnabled: false,
  soundVolume: 0.8,
};

export const storageService = {
  loadProgress(): PlayerProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return { ...DEFAULT_PROGRESS };
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        phaseStars: { ...DEFAULT_PROGRESS.phaseStars, ...(parsed.phaseStars || {}) },
        phaseHighScores: { ...DEFAULT_PROGRESS.phaseHighScores, ...(parsed.phaseHighScores || {}) },
        affinityScores: { ...DEFAULT_PROGRESS.affinityScores, ...(parsed.affinityScores || {}) },
      };
    } catch {
      return { ...DEFAULT_PROGRESS };
    }
  },

  saveProgress(progress: PlayerProgress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // storage quota or private browsing fallback
    }
  },

  resetProgress(): PlayerProgress {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return { ...DEFAULT_PROGRESS };
  },

  recordDialogueChoice(
    progress: PlayerProgress,
    nodeId: string,
    choiceId: string,
    affinityBonus?: { type: CharacterAffinity; amount: number }
  ): PlayerProgress {
    const updated = { ...progress };
    updated.dialogueChoicesMade = {
      ...updated.dialogueChoicesMade,
      [nodeId]: choiceId,
    };
    if (affinityBonus) {
      updated.affinityScores = {
        ...updated.affinityScores,
        [affinityBonus.type]: (updated.affinityScores[affinityBonus.type] || 0) + affinityBonus.amount,
      };
    }
    this.saveProgress(updated);
    return updated;
  },

  completePhase(
    progress: PlayerProgress,
    phaseId: number,
    phaseScore: number,
    stars: number,
    buziosEarned: number
  ): PlayerProgress {
    const updated = { ...progress };
    updated.score += phaseScore;
    updated.buzios += buziosEarned;

    // Update phase stars (keep highest)
    const currentStars = updated.phaseStars[phaseId] || 0;
    if (stars > currentStars) {
      updated.phaseStars[phaseId] = stars;
    }

    // Update phase high score
    const currentHigh = updated.phaseHighScores[phaseId] || 0;
    if (phaseScore > currentHigh) {
      updated.phaseHighScores[phaseId] = phaseScore;
    }

    // Unlock next phase if available
    const nextPhase = phaseId + 1;
    if (nextPhase <= 5 && !updated.unlockedPhases.includes(nextPhase)) {
      updated.unlockedPhases = [...updated.unlockedPhases, nextPhase];
    }

    this.saveProgress(updated);
    return updated;
  },
};
