/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, RotateCcw, Play, CheckCircle, XCircle, ChevronRight, 
  HelpCircle, Volume2, VolumeX, Sparkles, AlertCircle, ArrowRight,
  TrendingUp, Compass, Heart, Award, ArrowLeftRight, BookOpenCheck
} from 'lucide-react';
import { WordItem, SPANISH_MONTHS, SPANISH_DAYS } from './data';

// --- Sound Synthesizer Utility (Web Audio API) ---
class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    // resume if suspended (browser security policy)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t); // A4
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.15); // A5
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

      osc.start(t);
      osc.stop(t + 0.2);
    } catch (e) {
      // Ignore audio errors in sandboxed environments
    }
  }

  playFailure() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.linearRampToValueAtTime(150, t + 0.25);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

      osc.start(t);
      osc.stop(t + 0.3);
    } catch (e) {
      // Ignore audio errors
    }
  }

  playBubblePop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.setValueAtTime(1200, t + 0.05);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      osc.start(t);
      osc.stop(t + 0.08);
    } catch (e) {
      // Ignore
    }
  }

  playTick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      osc.start(t);
      osc.stop(t + 0.03);
    } catch (e) {
      // Ignore
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const freqs = [261.63, 329.63, 392.00, 523.25]; // C chord notes
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.connect(g);
        g.connect(this.ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, t + idx * 0.1);
        g.gain.setValueAtTime(0.08, t + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.4);
        o.start(t + idx * 0.1);
        o.stop(t + idx * 0.1 + 0.5);
      });
    } catch (e) {
      // Ignore
    }
  }
}

const sounds = new SoundEffects();

// --- General Helper: Shuffle ---
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

//// Global Games meta to render links and high scores
export const GAMES_LIST = [
  {
    id: 'game1',
    title: 'Atrapa Palabras • Բառի Որսորդ',
    subtitle: 'Բառի որսորդ',
    description: 'Օճառի պղպջակները թռչում են վերև: Հասցրի՛ր պայթեցնել ճիշտ հայերեն թարգմանությամբ պղպջակը, քանի դեռ ժամանակը չի սպառվել:',
    tagline: 'Զարգացնում է արագ արձագանքումը և իսպաներեն բառերի ընթերցանության արագությունը:',
    badge: 'Արձագանք',
    color: 'from-cyan-500 to-blue-600',
    iconName: 'Compass'
  },
  {
    id: 'game2',
    title: 'Parejas Cósmicas • Տիեզերական Զույգեր',
    subtitle: 'Տիեզերական զույգեր',
    description: 'Դասական հիշողության (մեմորի) խաղ: Շրջի՛ր քարտերը և գտի՛ր իսպաներեն և հայերեն անվանումների համապատասխանությունները:',
    tagline: 'Մարզում է տեսողական հիշողությունը և ասոցիատիվ մտածողությունը:',
    badge: 'Հիշողություն',
    color: 'from-indigo-500 to-purple-600',
    iconName: 'Award'
  },
  {
    id: 'game3',
    title: 'El Orden Correcto • Ճիշտ Դասավորություն',
    subtitle: 'Ճիշտ հերթականություն',
    description: 'Փոթորիկը խառնել է օրացույցները: Դասավորի՛ր շաբաթվա օրերը կամ ամիսները ճիշտ ժամանակագրական հաջորդականությամբ:',
    tagline: 'Ամրապնդում է օրացույցի կառուցվածքը և հերթականությունը:',
    badge: 'Հաջորդականություն',
    color: 'from-amber-500 to-orange-600',
    iconName: 'TrendingUp'
  },
  {
    id: 'game4',
    title: 'Flecha Rápida • Արագ Նետ',
    subtitle: 'Արագ նետ (Հրաձգարան)',
    description: 'Իսպաներեն բառը լիցքավորված է աղեղի մեջ: Կրակի՛ր 4 շարժվող թիրախներից մեկին, որն ունի ճիշտ հայերեն թարգմանությունը:',
    tagline: 'Ադրենալինային խաղ բառապաշարի իմացությունը ստուգելու համար:',
    badge: 'Ճշգրտություն',
    color: 'from-emerald-500 to-teal-600',
    iconName: 'Sparkles'
  },
  {
    id: 'game5',
    title: 'Cocina de Letras • Տառերի Խոհանոց',
    subtitle: 'Տառերի շեֆ-խոհարար',
    description: 'Իսպաներեն տառերը թափթփված են խոհանոցային սեղանին: Հավաքի՛ր ճիշտ բառը՝ ըստ առաջարկված հայերեն անվանման:',
    tagline: 'Սովորեցնում է ճիշտ գրելաձևը (ուղղագրությունը) առանց սխալների:',
    badge: 'Ուղղագրություն',
    color: 'from-rose-500 to-pink-600',
    iconName: 'Heart'
  },
  {
    id: 'game6',
    title: '¿Verdad o Falso? • Ճիշտ թե Սխալ',
    subtitle: 'Ճիշտ թե Սխալ',
    description: 'Արագ բլից-հարցում: Խաղը ցույց է տալիս համապատասխանության քարտ: Քո խնդիրն է վայրկյանապես որոշել՝ արդյոք համապատասխանությունը ճիշտ է:',
    tagline: 'Կատարելագործում է բառերի արագ ճանաչումը:',
    badge: 'Ռեֆլեքսներ',
    color: 'from-violet-500 to-fuchsia-600',
    iconName: 'ArrowLeftRight'
  },
  {
    id: 'game7',
    title: 'Completa la Frase • Լրացրո՛ւ նախադասությունը',
    subtitle: 'Լրացրու նախադասությունը',
    description: 'Տրված են իսպաներեն թեմատիկ նախադասություններ շաբաթվա օրերի մասին՝ հայերեն օգնող թարգմանությամբ: Տեղադրի՛ր բաց թողնված ճիշտ բառը:',
    tagline: 'Զարգացնում է կառուցվածքային մտածողությունը և նախադասություններում բառերի օգտագործումը:',
    badge: 'Լրացում',
    color: 'from-blue-500 to-indigo-600',
    iconName: 'BookOpenCheck'
  }
];

interface GameProps {
  onBack: () => void;
  soundEnabled: boolean;
  onAddScore: (gameId: string, score: number) => void;
}

