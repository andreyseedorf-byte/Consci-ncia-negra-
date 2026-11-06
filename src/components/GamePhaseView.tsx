import React, { useState } from 'react';
import { PhaseData, PlayerProgress, DialogueChoice } from '../types/game';
import { DynamicDialogueModal } from './DynamicDialogueModal';
import { RelicHuntGame } from './RelicHuntGame';
import { QuilomboTrailGame } from './QuilomboTrailGame';
import { CapoeiraRhythmGame } from './CapoeiraRhythmGame';
import { CulinaryGame } from './CulinaryGame';
import { RespectScenariosGame } from './RespectScenariosGame';
import { QuizView } from './QuizView';
import { VictoryModal } from './VictoryModal';
import { audioService } from '../services/audioService';
import { ArrowLeft, BookOpen, Sparkles, MessageSquare, Play, HelpCircle, Award } from 'lucide-react';

interface GamePhaseViewProps {
  phase: PhaseData;
  progress: PlayerProgress;
  onPhaseCompleted: (phaseId: number, score: number, stars: number, buziosEarned: number) => void;
  onBackToMap: () => void;
  onRecordDialogueChoice: (nodeId: string, choiceId: string, affinity?: { type: any; amount: number }) => void;
  onOpenGlossary: () => void;
}

type PhaseStage = 'overview' | 'dialogue' | 'minigame' | 'quiz' | 'victory';

