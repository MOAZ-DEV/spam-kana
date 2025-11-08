import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getKanaGroups } from "public/data/kana";
import { cn } from "lib/utils";

export const MOD = ["Dakuten", "Combos"] as const;
export const TYPE = ["Hiragana", "Katakana"] as const;

type NavBarProps = {
  row: string;
  setRow: (r: string) => void;
  mod: string;
  setMod: (m: string) => void;
  scriptType: string;
  setScriptType: (t: string) => void;
};

function IconButton({
  label,
  pressed,
  onClick,
  className,
  ariaHasPopup,
  ariaExpanded,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  className?: string;
  ariaHasPopup?: boolean;
  ariaExpanded?: boolean;
}) {
  return (
    <button
      aria-pressed={!!pressed}
      aria-haspopup={ariaHasPopup ? "menu" : undefined}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      className={cn(
        "relative flex items-center text-sm transition active:scale-105 py-1 px-4 rounded-full backdrop-blur-2xl",
        "bg-zinc-300/10 text-zinc-200 not-hover:text-zinc-100/45 border border-transparent active:border-zinc-300/45",
        className
      )}
    >
      {label}
    </button>
  );
}

export default function NavBar({ row, setRow, mod, setMod, scriptType, setScriptType }: NavBarProps) {
  const [openRow, setOpenRow] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const kanaGroups = useMemo(() => getKanaGroups(), []);
  const scriptKey = (scriptType || "Hiragana").toLowerCase();

  const groupsForScript = useMemo(() => {
    let g = kanaGroups.filter((s) => s.script === scriptKey);
    if (mod === "Dakuten") g = g.filter(x => /dakuten|handakuten/i.test(x.group));
    else if (mod === "Combos") g = g.filter(x => /combo/i.test(x.group));
    else g = g.filter(x => !/dakuten|handakuten|combo/i.test(x.group)); // optional
    return g;
  }, [kanaGroups, scriptKey, mod]);

  // close on outside click / ESC
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpenRow(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenRow(false);
    };

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggleRow = useCallback(() => setOpenRow((v) => !v), []);
  const nextMod = useCallback(() => {
    const i = MOD.indexOf(mod as any);
    const newMod = MOD[(i + 1) % MOD.length];
    setMod(newMod);

    // pick a sensible default row for the new mode so Home updates
    const groups = getKanaGroups().filter(g => g.script === scriptKey);
    let filtered = groups;
    if (newMod === "Dakuten") filtered = groups.filter(g => /dakuten|handakuten/i.test(g.group));
    else if (newMod === "Combos") filtered = groups.filter(g => /combo/i.test(g.group));
    if (filtered.length) setRow(filtered[0].group);
  }, [mod, setMod, setRow, scriptKey]);
  const nextType = useCallback(() => {
    const i = TYPE.indexOf(scriptType as any);
    setScriptType(TYPE[(i + 1) % TYPE.length]);
  }, [scriptType, setScriptType]);

  return (
    <nav ref={rootRef} className="w-screen max-w-96 flex items-start relative -mx-3 -mt-3 px-3 pt-3">
      <div className="flex flex-row justify-between gap-2 w-full">
        {openRow && (
          <div
            aria-hidden={!openRow}
            className={cn(
              "fixed inset-0 z-40 duration-200 transition ease-in-out",
              openRow ? "pointer-events-auto backdrop-blur-sm" : "opacity-0 pointer-events-none"
            )}
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={() => setOpenRow(false)}
          />
        )}

        <IconButton
          label={`${row.replace("-row", "")} Row`}
          pressed={openRow}
          onClick={toggleRow}
          ariaHasPopup
          ariaExpanded={openRow}
          className={openRow ? "z-50" : undefined}
        />

        {/* Animated row menu (kept in DOM via aria-hidden toggle) */}
        <div
          aria-hidden={!openRow}
          className={cn(
            "absolute top-0 left-0 min-h-svh h-full w-full z-40 pointer-events-none px-2 transition-all duration-300",
            openRow ? "opacity-100 pointer-events-auto" : "opacity-0"
          )}
        >
          <div
            role="menu"
            aria-hidden={!openRow}
            className={cn(
              "mx-auto mt-14 max-w-4xl min-w-3xs rounded-xl shadow-lg overflow-hidden transform transition-all duration-300",
              openRow ? "opacity-100 translate-y-0 backdrop-blur-xl" : "opacity-0 -translate-y-6"
            )}
            style={{ background: "rgba(28,28,30,0.55)" }}
          >
            <div className="flex flex-col gap-2 p-3 py-4 w-full max-h-[65vh] overflow-y-auto">
              {groupsForScript.map(({ count, group, items }, idx) => (
                <button
                  key={group}
                  onClick={() => {
                    setRow(group);
                    setOpenRow(false);
                  }}
                  className={cn(
                    "relative flex flex-col items-start justify-start gap-0.5 rounded-lg py-2 px-2 transition duration-200",
                    "bg-zinc-500/6 border border-zinc-500/10 hover:border-zinc-500/45 hover:scale-[1.01] cursor-pointer",
                    "hover:bg-zinc-500/18 active:bg-zinc-500/30",
                    openRow ? "opacity-100 translate-y-0" : "opacity-80 -translate-y-1"
                  )}
                  style={{ transitionDelay: `${Math.min(120, idx * 12)}ms` }}
                >
                  <span className="absolute top-2 right-2 aspect-square py-1 px-2 text-xs opacity-45 border border-zinc-200 rounded-full">
                    {count}
                  </span>
                  <p className="text-sm">
                    {group.replace("-row", "")} <span className="opacity-45">Row</span>
                  </p>
                  <p className="text-sm opacity-75">
                    {items.slice(0, 5).map(({ char, romaji }) => `${char} (${romaji}), `).join(" ")}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <IconButton label={mod} onClick={nextMod} />
        <IconButton label={scriptType} pressed={scriptType === TYPE[1]} onClick={nextType} />
      </div>
    </nav>
  );
}
