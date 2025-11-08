import { cn } from "lib/utils";
import type { KanaEntry } from "public/data/kana";
import { KanaStats } from "./KanaStats";

interface KanaDisplayProps {
  current: KanaEntry | undefined;
  showRomaji: boolean;
  setShowRomaji: (show: boolean) => void;
  correctCount: number;
  wrongCount: number;
  displayRate: number;
  rawRate: number;
  canEvaluate: boolean;
  onShuffle: () => void;
  onReset: () => void;
  groupKana: KanaEntry[];
}

export function KanaDisplay({
  current,
  showRomaji,
  setShowRomaji,
  correctCount,
  wrongCount,
  displayRate,
  rawRate,
  canEvaluate,
  onShuffle,
  onReset,
  groupKana,
}: KanaDisplayProps) {
  return (
    <div
      className="relative w-full aspect-square rounded-xl transition-[background]"
      style={{
        background: `conic-gradient(#3b82f6 ${displayRate}% , transparent 0)`,
      }}
    >
      <div
        className="relative flex flex-col items-center justify-center w-full aspect-square text-zinc-200 border border-zinc-500/25 py-3 px-3 rounded-xl backdrop-blur-2xl"
        role="region"
        aria-label="Kana display"
      >
        <p className="absolute top-3 text-xs text-center leading-tight opacity-45">
          Tap / hover the kana to reveal the romanization. Pick the matching romaji button.
        </p>

        {groupKana.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full text-red-300 text-center px-4">
            <div>
              <p className="text-2xl font-semibold">No kana found</p>
              <p className="mt-2 text-sm opacity-60">Pick another row or script.</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowRomaji(!showRomaji)}
            className="group relative flex items-center justify-center h-4/6 w-11/12 md:w-3/4 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500/40"
            aria-pressed={showRomaji}
          >
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center text-[6rem] md:text-[9rem] transition-all duration-300",
                showRomaji ? "opacity-0 scale-75" : "opacity-100 scale-100",
                "md:group-hover:opacity-0 md:group-hover:scale-75"
              )}
              aria-hidden={showRomaji}
            >
              {current?.char ?? "—"}
            </span>

            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center text-4xl md:text-6xl transition-all duration-300",
                showRomaji ? "opacity-100 scale-100" : "opacity-0 scale-75",
                "md:group-hover:opacity-100 md:group-hover:scale-100"
              )}
              aria-hidden={!showRomaji}
            >
              {current?.romaji ?? ""}
            </span>
          </button>
        )}

        <KanaStats
          correctCount={correctCount}
          wrongCount={wrongCount}
          displayRate={displayRate}
          rawRate={rawRate}
          canEvaluate={canEvaluate}
          onShuffle={onShuffle}
          onReset={onReset}
        />
      </div>
    </div>
  );
}