export const GamePhaseView: React.FC<GamePhaseViewProps> = ({
  phase,
  progress,
  onPhaseCompleted,
  onBackToMap,
  onRecordDialogueChoice,
  onOpenGlossary,
}) => {
  const [currentStage, setCurrentStage] = useState<PhaseStage>('overview');
  const [phaseScore, setPhaseScore] = useState<number>(0);
  const [phaseBuzios, setPhaseBuzios] = useState<number>(0);
  const [dialogueCompleted, setDialogueCompleted] = useState<boolean>(false);
  const [minigameCompleted, setMinigameCompleted] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [calculatedStars, setCalculatedStars] = useState<number>(1);
  const [phase4Choice, setPhase4Choice] = useState<'rhythm' | 'culinary'>('rhythm');

  const handleStartDialogue = () => {
    audioService.playDialogueBlip();
    setCurrentStage('dialogue');
  };

  const handleDialogueChoice = (nodeId: string, choice: DialogueChoice) => {
    onRecordDialogueChoice(nodeId, choice.id, choice.affinityBonus);
  };

  const handleDialogueFinish = (totalPoints: number, totalBuzios: number) => {
    setPhaseScore((prev) => prev + totalPoints);
    setPhaseBuzios((prev) => prev + totalBuzios);
    setDialogueCompleted(true);
    setCurrentStage('overview');
  };

  const handleStartMinigame = () => {
    audioService.playDialogueBlip();
    setCurrentStage('minigame');
  };

  const handleMinigameComplete = (score: number, buzios: number) => {
    setPhaseScore((prev) => prev + score);
    setPhaseBuzios((prev) => prev + buzios);
    setMinigameCompleted(true);
    setCurrentStage('overview');
  };

  const handleStartQuiz = () => {
    audioService.playDialogueBlip();
    setCurrentStage('quiz');
  };

  const handleQuizComplete = (score: number, buzios: number, correctCount: number) => {
    const finalScore = phaseScore + score;
    const finalBuzios = phaseBuzios + buzios;
    setQuizScore(score);
    setQuizCompleted(true);

    // Calculate stars: 3 stars if >= 2 correct answers and completed minigame/dialogue
    let stars = 1;
    if (correctCount >= 2 && (dialogueCompleted || minigameCompleted)) stars = 2;
    if (correctCount >= 3 && dialogueCompleted && minigameCompleted) stars = 3;

    setCalculatedStars(stars);
    setPhaseScore(finalScore);
    setPhaseBuzios(finalBuzios);

    onPhaseCompleted(phase.id, finalScore, stars, finalBuzios);
    setCurrentStage('victory');
  };

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onBackToMap();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-medium transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Mapa</span>
          </button>

          <div>
            <span className="text-[11px] font-mono text-amber-400 block uppercase">
              Fase {phase.id} · {phase.era}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-stone-100 font-display">
              {phase.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Glossário</span>
          </button>

          <div className="px-3 py-1 bg-amber-950/70 border border-amber-800/80 rounded-xl text-xs font-mono text-amber-300">
            {phaseScore} pts · {phaseBuzios} 🐚
          </div>
        </div>
      </header>

      {/* Overview Stage */}
      {currentStage === 'overview' && (
        <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center space-y-6">
          {/* Phase Hero Banner Card */}
          <div className="relative rounded-3xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-900">
            <div className="relative h-64 sm:h-72 w-full bg-stone-950">
              <img
                src={phase.image}
                alt={phase.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-stone-950/80 border border-stone-800 text-amber-300 mb-2 inline-block">
                  {phase.badgeName}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-display drop-shadow-md">
                  {phase.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 font-mono mt-1">
                  {phase.subtitle}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm text-stone-300 leading-relaxed">
                {phase.description}
              </p>

              {/* Learning objectives */}
              <div className="p-4 bg-stone-950/80 border border-stone-800/80 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider block">
                  Objetivos Pedagógicos desta Etapa:
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
                  {phase.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Phase Challenges Hub */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-400 font-mono uppercase tracking-wider block">
                  Desafios da Fase:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Challenge 1: Dynamic Dialogue */}
                  <div
                    onClick={handleStartDialogue}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      dialogueCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/50 text-stone-200'
                        : 'bg-stone-950 hover:bg-stone-800/60 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <MessageSquare className="w-5 h-5 text-amber-400" />
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                          {dialogueCompleted ? 'CONCLUÍDO' : 'ETAPA 1'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold font-display text-stone-100 mb-1">
                        Diálogo Ancestral
                      </h4>
                      <p className="text-xs text-stone-400">
                        Converse com figuras históricas e faça escolhas com base na sua afinidade.
                      </p>
                    </div>

                    <button className="mt-3 w-full py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-bold transition">
                      {dialogueCompleted ? 'Revisitar Diálogo' : 'Iniciar Conversa'}
                    </button>
                  </div>

                  {/* Challenge 2: Interactive Minigame */}
                  <div
                    onClick={handleStartMinigame}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      minigameCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/50 text-stone-200'
                        : 'bg-stone-950 hover:bg-stone-800/60 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                          {minigameCompleted ? 'CONCLUÍDO' : 'ETAPA 2'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold font-display text-stone-100 mb-1">
                        {phase.id === 1 && 'Caça às Relíquias'}
                        {phase.id === 2 && 'Trilha de Palmares'}
                        {phase.id === 3 && 'Diálogo dos Titãs'}
                        {phase.id === 4 && 'Roda de Capoeira / Culinária'}
                        {phase.id === 5 && 'Dilemas da Cidadania'}
                      </h4>
                      <p className="text-xs text-stone-400">
                        {phase.id === 4
                          ? 'Sincronize a ginga no berimbau ou monte pratos tradicionais.'
                          : 'Desafio prático e interativo específico desta fase histórica.'}
                      </p>
                    </div>

                    <button className="mt-3 w-full py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-bold transition">
                      {minigameCompleted ? 'Jogar Novamente' : 'Jogar Desafio'}
                    </button>
                  </div>

                  {/* Challenge 3: Knowledge Quiz */}
                  <div
                    onClick={handleStartQuiz}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      quizCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/50 text-stone-200'
                        : 'bg-stone-950 hover:bg-stone-800/60 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <HelpCircle className="w-5 h-5 text-amber-400" />
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                          {quizCompleted ? 'CONCLUÍDO' : 'ETAPA 3'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold font-display text-stone-100 mb-1">
                        Quiz do Saber
                      </h4>
                      <p className="text-xs text-stone-400">
                        Perguntas verificadas sobre os fatos e conquistas da história negra.
                      </p>
                    </div>

                    <button className="mt-3 w-full py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-bold transition">
                      {quizCompleted ? 'Refazer Quiz' : 'Responder Quiz'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Dialogue Stage Modal */}
      {currentStage === 'dialogue' && (
        <DynamicDialogueModal
          tree={phase.dialogueTree}
          isOpen={true}
          onChoiceSelected={handleDialogueChoice}
          onFinish={handleDialogueFinish}
          characterBonusType={progress.selectedCharacterId}
          onOpenGlossary={onOpenGlossary}
        />
      )}

      {/* Minigame Stage */}
      {currentStage === 'minigame' && (
        <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
          {phase.id === 1 && phase.relics && (
            <RelicHuntGame
              relics={phase.relics}
              onComplete={handleMinigameComplete}
              onExit={() => setCurrentStage('overview')}
              characterTraitBonus={progress.selectedCharacterId === 'malik'}
            />
          )}

          {phase.id === 2 && phase.pathNodes && (
            <QuilomboTrailGame
              nodes={phase.pathNodes}
              onComplete={handleMinigameComplete}
              onExit={() => setCurrentStage('overview')}
            />
          )}

          {phase.id === 3 && (
            // Phase 3 Dialogue Re-engagement or Quiz Transition
            <div className="w-full max-w-2xl mx-auto bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center space-y-4">
              <span className="text-4xl">⚖️</span>
              <h3 className="text-2xl font-bold text-amber-300 font-display">
                O Salão dos Heróis da Liberdade
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed max-w-md mx-auto">
                De Zumbi a Luiz Gama, de Dandara a Carolina Maria de Jesus, suas vozes ecoam em nossas mentes. Avance para o Desafio do Saber para testar seu domínio!
              </p>
              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={() => handleMinigameComplete(150, 20)}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Registrar Glória dos Heróis (+150 pts)
                </button>
              </div>
            </div>
          )}

          {phase.id === 4 && (
            <div className="space-y-6">
              {/* Selector between Capoeira Rhythm and Culinary */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPhase4Choice('rhythm')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    phase4Choice === 'rhythm'
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-900 text-stone-300'
                  }`}
                >
                  🥋 Roda de Capoeira (Ritmo)
                </button>
                <button
                  onClick={() => setPhase4Choice('culinary')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    phase4Choice === 'culinary'
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-900 text-stone-300'
                  }`}
                >
                  🥟 Culinária Ancestral (Acarajé & Vatapá)
                </button>
              </div>

              {phase4Choice === 'rhythm' ? (
                <CapoeiraRhythmGame
                  onComplete={(score, buz, acc) => handleMinigameComplete(score, buz)}
                  onExit={() => setCurrentStage('overview')}
                  characterTraitBonus={progress.selectedCharacterId === 'dandara_char'}
                />
              ) : (
                phase.culinaryIngredients && (
                  <CulinaryGame
                    ingredients={phase.culinaryIngredients}
                    onComplete={handleMinigameComplete}
                    onExit={() => setCurrentStage('overview')}
                    characterTraitBonus={progress.selectedCharacterId === 'bento'}
                  />
                )
              )}
            </div>
          )}

          {phase.id === 5 && phase.respectScenarios && (
            <RespectScenariosGame
              scenarios={phase.respectScenarios}
              onComplete={handleMinigameComplete}
              onExit={() => setCurrentStage('overview')}
              characterTraitBonus={progress.selectedCharacterId === 'jussara'}
            />
          )}
        </main>
      )}

      {/* Quiz Stage */}
      {currentStage === 'quiz' && (
        <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
          <QuizView
            questions={phase.questions}
            onComplete={handleQuizComplete}
            onExit={() => setCurrentStage('overview')}
            characterTraitBonus={progress.selectedCharacterId === 'ayo'}
          />
        </main>
      )}

      {/* Victory Stage Modal */}
      {currentStage === 'victory' && (
        <VictoryModal
          isOpen={true}
          phaseId={phase.id}
          phaseTitle={phase.title}
          score={phaseScore}
          stars={calculatedStars}
          buziosEarned={phaseBuzios}
          isAllPhasesComplete={phase.id === 5}
          onNextPhase={() => {
            if (phase.id < 5) {
              onBackToMap();
            }
          }}
          onBackToMap={onBackToMap}
          onReplayPhase={() => {
            setCurrentStage('overview');
            setDialogueCompleted(false);
            setMinigameCompleted(false);
            setQuizCompleted(false);
            setPhaseScore(0);
            setPhaseBuzios(0);
          }}
        />
      )}
    </div>
  );
};
