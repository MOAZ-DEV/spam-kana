import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getKanaGroups } from "public/data/kana";
import type { KanaGroup } from "public/data/kana";

export const MOD = ["Dakuten", "Combos"] as const;
export const TYPE = ["Hiragana", "Katakana"] as const;

export interface UseNavbarProps {
    row: string;
    setRow: (r: string) => void;
    mod: string;
    setMod: (m: string) => void;
    scriptType: string;
    setScriptType: (t: string) => void;
}

export interface UseNavbarResult {
    openRow: boolean;
    setOpenRow: (open: boolean) => void;
    rootRef: React.RefObject<HTMLDivElement | null> | null;
    groupsForScript: KanaGroup[];
    toggleRow: () => void;
    nextMod: () => void;
    nextType: () => void;
}

export function useNavbar({
    row,
    setRow,
    mod,
    setMod,
    scriptType,
    setScriptType,
}: UseNavbarProps): UseNavbarResult {
    const [openRow, setOpenRow] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const kanaGroups = useMemo(() => getKanaGroups(), []);
    const scriptKey = (scriptType || "Hiragana").toLowerCase();

    // Keep all groups visible. When a MOD is active, prioritize matching groups
    const groupsForScript = useMemo(() => {
        const base = kanaGroups.filter((s) => s.script === scriptKey);

        if (mod === "Dakuten") {
            return base.slice().sort((a, b) => {
                const aMatch = /dakuten|handakuten/i.test(a.group) ? 0 : 1;
                const bMatch = /dakuten|handakuten/i.test(b.group) ? 0 : 1;
                return aMatch - bMatch;
            });
        }

        if (mod === "Combos") {
            return base.slice().sort((a, b) => {
                const aMatch = /combo/i.test(a.group) ? 0 : 1;
                const bMatch = /combo/i.test(b.group) ? 0 : 1;
                return aMatch - bMatch;
            });
        }

        return base;
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

        // pick a sensible default row for the new mode
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

    return {
        openRow,
        setOpenRow,
        rootRef,
        groupsForScript,
        toggleRow,
        nextMod,
        nextType,
    };
}