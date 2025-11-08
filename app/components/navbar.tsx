import React from "react";
import { cn } from "lib/utils";
import { useNavbar, MOD, TYPE } from "~/hooks/useNavbar";
import { IconButton } from "./IconButton";

type NavBarProps = {
  row: string;
  setRow: (r: string) => void;
  mod: string;
  setMod: (m: string) => void;
  scriptType: string;
  setScriptType: (t: string) => void;
};

export default function NavBar({ row, setRow, mod, setMod, scriptType, setScriptType }: NavBarProps) {
  const {
    openRow,
    setOpenRow,
    rootRef,
    groupsForScript,
    toggleRow,
    nextMod,
    nextType,
  } = useNavbar({
    row,
    setRow,
    mod,
    setMod,
    scriptType,
    setScriptType,
  });

  return (
    <nav ref={rootRef} className="w-screen max-w-md flex items-start relative -mx-3 -mt-3 px-3 pt-3">
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