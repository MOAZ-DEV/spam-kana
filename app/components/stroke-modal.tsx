// components/StrokeModal.tsx
import React from 'react';

type Props = { src?: string; onClose: () => void; open: boolean };

export default function StrokeModal({ src, onClose, open }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-4 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Stroke order</h3>
          <button onClick={onClose} className="btn-sm">Close</button>
        </div>
        {src ? (
          // allow browser to scale image
          <img src={src} alt="stroke order" className="w-full h-auto" />
        ) : (
          <div className="p-8 text-center text-gray-500">No stroke image available.</div>
        )}
      </div>
    </div>
  );
}
