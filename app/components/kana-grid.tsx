// components/KanaGrid.tsx
import type { Kana } from 'public/data/kana';
import React, { useMemo, useState } from 'react';
import KanaCard from './kana-card';

type Props = {
  items: Kana[];
  filters: Record<string, boolean>;
  playSound: boolean;
  onOpenStroke: (img?: string) => void;
};

export default function KanaGrid({ items, filters, playSound, onOpenStroke }: Props) {
  const filtered = useMemo(() => items.filter(i => filters[i.type]), [items, filters]);

  if (filtered.length === 0) {
    return <div className="p-6 text-center text-gray-500">No kana selected.</div>;
  }

  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {filtered.map(k => (
        <KanaCard key={k.id} item={k} playSound={playSound} onOpenStroke={onOpenStroke} />
      ))}
    </div>
  );
}
