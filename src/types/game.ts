export type PhaseId = 1 | 2 | 3 | 4 | 5;

export type DifficultyLevel = 'iniciante' | 'aventureiro' | 'guardiao';

export type CharacterAffinity = 'sabedoria' | 'coragem' | 'justica' | 'cultura' | 'empatia';

export type CharacterEmotion = 'orgulhoso' | 'reflexivo' | 'solene' | 'combativo' | 'acolhedor' | 'curioso';

export interface DialogueChoice {
  id: string;
  text: string;
  affinityBonus?: { type: CharacterAffinity; amount: number };
  points: number;
  buzios: number;
  nextNodeId?: string; // leads to specific branching node
  requiredAffinity?: { type: CharacterAffinity; minAmount: number };
  consequenceText?: string;
  unlocksCodexId?: string;
}

export interface DynamicDialogueNode {
  id: string;
  speakerName: string;
  speakerTitle: string;
  speakerAvatar: string;
  emotion: CharacterEmotion;
  historicalGreeting?: string;
  text: string;
  historicalContextNote?: string;
  choices: DialogueChoice[];
  isEnding?: boolean;
}

export interface DynamicDialogueTree {
  id: string;
  phaseId: PhaseId;
  title: string;
  initialNodeId: string;
  nodes: Record<string, DynamicDialogueNode>;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarColor: string;
  iconName: string;
  trait: string;
  traitDescription: string;
  bonusType: 'buzios' | 'hint' | 'rhythm' | 'points' | 'empathy' | 'justica';
  preferredAffinity: CharacterAffinity;
}

export interface Question {
  id: string;
  question: string;
  context?: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  historicalCuriosity?: string;
}

export interface Relic {
  id: string;
  name: string;
  origin: string;
  period: string;
  description: string;
  icon: string;
  historicalSignificance: string;
}

export interface QuilomboPathNode {
  id: string;
  title: string;
  description: string;
  situation: string;
  options: {
    text: string;
    isSafe: boolean;
    feedback: string;
    points: number;
    buzios: number;
  }[];
}

export interface CapoeiraRhythmNote {
  id: number;
  targetTime: number; // in milliseconds
  instrument: 'atabaque' | 'gunga' | 'agogo';
  label: string;
  lane: 0 | 1 | 2; // 3 lanes
}

export interface CulinaryIngredient {
  id: string;
  name: string;
  isTraditional: boolean;
  dish: 'acaraje' | 'vatapa';
  description: string;
  icon: string;
}

export interface RespectScenario {
  id: string;
  title: string;
  context: string;
  problem: string;
  options: {
    text: string;
    isAntiRacist: boolean;
    explanation: string;
    points: number;
  }[];
}

export interface PhaseData {
  id: PhaseId;
  title: string;
  subtitle: string;
  era: string;
  image: string;
  description: string;
  badgeName: string;
  badgeIcon: string;
  learningObjectives: string[];
  dialogueTree: DynamicDialogueTree;
  questions: Question[];
  relics?: Relic[];
  pathNodes?: QuilomboPathNode[];
  culinaryIngredients?: CulinaryIngredient[];
  respectScenarios?: RespectScenario[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface PlayerProgress {
  score: number;
  buzios: number;
  selectedCharacterId: string;
  unlockedPhases: number[]; // e.g. [1, 2]
  phaseStars: Record<number, number>; // phaseId -> stars (1-3)
  phaseHighScores: Record<number, number>;
  unlockedAchievements: string[];
  foundRelics: string[];
  dialogueChoicesMade: Record<string, string>; // nodeId -> choiceId
  affinityScores: Record<CharacterAffinity, number>;
  difficulty: DifficultyLevel;
  soundEnabled: boolean;
  bgmEnabled: boolean;
  soundVolume: number;
}
