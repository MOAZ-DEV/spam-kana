// components/Controls.tsx
import React from 'react';

type Props = {
  onToggleType: (type: string, checked: boolean) => void;
  onCheckAll: () => void;
  onUncheckAll: () => void;
  playSound: boolean;
  setPlaySound: (v: boolean) => void;
  onShowStroke: (kanaId?: string) => void;
  selectedTypes: Record<string, boolean>;
};

export default function Controls({
  onToggleType,
  onCheckAll,
  onUncheckAll,
  playSound,
  setPlaySound,
  onShowStroke,
  selectedTypes,
}: Props) {
  return (
    <section className="p-4 border-b">
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <button onClick={onCheckAll} className="btn">check all</button>
          <button onClick={onUncheckAll} className="btn-outline">uncheck all</button>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={playSound}
            onChange={(e) => setPlaySound(e.target.checked)}
          />
          Play sound
        </label>

        <div className="flex gap-3 items-center">
          {Object.keys(selectedTypes).map((t) => (
            <label key={t} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedTypes[t]}
                onChange={(e) => onToggleType(t, e.target.checked)}
              />
              <span className="capitalize">{t}</span>
            </label>
          ))}
        </div>

        <button onClick={() => onShowStroke()} className="ml-auto btn">
          Stroke order
        </button>
      </div>
    </section>
  );
}
