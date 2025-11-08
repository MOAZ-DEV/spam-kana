import { cn } from "lib/utils";

interface IconButtonProps {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  className?: string;
  ariaHasPopup?: boolean;
  ariaExpanded?: boolean;
}

export function IconButton({
  label,
  pressed,
  onClick,
  className,
  ariaHasPopup,
  ariaExpanded,
}: IconButtonProps) {
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