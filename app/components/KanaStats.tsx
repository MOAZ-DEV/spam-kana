import { cn } from "lib/utils";

interface KanaStatsProps {
  correctCount: number;
  wrongCount: number;
  displayRate: number;
  rawRate: number;
  canEvaluate: boolean;
  onShuffle: () => void;
  onReset: () => void;
}

const levels = [
  { label: "Excellent", rate: 90, emoji: "🤩" },
  { label: "Good", rate: 75, emoji: "😊" },
  { label: "Average", rate: 50, emoji: "🙂" },
  { label: "Needs Work", rate: 25, emoji: "😕" },
  { label: "Poor", rate: 0, emoji: "😞" }
];

export function KanaStats({
  correctCount,
  wrongCount,
  displayRate,
  canEvaluate,
}: KanaStatsProps) {
  const match = levels.find((lvl) => displayRate >= lvl.rate);

  return (
    <div className="absolute bottom-0 left-0 flex items-center justify-between gap-4 w-full p-4">
      <div className="text-sm flex flex-row items-center justify-between w-full">
        <div className="flex items-center justify-center size-9 p-2 aspect-square! bg-green-300/25 border border-green-300/25 rounded-full">
          <strong className="text-green-300">{correctCount}</strong>
        </div>
        <div>
          <p className="text-center">
            {(match && canEvaluate) &&
              <span className="font-semibold">
                {match.emoji} {match.label}
              </span>
            }
          </p>
        </div>
        <div className="flex items-center justify-center size-9 p-2 aspect-square! bg-red-300/25 border border-red-300/25 rounded-full">
          <strong className="text-red-300">{wrongCount}</strong>
        </div>
      </div>
    </div>
  );
}