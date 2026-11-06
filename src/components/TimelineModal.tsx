import React, { useState } from 'react';
import { audioService } from '../services/audioService';
import { Calendar, X, ArrowRight, Sparkles, Filter, Bookmark } from 'lucide-react';

interface TimelineEvent {
  id: string;
  year: string;
  era: 'africa_antiga' | 'resistencia_quilombos' | 'herois_abolicao' | 'cultura_afro' | 'cidadania_presente';
  eraName: string;
  title: string;
  summary: string;
  keyFigures: string[];
  historicalImpact: string;
  relatedPhase: number;
  icon: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 't_mali',
    year: '1324',
    era: 'africa_antiga',
    eraName: 'África Antiga & Civilizações',
    title: 'A Peregrinação de Mansa Musa e o Esplendor de Mali',
    summary: 'Mansa Musa, imperador do Mali, realiza sua histórica viagem a Meca, distribuindo ouro e atraindo os maiores arquitetos e sábios para a Universidade de Sankoré em Timbuktu.',
    keyFigures: ['Mansa Musa', 'Abu Ishaq al-Sahili'],
    historicalImpact: 'Consolidou Timbuktu como a capital intelectual do oeste africano com centenas de milhares de manuscritos científicos.',
    relatedPhase: 1,
    icon: '🏛️',
  },
  {
    id: 't_benin',
    year: '1500 - 1550',
    era: 'africa_antiga',
    eraName: 'África Antiga & Civilizações',
    title: 'O Apogeu dos Bronzes de Benin e a Rainha Idia',
    summary: 'O Reino de Benin desenvolve uma das mais sofisticadas técnicas de fundição de bronze da história, liderado pela guerreira e estadista Rainha-Mãe Idia.',
    keyFigures: ['Rainha Idia (Iyoba)', 'Oba Esigie'],
    historicalImpact: 'A arte metalúrgica de Benin quebrou séculos depois o mito eurocêntrico sobre a capacidade técnica africana.',
    relatedPhase: 1,
    icon: '👑',
  },
  {
    id: 't_palmares_start',
    year: 'c. 1590',
    era: 'resistencia_quilombos',
    eraName: 'Resistência & Quilombos',
    title: 'Fundação do Quilombo dos Palmares',
    summary: 'Africanos fugidos dos canaviais de Pernambuco e Alagoas refugiam-se na Serra da Barriga, fundando uma federação de mocambos autônomos sob a liderança de Acotirene e Ganga Zumba.',
    keyFigures: ['Acotirene', 'Ganga Zumba'],
    historicalImpact: 'Palmares resistiu por mais de um século, tornando-se a maior sociedade livre de ex-escravizados das Américas com mais de 20.000 habitantes.',
    relatedPhase: 2,
    icon: '⛰️',
  },
  {
    id: 't_zumbi_martyrdom',
    year: '20 de Novembro de 1695',
    era: 'resistencia_quilombos',
    eraName: 'Resistência & Quilombos',
    title: 'A Morte Heroica de Zumbi dos Palmares',
    summary: 'Após décadas de guerras contra expedições holandesas e portuguesas, Zumbi dos Palmares é emboscado e morto em combate na Serra Dois Irmãos, recusando render-se à escravidão.',
    keyFigures: ['Zumbi dos Palmares', 'Dandara dos Palmares'],
    historicalImpact: 'A data de sua morte tornou-se o marco definitivo do Dia Nacional da Consciência Negra, celebrando o protagonismo negro na liberdade.',
    relatedPhase: 3,
    icon: '✊🏿',
  },
  {
    id: 't_males',
    year: '1835',
    era: 'resistencia_quilombos',
    eraName: 'Resistência & Quilombos',
    title: 'A Revolta dos Malês em Salvador',
    summary: 'Africanos muçulmanos letrados em árabe organizam uma grandiosa insurreição na Bahia para derrubar o sistema escravocrata e conquistar a soberania.',
    keyFigures: ['Luísa Mahin', 'Pacífico Licutan', 'Ahuna'],
    historicalImpact: 'Abalou as estruturas do Império e provou o alto nível intelectual e organizativo dos africanos escravizados.',
    relatedPhase: 2,
    icon: '📜',
  },
  {
    id: 't_maria_firmina',
    year: '1859',
    era: 'herois_abolicao',
    eraName: 'Heróis da Abolição',
    title: 'Publicação de "Úrsula" por Maria Firmina dos Reis',
    summary: 'A escritora maranhense Maria Firmina dos Reis publica o primeiro romance abolicionista da literatura brasileira, pioneira na representação humana dos escravizados.',
    keyFigures: ['Maria Firmina dos Reis'],
    historicalImpact: 'Inaugurou a ficção abolicionista e a tradição literária de mulheres negras no Brasil.',
    relatedPhase: 3,
    icon: '📚',
  },
  {
    id: 't_luiz_gama',
    year: '1865 - 1882',
    era: 'herois_abolicao',
    eraName: 'Heróis da Abolição',
    title: 'A Batalha Jurídica de Luiz Gama nos Tribunais',
    summary: 'Luiz Gama utiliza a Lei de 1831 nos fóruns de São Paulo para provar o tráfico ilegal e libertar judicialmente mais de 500 homens e mulheres escravizados.',
    keyFigures: ['Luiz Gama', 'José do Patrocínio', 'André Rebouças'],
    historicalImpact: 'Declarou que a fuga e a defesa da liberdade contra o senhor constituíam legítima defesa humana.',
    relatedPhase: 3,
    icon: '⚖️',
  },
  {
    id: 't_capoeira_crime',
    year: '1890',
    era: 'cultura_afro',
    eraName: 'Cultura Afro-Brasileira',
    title: 'A Criminalização da Capoeira no Código Penal',
    summary: 'O primeiro Código Penal da República decreta a capoeiragem como crime passível de desterro e prisão, tentando conter a força da cultura negra nas ruas.',
    keyFigures: ['Capoeiristas dos Guaiamus e Nagoas'],
    historicalImpact: 'A perseguição forçou a capoeira a se reinventar com toques de aviso como a "Cavalaria" no berimbau.',
    relatedPhase: 4,
    icon: '🥋',
  },
  {
    id: 't_tia_ciata',
    year: '1916',
    era: 'cultura_afro',
    eraName: 'Cultura Afro-Brasileira',
    title: 'Tia Ciata e o Nascimento do Samba Moderno',
    summary: 'Na casa da matriarca e sacerdotisa Tia Ciata na Praça Onze (Pequena África carioca), nasce "Pelo Telefone", considerado o marco do samba gravado.',
    keyFigures: ['Tia Ciata', 'Donga', 'Pixinguinha', 'João da Baiana'],
    historicalImpact: 'O samba transbordou dos terreiros para se consolidar como o patrimônio musical supremo da identidade brasileira.',
    relatedPhase: 4,
    icon: '🪘',
  },
  {
    id: 't_mestre_bimba',
    year: '1937',
    era: 'cultura_afro',
    eraName: 'Cultura Afro-Brasileira',
    title: 'Mestre Bimba e a Legalização da Capoeira',
    summary: 'Mestre Bimba funda o Centro de Cultura Física Regional em Salvador e apresenta a capoeira ao presidente Getúlio Vargas, conquistando sua descriminalização oficial.',
    keyFigures: ['Mestre Bimba (Manoel dos Reis Machado)', 'Mestre Pastinha'],
    historicalImpact: 'Elevou a capoeira ao status de esporte nacional e patrimônio da cultura brasileira.',
    relatedPhase: 4,
    icon: '🪕',
  },
  {
    id: 't_carolina_maria',
    year: '1960',
    era: 'herois_abolicao',
    eraName: 'Heróis da Abolição',
    title: 'Publicação de "Quarto de Despejo"',
    summary: 'Carolina Maria de Jesus, catadora de papel na favela do Canindé, publica seu diário que choca o país e vende mais de 100 mil exemplares em vários idiomas.',
    keyFigures: ['Carolina Maria de Jesus'],
    historicalImpact: 'Voz literária incomparável que denunciou a fome e a desigualdade racial com poesia e crueza sociológica.',
    relatedPhase: 3,
    icon: '📖',
  },
  {
    id: 't_grupo_palmares',
    year: '1971',
    era: 'cidadania_presente',
    eraName: 'Cidadania & Consciência Negra',
    title: 'O Grupo Palmares e a Criação do 20 de Novembro',
    summary: 'Poetas e pesquisadores negros reunidos em Porto Alegre, liderados por Oliveira Silveira, resgatam a data da morte de Zumbi para celebrar o Dia da Consciência Negra.',
    keyFigures: ['Oliveira Silveira', 'Antônio Carlos Côrtes'],
    historicalImpact: 'Substituiu a narrativa passiva do 13 de Maio pelo protagonismo negro inegociável da resistência.',
    relatedPhase: 5,
    icon: '✨',
  },
  {
    id: 't_constituicao_cao',
    year: '1988 - 1989',
    era: 'cidadania_presente',
    eraName: 'Cidadania & Consciência Negra',
    title: 'A Constituição Cidadã e a Lei Caó',
    summary: 'O deputado negro Carlos Alberto Caó de Oliveira redige a lei que torna a prática do racismo crime inafiançável e imprescritível no Brasil.',
    keyFigures: ['Carlos Alberto Caó', 'Benedita da Silva'],
    historicalImpact: 'Marco jurídico divisor de águas na punição à discriminação racial no país.',
    relatedPhase: 5,
    icon: '⚖️',
  },
  {
    id: 't_lei_10639',
    year: '2003',
    era: 'cidadania_presente',
    eraName: 'Cidadania & Consciência Negra',
    title: 'Promulgação da Lei Federal 10.639/03',
    summary: 'Torna-se obrigatório o ensino de História e Cultura Afro-Brasileira em todas as escolas de educação básica do país.',
    keyFigures: ['Movimento Negro Unificado', 'Professores e Educadores'],
    historicalImpact: 'Revolucionou a educação ao exigir o resgate das contribuições africanas nas ciências, artes e política brasileiras.',
    relatedPhase: 5,
    icon: '🎓',
  },
  {
    id: 't_cotas_unesco',
    year: '2012 - 2014',
    era: 'cidadania_presente',
    eraName: 'Cidadania & Consciência Negra',
    title: 'Lei de Cotas e Capoeira como Patrimônio da Humanidade',
    summary: 'A Lei 12.711/12 consolida as cotas raciais e sociais nas universidades federais. Em 2014, a UNESCO declara a Roda de Capoeira Patrimônio Cultural Imaterial da Humanidade.',
    keyFigures: ['Comunidade Acadêmica Negra', 'Mestres de Capoeira'],
    historicalImpact: 'Multiplicou a presença de negros no ensino superior e coroou a capoeira mundialmente.',
    relatedPhase: 5,
    icon: '🏆',
  },
  {
    id: 't_feriado_nacional',
    year: '2023 - Presente',
    era: 'cidadania_presente',
    eraName: 'Cidadania & Consciência Negra',
    title: '20 de Novembro Oficializado como Feriado Nacional',
    summary: 'Sancionada a Lei Federal 14.759 oficializando o Dia Nacional de Zumbi e da Consciência Negra como feriado em todo o território brasileiro.',
    keyFigures: ['População Negra e Toda a Sociedade Brasileira'],
    historicalImpact: 'Momento supremo de consagração e reflexão cívica nacional sobre igualdade, memória e respeito.',
    relatedPhase: 5,
    icon: '🇧🇷',
  },
];

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToPhase?: (phaseId: number) => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({
  isOpen,
  onClose,
  onJumpToPhase,
}) => {
  const [selectedEra, setSelectedEra] = useState<string>('todas');
  const [activeEvent, setActiveEvent] = useState<TimelineEvent>(TIMELINE_EVENTS[0]);

  if (!isOpen) return null;

  const eras = [
    { id: 'todas', name: 'Toda a Linha do Tempo' },
    { id: 'africa_antiga', name: 'África Antiga' },
    { id: 'resistencia_quilombos', name: 'Palmares & Resistência' },
    { id: 'herois_abolicao', name: 'Heróis & Abolição' },
    { id: 'cultura_afro', name: 'Cultura & Ritmos' },
    { id: 'cidadania_presente', name: 'Cidadania & Presente' },
  ];

  const filteredEvents = TIMELINE_EVENTS.filter(
    (ev) => selectedEra === 'todas' || ev.era === selectedEra
  );

  const handleSelectEvent = (ev: TimelineEvent) => {
    setActiveEvent(ev);
    audioService.playDialogueBlip();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[750px] bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-300 font-display tracking-wide flex items-center gap-2">
                Linha do Tempo · Raízes da Liberdade
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 font-mono">
                  Século XIV ao Presente
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Os grandes marcos da civilização, resistência e igualdade afro-brasileira
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playDialogueBlip();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition cursor-pointer"
            aria-label="Fechar Linha do Tempo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 bg-stone-950/70 border-b border-stone-800 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <span className="text-xs text-stone-400 font-mono flex items-center gap-1 pl-2">
            <Filter className="w-3.5 h-3.5" />
            Filtrar:
          </span>
          {eras.map((era) => (
            <button
              key={era.id}
              onClick={() => {
                setSelectedEra(era.id);
                audioService.playDialogueBlip();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition cursor-pointer ${
                selectedEra === era.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {era.name}
            </button>
          ))}
        </div>

        {/* Content split pane */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Scrollable Timeline milestones */}
          <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-stone-800 overflow-y-auto p-4 space-y-3">
            <div className="relative pl-6 before:content-[''] before:absolute before:top-2 before:bottom-2 before:left-2.5 before:w-0.5 before:bg-stone-800">
              {filteredEvents.map((ev) => {
                const isSelected = activeEvent?.id === ev.id;
                return (
                  <div
                    key={ev.id}
                    onClick={() => handleSelectEvent(ev)}
                    className={`relative mb-3.5 p-3.5 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-md text-stone-100'
                        : 'bg-stone-900/70 hover:bg-stone-800/60 border-stone-800 text-stone-300'
                    }`}
                  >
                    {/* Node dot on the timeline track */}
                    <div
                      className={`absolute -left-[22px] top-4 w-3.5 h-3.5 rounded-full border-2 transition ${
                        isSelected
                          ? 'bg-amber-400 border-amber-300 ring-4 ring-amber-500/20'
                          : 'bg-stone-900 border-stone-600'
                      }`}
                    />

                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold font-mono text-amber-400">
                        {ev.year}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-400 font-mono">
                        Fase {ev.relatedPhase}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-display flex items-center gap-2">
                      <span>{ev.icon}</span>
                      <span>{ev.title}</span>
                    </h4>

                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {ev.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed event card */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-stone-900 to-stone-950">
            {activeEvent && (
              <div className="max-w-xl mx-auto space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400 block mb-1">
                      {activeEvent.eraName} · {activeEvent.year}
                    </span>
                    <h3 className="text-2xl font-bold text-amber-300 font-display flex items-center gap-2.5">
                      <span className="text-3xl">{activeEvent.icon}</span>
                      <span>{activeEvent.title}</span>
                    </h3>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded bg-stone-800 border border-stone-700 text-stone-300 font-mono shrink-0">
                    Fase {activeEvent.relatedPhase}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800/80 text-stone-200 text-sm leading-relaxed">
                  {activeEvent.summary}
                </div>

                {/* Key figures */}
                <div>
                  <h5 className="text-xs font-bold text-stone-400 font-mono uppercase tracking-wider mb-2">
                    Personalidades & Líderes Envolvidos:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {activeEvent.keyFigures.map((fig) => (
                      <span
                        key={fig}
                        className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-medium"
                      >
                        {fig}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Historical significance */}
                <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Impacto Histórico & Legado
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {activeEvent.historicalImpact}
                  </p>
                </div>

                {/* Action button to jump to phase */}
                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <div className="text-xs text-stone-400">
                    Aprofunde este momento na jornada do jogo:
                  </div>

                  {onJumpToPhase && (
                    <button
                      onClick={() => {
                        onJumpToPhase(activeEvent.relatedPhase);
                        onClose();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs transition cursor-pointer shadow-md"
                    >
                      <span>Jogar Fase {activeEvent.relatedPhase}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
