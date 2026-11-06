import React, { useState, useMemo } from 'react';
import { GLOSSARY_ITEMS, GlossaryItem } from '../data/gameData';
import { audioService } from '../services/audioService';
import { Search, BookOpen, X, Sparkles, Filter, Volume2, ArrowRight } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToPhase?: (phaseId: number) => void;
}

type CategoryFilter = 'todas' | 'historia' | 'figuras' | 'cultura' | 'espiritualidade' | 'legislacao';

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  onJumpToPhase,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('todas');
  const [selectedItem, setSelectedItem] = useState<GlossaryItem>(GLOSSARY_ITEMS[0]);

  const filteredItems = useMemo(() => {
    return GLOSSARY_ITEMS.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fullContext.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'todas' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleSelectTerm = (item: GlossaryItem) => {
    setSelectedItem(item);
    audioService.playDialogueBlip();
  };

  const categoryLabels: Record<CategoryFilter, string> = {
    todas: 'Todos os Termos',
    historia: 'História & Resistência',
    figuras: 'Grandes Nomes',
    cultura: 'Cultura & Arte',
    espiritualidade: 'Espiritualidade',
    legislacao: 'Cidadania & Leis',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[750px] bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-300 font-display tracking-wide flex items-center gap-2">
                Glossário & Enciclopédia das Raízes
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 font-mono">
                  {GLOSSARY_ITEMS.length} termos
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Conceitos, heróis e marcos da história afro-brasileira
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition cursor-pointer"
            aria-label="Fechar Glossário"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="p-4 bg-stone-950/60 border-b border-stone-800/80 flex flex-col sm:flex-row gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar termo (ex: quilombo, orixás, capoeira, Zumbi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-900 border border-stone-700/80 rounded-xl text-stone-200 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(Object.keys(categoryLabels) as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  audioService.playDialogueBlip();
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Content split pane: Left list, Right detail card */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left term selector list */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-stone-800 overflow-y-auto p-3 space-y-1.5 max-h-[240px] md:max-h-none">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-xs">
                Nenhum termo encontrado para sua busca.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTerm(item)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-stone-100 shadow-sm'
                        : 'bg-stone-900/60 hover:bg-stone-800/70 border-stone-800/80 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div className="truncate">
                        <span className="text-sm font-semibold block truncate">
                          {item.term}
                        </span>
                        <span className="text-[11px] text-stone-400 block truncate">
                          {item.shortDefinition}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 shrink-0 ml-2">
                      Fase {item.relatedPhase}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Right detail view */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-stone-900 to-stone-950">
            {selectedItem ? (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{selectedItem.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-amber-300 font-display">
                          {selectedItem.term}
                        </h3>
                        {selectedItem.pronunciation && (
                          <span className="text-xs text-amber-500/90 font-mono italic block">
                            {selectedItem.pronunciation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs uppercase px-2.5 py-1 rounded bg-stone-800 border border-stone-700 text-stone-300 font-mono">
                    {categoryLabels[selectedItem.category]}
                  </span>
                </div>

                {/* Short definition block */}
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-stone-200 text-sm leading-relaxed">
                  <span className="text-xs font-bold text-amber-400 block mb-1 font-mono uppercase tracking-wider">
                    Definição Essencial
                  </span>
                  {selectedItem.shortDefinition}
                </div>

                {/* Deep historical context */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">
                    Contexto Histórico & Significado Cultural
                  </h4>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    {selectedItem.fullContext}
                  </p>
                </div>

                {/* Related phase callout */}
                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <div className="text-xs text-stone-400">
                    Aparece no jogo em: <span className="text-stone-200 font-semibold">Fase {selectedItem.relatedPhase}</span>
                  </div>

                  {onJumpToPhase && (
                    <button
                      onClick={() => {
                        onJumpToPhase(selectedItem.relatedPhase);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-medium transition cursor-pointer"
                    >
                      <span>Jogar Fase {selectedItem.relatedPhase}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500 text-sm">
                Selecione um termo à esquerda para ler os detalhes históricos.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
