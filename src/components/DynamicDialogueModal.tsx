import React, { useState, useEffect, useRef } from 'react';
import { DynamicDialogueTree, DynamicDialogueNode, DialogueChoice, CharacterAffinity } from '../types/game';
import { audioService } from '../services/audioService';
import { Sparkles, MessageSquare, ChevronRight, CheckCircle2, History, BookOpen } from 'lucide-react';

interface DynamicDialogueModalProps {
  tree: DynamicDialogueTree;
  isOpen: boolean;
  onChoiceSelected: (nodeId: string, choice: DialogueChoice) => void;
  onFinish: (totalPoints: number, totalBuzios: number) => void;
  characterBonusType?: string;
  onOpenGlossary?: () => void;
}

export const DynamicDialogueModal: React.FC<DynamicDialogueModalProps> = ({
  tree,
  isOpen,
  onChoiceSelected,
  onFinish,
  characterBonusType,
  onOpenGlossary,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(tree.initialNodeId);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [accumulatedPoints, setAccumulatedPoints] = useState<number>(0);
  const [accumulatedBuzios, setAccumulatedBuzios] = useState<number>(0);
  const [lastConsequence, setLastConsequence] = useState<string | null>(null);
  const [historyLog, setHistoryLog] = useState<{ speaker: string; text: string; choice?: string }[]>([]);

  const typingTimeoutRef = useRef<number | null>(null);

  const currentNode: DynamicDialogueNode = tree.nodes[currentNodeId] || tree.nodes[tree.initialNodeId];

  // Typewriter effect
  useEffect(() => {
    if (!currentNode) return;
    setIsTyping(true);
    setDisplayedText('');
    let idx = 0;
    const fullText = currentNode.text;

    const typeNextChar = () => {
      if (idx < fullText.length) {
        setDisplayedText(fullText.slice(0, idx + 1));
        if (idx % 3 === 0) {
          audioService.playDialogueBlip();
        }
        idx++;
        typingTimeoutRef.current = window.setTimeout(typeNextChar, 20);
      } else {
        setIsTyping(false);
      }
    };

    typingTimeoutRef.current = window.setTimeout(typeNextChar, 100);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [currentNodeId, currentNode]);

  if (!isOpen) return null;

  const handleSkipTyping = () => {
    if (isTyping && currentNode) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setDisplayedText(currentNode.text);
      setIsTyping(false);
    }
  };

  const handleChoiceClick = (choice: DialogueChoice) => {
    audioService.playBuzioChime();
    const pts = choice.points || 0;
    const buz = choice.buzios || 0;

    setAccumulatedPoints((prev) => prev + pts);
    setAccumulatedBuzios((prev) => prev + buz);

    setHistoryLog((prev) => [
      ...prev,
      {
        speaker: currentNode.speakerName,
        text: currentNode.text,
        choice: choice.text,
      },
    ]);

    if (choice.consequenceText) {
      setLastConsequence(choice.consequenceText);
    } else {
      setLastConsequence(null);
    }

    onChoiceSelected(currentNode.id, choice);

    if (choice.nextNodeId && tree.nodes[choice.nextNodeId]) {
      setCurrentNodeId(choice.nextNodeId);
    } else if (currentNode.isEnding || !choice.nextNodeId) {
      onFinish(accumulatedPoints + pts, accumulatedBuzios + buz);
    }
  };

  const affinityBadges: Record<CharacterAffinity, { label: string; color: string }> = {
    sabedoria: { label: 'Sabedoria Ancestral', color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
    coragem: { label: 'Coragem Guerreira', color: 'text-red-400 bg-red-950/60 border-red-800' },
    justica: { label: 'Justiça & Diplomacia', color: 'text-blue-400 bg-blue-950/60 border-blue-800' },
    cultura: { label: 'Cultura & Axé', color: 'text-purple-400 bg-purple-950/60 border-purple-800' },
    empatia: { label: 'Empatia & União', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
  };

  const emotionLabels = {
    orgulhoso: 'Orgulhoso & Altivo',
    reflexivo: 'Reflexivo & Sábio',
    solene: 'Solene & Grave',
    combativo: 'Combativo & Firme',
    acolhedor: 'Acolhedor & Fraterno',
    curioso: 'Curioso & Atento',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Dialogue header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentNode.speakerAvatar}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-amber-300 font-display">
                  {currentNode.speakerName}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 font-mono">
                  {emotionLabels[currentNode.emotion]}
                </span>
              </div>
              <p className="text-xs text-stone-400">{currentNode.speakerTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenGlossary && (
              <button
                onClick={onOpenGlossary}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg text-xs font-medium transition cursor-pointer"
                title="Consultar Glossário Histórico"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Glossário</span>
              </button>
            )}
            <div className="px-3 py-1 bg-amber-950/80 border border-amber-800/80 rounded-lg text-xs font-mono text-amber-300">
              +{accumulatedPoints} pts · {accumulatedBuzios} 🐚
            </div>
          </div>
        </div>

        {/* Dialogue body */}
        <div
          onClick={handleSkipTyping}
          className="flex-1 overflow-y-auto p-6 space-y-4 cursor-pointer select-none"
        >
          {/* Historical context kicker */}
          {currentNode.historicalContextNote && (
            <div className="p-3 bg-stone-950/70 border border-stone-800/90 rounded-xl text-stone-400 text-xs flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-300 font-semibold font-mono">Contexto Histórico: </strong>
                {currentNode.historicalContextNote}
              </span>
            </div>
          )}

          {/* Historical greeting if present */}
          {currentNode.historicalGreeting && (
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400/90 font-semibold">
              {currentNode.historicalGreeting}
            </div>
          )}

          {/* Main speech text */}
          <div className="text-base sm:text-lg text-stone-100 font-medium leading-relaxed min-h-[70px]">
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />}
          </div>

          {/* Previous choice consequence feedback */}
          {lastConsequence && (
            <div className="text-xs italic text-emerald-400/90 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{lastConsequence}</span>
            </div>
          )}
        </div>

        {/* Player response choices */}
        <div className="p-5 bg-stone-950 border-t border-stone-800 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-1 flex items-center justify-between">
            <span>Sua Resposta:</span>
            {isTyping && <span className="text-[11px] text-amber-500/80">Clique no texto para pular animação</span>}
          </div>

          <div className="space-y-2">
            {currentNode.choices.map((choice) => {
              const affinity = choice.affinityBonus
                ? affinityBadges[choice.affinityBonus.type]
                : null;

              return (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceClick(choice)}
                  disabled={isTyping}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-4 cursor-pointer ${
                    isTyping
                      ? 'bg-stone-900/40 border-stone-800 text-stone-500 opacity-60 cursor-not-allowed'
                      : 'bg-stone-900 hover:bg-stone-800/90 hover:border-amber-500/50 border-stone-800 text-stone-200'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-snug">{choice.text}</p>
                    {affinity && (
                      <span
                        className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono border ${affinity.color}`}
                      >
                        +{choice.affinityBonus?.amount} {affinity.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-amber-400/90 font-bold">
                      +{choice.points} pts
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
