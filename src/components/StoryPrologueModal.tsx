import React from 'react';
import { audioService } from '../services/audioService';
import { X, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

interface StoryPrologueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export const StoryPrologueModal: React.FC<StoryPrologueModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-300 font-display">
                A Jornada das Raízes da Liberdade
              </h2>
              <p className="text-xs text-stone-400">
                O Prólogo da Consciência Negra e a Memória do Brasil
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition cursor-pointer"
            aria-label="Fechar História"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-stone-200 leading-relaxed text-sm">
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-amber-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm">
              "Um povo que não conhece a sua história é como uma árvore sem raízes: tomba ao primeiro vento forte." — Provérbio Ancestral Africano
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-amber-300 font-display">
              1. A Ilusão do Esquecimento
            </h3>
            <p className="text-stone-300">
              Por muito tempo, os livros tradicionais contaram uma história incompleta. Disseram que a África era uma terra sem escrita e que a liberdade dos escravizados no Brasil foi um presente gracioso assinado em um papel dourado no dia 13 de maio.
            </p>
            <p className="text-stone-300">
              Mas a verdade histórica, guardada pelos Griots, cravada na Serra da Barriga e cantada nas rodas de capoeira, conta outra história: a África era mãe de impérios monumentais, de matemáticos, de forjadores de metal e filósofos da cosmologia.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-amber-300 font-display">
              2. O Quilombo e o Grito de Palmares
            </h3>
            <p className="text-stone-300">
              Quando milhões de africanos foram violentamente arrancados de suas terras no maior crime contra a humanidade da história, eles não trouxeram apenas correntes: trouxeram seus deuses, seus saberes agrícolas, sua música, sua medicina e sua determinação inabalável de viver livres.
            </p>
            <p className="text-stone-300">
              Nas matas de Alagoas, nasceu o Quilombo dos Palmares. Ali, durante mais de cem anos, homens e mulheres negros, indígenas e desvalidos criaram uma sociedade solidária que desafiou os maiores exércitos coloniais do planeta.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-amber-300 font-display">
              3. O 20 de Novembro e o Seu Chamado
            </h3>
            <p className="text-stone-300">
              Em 20 de novembro de 1695, tombou Zumbi dos Palmares, mas sua semente brotou em Luiz Gama, em Dandara, em Maria Firmina, em Carolina Maria de Jesus e em cada trabalhador negro que constrói o Brasil diariamente.
            </p>
            <p className="text-stone-300 font-medium text-amber-200">
              Agora, a tocha da memória está em suas mãos. Viaje pelas 5 eras, converse com os ancestrais, decifre os mistérios da cultura e ajude a construir um país verdadeiramente justo e antirracista.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-400">
            Pronto para iniciar sua jornada histórica?
          </span>
          <button
            onClick={() => {
              audioService.playBuzioChime();
              onClose();
              onStartGame();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <span>INICIAR JORNADA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
