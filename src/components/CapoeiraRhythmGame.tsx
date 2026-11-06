import React, { useState, useEffect, useRef, useCallback } from 'react';
import { audioService } from '../services/audioService';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles, Award } from 'lucide-react';

interface CapoeiraRhythmGameProps {
  onComplete: (score: number, buzios: number, accuracy: number) => void;
  onExit: () => void;
  characterTraitBonus?: boolean;
}

interface RhythmNote {
  id: number;
  lane: 0 | 1 | 2 | 3;
  targetTime: number; // ms from song start
  label: string;
  sublabel: string;
  icon: string;
  hit?: boolean;
  missed?: boolean;
}

const LANES = [
  { key: 'A', name: 'Ginga', color: 'from-amber-500 to-amber-700', border: 'border-amber-400', icon: '🦵' },
  { key: 'S', name: 'Esquiva', color: 'from-emerald-500 to-emerald-700', border: 'border-emerald-400', icon: '🛡️' },
  { key: 'W', name: 'Meia-Lua', color: 'from-red-500 to-red-700', border: 'border-red-400', icon: '⚡' },
  { key: 'D', name: 'Armada', color: 'from-blue-500 to-blue-700', border: 'border-blue-400', icon: '🌀' },
];

export const CapoeiraRhythmGame: React.FC<CapoeiraRhythmGameProps> = ({
  onComplete,
  onExit,
  characterTraitBonus = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [hits, setHits] = useState<number>(0);
  const [totalNotesCount, setTotalNotesCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; color: string; id: number } | null>(null);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeLanePress, setActiveLanePress] = useState<number | null>(null);

  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const notesRef = useRef<RhythmNote[]>([]);
  const beatIntervalRef = useRef<number | null>(null);

  // Generate a rhythmic 35-second sequence of capoeira moves (BPM 100)
  const generateSongNotes = useCallback(() => {
    const list: RhythmNote[] = [];
    const bpm = 100;
    const beatMs = (60 / bpm) * 1000; // 600ms per beat
    let id = 1;

    // Introduction: Ginga cadence
    for (let beat = 4; beat <= 16; beat += 2) {
      const lane = (beat % 4) as 0 | 1 | 2 | 3;
      list.push({
        id: id++,
        lane,
        targetTime: beat * beatMs,
        label: LANES[lane].name,
        sublabel: LANES[lane].key,
        icon: LANES[lane].icon,
      });
    }

    // Mid song: Rhythmic variations with faster combinations
    for (let beat = 18; beat <= 40; beat += 1.5) {
      const lane = Math.floor((beat * 3) % 4) as 0 | 1 | 2 | 3;
      list.push({
        id: id++,
        lane,
        targetTime: Math.round(beat * beatMs),
        label: LANES[lane].name,
        sublabel: LANES[lane].key,
        icon: LANES[lane].icon,
      });
    }

    // Grand Finale: Quick tempo flourishing
    for (let beat = 42; beat <= 54; beat += 1) {
      const lane = Math.floor((beat * 7) % 4) as 0 | 1 | 2 | 3;
      list.push({
        id: id++,
        lane,
        targetTime: Math.round(beat * beatMs),
        label: LANES[lane].name,
        sublabel: LANES[lane].key,
        icon: LANES[lane].icon,
      });
    }

    setTotalNotesCount(list.length);
    notesRef.current = list;
  }, []);

  // Axé multiplier based on combo
  const axeMultiplier = combo >= 15 ? 4 : combo >= 10 ? 3 : combo >= 5 ? 2 : 1;
  const effectiveMultiplier = characterTraitBonus ? axeMultiplier + 0.5 : axeMultiplier;

  // Handle note hit detection
  const handleAction = useCallback(
    (laneIndex: number) => {
      if (!isPlaying || gameFinished) return;

      setActiveLanePress(laneIndex);
      setTimeout(() => setActiveLanePress(null), 150);

      // Play instrument sound based on movement
      if (laneIndex === 0) audioService.playBerimbau('grave', true);
      else if (laneIndex === 1) audioService.playBerimbau('agudo', false);
      else if (laneIndex === 2) audioService.playAtabaque('forte');
      else audioService.playAgogo(true);

      const now = performance.now() - startTimeRef.current;
      const hitWindowMs = 280; // generous window for responsive accessibility

      // Find closest active note in this lane
      let closestNote: RhythmNote | null = null;
      let minDiff = Infinity;

      for (const note of notesRef.current) {
        if (note.lane === laneIndex && !note.hit && !note.missed) {
          const diff = Math.abs(now - note.targetTime);
          if (diff < hitWindowMs && diff < minDiff) {
            minDiff = diff;
            closestNote = note;
          }
        }
      }

      if (closestNote) {
        closestNote.hit = true;
        const accuracyRating = minDiff < 90 ? 'PERFEITO!' : minDiff < 170 ? 'MUITO BOM!' : 'BOM!';
        const basePoints = minDiff < 90 ? 100 : minDiff < 170 ? 75 : 45;
        const awarded = Math.round(basePoints * effectiveMultiplier);

        setScore((prev) => prev + awarded);
        setHits((prev) => prev + 1);
        setCombo((prev) => {
          const next = prev + 1;
          setMaxCombo((mc) => Math.max(mc, next));
          return next;
        });

        audioService.playBuzioChime();

        setFeedback({
          text: `${accuracyRating} +${awarded} Axé x${effectiveMultiplier}`,
          color: minDiff < 90 ? 'text-amber-400 font-bold scale-110' : 'text-emerald-400',
          id: Date.now(),
        });
      } else {
        // Missed tap or wrong timing
        setCombo(0);
        setFeedback({
          text: 'FORA DO TEMPO!',
          color: 'text-stone-400 text-sm',
          id: Date.now(),
        });
      }
    },
    [isPlaying, gameFinished, effectiveMultiplier]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'A' || key === 'ARROWLEFT') handleAction(0);
      else if (key === 'S' || key === 'ARROWDOWN') handleAction(1);
      else if (key === 'W' || key === 'ARROWUP') handleAction(2);
      else if (key === 'D' || key === 'ARROWRIGHT') handleAction(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction]);

  // Start the song & game loop
  const startGame = () => {
    generateSongNotes();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHits(0);
    setGameFinished(false);
    setIsPlaying(true);
    startTimeRef.current = performance.now();

    // Start background rhythm loop
    audioService.startAfroBeat();

    // Loop update
    const updateLoop = () => {
      const elapsed = performance.now() - startTimeRef.current;
      setCurrentTime(elapsed);

      // Check for missed notes
      notesRef.current.forEach((note) => {
        if (!note.hit && !note.missed && elapsed > note.targetTime + 280) {
          note.missed = true;
          setCombo(0);
        }
      });

      // Song duration ~ 35 seconds
      const lastNoteTime = notesRef.current[notesRef.current.length - 1]?.targetTime || 35000;
      if (elapsed > lastNoteTime + 1500) {
        setIsPlaying(false);
        setGameFinished(true);
        audioService.stopAfroBeat();
        audioService.playVictory();
        return;
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
  };

  const handleFinishConfirm = () => {
    const accuracy = totalNotesCount > 0 ? Math.round((hits / totalNotesCount) * 100) : 0;
    const buziosReward = Math.max(15, Math.round(score / 50));
    onComplete(score, buziosReward, accuracy);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
      audioService.stopAfroBeat();
    };
  }, []);

  const speed = 0.55; // pixels per ms
  const hitLineY = 380; // position of the hit target zone

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[580px]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-stone-950/80 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🥋</span>
          <div>
            <h2 className="text-base font-bold text-amber-300 font-display tracking-wide">
              Roda da Ancestralidade · O Toque do Berimbau
            </h2>
            <p className="text-xs text-stone-400">
              Sincronize a ginga e os golpes no compasso do atabaque e do berimbau
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1 bg-amber-950/60 border border-amber-800/60 rounded text-amber-200">
            PONTOS: <span className="font-bold text-amber-400 text-sm">{score}</span>
          </div>
          <div className="px-3 py-1 bg-stone-800 rounded text-stone-300">
            COMBO: <span className="font-bold text-emerald-400">{combo}</span>
          </div>
          <div className="px-3 py-1 bg-gradient-to-r from-amber-600 to-red-600 rounded text-white font-bold">
            AXÉ x{effectiveMultiplier}
          </div>
        </div>
      </div>

      {/* Main playfield */}
      {!isPlaying && !gameFinished && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-radial from-amber-950/20 to-stone-950">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-4xl mb-4 shadow-lg shadow-amber-500/10">
            🪕
          </div>
          <h3 className="text-2xl font-bold text-stone-100 font-display mb-2">
            Entre na Roda de Capoeira
          </h3>
          <p className="text-stone-300 max-w-md text-sm mb-6 leading-relaxed">
            A capoeira foi criada pelos africanos escravizados como forma de autodefesa e resistência cultural,
            disfarçada de dança. Pressione as teclas ou toque nas pistas quando o movimento cruzar a linha dourada!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mb-8">
            {LANES.map((l) => (
              <div
                key={l.key}
                className="p-3 bg-stone-800/80 border border-stone-700/60 rounded-xl flex flex-col items-center"
              >
                <span className="text-2xl mb-1">{l.icon}</span>
                <span className="text-xs font-bold text-stone-200">{l.name}</span>
                <kbd className="mt-1 px-2 py-0.5 bg-stone-900 border border-stone-600 rounded text-[10px] text-amber-400 font-mono">
                  Tecla {l.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 text-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              INICIAR RODA DE CAPOEIRA
            </button>
            <button
              onClick={onExit}
              className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-xl text-sm transition"
            >
              Voltar à Fase
            </button>
          </div>
        </div>
      )}

      {/* Active gameplay screen */}
      {isPlaying && (
        <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 flex flex-col">
          {/* Lanes container */}
          <div className="flex-1 relative flex">
            {LANES.map((lane, idx) => (
              <div
                key={lane.key}
                className={`flex-1 relative border-r border-stone-800/80 last:border-r-0 flex flex-col justify-end transition-colors ${
                  activeLanePress === idx ? 'bg-amber-500/10' : ''
                }`}
              >
                {/* Visual lane lane identifier */}
                <div className="absolute top-3 left-0 right-0 flex flex-col items-center opacity-30 text-xs font-mono text-stone-400">
                  <span>{lane.icon}</span>
                  <span className="text-[10px]">{lane.name}</span>
                </div>

                {/* Falling notes for this lane */}
                {notesRef.current
                  .filter((n) => n.lane === idx && !n.hit && !n.missed)
                  .map((note) => {
                    const timeDiff = note.targetTime - currentTime;
                    // Y position calculated: hitLineY when timeDiff === 0
                    const noteY = hitLineY - timeDiff * speed;

                    if (noteY < -50 || noteY > hitLineY + 120) return null;

                    return (
                      <div
                        key={note.id}
                        className={`absolute left-2 right-2 h-12 rounded-xl bg-gradient-to-b ${lane.color} border-2 ${lane.border} flex items-center justify-center shadow-lg transition-transform`}
                        style={{
                          transform: `translateY(${noteY}px)`,
                          willChange: 'transform',
                        }}
                      >
                        <span className="text-xl mr-1">{note.icon}</span>
                        <span className="text-xs font-bold text-white tracking-wide">{note.label}</span>
                      </div>
                    );
                  })}
              </div>
            ))}

            {/* Target Hit Line */}
            <div
              className="absolute left-0 right-0 h-14 border-y-2 border-amber-500/80 bg-amber-500/10 pointer-events-none flex items-center justify-between px-4 z-10"
              style={{ top: `${hitLineY}px` }}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 font-mono">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                ZONA DO IMPACTO
              </div>
              <div className="text-[10px] text-amber-200/80 font-mono">SINCRONIZE NO COMPASSO</div>
            </div>

            {/* Realtime floating feedback */}
            {feedback && (
              <div
                key={feedback.id}
                className="absolute left-1/2 -translate-x-1/2 top-48 z-20 pointer-events-none text-center animate-bounce"
              >
                <div className={`text-base tracking-wider uppercase font-bold drop-shadow-md ${feedback.color}`}>
                  {feedback.text}
                </div>
              </div>
            )}
          </div>

          {/* Interactive touch/click controls bar for mobile and desktop */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-stone-950 border-t border-stone-800 z-20">
            {LANES.map((lane, idx) => (
              <button
                key={lane.key}
                onPointerDown={() => handleAction(idx)}
                className={`py-3.5 px-2 rounded-xl bg-stone-800/90 active:bg-amber-600/90 border border-stone-700 active:border-amber-400 flex flex-col items-center justify-center transition-transform active:scale-95 touch-manipulation cursor-pointer select-none ${
                  activeLanePress === idx ? 'ring-2 ring-amber-400 bg-amber-600/60' : ''
                }`}
              >
                <span className="text-xl mb-0.5">{lane.icon}</span>
                <span className="text-xs font-bold text-stone-200">{lane.name}</span>
                <span className="text-[10px] text-amber-400 font-mono">[{lane.key}]</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completion screen */}
      {gameFinished && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-radial from-amber-950/30 to-stone-950">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl mb-4 shadow-xl shadow-amber-500/20 animate-pulse">
            🏆
          </div>
          <h3 className="text-2xl font-bold text-amber-300 font-display mb-1">
            Axé na Roda! Toque Concluído!
          </h3>
          <p className="text-stone-300 text-sm max-w-md mb-6">
            Você honrou os mestres do berimbau e a arte libertária da capoeira com ritmo, ginga e respeito!
          </p>

          <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-8">
            <div className="p-3.5 bg-stone-800/70 border border-stone-700/60 rounded-xl">
              <span className="text-[11px] text-stone-400 block font-mono">PONTUAÇÃO</span>
              <span className="text-xl font-bold text-amber-400 font-mono">{score}</span>
            </div>
            <div className="p-3.5 bg-stone-800/70 border border-stone-700/60 rounded-xl">
              <span className="text-[11px] text-stone-400 block font-mono">MAIOR COMBO</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">{maxCombo}</span>
            </div>
            <div className="p-3.5 bg-stone-800/70 border border-stone-700/60 rounded-xl">
              <span className="text-[11px] text-stone-400 block font-mono">PRECISÃO</span>
              <span className="text-xl font-bold text-sky-400 font-mono">
                {totalNotesCount > 0 ? Math.round((hits / totalNotesCount) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleFinishConfirm}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 text-sm cursor-pointer"
            >
              <Award className="w-4 h-4" />
              COLETAR RECOMPENSAS & AVANÇAR
            </button>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              Jogar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
