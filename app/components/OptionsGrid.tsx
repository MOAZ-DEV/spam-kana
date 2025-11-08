import { cn } from "lib/utils";
import type { KanaEntry } from "public/data/kana";

interface OptionsGridProps {
  groupKana: KanaEntry[];
  current: KanaEntry | undefined;
  onOptionClick: (romaji: string) => void;
}

export function OptionsGrid({ groupKana, current, onOptionClick }: OptionsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {groupKana.length > 0 ? (
        groupKana.map((k) => {
          const isActive = k.char === current?.char;
          return (
            <button
              key={k.char}
              type="button"
              onClick={() => onOptionClick(k.romaji)}
              className={cn(
                "px-4 py-3 text-xl text-zinc-200 rounded-full border border-dashed border-zinc-200/25 transition duration-200",
                "hover:bg-zinc-200/5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-zinc-500/30",
                isActive ? "active:bg-green-500/5 active:border-green-500/25 active:text-green-300" : "bg-transparent"
              )}
              aria-pressed={isActive}
              aria-label={`Answer ${k.romaji}`}
            >
              {k.romaji}
            </button>
          );
        })
      ) : (
        <div className="col-span-2 text-center text-sm text-zinc-400">No options</div>
      )}
    </div>
  );
}