// ============================================
// GAME 1: ATRAPA PALABRAS (Բառի որսորդ)
// ============================================
export function GameWordCatcher({ onBack, soundEnabled, onAddScore }: GameProps) {
  sounds.enabled = soundEnabled;
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordPool, setWordPool] = useState<WordItem[]>([]);
  const [bubbleAnswers, setBubbleAnswers] = useState<{ id: string; text: string; correct: boolean; isPopping?: boolean; xPos: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [feedback, setFeedback] = useState<{ show: boolean; success: boolean; text: string } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize pool of words
  const initGame = (mode: 'months' | 'days' | 'all') => {
    let pool: WordItem[] = [];
    if (mode === 'months') pool = shuffleArray(SPANISH_MONTHS);
    else if (mode === 'days') pool = shuffleArray(SPANISH_DAYS);
    else pool = shuffleArray([...SPANISH_MONTHS, ...SPANISH_DAYS]);
    
    setWordPool(pool);
    setCurrentIndex(0);
    setScore(0);
    setLevel(1);
    setGameState('playing');
    setTimeLeft(12);
    generateRound(pool[0], pool);
  };

  const generateRound = (currentWord: WordItem, pool: WordItem[]) => {
    if (!currentWord) return;
    
    // Choose correct translation
    const correctTranslation = currentWord.armenian;

    // Filter alternatives
    let alternatives = (currentWord.type === 'month' ? SPANISH_MONTHS : SPANISH_DAYS)
      .filter(w => w.spanish !== currentWord.spanish)
      .map(w => w.armenian);

    alternatives = shuffleArray(alternatives).slice(0, 2);
    
    const baseAnswers = [
      { id: 'correct', text: correctTranslation, correct: true },
      { id: 'alt1', text: alternatives[0] || 'Կիրակի', correct: false },
      { id: 'alt2', text: alternatives[1] || 'Հունվար', correct: false }
    ];

    const shuffled = shuffleArray(baseAnswers);
    const positioned = shuffled.map((ans, idx) => {
      // Distribute bubbles in three separate safe columns to prevent overlap and off-screen clipping
      let xPos = 4;
      if (idx === 1) xPos = 38;
      if (idx === 2) xPos = 70;
      return {
        ...ans,
        xPos: xPos + Math.random() * 3
      };
    });

    setBubbleAnswers(positioned);
    setTimeLeft(10 + Math.max(0, 5 - level)); // time gets shorter with levels
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        if (prev < 4) sounds.playTick();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentIndex]);

  const handleTimeout = () => {
    sounds.playFailure();
    setFeedback({
      show: true,
      success: false,
      text: `Ժամանակն սպառվեց: Ճիշտ թարգմանությունը՝ ${wordPool[currentIndex]?.armenian}`
    });
    proceedToNext();
  };

  const handlePopBubble = (bubbleId: string, isCorrect: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setBubbleAnswers(prev => prev.map(b => b.id === bubbleId ? { ...b, isPopping: true } : b));
    sounds.playBubblePop();

    if (isCorrect) {
      sounds.playSuccess();
      const points = timeLeft * 10;
      setScore(s => s + points);
      setFeedback({
        show: true,
        success: true,
        text: `Գերազանց է: +${points} միավոր 🔮`
      });
    } else {
      sounds.playFailure();
      setFeedback({
        show: true,
        success: false,
        text: `Օ՛փս: Սա սխալ է: Ճիշտ պատասխանն է՝ ${wordPool[currentIndex]?.armenian}`
      });
    }

    setTimeout(() => {
      proceedToNext();
    }, 1500);
  };

  const proceedToNext = () => {
    setFeedback(null);
    const nextIdx = currentIndex + 1;
    if (nextIdx < wordPool.length && nextIdx < 10) { // Limit to 10 rounds
      setCurrentIndex(nextIdx);
      setLevel(Math.floor(nextIdx / 3) + 1);
      generateRound(wordPool[nextIdx], wordPool);
    } else {
      setGameState('ended');
      onAddScore('game1', score);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white min-h-[500px] flex flex-col justify-between relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 transition rounded-xl text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Մենյու
        </button>
        <span className="text-sm font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800 px-3 py-1 rounded-full font-sans">
          Atrapa Palabras
        </span>
      </div>

      {gameState === 'intro' && (
        <div className="text-center my-auto py-12 px-4 max-w-md mx-auto z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Բառի Որսորդ • Atrapa Palabras</h2>
          <p className="text-sm text-slate-400 mb-6 font-light">
            Փորձի՛ր արձագանքմանդ արագությունը: Վերևում կհայտնվի ամսվա կամ շաբաթվա օրվա քարտը 
            <span className="text-cyan-300 font-semibold mx-1">իսպաներենով</span>:
            Ներքևից կթռչեն օճառի պղպջակները: Պայթեցրո՛ւ ճիշտ թարգմանությունը <span className="text-cyan-300 font-semibold">հայերենով</span>:
          </p>

          <div className="space-y-2 mb-6">
            <div className="text-xs bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 text-slate-300 flex items-center gap-2">
              <span className="text-lg">🔮</span> Որքան արագ պատասխանես, այնքան շատ բոնուսային միավորներ կստանաս:
            </div>
            <div className="text-xs bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 text-slate-300 flex items-center gap-2">
              <span className="text-lg">⭐</span> Խաղը բաղկացած է 10 փուլից՝ մակարդակի բարձրացմամբ:
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button 
              onClick={() => initGame('all')}
              className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 font-medium rounded-2xl text-slate-950 shadow-md shadow-cyan-400/15 text-sm transition"
            >
              🚀 Խաղալ բոլորը միասին
            </button>
            <button 
              onClick={() => initGame('months')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-700 border border-slate-700 rounded-2xl text-sm transition text-cyan-300"
            >
              📅 Միայն ամիսներ
            </button>
            <button 
              onClick={() => initGame('days')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-700 border border-slate-700 rounded-2xl text-sm transition text-cyan-300"
            >
              📆 Միայն շաբաթվա օրեր
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex-1 flex flex-col justify-between my-4 z-10">
          {/* Status info */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
            <div>Փուլ՝ <span className="text-cyan-400 font-bold">{currentIndex + 1}/10</span></div>
            <div>Մակարդակ՝ <span className="text-cyan-400 font-bold">{level}</span></div>
            <div className="flex items-center justify-center gap-1.5">
              <span>⏰</span>
              <span className={`font-mono text-sm font-bold ${timeLeft <= 3 ? 'text-rose-500 animate-pulse' : 'text-slate-200'}`}>
                {timeLeft} վրկ
              </span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Միավորներ՝ <span className="text-amber-400 font-bold">{score}</span></span>
            </div>
          </div>

          {/* Falling Cloud (Current word to translate) */}
          <div className="my-auto py-6 flex flex-col items-center">
            <motion.div 
              key={currentIndex}
              initial={{ scale: 0.8, y: -40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-slate-800/80 border-2 border-cyan-500/30 px-8 py-5 rounded-3xl shadow-xl shadow-cyan-950/20 text-center relative max-w-xs"
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-0.5 bg-cyan-500 text-[10px] text-slate-900 font-bold rounded-full uppercase tracking-wider">
                {wordPool[currentIndex]?.type === 'month' ? 'Ամիս' : 'Շաբաթվա օր'}
              </div>
              <h1 className="text-3xl font-bold tracking-wide text-cyan-300">{wordPool[currentIndex]?.spanish}</h1>
              {wordPool[currentIndex]?.pronunciationAr && (
                <p className="text-xs text-slate-400 mt-1 font-mono">[{wordPool[currentIndex].pronunciationAr}]</p>
              )}
            </motion.div>
          </div>

          {/* Bubbles Area */}
          <div className="h-44 relative bg-slate-950/20 border border-slate-800/30 rounded-2xl overflow-hidden mb-4">
            {feedback ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs z-30 p-4 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-center">
                    {feedback.success ? (
                      <CheckCircle className="w-12 h-12 text-emerald-500" />
                    ) : (
                      <XCircle className="w-12 h-12 text-rose-500" />
                    )}
                  </div>
                  <p className="font-semibold text-base">{feedback.text}</p>
                  <p className="text-[11px] text-slate-400 italic">“{wordPool[currentIndex]?.funFact.split('(')[1]?.replace(')', '') || wordPool[currentIndex]?.funFact}”</p>
                </motion.div>
              </div>
            ) : null}

            {/* Bubble animations */}
            <div className="absolute inset-x-0 bottom-4 top-0">
              <AnimatePresence>
                {bubbleAnswers.map((bubble, i) => (
                  <motion.button
                    key={bubble.text}
                    initial={{ y: 160, opacity: 0, scale: 0.8 }}
                    animate={{ 
                      y: 10, 
                      opacity: 1, 
                      scale: bubble.isPopping ? 1.4 : 1,
                      x: Math.sin(timeLeft + i) * 5 // slight horizontal waving relative to fixed columns
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ 
                      y: { duration: 6, ease: 'linear' },
                      scale: { type: 'spring', stiffness: bubble.isPopping ? 300 : 100 }
                    }}
                    disabled={!!feedback}
                    onClick={() => handlePopBubble(bubble.id, bubble.correct)}
                    style={{ 
                      position: 'absolute', 
                      left: i === 2 ? 'auto' : `${bubble.xPos}%`, 
                      right: i === 2 ? '4%' : 'auto'
                    }}
                    className={`w-[76px] h-[76px] min-[360px]:w-20 min-[360px]:h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center p-1.5 text-center border font-semibold text-[10px] min-[360px]:text-xs leading-tight transition-all duration-300 backdrop-blur-xs shadow-md shadow-cyan-950/10 cursor-pointer
                      ${bubble.isPopping 
                        ? 'bg-cyan-500 border-white text-slate-900 scale-125 z-20' 
                        : 'bg-cyan-900/45 hover:bg-cyan-800/60 border-cyan-700 text-cyan-100'
                      }`}
                  >
                    <span className="truncate max-w-full">{bubble.text}</span>
                    <span className="text-[7px] min-[360px]:text-[8px] opacity-60 font-light block mt-0.5">Lopni! / Լոպնի՛</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center my-auto py-8 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xs mx-auto bg-slate-800/50 border border-slate-700/60 p-6 rounded-3xl"
          >
            <div className="text-4xl mb-2">🏆</div>
            <h2 className="text-2xl font-bold mb-1 text-cyan-300">Հաղթանա՛կ</h2>
            <p className="text-xs text-slate-400 mb-4">«Բառի որսորդ» խաղը հաջողությամբ ավարտվեց</p>
            
            <div className="space-y-1 mb-6">
              <p className="text-xs text-slate-400">Վաստակած միավորներ՝</p>
              <h3 className="text-4xl font-extrabold text-amber-400 font-mono tracking-tight">{score}</h3>
            </div>

            <p className="text-[11px] text-cyan-400/80 italic mb-6">
              Գերազանց առաջընթաց իսպաներենի օրացույցի ուսումնասիրության մեջ: Շարունակի՛ր նույն ոգով:
            </p>

            <div className="flex gap-2">
              <button 
                onClick={() => setGameState('intro')}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Խաղալ նորից
              </button>
              <button 
                onClick={onBack}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs transition"
              >
                Բոլոր խաղերը
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ============================================
// GAME 2: PAREJAS CÓSMICAS (Տիեզերական Զույգեր / Մեմորի)
// ============================================
interface Card {
  id: string;
  word: string;
  matchKey: string; // The equivalent translation to match
  isFlipped: boolean;
  isMatched: boolean;
  type: 'spanish' | 'armenian';
}

export function GameMemory({ onBack, soundEnabled, onAddScore }: GameProps) {
  sounds.enabled = soundEnabled;
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [selectedDeck, setSelectedDeck] = useState<'months' | 'days'>('days');

  const startMemoryGame = (deck: 'months' | 'days') => {
    setSelectedDeck(deck);
    const wordsSource = deck === 'months' ? SPANISH_MONTHS : SPANISH_DAYS;
    // Choose 6 words to make a 12-card board
    const pickedWords = shuffleArray(wordsSource).slice(0, 6);
    
    let generatedCards: Card[] = [];
    pickedWords.forEach((word, idx) => {
      generatedCards.push({
        id: `es-${idx}`,
        word: word.spanish,
        matchKey: word.armenian,
        isFlipped: false,
        isMatched: false,
        type: 'spanish'
      });
      generatedCards.push({
        id: `ar-${idx}`,
        word: word.armenian,
        matchKey: word.spanish,
        isFlipped: false,
        isMatched: false,
        type: 'armenian'
      });
    });

    setCards(shuffleArray(generatedCards));
    setFlippedIndices([]);
    setMoves(0);
    setGameState('playing');
  };

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) return;

    sounds.playBubblePop();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Flip the clicked card
    setCards(prev => prev.map((card, idx) => idx === index ? { ...card, isFlipped: true } : card));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const first = cards[newFlipped[0]];
      const second = cards[newFlipped[1]];

      if (first.matchKey === second.word) {
        // MATCH!
        setTimeout(() => {
          sounds.playSuccess();
          setCards(prev => prev.map((card, idx) => 
            idx === newFlipped[0] || idx === newFlipped[1] 
              ? { ...card, isMatched: true } 
              : card
          ));
          setFlippedIndices([]);
        }, 600);
      } else {
        // NO MATCH, FLIP BACK
        setTimeout(() => {
          sounds.playFailure();
          setCards(prev => prev.map((card, idx) => 
            idx === newFlipped[0] || idx === newFlipped[1] 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedIndices([]);
        }, 1200);
      }
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && cards.length > 0 && cards.every(c => c.isMatched)) {
      sounds.playFanfare();
      setGameState('ended');
      // Calculate score based on efficiency: best = 6 moves, let's give points: Max 1000 - moves * 25
      const finalScore = Math.max(100, 1000 - moves * 30);
      onAddScore('game2', finalScore);
    }
  }, [cards, gameState]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white min-h-[500px] flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 transition rounded-xl text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Մենյու
        </button>
        <span className="text-sm font-mono text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-800 px-3 py-1 rounded-full font-sans">
          Parejas Cósmicas
        </span>
      </div>

      {gameState === 'intro' && (
        <div className="text-center my-auto py-12 px-4 max-w-sm mx-auto z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Տիեզերական Զույգեր • Parejas Cósmicas</h2>
          <p className="text-sm text-slate-400 mb-6 font-light">
            Խաղադաշտում գտիր իսպաներեն և հայերեն նույն իմաստն ունեցող քարտերը: Կատարիր հնարավորինս քիչ քայլեր:
          </p>

          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => startMemoryGame('days')}
              className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 font-medium rounded-2xl text-slate-950 shadow-md text-sm transition"
            >
              📆 Շաբաթվա օրեր (12 քարտ)
            </button>
            <button 
              onClick={() => startMemoryGame('months')}
              className="px-5 py-3 bg-purple-500 hover:bg-purple-400 active:bg-purple-600 font-medium rounded-2xl text-white shadow-md text-sm transition"
            >
              📅 Ամիսներ (12 քարտ)
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex-1 flex flex-col justify-between my-4 z-10">
          <div className="grid grid-cols-3 gap-1 bg-slate-800/40 p-2.5 rounded-2xl mb-4 border border-slate-800/60 font-mono text-center text-[10px] sm:text-xs">
            <div>Թեմա՝ <span className="text-indigo-300 font-bold">{selectedDeck === 'days' ? 'Օրեր' : 'Ամիսներ'}</span></div>
            <div>Քայլեր՝ <span className="text-indigo-300 font-bold">{moves}</span></div>
            <div>Գտնված է՝ <span className="text-emerald-400 font-bold">{cards.filter(c => c.isMatched).length / 2} / 6</span></div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 my-auto max-w-md mx-auto w-full">
            {cards.map((card, idx) => (
              <div 
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className="aspect-square relative cursor-pointer select-none"
              >
                <div 
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 flex items-center justify-center p-2 text-center text-[10px] min-[360px]:text-[11px] sm:text-xs font-semibold border-2 shadow-sm
                    ${card.isMatched 
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 pointer-events-none' 
                      : card.isFlipped 
                        ? 'bg-indigo-900/60 border-indigo-400 text-slate-100' 
                        : 'bg-slate-800/90 border-slate-700/60 hover:border-slate-600 text-slate-400'
                    }`}
                >
                  {card.isMatched || card.isFlipped ? (
                    <motion.span 
                      initial={{ scale: 0.8 }} 
                      animate={{ scale: 1 }}
                      className="break-words w-full"
                    >
                      {card.word}
                    </motion.span>
                  ) : (
                    <span className="text-lg font-bold opacity-35 text-indigo-400 font-sans">❓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center my-auto py-8 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xs mx-auto bg-slate-800/50 border border-slate-700/60 p-6 rounded-3xl"
          >
            <div className="text-4xl mb-2">🪐</div>
            <h2 className="text-2xl font-bold mb-1 text-indigo-300">Հիանալի՛ է:</h2>
            <p className="text-xs text-slate-400 mb-4">Դու գտար բոլոր տիեզերական համապատասխանությունները:</p>
            
            <div className="grid grid-cols-2 gap-2 mb-6 text-sm font-mono">
              <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                <span className="block text-[10px] text-slate-500 uppercase">Ընդհանուր քայլեր</span>
                <span className="text-lg font-bold text-slate-200">{moves}</span>
              </div>
              <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                <span className="block text-[10px] text-slate-500 uppercase">Միավորներ</span>
                <span className="text-lg font-bold text-amber-400">{Math.max(100, 1000 - moves * 30)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setGameState('intro')}
                className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Նոր խաղ
              </button>
              <button 
                onClick={onBack}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs transition"
              >
                Բոլոր խաղերը
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ============================================
// GAME 3: EL ORDEN CORRECTO (Ճիշտ դասավորություն)
// ============================================
export function GameOrder({ onBack, soundEnabled, onAddScore }: GameProps) {
  sounds.enabled = soundEnabled;
  const [selectedDeck, setSelectedDeck] = useState<'months' | 'days'>('days');
  const [shuffledItems, setShuffledItems] = useState<WordItem[]>([]);
  const [userQueue, setUserQueue] = useState<WordItem[]>([]);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [errorFlash, setErrorFlash] = useState(false);

  const startOrderGame = (deck: 'months' | 'days') => {
    setSelectedDeck(deck);
    let items: WordItem[] = [];
    if (deck === 'days') {
      items = [...SPANISH_DAYS];
    } else {
      // Pick 6 random months to keep order challenge fun
      items = shuffleArray(SPANISH_MONTHS).slice(0, 6);
    }
    
    setShuffledItems(shuffleArray(items));
    setUserQueue([]);
    setGameState('playing');
  };

  const handleItemSelect = (item: WordItem) => {
    // Find expected next item in the chronological sort of STILL REMAINING or total
    // The correctly sorted items of our subset:
    const correctSorted = [...shuffledItems].sort((a, b) => a.number - b.number);
    const expectedNext = correctSorted[userQueue.length];

    if (item.id === expectedNext.id) {
      sounds.playSuccess();
      const newQueue = [...userQueue, item];
      setUserQueue(newQueue);
      setShuffledItems(prev => prev.filter(i => i.id !== item.id));

      if (newQueue.length === correctSorted.length) {
        sounds.playFanfare();
        setTimeout(() => {
          setGameState('ended');
          onAddScore('game3', deckBonusPoints());
        }, 800);
      }
    } else {
      sounds.playFailure();
      setErrorFlash(true);
      setTimeout(() => setErrorFlash(false), 500);
    }
  };

  const deckBonusPoints = () => {
    return selectedDeck === 'days' ? 400 : 600;
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white min-h-[500px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${errorFlash ? 'ring-4 ring-rose-500/50 bg-rose-950/20' : ''}`}>
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 transition rounded-xl text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Մենյու
        </button>
        <span className="text-sm font-mono text-amber-400 font-bold bg-amber-950/40 border border-amber-800 px-3 py-1 rounded-full font-sans">
          El Orden Correcto
        </span>
      </div>

      {gameState === 'intro' && (
        <div className="text-center my-auto py-12 px-4 max-w-sm mx-auto z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Ճիշտ Հերթականություն • El Orden</h2>
          <p className="text-sm text-slate-400 mb-6 font-light">
            Օրացույցային մրրիկը ամեն ինչ խառնել է: Սեղմի՛ր բառերին հերթով՝ սկսած ամենավաղ օրվանից/ամսից:
          </p>

          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => startOrderGame('days')}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 font-medium rounded-2xl text-slate-950 shadow-md text-sm transition"
            >
              📆 Երկուշաբթի ➜ Կիրակի
            </button>
            <button 
              onClick={() => startOrderGame('months')}
              className="px-5 py-3 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 font-medium rounded-2xl text-white shadow-md text-sm transition"
            >
              📅 Ամիսների ժամանակագրությամբ
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex-1 flex flex-col justify-between my-4 z-10">
          <div className="text-center mb-4">
            <p className="text-xs text-slate-400">Քո խնդիրն է հավաքել ճիշտ հաջորդականությունը ձախ սյունակում/բջիջներում.</p>
            {errorFlash && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-xs text-rose-400 font-semibold mt-1"
              >
                ❌ Սխալ: Սա տրամաբանորեն հաջորդ տարրը չէ:
              </motion.p>
            )}
          </div>

          {/* Queue completed */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 mb-4 min-h-[90px] flex flex-wrap gap-2 items-center justify-center">
            {userQueue.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Այստեղ կհայտնվեն տարրերը ճիշտ հերթականությամբ...</span>
            ) : (
              userQueue.map((item, id) => (
                <div 
                  key={item.id}
                  className="bg-emerald-950/40 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-emerald-300 animate-fadeIn"
                >
                  <span className="bg-emerald-800/60 text-white font-bold w-4 h-4 rounded-full flex items-center justify-center text-[9px]">{id + 1}</span>
                  <strong>{item.spanish}</strong>
                  {selectedDeck !== 'days' && (
                    <span className="text-[10px] text-emerald-400">({item.armenian})</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Scrambled Items to choose from */}
          <div className="my-auto">
            <p className="text-center text-xs text-slate-500 mb-4 uppercase tracking-wider font-semibold">Սեղմի՛ր օրացույցի հաջորդ համապատասխան տարրը.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <AnimatePresence>
                {shuffledItems.map((item) => (
                  <motion.button
                    key={item.id}
                    exit={{ scale: 0, opacity: 0 }}
                    layout
                    onClick={() => handleItemSelect(item)}
                    className="px-4 py-3 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-500 rounded-2xl text-sm font-semibold transition text-amber-200 shadow-sm cursor-pointer min-w-[95px] text-center"
                  >
                    <span className="block">{item.spanish}</span>
                    {selectedDeck !== 'days' && (
                      <span className="block text-[10px] text-slate-400 font-light mt-0.5">{item.armenian}</span>
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center my-auto py-8 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xs mx-auto bg-slate-800/50 border border-slate-700/60 p-6 rounded-3xl"
          >
            <div className="text-4xl mb-2">🎈</div>
            <h2 className="text-2xl font-bold mb-1 text-amber-400">Գերազանց է:</h2>
            <p className="text-xs text-slate-400 mb-4">Դու կատարյալ ճշգրտությամբ դասավորեցիր օրացույցի բոլոր մասերը:</p>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-6 flex justify-between items-center text-sm">
              <span className="text-slate-400">Թեմա</span>
              <span className="font-bold text-slate-200">{selectedDeck === 'days' ? 'Շաբաթվա օրեր' : 'Ամիսներ'}</span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setGameState('intro')}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Անցնել նորից
              </button>
              <button 
                onClick={onBack}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs transition"
              >
                Բոլոր խաղերը
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ============================================
// GAME 4: FLECHA RÁPIDA (Արագ նետ - Հրաձգարան)
// ============================================
interface ShootingTarget {
  id: string;
  armenian: string;
  isCorrect: boolean;
  xPos: number; // current left offset %
  speed: number; // horizontal speed increment
  direction: 1 | -1;
  lane: number;
}

export function GameArcher({ onBack, soundEnabled, onAddScore }: GameProps) {
  sounds.enabled = soundEnabled;
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordPool, setWordPool] = useState<WordItem[]>([]);
  const [targets, setTargets] = useState<ShootingTarget[]>([]);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const gameLoopRef = useRef<number | null>(null);

  const initArcherGame = (mode: 'months' | 'days' | 'all') => {
    let pool: WordItem[] = [];
    if (mode === 'months') pool = shuffleArray(SPANISH_MONTHS);
    else if (mode === 'days') pool = shuffleArray(SPANISH_DAYS);
    else pool = shuffleArray([...SPANISH_MONTHS, ...SPANISH_DAYS]);
    
    setWordPool(pool);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setRoundCompleted(false);
    generateTargets(pool[0]);
  };

  const generateTargets = (currentWord: WordItem) => {
    if (!currentWord) return;
    const correctVal = currentWord.armenian;

    let alternatives = (currentWord.type === 'month' ? SPANISH_MONTHS : SPANISH_DAYS)
      .filter(w => w.spanish !== currentWord.spanish)
      .map(w => w.armenian);

    alternatives = shuffleArray(alternatives).slice(0, 3);
    
    const elements = [
      { id: 't0', armenian: correctVal, isCorrect: true, xPos: Math.random() * 15, speed: 0.15 + Math.random() * 0.15, direction: (Math.random() > 0.5 ? 1 : -1) as 1 | -1, lane: 0 },
      { id: 't1', armenian: alternatives[0] || 'Կիրակի', isCorrect: false, xPos: 25 + Math.random() * 15, speed: 0.15 + Math.random() * 0.15, direction: (Math.random() > 0.5 ? 1 : -1) as 1 | -1, lane: 1 },
      { id: 't2', armenian: alternatives[1] || 'Հունվար', isCorrect: false, xPos: 50 + Math.random() * 15, speed: 0.15 + Math.random() * 0.15, direction: (Math.random() > 0.5 ? 1 : -1) as 1 | -1, lane: 2 },
      { id: 't3', armenian: alternatives[2] || 'Մայիս', isCorrect: false, xPos: 70 + Math.random() * 15, speed: 0.15 + Math.random() * 0.15, direction: (Math.random() > 0.5 ? 1 : -1) as 1 | -1, lane: 3 }
    ];

    setTargets(shuffleArray(elements));
    setRoundCompleted(false);
    setResultMessage('');
  };

  // Animate targets cycle
  useEffect(() => {
    if (gameState !== 'playing' || roundCompleted) return;

    const animate = () => {
      setTargets(prev => prev.map(target => {
        let newX = target.xPos + target.speed * target.direction;
        let newDir = target.direction;
        if (newX > 74) {
          newX = 74;
          newDir = -1;
        } else if (newX < 1) {
          newX = 1;
          newDir = 1;
        }
        return { ...target, xPos: newX, direction: newDir };
      }));
      gameLoopRef.current = requestAnimationFrame(animate);
    };

    gameLoopRef.current = requestAnimationFrame(animate);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, roundCompleted]);

  const handleShoot = (target: ShootingTarget) => {
    if (roundCompleted) return;
    setRoundCompleted(true);

    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);

    if (target.isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 100);
      setResultMessage('🔥 Ուղիղ թիրախին: +100 միավոր:');
    } else {
      sounds.playFailure();
      setResultMessage(`❌ Վրիպում: Ճիշտ թարգմանությունը՝ ${wordPool[currentIndex]?.armenian}`);
    }

    setTimeout(() => {
      const nextIdx = currentIndex + 1;
      if (nextIdx < wordPool.length && nextIdx < 8) { // 8 rounds
        setCurrentIndex(nextIdx);
        generateTargets(wordPool[nextIdx]);
      } else {
        setGameState('ended');
        onAddScore('game4', score);
      }
    }, 1800);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white min-h-[500px] flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 transition rounded-xl text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Մենյու
        </button>
        <span className="text-sm font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800 px-3 py-1 rounded-full font-sans">
          Flecha Rápida
        </span>
      </div>

      {gameState === 'intro' && (
        <div className="text-center my-auto py-12 px-4 max-w-sm mx-auto z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Արագ Նետ • Flecha Rápida</h2>
          <p className="text-sm text-slate-400 mb-6 font-light">
            Քո նետի վրա գրված է իսպաներեն բառը: Էկրանին շարժվում են թիրախներ՝ հայերեն թարգմանությամբ: Կրակի՛ր (սեղմի՛ր) ճիշտ թիրախին:
          </p>

          <div className="flex flex-col gap-2">
            <button 
              onClick={() => initArcherGame('all')}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-sm transition"
            >
              🏹 Կրակել ամբողջը միասին
            </button>
            <button 
              onClick={() => initArcherGame('months')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 rounded-2xl text-xs transition"
            >
              📅 Միայն ամիսները
            </button>
            <button 
              onClick={() => initArcherGame('days')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 rounded-2xl text-xs transition"
            >
              📆 Միայն շաբաթվա օրերը
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex-1 flex flex-col justify-between my-4 z-10">
          <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
            <div>Փուլ՝ <span className="text-emerald-400 font-bold">{currentIndex + 1}/8</span></div>
            <div className="flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Միավորներ՝ <span className="text-amber-400 font-bold">{score}</span></span>
            </div>
          </div>

          {/* Current Word Target / Bow */}
          <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-2xl relative text-center flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Քո նետը զինված է հետևյալ բառով.</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-wide mt-2">
              {wordPool[currentIndex]?.spanish}
            </h2>
            <p className="text-xs text-slate-400 italic mt-1 font-mono">
              Արտասանություն՝ [{wordPool[currentIndex]?.pronunciationAr}]
            </p>
          </div>

          {/* Shooting Gallery Panel */}
          <div className="h-56 relative bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden my-4">
            {resultMessage && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center z-20">
                <p className="text-base font-bold text-slate-100">{resultMessage}</p>
                <p className="text-[10px] text-slate-500 max-w-xs mt-2 px-4 leading-normal italic">
                  {wordPool[currentIndex]?.funFact}
                </p>
              </div>
            )}

            {/* Simulated target lines */}
            <div className="absolute inset-x-0 top-[18%] h-px bg-slate-900 border-dashed border-t border-slate-800/40 pointer-events-none" />
            <div className="absolute inset-x-0 top-[40%] h-px bg-slate-900 border-dashed border-t border-slate-800/40 pointer-events-none" />
            <div className="absolute inset-x-0 top-[62%] h-px bg-slate-900 border-dashed border-t border-slate-800/40 pointer-events-none" />
            <div className="absolute inset-x-0 top-[84%] h-px bg-slate-900 border-dashed border-t border-slate-800/40 pointer-events-none" />

            {targets.map((target) => (
              <button
                key={target.id}
                onClick={() => handleShoot(target)}
                disabled={roundCompleted}
                style={{ left: `${target.xPos}%`, top: `${6 + target.lane * 22}%` }}
                className="absolute py-1 px-2 bg-slate-800 hover:bg-emerald-950 border border-emerald-500/50 hover:border-emerald-400 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold font-mono text-emerald-100 min-w-[78px] max-w-[100px] shadow-sm cursor-pointer transition-colors duration-150"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 absolute top-[-3px] right-[-3px] animate-pulse" />
                <span className="truncate">🎯 {target.armenian}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-[10px] text-slate-500">
            Թիրախները անընդհատ տեղաշարժվում են: Ընտրի՛ր զգուշորեն, սեղմի՛ր անմիջապես թիրախին՝ նետը կրակելու համար:
          </p>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center my-auto py-8 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xs mx-auto bg-slate-800/50 border border-slate-700/60 p-6 rounded-3xl"
          >
            <div className="text-4xl mb-2">🎯</div>
            <h2 className="text-2xl font-bold mb-1 text-emerald-300">Գերազանց հրաձգարան:</h2>
            <p className="text-xs text-slate-400 mb-4">Բոլոր ճիշտ թարգմանությունները խոցված են:</p>

            <div className="space-y-1 mb-6">
              <p className="text-xs text-slate-500 font-mono">ՎԵՐՋՆԱԿԱՆ ՄԻԱՎՈՐՆԵՐ՝</p>
              <h3 className="text-3xl font-bold text-amber-400 font-mono">{score}</h3>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setGameState('intro')}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Խաղալ նորից
              </button>
              <button 
                onClick={onBack}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs transition"
              >
                Բոլոր խաղերը
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ============================================
// GAME 5: COCINA DE LETRAS (Տառերի խոհանոց - Անագրամա)
// ============================================
export function GameLetterChef({ onBack, soundEnabled, onAddScore }: GameProps) {
  sounds.enabled = soundEnabled;
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [shuffledLetters, setShuffledLetters] = useState<{ char: string; originalIndex: number; used: boolean }[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{ char: string; indexInShuffled: number }[]>([]);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordPool, setWordPool] = useState<WordItem[]>([]);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [chefResponse, setChefResponse] = useState<{ text: string; isCorrect?: boolean } | null>(null);

  const startChefGame = (mode: 'months' | 'days') => {
    const rawList = mode === 'months' ? SPANISH_MONTHS : SPANISH_DAYS;
    const pool = shuffleArray(rawList).slice(0, 6); // 6 words

    setWordPool(pool);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    loadWord(pool[0]);
  };

  const loadWord = (word: WordItem) => {
    if (!word) return;
    setCurrentWord(word);
    
    // Split Spanish word to uppercase characters
    const chars = word.spanish.toUpperCase().split('');
    const lettersWithMeta = chars.map((char, idx) => ({
      char,
      originalIndex: idx,
      used: false
    }));

    setShuffledLetters(shuffleArray(lettersWithMeta));
    setSelectedLetters([]);
    setChefResponse(null);
  };

  const handleLetterClick = (letter: { char: string; originalIndex: number; used: boolean }, shuffledIdx: number) => {
    if (letter.used) return;
    sounds.playBubblePop();

    // Mark as used
    setShuffledLetters(prev => prev.map((l, idx) => idx === shuffledIdx ? { ...l, used: true } : l));
    // Add to selection
    setSelectedLetters(prev => [...prev, { char: letter.char, indexInShuffled: shuffledIdx }]);
  };

  const handleRemoveLetter = (selectedIdx: number) => {
    sounds.playBubblePop();
    const removed = selectedLetters[selectedIdx];
    
    // Mark as unused
    setShuffledLetters(prev => prev.map((l, idx) => idx === removed.indexInShuffled ? { ...l, used: false } : l));
    // Remove from selection
    setSelectedLetters(prev => prev.filter((_, idx) => idx !== selectedIdx));
  };

  const checkAnagram = () => {
    if (!currentWord) return;
    const constructed = selectedLetters.map(l => l.char).join('');
    const correctSpanish = currentWord.spanish.toUpperCase();

    if (constructed === correctSpanish) {
      sounds.playSuccess();
      setScore(s => s + 150);
      setChefResponse({
        text: '👨‍🍳 ¡Excelente! Շեֆ-խոհարարը հիացած է: Կերակուրը պատրաստված է կատարյալ: +150 միավոր:',
        isCorrect: true
      });
      setTimeout(() => {
        advanceChefRound();
      }, 2000);
    } else {
      sounds.playFailure();
      setChefResponse({
        text: '👴 Բաղադրատոմսում սխալ կա: Փորձի՛ր նորից հավաքել բառը:',
        isCorrect: false
      });
    }
  };

  const advanceChefRound = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < wordPool.length) {
      setCurrentIndex(nextIdx);
      loadWord(wordPool[nextIdx]);
    } else {
      setGameState('ended');
      onAddScore('game5', score);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white min-h-[500px] flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 transition rounded-xl text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Մենյու
        </button>
        <span className="text-sm font-mono text-rose-400 font-bold bg-rose-950/40 border border-rose-800 px-3 py-1 rounded-full font-sans">
          Cocina de Letras
        </span>
      </div>

      {gameState === 'intro' && (
        <div className="text-center my-auto py-12 px-4 max-w-sm mx-auto z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/20">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Տառերի Խոհանոց • Cocina de Letras</h2>
          <p className="text-sm text-slate-400 mb-6 font-light">
            Դարձի՛ր բառերի խոհարար: Հավաքի՛ր իսպաներեն թարգմանությունը՝ ըստ առաջարկված հայերեն անվանման՝ տառերը կաթսայի մեջ ճիշտ հերթականությամբ դասավորելով:
          </p>

          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => startChefGame('days')}
              className="px-5 py-3 bg-rose-500 hover:bg-rose-400 font-semibold rounded-2xl text-slate-950 shadow-md text-sm transition"
            >
              🍳 Շաբաթվա օրեր
            </button>
            <button 
              onClick={() => startChefGame('months')}
              className="px-5 py-3 bg-pink-600 hover:bg-pink-500 font-semibold rounded-2xl text-white shadow-md text-sm transition"
            >
              🍲 Տարվա ամիսներ
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && currentWord && (
        <div className="flex-1 flex flex-col justify-between my-4 z-10">
          <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-800/40 p-3 rounded-2xl mb-4 border border-slate-800 font-sans">
            <div>Կերակուր՝ <span className="text-rose-400 font-bold">{currentIndex + 1}/{wordPool.length}</span></div>
            <div>
              Միավորներ՝ <span className="text-amber-400 font-bold">{score}</span>
            </div>
          </div>

          {/* Prompt card */}
          <div className="text-center py-4">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Պատրաստի՛ր թարգմանությունը հայերեն բառի համար.</span>
            <div className="text-2xl font-bold text-slate-100 mt-1">
              {currentWord.armenian}
              <span className="text-sm text-slate-400 block font-normal font-sans">({currentWord.armenianLat})</span>
            </div>
          </div>

          {/* Constructed word soup */}
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl min-h-[64px] flex gap-1.5 items-center justify-center flex-wrap my-2 relative">
            {selectedLetters.length === 0 ? (
              <span className="text-slate-500 text-xs italic">Հավաքի՛ր բառը ներքևի տառերով...</span>
            ) : (
              selectedLetters.map((l, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveLetter(idx)}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 hover:bg-slate-700/80 hover:border-rose-400 border border-slate-700/80 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base text-rose-300 font-mono cursor-pointer transition animate-scaleUp"
                >
                  {l.char}
                </button>
              ))
            )}
          </div>

          {/* Chef feedback bubble */}
          {chefResponse && (
            <div className={`p-2.5 rounded-xl text-xs text-center border font-semibold my-2 mx-auto max-w-sm transition-all duration-300
              ${chefResponse.isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/30 border-rose-500/40 text-rose-300'}`}>
              {chefResponse.text}
            </div>
          )}

          {/* Letters remaining on table */}
          <div>
            <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Խոհանոցային սեղան՝ տառերով.</p>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-sm mx-auto">
              {shuffledLetters.map((letter, idx) => (
                <button
                  key={idx}
                  disabled={letter.used || (chefResponse?.isCorrect ?? false)}
                  onClick={() => handleLetterClick(letter, idx)}
                  className={`w-9 h-9 sm:w-11 sm:h-11 border rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm font-mono cursor-pointer transition-all duration-150
                    ${letter.used 
                      ? 'bg-slate-900 border-slate-900 text-slate-700 cursor-not-allowed scale-90 opacity-30' 
                      : 'bg-slate-800 hover:bg-slate-750 hover:border-slate-500 text-slate-100 hover:scale-105 shadow-sm'
                    }`}
                >
                  {letter.char}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-center mt-6">
            <button
              onClick={() => {
                // Reset current word selection
                setSelectedLetters([]);
                setShuffledLetters(prev => prev.map(l => ({ ...l, used: false })));
                setChefResponse(null);
                sounds.playBubblePop();
              }}
              className="py-2 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs transition"
            >
              Մաքրել տառերը
            </button>
            <button
              onClick={checkAnagram}
              disabled={selectedLetters.length === 0 || (chefResponse?.isCorrect ?? false)}
              className="py-2 px-5 bg-rose-500 hover:bg-rose-450 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-40"
            >
              🛎️ Մատուցել կերակուրը (Ստուգել)
            </button>
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center my-auto py-8 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xs mx-auto bg-slate-800/50 border border-slate-700/60 p-6 rounded-3xl"
          >
            <div className="text-4xl mb-2">⭐👨‍🍳⭐</div>
            <h2 className="text-2xl font-bold mb-1 text-rose-300">Հնգաստղանի Շեֆ-խոհարար:</h2>
            <p className="text-xs text-slate-400 mb-4">Բոլոր բաղադրատոմսերը հավաքվել են ճիշտ և ախորժելի:</p>

            <div className="space-y-1 mb-6">
              <p className="text-xs text-slate-500 font-mono">ԽՈՀԱՆՈՑԻ ՎԵՐՋՆԱԿԱՆ ՄԻԱՎՈՐՆԵՐԸ՝</p>
              <h3 className="text-3xl font-extrabold text-amber-400 font-mono">{score}</h3>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setGameState('intro')}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-450 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Անցնել նորից
              </button>
              <button 
                onClick={onBack}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs transition"
              >
                Բոլոր խաղերը
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ============================================
// GAME 6: ¿VERDAD O FALSO? (Ճիշտ թե Սխալ)
// ============================================
interface BlitzCard {
  spanish: string;
  armenianAsserted: string;
  isCorrect: boolean;
  actualArmenian: string;
  funFact: string;
}

export function GameTrueFalse({ onBack, soundEnabled, onAddScore }: GameProps) {
  sounds.enabled = soundEnabled;
  const [blitzList, setBlitzList] = useState<BlitzCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [lastCheck, setLastCheck] = useState<'success' | 'fail' | null>(null);

  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const startBlitz = () => {
    // Collect random mix of items (months + days)
    const combined = [...SPANISH_MONTHS, ...SPANISH_DAYS];
    
    // Generate true and false cards
    const cardCollection: BlitzCard[] = [];
    combined.forEach(item => {
      const isFactCorrect = Math.random() > 0.5;
      if (isFactCorrect) {
        cardCollection.push({
          spanish: item.spanish,
          armenianAsserted: item.armenian,
          isCorrect: true,
          actualArmenian: item.armenian,
          funFact: item.funFact
        });
      } else {
        // Choose another translation at random
        const otherOptions = combined.filter(c => c.spanish !== item.spanish);
        const wrongOption = otherOptions[Math.floor(Math.random() * otherOptions.length)];
        cardCollection.push({
          spanish: item.spanish,
          armenianAsserted: wrongOption.armenian,
          isCorrect: false,
          actualArmenian: item.armenian,
          funFact: item.funFact
        });
      }
    });

    setBlitzList(shuffleArray(cardCollection));
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(25);
    setGameState('playing');
    setLastCheck(null);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    countdownRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          sounds.playFanfare();
          clearInterval(countdownRef.current!);
          setGameState('ended');
          onAddScore('game6', score);
          return 0;
        }
        if (prev < 5) sounds.playTick();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [gameState, score]);

  const handleDecision = (userSelectedTrue: boolean) => {
    const currentCard = blitzList[currentIndex];
    if (!currentCard) return;

    const correctMatch = currentCard.isCorrect;

    if (userSelectedTrue === correctMatch) {
      sounds.playSuccess();
      setScore(s => s + 50);
      setLastCheck('success');
    } else {
      sounds.playFailure();
      setLastCheck('fail');
    }

    setTimeout(() => {
      setLastCheck(null);
      const nextIdx = currentIndex + 1;
      if (nextIdx < blitzList.length) {
        setCurrentIndex(nextIdx);
      } else {
        // Re-shuffle if runs out before timer
        const backupList = [...blitzList];
        setBlitzList(shuffleArray(backupList));
        setCurrentIndex(0);
      }
    }, 450);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white min-h-[500px] flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 transition rounded-xl text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Մենյու
        </button>
        <span className="text-sm font-mono text-violet-400 font-bold bg-violet-950/40 border border-violet-800 px-3 py-1 rounded-full">
          ¿Verdad o Falso?
        </span>
      </div>

      {gameState === 'intro' && (
        <div className="text-center my-auto py-12 px-4 max-w-sm mx-auto z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-violet-400 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-fuchsia-500/20">
            <ArrowLeftRight className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Ճիշտ թե Սխալ • ¿Verdad o Falso?</h2>
          <p className="text-sm text-slate-400 mb-6 font-light">
            Կայծակնային բլից իսպաներենի իմացության վերաբերյալ: Տրվում է ընդամենը 25 վայրկյան որոշումներ կայացնելու համար: Համեմատի՛ր իսպաներեն բառն ու թարգմանությունը, սեղմի՛ր <strong>Ճիշտ</strong> կամ <strong>Սխալ</strong>:
          </p>

          <button 
            onClick={startBlitz}
            className="px-6 py-3.5 bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold rounded-2xl shadow-md text-sm transition"
          >
            ⚡ Սկսել Բլից-Հարցումը
          </button>
        </div>
      )}

      {gameState === 'playing' && blitzList[currentIndex] && (
        <div className="flex-1 flex flex-col justify-between my-4 z-10">
          <div className="flex justify-between items-center text-xs bg-slate-800/40 p-3 rounded-2xl mb-4 border border-slate-800 font-mono">
            <div>Միավորներ՝ <span className="text-amber-400 font-bold">{score}</span></div>
            <div className="flex items-center gap-1.5">
              <span>⏱️ Ժամանակ՝</span>
              <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-violet-400'}`}>
                {timeLeft} վրկ
              </span>
            </div>
          </div>

          {/* Flashcard container */}
          <div className="my-auto max-w-sm mx-auto w-full">
            <motion.div 
              key={currentIndex}
              initial={{ scale: 0.9, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className={`bg-slate-850 border border-slate-800 rounded-2xl p-6 shadow-lg text-center relative overflow-hidden transition-all duration-150
                ${lastCheck === 'success' ? 'ring-4 ring-emerald-500/70 border-emerald-500' : ''}
                ${lastCheck === 'fail' ? 'ring-4 ring-rose-500/70 border-rose-500' : ''}
              `}
            >
              {lastCheck === 'success' && (
                <div className="absolute inset-0 bg-emerald-950/20 flex items-center justify-center animate-fadeOut">
                  <span className="text-4xl">🚀 +50!</span>
                </div>
              )}
              {lastCheck === 'fail' && (
                <div className="absolute inset-0 bg-rose-950/20 flex items-center justify-center animate-fadeOut">
                  <span className="text-4xl">❌</span>
                </div>
              )}

              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Համապատասխանություն՝</span>
              
              <div className="space-y-4 my-4">
                <div>
                  <span className="text-3xl font-extrabold text-violet-300 block">{blitzList[currentIndex].spanish}</span>
                  <span className="text-xs text-slate-500">իսպաներեն</span>
                </div>

                <div className="text-lg opacity-40 font-bold">հավասա՞ր է</div>

                <div>
                  <span className="text-2xl font-extrabold text-fuchsia-300 block">{blitzList[currentIndex].armenianAsserted}</span>
                  <span className="text-xs text-slate-500">հայերեն</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Buttons true or false */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full mt-4">
            <button
              onClick={() => handleDecision(false)}
              className="py-4 bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700/80 hover:border-rose-500 text-rose-400 font-bold rounded-2xl shadow-sm text-sm transition cursor-pointer flex flex-col items-center justify-center gap-1"
            >
              <XCircle className="w-5 h-5 text-rose-500" />
              <span>ՍԽԱԼ ✖</span>
            </button>
            <button
              onClick={() => handleDecision(true)}
              className="py-4 bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700/80 hover:border-emerald-500 text-emerald-400 font-bold rounded-2xl shadow-sm text-sm transition cursor-pointer flex flex-col items-center justify-center gap-1"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>ՃԻՇՏ ✔</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center my-auto py-8 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xs mx-auto bg-slate-800/50 border border-slate-700/60 p-6 rounded-3xl"
          >
            <div className="text-4xl mb-2">⚡⏱️</div>
            <h2 className="text-2xl font-bold mb-1 text-violet-300">Բլիցն ավարտվեց:</h2>
            <p className="text-xs text-slate-400 mb-4">Ժամանակն սպառվեց, հիանալի փորձ էր:</p>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-6 text-center">
              <span className="block text-xs text-slate-500 uppercase tracking-widest font-mono">ՀԱՎԱՔԱԾ ՄԻԱՎՈՐՆԵՐԸ՝</span>
              <span className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">{score}</span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setGameState('intro')}
                className="flex-1 py-2.5 bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Անցնել նորից
              </button>
              <button 
                onClick={onBack}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs transition"
              >
                Բոլոր խաղերը
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ============================================
// GAME 7: COMPLETA LA FRASE (Լրացրո՛ւ նախադասությունը)
// ============================================

interface SentenceItem {
  id: string;
  spanishTemplate: string;
  spanishTarget: string;
  armenianTranslation: string;
  options: string[];
  funFact: string;
}

const WEEKDAY_SENTENCES: SentenceItem[] = [
  {
    id: 's1',
    spanishTemplate: "El _____ es el primer día de la semana de trabajo.",
    spanishTarget: "lunes",
    armenianTranslation: "Երկուշաբթին աշխատանքային շաբաթվա առաջին օրն է:",
    options: ["lunes", "martes", "sábado", "domingo"],
    funFact: "Իսպաներենում շաբաթվա օրերը գրվում են փոքրատառով և բոլորն արական սեռի են: Օգտագործվում է 'el lunes' (երկուշաբթին):"
  },
  {
    id: 's2',
    spanishTemplate: "Hoy es _____ y mañana es miércoles.",
    spanishTarget: "martes",
    armenianTranslation: "Այսօր երեքշաբթի է, իսկ վաղը չորեքշաբթի է:",
    options: ["martes", "lunes", "jueves", "viernes"],
    funFact: "Իսպաներենում «mañana» նշանակում է և՛ «վաղը», և՛ «առավոտ»՝ կախված օգտագործված հոդից:"
  },
  {
    id: 's3',
    spanishTemplate: "El _____ es la mitad de la semana laboral.",
    spanishTarget: "miércoles",
    armenianTranslation: "Չորեքշաբթին աշխատանքային շաբաթվա կեսն է:",
    options: ["miércoles", "martes", "jueves", "lunes"],
    funFact: "Miércoles-ն ունի գրավոր շեշտադրում (tilde) «e» տառի վրա, քանի որ այն esdrújula բառ է:"
  },
  {
    id: 's4',
    spanishTemplate: "El _____ es el día de la semana antes del viernes.",
    spanishTarget: "jueves",
    armenianTranslation: "Հինգշաբթին ուրբաթից առաջ ընկած շաբաթվա օրն է:",
    options: ["jueves", "martes", "sábado", "lunes"],
    funFact: "Jueves-ը նվիրված է Յուպիտերին (Jupiter)՝ հռոմեացիների գլխավոր աստծուն:"
  },
  {
    id: 's5',
    spanishTemplate: "¡Por fin es _____! El fin de semana comienza hoy.",
    spanishTarget: "viernes",
    armenianTranslation: "Վերջապես ուրբաթ է: Հանգստյան օրերը սկսվում են այսօր:",
    options: ["viernes", "miércoles", "lunes", "domingo"],
    funFact: "Իսպաներեն '¡Por fin es viernes!' արտահայտությունը շատ սիրված է, քանի որ աշխատանքային շաբաթվա ավարտն է ազդարարում:"
  },
  {
    id: 's6',
    spanishTemplate: "El _____ es el día de descanso entre el viernes y el domingo.",
    spanishTarget: "sábado",
    armenianTranslation: "Շաբաթը ուրբաթի և կիրակիի միջև ընկած հանգստյան օրն է:",
    options: ["sábado", "domingo", "lunes", "jueves"],
    funFact: "Sábado բառը, ի տարբերություն սովորական օրերի, հոգնակիում ստանում է -s վերջավորություն՝ 'los sábados':"
  },
  {
    id: 's7',
    spanishTemplate: "El _____ es el último día de la semana y es para descansar.",
    spanishTarget: "domingo",
    armenianTranslation: "Կիրակին շաբաթվա վերջին օրն է և նախատեսված է հանգստի համար:",
    options: ["domingo", "sábado", "martes", "viernes"],
    funFact: "Domingo բառը գալիս է լատիներեն 'Dominicus'-ից, որը նշանակում է «Տիրոջ օր»:"
  }
];

export function GameSentenceFill({ onBack, soundEnabled, onAddScore }: GameProps) {
  sounds.enabled = soundEnabled;
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledSentences, setShuffledSentences] = useState<SentenceItem[]>([]);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const initGame = () => {
    setShuffledSentences(shuffleArray(WEEKDAY_SENTENCES).map(s => ({
      ...s,
      options: shuffleArray(s.options)
    })));
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const handleSelectOption = (option: string) => {
    if (showFeedback) return;
    
    const current = shuffledSentences[currentIndex];
    const correct = option.toLowerCase() === current.spanishTarget.toLowerCase();
    
    setSelectedAnswer(option);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      sounds.playSuccess();
      setScore(s => s + 100);
    } else {
      sounds.playFailure();
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      
      const nextIdx = currentIndex + 1;
      if (nextIdx < shuffledSentences.length) {
        setCurrentIndex(nextIdx);
      } else {
        setGameState('ended');
        onAddScore('game7', score + (correct ? 100 : 0));
      }
    }, 2800);
  };

  const currentSentence = shuffledSentences[currentIndex];
  const parts = currentSentence ? currentSentence.spanishTemplate.split("_____") : ["", ""];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white min-h-[500px] flex flex-col justify-between relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 transition rounded-xl text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Մենյու
        </button>
        <span className="text-sm font-mono text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-800 px-3 py-1 rounded-full font-sans">
          Completa la Frase
        </span>
      </div>

      {gameState === 'intro' && (
        <div className="text-center my-auto py-12 px-4 max-w-sm mx-auto z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-650 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <BookOpenCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-center">Լրացրո՛ւ Նախադասությունը</h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 font-light text-center leading-relaxed">
            Յուրաքանչյուր փուլում տրված է շաբաթվա օրերի մասին իսպաներեն նախադասություն, որից բացակայում է ճիշտ օրվա անունը: Ընտրի՛ր ճիշտ տարբերակը:
          </p>

          <button 
            onClick={initGame}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-505 hover:bg-indigo-400 active:bg-indigo-650 font-medium rounded-2xl text-slate-950 shadow-md shadow-indigo-400/15 text-sm transition"
          >
            🚀 Սկսել խաղալ
          </button>
        </div>
      )}

      {gameState === 'playing' && currentSentence && (
        <div className="flex-1 flex flex-col justify-between my-4 z-10">
          <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
            <div>Հարց՝ <span className="text-indigo-400 font-bold">{currentIndex + 1}/{shuffledSentences.length}</span></div>
            <div className="flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Միավորներ՝ <span className="text-amber-400 font-bold">{score}</span></span>
            </div>
          </div>

          {/* Interactive Sentence Card */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-5 sm:p-6 rounded-2xl py-8 my-auto relative text-center">
            {/* Template layout */}
            <div className="text-base sm:text-lg font-extrabold text-slate-100 leading-relaxed">
              {parts[0]}
              <span className={`inline-block mx-1.5 px-3 py-0.5 rounded-xl border-2 border-dashed transition-all duration-300 ${
                selectedAnswer
                  ? isCorrect 
                    ? 'bg-emerald-950/45 border-emerald-500 text-emerald-400 font-bold'
                    : 'bg-rose-950/45 border-rose-500 text-rose-400 font-bold'
                  : 'bg-indigo-950/50 border-indigo-500/50 text-indigo-400 font-semibold px-4'
              }`}>
                {selectedAnswer ? selectedAnswer : "՞"}
              </span>
              {parts[1]}
            </div>

            {/* Translation helper */}
            <div className="mt-5 text-xs sm:text-sm text-slate-400 font-light border-t border-slate-850 pt-4 leading-relaxed italic">
              {currentSentence.armenianTranslation}
            </div>
          </div>

          {/* Feedback details */}
          <div className="h-16 flex items-center justify-center text-center my-1">
            <AnimatePresence mode="wait">
              {showFeedback ? (
                <motion.div
                  key="feedback-content"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-1 px-4"
                >
                  <p className={`text-sm font-bold ${isCorrect ? 'text-emerald-450 text-emerald-400' : 'text-rose-400'}`}>
                    {isCorrect ? '🔥 Ճիշտ է: +100 միավոր' : `❌ Սխալ է: Ճիշտ պատասխանն էր՝ ${currentSentence.spanishTarget}`}
                  </p>
                  <p className="text-[10px] text-slate-500 italic max-w-sm leading-normal">
                    {currentSentence.funFact}
                  </p>
                </motion.div>
              ) : (
                <p className="text-[10px] text-slate-500 italic px-4">
                  Ընտրի՛ր ներքևի տարբերակներից այն օրվա անունը, որը լրացնում է նախադասությունը:
                </p>
              )}
            </AnimatePresence>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {currentSentence.options.map((option) => {
              const matchesSelected = selectedAnswer === option;
              let btnClass = "bg-slate-800 text-slate-200 border-slate-700/60 hover:bg-slate-750 hover:border-slate-500";
              
              if (showFeedback) {
                if (option.toLowerCase() === currentSentence.spanishTarget.toLowerCase()) {
                  btnClass = "bg-emerald-950/60 text-emerald-300 border-emerald-500/60";
                } else if (matchesSelected) {
                  btnClass = "bg-rose-950/60 text-rose-300 border-rose-500/60";
                } else {
                  btnClass = "bg-slate-900 border-slate-850 text-slate-600 opacity-40 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  disabled={showFeedback}
                  className={`w-full py-3 px-4 border rounded-xl font-bold text-center capitalize transition-all duration-150 text-xs sm:text-sm cursor-pointer shadow-sm ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center my-auto py-8 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xs mx-auto bg-slate-800/50 border border-slate-700/60 p-6 rounded-3xl flex flex-col items-center"
          >
            <div className="text-4xl mb-2">🏆🎉</div>
            <h2 className="text-2xl font-bold mb-1 text-indigo-300 text-center">Խաղն ավարտվեց:</h2>
            <p className="text-xs text-slate-400 mb-4 text-center leading-relaxed">Գերազանց աշխատանք, նախադասություններում ճիշտ կողմնորոշում:</p>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-6 text-center w-full">
              <span className="block text-xs text-slate-500 uppercase tracking-widest font-mono">ՀԱՎԱՔԱԾ ՄԻԱՎՈՐՆԵՐԸ՝</span>
              <span className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">{score}</span>
            </div>

            <div className="flex gap-2 w-full">
              <button 
                onClick={initGame}
                className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Անցնել նորից
              </button>
              <button 
                onClick={onBack}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-650 text-slate-200 rounded-xl text-xs transition"
              >
                Բոլոր խաղերը
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
