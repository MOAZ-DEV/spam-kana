import React from "react";
import type { Route } from "./+types/home";
import NavBar from "~/components/navbar";
import { KanaDisplay } from "~/components/KanaDisplay";
import { OptionsGrid } from "~/components/OptionsGrid";
import { InfoSection } from "~/components/InfoSection";
import { useKanaGame } from "~/hooks/useKanaGame";
import { MOD, TYPE } from "~/hooks/useNavbar";
import { HashRouter } from "react-router";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "LazyKana" },
    { name: "description", content: "Practice Hiragana & Katakana by Spamming." },
  ];
}

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

export default function Home() {
  const {
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
    correctCount,
    wrongCount,
    displayRate,
    rawRate,
    canEvaluate,

    // Actions
    handleOptionClick,
    shuffleIndex,
    resetStats,
  } = useKanaGame({
    initialRow: "A-row",
    initialMod: MOD[0],
    initialScriptType: TYPE[0],
  });

  return (
    <HashRouter>
      <div className="container m-auto max-md:h-screen w-screen max-w-md overflow-x-hidden overflow-y-auto flex flex-col gap-3 p-3">
        <NavBar
          row={row}
          setRow={setRow}
          mod={mod}
          setMod={setMod}
          scriptType={scriptType}
          setScriptType={setScriptType}
        />

        <KanaDisplay
          current={current}
          showRomaji={showRomaji}
          setShowRomaji={setShowRomaji}
          correctCount={correctCount}
          wrongCount={wrongCount}
          displayRate={displayRate}
          rawRate={rawRate}
          canEvaluate={canEvaluate}
          onShuffle={shuffleIndex}
          onReset={resetStats}
          groupKana={groupKana}
        />

        <OptionsGrid
          groupKana={groupKana}
          current={current}
          onOptionClick={handleOptionClick}
        />

        <InfoSection />
      </div>
    </HashRouter>
  );
}