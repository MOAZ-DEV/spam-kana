import React, { useEffect, useRef, useState } from "react";

/**
 * KanaBorderProgress
 *
 * Props:
 * - percent (number) optional initial percent (0-100)
 * - thickness (number) ring thickness in px
 * - size classes: pass Tailwind width/height classes or let wrapper control it
 * - children: the inner content (your original div)
 *
 * Methods returned via ref or use callbacks:
 * - onCorrect({ difficulty?, attempts? }) -> increases target percent pragmatically
 * - onWrong() -> optional small penalty or no change
 * - forceComplete() -> set progress to 100 (if you need)
 *
 * Usage: <KanaBorderProgress ref={ref}>{...your content...}</KanaBorderProgress>
 */

type KanaBorderProgressProps = {
  percent?: number;
  thickness?: number;
  children?: React.ReactNode;
};

export default function KanaBorderProgress({
  percent: initial = 0,
  thickness = 6,
  children,
}: KanaBorderProgressProps) {
  // displayedPercent is what we animate visually
  const [displayed, setDisplayed] = useState(Math.max(0, Math.min(100, initial)));
  const targetRef = useRef(displayed);
  const rafRef = useRef<number | null>(null);

  // smoothing params
  const SMOOTH_SPEED = 0.12; // how fast displayed moves toward target (0..1) per frame influence
  const MIN_STEP = 0.15; // minimum percent step per frame
  const FRAME_MS = 1000 / 60;

  // progression rule params (practical, tweakable)
  const baseGain = 18; // base percent *before diminishing*
  const maxGainPerAnswer = 30; // hard cap per answer
  const requiredFinishThreshold = 98; // only allow 100 when reaching threshold or forceComplete called
  const wrongPenalty = 0; // you can set small penalty like -2 if you want

  // internal flag: allow direct 100 only via forceComplete
  const allowInstant100Ref = useRef(false);

  // animate loop: ease displayed -> target
  useEffect(() => {
    function step() {
      const target = targetRef.current;
      if (Math.abs(displayed - target) < 0.01) {
        rafRef.current = null;
        return;
      }

      // exponential-like ease: move a fraction toward target
      let diff = target - displayed;
      let stepAmount = diff * SMOOTH_SPEED;

      // ensure min step so it doesn't stall
      if (Math.abs(stepAmount) < MIN_STEP) {
        stepAmount = Math.sign(diff) * Math.min(Math.abs(diff), MIN_STEP);
      }

      // update displayed
      setDisplayed((prev) => {
        let next = prev + stepAmount;
        // clamp
        if (diff > 0) next = Math.min(next, target);
        else next = Math.max(next, target);
        return +next.toFixed(3);
      });

      rafRef.current = requestAnimationFrame(step);
    }

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(step);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed]); // loop depends on displayed so it continues until reached

  // helpers to manipulate the target percent (call from your quiz logic)
  function setTarget(newTarget: number) {
    const clamped = Math.max(0, Math.min(100, newTarget));
    targetRef.current = clamped;
    // kick animation if needed
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => setDisplayed((d) => d)); // start loop
    }
  }

  // Practical increment algorithm for a correct answer
  // - difficulty: 0..1 (optional) -> scales gain
  // - attempts: number of attempts user used on this question (1 first try, 2 second, ...)
  function onCorrect({ difficulty = 0.5, attempts = 1 } = {}) {
    const current = Math.min(100, Math.max(0, targetRef.current));
    // scaled base: harder questions give more reward
    const scaledBase = baseGain * (0.5 + difficulty * 0.75); // range ~0.5..1.25
    // penalize repeated attempts: first try yields more
    const attemptPenalty = 1 / Math.max(1, attempts); // 1 for first try, 0.5 for second, etc.
    // diminishing returns as you approach 100
    const diminishing = 1 - current / 100; // goes to 0 near 100
    let gain = scaledBase * attemptPenalty * diminishing;

    // clamp min and max per answer
    gain = Math.max(3, Math.min(maxGainPerAnswer, gain)); // always at least small progress
    let newTarget = current + gain;

    // don't allow a single answer to produce 100% unless user legitimately finished:
    if (!allowInstant100Ref.current && newTarget >= 100) {
      newTarget = requiredFinishThreshold; // move to near-complete but not full
    }

    setTarget(newTarget);
    return newTarget;
  }

  function onWrong() {
    // optional: slight decay or no change
    const current = Math.min(100, Math.max(0, targetRef.current));
    const newTarget = Math.max(0, current - wrongPenalty);
    setTarget(newTarget);
    return newTarget;
  }

  function forceComplete() {
    allowInstant100Ref.current = true;
    setTarget(100);
  }

  // expose small API on the DOM node via ref if user wants (not required)
  // If you want to call these from parent, you can forwardRef; for simplicity we'll return them from a ref prop pattern:
  // Example usage: pass a callback ref to get the API:
  // <KanaBorderProgress ref={(api)=> (myRef = api)} />
  // but here we'll attach to a data attribute for simplicity.
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // attach api for quick access (optional)
    if (wrapperRef.current) {
      // cast to any to allow attaching a custom property on the DOM element
      (wrapperRef.current as any)._progressApi = { onCorrect, onWrong, forceComplete, getTarget: () => targetRef.current };
    }
  }, []);

  // Visual: outer wrapper with conic-gradient ring enforced by --p var
  // We update the inline style --p via displayed state so gradient changes per-frame
  const ringStyle = {
    // percent variable used by gradient
    "--p": `${displayed}`,
    padding: `${thickness}px`,
    background:
      "conic-gradient(var(--ring, #3b82f6) calc(var(--p) * 1%), rgba(0,0,0,0) 0)",
    borderRadius: "var(--r, 0.75rem)", // preserve rounded-xl look
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full aspect-square"
      style={ringStyle}
      aria-hidden={false}
    >
      <div
        className="relative flex flex-col items-center justify-center w-full h-full rounded-xl text-zinc-200 backdrop-blur-2xl"
        role="region"
        aria-label="Kana display"
        style={{
          // inner background to look like original: make it transparent so ring is only border
          background: "rgba(0,0,0,0.35)",
          inset: 0,
          borderRadius: "inherit",
        }}
      >
        {/* Keep children inside */}
        {children}

        {/* Optional small percent label for debugging */}
        <div className="absolute right-2 top-2 text-xs text-zinc-300 select-none pointer-events-none">
          {Math.round(displayed)}%
        </div>
      </div>
    </div>
  );
}
