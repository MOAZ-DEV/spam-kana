import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KanaEntry } from "public/data/kana";
import { findByGroup } from "public/data/kana";

/* ---------------------------
   Tuning constants
   --------------------------- */
const PRIOR_CORRECT = 0; // Bayesian prior correct
const PRIOR_TOTAL = 1; // Bayesian prior total — prevents instant 100%
const MIN_ATTEMPTS_FOR_100 = 20; // don't allow true 100% until this many attempts

const levels = [
  { label: "Excellent", rate: 90, emoji: "🤩" },
  { label: "Good", rate: 75, emoji: "😊" },
  { label: "Average", rate: 50, emoji: "🙂" },
  { label: "Needs Work", rate: 25, emoji: "😕" },
  { label: "Poor", rate: 0, emoji: "😞" }
];

export interface UseKanaGameProps {
  initialRow?: string;
  initialMod?: string;
  initialScriptType?: string;
}

export function useKanaGame({
  initialRow = "A-row",
  initialMod = "Dakuten",
  initialScriptType = "Hiragana",
}: UseKanaGameProps = {}) {
  const [row, setRow] = useState<string>(initialRow);
  const [mod, setMod] = useState<string>(initialMod);
  const [scriptType, setScriptType] = useState<string>(initialScriptType);

  const [groupKana, setGroupKana] = useState<KanaEntry[]>(() => 
    findByGroup(initialRow).filter((k) => k.script === initialScriptType.toLowerCase())
  );
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [displayRate, setDisplayRate] = useState<number>(0);

  const prevRowRef = useRef<string>(row);
  const prevScriptRef = useRef<string>(scriptType);

  const current = groupKana[currentIndex];
  const total = correctCount + wrongCount;

  const trueRate = useMemo(() => {
    if (total + PRIOR_TOTAL === 0) return 0;
    return ((correctCount + PRIOR_CORRECT) / (total + PRIOR_TOTAL)) * 100;
  }, [correctCount, total]);

  const targetRate = useMemo(() => {
    const capped = total + PRIOR_TOTAL >= MIN_ATTEMPTS_FOR_100 
      ? Math.min(trueRate, 100) 
      : Math.min(trueRate, 99);
    return Math.max(0, Math.min(100, capped));
  }, [trueRate, total]);

  const rawRate = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const canEvaluate = correctCount + wrongCount >= groupKana.length * 2 / 3;
  const match = levels.find((lvl) => displayRate >= lvl.rate);

  const normalizeRomaji = useCallback((r: string) => r.trim().toLowerCase(), []);

  const shuffleIndex = useCallback(() => {
    if (!groupKana || groupKana.length <= 1) {
      setCurrentIndex(0);
      return;
    }
    const max = groupKana.length;
    let next = Math.floor(Math.random() * max);
    if (next === currentIndex) next = (next + 1) % max;
    setCurrentIndex(next);
    setShowRomaji(false);
    setShowHint(false);
  }, [groupKana, currentIndex]);

  const handleOptionClick = useCallback((selectedRomaji: string) => {
    if (!current) return;
    const correct = normalizeRomaji(selectedRomaji) === normalizeRomaji(current.romaji);
    if (correct) {
      setCorrectCount((c) => c + 1);
      shuffleIndex();
    } else {
      setWrongCount((w) => w + 1);
      setShowHint(true);
      setShowRomaji(true);
    }
  }, [current, normalizeRomaji, shuffleIndex]);

  const resetStats = useCallback(() => {
    setCorrectCount(0);
    setWrongCount(0);
    setShowHint(false);
    setShowRomaji(false);
    setDisplayRate(0);
  }, []);

  // Smooth animation effect for displayRate
  useEffect(() => {
    let raf = 0;

    const step = () => {
      setDisplayRate((prev) => {
        const diff = targetRate - prev;
        if (Math.abs(diff) < 0.25) {
          cancelAnimationFrame(raf);
          return targetRate;
        }
        const stepVal = diff * 0.12;
        const minStep = Math.sign(diff) * 0.35;
        return prev + (Math.abs(stepVal) > Math.abs(minStep) ? stepVal : minStep);
      });
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [targetRate]);

  // Update kana list when row or script type changes
  useEffect(() => {
    const scriptKey = scriptType.toLowerCase();
    const list = findByGroup(row).filter((k) => k.script === scriptKey) ?? [];
    setGroupKana(list);
    setCurrentIndex((ci) => (list.length === 0 ? 0 : Math.min(ci, list.length - 1)));
    setShowRomaji(false);
    setShowHint(false);

    if (prevRowRef.current !== row) {
      resetStats();
      prevRowRef.current = row;
    }

    prevScriptRef.current = scriptType;
  }, [row, scriptType, resetStats]);

  // Reset row when script type changes
  useEffect(() => {
    if (prevScriptRef.current !== scriptType) {
      setRow("");
    }
    prevScriptRef.current = scriptType;
  }, [scriptType]);

  return {
    // Navigation state
    row,
    setRow,
    mod,
    setMod,
    scriptType,
    setScriptType,

    // Game state
    current,
    groupKana,
    showRomaji,
    setShowRomaji,
    showHint,
    correctCount,
    wrongCount,
    displayRate,
    rawRate,
    canEvaluate,
    match,

    // Actions
    handleOptionClick,
    shuffleIndex,
    resetStats,
  };
}