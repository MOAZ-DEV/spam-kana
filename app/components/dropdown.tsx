import React, { useRef, useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { cn } from "lib/utils";

type DropdownItem = {
  value: string;
  label?: string;
};

export default function Dropdown({
  open,
  setOpen,
  label,
  items,
  onSelect,
  menuClass,
  buttonClass,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  label: string;
  items: DropdownItem[];
  onSelect: (v: string) => void;
  menuClass?: string;
  buttonClass?: string;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ left: number; top: number } | null>(null);

  // keep mounted while animating so transitions can run
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
    } else {
      // allow transition to finish before unmounting
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  function handleBlur(e: React.FocusEvent) {
    const related = e.relatedTarget as Node | null;
    if (!rootRef.current) return;
    if (!related || !rootRef.current.contains(related)) {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) {
      setMenuPos(null);
      return;
    }

    let raf = 0;
    function compute() {
      const btn = buttonRef.current;
      const menu = menuRef.current;
      if (!btn || !menu) return;
      const btnRect = btn.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Horizontal: clamp left so menu stays inside viewport
      let left = btnRect.left;
      if (left + menuRect.width > vw) left = Math.max(12, vw - menuRect.width - 12);
      if (left < 12) left = 12;

      // Vertical: below if fits, otherwise above
      let top = btnRect.bottom;
      if (btnRect.bottom + menuRect.height > vh) {
        top = Math.max(4, btnRect.top - menuRect.height);
      }

      setMenuPos({ left: Math.round(left), top: Math.round(top) });
    }

    raf = requestAnimationFrame(compute);

    const onResize = () => {
      if (!open) return;
      compute();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open]);

  return (
    <>
      {/* overlay: always in DOM while mounted so it can fade out */}
      {mounted && (
        <div
          aria-hidden={!open}
          className={cn(
            "fixed inset-0 z-40 duration-200 transition ease-in-out",
            open ? "pointer-events-auto backdrop-blur-xl" : "opacity-0 pointer-events-none"
          )}
          style={{ background: "rgba(0,0,0,0.35)" }}
        />
      )}

      <div
        className="relative inline-block"
        ref={rootRef}
        tabIndex={-1}
        onBlur={handleBlur}
        style={open ? { zIndex: 51 } : {}}
      >
        <button
          aria-haspopup="menu"
          aria-expanded={open}
          ref={buttonRef}
          onClick={() => setOpen((v) => !v)}
          className={buttonClass ?? "relative flex bg-zinc-300/10 text-sm text-zinc-200 not-hover:text-zinc-100/45 transition active:scale-105 border border-transparent active:border-zinc-300/45 py-1 px-4 rounded-full"}
        >
          {label}
        </button>

        {/* menu container: mounted while `mounted` true so it can animate out */}
        {mounted && (
          <div
            ref={menuRef}
            role="menu"
            aria-hidden={!open}
            style={
              menuPos
                ? { position: "fixed", left: menuPos.left, top: menuPos.top, zIndex: 50 }
                : undefined
            }
            className={cn(
              // base sizing & option to override via props
              menuClass ?? "absolute left-0 mt-2 w-40",
              // animation helpers (fade + slide)
              "transform-gpu transition-all duration-200 will-change-transform",
              open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
            )}
          >
            <div className="flex flex-col bg-zinc-300/10 rounded-md overflow-hidden shadow-lg">
              {items.map((it) => (
                <button
                  key={it.value}
                  onClick={() => {
                    onSelect(it.value);
                    setOpen(false);
                  }}
                  className="px-3 py-2 text-left hover:bg-zinc-500/20 active:bg-zinc-500/30 transition"
                >
                  {it.label ?? it.value}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
