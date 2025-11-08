// components/KanaCard.tsx
import React, { useState } from 'react';
import type { Kana } from '../../public/data/kana';

type Props = {
  item: Kana;
  playSound: boolean;
  onOpenStroke?: (img?: string) => void;
};

export default function KanaCard({ item, playSound, onOpenStroke }: Props) {
  const [showRoman, setShowRoman] = useState(false);
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  function checkAnswer() {
    const clean = typed.trim().toLowerCase();
    setResult(clean === item.roman.toLowerCase() ? 'correct' : 'wrong');
  }

  function play() {
    if (!playSound || !item.audio) return;
    const a = new Audio(item.audio);
    a.play().catch(() => { /* ignore playback errors */ });
  }

  return (
    <div
      className="p-3 border rounded text-center hover:shadow cursor-pointer"
      onMouseEnter={() => setShowRoman(true)}
      onMouseLeave={() => setShowRoman(false)}
    >
      <div className="text-3xl font-medium">{item.char}</div>

      {showRoman && (
        <div className="text-sm mt-1 select-none">{item.roman}</div>
      )}

      <div className="mt-2 flex gap-2 justify-center">
        <input
          className="border px-2 py-1 rounded w-28 text-center"
          value={typed}
          onChange={(e) => { setTyped(e.target.value); setResult(null); }}
          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
          placeholder="type roman"
        />
        <button onClick={checkAnswer} className="btn">Check</button>
      </div>

      <div className="mt-2 flex gap-2 justify-center">
        {item.audio && <button onClick={play} className="btn-sm">🔊</button>}
        {item.strokeImage && <button onClick={() => onOpenStroke?.(item.strokeImage)} className="btn-sm">✍️</button>}
      </div>

      {result && (
        <div className={`mt-2 text-sm ${result === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
          {result === 'correct' ? 'Correct' : `Wrong — ${item.roman}`}
        </div>
      )}
    </div>
  );
}
