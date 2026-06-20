/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Trophy, Volume2, VolumeX, Flame, Calendar, Sparkles, Clock, 
  HelpCircle, ArrowRight, CheckCircle2, ChevronRight, Award, Compass, 
  Share2, Heart, RefreshCw, BarChart2, Star, BookOpenCheck
} from 'lucide-react';
import { SPANISH_MONTHS, SPANISH_DAYS, THEORY_NOTES, WordItem } from './data';
import { 
  GameWordCatcher, GameMemory, GameOrder, GameArcher, GameLetterChef, GameTrueFalse, GameSentenceFill, GAMES_LIST
} from './games';

export default function App() {
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streak, setStreak] = useState(1);
  const [highScores, setHighScores] = useState<Record<string, number>>({
    game1: 0,
    game2: 0,
    game3: 0,
    game4: 0,
    game5: 0,
    game6: 0,
    game7: 0,
  });
  
  // Game state
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'dictionary' | 'games' | 'stats'>('all');

  // Load stats and high scores from localStorage
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('arm_esp_highscores');
      if (savedScores) {
        setHighScores(JSON.parse(savedScores));
      }
      const savedStreak = localStorage.getItem('arm_esp_streak');
      if (savedStreak) {
        setStreak(parseInt(savedStreak, 10));
      }
    } catch (e) {
      // Local storage unavailable (e.g. sandboxed environment)
    }
  }, []);

  const handleUpdateHighScore = (gameId: string, score: number) => {
    setHighScores(prev => {
      const currentHigh = prev[gameId] || 0;
      if (score > currentHigh) {
        const updated = { ...prev, [gameId]: Math.round(score) };
        try {
          localStorage.setItem('arm_esp_highscores', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      }
      return prev;
    });

    // Increment streak on playing games
    setStreak(s => {
      const newStreak = s + 1;
      try {
        localStorage.setItem('arm_esp_streak', newStreak.toString());
      } catch (e) {}
      return newStreak;
    });
  };

  const handleResetScores = () => {
    const emptyScores = {
      game1: 0,
      game2: 0,
      game3: 0,
      game4: 0,
      game5: 0,
      game6: 0,
      game7: 0,
    };
    setHighScores(emptyScores);
    setStreak(1);
    try {
      localStorage.setItem('arm_esp_highscores', JSON.stringify(emptyScores));
      localStorage.setItem('arm_esp_streak', '1');
    } catch (e) {}
  };

  const handleSpeakWithSpeechMock = (word: WordItem) => {
    if (!soundEnabled) return;

    // Use Speech Synthesis with high compatibility fallback
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        // Try pronouncing Spanish word
        const utterance = new SpeechSynthesisUtterance(word.spanish);
        utterance.lang = 'es-ES';
        utterance.rate = 0.85; // slightly slower for language learners
        utterance.volume = 0.8;
        
        // Find Spanish voice if possible
        const voices = window.speechSynthesis.getVoices();
        const esVoice = voices.find(v => v.lang.startsWith('es-'));
        if (esVoice) utterance.voice = esVoice;

        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      // Safe fallback if speech synthesis is blocked
    }
  };

  // Keep a small reactive window speech voices loader
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Compute calculated statistics
  const totalHighScore = Object.values(highScores).reduce((a: number, b: number) => a + b, 0) as number;
  const totalGamesPlayed = Object.values(highScores).filter((s: number) => s > 0).length as number;
  
  // Calculate level based on total score
  const masteryLevel = Math.min(10, Math.floor(totalHighScore / 400) + 1);
  const masteryRank = 
    totalHighScore === 0 ? 'Սկսնակ' :
    totalHighScore < 800 ? 'Հետազոտող' :
    totalHighScore < 1850 ? 'Փորձառու' :
    totalHighScore < 3200 ? 'Ժամանակի Տիրակալ' : 'Իսպաներենի Վարպետ';

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden pb-12">
      
      {/* Visual background ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 relative z-10 flex flex-col gap-6">
        
        {/* Navigation & Header */}
        <header className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-950/40">
              📅
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-650/15 text-red-400 border border-red-500/20 rounded-md font-mono tracking-widest uppercase">ARM 🇦🇲</span>
                <span className="text-slate-500 text-[10px]">&rarr;</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 rounded-md font-mono tracking-widest uppercase">ESP 🇪🇸</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-0.5">
                Ամիսներ և Օրեր • Meses y Días
              </h1>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* Active streak */}
            <span className="text-xs text-amber-400 bg-slate-900/60 p-2 rounded-xl border border-slate-800 flex items-center gap-1.5 font-mono shadow-sm">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>Ակտիվություն՝ <strong className="font-extrabold">{streak} օր</strong></span>
            </span>

            {/* Level indicator */}
            <span className="text-xs text-indigo-400 bg-slate-900/60 p-2 rounded-xl border border-slate-800 flex items-center gap-1.5 font-mono shadow-sm">
              <Star className="w-4 h-4 text-indigo-400 fill-indigo-400" />
              <span>Մակարդակ՝ <strong className="font-extrabold">{masteryLevel}</strong></span>
            </span>

            {/* Sound enable button */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if(!soundEnabled) {
                  try {
                    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain); gain.connect(ctx.destination);
                    gain.gain.setValueAtTime(0.04, ctx.currentTime);
                    osc.start(); osc.stop(ctx.currentTime + 0.08);
                  } catch(e){}
                }
              }}
              className={`p-2.5 rounded-xl transition border cursor-pointer ${
                soundEnabled 
                  ? 'bg-indigo-650 hover:bg-indigo-600 text-indigo-100 border-indigo-500/30' 
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-500 border-slate-800'
              }`}
              title={soundEnabled ? "Անջատել ձայնը" : "Միացնել ձայնը"}
            >
              {soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
            </button>
          </div>
        </header>

        {/* Interactive Bento Category Selector */}
        {!activeGameId && (
          <div className="bg-slate-800/20 border border-slate-750 p-1.5 rounded-2xl flex max-w-lg w-full mx-auto gap-1 shadow-inner relative z-10 animate-fadeIn">
            {[
              { id: 'all', title: 'Բոլորը', icon: BookOpen },
              { id: 'dictionary', title: 'Բառարան', icon: Calendar },
              { id: 'games', title: 'Խաղեր (6)', icon: Sparkles },
              { id: 'stats', title: 'Ռեկորդներ', icon: Trophy }
            ].map((btn) => {
              const isActive = dashboardFilter === btn.id;
              const Icon = btn.icon;
              return (
                <button
                  key={btn.id}
                  onClick={() => setDashboardFilter(btn.id as any)}
                  className={`flex-1 py-2 rounded-xl text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-500/40 shadow-md font-bold'
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{btn.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!activeGameId ? (
            <motion.div
              key="bento-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-12 gap-5 relative z-10"
            >
              {/* MONTHS SECTION (BENTO CARD) */}
              {(dashboardFilter === 'all' || dashboardFilter === 'dictionary') && (
                <motion.div 
                  layout
                  className="col-span-12 md:col-span-6 lg:col-span-4 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Yearly Cycle • Ամիսներ</span>
                      </h3>
                      <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded-md">
                        12 ամիս
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-[11px] font-medium">
                      {SPANISH_MONTHS.map((month) => {
                        const isSelected = selectedWord?.id === month.id;
                        return (
                          <button
                            key={month.id}
                            onClick={() => {
                              setSelectedWord(month);
                              handleSpeakWithSpeechMock(month);
                            }}
                            className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer select-none flex flex-col items-center justify-center ${
                              isSelected
                                ? "bg-indigo-650 text-white border-indigo-400 font-bold shadow-md transform scale-[1.03]"
                                : "bg-slate-900/55 text-slate-300 border-slate-800 hover:bg-slate-750/50 hover:text-white hover:border-slate-700"
                            }`}
                          >
                            <span className="text-[9px] opacity-65 font-mono mb-0.5">
                              {month.number}
                            </span>
                            <span className="font-semibold tracking-wide text-xs truncate max-w-full">
                              {month.spanish.substring(0, 3).toUpperCase()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-800/40 text-[10.5px] text-slate-400 leading-snug font-light">
                    💡 Սեղմիր ցանկացած ամսվա վրա՝ լսելու արտասանությունը և իմանալու անվան ծագումը:
                  </div>
                </motion.div>
              )}

              {/* DAYS SECTION (BENTO CARD) */}
              {(dashboardFilter === 'all' || dashboardFilter === 'dictionary') && (
                <motion.div 
                  layout
                  className="col-span-12 md:col-span-6 lg:col-span-3 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Timeline • Օրեր</span>
                      </h3>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                        7 օր
                      </span>
                    </div>
                    
                    <ul className="space-y-1.5">
                      {SPANISH_DAYS.map((day) => {
                        const isSelected = selectedWord?.id === day.id;
                        const isWeekend = day.id === 'd6' || day.id === 'd7';
                        return (
                          <li
                            key={day.id}
                            onClick={() => {
                              setSelectedWord(day);
                              handleSpeakWithSpeechMock(day);
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer select-none border text-xs ${
                              isSelected
                                ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40 font-bold"
                                : "bg-slate-900/40 text-slate-350 border-transparent hover:bg-slate-800/50 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${isWeekend ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400'}`} />
                              <span className="font-medium">{day.spanish}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-light truncate max-w-[90px]">
                              {day.armenian}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="text-[10px] text-slate-500 pt-2 text-center border-t border-slate-800/40 mt-3 italic">
                    Շաբաթ և Կիրակի — weekend!
                  </div>
                </motion.div>
              )}

              {/* WORD DETAIL / INSPECTOR BENTO BOX */}
              {(dashboardFilter === 'all' || dashboardFilter === 'dictionary') && (
                <motion.div 
                  layout
                  className="col-span-12 lg:col-span-5 bg-gradient-to-br from-indigo-950/30 to-slate-900/60 border border-slate-700/50 rounded-3xl p-5 flex flex-col justify-between"
                >
                  <AnimatePresence mode="wait">
                    {selectedWord ? (
                      <motion.div
                        key={selectedWord.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="h-full flex flex-col justify-between space-y-4"
                      >
                        <div>
                          <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded uppercase">
                              Բառի մանրամասն ({selectedWord.type === 'month' ? 'Ամիս' : 'Շաբաթվա օր'})
                            </span>
                            <span className="text-xs font-mono text-slate-500 font-semibold">#{selectedWord.number}</span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div>
                              <h3 className="text-3xl font-extrabold text-white tracking-wide font-display">{selectedWord.spanish}</h3>
                              <p className="text-xs text-slate-400 font-mono mt-0.5 italic">
                                [{selectedWord.pronunciationAr}]
                              </p>
                            </div>
                            
                            <button
                              onClick={() => handleSpeakWithSpeechMock(selectedWord)}
                              className="p-3 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 rounded-2xl transition cursor-pointer flex items-center justify-center shadow"
                              title="Լսել արտասանությունը"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                              <span className="text-[9px] text-slate-500 uppercase block font-mono font-bold">Հայերեն</span>
                              <span className="text-sm font-bold text-indigo-300 block mt-0.5">{selectedWord.armenian}</span>
                            </div>
                            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                              <span className="text-[9px] text-slate-500 uppercase block font-mono font-bold">Լատինատառ</span>
                              <span className="text-xs font-medium text-slate-300 block mt-1">{selectedWord.armenianLat}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 mt-4">
                          <span className="text-[9px] uppercase tracking-wider font-mono text-indigo-400 font-extrabold block mb-1">🏛️ Proviene de Roma / Պատմությունը</span>
                          <p className="text-[11.5px] text-slate-300 leading-relaxed italic">
                            {selectedWord.funFact}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-3">
                        <div className="w-12 h-12 bg-slate-900 border border-slate-800 text-slate-350 text-lg rounded-2xl flex items-center justify-center">
                          💡
                        </div>
                        <h4 className="text-sm font-semibold text-slate-200">Ընտրի՛ր օր կամ ամիս</h4>
                        <p className="text-xs text-slate-550 max-w-sm leading-relaxed font-light">
                          Սեղմի՛ր ձախ կողմում գտնվող բառերի վրա՝ արտասանությունը լսելու և լատինական պատմության մեջ դրանց անվանումների ծագումն իմանալու համար:
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* 6 GAMES GRID HEADER & CONTAINER */}
              {(dashboardFilter === 'all' || dashboardFilter === 'games') && (
                <motion.div 
                  layout
                  className="col-span-12 bg-slate-800/20 border border-slate-700/30 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center mt-2 gap-2"
                >
                  <div className="text-center sm:text-left">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                      <span>Զարգացնող մինի խաղեր • 6 Խաղերով ուսուցում</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-light mt-0.5">Բոլոր ռեկորդները պահվում են ավտոմատ կերպով: Հավաքի՛ր միավորներ մակարդակդ բարձրացնելու համար:</p>
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-[#4F46E5]/15 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full uppercase">
                    Ընդհանուր՝ 6 զարգացնող խաղեր
                  </span>
                </motion.div>
              )}

              {/* THE 6 COLORFUL GAMES CARDS (Bento sub-layout matches color presets) */}
              {(dashboardFilter === 'all' || dashboardFilter === 'games') && (
                GAMES_LIST.map((game, idx) => {
                  const colors = [
                    { bg: "bg-indigo-600 hover:bg-indigo-500", textLight: "text-indigo-100", textMuted: "text-indigo-200/70" },
                    { bg: "bg-emerald-600 hover:bg-emerald-500", textLight: "text-emerald-100", textMuted: "text-emerald-200/70" },
                    { bg: "bg-amber-600 hover:bg-amber-500", textLight: "text-amber-100", textMuted: "text-amber-200/70" },
                    { bg: "bg-rose-600 hover:bg-rose-500", textLight: "text-rose-100", textMuted: "text-rose-200/70" },
                    { bg: "bg-violet-600 hover:bg-violet-500", textLight: "text-violet-100", textMuted: "text-violet-200/70" },
                    { bg: "bg-sky-600 hover:bg-sky-500", textLight: "text-sky-100", textMuted: "text-sky-200/70" },
                  ];
                  const themeColor = colors[idx % colors.length];
                  const score = highScores[game.id] || 0;

                  return (
                    <motion.div
                      layout
                      key={game.id}
                      id={`game-card-${game.id}`}
                      className={`col-span-12 md:col-span-6 lg:col-span-4 ${themeColor.bg} rounded-3xl p-5 flex flex-col justify-between min-h-[230px] transform hover:scale-[1.01] transition-all duration-200 shadow-md relative group`}
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-semibold bg-white/15 border border-white/20 text-white px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                            {game.badge}
                          </span>
                          <span className="text-[10px] text-white/50 font-mono font-bold">ԽԱՂ #{idx + 1}</span>
                        </div>
                        
                        <h4 className="text-lg font-bold text-white tracking-tight mt-3 leading-tight">{game.title.split('•')[0].trim()}</h4>
                        <h5 className="text-[11px] font-medium text-white/80 font-mono mt-0.5 mb-1.5">{game.subtitle}</h5>
                        
                        <p className="text-xs text-white/95 leading-relaxed font-light mt-1.5 line-clamp-3">
                          {game.description}
                        </p>
                        <p className="text-[10px] text-white/85 italic mt-1.5 leading-tight">
                          {game.tagline}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                        <div className="text-[11px] font-mono text-white/90">
                          Ռեկորդ՝ <strong className="text-white font-extrabold font-mono">{score}</strong> 🏆
                        </div>
                        <button
                          id={`play-${game.id}-btn`}
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setActiveGameId(game.id);
                          }}
                          className="px-4.5 py-1.5 bg-white text-slate-900 hover:scale-[1.03] active:scale-[0.98] font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer border border-transparent shadow"
                        >
                          <span>ՍԿՍԵԼ</span> <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* ACADEMIC THEORY & RULE SET CARD */}
              {(dashboardFilter === 'all' || dashboardFilter === 'dictionary') && (
                <motion.div 
                  layout
                  className="col-span-12 md:col-span-7 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                      <BookOpenCheck className="w-4 h-4 text-indigo-400" />
                      <span>Իսպաներեն օրացույցի կանոնները • Reglas Teóricas</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {THEORY_NOTES.map((note, idx) => (
                        <div 
                          key={idx} 
                          className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/60 transition"
                        >
                          <h4 className="text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5 uppercase font-mono">
                            <span className="text-indigo-400 font-extrabold">{idx + 1}.</span> {note.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-light">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/40 text-[11px] text-slate-550 italic">
                    💡 Փորձե՛ք կիրառել այս կանոնները անագրամաներ լուծելիս և վիկտորինաներ անցնելիս:
                  </div>
                </motion.div>
              )}

              {/* ACCURACY & YOUR STATS MASTERY */}
              {(dashboardFilter === 'all' || dashboardFilter === 'stats') && (
                <motion.div 
                  layout
                  className="col-span-12 md:col-span-5 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                        <span>Քո լեզվական վիճակագրությունը</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-900/60 p-3 border border-slate-800 rounded-xl text-center">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-mono">Միավորներ</span>
                        <h3 className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">{totalHighScore}</h3>
                      </div>

                      <div className="bg-slate-900/60 p-3 border border-slate-800 rounded-xl text-center">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-mono">Պատրաստվածություն</span>
                        <h3 className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
                          {Math.min(100, Math.round((totalHighScore / 3000) * 100))}%
                        </h3>
                      </div>

                      <div className="bg-slate-900/60 p-3 border border-slate-800 rounded-xl text-center">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-mono">Մակարդակ</span>
                        <h3 className="text-xs font-bold text-slate-200 block mt-1.5 truncate">{masteryLevel} / 10</h3>
                      </div>
                    </div>

                    <div className="mt-4 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 text-center">
                      <span className="text-[9px] text-slate-500 uppercase font-mono block">Քո պատվավոր կարգավիճակը</span>
                      <p className="text-xs font-semibold text-slate-300 mt-0.5 leading-tight">{masteryRank}</p>
                    </div>

                    <div className="mt-4 space-y-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                      {GAMES_LIST.map((game) => {
                        const gscore = highScores[game.id] || 0;
                        const gratio = Math.min(100, Math.round((gscore / 800) * 100));
                        return (
                          <div key={game.id} className="text-[11px] flex justify-between items-center">
                            <span className="text-slate-455 truncate w-32">{game.title.split('•')[0]}</span>
                            <div className="flex-1 mx-2 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div style={{ width: `${gratio}%` }} className="bg-gradient-to-r from-indigo-500 to-sky-500 h-full rounded-full" />
                            </div>
                            <span className="font-mono text-amber-400 font-bold">{gscore}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center gap-2">
                    <span className="text-[9px] text-slate-500 font-mono">
                      HTML5 LocalStorage
                    </span>
                    <button
                      onClick={() => {
                        if(window.confirm('Իսկապե՞ս ցանկանում եք ջնջել ուսման ողջ վիճակագրությունը և սկսել նորից:')) {
                          handleResetScores();
                        }
                      }}
                      className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-semibold transition cursor-pointer"
                    >
                      Ջնջել ամբողջը
                    </button>
                  </div>
                </motion.div>
              )}

              {/* CULTURAL VOCABULARY REFERENCE SHEET */}
              {(dashboardFilter === 'all' || dashboardFilter === 'dictionary') && (
                <motion.div 
                  layout
                  className="col-span-12 md:col-span-6 lg:col-span-4 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2.5 flex items-center gap-1.5">
                      <span>🇦🇲 &rarr; 🇪🇸</span>
                      <span>Օգտակար բառապաշար</span>
                    </h3>

                    <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                        <span className="text-slate-400">Hoy (Այսօր)</span>
                        <strong className="text-white font-mono">[օյ]</strong>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                        <span className="text-slate-400">Mañana (Վաղը)</span>
                        <strong className="text-white font-mono">[մանյանա]</strong>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                        <span className="text-slate-400">Ayer (Երեկ)</span>
                        <strong className="text-white font-mono">[այեռ]</strong>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                        <span className="text-slate-400">Semana (Շաբաթ)</span>
                        <strong className="text-white font-mono">[սեմանա]</strong>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                        <span className="text-slate-400">Mes (Ամիս)</span>
                        <strong className="text-white font-mono">[մես]</strong>
                      </div>
                      <div className="flex justify-between items-center pb-0.5">
                        <span className="text-slate-400">Año (Տարի)</span>
                        <strong className="text-white font-mono">[անյո]</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 italic mt-3 text-center">
                    🗣️ Փորձի՛ր ասել. «Hoy es martes»:
                  </div>
                </motion.div>
              )}

              {/* QUESTS AND STUDENTS ONLINE TICKER */}
              {(dashboardFilter === 'all' || dashboardFilter === 'games' || dashboardFilter === 'stats') && (
                <motion.div 
                  layout
                  className="col-span-12 md:col-span-6 lg:col-span-4 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2.5 flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>Շաբաթվա միկրո-առաջադրանքը</span>
                    </h3>

                    <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-xs text-left">
                      <p className="text-slate-300 leading-relaxed font-light">
                        Ստացի՛ր ավելի քան <strong className="text-amber-400 font-bold">300 միավոր</strong> «Մեմորի» խաղում՝ պատվավոր աստղը բացելու համար!
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 bg-amber-500/10 border border-amber-500/15 p-1 rounded-lg">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping ml-1" />
                        <span className="text-[9px] text-amber-455 font-mono font-bold uppercase tracking-wider">Նպատակն ակտիվ է</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center pt-3 border-t border-slate-800/40">
                    <div className="flex -space-x-1.5">
                      <div className="w-6.5 h-6.5 rounded-full border-1.5 border-slate-900 bg-red-600 text-[8px] font-bold flex items-center justify-center">🇦🇲</div>
                      <div className="w-6.5 h-6.5 rounded-full border-1.5 border-slate-900 bg-yellow-500 text-[8px] font-bold flex items-center justify-center text-slate-900">🇪🇸</div>
                      <div className="w-6.5 h-6.5 rounded-full border-1.5 border-slate-900 bg-sky-500 text-[8px] font-bold flex items-center justify-center">🌍</div>
                      <div className="w-6.5 h-6.5 rounded-full border-1.5 border-slate-900 bg-slate-700 flex items-center justify-center text-[8px] font-mono font-bold text-slate-200">+18</div>
                    </div>
                    <p className="text-[10px] text-slate-400 ml-3 uppercase font-bold tracking-wider font-mono">
                      Ուսանողներ առցանց
                    </p>
                  </div>
                </motion.div>
              )}

              {/* FOOTER BENTO CARD BAR */}
              <motion.footer 
                layout
                className="col-span-12 text-center py-4 bg-slate-800/30 border border-slate-700/50 p-4 rounded-2xl text-[11px] text-slate-400 leading-relaxed mt-2"
              >
                Մշակված է հատուկ ուսուցման և ժամանցի համար: Զգա՛ Մադրիդի և Երևանի մթնոլորտը: 🇪🇸✨🇦🇲
              </motion.footer>

            </motion.div>
          ) : (
            /* FULL FOCUS GAME CARD WRAPPER WITH BENTO CARD ESTHETIC */
            <motion.div
              layout
              key="bento-game-panel"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-2 md:p-5 shadow-xl relative z-10"
            >
              {activeGameId === 'game1' && (
                <GameWordCatcher 
                  onBack={() => setActiveGameId(null)}
                  soundEnabled={soundEnabled}
                  onAddScore={handleUpdateHighScore}
                />
              )}
              {activeGameId === 'game2' && (
                <GameMemory 
                  onBack={() => setActiveGameId(null)}
                  soundEnabled={soundEnabled}
                  onAddScore={handleUpdateHighScore}
                />
              )}
              {activeGameId === 'game3' && (
                <GameOrder 
                  onBack={() => setActiveGameId(null)}
                  soundEnabled={soundEnabled}
                  onAddScore={handleUpdateHighScore}
                />
              )}
              {activeGameId === 'game4' && (
                <GameArcher 
                  onBack={() => setActiveGameId(null)}
                  soundEnabled={soundEnabled}
                  onAddScore={handleUpdateHighScore}
                />
              )}
              {activeGameId === 'game5' && (
                <GameLetterChef 
                  onBack={() => setActiveGameId(null)}
                  soundEnabled={soundEnabled}
                  onAddScore={handleUpdateHighScore}
                />
              )}
              {activeGameId === 'game6' && (
                <GameTrueFalse 
                  onBack={() => setActiveGameId(null)}
                  soundEnabled={soundEnabled}
                  onAddScore={handleUpdateHighScore}
                />
              )}
              {activeGameId === 'game7' && (
                <GameSentenceFill 
                  onBack={() => setActiveGameId(null)}
                  soundEnabled={soundEnabled}
                  onAddScore={handleUpdateHighScore}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
